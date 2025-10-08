import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { OVERLAY_ANIMATION, SLIDE_PANEL_ANIMATION } from '@/Utils/modalAnimations';
import { getStatusColor, formatStatus, getInitials } from '@/Utils/supervisionHelpers';
import { 
  X, 
  Calendar, 
  Video, 
  History as HistoryIcon, 
  CalendarClock, 
  User2, 
  GraduationCap, 
  Mail, 
  Phone, 
  Globe, 
  StickyNote, 
  Trash2, 
  Loader2, 
  FileText,
  UserMinus,
  ExternalLink
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/Components/ui/tabs';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Avatar, AvatarFallback } from '@/Components/ui/avatar';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { Textarea } from '@/Components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip';
import ScheduleMeetingDialog from '@/Pages/Supervision/Partials/ScheduleMeetingDialog';
import UnbindRequestModal from '@/Pages/Supervision/Partials/UnbindRequestModal';
import ResearchTab from '@/Pages/Supervision/Partials/ResearchTab';
import DocumentsTab from '@/Pages/Supervision/Partials/DocumentsTab';
import ThreadPane from '@/Components/Messaging/ThreadPane';
import UnifiedOverviewTab from '@/Pages/Supervision/Partials/UnifiedOverviewTab';
import RelationshipHistoryTab from '@/Pages/Supervision/Partials/RelationshipHistoryTab';
import { usePage } from '@inertiajs/react';
import { logError } from '@/Utils/logError';

export default function SupervisorRelationshipDetailModal({ relationship, onClose, onUpdated }) {
  const { auth } = usePage().props;
  // Use preferred_tab if provided
  const initialTab = relationship?.preferred_tab || 'overview';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isScheduleMeetingOpen, setIsScheduleMeetingOpen] = useState(false);
  const [isUnbindModalOpen, setIsUnbindModalOpen] = useState(false);

  // Update activeTab when relationship.preferred_tab changes
  useEffect(() => {
    if (relationship?.preferred_tab) {
      setActiveTab(relationship.preferred_tab);
    }
  }, [relationship?.preferred_tab]);

  // Notes state
  const [notesList, setNotesList] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isDeletingNoteId, setIsDeletingNoteId] = useState(null);

  useEffect(() => {
    if (relationship?.id) {
      loadNotes();
    }
  }, [relationship?.id]);

  const loadNotes = async () => {
    if (!relationship?.id) return;
    try {
      const response = await axios.get(route('supervision.relationships.show', relationship.id));
      setNotesList(response.data.data?.notes || []);
    } catch (error) {
      logError(error, 'SupervisorRelationshipDetailModal loadNotes');
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || isAddingNote) return;
    setIsAddingNote(true);
    try {
      // TODO: Implement notes endpoint for relationships (similar to requests)
      toast.success('Note added');
      setNewNote('');
    } catch (error) {
      logError(error, 'SupervisorRelationshipDetailModal handleAddNote');
      toast.error('Failed to add note');
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (isDeletingNoteId) return;
    setIsDeletingNoteId(noteId);
    try {
      // TODO: Implement notes endpoint for relationships
      toast.success('Note deleted');
    } catch (error) {
      logError(error, 'SupervisorRelationshipDetailModal handleDeleteNote');
      toast.error('Failed to delete note');
    } finally {
      setIsDeletingNoteId(null);
    }
  };

  const handleOpenFullPage = () => {
    router.visit(route('supervision.relationships.show', relationship.id));
  };

  if (!relationship) return null;

  const student = relationship?.student ?? {};
  const fullName = student.full_name ?? 'Student';
  const avatarUrl = student.profile_picture ? `/storage/${student.profile_picture}` : null;
  const baseStatus = relationship.status ?? 'active';
  
  // Override status if there's an active unbind request
  const status = relationship.activeUnbindRequest ? 'pending_unbind' : baseStatus;
  
  // Disable all interactive features except chat when pending unbind or not active
  const isInteractive = baseStatus === 'active' && !relationship.activeUnbindRequest;

  // Get initials for avatar
  const initials = getInitials(fullName);

  // Format status for display
  const formattedStatus = status === 'pending_unbind' 
    ? 'Pending Unbind' 
    : formatStatus(status);

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
                  <p className="text-sm text-slate-600">Student · {relationship.role === 'main' ? 'Main Supervisor' : 'Co-Supervisor'}</p>
                  <div className="mt-2">
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
            {/* Show action buttons only if interactive */}
            {isInteractive && (
              <div className="flex gap-3 mb-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsScheduleMeetingOpen(true)}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Meeting
                </Button>
                <Button
                  className="flex-1 bg-slate-900 hover:bg-slate-800"
                  disabled={
                    !relationship?.meetings || 
                    relationship.meetings.length === 0 || 
                    !relationship.meetings[0]?.location_link
                  }
                  onClick={() => {
                    const nextMeeting = relationship?.meetings?.[0];
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
            <div className="flex gap-3">
              {isInteractive && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex-1">
                        <Button
                          variant="outline"
                          className="w-full border-red-300 text-red-700 hover:bg-red-50"
                          onClick={() => setIsUnbindModalOpen(true)}
                          disabled={relationship.activeUnbindRequest || baseStatus !== 'active'}
                        >
                          <UserMinus className="mr-2 h-4 w-4" />
                          Remove Relationship
                        </Button>
                      </div>
                    </TooltipTrigger>
                    {relationship.activeUnbindRequest && (
                      <TooltipContent>
                        <p>Unbind request pending student approval</p>
                      </TooltipContent>
                    )}
                    {baseStatus !== 'active' && !relationship.activeUnbindRequest && (
                      <TooltipContent>
                        <p>Relationship is no longer active</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              )}
              <Button
                variant="outline"
                className={isInteractive ? 'flex-1' : 'w-full'}
                onClick={handleOpenFullPage}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Show Full Page
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
                  value="research"
                  className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=inactive]:bg-transparent rounded-none px-6 py-3"
                >
                  Research
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
                    <UnifiedOverviewTab 
                      relationship={relationship} 
                      person={student}
                      userRole="supervisor"
                      activeUnbindRequest={relationship.activeUnbindRequest}
                    />
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="research" className="mt-0 h-full">
                  <ResearchTab relationship={relationship} onUpdated={onUpdated} isReadOnly={!isInteractive} />
                </TabsContent>

                <TabsContent value="documents" className="mt-0 h-full">
                  <DocumentsTab relationship={relationship} onUpdated={onUpdated} isReadOnly={!isInteractive} />
                </TabsContent>

                <TabsContent value="chat" className="mt-0 h-full">
                  {relationship?.conversation_id ? (
                    <div className="p-6 h-full">
                      <div className="border border-slate-200 rounded-lg bg-white shadow-sm h-full overflow-hidden">
                        <ThreadPane
                          conversationId={relationship.conversation_id}
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
                      isReadOnly={!isInteractive}
                    />
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="history" className="mt-0 h-full">
                  <ScrollArea className="h-full">
                    <RelationshipHistoryTab relationship={relationship} />
                  </ScrollArea>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </motion.div>
      </motion.div>
      </AnimatePresence>

      {/* Schedule Meeting Dialog */}
      <ScheduleMeetingDialog
        relationship={isScheduleMeetingOpen ? relationship : null}
        onClose={() => setIsScheduleMeetingOpen(false)}
        onScheduled={() => {
          setIsScheduleMeetingOpen(false);
          onUpdated?.();
        }}
        userRole="supervisor"
      />

      {/* Unbind Request Modal */}
      <UnbindRequestModal
        isOpen={isUnbindModalOpen}
        relationship={relationship}
        onClose={() => setIsUnbindModalOpen(false)}
        onUnbindInitiated={() => {
          setIsUnbindModalOpen(false);
          onClose?.(); // Close the detail modal
          onUpdated?.(); // Reload the data
        }}
        userRole="supervisor"
      />
    </>
  );
}

function NotesTab({ notesList, newNote, setNewNote, isAddingNote, isDeletingNoteId, onAddNote, onDeleteNote, isReadOnly }) {
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
            <p className="text-sm text-slate-500">No notes yet. Add your first note above.</p>
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
                <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">{note.note}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
