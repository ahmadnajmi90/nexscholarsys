<?php

namespace App\Http\Controllers\Api\V1\Supervision;

use App\Http\Controllers\Controller;
use App\Models\SupervisionMeeting;
use App\Models\SupervisionRequest;
use App\Models\SupervisionTimeline;
use App\Models\SupervisionRelationshipUnbindRequest;
use App\Models\CoSupervisorInvitation;
use App\Models\SupervisionRelationship;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class ActivityFeedController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Get recent activity feed for the authenticated user
     */
    public function recentActivity(Request $request)
    {
        $user = $request->user();
        $activities = collect();

        // For students
        if ($user->postgraduate) {
            $studentId = $user->postgraduate->postgraduate_id;

            // Get recent request status changes
            $recentRequests = SupervisionRequest::with('academician')
                ->where('student_id', $studentId)
                ->whereNotNull('decision_at')
                ->where('decision_at', '>=', now()->subDays(7))
                ->orderByDesc('decision_at')
                ->limit(5)
                ->get();

            foreach ($recentRequests as $req) {
                if ($req->status === SupervisionRequest::STATUS_REJECTED) {
                    $activities->push([
                        'id' => "request_rejected_{$req->id}",
                        'type' => 'request_rejected',
                        'description' => "{$req->academician->full_name} declined your request",
                        'actor_name' => $req->academician->full_name,
                        'related_id' => $req->id,
                        'related_type' => 'supervision_request',
                        'created_at' => $req->decision_at,
                    ]);
                } elseif ($req->status === SupervisionRequest::STATUS_PENDING_STUDENT_ACCEPTANCE) {
                    $activities->push([
                        'id' => "request_accepted_{$req->id}",
                        'type' => 'request_accepted',
                        'description' => "{$req->academician->full_name} sent you an offer",
                        'actor_name' => $req->academician->full_name,
                        'related_id' => $req->id,
                        'related_type' => 'supervision_request',
                        'created_at' => $req->decision_at,
                    ]);
                }
            }

            // Get recent meetings (scheduled) - show all including soft-deleted (cancelled)
            $recentMeetings = SupervisionMeeting::withTrashed()
                ->with(['relationship.academician', 'request.academician'])
                ->where(function ($q) use ($studentId) {
                    $q->whereHas('relationship', fn($rel) => $rel->where('student_id', $studentId))
                      ->orWhereHas('request', fn($req) => $req->where('student_id', $studentId));
                })
                ->where('created_at', '>=', now()->subDays(7))
                ->orderByDesc('created_at')
                ->limit(5)
                ->get();

            foreach ($recentMeetings as $meeting) {
                $supervisor = $meeting->relationship?->academician ?? $meeting->request?->academician;
                if ($supervisor) {
                    $activities->push([
                        'id' => "meeting_scheduled_{$meeting->id}",
                        'type' => 'meeting_scheduled',
                        'description' => "Meeting scheduled with {$supervisor->full_name}",
                        'actor_name' => $supervisor->full_name,
                        'related_id' => $meeting->id,
                        'related_type' => 'supervision_meeting',
                        'created_at' => $meeting->created_at,
                    ]);
                }
            }

            // Get recently updated meetings (rescheduled) - show all including soft-deleted (cancelled)
            $rescheduledMeetings = SupervisionMeeting::withTrashed()
                ->with(['relationship.academician', 'request.academician'])
                ->where(function ($q) use ($studentId) {
                    $q->whereHas('relationship', fn($rel) => $rel->where('student_id', $studentId))
                      ->orWhereHas('request', fn($req) => $req->where('student_id', $studentId));
                })
                ->where('updated_at', '>=', now()->subDays(7))
                ->whereColumn('updated_at', '>', 'created_at')
                ->orderByDesc('updated_at')
                ->limit(5)
                ->get();

            foreach ($rescheduledMeetings as $meeting) {
                $supervisor = $meeting->relationship?->academician ?? $meeting->request?->academician;
                if ($supervisor) {
                    $activities->push([
                        'id' => "meeting_rescheduled_{$meeting->id}",
                        'type' => 'meeting_rescheduled',
                        'description' => "Meeting rescheduled with {$supervisor->full_name}",
                        'actor_name' => $supervisor->full_name,
                        'related_id' => $meeting->id,
                        'related_type' => 'supervision_meeting',
                        'created_at' => $meeting->updated_at,
                    ]);
                }
            }

            // Get recently cancelled meetings (soft-deleted)
            $cancelledMeetings = SupervisionMeeting::onlyTrashed()
                ->with(['relationship.academician', 'request.academician'])
                ->where(function ($q) use ($studentId) {
                    $q->whereHas('relationship', fn($rel) => $rel->where('student_id', $studentId))
                      ->orWhereHas('request', fn($req) => $req->where('student_id', $studentId));
                })
                ->where('deleted_at', '>=', now()->subDays(7))
                ->orderByDesc('deleted_at')
                ->limit(5)
                ->get();

            foreach ($cancelledMeetings as $meeting) {
                $supervisor = $meeting->relationship?->academician ?? $meeting->request?->academician;
                if ($supervisor) {
                    $activities->push([
                        'id' => "meeting_cancelled_{$meeting->id}",
                        'type' => 'meeting_cancelled',
                        'description' => "Meeting cancelled with {$supervisor->full_name}",
                        'actor_name' => $supervisor->full_name,
                        'related_id' => $meeting->id,
                        'related_type' => 'supervision_meeting',
                        'created_at' => $meeting->deleted_at, // Use deleted_at for soft deletes
                    ]);
                }
            }

            // Get recent unbind requests
            $unbindRequests = SupervisionRelationshipUnbindRequest::whereHas('relationship', function ($q) use ($studentId) {
                $q->where('student_id', $studentId);
            })
                ->with(['relationship.academician', 'initiator'])
                ->where('created_at', '>=', now()->subDays(7))
                ->orderByDesc('created_at')
                ->limit(3)
                ->get();

            foreach ($unbindRequests as $unbind) {
                $supervisor = $unbind->relationship->academician;
                if ($unbind->status === 'approved') {
                    $activities->push([
                        'id' => "unbind_approved_{$unbind->id}",
                        'type' => 'unbind_approved',
                        'description' => "Relationship with {$supervisor->full_name} terminated",
                        'actor_name' => $supervisor->full_name,
                        'related_id' => $unbind->id,
                        'related_type' => 'unbind_request',
                        'created_at' => $unbind->responded_at ?? $unbind->created_at,
                    ]);
                } elseif ($unbind->status === 'pending' && $unbind->initiated_by === 'supervisor') {
                    $activities->push([
                        'id' => "unbind_pending_{$unbind->id}",
                        'type' => 'unbind_pending',
                        'description' => "{$supervisor->full_name} requested termination",
                        'actor_name' => $supervisor->full_name,
                        'related_id' => $unbind->id,
                        'related_type' => 'unbind_request',
                        'created_at' => $unbind->created_at,
                    ]);
                }
            }

            // Get recent co-supervisor invitations
            $coSupervisorInvitations = CoSupervisorInvitation::whereHas('relationship', function ($q) use ($studentId) {
                $q->where('student_id', $studentId);
            })
                ->with(['cosupervisor', 'relationship.academician'])
                ->whereNull('cancelled_at')
                ->where('created_at', '>=', now()->subDays(7))
                ->orderByDesc('created_at')
                ->limit(3)
                ->get();

            foreach ($coSupervisorInvitations as $invitation) {
                $cosupervisor = $invitation->cosupervisor;
                if ($invitation->completed_at) {
                    $activities->push([
                        'id' => "cosupervisor_added_{$invitation->id}",
                        'type' => 'cosupervisor_added',
                        'description' => "{$cosupervisor->full_name} added as co-supervisor",
                        'actor_name' => $cosupervisor->full_name,
                        'related_id' => $invitation->id,
                        'related_type' => 'cosupervisor_invitation',
                        'created_at' => $invitation->completed_at,
                    ]);
                } elseif ($invitation->cosupervisor_status === 'accepted' && $invitation->approver_status === 'pending') {
                    $activities->push([
                        'id' => "cosupervisor_pending_approval_{$invitation->id}",
                        'type' => 'cosupervisor_pending_approval',
                        'description' => "{$cosupervisor->full_name} accepted co-supervisor invitation",
                        'actor_name' => $cosupervisor->full_name,
                        'related_id' => $invitation->id,
                        'related_type' => 'cosupervisor_invitation',
                        'created_at' => $invitation->cosupervisor_responded_at,
                    ]);
                }
            }
        }

        // For supervisors
        if ($user->academician) {
            $academicianId = $user->academician->academician_id;

            // Get recent new requests
            $newRequests = SupervisionRequest::with('student')
                ->where('academician_id', $academicianId)
                ->where('submitted_at', '>=', now()->subDays(7))
                ->orderByDesc('submitted_at')
                ->limit(5)
                ->get();

            foreach ($newRequests as $req) {
                if ($req->status === SupervisionRequest::STATUS_PENDING) {
                    $activities->push([
                        'id' => "request_submitted_{$req->id}",
                        'type' => 'request_submitted',
                        'description' => "{$req->student->full_name} submitted a new request",
                        'actor_name' => $req->student->full_name,
                        'related_id' => $req->id,
                        'related_type' => 'supervision_request',
                        'created_at' => $req->submitted_at,
                    ]);
                } elseif ($req->status === SupervisionRequest::STATUS_ACCEPTED) {
                    $activities->push([
                        'id' => "offer_accepted_{$req->id}",
                        'type' => 'offer_accepted',
                        'description' => "{$req->student->full_name} accepted your offer",
                        'actor_name' => $req->student->full_name,
                        'related_id' => $req->id,
                        'related_type' => 'supervision_request',
                        'created_at' => $req->decision_at,
                    ]);
                }
            }

            // Get recent meetings (scheduled) - show all including soft-deleted (cancelled)
            $recentMeetings = SupervisionMeeting::withTrashed()
                ->with(['relationship.student', 'request.student'])
                ->where(function ($q) use ($academicianId) {
                    $q->whereHas('relationship', fn($rel) => $rel->where('academician_id', $academicianId))
                      ->orWhereHas('request', fn($req) => $req->where('academician_id', $academicianId));
                })
                ->where('created_at', '>=', now()->subDays(7))
                ->orderByDesc('created_at')
                ->limit(5)
                ->get();

            foreach ($recentMeetings as $meeting) {
                $student = $meeting->relationship?->student ?? $meeting->request?->student;
                if ($student) {
                    $activities->push([
                        'id' => "meeting_scheduled_{$meeting->id}",
                        'type' => 'meeting_scheduled',
                        'description' => "Meeting scheduled with {$student->full_name}",
                        'actor_name' => $student->full_name,
                        'related_id' => $meeting->id,
                        'related_type' => 'supervision_meeting',
                        'created_at' => $meeting->created_at,
                    ]);
                }
            }

            // Get recently updated meetings (rescheduled) - show all including soft-deleted (cancelled)
            $rescheduledMeetings = SupervisionMeeting::withTrashed()
                ->with(['relationship.student', 'request.student'])
                ->where(function ($q) use ($academicianId) {
                    $q->whereHas('relationship', fn($rel) => $rel->where('academician_id', $academicianId))
                      ->orWhereHas('request', fn($req) => $req->where('academician_id', $academicianId));
                })
                ->where('updated_at', '>=', now()->subDays(7))
                ->whereColumn('updated_at', '>', 'created_at')
                ->orderByDesc('updated_at')
                ->limit(5)
                ->get();

            foreach ($rescheduledMeetings as $meeting) {
                $student = $meeting->relationship?->student ?? $meeting->request?->student;
                if ($student) {
                    $activities->push([
                        'id' => "meeting_rescheduled_{$meeting->id}",
                        'type' => 'meeting_rescheduled',
                        'description' => "Meeting rescheduled with {$student->full_name}",
                        'actor_name' => $student->full_name,
                        'related_id' => $meeting->id,
                        'related_type' => 'supervision_meeting',
                        'created_at' => $meeting->updated_at,
                    ]);
                }
            }

            // Get recently cancelled meetings (soft-deleted)
            $cancelledMeetings = SupervisionMeeting::onlyTrashed()
                ->with(['relationship.student', 'request.student'])
                ->where(function ($q) use ($academicianId) {
                    $q->whereHas('relationship', fn($rel) => $rel->where('academician_id', $academicianId))
                      ->orWhereHas('request', fn($req) => $req->where('academician_id', $academicianId));
                })
                ->where('deleted_at', '>=', now()->subDays(7))
                ->orderByDesc('deleted_at')
                ->limit(5)
                ->get();

            foreach ($cancelledMeetings as $meeting) {
                $student = $meeting->relationship?->student ?? $meeting->request?->student;
                if ($student) {
                    $activities->push([
                        'id' => "meeting_cancelled_{$meeting->id}",
                        'type' => 'meeting_cancelled',
                        'description' => "Meeting cancelled with {$student->full_name}",
                        'actor_name' => $student->full_name,
                        'related_id' => $meeting->id,
                        'related_type' => 'supervision_meeting',
                        'created_at' => $meeting->deleted_at, // Use deleted_at for soft deletes
                    ]);
                }
            }

            // Get recent unbind requests
            $unbindRequests = SupervisionRelationshipUnbindRequest::whereHas('relationship', function ($q) use ($academicianId) {
                $q->where('academician_id', $academicianId);
            })
                ->with(['relationship.student', 'initiator'])
                ->where('created_at', '>=', now()->subDays(7))
                ->orderByDesc('created_at')
                ->limit(3)
                ->get();

            foreach ($unbindRequests as $unbind) {
                $student = $unbind->relationship->student;
                if ($unbind->status === 'approved') {
                    $activities->push([
                        'id' => "unbind_approved_{$unbind->id}",
                        'type' => 'unbind_approved',
                        'description' => "Relationship with {$student->full_name} terminated",
                        'actor_name' => $student->full_name,
                        'related_id' => $unbind->id,
                        'related_type' => 'unbind_request',
                        'created_at' => $unbind->responded_at ?? $unbind->created_at,
                    ]);
                } elseif ($unbind->status === 'pending' && $unbind->initiated_by === 'student') {
                    $activities->push([
                        'id' => "unbind_pending_{$unbind->id}",
                        'type' => 'unbind_pending',
                        'description' => "{$student->full_name} requested termination",
                        'actor_name' => $student->full_name,
                        'related_id' => $unbind->id,
                        'related_type' => 'unbind_request',
                        'created_at' => $unbind->created_at,
                    ]);
                }
            }

            // Get recent co-supervisor invitations (both as main supervisor and as co-supervisor)
            $coSupervisorInvitations = CoSupervisorInvitation::where(function ($q) use ($academicianId) {
                // As main supervisor
                $q->whereHas('relationship', function ($rel) use ($academicianId) {
                    $rel->where('academician_id', $academicianId);
                })
                // Or as invited co-supervisor
                ->orWhere('cosupervisor_academician_id', $academicianId);
            })
                ->with(['cosupervisor', 'relationship.student', 'relationship.academician'])
                ->whereNull('cancelled_at')
                ->where('created_at', '>=', now()->subDays(7))
                ->orderByDesc('created_at')
                ->limit(3)
                ->get();

            foreach ($coSupervisorInvitations as $invitation) {
                $student = $invitation->relationship->student;
                $cosupervisor = $invitation->cosupervisor;
                $isCoSupervisor = $invitation->cosupervisor_academician_id === $academicianId;

                if ($invitation->completed_at) {
                    if ($isCoSupervisor) {
                        $activities->push([
                            'id' => "cosupervisor_added_{$invitation->id}",
                            'type' => 'cosupervisor_added',
                            'description' => "Added as co-supervisor for {$student->full_name}",
                            'actor_name' => $student->full_name,
                            'related_id' => $invitation->id,
                            'related_type' => 'cosupervisor_invitation',
                            'created_at' => $invitation->completed_at,
                        ]);
                    } else {
                        $activities->push([
                            'id' => "cosupervisor_added_{$invitation->id}",
                            'type' => 'cosupervisor_added',
                            'description' => "{$cosupervisor->full_name} added as co-supervisor for {$student->full_name}",
                            'actor_name' => $cosupervisor->full_name,
                            'related_id' => $invitation->id,
                            'related_type' => 'cosupervisor_invitation',
                            'created_at' => $invitation->completed_at,
                        ]);
                    }
                } elseif (!$isCoSupervisor && $invitation->cosupervisor_status === 'pending') {
                    $activities->push([
                        'id' => "cosupervisor_invited_{$invitation->id}",
                        'type' => 'cosupervisor_invited',
                        'description' => "Invited {$cosupervisor->full_name} as co-supervisor for {$student->full_name}",
                        'actor_name' => $cosupervisor->full_name,
                        'related_id' => $invitation->id,
                        'related_type' => 'cosupervisor_invitation',
                        'created_at' => $invitation->created_at,
                    ]);
                } elseif ($isCoSupervisor && $invitation->cosupervisor_status === 'pending') {
                    $activities->push([
                        'id' => "cosupervisor_invitation_received_{$invitation->id}",
                        'type' => 'cosupervisor_invitation_received',
                        'description' => "Invited to be co-supervisor for {$student->full_name}",
                        'actor_name' => $student->full_name,
                        'related_id' => $invitation->id,
                        'related_type' => 'cosupervisor_invitation',
                        'created_at' => $invitation->created_at,
                    ]);
                }
            }
        }

        // Sort by date and limit
        $sortedActivities = $activities
            ->sortByDesc('created_at')
            ->take(10)
            ->values();

        return response()->json([
            'data' => $sortedActivities,
        ]);
    }

    /**
     * Get upcoming meetings for the authenticated user
     */
    public function upcomingMeetings(Request $request)
    {
        $user = $request->user();

        $query = SupervisionMeeting::query()
            ->with(['relationship.student', 'relationship.academician', 'request.student', 'request.academician'])
            ->whereNull('cancelled_at')
            ->where('scheduled_for', '>', now())
            ->orderBy('scheduled_for', 'asc')
            ->limit(5);

        // Filter by user role
        if ($user->postgraduate) {
            $query->where(function ($q) use ($user) {
                $q->whereHas('relationship', fn($rel) => 
                    $rel->where('student_id', $user->postgraduate->postgraduate_id)
                )
                ->orWhereHas('request', fn($req) => 
                    $req->where('student_id', $user->postgraduate->postgraduate_id)
                );
            });
        } elseif ($user->academician) {
            $query->where(function ($q) use ($user) {
                $q->whereHas('relationship', fn($rel) => 
                    $rel->where('academician_id', $user->academician->academician_id)
                )
                ->orWhereHas('request', fn($req) => 
                    $req->where('academician_id', $user->academician->academician_id)
                );
            });
        } else {
            return response()->json(['data' => []]);
        }

        $meetings = $query->get()->map(function ($meeting) use ($user) {
            // Determine who the "other person" is
            $isStudent = $user->postgraduate !== null;
            
            if ($meeting->relationship) {
                $otherPerson = $isStudent 
                    ? [
                        'name' => $meeting->relationship->academician->full_name,
                        'role' => 'supervisor',
                        'profile_picture' => $meeting->relationship->academician->profile_picture,
                    ]
                    : [
                        'name' => $meeting->relationship->student->full_name,
                        'role' => 'student',
                        'profile_picture' => $meeting->relationship->student->profile_picture,
                    ];
            } else {
                $otherPerson = $isStudent 
                    ? [
                        'name' => $meeting->request->academician->full_name,
                        'role' => 'supervisor',
                        'profile_picture' => $meeting->request->academician->profile_picture,
                    ]
                    : [
                        'name' => $meeting->request->student->full_name,
                        'role' => 'student',
                        'profile_picture' => $meeting->request->student->profile_picture,
                    ];
            }

            return [
                'id' => $meeting->id,
                'title' => $meeting->title,
                'scheduled_for' => $meeting->scheduled_for,
                'location_link' => $meeting->location_link,
                'location_type' => $meeting->location_link ? 'Online' : 'Physical',
                'agenda' => $meeting->agenda,
                'other_person' => $otherPerson,
                'relationship_id' => $meeting->supervision_relationship_id,
                'request_id' => $meeting->supervision_request_id,
                'external_event_id' => $meeting->external_event_id,
                'external_provider' => $meeting->external_provider,
            ];
        });

        return response()->json([
            'data' => $meetings,
        ]);
    }
}

