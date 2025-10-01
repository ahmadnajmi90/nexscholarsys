import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { X, MessageSquare, Calendar, Video, FileText, History as HistoryIcon, CalendarClock, User2, GraduationCap, Mail, Phone, Globe, StickyNote, Trash2, Loader2, CheckCircle2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/Components/ui/tabs';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Avatar, AvatarFallback } from '@/Components/ui/avatar';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { Textarea } from '@/Components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip';
import ThreadPane from '@/Components/Messaging/ThreadPane';
import ScheduleMeetingDialog from '@/Pages/Supervision/Partials/ScheduleMeetingDialog';
import AttachmentPreviewModal from '@/Components/ProjectHub/AttachmentPreviewModal';
import AcceptSupervisionRequestModal from '@/Pages/Supervision/Partials/AcceptSupervisionRequestModal';
import DeclineSupervisionRequestModal from '@/Pages/Supervision/Partials/DeclineSupervisionRequestModal';
import { usePage } from '@inertiajs/react';
import { logError } from '@/Utils/logError';

export default function SupervisorRequestDetailCard({ request, onClose, onUpdated }) {
  const { auth } = usePage().props;
  const [activeTab, setActiveTab] = useState('overview');
  const [isScheduleMeetingOpen, setIsScheduleMeetingOpen] = useState(false);
  
  // Decision modals state
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  // Notes state
  const [notesList, setNotesList] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isDeletingNoteId, setIsDeletingNoteId] = useState(null);

  // Attachment preview state
  const [previewFile, setPreviewFile] = useState(null);

  // Maximum size for previewing files (15MB)
  const MAX_PREVIEW_SIZE = 15 * 1024 * 1024;

  // Use the relationship data from the request (if it exists)
  // Check if relationship exists and has an ID (only exists after request is accepted)
  const relationship = request?.relationship && request.relationship.id ? request.relationship : null;

  useEffect(() => {
    if (request?.id) {
      loadNotes();
    }
  }, [request?.id]);

  const loadNotes = async () => {
    if (!request?.id) return;
    try {
      const response = await axios.get(route('supervision.requests.notes.index', request.id));
      setNotesList(response.data.data || []);
    } catch (error) {
      logError(error, 'SupervisorRequestDetailCard loadNotes');
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || isAddingNote) return;
    setIsAddingNote(true);
    try {
      const response = await axios.post(route('supervision.requests.notes.store', request.id), {
        note: newNote.trim(),
      });
      setNotesList([response.data.data, ...notesList]);
      setNewNote('');
      toast.success('Note added');
    } catch (error) {
      logError(error, 'SupervisorRequestDetailCard handleAddNote');
      toast.error('Failed to add note');
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (isDeletingNoteId) return;
    setIsDeletingNoteId(noteId);
    try {
      await axios.delete(route('supervision.requests.notes.destroy', { request: request.id, note: noteId }));
      setNotesList(notesList.filter(n => n.id !== noteId));
      toast.success('Note deleted');
    } catch (error) {
      logError(error, 'SupervisorRequestDetailCard handleDeleteNote');
      toast.error('Failed to delete note');
    } finally {
      setIsDeletingNoteId(null);
    }
  };

  // Handle attachment preview
  const handleAttachmentClick = (attachment) => {
    // Check if file is previewable (image or PDF under 15MB)
    const isImage = attachment.mime_type && attachment.mime_type.startsWith('image/');
    const isPdf = attachment.mime_type === 'application/pdf';
    const isPreviewable = (isImage || isPdf) && attachment.size < MAX_PREVIEW_SIZE;

    if (isPreviewable) {
      // Transform attachment to preview modal format
      setPreviewFile({
        url: `/storage/${attachment.path}`,
        original_name: attachment.original_name || 'Attachment',
        mime_type: attachment.mime_type,
        size_formatted: attachment.size_formatted || `${(attachment.size / 1024).toFixed(1)} KB`,
        created_at: attachment.created_at,
      });
    } else {
      // For non-previewable files, open in new tab
      window.open(`/storage/${attachment.path}`, '_blank', 'noopener,noreferrer');
    }
  };

  if (!request) return null;

  const student = request?.student ?? {};
  const fullName = student.full_name ?? 'Student';
  const avatarUrl = student.profile_picture ? `/storage/${student.profile_picture}` : null;
  const status = request.status ?? 'pending';
  const conversationId = request?.conversation_id;

  // Get initials for avatar
  const initials = fullName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 3);

  // Format status for display
  const formattedStatus = status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'accepted':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'cancelled':
      case 'auto_cancelled':
        return 'bg-slate-50 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-end bg-black/50" onClick={onClose}>
        <div 
          className="w-full max-w-3xl h-full bg-white shadow-xl overflow-hidden flex flex-col animate-slide-in-right"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Section */}
          <div className="p-6 border-b">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
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
                  <h2 className="text-xl font-semibold text-slate-900">{fullName}</h2>
                  <p className="text-sm text-slate-600">Student</p>
                  <div className="mt-2 flex items-center gap-3 flex-wrap">
                    <Badge className={`${getStatusColor(status)} border`}>
                      {formattedStatus}
                    </Badge>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-4 border-b bg-slate-50">
            {/* Show decision buttons only for pending status */}
            {status === 'pending' && (
              <div className="flex gap-3 mb-3">
                <Button
                  variant="outline"
                  className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
                  onClick={() => setIsRejectModalOpen(true)}
                >
                  <X className="mr-2 h-4 w-4" />
                  Reject
                </Button>
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => setIsAcceptModalOpen(true)}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Accept
                </Button>
              </div>
            )}
            
            {/* Regular action buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setActiveTab('chat')}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Chat
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="flex-1">
                      <Button
                        variant="outline"
                        className="w-full"
                        disabled={!relationship}
                        onClick={() => setIsScheduleMeetingOpen(true)}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        Schedule Meeting
                      </Button>
                    </span>
                  </TooltipTrigger>
                  {!relationship && (
                    <TooltipContent>
                      <p>Please accept the request first to schedule meetings</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
              <Button
                className="flex-1 bg-slate-900 hover:bg-slate-800"
                disabled={!request?.meetings || request.meetings.length === 0}
                onClick={() => {
                  const nextMeeting = request?.meetings?.[0];
                  if (nextMeeting?.location_link) {
                    window.open(nextMeeting.location_link, '_blank', 'noopener,noreferrer');
                  }
                }}
              >
                <Video className="mr-2 h-4 w-4" />
                Join Meeting
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex-1 overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="px-6 bg-gray-100 w-full justify-start rounded-none h-auto p-0 gap-0">
                <TabsTrigger 
                  value="overview"
                  className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=inactive]:bg-transparent rounded-none px-6 py-3"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="proposal"
                  className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=inactive]:bg-transparent rounded-none px-6 py-3"
                >
                  Proposal
                </TabsTrigger>
                <TabsTrigger 
                  value="chat"
                  className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=inactive]:bg-transparent rounded-none px-6 py-3"
                >
                  Chat
                </TabsTrigger>
                <TabsTrigger 
                  value="notes"
                  className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=inactive]:bg-transparent rounded-none px-6 py-3"
                >
                  Notes
                </TabsTrigger>
                <TabsTrigger 
                  value="history"
                  className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=inactive]:bg-transparent rounded-none px-6 py-3"
                >
                  History
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-auto">
                <TabsContent value="overview" className="mt-0 h-full">
                  <ScrollArea className="h-full">
                    <OverviewTab request={request} student={student} />
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="proposal" className="mt-0 h-full">
                  <ScrollArea className="h-full">
                    <ProposalTab request={request} onAttachmentClick={handleAttachmentClick} />
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="chat" className="mt-0 h-full">
                  {conversationId ? (
                    <div className="p-6 h-full">
                      <div className="border border-slate-200 rounded-lg bg-white shadow-sm h-full overflow-hidden">
                        <ThreadPane
                          conversationId={conversationId}
                          auth={auth}
                          onConversationRead={() => {}}
                          onConversationIncrementUnread={() => {}}
                          onAfterSend={() => onUpdated?.()}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="p-6">
                      <div className="border border-slate-200 rounded-lg p-6 bg-white shadow-sm">
                        <p className="text-sm text-slate-500">No conversation available yet.</p>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="notes" className="mt-0 h-full">
                  <ScrollArea className="h-full">
                    <NotesTab
                      notesList={notesList}
                      newNote={newNote}
                      setNewNote={setNewNote}
                      isAddingNote={isAddingNote}
                      isDeletingNoteId={isDeletingNoteId}
                      onAddNote={handleAddNote}
                      onDeleteNote={handleDeleteNote}
                    />
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="history" className="mt-0 h-full">
                  <ScrollArea className="h-full">
                    <HistoryTab request={request} />
                  </ScrollArea>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Accept Supervision Request Modal */}
      <AcceptSupervisionRequestModal
        isOpen={isAcceptModalOpen}
        request={request}
        onClose={() => setIsAcceptModalOpen(false)}
        onAccepted={() => {
          setIsAcceptModalOpen(false);
          onUpdated?.();
        }}
      />

      {/* Decline Supervision Request Modal */}
      <DeclineSupervisionRequestModal
        isOpen={isRejectModalOpen}
        request={request}
        onClose={() => setIsRejectModalOpen(false)}
        onRejected={() => {
          setIsRejectModalOpen(false);
          onUpdated?.();
        }}
      />

      {/* Schedule Meeting Dialog */}
      <ScheduleMeetingDialog
        relationship={isScheduleMeetingOpen ? relationship : null}
        onClose={() => setIsScheduleMeetingOpen(false)}
        onScheduled={() => {
          setIsScheduleMeetingOpen(false);
          onUpdated?.();
        }}
      />

      {/* Attachment Preview Modal */}
      <AttachmentPreviewModal
        file={previewFile}
        onClose={() => setPreviewFile(null)}
      />
    </>
  );
}

