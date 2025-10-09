import React, { useState } from 'react';
import Modal from '@/Components/Modal';
import { Button } from '@/Components/ui/button';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Checkbox } from '@/Components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { CheckCircle2, User2, GraduationCap, Lightbulb, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { logError } from '@/Utils/logError';

const COHORT_MONTHS = [
  { value: 'March', label: 'March' },
  { value: 'September', label: 'September' },
];

// Generate year options (10 years before to 10 years after current year = 21 years total)
const currentYear = new Date().getFullYear();
const COHORT_YEARS = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

const MEETING_CADENCE_OPTIONS = [
  { value: 'weekly', label: 'Weekly meetings' },
  { value: 'biweekly', label: 'Bi-weekly meetings (every 2 weeks)' },
  { value: 'monthly', label: 'Monthly meetings' },
  { value: 'flexible', label: 'Flexible (as needed)' },
];

const DEFAULT_ONBOARDING_CHECKLIST = [
  { id: 'enrollment', label: 'Complete enrollment paperwork', checked: true },
  { id: 'orientation', label: 'Attend graduate school orientation', checked: true },
  { id: 'accounts', label: 'Set up university accounts and access', checked: true },
  { id: 'meetings', label: 'Join research group meetings', checked: true },
  { id: 'ethics', label: 'Complete ethics training', checked: true },
  { id: 'timeline', label: 'Discuss research timeline and milestones', checked: true },
];

