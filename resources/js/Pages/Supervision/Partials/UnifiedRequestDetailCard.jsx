import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, MessageSquare, Calendar, Video, User2, FileText, CheckCircle2, 
  History as HistoryIcon, CalendarClock, GraduationCap, Mail, Phone, 
  Globe, Briefcase, StickyNote, Trash2, Loader2 
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/Components/ui/tabs';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Avatar, AvatarFallback } from '@/Components/ui/avatar';
import { Separator } from '@/Components/ui/separator';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { Textarea } from '@/Components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip';
import ThreadPane from '@/Components/Messaging/ThreadPane';
import AttachmentPreviewModal from '@/Components/ProjectHub/AttachmentPreviewModal';
import AcceptSupervisorOfferModal from '@/Pages/Supervision/Partials/AcceptSupervisorOfferModal';
import AcceptSupervisionRequestModal from '@/Pages/Supervision/Partials/AcceptSupervisionRequestModal';
import DeclineSupervisionRequestModal from '@/Pages/Supervision/Partials/DeclineSupervisionRequestModal';
import ScheduleMeetingDialog from '@/Pages/Supervision/Partials/ScheduleMeetingDialog';
import { usePage } from '@inertiajs/react';
import { logError } from '@/Utils/logError';
import { OVERLAY_ANIMATION, SLIDE_PANEL_ANIMATION } from '@/Utils/modalAnimations';
import { getStatusColor, formatStatus, getInitials, handleAttachmentClick as utilHandleAttachmentClick } from '@/Utils/supervisionHelpers';

/**
 * Unified Request Detail Card
 * Replaces: RequestDetailCard.jsx + SupervisorRequestDetailCard.jsx
 * 
 * @param {Object} request - The supervision request
 * @param {Function} onClose - Close handler
 * @param {Function} onUpdated - Update handler
 * @param {string} userRole - 'student' or 'supervisor' (who is viewing)
 */
