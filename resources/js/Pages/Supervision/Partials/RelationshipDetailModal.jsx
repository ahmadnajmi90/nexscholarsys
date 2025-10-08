import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/Components/ui/tabs';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Separator } from '@/Components/ui/separator';
import { ScrollArea } from '@/Components/ui/scroll-area';
import ThreadPane from '@/Components/Messaging/ThreadPane';
import { usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import {
  ClipboardList,
  FileText,
  History,
  MessageCircle,
  CalendarClock
} from 'lucide-react';

const DEFAULT_TABS = ['overview', 'proposal', 'chat', 'meetings', 'history'];

export default function RelationshipDetailModal({ request, relationship, onClose, onUpdated }) {
  const { auth } = usePage().props;
  const [activeTab, setActiveTab] = useState(() => request?.preferred_tab ?? 'overview');

  const conversationId = request?.conversation_id || relationship?.conversation_id;
  const tabs = useMemo(() => {
    return DEFAULT_TABS.filter((tab) => {
      if (tab === 'chat') return Boolean(conversationId);
      return true;
    });
  }, [conversationId]);

  useEffect(() => {
    if (!request?.preferred_tab && !relationship?.preferred_tab) {
      return;
    }
    const preferred = request?.preferred_tab ?? relationship?.preferred_tab;
    if (preferred && preferred !== activeTab && tabs.includes(preferred)) {
      setActiveTab(preferred);
    }
  }, [request?.preferred_tab, relationship?.preferred_tab, tabs, activeTab]);

  const handleTabChange = (value) => {
    setActiveTab(value);
    if (value === 'chat' && conversationId) {
      window?.dispatchEvent(new CustomEvent('supervision:openConversation', {
        detail: { conversationId },
      }));
    }
  };

  const attachments = request?.attachments ?? [];

  return (
    <Dialog open={Boolean(request || relationship)} onOpenChange={(open) => (!open ? onClose?.() : null)}>
      <DialogContent className="max-h-[90vh] w-full max-w-4xl overflow-hidden p-0">
        <DialogHeader className="px-6 pb-4 pt-6">
          <DialogTitle className="text-xl font-semibold">
            {relationship ? 'Supervision details' : 'Proposal details'}
          </DialogTitle>
        </DialogHeader>
        <Separator />

        <motion.div 
          className="px-6 py-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
            <TabsList className="flex w-full flex-wrap gap-2 bg-transparent p-0">
              {tabs.map((tabKey) => (
                <TabsTrigger key={tabKey} value={tabKey} className="rounded-full border border-slate-200 px-4">
                  {TAB_LABELS[tabKey] ?? tabKey}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="overview" className="m-0">
              <ScrollArea className="max-h-[60vh] pr-4">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <OverviewTab request={request} relationship={relationship} />
                </motion.div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="proposal" className="m-0">
              <ScrollArea className="max-h-[60vh] pr-4">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ProposalTab request={request} />
                </motion.div>
              </ScrollArea>
            </TabsContent>

            {conversationId ? (
              <TabsContent value="chat" className="m-0">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="max-h-[60vh] rounded-lg border border-slate-200"
                >
                  <ThreadPane
                    conversationId={conversationId}
                    auth={auth}
                    onConversationRead={() => {}}
                    onConversationIncrementUnread={() => {}}
                    onAfterSend={() => onUpdated?.()}
                  />
                </motion.div>
              </TabsContent>
            ) : null}

            <TabsContent value="meetings" className="m-0">
              <ScrollArea className="max-h-[60vh] pr-4">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <MeetingsTab relationship={relationship} />
                </motion.div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="history" className="m-0">
              <ScrollArea className="max-h-[60vh] pr-4">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <HistoryTab request={request} relationship={relationship} />
                </motion.div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

const TAB_LABELS = {
  overview: 'Overview',
  proposal: 'Proposal',
  chat: 'Conversation',
  meetings: 'Meetings',
  history: 'History'
};

function OverviewTab({ request, relationship }) {
  const supervisor = relationship?.academician ?? request?.academician;
  const student = relationship?.student ?? request?.student;
  const status = relationship?.status ?? request?.status ?? 'pending';
  const conversationId = request?.conversation_id || relationship?.conversation_id;

  const summaryItems = [
    {
      label: 'Student',
      value: student?.full_name ?? 'Student details unavailable',
      badge: student ? 'Postgraduate' : null,
    },
    {
      label: 'Supervisor',
      value: supervisor?.full_name ?? 'Supervisor not assigned yet',
      badge: supervisor ? 'Supervisor' : null,
    },
    { label: 'Status', value: formatEventType(status) },
    { label: 'Meeting cadence', value: relationship?.meeting_cadence ? (relationship.meeting_cadence.charAt(0).toUpperCase() + relationship.meeting_cadence.slice(1)) : 'Not set' },
    { label: 'Accepted on', value: relationship?.accepted_at ? format(new Date(relationship.accepted_at), 'PPP') : 'Pending acceptance' },
    { label: 'ScholarLab', value: relationship?.scholarlab_board_id ? 'Workspace ready' : 'Workspace not provisioned' },
  ];

  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <header className="flex items-center gap-3">
          <ClipboardList className="h-5 w-5 text-indigo-500" />
          <div>
            <h3 className="text-base font-semibold text-slate-800">Supervision summary</h3>
            <p className="text-sm text-slate-500">Key milestones, cadence, and workspace access.</p>
          </div>
        </header>
        <div className="grid gap-4 sm:grid-cols-2">
          {summaryItems.map((item, index) => (
            <OverviewItem key={index} label={item.label} value={item.value} badge={item.badge} />
          ))}
        </div>
      </section>
      {!conversationId && (
        <section className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          <p className="font-medium text-slate-700">Conversation not yet active</p>
          <p className="mt-1">Your proposal has not opened a chat thread. When a supervisor responds or you send a message, the messaging tab will appear here.</p>
        </section>
      )}
    </div>
  );
}

function ProposalTab({ request }) {
  if (!request) {
    return <p className="text-sm text-slate-500">Proposal details unavailable.</p>;
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3">
        <FileText className="h-5 w-5 text-indigo-500" />
        <div>
          <h3 className="text-base font-semibold text-slate-800">Proposal</h3>
          <p className="text-sm text-slate-500">Submitted materials accompanying your request.</p>
        </div>
      </header>

      <section className="space-y-3">
        <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Motivation</h4>
        <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">{request.motivation || 'No motivation provided.'}</p>
      </section>

      <section className="space-y-3">
        <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Attachments</h4>
        {request.attachments?.length ? (
          <div className="space-y-2">
            {request.attachments.map((attachment) => (
              <div key={attachment.id} className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-2">
                <div>
                  <div className="text-sm font-medium text-slate-700 capitalize">{attachment.type.replace('_', ' ')}</div>
                  <div className="text-xs text-slate-500">{attachment.original_name}</div>
                </div>
                <Button variant="link" className="text-indigo-600" asChild>
                  <a href={`/storage/${attachment.path}`} target="_blank" rel="noopener noreferrer">Download</a>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">No attachments were included.</p>
        )}
      </section>
    </div>
  );
}

function MeetingsTab({ relationship }) {
  const meetings = relationship?.meetings ?? [];

  if (!meetings.length) {
    return (
      <div className="space-y-3">
        <h4 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
          <CalendarClock className="h-4 w-4 text-indigo-500" />
          Meetings
        </h4>
        <p className="text-sm text-slate-500">No meetings scheduled yet. Coordinate with your supervisor to agree on a first session.</p>
        <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          <p>When meetings are scheduled they will appear here with quick links and agenda details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
        <CalendarClock className="h-4 w-4 text-indigo-500" />
        Upcoming meetings
      </h4>
      <div className="space-y-3">
        {meetings.map((meeting) => (
          <div key={meeting.id} className="rounded-lg border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-800">{meeting.title}</div>
                <div className="text-xs text-slate-500">{format(new Date(meeting.scheduled_for), 'PPpp')}</div>
              </div>
              {meeting.location_link && (
                <Button variant="link" className="text-indigo-600" asChild>
                  <a href={meeting.location_link} target="_blank" rel="noopener noreferrer">Join</a>
                </Button>
              )}
            </div>
            {meeting.agenda && <p className="mt-2 text-sm text-slate-600">{meeting.agenda}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

function HistoryTab({ request, relationship }) {
  const timeline = useMemo(() => {
    const requestEvents = Array.isArray(request?.timeline) ? request.timeline : [];
    const relationshipEvents = Array.isArray(relationship?.timeline) ? relationship.timeline : [];
    return [...requestEvents, ...relationshipEvents].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  }, [request?.timeline, relationship?.timeline]);

  if (!timeline.length) {
    return (
      <div className="space-y-3">
        <header className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
          <History className="h-4 w-4 text-indigo-500" />
          Activity history
        </header>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          <p>
            Timeline events will appear here as your supervision progresses. Published milestones (submitted, meetings, decisions) will
            stream in once backend tracking is enabled.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <header className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
        <History className="h-4 w-4 text-indigo-500" />
        Activity history
      </header>
      <div className="space-y-3">
        {timeline.map((event) => (
          <div key={event.id ?? `${event.event_type}-${event.created_at}`} className="rounded-lg border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div className="font-medium text-slate-800 capitalize">{formatEventType(event.event_type)}</div>
              {event.created_at && (
                <span className="text-xs text-slate-500">{format(new Date(event.created_at), 'PPpp')}</span>
              )}
            </div>
            {event.metadata && (
              <p className="mt-2 text-sm text-slate-600">{event.metadata?.description ?? JSON.stringify(event.metadata)}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function formatEventType(type) {
  if (!type) return 'Event';
  return type
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function OverviewItem({ label, value, badge }) {
  return (
    <div className="flex items-start gap-2">
      <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
      <div className="space-y-1">
        <div className="text-sm text-slate-700">{value}</div>
        {badge && <Badge variant="outline" className="border-indigo-200 text-indigo-600 text-[11px]">{badge}</Badge>}
      </div>
    </div>
  );
}