import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { 
  AlertTriangle, 
  User2, 
  Calendar,
  FileText,
  Loader2,
  XCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Avatar, AvatarFallback } from '@/Components/ui/avatar';
import { Textarea } from '@/Components/ui/textarea';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import RejectUnbindModal from '@/Pages/Supervision/Partials/RejectUnbindModal';
import { logError } from '@/Utils/logError';

export default function ForceUnbindRequestModal({ unbindRequest, relationship, onResponse, userRole = 'student' }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  if (!unbindRequest || !relationship) return null;

  // Determine who initiated the unbind request
  const isStudentInitiated = unbindRequest.initiated_by === 'student';
  const isSupervisor = userRole === 'supervisor';
  
  // Show the person who initiated the request
  const person = isStudentInitiated 
    ? relationship?.student ?? {} 
    : relationship?.academician ?? {};
  const fullName = person.full_name ?? (isStudentInitiated ? 'Student' : 'Supervisor');
  const avatarUrl = person.profile_picture ? `/storage/${person.profile_picture}` : null;
  const attemptCount = unbindRequest.attempt_count ?? 1;
  const isFinalAttempt = attemptCount >= 3;

  const initials = fullName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 3);

  const handleAccept = async () => {
    setIsProcessing(true);
    try {
      // Use appropriate route based on who's approving
      const route_name = isSupervisor 
        ? 'supervision.unbind-requests.supervisor-approve'
        : 'supervision.unbind-requests.approve';
      await axios.post(route(route_name, unbindRequest.id));
      toast.success('Unbind request accepted. Your supervision relationship has been terminated.');
      setIsProcessing(false);
      onResponse?.();
    } catch (error) {
      logError(error, 'ForceUnbindRequestModal handleAccept');
      toast.error('Failed to accept unbind request');
      setIsProcessing(false);
    }
  };

  const handleRejectConfirm = async (reason) => {
    setIsProcessing(true);
    try {
      // Use appropriate route based on who's rejecting
      const route_name = isSupervisor 
        ? 'supervision.unbind-requests.supervisor-reject'
        : 'supervision.unbind-requests.reject';
      await axios.post(route(route_name, unbindRequest.id), {
        reason: reason || ''
      });
      toast.success('Unbind request rejected');
      // Close reject modal and trigger refresh
      // The ForceUnbindRequestModal will automatically close when pendingUnbindRequest becomes null after refresh
      setShowRejectModal(false);
      setIsProcessing(false);
      onResponse?.();
    } catch (error) {
      logError(error, 'ForceUnbindRequestModal handleRejectConfirm');
      toast.error('Failed to reject unbind request');
      setIsProcessing(false);
      setShowRejectModal(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden mx-4 relative">
        {/* Processing Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-700">Processing your response...</p>
            </div>
          </div>
        )}
        {/* Header - Critical Alert */}
        <div className={`p-6 border-b ${isFinalAttempt ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-full ${isFinalAttempt ? 'bg-red-100' : 'bg-amber-100'}`}>
              <AlertTriangle className={`h-6 w-6 ${isFinalAttempt ? 'text-red-600' : 'text-amber-600'}`} />
            </div>
            <div className="flex-1">
              <h2 className={`text-xl font-bold ${isFinalAttempt ? 'text-red-900' : 'text-amber-900'}`}>
                {isFinalAttempt ? 'Final Unbind Request' : 'Unbind Request Received'}
              </h2>
              <p className={`text-sm mt-1 ${isFinalAttempt ? 'text-red-700' : 'text-amber-700'}`}>
                {isFinalAttempt 
                  ? 'This is the final attempt. You must respond to this request.'
                  : isStudentInitiated 
                    ? 'Your student has requested to terminate the supervision relationship.'
                    : 'Your supervisor has requested to terminate the supervision relationship.'}
              </p>
            </div>
            <Badge variant={isFinalAttempt ? 'destructive' : 'warning'} className="flex-shrink-0">
              Attempt {attemptCount}/3
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Person Info (Student or Supervisor who initiated) */}
          <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <Avatar className="h-12 w-12">
              {avatarUrl ? (
                <img src={avatarUrl} alt={fullName} className="h-full w-full object-cover" />
              ) : (
                <AvatarFallback className="bg-indigo-100 text-indigo-700 text-sm font-semibold">
                  {initials}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900">{fullName}</h3>
              <p className="text-sm text-slate-600">
                {isStudentInitiated 
                  ? (person?.university?.name || 'Student')
                  : (relationship.role === 'main' ? 'Main Supervisor' : 'Co-Supervisor')}
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Started: {relationship.accepted_at ? format(new Date(relationship.accepted_at), 'dd/MM/yyyy') : '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Unbind Request Details */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                Reason for Unbind Request:
              </label>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                  {unbindRequest.reason || 'No reason provided.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock className="h-3 w-3" />
              <span>
                Submitted: {unbindRequest.created_at ? format(new Date(unbindRequest.created_at), 'dd/MM/yyyy HH:mm') : '—'}
              </span>
            </div>
          </div>

          {/* Warning Alert */}
          <Alert variant={isFinalAttempt ? 'destructive' : 'default'} className={isFinalAttempt ? 'border-red-300 bg-red-50' : 'border-amber-300 bg-amber-50'}>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className={isFinalAttempt ? 'text-red-800' : 'text-amber-800'}>
              {isFinalAttempt ? (
                <>
                  <strong>This is the final unbind request.</strong> This relationship will be terminated. You will no longer have access to {isStudentInitiated ? 'this student' : 'this supervisor'}, but you can view the relationship history in the "Terminated" tab.
                </>
              ) : (
                <>
                  <strong>Important:</strong> If you reject this request, {isStudentInitiated ? 'the student' : 'your supervisor'} will be able to submit another request after a cooldown period. If you accept, your supervision relationship will be terminated immediately.
                </>
              )}
            </AlertDescription>
          </Alert>

          {/* Consequences */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">If you accept this request:</h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Your supervision relationship will be terminated</li>
              <li>You will lose access to active collaboration features</li>
              <li>You can still view the relationship history (read-only)</li>
              <li>You can search for and request a new supervisor</li>
            </ul>
          </div>

        </div>

        {/* Actions - Cannot Close */}
        <div className="p-6 border-t bg-slate-50">
          <div className="flex gap-3">
            {!isFinalAttempt && (
              <Button
                variant="outline"
                className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
                onClick={() => setShowRejectModal(true)}
                disabled={isProcessing}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject Request
              </Button>
            )}

            <Button
              className={`flex-1 ${isFinalAttempt ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
              onClick={handleAccept}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  {isFinalAttempt ? 'Acknowledge & Terminate' : 'Accept & Terminate'}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      <RejectUnbindModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleRejectConfirm}
        isProcessing={isProcessing}
      />
    </div>
  );
}

