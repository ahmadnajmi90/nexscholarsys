import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { MoreVertical, Edit, Trash2, Loader2, Video } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { Button } from '@/Components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/Components/ui/alert-dialog';

export default function MeetingActionMenu({ meeting, onUpdate, onCancel }) {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const hasJoinLink = Boolean(meeting.location_link);

  const handleJoinMeeting = () => {
    if (hasJoinLink) {
      window.open(meeting.location_link, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCancel = async () => {
    setIsCancelling(true);
    try {
      await axios.delete(route('supervision.meetings.destroy', meeting.id));
      toast.success('Meeting cancelled');
      onCancel?.();
      setShowCancelDialog(false);
    } catch (error) {
      console.error('Cancel meeting error:', error);
      toast.error(error?.response?.data?.message || 'Failed to cancel meeting');
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center justify-center h-8 w-8 rounded-md text-sm font-medium hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <MoreVertical className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {hasJoinLink && (
            <DropdownMenuItem onClick={handleJoinMeeting}>
              <Video className="mr-2 h-4 w-4" />
              Join Meeting
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => onUpdate?.(meeting)}>
            <Edit className="mr-2 h-4 w-4" />
            Reschedule
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setShowCancelDialog(true)}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Cancel Meeting
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel meeting?</AlertDialogTitle>
            <AlertDialogDescription>
              This will cancel "{meeting.title}" scheduled for{' '}
              {new Date(meeting.scheduled_for).toLocaleString()}. 
              The other party will be notified.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancelling}>
              Keep Meeting
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              disabled={isCancelling}
              className="bg-red-600 hover:bg-red-700"
            >
              {isCancelling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Cancel Meeting
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

