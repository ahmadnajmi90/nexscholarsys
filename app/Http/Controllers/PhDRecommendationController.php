<?php

namespace App\Http\Controllers;

use App\Jobs\GeneratePhDRecommendations;
use App\Models\PhDProgram;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Services\SupervisorMatchingService;

class PhDRecommendationController extends Controller
{
    protected $supervisorMatchingService;

    public function __construct(SupervisorMatchingService $supervisorMatchingService)
    {
        $this->supervisorMatchingService = $supervisorMatchingService;
    }
    public function index()
    {
        $user = Auth::user();
        $profile = $user->academician ?? $user->postgraduate ?? $user->undergraduate;

        $cvData = null;
        if ($profile) {
            $cvPath = $profile->CV_file ?? $profile->cv_file ?? null;
            if ($cvPath && Storage::disk('public')->exists($cvPath)) {
                $cvData = [
                    'path' => $cvPath,
                    'name' => basename($cvPath),
                    'size' => Storage::disk('public')->size($cvPath),
                    'uploaded_at' => Storage::disk('public')->lastModified($cvPath),
                ];
            }
        }

        // Fetch recent search history (last 5)
        $history = \DB::table('recommendation_search_histories')
            ->where('user_id', $user->id)
            ->latest('created_at')
            ->limit(5)
            ->get(['search_text', 'profile_hash', 'created_at']);

        return Inertia::render('PhDRecommendations/Index', [
            'existingCv' => $cvData,
            'searchHistory' => $history,
        ]);
    }

    public function analyze(Request $request)
    {
        $validated = $request->validate([
            'cv_file' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
            'use_existing_cv' => 'required|boolean',
            'research_text' => 'required|string|min:50|max:5000',
        ]);

        $user = Auth::user();

        // Determine CV path to use (existing from profile or newly uploaded)
        $profile = $user->academician ?? $user->postgraduate ?? $user->undergraduate;
        $cvPath = null;

        if (!empty($validated['use_existing_cv']) && $profile) {
            $existing = $profile->cv_file ?? $profile->CV_file ?? null;
            if ($existing && \Storage::disk('public')->exists($existing)) {
                $cvPath = $existing;
            }
        } elseif ($request->hasFile('cv_file')) {
            $file = $request->file('cv_file');
            $destination = 'CV_files';
            $fileName = $user->id . '_' . time() . '_' . $file->getClientOriginalName();

            // Delete old CV if it exists
            if ($profile) {
                $old = $profile->cv_file ?? $profile->CV_file ?? null;
                if ($old && \Storage::disk('public')->exists($old)) {
                    \Storage::disk('public')->delete($old);
                }
            }

            // Store and persist
            $cvPath = $file->storeAs($destination, $fileName, 'public');
            if ($profile) {
                $profile->cv_file = $cvPath; // prefer snake_case
                // Maintain backward compatibility if model used CV_file
                $profile->CV_file = $cvPath;
                $profile->save();
                // Invalidate cached insights/vector after CV update
                event(new \App\Events\ProfileDataChanged($user));
            }
        }

        // If still no CV path, reject
        if (!$cvPath) {
            return back()->withErrors(['cv' => 'Please upload a CV or use the existing one.']);
        }

        // Create a unique fingerprint of the inputs
        $cvFullPath = \Storage::disk('public')->path($cvPath);
        $cvHash = @md5_file($cvFullPath) ?: md5($cvPath);
        $profileHash = md5($cvHash . $validated['research_text']);

        // Save search history without duplicates
        \App\Models\RecommendationSearchHistory::updateOrCreate(
            [
                'user_id' => $user->id,
                'search_text' => $validated['research_text'],
            ],
            [
                'profile_hash' => $profileHash,
            ]
        );

        // If results exist for this hash, skip job and go to results
        $latestResultForHash = \App\Models\ProgramRecommendationResult::where('user_id', $user->id)
            ->where('profile_hash', $profileHash)
            ->latest()
            ->first();

        if ($latestResultForHash) {
            // If results are cached, go to the processing page with a special flag.
            return Inertia::render('PhDRecommendations/Processing', [
                'jobKey' => $latestResultForHash->batch_id,
                'isCached' => true,
            ]);
        }

        // No existing results → store file and dispatch background job
        $jobKey = 'phd_rec_job_' . $user->id . '_' . \Illuminate\Support\Str::random(10); // also used as batch_id
        Cache::put($jobKey, ['status' => 'started', 'progress' => 10], now()->addMinutes(60));
        
        GeneratePhDRecommendations::dispatch($user->id, $cvPath, $validated['research_text'], $jobKey, $profileHash);
        
        return Inertia::render('PhDRecommendations/Processing', [
            'jobKey' => $jobKey,
        ]);
    }

    public function status(string $jobId)
    {
        $status = Cache::get($jobId, ['status' => 'unknown', 'progress' => 0]);
        return response()->json($status);
    }

    public function results()
    {
        $user = auth()->user();

        $latestBatchId = \App\Models\ProgramRecommendationResult::where('user_id', $user->id)
            ->latest('created_at')
            ->value('batch_id');    

        if ($latestBatchId) {
            $recommendations = \App\Models\ProgramRecommendationResult::where('batch_id', $latestBatchId)
                ->with([
                    'phdProgram' => function ($query) {
                        $query->withCount('academicians as supervisors_count');
                    },
                    'phdProgram.university',
                    'phdProgram.faculty'
                ])
                ->orderBy('match_score', 'desc')
                ->get();
        } else {
            $recommendations = collect();
        }
        
        return Inertia::render('PhDRecommendations/Results', [
            'recommendations' => $recommendations,
        ]);
    }

    public function showSupervisors(PhDProgram $program)
    {
        $user = Auth::user();
        
        // 1. All the complex logic is now handled by the dedicated service.
        $supervisors = $this->supervisorMatchingService->rankSupervisorsForProgram($program, $user);

        // 2. Load the program's relationships for the header display
        $program->load('university', 'faculty');

        // 3. Render the view, passing the clean data from the service.
        return Inertia::render('PhDRecommendations/Results', [
            'selectedProgram' => $program, 
            'supervisors' => $supervisors,
        ]);
    }
}