export default function UnifiedRequestDetailCard({ request, onClose, onUpdated, userRole }) {
  const { auth } = usePage().props;
  const [activeTab, setActiveTab] = useState('overview');
  
  // Modal states
  const [isAcceptOfferModalOpen, setIsAcceptOfferModalOpen] = useState(false); // Student only
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false); // Supervisor only
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false); // Supervisor only
  const [isScheduleMeetingOpen, setIsScheduleMeetingOpen] = useState(false); // Supervisor only

  // Notes state (Supervisor only)
  const [notesList, setNotesList] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isDeletingNoteId, setIsDeletingNoteId] = useState(null);

  // Attachment preview state
  const [previewFile, setPreviewFile] = useState(null);

  // Maximum size for previewing files (15MB)
  const MAX_PREVIEW_SIZE = 15 * 1024 * 1024;

  // Get relationship data (supervisor view only, after request accepted)
  const relationship = request?.relationship && request.relationship.id ? request.relationship : null;

  // Load notes for supervisor
  useEffect(() => {
    if (userRole === 'supervisor' && request?.id) {
      loadNotes();
    }
  }, [userRole, request?.id]);

  const loadNotes = async () => {
    if (!request?.id) return;
    try {
      const response = await axios.get(route('supervision.requests.notes.index', request.id));
      setNotesList(response.data.data || []);
    } catch (error) {
      logError(error, 'UnifiedRequestDetailCard loadNotes');
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
      logError(error, 'UnifiedRequestDetailCard handleAddNote');
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
      logError(error, 'UnifiedRequestDetailCard handleDeleteNote');
      toast.error('Failed to delete note');
    } finally {
      setIsDeletingNoteId(null);
    }
  };

  // Handle attachment preview
  const handleAttachmentClickLocal = (attachment) => {
    utilHandleAttachmentClick(attachment, setPreviewFile, MAX_PREVIEW_SIZE);
  };

  if (!request) return null;

  // Get person data based on user role
  const person = userRole === 'student' ? (request?.academician ?? {}) : (request?.student ?? {});
  const fullName = person.full_name ?? (userRole === 'student' ? 'Supervisor' : 'Student');
  const currentPosition = userRole === 'student' ? (person.current_position ?? '') : null;
  const avatarUrl = person.profile_picture ? `/storage/${person.profile_picture}` : null;
  const university = userRole === 'student' ? (person.university?.name ?? '') : null;
  const status = request.status ?? 'pending';
  const conversationId = request?.conversation_id;
  
  // Disable all interactive features if request is not pending
  const isInteractive = status === 'pending' || status === 'pending_student_acceptance';

  // Get initials for avatar
  const initials = getInitials(fullName);

  // Format status for display
  const formattedStatus = formatStatus(status);

  return (
    <>
      <AnimatePresence>
        <motion.div 
          {...OVERLAY_ANIMATION}
          className="fixed inset-0 z-40 flex items-center justify-end bg-black/50" 
          onClick={onClose}
        >
          <motion.div 
            {...SLIDE_PANEL_ANIMATION}
            className="w-full max-w-3xl h-full bg-white shadow-xl overflow-hidden flex flex-col"
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
                    {userRole === 'student' ? (
                      university && <span className="text-sm text-slate-600">{university}</span>
                    ) : (
                      <p className="text-sm text-slate-600">Student</p>
                    )}
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
              {userRole === 'student' ? (
                // Student view - Show Accept button for pending_student_acceptance and Join Meeting
                <>
                  {status === 'pending_student_acceptance' && (
                    <div className="mb-3">
                      <Button
                        onClick={() => setIsAcceptOfferModalOpen(true)}
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Accept Supervisor Offer
                      </Button>
                    </div>
                  )}

                  {/* Regular action buttons - only show if interactive */}
                  {isInteractive && (
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setActiveTab('chat')}
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Chat
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        disabled
                        title="Only supervisors can schedule meetings"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        Schedule
                      </Button>
                      <Button
                        className="flex-1 bg-slate-900 hover:bg-slate-800"
                        disabled={
                          !request?.meetings || 
                          request.meetings.length === 0 || 
                          !request.meetings[0]?.location_link
                        }
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
                  )}

                  {!isInteractive && status !== 'pending_student_acceptance' && (
                    <div className="text-sm text-slate-600 text-center py-2">
                      {status === 'pending' && 'Waiting for supervisor response...'}
                      {status === 'accepted' && 'This request has been accepted'}
                      {status === 'rejected' && 'This request was not accepted'}
                      {(status === 'cancelled' || status === 'auto_cancelled') && 'This request has been cancelled'}
                    </div>
                  )}
                </>
              ) : (
                // Supervisor view - Show Accept/Decline and Schedule Meeting buttons
                <>
                  {status === 'pending' && (
                    <div className="flex gap-3 mb-3">
                      <Button
                        onClick={() => setIsAcceptModalOpen(true)}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Accept Request
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsRejectModalOpen(true)}
                        className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Decline Request
                      </Button>
                    </div>
                  )}
                  
                  {(status === 'pending' || status === 'pending_student_acceptance') && (
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setIsScheduleMeetingOpen(true)}
                        className="flex-1"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        Schedule Meeting
                      </Button>
                      <Button
                        className="flex-1 bg-slate-900 hover:bg-slate-800"
                        disabled={
                          !request?.meetings || 
                          request.meetings.length === 0 || 
                          !request.meetings[0]?.location_link
                        }
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
                  )}

                  {status === 'pending_student_acceptance' && (
                    <div className="mt-3 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded p-3 text-center">
                      Waiting for student to accept your offer
                    </div>
                  )}

                  {status === 'accepted' && (
                    <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded p-3 text-center">
                      ✓ Request accepted - Supervision relationship is active
                    </div>
                  )}

                  {status === 'rejected' && (
                    <div className="text-sm text-slate-600 text-center py-2">
                      This request was declined
                    </div>
                  )}

                  {(status === 'cancelled' || status === 'auto_cancelled') && (
                    <div className="text-sm text-slate-600 text-center py-2">
                      This request was cancelled by the student
                    </div>
                  )}
                </>
              )}
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
                    value="documents"
                    className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=inactive]:bg-transparent rounded-none px-6 py-3"
                  >
                    Documents
                  </TabsTrigger>
                  <TabsTrigger 
                    value="chat"
                    className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=inactive]:bg-transparent rounded-none px-6 py-3"
                  >
                    Chat
                  </TabsTrigger>
                  {userRole === 'supervisor' && (
                    <TabsTrigger 
                      value="notes"
                      className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=inactive]:bg-transparent rounded-none px-6 py-3"
                    >
                      Notes
                    </TabsTrigger>
                  )}
                  <TabsTrigger 
                    value="history"
                    className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=inactive]:bg-transparent rounded-none px-6 py-3"
                  >
                    History
                  </TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-auto">
                  {/* Overview Tab */}
                  <TabsContent value="overview" className="mt-0 h-full">
                    <ScrollArea className="h-full">
                      <OverviewTab 
                        request={request} 
                        person={person} 
                        userRole={userRole}
                        currentPosition={currentPosition}
                      />
                    </ScrollArea>
                  </TabsContent>

                  {/* Proposal Tab */}
                  <TabsContent value="proposal" className="mt-0 h-full">
                    <ScrollArea className="h-full">
                      <ProposalTab request={request} onAttachmentClick={handleAttachmentClickLocal} userRole={userRole} />
                    </ScrollArea>
                  </TabsContent>

                  {/* Documents Tab */}
                  <TabsContent value="documents" className="mt-0 h-full">
                    <ScrollArea className="h-full">
                      <DocumentsTab 
                        request={request} 
                        onAttachmentClick={handleAttachmentClickLocal} 
                      />
                    </ScrollArea>
                  </TabsContent>

                  {/* Chat Tab */}
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

                  {/* Notes Tab - Supervisor only */}
                  {userRole === 'supervisor' && (
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
                          isReadOnly={!isInteractive}
                        />
                      </ScrollArea>
                    </TabsContent>
                  )}

                  {/* History Tab */}
                  <TabsContent value="history" className="mt-0 h-full">
                    <ScrollArea className="h-full">
                      <HistoryTab request={request} />
                    </ScrollArea>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Attachment Preview Modal */}
      <AttachmentPreviewModal
        file={previewFile}
        onClose={() => setPreviewFile(null)}
      />

      {/* Student: Accept Offer Modal */}
      {userRole === 'student' && (
        <AcceptSupervisorOfferModal
          request={request}
          isOpen={isAcceptOfferModalOpen}
          onClose={() => setIsAcceptOfferModalOpen(false)}
          onAccepted={() => {
            setIsAcceptOfferModalOpen(false);
            onUpdated?.();
            onClose?.();
          }}
        />
      )}

      {/* Supervisor: Accept Request Modal */}
      {userRole === 'supervisor' && (
        <>
          <AcceptSupervisionRequestModal
            request={request}
            isOpen={isAcceptModalOpen}
            onClose={() => setIsAcceptModalOpen(false)}
            onAccepted={() => {
              setIsAcceptModalOpen(false);
              onUpdated?.();
            }}
          />

          <DeclineSupervisionRequestModal
            request={request}
            isOpen={isRejectModalOpen}
            onClose={() => setIsRejectModalOpen(false)}
            onDeclined={() => {
              setIsRejectModalOpen(false);
              onUpdated?.();
              onClose?.();
            }}
          />

          <ScheduleMeetingDialog
            request={isScheduleMeetingOpen && !relationship ? request : null}
            relationship={isScheduleMeetingOpen && relationship ? relationship : null}
            onClose={() => setIsScheduleMeetingOpen(false)}
            onScheduled={() => {
              setIsScheduleMeetingOpen(false);
              onUpdated?.();
            }}
            userRole="supervisor"
          />
        </>
      )}
    </>
  );
}

