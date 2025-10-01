import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Label } from '@/Components/ui/label';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { Checkbox } from '@/Components/ui/checkbox';
import { Loader2, UploadCloud, Paperclip, User2, Building2, GraduationCap, Lightbulb } from 'lucide-react';
import { logError } from '@/Utils/logError';

const ATTACHMENT_FIELDS = [
  { key: 'proposal', label: 'Research proposal (PDF/DOC/DOCX)', accept: '.pdf,.doc,.docx', required: true },
  { key: 'transcript', label: 'Academic transcript (PDF)', accept: '.pdf' },
  { key: 'background', label: 'Research background (PDF/DOC/DOCX)', accept: '.pdf,.doc,.docx' },
  { key: 'portfolio', label: 'Portfolio or supplementary materials', accept: '*' },
];

const resolveAcademicianId = (sup) =>
  sup?.user?.academician?.academician_id
    ?? sup?.academician?.academician_id
    ?? sup?.academician_id
    ?? '';

export default function ProposalModal({ isOpen, supervisor, onClose, onSubmitted }) {
  const [academicianId, setAcademicianId] = useState('');
  const [postgraduateProgramId, setPostgraduateProgramId] = useState('');
  const [proposalTitle, setProposalTitle] = useState('');
  const [motivation, setMotivation] = useState('');
  const [attachments, setAttachments] = useState({
    proposal: null,
    transcript: null,
    background: null,
    portfolio: null,
  });
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOriginalWork, setIsOriginalWork] = useState(false);

  useEffect(() => {
    if (isOpen && supervisor) {
      const identifier = resolveAcademicianId(supervisor);
      console.log('ProposalModal opened', {
        supervisor,
        identifier,
        postgraduate_program_id: supervisor?.postgraduate_program_id,
      });
      setAcademicianId(identifier ? String(identifier) : '');
      setPostgraduateProgramId(supervisor?.postgraduate_program_id || '');
      setProposalTitle('');
      setMotivation('');
      setAttachments({
        proposal: null,
        transcript: null,
        background: null,
        portfolio: null,
      });
      setSubmitError(null);
      setIsOriginalWork(false);
    } else if (!isOpen) {
      setAcademicianId('');
      setPostgraduateProgramId('');
      setProposalTitle('');
      setMotivation('');
      setAttachments({
        proposal: null,
        transcript: null,
        background: null,
        portfolio: null,
      });
      setSubmitError(null);
      setIsOriginalWork(false);
    }
  }, [isOpen, supervisor]);

  const canSubmit = Boolean(
    academicianId &&
    proposalTitle?.trim() &&
    motivation?.trim() &&
    attachments?.proposal &&
    isOriginalWork
  );

  const handleFileChange = (key, file) => {
    setAttachments((prev) => ({
      ...prev,
      [key]: file,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit || isSubmitting) return;

    const formData = new FormData();
    formData.append('academician_id', academicianId);
    if (postgraduateProgramId) {
      formData.append('postgraduate_program_id', postgraduateProgramId);
    }
    formData.append('proposal_title', proposalTitle);
    formData.append('motivation', motivation);

    ATTACHMENT_FIELDS.forEach(({ key }) => {
      const file = attachments[key];
      if (file) {
        formData.append(`attachments[${key}]`, file);
      }
    });

    try {
      setIsSubmitting(true);
      await axios.post(route('supervision.requests.store'), formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Supervision request submitted');
      onSubmitted?.();
    } catch (error) {
      logError(error, 'ProposalModal handleSubmit');
      const message = error?.response?.data?.message || 'Failed to submit your supervision request';
      setSubmitError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Extract supervisor information
  const academician = supervisor?.academician ?? supervisor;
  const supervisorName = academician?.full_name ?? 'Supervisor';
  const currentPosition = academician?.current_position ?? '';
  const university = academician?.university?.name ?? academician?.universityDetails?.full_name ?? '';
  const researchDomains = academician?.research_domains ?? [];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? onClose?.() : null)}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Submit supervision request</DialogTitle>
          <DialogDescription>
            Provide a strong proposal and supporting documents to help your prospective supervisor understand your research direction and readiness.
          </DialogDescription>
        </DialogHeader>

        {submitError && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        {/* Supervisor Info Section */}
        <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-indigo-100 p-2">
              <User2 className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="flex-1 space-y-2">
              <div>
                <h3 className="font-semibold text-slate-900">{supervisorName}</h3>
                {currentPosition && (
                  <div className="flex items-center gap-1.5 text-sm text-slate-600 mt-1">
                    <GraduationCap className="h-3.5 w-3.5" />
                    <span>{currentPosition}</span>
                  </div>
                )}
                {university && (
                  <div className="flex items-center gap-1.5 text-sm text-slate-600 mt-1">
                    <Building2 className="h-3.5 w-3.5" />
                    <span>{university}</span>
                  </div>
                )}
              </div>
              {researchDomains.length > 0 && (
                <div className="flex items-start gap-1.5 text-sm text-slate-700">
                  <Lightbulb className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Focus: </span>
                    <span>{researchDomains.join(', ')}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="proposal_title">Proposal title</Label>
              <Input
                id="proposal_title"
                value={proposalTitle}
                onChange={(event) => setProposalTitle(event.target.value)}
                placeholder="e.g. Exploring AI-driven multimodal learning analytics"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="motivation">Motivation</Label>
              <Textarea
                id="motivation"
                value={motivation}
                onChange={(event) => setMotivation(event.target.value)}
                rows={6}
                placeholder="Describe your research goals, why you want to work with this supervisor, and how your background supports the project."
                required
              />
            </div>
          </section>

          <section className="space-y-4">
            <div className="space-y-2">
              <Label>Attachments</Label>
              <p className="text-xs text-slate-500">Upload the required proposal and any supporting documents. PDFs are preferred for readability.</p>
            </div>
            <div className="space-y-4">
              {ATTACHMENT_FIELDS.map(({ key, label, accept, required }) => {
                const file = attachments[key];
                return (
                  <div key={key} className="rounded-lg border border-dashed border-slate-200 p-4">
                    <Label className="flex items-center justify-between text-sm font-medium text-slate-700">
                      <span>{label}{required && <span className="ml-1 text-red-500">*</span>}</span>
                      <Button type="button" variant="outline" size="sm" asChild>
                        <label className="flex cursor-pointer items-center gap-2">
                          <UploadCloud className="h-4 w-4" />
                          {file ? 'Replace file' : 'Upload file'}
                          <input
                            type="file"
                            accept={accept}
                            className="sr-only"
                            onChange={(event) => handleFileChange(key, event.target.files?.[0] ?? null)}
                          />
                        </label>
                      </Button>
                    </Label>
                    {file ? (
                      <div className="mt-3 flex items-center gap-2 rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-600">
                        <Paperclip className="h-3.5 w-3.5" />
                        <span className="truncate" title={file.name}>{file.name}</span>
                        <span className="text-slate-400">({formatFileSize(file.size)})</span>
                      </div>
                    ) : (
                      <p className="mt-3 text-xs text-slate-500">
                        {required ? 'Required attachment.' : 'Optional — add if it strengthens your proposal.'}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Originality Confirmation */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start gap-3">
              <Checkbox
                id="original-work"
                checked={isOriginalWork}
                onCheckedChange={setIsOriginalWork}
                className="mt-1"
              />
              <div className="flex-1">
                <Label
                  htmlFor="original-work"
                  className="text-sm font-medium leading-relaxed text-slate-900 cursor-pointer"
                >
                  I confirm that this proposal is original and written by me.
                  <span className="ml-1 text-red-500">*</span>
                </Label>
                <p className="mt-1 text-xs text-slate-500">
                  By checking this box, you affirm that the proposal content and attached documents represent your own work and ideas.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={!canSubmit || isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Submit request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function formatFileSize(bytes) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const size = bytes / Math.pow(1024, index);
  return `${size.toFixed(size > 100 ? 0 : 1)} ${units[index]}`;
}

