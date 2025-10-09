<?php

namespace App\Http\Controllers\Api\V1\Supervision;

use App\Http\Controllers\Controller;
use App\Models\CoSupervisorInvitation;
use App\Models\SupervisionRelationship;
use App\Services\Supervision\CoSupervisorService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CoSupervisorController extends Controller
{
    protected $coSupervisorService;

    public function __construct(CoSupervisorService $coSupervisorService)
    {
        $this->coSupervisorService = $coSupervisorService;
    }

    /**
     * Initiate a co-supervisor invitation
     */
    public function invite(Request $request, SupervisionRelationship $relationship)
    {
        try {
            $request->validate([
                'cosupervisor_academician_id' => 'required|string|exists:academicians,academician_id',
                'invitation_message' => 'nullable|string|max:1000',
            ]);

            $user = $request->user();

            // Determine who is initiating
            if ($relationship->student->postgraduate_id === $user->unique_id) {
                $initiatedBy = 'student';
            } elseif ($relationship->academician->academician_id === $user->unique_id) {
                $initiatedBy = 'main_supervisor';
            } else {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $invitation = $this->coSupervisorService->initiateInvitation(
                $relationship,
                $request->cosupervisor_academician_id,
                $initiatedBy,
                $request->invitation_message
            );

            return response()->json([
                'message' => 'Co-supervisor invitation sent successfully',
                'invitation' => $invitation->load(['relationship.student', 'relationship.academician', 'cosupervisor.user'])
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error sending co-supervisor invitation: ' . $e->getMessage());
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    /**
     * Co-supervisor responds to invitation
     */
    public function respond(Request $request, CoSupervisorInvitation $invitation)
    {
        try {
            $request->validate([
                'response' => 'required|in:accepted,rejected',
                'rejection_reason' => 'required_if:response,rejected|nullable|string|max:500',
            ]);

            $user = $request->user();

            // Check if user is the co-supervisor
            if ($invitation->cosupervisor->academician_id !== $user->unique_id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $invitation = $this->coSupervisorService->cosupervisorRespond(
                $invitation,
                $request->response,
                $request->rejection_reason
            );

            return response()->json([
                'message' => 'Response recorded successfully',
                'invitation' => $invitation->load([
                    'relationship.student.user',
                    'relationship.student.universityDetails',
                    'relationship.student.faculty',
                    'relationship.academician.user',
                    'relationship.academician.universityDetails',
                    'relationship.academician.faculty',
                    'cosupervisor.user',
                    'cosupervisor.universityDetails',
                    'cosupervisor.faculty'
                ])
            ]);
        } catch (\Exception $e) {
            Log::error('Error responding to co-supervisor invitation: ' . $e->getMessage());
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    /**
     * Approver responds to invitation (after co-supervisor accepted)
     */
    public function approve(Request $request, CoSupervisorInvitation $invitation)
    {
        try {
            $request->validate([
                'response' => 'required|in:accepted,rejected',
                'rejection_reason' => 'required_if:response,rejected|nullable|string|max:500',
            ]);

            $user = $request->user();
            $relationship = $invitation->relationship;

            // Determine if user is the approver
            $isApprover = false;
            if ($invitation->initiated_by === 'student' && $relationship->academician->academician_id === $user->unique_id) {
                $isApprover = true; // Main supervisor approves
            } elseif ($invitation->initiated_by === 'main_supervisor' && $relationship->student->postgraduate_id === $user->unique_id) {
                $isApprover = true; // Student approves
            }

            if (!$isApprover) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $invitation = $this->coSupervisorService->approverRespond(
                $invitation,
                $request->response,
                $request->rejection_reason
            );

            return response()->json([
                'message' => 'Response recorded successfully',
                'invitation' => $invitation->load([
                    'relationship.student.user',
                    'relationship.student.universityDetails',
                    'relationship.student.faculty',
                    'relationship.academician.user',
                    'relationship.academician.universityDetails',
                    'relationship.academician.faculty',
                    'cosupervisor.user',
                    'cosupervisor.universityDetails',
                    'cosupervisor.faculty'
                ])
            ]);
        } catch (\Exception $e) {
            Log::error('Error approving co-supervisor invitation: ' . $e->getMessage());
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    /**
     * Cancel a pending invitation
     */
    public function cancel(Request $request, CoSupervisorInvitation $invitation)
    {
        try {
            $user = $request->user();
            $relationship = $invitation->relationship;

            // Only initiator can cancel
            $canCancel = false;
            if ($invitation->initiated_by === 'student' && $relationship->student->postgraduate_id === $user->unique_id) {
                $canCancel = true;
            } elseif ($invitation->initiated_by === 'main_supervisor' && $relationship->academician->academician_id === $user->unique_id) {
                $canCancel = true;
            }

            if (!$canCancel) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $invitation = $this->coSupervisorService->cancelInvitation($invitation);

            return response()->json([
                'message' => 'Invitation cancelled successfully',
                'invitation' => $invitation
            ]);
        } catch (\Exception $e) {
            Log::error('Error cancelling co-supervisor invitation: ' . $e->getMessage());
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    /**
     * Get invitations for the authenticated user
     */
    public function myInvitations(Request $request)
    {
        try {
            $user = $request->user();

            // Get invitations where user is the co-supervisor
            $asCoSupervisor = CoSupervisorInvitation::whereHas('cosupervisor', function ($query) use ($user) {
                $query->where('academician_id', $user->unique_id);
            })
                ->with([
                    'relationship.student.user',
                    'relationship.student.universityDetails',
                    'relationship.student.faculty',
                    'relationship.academician.user',
                    'relationship.academician.universityDetails',
                    'relationship.academician.faculty',
                    'relationship.supervisionRequest',
                    'cosupervisor.user',
                    'cosupervisor.universityDetails',
                    'cosupervisor.faculty'
                ])
                ->whereNull('cancelled_at')
                ->orderBy('created_at', 'desc')
                ->get();

            // Get invitations where user needs to approve
            $toApprove = CoSupervisorInvitation::where(function ($query) use ($user) {
                // Student needs to approve (supervisor initiated)
                $query->where(function ($q) use ($user) {
                    $q->where('initiated_by', 'main_supervisor')
                        ->whereHas('relationship.student', function ($studentQuery) use ($user) {
                            $studentQuery->where('postgraduate_id', $user->unique_id);
                        });
                })
                // Main supervisor needs to approve (student initiated)
                ->orWhere(function ($q) use ($user) {
                    $q->where('initiated_by', 'student')
                        ->whereHas('relationship.academician', function ($acadQuery) use ($user) {
                            $acadQuery->where('academician_id', $user->unique_id);
                        });
                });
            })
                ->where('cosupervisor_status', 'accepted')
                ->where('approver_status', 'pending')
                ->with([
                    'relationship.student.user',
                    'relationship.student.universityDetails',
                    'relationship.student.faculty',
                    'relationship.academician.user',
                    'relationship.academician.universityDetails',
                    'relationship.academician.faculty',
                    'relationship.supervisionRequest',
                    'cosupervisor.user',
                    'cosupervisor.universityDetails',
                    'cosupervisor.faculty'
                ])
                ->whereNull('cancelled_at')
                ->orderBy('created_at', 'desc')
                ->get();

            // Get invitations where user is the initiator
            $asInitiator = CoSupervisorInvitation::where(function ($query) use ($user) {
                // Student initiated
                $query->where(function ($q) use ($user) {
                    $q->where('initiated_by', 'student')
                        ->whereHas('relationship.student', function ($studentQuery) use ($user) {
                            $studentQuery->where('postgraduate_id', $user->unique_id);
                        });
                })
                // Main supervisor initiated
                ->orWhere(function ($q) use ($user) {
                    $q->where('initiated_by', 'main_supervisor')
                        ->whereHas('relationship.academician', function ($acadQuery) use ($user) {
                            $acadQuery->where('academician_id', $user->unique_id);
                        });
                });
            })
                ->with([
                    'relationship.student.user',
                    'relationship.student.universityDetails',
                    'relationship.student.faculty',
                    'relationship.academician.user',
                    'relationship.academician.universityDetails',
                    'relationship.academician.faculty',
                    'relationship.supervisionRequest',
                    'cosupervisor.user',
                    'cosupervisor.universityDetails',
                    'cosupervisor.faculty'
                ])
                ->whereNull('cancelled_at')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'as_cosupervisor' => $asCoSupervisor,
                'to_approve' => $toApprove,
                'as_initiator' => $asInitiator,
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching co-supervisor invitations: ' . $e->getMessage());
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    /**
     * Remove a co-supervisor
     */
    public function remove(Request $request, SupervisionRelationship $relationship, $cosupervisorId)
    {
        try {
            $user = $request->user();

            // Find the co-supervisor relationship
            $cosupervisorRelationship = SupervisionRelationship::where('student_id', $relationship->student_id)
                ->where('academician_id', $cosupervisorId)
                ->where('role', SupervisionRelationship::ROLE_CO)
                ->where('status', SupervisionRelationship::STATUS_ACTIVE)
                ->firstOrFail();

            // Check authorization (student or main supervisor can remove)
            $canRemove = false;
            if ($relationship->student->postgraduate_id === $user->unique_id || $relationship->academician->academician_id === $user->unique_id) {
                $canRemove = true;
            }

            if (!$canRemove) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $this->coSupervisorService->removeCosupervisor($cosupervisorRelationship);

            return response()->json([
                'message' => 'Co-supervisor removed successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error removing co-supervisor: ' . $e->getMessage());
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }
}