function OverviewTab({ request, student }) {
  const submittedAt = request?.submitted_at ? format(new Date(request.submitted_at), 'dd/MM/yyyy') : '—';
  const meetings = request?.meetings ?? [];
  const hasMeetings = meetings.length > 0;

  return (
    <div className="p-6 space-y-6">
      {/* Student Summary Card */}
      <section className="border border-slate-200 rounded-lg p-6 bg-white shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Student Summary</h3>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InfoItem icon={User2} label="Full Name" value={student.full_name || '—'} />
            <InfoItem icon={Mail} label="Email" value={student.email || '—'} />
            <InfoItem icon={Phone} label="Phone" value={student.phone_number || '—'} />
            <InfoItem icon={Globe} label="Nationality" value={student.nationality || '—'} />
          </div>

          {student.university && (
            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-4">
                <InfoItem icon={GraduationCap} label="University" value={student.university.name || '—'} />
                {student.faculty && (
                  <InfoItem icon={GraduationCap} label="Faculty" value={student.faculty.name || '—'} />
                )}
              </div>
            </div>
          )}

          {(student.bachelor || student.master) && (
            <div className="pt-4 border-t">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Academic Background</h4>
              <div className="grid grid-cols-2 gap-4">
                {student.bachelor && (
                  <InfoItem label="Bachelor's Degree" value={student.bachelor} />
                )}
                {student.CGPA_bachelor && (
                  <InfoItem label="Bachelor's CGPA" value={student.CGPA_bachelor} />
                )}
                {student.master && (
                  <InfoItem label="Master's Degree" value={student.master} />
                )}
                {student.master_type && (
                  <InfoItem label="Master's Type" value={student.master_type} />
                )}
              </div>
            </div>
          )}

          {student.english_proficiency_level && (
            <div className="pt-4 border-t">
              <InfoItem label="English Proficiency" value={student.english_proficiency_level} />
            </div>
          )}

          {student.bio && (
            <div className="pt-4 border-t">
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Bio</h4>
              <p className="text-sm text-slate-600 leading-relaxed">{student.bio}</p>
            </div>
          )}

          {student.suggested_research_title && (
            <div className="pt-4 border-t">
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Research Interest</h4>
              <p className="text-sm font-medium text-slate-800">{student.suggested_research_title}</p>
              {student.suggested_research_description && (
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">{student.suggested_research_description}</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Proposal Summary Card */}
      <section className="border border-slate-200 rounded-lg p-6 bg-white shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Proposal Summary</h3>

        <div className="space-y-4">
          <h4 className="text-base font-semibold text-slate-900">
            {request.proposal_title ?? 'Untitled Proposal'}
          </h4>
          
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
            Motivation: {request.motivation ?? 'No motivation provided.'}
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <div>
              <div className="text-sm text-slate-500 mb-1">Sent:</div>
              <div className="font-medium text-slate-900">{submittedAt}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Meeting Details Card - Only show if meetings exist */}
      {hasMeetings && (
        <section className="border border-slate-200 rounded-lg p-6 bg-white shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <CalendarClock className="h-5 w-5 text-slate-900" />
            <h3 className="text-lg font-semibold text-slate-900">Meeting Details</h3>
          </div>

          <div className="space-y-4">
            {meetings.map((meeting, index) => (
              <div key={meeting.id || index} className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-slate-500 mb-1">Date:</div>
                  <div className="font-medium text-slate-900">
                    {meeting.scheduled_for ? format(new Date(meeting.scheduled_for), 'MMMM d, yyyy') : '—'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-500 mb-1">Type:</div>
                  <div className="font-medium text-slate-900">
                    {meeting.type || 'Online'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2">
      {Icon && <Icon className="mt-0.5 h-4 w-4 text-slate-400 flex-shrink-0" />}
      <div className="min-w-0">
        <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
        <div className="text-sm text-slate-700 break-words">{value || '—'}</div>
      </div>
    </div>
  );
}

function ProposalTab({ request, onAttachmentClick }) {
  const attachments = request?.attachments ?? [];

  return (
    <div className="p-6 space-y-6">
      {/* Research Proposal Card */}
      <section className="border border-slate-200 rounded-lg p-6 bg-white shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Research Proposal</h3>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Title</h4>
            <p className="text-base text-slate-900">{request.proposal_title ?? 'Untitled'}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Motivation</h4>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {request.motivation ?? 'No motivation provided.'}
            </p>
          </div>

          {/* Attachments */}
          {attachments.length > 0 && (
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Attachments</h4>
              <div className="space-y-2">
                {attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="p-2 bg-indigo-50 rounded-md">
                        <FileText className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {attachment.original_name || 'Attachment'}
                        </p>
                        <p className="text-xs text-slate-500 capitalize">
                          {attachment.type?.replace('_', ' ') || 'Document'}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onAttachmentClick(attachment)}
                    >
                      View File
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function NotesTab({ notesList, newNote, setNewNote, isAddingNote, isDeletingNoteId, onAddNote, onDeleteNote }) {
  return (
    <div className="p-6 space-y-6">
      {/* Add Note Section */}
      <section className="border border-slate-200 rounded-lg p-6 bg-white shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <StickyNote className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-slate-900">Add Private Note</h3>
        </div>
        <p className="text-sm text-slate-500 mb-4">
          These notes are private and only visible to you. Students cannot see them.
        </p>
        <Textarea
          rows={4}
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Write your note here..."
          className="mb-3"
        />
        <Button onClick={onAddNote} disabled={!newNote.trim() || isAddingNote}>
          {isAddingNote && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Add Note
        </Button>
      </section>

      {/* Notes List */}
      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-900">All Notes ({notesList.length})</h3>
        
        {notesList.length === 0 ? (
          <div className="border border-slate-200 rounded-lg p-6 bg-slate-50 text-center">
            <StickyNote className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-500">No notes yet. Add your first note above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notesList.map((note) => (
              <div key={note.id} className="border border-slate-200 rounded-lg p-4 bg-white shadow-sm">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <div className="text-xs text-slate-500">
                      {note.created_at ? format(new Date(note.created_at), 'PPpp') : 'Just now'}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteNote(note.id)}
                    disabled={isDeletingNoteId === note.id}
                    className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                  >
                    {isDeletingNoteId === note.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">{note.note}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function HistoryTab({ request }) {
  const timeline = [
    {
      id: 1,
      title: 'Proposal Submitted',
      date: request?.submitted_at,
      status: 'completed',
    },
    {
      id: 2,
      title: 'Under Review',
      date: request?.submitted_at,
      status: request?.status === 'pending' ? 'current' : 'completed',
    },
    {
      id: 3,
      title: request?.meetings?.length > 0 ? 'Meeting Scheduled' : 'Meeting Scheduled',
      date: request?.meetings?.[0]?.scheduled_for,
      status: request?.meetings?.length > 0 ? 'completed' : 'pending',
    },
    {
      id: 4,
      title: 'Decision',
      date: request?.decision_at,
      status: request?.status !== 'pending' ? 'completed' : 'pending',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'current':
        return 'bg-blue-500';
      case 'pending':
        return 'bg-slate-300';
      default:
        return 'bg-slate-300';
    }
  };

  return (
    <div className="p-6">
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Timeline</h3>

        <div className="space-y-4">
          {timeline.map((event, index) => (
            <div key={event.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(event.status)}`} />
                {index < timeline.length - 1 && (
                  <div className="w-0.5 h-full bg-slate-200 mt-2" />
                )}
              </div>
              <div className="flex-1 pb-8">
                <h4 className="font-medium text-slate-900">{event.title}</h4>
                <p className="text-sm text-slate-500">
                  {event.date ? format(new Date(event.date), 'dd/MM/yyyy') : 'TBD'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}