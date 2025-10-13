<?php

namespace App\Services;

use App\Models\User;
use App\Models\SupervisionMeeting;
use Google\Client as GoogleClient;
use Google\Service\Calendar;
use Google\Service\Calendar\Event;
use Google\Service\Calendar\EventDateTime;
use Google\Service\Calendar\EventAttendee;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Crypt;
use Exception;

class GoogleCalendarService
{
    protected GoogleClient $client;

    public function __construct()
    {
        $this->client = new GoogleClient();
        $this->client->setClientId(config('services.google.client_id'));
        $this->client->setClientSecret(config('services.google.client_secret'));
        $this->client->setRedirectUri(config('services.google.calendar_redirect'));
        $this->client->setScopes(config('services.google.scopes'));
        $this->client->setAccessType('offline');
        $this->client->setPrompt('consent'); // Force consent screen to get refresh token
    }

    /**
     * Generate Google OAuth URL for calendar permissions
     */
    public function getAuthUrl(User $user): string
    {
        $this->client->setState($user->id); // Store user ID in state for callback
        return $this->client->createAuthUrl();
    }

    /**
     * Handle OAuth callback and store tokens
     */
    public function handleCallback(string $code, User $user): void
    {
        try {
            $token = $this->client->fetchAccessTokenWithAuthCode($code);

            if (isset($token['error'])) {
                throw new Exception('Error fetching access token: ' . $token['error']);
            }

            $accessToken = $token['access_token'] ?? null;
            $refreshToken = $token['refresh_token'] ?? null;
            $expiresIn = $token['expires_in'] ?? 3600;

            if (!$accessToken) {
                throw new Exception('No access token received from Google');
            }

            // Encrypt tokens before storing
            $user->update([
                'google_access_token' => Crypt::encryptString($accessToken),
                'google_refresh_token' => $refreshToken ? Crypt::encryptString($refreshToken) : $user->google_refresh_token,
                'google_token_expires_at' => now()->addSeconds($expiresIn),
                'google_calendar_enabled' => true,
            ]);

            Log::info('Google Calendar connected successfully', ['user_id' => $user->id]);
        } catch (Exception $e) {
            Log::error('Google Calendar OAuth callback failed', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Refresh expired access token
     */
    public function refreshAccessToken(User $user): void
    {
        try {
            if (!$user->google_refresh_token) {
                throw new Exception('No refresh token available');
            }

            $refreshToken = Crypt::decryptString($user->google_refresh_token);
            $this->client->setAccessToken(['refresh_token' => $refreshToken]);
            $this->client->fetchAccessTokenWithRefreshToken($refreshToken);

            $token = $this->client->getAccessToken();
            $accessToken = $token['access_token'] ?? null;
            $expiresIn = $token['expires_in'] ?? 3600;

            if (!$accessToken) {
                throw new Exception('Failed to refresh access token');
            }

            $user->update([
                'google_access_token' => Crypt::encryptString($accessToken),
                'google_token_expires_at' => now()->addSeconds($expiresIn),
            ]);

            Log::info('Google Calendar token refreshed', ['user_id' => $user->id]);
        } catch (Exception $e) {
            Log::error('Failed to refresh Google Calendar token', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);
            
            // Disable calendar if refresh fails
            $user->update(['google_calendar_enabled' => false]);
            throw $e;
        }
    }

    /**
     * Get authenticated Calendar service for user
     */
    protected function getCalendarService(User $user): Calendar
    {
        // Check if token is expired and refresh if needed
        if ($user->isGoogleTokenExpired()) {
            $this->refreshAccessToken($user);
            $user->refresh(); // Reload user model
        }

        $accessToken = Crypt::decryptString($user->google_access_token);
        $this->client->setAccessToken(['access_token' => $accessToken]);

        return new Calendar($this->client);
    }

    /**
     * Create a calendar event for a meeting
     */
    public function createEvent(SupervisionMeeting $meeting, User $organizer, User $attendee): ?string
    {
        try {
            // Only proceed if organizer has calendar connected
            if (!$organizer->hasGoogleCalendarConnected()) {
                Log::info('Organizer does not have Google Calendar connected', [
                    'meeting_id' => $meeting->id,
                    'organizer_id' => $organizer->id,
                ]);
                return null;
            }

            $service = $this->getCalendarService($organizer);

            $event = new Event([
                'summary' => $meeting->title,
                'description' => $meeting->agenda,
                'location' => $meeting->location_link,
                'start' => new EventDateTime([
                    'dateTime' => $meeting->scheduled_for->toRfc3339String(),
                    'timeZone' => config('app.timezone'),
                ]),
                'end' => new EventDateTime([
                    'dateTime' => $meeting->scheduled_for->copy()->addHour()->toRfc3339String(),
                    'timeZone' => config('app.timezone'),
                ]),
                'reminders' => [
                    'useDefault' => false,
                    'overrides' => [
                        ['method' => 'email', 'minutes' => 24 * 60], // 24 hours before
                        ['method' => 'popup', 'minutes' => 60], // 1 hour before
                    ],
                ],
            ]);

            // Add attendee if they have Google Calendar connected
            if ($attendee->hasGoogleCalendarConnected() && $attendee->email) {
                $event->setAttendees([
                    new EventAttendee(['email' => $attendee->email]),
                ]);
            }

            $createdEvent = $service->events->insert('primary', $event);
            $eventId = $createdEvent->getId();

            Log::info('Google Calendar event created', [
                'meeting_id' => $meeting->id,
                'event_id' => $eventId,
            ]);

            return $eventId;
        } catch (Exception $e) {
            Log::error('Failed to create Google Calendar event', [
                'meeting_id' => $meeting->id,
                'error' => $e->getMessage(),
            ]);
            return null;
        }
    }

    /**
     * Update an existing calendar event
     */
    public function updateEvent(SupervisionMeeting $meeting): void
    {
        try {
            if (!$meeting->external_event_id || $meeting->external_provider !== 'google') {
                return;
            }

            // Find the organizer (creator of the meeting)
            $organizer = $meeting->creator;
            if (!$organizer || !$organizer->hasGoogleCalendarConnected()) {
                return;
            }

            $service = $this->getCalendarService($organizer);

            // Get existing event
            $event = $service->events->get('primary', $meeting->external_event_id);

            // Update event details
            $event->setSummary($meeting->title);
            $event->setDescription($meeting->agenda);
            $event->setLocation($meeting->location_link);
            $event->setStart(new EventDateTime([
                'dateTime' => $meeting->scheduled_for->toRfc3339String(),
                'timeZone' => config('app.timezone'),
            ]));
            $event->setEnd(new EventDateTime([
                'dateTime' => $meeting->scheduled_for->copy()->addHour()->toRfc3339String(),
                'timeZone' => config('app.timezone'),
            ]));

            $service->events->update('primary', $meeting->external_event_id, $event);

            Log::info('Google Calendar event updated', [
                'meeting_id' => $meeting->id,
                'event_id' => $meeting->external_event_id,
            ]);
        } catch (Exception $e) {
            Log::error('Failed to update Google Calendar event', [
                'meeting_id' => $meeting->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Delete a calendar event
     */
    public function deleteEvent(SupervisionMeeting $meeting): void
    {
        try {
            if (!$meeting->external_event_id || $meeting->external_provider !== 'google') {
                return;
            }

            $organizer = $meeting->creator;
            if (!$organizer || !$organizer->hasGoogleCalendarConnected()) {
                return;
            }

            $service = $this->getCalendarService($organizer);
            $service->events->delete('primary', $meeting->external_event_id);

            Log::info('Google Calendar event deleted', [
                'meeting_id' => $meeting->id,
                'event_id' => $meeting->external_event_id,
            ]);
        } catch (Exception $e) {
            Log::error('Failed to delete Google Calendar event', [
                'meeting_id' => $meeting->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Sync changes from Google Calendar
     */
    public function syncFromGoogle(User $user): array
    {
        try {
            if (!$user->hasGoogleCalendarConnected()) {
                return ['synced' => 0, 'updated' => 0, 'deleted' => 0];
            }

            $service = $this->getCalendarService($user);
            
            // Get events modified in the last 24 hours
            $timeMin = now()->subDay()->toRfc3339String();
            $events = $service->events->listEvents('primary', [
                'timeMin' => $timeMin,
                'singleEvents' => true,
                'orderBy' => 'updated',
            ]);

            $synced = 0;
            $updated = 0;
            $deleted = 0;

            foreach ($events->getItems() as $event) {
                $eventId = $event->getId();
                
                // Find corresponding meeting
                $meeting = SupervisionMeeting::where('external_event_id', $eventId)
                    ->where('external_provider', 'google')
                    ->first();

                if ($meeting) {
                    // Check if event was deleted
                    if ($event->getStatus() === 'cancelled') {
                        $meeting->update(['cancelled_at' => now()]);
                        $deleted++;
                    } else {
                        // Update meeting details from Google Calendar
                        $start = $event->getStart();
                        $startDateTime = $start->getDateTime() ?? $start->getDate();
                        
                        $meeting->update([
                            'title' => $event->getSummary(),
                            'scheduled_for' => $startDateTime,
                            'location_link' => $event->getLocation(),
                            'agenda' => $event->getDescription(),
                        ]);
                        $updated++;
                    }
                    $synced++;
                }
            }

            Log::info('Synced from Google Calendar', [
                'user_id' => $user->id,
                'synced' => $synced,
                'updated' => $updated,
                'deleted' => $deleted,
            ]);

            return ['synced' => $synced, 'updated' => $updated, 'deleted' => $deleted];
        } catch (Exception $e) {
            Log::error('Failed to sync from Google Calendar', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Disconnect user's Google Calendar
     */
    public function disconnect(User $user): void
    {
        try {
            // Revoke token if possible
            if ($user->google_access_token) {
                $accessToken = Crypt::decryptString($user->google_access_token);
                $this->client->revokeToken($accessToken);
            }
        } catch (Exception $e) {
            Log::warning('Failed to revoke Google Calendar token', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);
        } finally {
            // Clear tokens regardless
            $user->update([
                'google_access_token' => null,
                'google_refresh_token' => null,
                'google_token_expires_at' => null,
                'google_calendar_enabled' => false,
            ]);

            Log::info('Google Calendar disconnected', ['user_id' => $user->id]);
        }
    }
}

