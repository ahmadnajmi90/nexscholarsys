import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Modal from '@/Components/Modal';
import { Button } from '@/Components/ui/button';
import { Textarea } from '@/Components/ui/textarea';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { Loader2, AlertTriangle, UserMinus } from 'lucide-react';
import { logError } from '@/Utils/logError';

export default function UnbindRequestModal({ isOpen, relationship, onClose, onUnbindInitiated, userRole = 'supervisor' }) {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    if (isSubmitting) return;
    setReason('');
    onClose();
  };

  const handleSubmit = async () => {
    if (!reason.trim() || reason.trim().length < 10) {
      toast.error('Please provide a detailed reason (at least 10 characters)');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        route('supervision.relationships.unbind.initiate', relationship.id),
        { reason: reason.trim() }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        onUnbindInitiated?.();
        handleClose();
      }
    } catch (error) {
      logError(error, 'UnbindRequestModal handleSubmit');
      const message = error?.response?.data?.message || 'Failed to initiate unbind request';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!relationship) return null;

  // Determine who we're unbinding with based on user role
  const isSupervisor = userRole === 'supervisor';
  const otherPerson = isSupervisor 
    ? relationship?.student 
    : relationship?.academician;
  const otherPersonName = otherPerson?.full_name || (isSupervisor ? 'Student' : 'Supervisor');
  const otherPersonRole = isSupervisor ? 'student' : 'supervisor';

  return (
    <Modal show={isOpen} onClose={handleClose} maxWidth="2xl">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-red-50 rounded-full">
            <UserMinus className="h-6 w-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-slate-900">Remove Supervision Relationship</h2>
            <p className="text-sm text-slate-600 mt-1">
              Initiate an unbind request with {otherPersonName}
            </p>
          </div>
        </div>

        {/* Warning Alert */}
        <Alert className="mb-6 border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <div className="space-y-2">
              <p className="font-semibold">Important Information:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>The {otherPersonRole} must approve this request before the relationship is terminated</li>
                <li>If the {otherPersonRole} rejects, you'll need to wait 30 days before requesting again</li>
                <li>After 3 rejected attempts, the relationship will be force-terminated without {otherPersonRole} approval</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>

        {/* Relationship Summary */}
        <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Relationship Details</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-slate-500">{isSupervisor ? 'Student' : 'Supervisor'}:</span>
              <span className="ml-2 font-medium text-slate-900">{otherPersonName}</span>
            </div>
            <div>
              <span className="text-slate-500">Role:</span>
              <span className="ml-2 font-medium text-slate-900">
                {relationship.role === 'main' ? 'Main Supervisor' : 'Co-Supervisor'}
              </span>
            </div>
            <div>
              <span className="text-slate-500">Started:</span>
              <span className="ml-2 font-medium text-slate-900">
                {relationship.accepted_at ? new Date(relationship.accepted_at).toLocaleDateString('en-GB') : '—'}
              </span>
            </div>
            <div>
              <span className="text-slate-500">Cohort:</span>
              <span className="ml-2 font-medium text-slate-900">{relationship.cohort || '—'}</span>
            </div>
          </div>
        </div>

        {/* Reason Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Reason for Unbinding <span className="text-red-500">*</span>
          </label>
          <Textarea
            rows={5}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={`Please provide a detailed explanation for why you want to end this supervision relationship. This will be shared with the ${otherPersonRole}.`}
            className="resize-none"
            disabled={isSubmitting}
          />
          <p className="mt-2 text-xs text-slate-500">
            {reason.length}/1000 characters · Minimum 10 characters required
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !reason.trim() || reason.trim().length < 10}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Unbind Request
          </Button>
        </div>
      </div>
    </Modal>
  );
}

