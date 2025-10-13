import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Modal from '@/Components/Modal';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Label } from '@/Components/ui/label';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { Loader2, X } from 'lucide-react';
import { logError } from '@/Utils/logError';
import { useGoogleCalendar } from '@/Hooks/useGoogleCalendar';
import GoogleCalendarToast from '@/Components/GoogleCalendarToast';

const defaultDateTime = () => {
  const now = new Date();
  now.setHours(now.getHours() + 24);
  // Format as YYYY-MM-DDTHH:mm for datetime-local input
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export default function ScheduleMeetingDialog({ relationship = null, request = null, onClose, onScheduled, userRole = 'supervisor' }) {
  const [title, setTitle] = useState('Supervision Meeting');
  const [scheduledFor, setScheduledFor] = useState(defaultDateTime());
  const [location, setLocation] = useState('');
  const [agenda, setAgenda] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // Google Calendar hook
  const { addMeetingToCalendar } = useGoogleCalendar();

  // Determine which entity we're working with
  const isRequestPhase = request && !relationship;
  const targetEntity = relationship || request;

  // Determine who we're meeting with based on role
  const isSupervisor = userRole === 'supervisor';
  const otherPerson = isSupervisor 
    ? (relationship?.student?.full_name || request?.student?.full_name || 'student')
    : (relationship?.academician?.full_name || request?.academician?.full_name || 'supervisor');

  useEffect(() => {
    if (targetEntity) {
      setTitle(`Meeting with ${otherPerson}`);
      setScheduledFor(defaultDateTime());
      setLocation('');
      setAgenda(relationship?.meeting_cadence ? `Discuss ${relationship.meeting_cadence.toLowerCase()}` : '');
      setError(null);
    }
  }, [targetEntity, otherPerson, relationship?.meeting_cadence]);

  /**
   * Show Google Calendar prompt toast
   */
  const showGoogleCalendarPrompt = (meeting, promptData) => {
    const customToast = toast.custom((t) => (
      <GoogleCalendarToast
        meeting={meeting}
        promptData={promptData}
        onYes={async () => {
          toast.dismiss(t.id);
          await addMeetingToCalendar(meeting.id);
        }}
        onNo={() => toast.dismiss(t.id)}
        visible={t.visible}
      />
    ), {
      duration: 10000, // 10 seconds
      position: 'top-center',
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!targetEntity || isSubmitting) return;

    if (!title.trim() || !scheduledFor || !location.trim()) {
      setError('Please provide a title, meeting date, and meeting link/location.');
      return;
    }

    // Safety check for entity ID
    if (!targetEntity.id) {
      setError('Cannot schedule meeting: Invalid data. Please try again.');
      toast.error('Invalid data');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Use different endpoint based on whether we're in request or relationship phase
      const endpoint = isRequestPhase
        ? route('supervision.requests.meetings.store', request.id)
        : route('supervision.meetings.store', relationship.id);

      // Format the datetime properly for backend
      // The backend expects datetime in app timezone (Asia/Kuala_Lumpur)
      // Send as YYYY-MM-DD HH:mm:ss format without timezone conversion
      const formattedDateTime = scheduledFor.replace('T', ' ') + ':00';
      
      const response = await axios.post(endpoint, {
        title,
        scheduled_for: formattedDateTime,
        location_link: location,
        agenda,
      });

      const { meeting, google_calendar_prompt } = response.data;

      toast.success('Meeting scheduled');

      // Show Google Calendar prompt if enabled
      if (google_calendar_prompt?.show_prompt) {
        showGoogleCalendarPrompt(meeting, google_calendar_prompt);
      }

      onScheduled?.();
      onClose?.();
    } catch (err) {
      logError(err, 'Supervision schedule meeting');
      const message = err?.response?.data?.message || 'Failed to schedule meeting. Please try again.';
      const errors = err?.response?.data?.errors;
      if (errors) {
        const errorMessages = Object.values(errors).flat().join(', ');
        setError(errorMessages);
        toast.error(errorMessages);
      } else {
        setError(message);
        toast.error(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={Boolean(targetEntity)} onClose={onClose} maxWidth="lg">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Schedule supervision meeting</h2>
            <p className="mt-1 text-sm text-gray-600">
              Create a meeting invite for {otherPerson}. {isSupervisor ? 'The student' : 'Your supervisor'} will see the meeting once scheduled.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="meeting-title">Meeting title</Label>
            <Input
              id="meeting-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Thesis direction sync"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="meeting-datetime">Scheduled for</Label>
              <Input
                id="meeting-datetime"
                type="datetime-local"
                value={scheduledFor}
                onChange={(event) => setScheduledFor(event.target.value)}
                min={defaultDateTime()}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meeting-location">Meeting link / location</Label>
              <Input
                id="meeting-location"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Zoom / Teams link or physical venue"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="meeting-agenda">Agenda / notes</Label>
            <Textarea
              id="meeting-agenda"
              rows={4}
              value={agenda}
              onChange={(event) => setAgenda(event.target.value)}
              placeholder="Outline talking points, materials to review, or goals for this session."
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Schedule meeting
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

