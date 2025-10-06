<?php

namespace App\Http\Controllers\Api\V1\Supervision;

use App\Http\Controllers\Controller;
use App\Models\Academician;
use App\Models\Connection;
use App\Models\FieldOfResearch;
use App\Models\NicheDomain;
use App\Models\PotentialSupervisor;
use App\Models\ResearchArea;
use App\Models\SupervisionRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RecommendationController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Resolve research expertise IDs to domain names
     */
    protected function resolveDomainNames(array $expertiseIds): array
    {
        $domains = [];
        
        foreach ($expertiseIds as $id) {
            // Parse the ID format: "field_id-area_id-domain_id"
            $parts = explode('-', $id);
            if (count($parts) === 3) {
                $domainId = $parts[2];
                
                $domain = NicheDomain::find($domainId);
                
                if ($domain) {
                    $domains[] = $domain->name;
                }
            }
        }
        
        return $domains;
    }

    /**
     * Get supervisor's academician connections for recommendations
     */
    public function getSupervisorConnections(Request $request)
    {
        $user = $request->user();

        if (!$user->academician) {
            abort(403, 'Only academicians can access this resource.');
        }

        // Get all accepted connections who are academicians
        $connections = $user->getFriends();
        
        $academicians = $connections
            ->filter(fn($connectedUser) => $connectedUser->academician !== null)
            ->map(function ($connectedUser) {
                $academician = $connectedUser->academician;
                
                // Resolve research expertise IDs to names
                $expertiseNames = [];
                if ($academician->research_expertise && is_array($academician->research_expertise)) {
                    $expertiseNames = $this->resolveDomainNames(array_slice($academician->research_expertise, 0, 3));
                }
                
                return [
                    'id' => $academician->academician_id,
                    'name' => $academician->full_name,
                    'expertise' => !empty($expertiseNames) 
                        ? implode(', ', $expertiseNames)
                        : 'Research expertise not specified',
                    'department' => $academician->department,
                    'university' => $academician->universityDetails?->full_name ?? null,
                    // Use faculty relationship if available, otherwise fall back to department field
                    'faculty' => $academician->faculty?->name ?? $academician->department ?? null,
                    'profile_picture' => $academician->profile_picture,
                    'verified' => (bool) $academician->verified,
                    'is_connection' => true,
                ];
            })
            ->values();

        return response()->json([
            'data' => $academicians,
        ]);
    }

    /**
     * Search all academicians for recommendations
     */
    public function searchAcademicians(Request $request)
    {
        $user = $request->user();

        if (!$user->academician) {
            abort(403, 'Only academicians can access this resource.');
        }

        $query = $request->input('q', '');
        $limit = $request->input('limit', 50); // Increased from 20 to 50
        $onlyVerified = $request->input('verified_only', false); // Optional filter

        $academicians = Academician::query()
            ->with(['universityDetails', 'faculty'])
            ->where('academician_id', '!=', $user->academician->academician_id) // Exclude self
            ->when($onlyVerified, function ($q) {
                $q->where('verified', true); // Only apply if explicitly requested
            })
            // Profile completeness filters
            ->whereNotNull('bio') // Must have bio
            ->whereNotNull('research_expertise') // Must have research expertise
            ->where(function ($q) {
                $q->whereNotNull('profile_picture')
                    ->where('profile_picture', '!=', 'profile_pictures/default.jpg');
            }) // Must have custom profile picture (not default)
            ->when($query, function ($q) use ($query) {
                $q->where(function ($subQuery) use ($query) {
                    // Use DB::raw for case-insensitive search across different database systems
                    $subQuery->whereRaw('LOWER(full_name) LIKE ?', ['%' . strtolower($query) . '%'])
                        ->orWhereRaw('LOWER(department) LIKE ?', ['%' . strtolower($query) . '%']);
                    // Removed research_expertise LIKE search as it's ineffective on JSON field
                });
            })
            ->orderByRaw('verified DESC') // Verified academicians first
            ->orderBy('full_name', 'asc')
            ->limit($limit)
            ->get()
            ->map(function ($academician) use ($user) {
                // Check if this academician is a connection
                $isConnection = Connection::where(function ($q) use ($user, $academician) {
                    $q->where('requester_id', $user->id)
                        ->where('recipient_id', $academician->user?->id);
                })
                ->orWhere(function ($q) use ($user, $academician) {
                    $q->where('recipient_id', $user->id)
                        ->where('requester_id', $academician->user?->id);
                })
                ->where('status', 'accepted')
                ->exists();

                // Resolve research expertise IDs to names
                $expertiseNames = [];
                if ($academician->research_expertise && is_array($academician->research_expertise)) {
                    $expertiseNames = $this->resolveDomainNames(array_slice($academician->research_expertise, 0, 3));
                }

                return [
                    'id' => $academician->academician_id,
                    'name' => $academician->full_name,
                    'expertise' => !empty($expertiseNames) 
                        ? implode(', ', $expertiseNames)
                        : 'Research expertise not specified',
                    'department' => $academician->department,
                    'university' => $academician->universityDetails?->full_name ?? null,
                    // Use faculty relationship if available, otherwise fall back to department field
                    'faculty' => $academician->faculty?->name ?? $academician->department ?? null,
                    'profile_picture' => $academician->profile_picture,
                    'is_connection' => $isConnection,
                    'verified' => (bool) $academician->verified, // Include verification status
                ];
            });

        return response()->json([
            'data' => $academicians,
        ]);
    }

    /**
     * Bulk add recommended supervisors to student's shortlist
     */
    public function addRecommendationsToShortlist(Request $request)
    {
        $user = $request->user();

        if (!$user->postgraduate) {
            abort(403, 'Only postgraduate students can add to shortlist.');
        }

        $data = $request->validate([
            'request_id' => ['required', 'exists:supervision_requests,id'],
            'academician_ids' => ['required', 'array', 'min:1'],
            'academician_ids.*' => ['required', 'string'],
        ]);

        $supervisionRequest = SupervisionRequest::findOrFail($data['request_id']);

        // Verify this is the student's request
        if ($supervisionRequest->student_id !== $user->postgraduate->postgraduate_id) {
            abort(403, 'You can only add recommendations from your own requests.');
        }

        $added = [];
        $alreadyAdded = [];

        foreach ($data['academician_ids'] as $academicianId) {
            // Check if already in shortlist
            $exists = PotentialSupervisor::where('student_id', $user->postgraduate->postgraduate_id)
                ->where('academician_id', $academicianId)
                ->exists();

            if ($exists) {
                $alreadyAdded[] = $academicianId;
                continue;
            }

            // Verify academician exists
            $academician = Academician::where('academician_id', $academicianId)->first();
            if (!$academician) {
                continue;
            }

            // Add to potential supervisors
            PotentialSupervisor::create([
                'student_id' => $user->postgraduate->postgraduate_id,
                'academician_id' => $academicianId,
                'postgraduate_program_id' => $supervisionRequest->postgraduate_program_id,
            ]);

            $added[] = $academicianId;
        }

        return response()->json([
            'success' => true,
            'message' => count($added) > 0 
                ? (count($added) . ' supervisor(s) added to your shortlist') 
                : 'All supervisors were already in your shortlist',
            'data' => [
                'added_count' => count($added),
                'already_added_count' => count($alreadyAdded),
                'added_ids' => $added,
                'already_added_ids' => $alreadyAdded,
            ],
        ]);
    }

    /**
     * Get recommended supervisors from a rejected request
     */
    public function getRecommendedSupervisors(Request $request, SupervisionRequest $supervisionRequest)
    {
        $user = $request->user();

        if (!$user->postgraduate) {
            abort(403, 'Only postgraduate students can view recommendations.');
        }

        if ($supervisionRequest->student_id !== $user->postgraduate->postgraduate_id) {
            abort(403, 'You can only view your own request recommendations.');
        }

        if (!$supervisionRequest->recommended_supervisors || !is_array($supervisionRequest->recommended_supervisors)) {
            return response()->json([
                'data' => [],
            ]);
        }

        $academicians = Academician::with(['universityDetails', 'faculty'])
            ->whereIn('academician_id', $supervisionRequest->recommended_supervisors)
            ->get()
            ->map(function ($academician) use ($user) {
                // Check if already in shortlist
                $inShortlist = PotentialSupervisor::where('student_id', $user->postgraduate->postgraduate_id)
                    ->where('academician_id', $academician->academician_id)
                    ->exists();

                // Resolve research expertise IDs to names
                $expertiseNames = [];
                if ($academician->research_expertise && is_array($academician->research_expertise)) {
                    $expertiseNames = $this->resolveDomainNames(array_slice($academician->research_expertise, 0, 3));
                }

                return [
                    'id' => $academician->academician_id,
                    'name' => $academician->full_name,
                    'expertise' => !empty($expertiseNames) 
                        ? implode(', ', $expertiseNames)
                        : 'Research expertise not specified',
                    'department' => $academician->department,
                    'university' => $academician->universityDetails?->full_name ?? null,
                    // Use faculty relationship if available, otherwise fall back to department field
                    'faculty' => $academician->faculty?->name ?? $academician->department ?? null,
                    'profile_picture' => $academician->profile_picture,
                    'url' => $academician->url,
                    'verified' => (bool) $academician->verified,
                    'in_shortlist' => $inShortlist,
                ];
            });

        return response()->json([
            'data' => $academicians,
            'supervisor_name' => $supervisionRequest->academician?->full_name,
            'suggested_keywords' => $supervisionRequest->suggested_keywords,
        ]);
    }
}

