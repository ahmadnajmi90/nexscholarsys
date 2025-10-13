<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\SupervisionMeeting;
use App\Models\SupervisionRelationship;
use App\Models\SupervisionRequest;
use App\Services\GoogleCalendarService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Exception;

class GoogleCalendarController extends Controller
{
    public function __construct(
        protected GoogleCalendarService $googleCalendarService
    ) {
        $this->middleware('auth');
    }

    /**
     * Get Google OAuth URL for calendar permissions
     */
    public function getAuthUrl(Request $request)
    {
        try {
            $url = $this->googleCalendarService->getAuthUrl($request->user());
            
            // Debug: Include redirect URI in response
            $redirectUri = config('services.google.calendar_redirect');
            
            return response()->json([
                'success' => true,
                'auth_url' => $url,
                'debug' => [
                    'redirect_uri' => $redirectUri,
                    'app_url' => config('app.url'),
                ],
            ]);
        } catch (Exception $e) {
            Log::error('Failed to generate Google Calendar auth URL', [
                'user_id' => $request->user()->id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to generate authorization URL',
            ], 500);
        }
    }

    /**
     * Handle OAuth callback
     */
    public function handleCallback(Request $request)
    {
        try {
            $code = $request->input('code');
            $state = $request->input('state');

            if (!$code) {
                // Return HTML that closes popup and shows error
                return $this->renderPopupClose('error', 'Authorization code not received from Google');
            }

            // Get user from state
            $user = \App\Models\User::findOrFail($state);

            $this->googleCalendarService->handleCallback($code, $user);

            // Return HTML that closes popup and notifies success
            return $this->renderPopupClose('success', 'Google Calendar connected successfully!');
        } catch (Exception $e) {
            Log::error('Google Calendar callback failed', [
                'error' => $e->getMessage(),
            ]);

            return $this->renderPopupClose('error', 'Failed to connect Google Calendar. Please try again.');
        }
    }

    /**
     * Render a self-closing popup window that notifies the parent
     */
    private function renderPopupClose($status, $message)
    {
        return response()->view('google-calendar-callback', [
            'status' => $status,
            'message' => $message,
        ]);
    }

