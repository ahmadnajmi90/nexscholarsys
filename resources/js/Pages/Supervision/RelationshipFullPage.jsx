import React, { useState, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { format } from 'date-fns';
import { 
  Calendar, 
  Video, 
  User2, 
  GraduationCap, 
  Mail, 
  Phone, 
  Globe,
  UserMinus,
  ArrowLeft,
  StickyNote,
  Trash2,
  Loader2
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/Components/ui/tabs';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Avatar, AvatarFallback } from '@/Components/ui/avatar';
import { Textarea } from '@/Components/ui/textarea';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip';
import ScheduleMeetingDialog from '@/Pages/Supervision/Partials/ScheduleMeetingDialog';
import UnbindRequestModal from '@/Pages/Supervision/Partials/UnbindRequestModal';
import ResearchTab from '@/Pages/Supervision/Partials/ResearchTab';
import DocumentsTab from '@/Pages/Supervision/Partials/DocumentsTab';
import ThreadPane from '@/Components/Messaging/ThreadPane';
import UnifiedOverviewTab from '@/Pages/Supervision/Partials/UnifiedOverviewTab';
import RelationshipHistoryTab from '@/Pages/Supervision/Partials/RelationshipHistoryTab';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { logError } from '@/Utils/logError';

export default function RelationshipFullPage({ relationship: initialRelationship, userRole }) {
  const { auth } = usePage().props;
  const relationship = usePage().props.relationship || initialRelationship;
  const [activeTab, setActiveTab] = useState('overview');
  const [isScheduleMeetingOpen, setIsScheduleMeetingOpen] = useState(false);
  const [isUnbindModalOpen, setIsUnbindModalOpen] = useState(false);

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
      logError(error, 'RelationshipFullPage loadNotes');
    }
  };

  const handleBack = () => {
    if (userRole === 'supervisor') {
      router.visit(route('supervision.supervisor.index'));
    } else {
      router.visit(route('supervision.student.index'));
    }
  };

  const handleUpdated = () => {
    router.reload({ only: ['relationship'] });
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || isAddingNote) return;
    setIsAddingNote(true);
    try {
      // TODO: Implement notes endpoint for relationships
      toast.success('Note added');
      setNewNote('');
    } catch (error) {
      logError(error, 'RelationshipFullPage handleAddNote');
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
      logError(error, 'RelationshipFullPage handleDeleteNote');
      toast.error('Failed to delete note');
    } finally {
      setIsDeletingNoteId(null);
    }
  };

  // Get the appropriate person info based on user role
  const isSupervisor = userRole === 'supervisor';
  const person = isSupervisor ? (relationship?.student ?? {}) : (relationship?.academician ?? {});
  const fullName = person.full_name ?? (isSupervisor ? 'Student' : 'Supervisor');
  const avatarUrl = person.profile_picture ? `/storage/${person.profile_picture}` : null;
  const baseStatus = relationship?.status ?? 'active';
  
  // Laravel returns snake_case, so we need to check both camelCase and snake_case
  const activeUnbindRequest = relationship?.active_unbind_request || relationship?.activeUnbindRequest;
  
  // Override status if there's an active unbind request
  const status = activeUnbindRequest ? 'pending_unbind' : baseStatus;
  
  // Disable all interactive features except chat when pending unbind or not active
  const isInteractive = baseStatus === 'active' && !activeUnbindRequest;

  // Get initials for avatar
  const initials = fullName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 3);

  // Format status for display
  const formattedStatus = status === 'pending_unbind' 
    ? 'Pending Unbind' 
    : status
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

  // Status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pending_unbind':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'completed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'terminated':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <MainLayout title="Supervision Relationship">
      <Head title={`Supervision: ${fullName}`} />
      
      <div className="max-w-7xl mx-auto px-3 py-3 sm:px-4 sm:py-4 md:px-5 md:py-5 lg:px-0 lg:py-0 pb-6">
        {/* Header */}
        <div className="mb-6 bg-white border-b pb-6">
          <div>
            <Button
              variant="outline"
              onClick={handleBack}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>

            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <Avatar className="h-16 w-16">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={fullName} className="h-full w-full object-cover" />
                  ) : (
                    <AvatarFallback className="bg-indigo-100 text-indigo-700 text-lg font-semibold">
                      {initials}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1">
                  <h1 className="text-2xl font-semibold text-slate-900">{fullName}</h1>
                  <p className="text-sm text-slate-600">
                    {isSupervisor ? 'Student' : 'Supervisor'} · {relationship.role === 'main' ? 'Main Supervisor' : 'Co-Supervisor'}
                  </p>
                  <div className="mt-3">
                    <Badge className={`${getStatusColor(status)} border`}>
                      {formattedStatus}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isInteractive && (
            <div className="pt-6">
              <div className="flex gap-3 flex-wrap">
                <Button
                  variant="outline"
                  onClick={() => setIsScheduleMeetingOpen(true)}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Meeting
                </Button>
                <Button
                  className="bg-slate-900 hover:bg-slate-800"
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
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Button
                          variant="outline"
                          className="border-red-300 text-red-700 hover:bg-red-50"
                          onClick={() => setIsUnbindModalOpen(true)}
                          disabled={activeUnbindRequest || baseStatus !== 'active'}
                        >
                          <UserMinus className="mr-2 h-4 w-4" />
                          Remove Relationship
                        </Button>
                      </div>
                    </TooltipTrigger>
                    {activeUnbindRequest && (
                      <TooltipContent>
                        <p>Unbind request pending approval</p>
                      </TooltipContent>
                    )}
                    {baseStatus !== 'active' && !activeUnbindRequest && (
                      <TooltipContent>
                        <p>Relationship is no longer active</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start rounded-none border-b bg-slate-50 p-0 h-auto">
              <TabsTrigger 
                value="overview"
                className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none px-6 py-3"
              >
                Overview
              </TabsTrigger>
              {isSupervisor && (
                <>
                  <TabsTrigger 
                    value="research"
                    className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none px-6 py-3"
                  >
                    Research
                  </TabsTrigger>
                  <TabsTrigger 
                    value="documents"
                    className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none px-6 py-3"
                  >
                    Documents
                  </TabsTrigger>
                </>
              )}
              <TabsTrigger 
                value="chat"
                className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none px-6 py-3"
              >
                Chat
              </TabsTrigger>
              {isSupervisor && (
                <TabsTrigger 
                  value="notes"
                  className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none px-6 py-3"
                >
                  Notes
                </TabsTrigger>
              )}
              <TabsTrigger 
                value="history"
                className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none px-6 py-3"
              >
                History
              </TabsTrigger>
            </TabsList>

            <div>
              <TabsContent value="overview" className="mt-0 p-2">
                <UnifiedOverviewTab 
                  relationship={relationship} 
                  person={person}
                  userRole={userRole}
                  activeUnbindRequest={activeUnbindRequest} 
                />
              </TabsContent>

              {isSupervisor && (
                <>
                  <TabsContent value="research" className="mt-0 p-2">
                    <div className="max-h-[calc(100vh-350px)] overflow-auto">
                      <ResearchTab relationship={relationship} onUpdated={handleUpdated} isReadOnly={!isInteractive} />
                    </div>
                  </TabsContent>

                  <TabsContent value="documents" className="mt-0 p-2">
                    <div className="max-h-[calc(100vh-350px)] overflow-auto">
                      <DocumentsTab relationship={relationship} onUpdated={handleUpdated} isReadOnly={!isInteractive} />
                    </div>
                  </TabsContent>
                </>
              )}

              <TabsContent value="chat" className="mt-0 p-6">
                {isSupervisor ? (
                  // Supervisor view: Toggle between Direct Message and Team Chat
                  <Tabs defaultValue="direct" className="w-full">
                    <TabsList className="mb-4">
                      <TabsTrigger value="direct">Direct Message</TabsTrigger>
                      <TabsTrigger 
                        value="group"
                        disabled={!person?.supervision_group_conversation_id}
                      >
                        Team Chat
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="direct" className="mt-0">
                      {relationship?.conversation_id ? (
                        <div className="border border-slate-200 rounded-lg bg-white shadow-sm h-[calc(100vh-400px)] overflow-hidden">
                          <ThreadPane
                            conversationId={relationship.conversation_id}
                            auth={auth}
                            onConversationRead={() => {}}
                            onConversationIncrementUnread={() => {}}
                            onAfterSend={() => handleUpdated()}
                          />
                        </div>
                      ) : (
                        <div className="border border-slate-200 rounded-lg p-6 bg-white shadow-sm">
                          <p className="text-sm text-slate-500">No conversation available yet.</p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="group" className="mt-0">
                      {person?.supervision_group_conversation_id ? (
                        <div className="border border-slate-200 rounded-lg bg-white shadow-sm h-[calc(100vh-400px)] overflow-hidden">
                          <ThreadPane
                            conversationId={person.supervision_group_conversation_id}
                            auth={auth}
                            onConversationRead={() => {}}
                            onConversationIncrementUnread={() => {}}
                            onAfterSend={() => handleUpdated()}
                          />
                        </div>
                      ) : (
                        <div className="border border-slate-200 rounded-lg p-6 bg-white shadow-sm text-center">
                          <p className="text-sm text-slate-500">Team chat will be available when a co-supervisor joins.</p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                ) : (
                  // Student view: Just direct message (team chat is in ManageSupervisorPanel)
                  relationship?.conversation_id ? (
                    <div className="border border-slate-200 rounded-lg bg-white shadow-sm h-[calc(100vh-400px)] overflow-hidden">
                      <ThreadPane
                        conversationId={relationship.conversation_id}
                        auth={auth}
                        onConversationRead={() => {}}
                        onConversationIncrementUnread={() => {}}
                        onAfterSend={() => handleUpdated()}
                      />
                    </div>
                  ) : (
                    <div className="border border-slate-200 rounded-lg p-6 bg-white shadow-sm">
                      <p className="text-sm text-slate-500">No conversation available yet.</p>
                    </div>
                  )
                )}
              </TabsContent>

              {isSupervisor && (
                <TabsContent value="notes" className="mt-0 p-2">
                  <div className="max-h-[calc(100vh-350px)] overflow-auto">
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
                  </div>
                </TabsContent>
              )}

              <TabsContent value="history" className="mt-0 p-0">
                <ScrollArea className="h-[calc(100vh-350px)]">
                  <RelationshipHistoryTab relationship={relationship} />
                </ScrollArea>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Schedule Meeting Dialog */}
      <ScheduleMeetingDialog
        relationship={isScheduleMeetingOpen ? relationship : null}
        onClose={() => setIsScheduleMeetingOpen(false)}
        onScheduled={() => {
          setIsScheduleMeetingOpen(false);
          handleUpdated();
        }}
        userRole={userRole}
      />

      {/* Unbind Request Modal */}
      <UnbindRequestModal
        isOpen={isUnbindModalOpen}
        relationship={relationship}
        onClose={() => setIsUnbindModalOpen(false)}
        onUnbindInitiated={() => {
          setIsUnbindModalOpen(false);
          handleUpdated();
        }}
        userRole={userRole}
      />
    </MainLayout>
  );
}

function NotesTab({ notesList, newNote, setNewNote, isAddingNote, isDeletingNoteId, onAddNote, onDeleteNote, isReadOnly }) {
  return (
    <div className="space-y-6">
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