export default function AcceptSupervisionRequestModal({ isOpen, request, onClose, onAccepted }) {
  const [cohortMonth, setCohortMonth] = useState('');
  const [cohortYear, setCohortYear] = useState(currentYear.toString());
  const [meetingCadence, setMeetingCadence] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [createScholarLab, setCreateScholarLab] = useState(true);
  const [checklistItems, setChecklistItems] = useState(DEFAULT_ONBOARDING_CHECKLIST);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const student = request?.student || {};
  const studentName = student.full_name || 'Student';
  const program = request?.postgraduate_program?.name || 'PhD Computer Science Program';
  const researchTopic = request?.proposal_title || 'Research Topic';

  const canSubmit = cohortMonth && cohortYear && meetingCadence;
  
  // Combine month and year for cohort
  const cohort = cohortMonth && cohortYear ? `${cohortMonth} ${cohortYear}` : '';

  const handleChecklistToggle = (id) => {
    setChecklistItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleSubmit = async () => {
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const payload = {
        cohort_start_term: cohort,
        supervision_role: 'main_supervisor', // Fixed as per requirement
        meeting_cadence: meetingCadence,
        welcome_message: welcomeMessage.trim() || null,
        create_scholarlab: createScholarLab,
        onboarding_checklist: checklistItems.filter(item => item.checked).map(item => ({
          task: item.label,
          completed: false,
        })),
      };

      await axios.post(route('supervision.requests.accept', request.id), payload);
      
      toast.success('Supervision offer sent to student');
      onAccepted?.();
      onClose?.();
    } catch (error) {
      logError(error, 'AcceptSupervisionRequestModal handleSubmit');
      const message = error?.response?.data?.message || 'Failed to accept supervision request';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      // Reset form
      setCohortMonth('');
      setCohortYear(currentYear.toString()); // Reset to current year
      setMeetingCadence('');
      setWelcomeMessage('');
      setCreateScholarLab(true);
      setChecklistItems(DEFAULT_ONBOARDING_CHECKLIST);
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
            <h2 className="text-xl font-semibold">Accept Supervision Request</h2>
          </div>
          <p className="text-sm text-slate-600">
            Confirm your decision to supervise {studentName} and set up the supervision parameters.
          </p>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          <div className="space-y-6">
            {/* Student Details */}
            <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Student Details</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <User2 className="h-4 w-4 text-slate-500 mt-0.5" />
                  <div>
                    <div className="text-xs text-slate-500">Student Name</div>
                    <div className="text-sm font-medium text-slate-900">{studentName}</div>
                  </div>
                </div>
                
                {/* <div className="flex items-start gap-2">
                  <GraduationCap className="h-4 w-4 text-slate-500 mt-0.5" />
                  <div>
                    <div className="text-xs text-slate-500">Program</div>
                    <div className="text-sm font-medium text-slate-900">{program}</div>
                  </div>
                </div> */}
              </div>

              <div className="mt-3 flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-slate-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-xs text-slate-500 mb-1">Research Topic</div>
                  <div className="text-sm text-slate-900">{researchTopic}</div>
                </div>
              </div>
            </section>

            {/* Supervision Setup */}
            <section className="space-y-4">
              <h3 className="text-base font-semibold text-slate-900">Supervision Setup</h3>
              
              <div className="space-y-4">
                {/* Cohort/Start Term - Split into Month and Year */}
                <div>
                  <Label className="mb-2 block">
                    Cohort/Start Term <span className="text-red-500">*</span>
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Select value={cohortMonth} onValueChange={setCohortMonth}>
                        <SelectTrigger id="cohortMonth">
                          <SelectValue placeholder="Select month" />
                        </SelectTrigger>
                        <SelectContent>
                          {COHORT_MONTHS.map((month) => (
                            <SelectItem key={month.value} value={month.value}>
                              {month.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Select value={cohortYear} onValueChange={setCohortYear}>
                        <SelectTrigger id="cohortYear">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {COHORT_YEARS.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {cohortMonth && cohortYear && (
                    <p className="text-xs text-slate-500 mt-1">
                      Selected: <span className="font-medium">{cohort}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">
                    Supervision Role
                  </Label>
                  <Select value="main_supervisor" disabled>
                    <SelectTrigger id="role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main_supervisor">Main Supervisor</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-500">Co-supervisor assignment available in supervision panel</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cadence">
                  Expected Meeting Cadence <span className="text-red-500">*</span>
                </Label>
                <Select value={meetingCadence} onValueChange={setMeetingCadence}>
                  <SelectTrigger id="cadence">
                    <SelectValue placeholder="Select meeting frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {MEETING_CADENCE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Custom Message to Student (Optional)</Label>
                <Textarea
                  id="message"
                  rows={4}
                  value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                  placeholder="Add a personal message to welcome the student..."
                  className="resize-none"
                />
              </div>
            </section>

            {/* Integration Setup */}
            <section className="space-y-3">
              <h3 className="text-base font-semibold text-slate-900">Integration Setup</h3>
              
              <div className="flex items-start gap-3 p-4 rounded-lg border border-slate-200 bg-white">
                <Checkbox
                  id="scholarlab"
                  checked={createScholarLab}
                  onCheckedChange={setCreateScholarLab}
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label htmlFor="scholarlab" className="text-sm font-medium text-slate-900 cursor-pointer">
                    Create ScholarLab Supervision Board
                  </Label>
                  <p className="text-xs text-slate-500 mt-1">
                    Automatically create a shared board in ScholarLab with default lists for supervision tasks, deliverables, meetings, and paper workstreams.
                  </p>
                </div>
              </div>
            </section>

            {/* Onboarding Checklist Preview */}
            <section className="space-y-3">
              <h3 className="text-base font-semibold text-slate-900">Onboarding Checklist Preview</h3>
              <p className="text-sm text-slate-600">
                These items will be added to the student's onboarding checklist:
              </p>
              
              <div className="space-y-2">
                {checklistItems.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-white">
                    <Checkbox
                      id={item.id}
                      checked={item.checked}
                      onCheckedChange={() => handleChecklistToggle(item.id)}
                      className="mt-0.5"
                    />
                    <Label htmlFor={item.id} className="text-sm text-slate-700 cursor-pointer">
                      {item.label}
                    </Label>
                  </div>
                ))}
              </div>
            </section>

            {/* Ready to Accept Alert */}
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-sm text-green-900">
                <strong className="font-semibold">Ready to Accept</strong>
                <p className="mt-1">
                  By accepting, you agree to supervise {studentName}. 
                  The student will be notified immediately, and supervision records will be created after the student accepts your offer.
                </p>
              </AlertDescription>
            </Alert>
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
            disabled={!canSubmit || isSubmitting}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm & Notify Student
          </Button>
        </div>
      </div>
    </Modal>
  );
}