    /**
     * Get user's Google Calendar connection status
     */
    public function getStatus(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'connected' => $user->hasGoogleCalendarConnected(),
            'enabled' => $user->google_calendar_enabled,
            'token_expires_at' => $user->google_token_expires_at?->toIso8601String(),
        ]);
    }

    /**
     * Disconnect Google Calendar
     */
    public function disconnect(Request $request)
    {
        try {
            $this->googleCalendarService->disconnect($request->user());

            return response()->json([
                'success' => true,
                'message' => 'Google Calendar disconnected successfully',
            ]);
        } catch (Exception $e) {
            Log::error('Failed to disconnect Google Calendar', [
                'user_id' => $request->user()->id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to disconnect Google Calendar',
            ], 500);
        }
    }

    /**
     * Add specific meeting to Google Calendar
     */
    public function addMeetingToCalendar(Request $request, SupervisionMeeting $meeting)
    {
        try {
            $user = $request->user();

            // Eager load relationships with their users
            $meeting->load([
                'relationship.academician.user',
                'relationship.student.user',
                'request.academician.user',
                'request.student.user',
                'creator'
            ]);

            // Verify user has permission to access this meeting
            $isAuthorized = false;
            
            // Check if user is the meeting creator
            if ($meeting->created_by === $user->id) {
                $isAuthorized = true;
            }
            
            // Also check relationship participants
            if (!$isAuthorized && $meeting->supervision_relationship_id && $meeting->relationship) {
                $relationship = $meeting->relationship;
                
                // Check academician
                if ($relationship->academician) {
                    if ($relationship->academician->user_id === $user->id) {
                        $isAuthorized = true;
                    }
                }

                Log::info('isAuthorized', ['isAuthorized' => $isAuthorized]);
                Log::info('academician->user_id', ['academician->user_id' => $relationship->academician->user_id]);
                Log::info('user->id', ['user->id' => $user->id]);
                
                // Check student
                if (!$isAuthorized && $relationship->student) {
                    if ($relationship->student->user_id === $user->id) {
                        $isAuthorized = true;
                    }
                }

                Log::info('isAuthorized', ['isAuthorized' => $isAuthorized]);
                Log::info('student->user_id', ['student->user_id' => $relationship->student->user_id]);
                Log::info('user->id', ['user->id' => $user->id]);
            } 
            
            // Check request participants
            if (!$isAuthorized && $meeting->supervision_request_id && $meeting->request) {
                $requestModel = $meeting->request;
                
                // Check academician
                if ($requestModel->academician) {
                    if ($requestModel->academician->user_id === $user->id) {
                        $isAuthorized = true;
                    }
                }
                
                // Check student
                if (!$isAuthorized && $requestModel->student) {
                    if ($requestModel->student->user_id === $user->id) {
                        $isAuthorized = true;
                    }
                }
            }

            if (!$isAuthorized) {
                // Detailed logging for debugging
                $debugInfo = [
                    'user_id' => $user->id,
                    'meeting_id' => $meeting->id,
                    'created_by' => $meeting->created_by,
                    'has_relationship' => !is_null($meeting->relationship),
                    'has_request' => !is_null($meeting->request),
                ];
                
                if ($meeting->relationship) {
                    $debugInfo['relationship_id'] = $meeting->relationship->id;
                    $debugInfo['academician_user_id'] = $meeting->relationship->academician?->user_id;
                    $debugInfo['student_user_id'] = $meeting->relationship->student?->user_id;
                }
                
                Log::warning('User unauthorized to add meeting to calendar', $debugInfo);
                
                return response()->json([
                    'success' => false,
                    'message' => 'You do not have permission to add this meeting',
                ], 403);
            }

            if (!$user->hasGoogleCalendarConnected()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Please connect your Google Calendar first',
                    'needs_connection' => true,
                ], 400);
            }

            // Check if meeting is already in Google Calendar
            if ($meeting->external_event_id && $meeting->external_provider === 'google') {
                return response()->json([
                    'success' => false,
                    'message' => 'This meeting is already in your Google Calendar',
                    'already_exists' => true,
                    'meeting' => [
                        'id' => $meeting->id,
                        'external_event_id' => $meeting->external_event_id,
                        'external_provider' => $meeting->external_provider,
                    ],
                ], 400);
            }

            // Determine organizer and attendee
            $organizer = $meeting->creator;
            $attendee = null;
            
            if ($meeting->supervision_relationship_id && $meeting->relationship) {
                $relationship = $meeting->relationship;
                if ($relationship->academician && $relationship->academician->user_id === $user->id) {
                    $attendee = $relationship->student ? $relationship->student->user : null;
                } else {
                    $attendee = $relationship->academician ? $relationship->academician->user : null;
                }
            } elseif ($meeting->supervision_request_id && $meeting->request) {
                $requestModel = $meeting->request;
                if ($requestModel->academician && $requestModel->academician->user_id === $user->id) {
                    $attendee = $requestModel->student ? $requestModel->student->user : null;
                } else {
                    $attendee = $requestModel->academician ? $requestModel->academician->user : null;
                }
            }

            // Create event in Google Calendar
            $eventId = $this->googleCalendarService->createEvent($meeting, $organizer, $attendee);

            if ($eventId) {
                // Store event ID in meeting
                $meeting->update([
                    'external_event_id' => $eventId,
                    'external_provider' => 'google',
                ]);

                // Reload meeting to get updated data
                $meeting->refresh();

                return response()->json([
                    'success' => true,
                    'message' => 'Meeting added to Google Calendar successfully',
                    'event_id' => $eventId,
                    'meeting' => [
                        'id' => $meeting->id,
                        'external_event_id' => $meeting->external_event_id,
                        'external_provider' => $meeting->external_provider,
                    ],
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Failed to create calendar event',
            ], 500);
        } catch (Exception $e) {
            Log::error('Failed to add meeting to Google Calendar', [
                'meeting_id' => $meeting->id,
                'user_id' => $request->user()->id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to add meeting to Google Calendar',
            ], 500);
        }
    }

    /**
     * Trigger sync from Google Calendar
     */
    public function syncFromGoogle(Request $request)
    {
        try {
            $result = $this->googleCalendarService->syncFromGoogle($request->user());

            return response()->json([
                'success' => true,
                'message' => 'Synced successfully',
                'synced' => $result['synced'],
                'updated' => $result['updated'],
                'deleted' => $result['deleted'],
            ]);
        } catch (Exception $e) {
            Log::error('Failed to sync from Google Calendar', [
                'user_id' => $request->user()->id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to sync from Google Calendar',
            ], 500);
        }
    }
}