/**
 * Overview Tab Component
 */
function OverviewTab({ request, person, userRole, currentPosition }) {
  const submittedAt = request?.submitted_at ? format(new Date(request.submitted_at), 'dd/MM/yyyy HH:mm') : '—';

  return (
    <div className="p-6 space-y-6">
      {/* Person Profile Section */}
      <section className="border border-slate-200 rounded-lg p-6 bg-white shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          {userRole === 'student' ? 'Supervisor Profile' : 'Student Profile'}
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InfoItem icon={User2} label="Full Name" value={person.full_name || '—'} />
            {userRole === 'student' ? (
              <>
                {currentPosition && (
                  <InfoItem icon={Briefcase} label="Position" value={currentPosition} />
                )}
                <InfoItem icon={Mail} label="Email" value={person.email || '—'} />
                <InfoItem icon={Phone} label="Phone" value={person.phone_number || '—'} />
              </>
            ) : (
              <>
                <InfoItem icon={Mail} label="Email" value={person.email || person.user?.email || '—'} />
                <InfoItem icon={Phone} label="Phone" value={person.phone_number || '—'} />
                <InfoItem icon={Globe} label="Nationality" value={person.nationality || '—'} />
              </>
            )}
          </div>

          {userRole === 'student' && (person.university || person.faculty || person.department) && (
            <div className="pt-4 border-t">
              <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-slate-500" />
                Institution
              </h4>
              <div className="space-y-2">
                {person.university && (
                  <div className="text-sm">
                    <span className="font-medium text-slate-700">University: </span>
                    <span className="text-slate-600">{person.university.name || person.university.full_name || '—'}</span>
                  </div>
                )}
                {person.faculty && (
                  <div className="text-sm">
                    <span className="font-medium text-slate-700">Faculty: </span>
                    <span className="text-slate-600">{person.faculty.name || '—'}</span>
                  </div>
                )}
                {person.department && (
                  <div className="text-sm">
                    <span className="font-medium text-slate-700">Department: </span>
                    <span className="text-slate-600">{person.department}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {userRole === 'student' && person.research_areas && Array.isArray(person.research_areas) && person.research_areas.length > 0 && (
            <div className="pt-4 border-t">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Research Expertise</h4>
              <div className="flex flex-wrap gap-2">
                {person.research_areas.slice(0, 3).map((area, index) => (
                  <span key={index} className="px-2.5 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {area}
                  </span>
                ))}
                {person.research_areas.length > 3 && (
                  <span className="px-2.5 py-1 text-xs rounded-full bg-slate-100 text-slate-600">
                    +{person.research_areas.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {userRole === 'student' && person.bio && (
            <div className="pt-4 border-t">
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Bio</h4>
              <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 break-words max-w-full">{person.bio}</p>
            </div>
          )}

          {userRole === 'supervisor' && person.university_details && (
            <div className="pt-4 border-t">
              <InfoItem icon={GraduationCap} label="University" value={person.university_details.full_name || '—'} />
              {person.faculty && (
                <InfoItem icon={GraduationCap} label="Faculty" value={person.faculty.name || '—'} />
              )}
            </div>
          )}
        </div>
      </section>

      {/* Request Details Section */}
      <section className="border border-slate-200 rounded-lg p-6 bg-white shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Request Details</h3>

        <div className="space-y-4">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-400">Proposal Title</div>
            <div className="text-sm text-slate-700 font-medium break-words max-w-full">{request.proposal_title || '—'}</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InfoItem label="Submitted" value={submittedAt} />
            <InfoItem label="Status" value={formatStatus(request.status)} />
          </div>
        </div>
      </section>
    </div>
  );
}

/**
 * Proposal Tab Component
 */
function ProposalTab({ request, onAttachmentClick, userRole }) {
  const attachments = request?.attachments ?? [];
  
  // Abstract state
  const [abstract, setAbstract] = useState(null);
  const [isEditingAbstract, setIsEditingAbstract] = useState(false);
  const [abstractText, setAbstractText] = useState('');
  const [isLoadingAbstract, setIsLoadingAbstract] = useState(true);
  const [isSavingAbstract, setIsSavingAbstract] = useState(false);

  // Load abstract on mount
  useEffect(() => {
    loadAbstract();
  }, [request.id]);

  const loadAbstract = async () => {
    try {
      const response = await axios.get(route('supervision.requests.abstract.show', request.id));
      setAbstract(response.data.data);
      setAbstractText(response.data.data?.abstract || '');
    } catch (error) {
      logError(error, 'ProposalTab loadAbstract');
    } finally {
      setIsLoadingAbstract(false);
    }
  };

  const handleSaveAbstract = async () => {
    setIsSavingAbstract(true);
    try {
      await axios.put(route('supervision.requests.abstract.update', request.id), {
        abstract: abstractText
      });
      toast.success('Abstract saved successfully');
      setIsEditingAbstract(false);
      await loadAbstract();
    } catch (error) {
      logError(error, 'ProposalTab handleSaveAbstract');
      toast.error(error.response?.data?.message || 'Failed to save abstract');
    } finally {
      setIsSavingAbstract(false);
    }
  };

  const handleEditAbstract = () => {
    setIsEditingAbstract(!isEditingAbstract);
    if (!isEditingAbstract) {
      setAbstractText(abstract?.abstract || '');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <section className="border border-slate-200 rounded-lg p-6 bg-white shadow-sm w-[720px]">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Research Proposal</h3>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Title</h4>
            <p className="text-base text-slate-900 break-words max-w-full">{request.proposal_title ?? 'Untitled'}</p>
          </div>

          {/* Abstract Section */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                Abstract
              </h4>
              {userRole === 'student' && request.status === 'pending' && !isLoadingAbstract && (
                <Button size="sm" variant="outline" onClick={handleEditAbstract}>
                  {isEditingAbstract ? 'Cancel' : 'Edit'}
                </Button>
              )}
            </div>
            
            {isLoadingAbstract ? (
              <div className="flex items-center gap-2 text-slate-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Loading abstract...</span>
              </div>
            ) : abstract?.extraction_status === 'failed' ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800 mb-2">
                  Could not extract abstract automatically. Please enter it manually.
                </p>
                {abstract.extraction_error && (
                  <p className="text-xs text-yellow-600 mb-3">{abstract.extraction_error}</p>
                )}
                {userRole === 'student' && request.status === 'pending' && (
                  <>
                    <Textarea 
                      value={abstractText}
                      onChange={(e) => setAbstractText(e.target.value)}
                      placeholder="Enter your abstract here (minimum 50 characters)..."
                      rows={6}
                      className="mb-2"
                    />
                    <Button 
                      onClick={handleSaveAbstract} 
                      disabled={isSavingAbstract || abstractText.length < 50}
                      size="sm"
                    >
                      {isSavingAbstract && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Abstract
                    </Button>
                  </>
                )}
              </div>
            ) : isEditingAbstract ? (
              <div>
                <Textarea 
                  value={abstractText}
                  onChange={(e) => setAbstractText(e.target.value)}
                  rows={8}
                  className="mb-2"
                  placeholder="Enter your abstract here (minimum 50 characters)..."
                />
                <div className="flex gap-2">
                  <Button 
                    onClick={handleSaveAbstract} 
                    disabled={isSavingAbstract || abstractText.length < 50}
                    size="sm"
                  >
                    {isSavingAbstract && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setIsEditingAbstract(false)}>
                    Cancel
                  </Button>
                </div>
                {abstractText.length < 50 && abstractText.length > 0 && (
                  <p className="text-xs text-amber-600 mt-1">
                    Abstract must be at least 50 characters ({abstractText.length}/50)
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line break-words">
                {abstract?.abstract?.trim() || 'No abstract available'}
              </p>
            )}
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Motivation</h4>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap break-words max-w-full overflow-hidden">
              {request.motivation ?? 'No motivation provided.'}
            </p>
          </div>

          {request.research_area && (
            <div>
              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Research Area</h4>
              <p className="text-sm text-slate-600 break-words max-w-full">{request.research_area}</p>
            </div>
          )}

          {request.proposal_summary && (
            <div>
              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Summary</h4>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap break-words max-w-full overflow-hidden">
                {request.proposal_summary}
              </p>
            </div>
          )}

          {request.methodology && (
            <div>
              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Methodology</h4>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap break-words max-w-full overflow-hidden">
                {request.methodology}
              </p>
            </div>
          )}

          {request.expected_outcomes && (
            <div>
              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Expected Outcomes</h4>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap break-words max-w-full overflow-hidden">
                {request.expected_outcomes}
              </p>
            </div>
          )}

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

/**
 * Documents Tab Component
 */
function DocumentsTab({ request, onAttachmentClick }) {
  const attachments = request?.attachments || [];
  const hasAttachments = attachments.length > 0;

  return (
    <div className="p-6">
      <section className="border border-slate-200 rounded-lg p-6 bg-white shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Attached Documents ({attachments.length})
        </h3>

        {hasAttachments ? (
          <div className="space-y-2">
            {attachments.map((attachment, index) => (
              <button
                key={attachment.id || index}
                onClick={() => onAttachmentClick(attachment)}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-left"
              >
                <FileText className="h-5 w-5 text-slate-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-900 truncate">
                    {attachment.original_name || 'Attachment'}
                  </div>
                  <div className="text-xs text-slate-500">
                    {attachment.size_formatted || `${(attachment.size / 1024).toFixed(1)} KB`}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-sm text-slate-500 text-center py-8">
            No documents attached
          </div>
        )}
      </section>
    </div>
  );
}

/**
 * Notes Tab Component - Supervisor only
 */
function NotesTab({ notesList, newNote, setNewNote, isAddingNote, isDeletingNoteId, onAddNote, onDeleteNote, isReadOnly = false }) {
  return (
    <div className="p-6 space-y-6">
      {/* Add Note Section - Only show if not read-only */}
      {!isReadOnly && (
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
      )}

      {/* Notes List */}
      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-900">All Notes ({notesList.length})</h3>
        
        {notesList.length === 0 ? (
          <div className="border border-slate-200 rounded-lg p-6 bg-slate-50 text-center">
            <StickyNote className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-500">
              {isReadOnly ? 'No notes for this request.' : 'No notes yet. Add your first note above.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notesList.map((note) => (
              <div key={note.id} className="border border-slate-200 rounded-lg p-4 bg-white shadow-sm">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <div className="text-xs text-slate-500">
                      {note.created_at ? format(new Date(note.created_at), 'dd/MM/yyyy HH:mm') : 'Just now'}
                    </div>
                  </div>
                  {!isReadOnly && (
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
                  )}
                </div>
                <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed break-words max-w-full overflow-hidden">{note.note}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/**
 * History Tab Component
 */
function HistoryTab({ request }) {
  const timeline = [];

  // Submitted
  if (request?.submitted_at) {
    timeline.push({
      id: 1,
      title: 'Request Submitted',
      date: request.submitted_at,
      status: 'completed',
    });
  }

  // Decision
  if (request?.decision_at) {
    const isAccepted = request.status === 'accepted' || request.status === 'pending_student_acceptance';
    timeline.push({
      id: 2,
      title: isAccepted ? 'Offer Extended' : 'Request Declined',
      date: request.decision_at,
      status: 'completed',
    });
  }

  // Student acceptance (if offer was extended)
  if (request?.status === 'accepted' && request?.decision_at) {
    timeline.push({
      id: 3,
      title: 'Offer Accepted by Student',
      date: request.updated_at,
      status: 'completed',
    });
  }

  return (
    <div className="p-6">
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Timeline</h3>

        {timeline.length === 0 ? (
          <div className="text-sm text-slate-500 text-center py-8">
            No timeline events yet
          </div>
        ) : (
          <div className="space-y-4">
            {timeline.map((event, index) => (
              <div key={event.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-2 h-2 rounded-full ${event.status === 'completed' ? 'bg-green-500' : 'bg-slate-300'}`} />
                  {index < timeline.length - 1 && (
                    <div className="w-0.5 h-full bg-slate-200 mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <h4 className="font-medium text-slate-900">{event.title}</h4>
                  <p className="text-sm text-slate-500">
                    {event.date ? format(new Date(event.date), 'dd/MM/yyyy HH:mm') : 'TBD'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/**
 * InfoItem component
 */
function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2">
      {Icon && <Icon className="mt-0.5 h-4 w-4 text-slate-400 flex-shrink-0" />}
      <div className="min-w-0 flex-1">
        <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
        <div className="text-sm text-slate-700 break-words max-w-full">{value || '—'}</div>
      </div>
    </div>
  );
}

