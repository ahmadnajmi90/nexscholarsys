import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Checkbox } from '@/Components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/Components/ui/avatar';
import { Badge } from '@/Components/ui/badge';
import { XCircle, User2, Lightbulb, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { logError } from '@/Utils/logError';

const REJECTION_REASONS = [
  { value: 'capacity_full', label: 'Capacity full - Not accepting new students' },
  { value: 'research_mismatch', label: 'Research interests do not align' },
  { value: 'expertise_mismatch', label: 'Outside my area of expertise' },
  { value: 'timing', label: 'Timing not suitable (sabbatical/other commitments)' },
  { value: 'qualification', label: 'Student qualifications do not meet requirements' },
  { value: 'other', label: 'Other reason (please specify)' },
];

export default function DeclineSupervisionRequestModal({ isOpen, request, onClose, onRejected }) {
  const [reason, setReason] = useState('');
  const [feedback, setFeedback] = useState('');
  const [recommendAlternatives, setRecommendAlternatives] = useState(false);
  const [selectedSupervisors, setSelectedSupervisors] = useState([]);
  const [suggestedKeywords, setSuggestedKeywords] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const student = request?.student || {};
  const studentName = student.full_name || 'Student';
  const program = request?.postgraduate_program?.name || 'PhD Computer Science Program';
  const researchTopic = request?.proposal_title || 'Research Topic';
  const researchKeywords = request?.research_keywords || [];

  useEffect(() => {
    if (isOpen && researchKeywords.length > 0) {
      setSuggestedKeywords(researchKeywords.join(', '));
    }
  }, [isOpen, researchKeywords]);

  const canSubmit = reason !== '';

  const handleSupervisorToggle = (supervisor) => {
    setSelectedSupervisors(prev => {
      const exists = prev.find(s => s.id === supervisor.id);
      if (exists) {
        return prev.filter(s => s.id !== supervisor.id);
      } else {
        return [...prev, supervisor];
      }
    });
  };

  // Mock recommended supervisors - in production, fetch from API based on research topic
  const recommendedSupervisors = [
    { id: 1, name: 'Dr. Sarah Kim', expertise: 'Machine Learning, NLP' },
    { id: 2, name: 'Prof. Michael Tan', expertise: 'Human-Computer Interaction' },
    { id: 3, name: 'Dr. Lisa Wang', expertise: 'Computer Vision, AI' },
  ];

  const getMessagePreview = () => {
    const reasonText = REJECTION_REASONS.find(r => r.value === reason)?.label || '';
    const supervisorNames = selectedSupervisors.map(s => s.name).join(', ');
    
    return `Dear ${studentName},

Thank you for your interest in working with me on your ${program} research. After carefully reviewing your proposal titled "${researchTopic}", I regret to inform you that I will not be able to supervise your research at this time.

Reason: ${reasonText}

${feedback ? `\n${feedback}\n` : ''}
${recommendAlternatives && selectedSupervisors.length > 0 ? `\nI recommend reaching out to the following supervisors who might be a better fit for your research:\n${supervisorNames}\n` : ''}
${suggestedKeywords ? `\nSuggested keywords for your supervisor search: ${suggestedKeywords}\n` : ''}
I wish you the best of luck in finding a suitable supervisor for your research.

Best regards,
Dr. ${request?.academician?.full_name || 'Supervisor'}`;
  };

  const handleSubmit = async () => {
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const payload = {
        reason,
        feedback: feedback.trim() || null,
        recommend_alternatives: recommendAlternatives,
        recommended_supervisors: recommendAlternatives ? selectedSupervisors.map(s => s.id) : [],
        suggested_keywords: suggestedKeywords.trim() || null,
      };

      await axios.post(route('supervision.requests.reject', request.id), payload);
      
      toast.success('Rejection sent to student');
      onRejected?.();
      onClose?.();
    } catch (error) {
      logError(error, 'DeclineSupervisionRequestModal handleSubmit');
      const message = error?.response?.data?.message || 'Failed to decline supervision request';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      // Reset form
      setReason('');
      setFeedback('');
      setRecommendAlternatives(false);
      setSelectedSupervisors([]);
      setSuggestedKeywords('');
      onClose?.();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? handleClose() : null)}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="h-6 w-6 text-red-600" />
            <DialogTitle className="text-xl font-semibold">Decline Supervision Request</DialogTitle>
          </div>
          <DialogDescription>
            Provide feedback to {studentName} and optionally suggest alternative supervisors.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-180px)]">
          <div className="px-6 pb-6 space-y-6">
            {/* Request Summary */}
            <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Request Summary</h3>
              
              <div className="flex items-start gap-3 mb-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-indigo-100 text-indigo-700 text-sm">
                    {studentName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium text-slate-900">{studentName}</div>
                  <div className="text-xs text-slate-500">{program}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Research Topic</div>
                  <div className="text-sm text-slate-900 mt-1">{researchTopic}</div>
                </div>
                
                {researchKeywords.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {researchKeywords.map((keyword, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Reason for Declining */}
            <section className="space-y-3">
              <Label htmlFor="reason">
                Reason for Declining <span className="text-red-500">*</span>
              </Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger id="reason">
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  {REJECTION_REASONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </section>

            {/* Additional Feedback */}
            <section className="space-y-3">
              <Label htmlFor="feedback">Additional Feedback (Optional)</Label>
              <Textarea
                id="feedback"
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Any constructive feedback about the proposal or suggestions for improvement..."
                className="resize-none"
              />
            </section>

            {/* Recommend Alternative Supervisors */}
            <section className="space-y-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="recommend"
                  checked={recommendAlternatives}
                  onCheckedChange={setRecommendAlternatives}
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label htmlFor="recommend" className="text-sm font-medium cursor-pointer">
                    Recommend alternative supervisors
                  </Label>
                  <p className="text-xs text-slate-500 mt-1">
                    Help the student by suggesting other supervisors who might be a better fit
                  </p>
                </div>
              </div>

              {recommendAlternatives && (
                <div className="space-y-4 pl-7">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Select Recommended Supervisors</Label>
                    <div className="space-y-2">
                      {recommendedSupervisors.map((supervisor) => (
                        <div
                          key={supervisor.id}
                          className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedSupervisors.find(s => s.id === supervisor.id)
                              ? 'border-indigo-300 bg-indigo-50'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                          onClick={() => handleSupervisorToggle(supervisor)}
                        >
                          <Checkbox
                            checked={!!selectedSupervisors.find(s => s.id === supervisor.id)}
                            onCheckedChange={() => handleSupervisorToggle(supervisor)}
                            className="mt-0.5"
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-slate-900">{supervisor.name}</div>
                            <div className="text-xs text-slate-500">{supervisor.expertise}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="keywords">Suggested Keywords for Supervisor Search</Label>
                    <Textarea
                      id="keywords"
                      rows={2}
                      value={suggestedKeywords}
                      onChange={(e) => setSuggestedKeywords(e.target.value)}
                      placeholder="e.g., Machine Learning, Natural Language Processing, Computer Vision..."
                      className="resize-none"
                    />
                  </div>
                </div>
              )}
            </section>

            {/* Message Preview */}
            {reason && (
              <section className="space-y-3">
                <Label>Message Preview</Label>
                <p className="text-xs text-slate-500">This message will be sent to the student:</p>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <pre className="text-xs text-slate-700 whitespace-pre-wrap font-sans">
                    {getMessagePreview()}
                  </pre>
                </div>
              </section>
            )}

            {/* Confirmation Alert */}
            <Alert className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-sm text-red-900">
                <strong className="font-semibold">Confirm Rejection</strong>
                <p className="mt-1">
                  This action will decline the supervision request and notify the student. The request will be moved to "Rejected" status and cannot be undone.
                </p>
              </AlertDescription>
            </Alert>
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="px-6 py-4 border-t bg-slate-50 flex items-center justify-end gap-3">
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
            className="bg-red-600 hover:bg-red-700"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Rejection & Notify Student
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

