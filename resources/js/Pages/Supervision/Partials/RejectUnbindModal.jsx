import React, { useState } from 'react';
import { Button } from '@/Components/ui/button';
import { Textarea } from '@/Components/ui/textarea';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { Loader2, XCircle, AlertTriangle } from 'lucide-react';

export default function RejectUnbindModal({ isOpen, onClose, onConfirm, isProcessing }) {
  const [reason, setReason] = useState('');

  const handleClose = () => {
    if (isProcessing) return;
    setReason('');
    onClose();
  };

  const handleBackdropClick = () => {
    if (!isProcessing) {
      handleClose();
    }
  };

  const handleConfirm = () => {
    onConfirm(reason.trim());
  };

  return (
    <div className={`${isOpen ? 'fixed' : 'hidden'} inset-0 z-[60] flex items-center justify-center`}>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={handleBackdropClick}
        />
      )}
      
      {/* Modal Content */}
      {isOpen && (
        <div 
          className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl mx-4 animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-red-50 rounded-full">
            <XCircle className="h-6 w-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-slate-900">Reject Unbind Request</h2>
            <p className="text-sm text-slate-600 mt-1">
              Provide feedback for why you're rejecting this request
            </p>
          </div>
        </div>

        {/* Warning Alert */}
        <Alert className="mb-6 border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <p className="text-sm">
              After rejection, a 30-day cooldown period will be applied before another unbind request can be submitted.
            </p>
          </AlertDescription>
        </Alert>

        {/* Reason Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Reason for Rejection <span className="text-slate-500 text-xs">(Optional)</span>
          </label>
          <Textarea
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain why you're rejecting this request. This feedback will be shared with the requester and may help improve future requests."
            className="resize-none"
            disabled={isProcessing}
          />
          <p className="mt-2 text-xs text-slate-500">
            {reason.length}/500 characters
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isProcessing}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Rejection
          </Button>
        </div>
          </div>
        </div>
      )}
    </div>
  );
}

