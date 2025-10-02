import React, { useState } from 'react';
import { format } from 'date-fns';
import { X, MessageSquare, Calendar, Video, User2, FileText, CheckCircle2, History as HistoryIcon, CalendarClock, GraduationCap, Mail, Phone, Globe, Briefcase } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/Components/ui/tabs';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Avatar, AvatarFallback } from '@/Components/ui/avatar';
import { Separator } from '@/Components/ui/separator';
import { ScrollArea } from '@/Components/ui/scroll-area';
import ThreadPane from '@/Components/Messaging/ThreadPane';
import AttachmentPreviewModal from '@/Components/ProjectHub/AttachmentPreviewModal';
import AcceptSupervisorOfferModal from '@/Pages/Supervision/Partials/AcceptSupervisorOfferModal';
import { usePage } from '@inertiajs/react';

export default function RequestDetailCard({ request, onClose, onUpdated }) {
  const { auth } = usePage().props;
  const [activeTab, setActiveTab] = useState('overview');
  
  // Accept offer modal state
  const [isAcceptOfferModalOpen, setIsAcceptOfferModalOpen] = useState(false);

  // Attachment preview state
  const [previewFile, setPreviewFile] = useState(null);

  // Maximum size for previewing files (15MB)
  const MAX_PREVIEW_SIZE = 15 * 1024 * 1024;

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

  const academician = request?.academician ?? {};
  const fullName = academician.full_name ?? 'Supervisor';
  console.log(academician); 
  const currentPosition = academician.current_position ?? '';
  const avatarUrl = academician.profile_picture ? `/storage/${academician.profile_picture}` : null;
  const university = academician.university?.name ?? '';
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
                {university && (
                    <span className="text-sm text-slate-600">{university}</span>
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
          {/* Show Accept button for pending_student_acceptance status */}
          {status === 'pending_student_acceptance' && (
            <div className="mb-3">
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={() => setIsAcceptOfferModalOpen(true)}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Accept Supervisor Offer
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
                value="history"
                className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=inactive]:bg-transparent rounded-none px-6 py-3"
              >
                History
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-auto">
              <TabsContent value="overview" className="mt-0 h-full">
                <ScrollArea className="h-full">
                  <OverviewTab request={request} />
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

              <TabsContent value="history" className="mt-0 h-full">
                <ScrollArea className="h-full">
                  <HistoryTab request={request} />
                </ScrollArea>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Accept Supervisor Offer Modal */}
      <AcceptSupervisorOfferModal
        isOpen={isAcceptOfferModalOpen}
        request={request}
        onClose={() => setIsAcceptOfferModalOpen(false)}
        onAccepted={() => {
          setIsAcceptOfferModalOpen(false);
          onUpdated?.();
        }}
      />

      {/* Attachment Preview Modal */}
      <AttachmentPreviewModal
        file={previewFile}
        onClose={() => setPreviewFile(null)}
      />
    </div>
  );
}

function OverviewTab({ request }) {
  const submittedAt = request?.submitted_at ? format(new Date(request.submitted_at), 'dd/MM/yyyy') : '—';
  const meetings = request?.meetings ?? [];
  const hasMeetings = meetings.length > 0;
  const academician = request?.academician ?? {};

  return (
    <div className="p-6 space-y-6">
      {/* Supervisor Summary Card */}
      <section className="border border-slate-200 rounded-lg p-6 bg-white shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Supervisor Summary</h3>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InfoItem icon={User2} label="Full Name" value={academician.full_name || '—'} />
            <InfoItem icon={Briefcase} label="Position" value={academician.current_position || '—'} />
            <InfoItem icon={Mail} label="Email" value={academician.email || '—'} />
            <InfoItem icon={Phone} label="Phone" value={academician.phone_number || '—'} />
          </div>

          {(academician.university || academician.faculty || academician.department) && (
            <div className="pt-4 border-t">
              <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-slate-500" />
                Institution
              </h4>
              <div className="space-y-2">
                {academician.university && (
                  <div className="text-sm">
                    <span className="font-medium text-slate-700">University: </span>
                    <span className="text-slate-600">{academician.university.name || academician.university.full_name || '—'}</span>
                  </div>
                )}
                {academician.faculty && (
                  <div className="text-sm">
                    <span className="font-medium text-slate-700">Faculty: </span>
                    <span className="text-slate-600">{academician.faculty.name || '—'}</span>
                  </div>
                )}
                {academician.department && (
                  <div className="text-sm">
                    <span className="font-medium text-slate-700">Department: </span>
                    <span className="text-slate-600">{academician.department}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {academician.research_areas && Array.isArray(academician.research_areas) && academician.research_areas.length > 0 && (
            <div className="pt-4 border-t">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Research Expertise</h4>
              <div className="flex flex-wrap gap-2">
                {academician.research_areas.slice(0, 3).map((area, index) => (
                  <span key={index} className="px-2.5 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {area}
                  </span>
                ))}
                {academician.research_areas.length > 3 && (
                  <span className="px-2.5 py-1 text-xs rounded-full bg-slate-100 text-slate-600">
                    +{academician.research_areas.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {academician.bio && (
            <div className="pt-4 border-t">
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Bio</h4>
              <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">{academician.bio}</p>
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
