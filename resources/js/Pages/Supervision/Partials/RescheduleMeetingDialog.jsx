import React, { useState, useEffect } from 'react';
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

export default function RescheduleMeetingDialog({ meeting, onClose, onRescheduled }) {
  const [title, setTitle] = useState('');
  const [scheduledFor, setScheduledFor] = useState('');
  const [location, setLocation] = useState('');
  const [agenda, setAgenda] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (meeting) {
      setTitle(meeting.title || '');
      // Format the datetime properly for datetime-local input
      // meeting.scheduled_for is in Malaysia time, format it as-is
      const date = new Date(meeting.scheduled_for);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      setScheduledFor(`${year}-${month}-${day}T${hours}:${minutes}`);
      setLocation(meeting.location_link || '');
      setAgenda(meeting.agenda || '');
      setError(null);
    }
  }, [meeting]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!meeting || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Format the datetime properly for backend
      // The backend expects datetime in app timezone (Asia/Kuala_Lumpur)
      // Send as YYYY-MM-DD HH:mm:ss format without timezone conversion
      const formattedDateTime = scheduledFor.replace('T', ' ') + ':00';
      
      await axios.put(route('supervision.meetings.update', meeting.id), {
        title,
        scheduled_for: formattedDateTime,
        location_link: location,
        agenda,
      });

      toast.success('Meeting rescheduled');
      onRescheduled?.();
      onClose?.();
    } catch (err) {
      logError(err, 'Reschedule meeting');
      const message = err?.response?.data?.message || 'Failed to reschedule meeting';
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

  const minDateTime = () => {
    const now = new Date();
    // Format as YYYY-MM-DDTHH:mm for datetime-local input
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <Modal show={Boolean(meeting)} onClose={onClose} maxWidth="lg">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Reschedule meeting</h2>
            <p className="mt-1 text-sm text-gray-600">
              Update the meeting time or details
            </p>
          </div>
          <button onClick={onClose} className="rounded-md text-gray-400 hover:text-gray-500">
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
              onChange={(e) => setTitle(e.target.value)}
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
                onChange={(e) => setScheduledFor(e.target.value)}
                min={minDateTime()}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meeting-location">Meeting link / location</Label>
              <Input
                id="meeting-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
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
              onChange={(e) => setAgenda(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Meeting
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

