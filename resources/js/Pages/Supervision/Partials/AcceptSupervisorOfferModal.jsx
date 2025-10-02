import React, { useState } from 'react';
import Modal from '@/Components/Modal';
import { Button } from '@/Components/ui/button';
import { Label } from '@/Components/ui/label';
import { Checkbox } from '@/Components/ui/checkbox';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { logError } from '@/Utils/logError';

const REQUIRED_CHECKBOXES = [
  {
    id: 'confirm_intention',
    label: "I confirm my intention to accept this supervisor's offer.",
  },
  {
    id: 'understand_upload',
    label: 'I understand I must upload my official university offer/appointment letter when it is issued.',
  },
  {
    id: 'agree_storage',
    label: 'I agree that NexScholar may store this information to validate the supervisor-student connection.',
  },
  {
    id: 'read_rules',
    label: 'I have read and agree to the rules below.',
  },
];

const RULES = [
  {
    id: 1,
    text: 'Upload the official university offer/appointment letter within 14-30 days of acceptance (or once issued by the university).',
  },
  {
    id: 2,
    text: 'The letter must show student name, programme, intake/semester, supervisor\'s name, and official stamp/signature.',
  },
  {
    id: 3,
    text: 'If your supervisor changes, update your status and (when available) upload the new letter within 7 days.',
  },
];

export default function AcceptSupervisorOfferModal({ isOpen, request, onClose, onAccepted }) {
  const [checkboxes, setCheckboxes] = useState({
    confirm_intention: false,
    understand_upload: false,
    agree_storage: false,
    read_rules: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supervisorName = request?.academician?.full_name || 'Prof. Supervisor';
  // const program = request?.postgraduate_program?.name || 'your degree program';

  const allChecked = Object.values(checkboxes).every(v => v === true);

  const handleCheckboxChange = (id, checked) => {
    setCheckboxes(prev => ({ ...prev, [id]: checked }));
  };

  const handleSubmit = async () => {
    if (!allChecked || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await axios.post(route('supervision.requests.student-accept', request.id));
      
      toast.success('You have accepted the supervision offer!');
      onAccepted?.();
      onClose?.();
    } catch (error) {
      logError(error, 'AcceptSupervisorOfferModal handleSubmit');
      const message = error?.response?.data?.message || 'Failed to accept supervision offer';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      // Reset checkboxes
      setCheckboxes({
        confirm_intention: false,
        understand_upload: false,
        agree_storage: false,
        read_rules: false,
      });
      onClose?.();
    }
  };

  return (
    <Modal show={isOpen} onClose={handleClose} maxWidth="2xl">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-semibold">Accept Supervisor Offer</h2>
          </div>
          <p className="text-sm text-slate-600">
            You are accepting an offer from <strong>{supervisorName}</strong> to be your supervisor on NexScholar.
          </p>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          <div className="space-y-6">
            {/* Important Notice */}
            <Alert className="bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-sm text-amber-900">
                <strong className="font-semibold">Important Notice</strong>
                <p className="mt-1">
                  This acceptance does <strong>not</strong> replace your university's official registration. 
                  You'll be asked to upload your official university offer/appointment letter once it's available.
                </p>
              </AlertDescription>
            </Alert>

            {/* Required Confirmations */}
            <section className="space-y-4">
              <h3 className="text-base font-semibold text-slate-900">Required Confirmations</h3>
              
              <div className="space-y-3">
                {REQUIRED_CHECKBOXES.map((checkbox) => (
                  <div
                    key={checkbox.id}
                    className="flex items-start gap-3 p-4 rounded-lg border border-slate-200 bg-white"
                  >
                    <Checkbox
                      id={checkbox.id}
                      checked={checkboxes[checkbox.id]}
                      onCheckedChange={(checked) => handleCheckboxChange(checkbox.id, checked)}
                      className="mt-0.5"
                    />
                    <Label
                      htmlFor={checkbox.id}
                      className="text-sm text-slate-700 cursor-pointer flex-1 leading-relaxed"
                    >
                      {checkbox.label}
                    </Label>
                  </div>
                ))}
              </div>
            </section>

            {/* Rules Section */}
            <section className="space-y-4">
              <h3 className="text-base font-semibold text-slate-900">Rules</h3>
              
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <ol className="space-y-3 list-decimal list-inside">
                  {RULES.map((rule) => (
                    <li key={rule.id} className="text-sm text-slate-700 leading-relaxed">
                      <span className="ml-2">{rule.text}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </section>

            {/* Confirmation Summary */}
            {allChecked && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-sm text-green-900">
                  <strong className="font-semibold">Ready to Proceed</strong>
                  <p className="mt-1">
                    By clicking "Agree & Accept", you confirm your acceptance of {supervisorName} as your supervisor.
                    Your supervision relationship will be activated, and both you and your supervisor 
                    will gain access to supervision features including meetings, ScholarLab workspace, and progress tracking.
                  </p>
                </AlertDescription>
              </Alert>
            )}

            {!allChecked && (
              <Alert>
                <AlertCircle className="h-4 w-4 text-slate-500" />
                <AlertDescription className="text-sm text-slate-600">
                  Please check all boxes above to proceed with accepting the supervision offer.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 pt-4 border-t flex items-center justify-end gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!allChecked || isSubmitting}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Agree & Accept
          </Button>
        </div>
      </div>
    </Modal>
  );
}

