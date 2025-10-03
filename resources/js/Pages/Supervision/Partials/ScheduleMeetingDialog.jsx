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

const defaultDateTime = () => {
  const now = new Date();
  now.setHours(now.getHours() + 24);
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
};

export default function ScheduleMeetingDialog({ relationship, onClose, onScheduled, userRole = 'supervisor' }) {
  const [title, setTitle] = useState('Supervision Meeting');
  const [scheduledFor, setScheduledFor] = useState(defaultDateTime());
  const [location, setLocation] = useState('');
  const [agenda, setAgenda] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Determine who we're meeting with based on role
  const isSupervisor = userRole === 'supervisor';
  const otherPerson = isSupervisor 
    ? relationship?.student?.full_name ?? 'student'
    : relationship?.academician?.full_name ?? 'supervisor';

  useEffect(() => {
    if (relationship) {
      setTitle(`Meeting with ${otherPerson}`);
      setScheduledFor(defaultDateTime());
      setLocation('');
      setAgenda(relationship?.meeting_cadence ? `Discuss ${relationship.meeting_cadence.toLowerCase()}` : '');
      setError(null);
    }
  }, [relationship, otherPerson]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!relationship || isSubmitting) return;

    if (!title.trim() || !scheduledFor || !location.trim()) {
      setError('Please provide a title, meeting date, and meeting link/location.');
      return;
    }

    // Safety check for relationship.id
    if (!relationship.id) {
      setError('Cannot schedule meeting: Invalid relationship data. Please try again.');
      toast.error('Invalid relationship data');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await axios.post(route('supervision.meetings.store', relationship.id), {
        title,
        scheduled_for: new Date(scheduledFor).toISOString(),
        location_link: location,
        agenda,
      });

      toast.success('Meeting scheduled');
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
    <Modal show={Boolean(relationship)} onClose={onClose} maxWidth="lg">
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

