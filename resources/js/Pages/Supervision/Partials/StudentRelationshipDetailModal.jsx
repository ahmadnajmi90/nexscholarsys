import React, { useState } from 'react';
import { format } from 'date-fns';
import { router } from '@inertiajs/react';
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
  ExternalLink,
  Briefcase,
  UserMinus
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/Components/ui/tabs';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Avatar, AvatarFallback } from '@/Components/ui/avatar';
import { ScrollArea } from '@/Components/ui/scroll-area';
import ResearchTab from '@/Pages/Supervision/Partials/ResearchTab';
import DocumentsTab from '@/Pages/Supervision/Partials/DocumentsTab';
import ThreadPane from '@/Components/Messaging/ThreadPane';
import ScheduleMeetingDialog from '@/Pages/Supervision/Partials/ScheduleMeetingDialog';
import StudentOverviewTab from '@/Pages/Supervision/Partials/StudentOverviewTab';
import UnbindRequestModal from '@/Pages/Supervision/Partials/UnbindRequestModal';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip';
import { usePage } from '@inertiajs/react';

export default function StudentRelationshipDetailModal({ relationship, onClose, onUpdated, isReadOnly = false, defaultTab = 'overview' }) {
  const { auth } = usePage().props;
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isScheduleMeetingOpen, setIsScheduleMeetingOpen] = useState(false);
  const [isUnbindModalOpen, setIsUnbindModalOpen] = useState(false);

  // Listen for schedule meeting event from card
  React.useEffect(() => {
    const handleOpenScheduleMeeting = (event) => {
      if (event.detail?.relationship?.id === relationship?.id) {
        setIsScheduleMeetingOpen(true);
      }
    };

    window.addEventListener('open-schedule-meeting', handleOpenScheduleMeeting);
    return () => window.removeEventListener('open-schedule-meeting', handleOpenScheduleMeeting);
  }, [relationship?.id]);

  // Update active tab when defaultTab changes
  React.useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  const handleOpenFullPage = () => {
    router.visit(route('supervision.relationships.show', relationship.id));
  };

  if (!relationship) return null;

  const academician = relationship?.academician ?? {};
  // console.log(academician) 
  const fullName = academician.full_name ?? 'Supervisor';
  const avatarUrl = academician.profile_picture ? `/storage/${academician.profile_picture}` : null;
  const baseStatus = relationship.status ?? 'active';
  
  // Laravel returns snake_case, so we need to check both camelCase and snake_case
  const activeUnbindRequest = relationship?.active_unbind_request || relationship?.activeUnbindRequest;
  
  // Override status if there's an active unbind request
  const status = activeUnbindRequest ? 'pending_unbind' : baseStatus;
  
  // Disable all interactive features except chat when pending unbind or not active or read-only mode
  const isInteractive = !isReadOnly && baseStatus === 'active' && !activeUnbindRequest;

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
                <p className="text-sm text-slate-600">Supervisor · {relationship.role === 'main' ? 'Main Supervisor' : 'Co-Supervisor'}</p>
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
        {isInteractive && (
          <div className="px-6 py-4 border-b bg-slate-50">
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
            <div className="flex gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex-1">
                      <Button
                        variant="outline"
                        className="w-full border-red-300 text-red-700 hover:bg-red-50"
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
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleOpenFullPage}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Show Full Page
              </Button>
            </div>
          </div>
        )}

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
                value="history"
                className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=inactive]:bg-transparent rounded-none px-6 py-3"
              >
                History
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-auto">
              <TabsContent value="overview" className="mt-0 h-full">
                <ScrollArea className="h-full">
                  <StudentOverviewTab 
                    relationship={relationship} 
                    academician={academician}
                    activeUnbindRequest={activeUnbindRequest}
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

              <TabsContent value="history" className="mt-0 h-full">
                <ScrollArea className="h-full">
                  <HistoryTab relationship={relationship} />
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
          onUpdated?.();
        }}
        userRole="student"
      />

      {/* Unbind Request Modal */}
      <UnbindRequestModal
        isOpen={isUnbindModalOpen}
        relationship={relationship}
        onClose={() => setIsUnbindModalOpen(false)}
        onUnbindInitiated={() => {
          setIsUnbindModalOpen(false);
          onUpdated?.(); // Reload the data first
          onClose?.(); // Then close the detail modal
        }}
        userRole="student"
      />
    </div>
  );
}

function HistoryTab({ relationship }) {
  const timeline = [
    {
      id: 1,
      title: 'Relationship Started',
      date: relationship?.accepted_at,
      status: 'completed',
    },
    {
      id: 2,
      title: 'Active Supervision',
      date: relationship?.accepted_at,
      status: relationship?.status === 'active' ? 'current' : 'completed',
    },
  ];

  if (relationship?.terminated_at) {
    timeline.push({
      id: 3,
      title: 'Relationship Terminated',
      date: relationship.terminated_at,
      status: 'completed',
    });
  }

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
                  {event.date ? format(new Date(event.date), 'dd/MM/yyyy HH:mm') : 'TBD'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

