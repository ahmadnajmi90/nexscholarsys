import React, { useEffect, useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { format, formatDistanceToNow } from 'date-fns';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/Components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Avatar, AvatarFallback } from '@/Components/ui/avatar';
import { Separator } from '@/Components/ui/separator';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import RelationshipDetailModal from '@/Pages/Supervision/Partials/RelationshipDetailModal';
import ScheduleMeetingDialog from '@/Pages/Supervision/Partials/ScheduleMeetingDialog';
import SupervisorRequestDetailCard from '@/Pages/Supervision/Partials/SupervisorRequestDetailCard';
import { logError } from '@/Utils/logError';
import {
  BookOpenCheck,
  ClipboardList,
  MessageSquare,
  CalendarClock,
  Clock3,
  FileText,
  CheckCircle2,
  GaugeCircle,
  User2,
  MessageCircle
} from 'lucide-react';

const REQUEST_TABS = [
  { key: 'pending', label: 'Pending', badge: ['pending', 'pending_student_acceptance'] },
  { key: 'accepted', label: 'Accepted', badge: 'accepted' },
  { key: 'rejected', label: 'Rejected', badge: 'rejected' },
  { key: 'cancelled', label: 'Cancelled', badge: ['cancelled', 'auto_cancelled'] },
];

export default function SupervisorDashboard() {
  const [tab, setTab] = useState('requests');
  const [requests, setRequests] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedRelationship, setSelectedRelationship] = useState(null);
  const [meetingRelationship, setMeetingRelationship] = useState(null);
  const [detailRequest, setDetailRequest] = useState(null); // For RequestDetailCard
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [requestFilter, setRequestFilter] = useState('pending');

  const fetchData = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const [requestResp, relationshipResp] = await Promise.all([
        axios.get(route('supervision.requests.index')),
        axios.get(route('supervision.relationships.index')),
      ]);
      setRequests(requestResp.data.data || []);
      setStudents((relationshipResp.data.data || []).filter(rel => rel.status === 'active'));
    } catch (err) {
      logError(err, 'Supervision fetchData');
      setError('Unable to load supervision data right now.');
    } finally {
      setIsLoading(false);
    }
  };

  const refresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      const filterConfig = REQUEST_TABS.find(t => t.key === requestFilter);
      if (!filterConfig) return false;
      
      const badges = Array.isArray(filterConfig.badge) ? filterConfig.badge : [filterConfig.badge];
      return badges.includes(req.status);
    });
  }, [requests, requestFilter]);

  return (
    <MainLayout title="Supervisor Dashboard">
      <Head title="Supervisor Dashboard" />
      <div className="max-w-7xl mx-auto pb-6 space-y-6">
        {/* <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Supervisor Dashboard</h1>
            <p className="text-sm text-slate-600">Review incoming supervision proposals, manage your supervisees, and schedule meetings.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={refresh} disabled={isRefreshing}>
              {isRefreshing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Refresh
            </Button>
          </div>
        </header> */}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs value={tab} onValueChange={setTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg h-12">
            <TabsTrigger 
              value="requests"
              className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 rounded-md transition-all py-2"
            >
              Manage Requests
            </TabsTrigger>
            <TabsTrigger 
              value="students"
              className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 rounded-md transition-all py-2"
            >
              My Students
            </TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="space-y-4">
            <RequestFilters filter={requestFilter} onChange={setRequestFilter} requests={requests} />
            {isLoading ? (
              <RequestSkeleton />
            ) : filteredRequests.length === 0 ? (
              <EmptyRequestState status={requestFilter} />
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredRequests.map(request => (
                  <SupervisorRequestCard
                    key={request.id}
                    request={request}
                    onOpenDetail={(req) => setDetailRequest(req)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="students">
            {isLoading ? (
              <StudentSkeleton />
            ) : students.length === 0 ? (
              <EmptyStudentState />
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {students.map(student => (
                  <SupervisorStudentCard
                    key={student.id}
                    relationship={student}
                    onOpenDetail={(detail) => {
                      if (detail.preferred_tab) {
                        setSelectedRelationship(detail);
                      } else {
                        setSelectedRelationship(student);
                      }
                      setSelectedRequest(null);
                    }}
                    onScheduleMeeting={(rel) => setMeetingRelationship(rel)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <RelationshipDetailModal
          request={selectedRequest}
          relationship={selectedRelationship}
          onClose={() => {
            setSelectedRequest(null);
            setSelectedRelationship(null);
          }}
          onUpdated={refresh}
        />
        <ScheduleMeetingDialog
          relationship={meetingRelationship}
          onClose={() => setMeetingRelationship(null)}
          onScheduled={refresh}
        />
        {detailRequest && (
          <SupervisorRequestDetailCard
            request={detailRequest}
            onClose={() => setDetailRequest(null)}
            onUpdated={refresh}
          />
        )}
      </div>
    </MainLayout>
  );
}

function RequestFilters({ filter, onChange, requests }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {REQUEST_TABS.map(tab => {
        const badges = Array.isArray(tab.badge) ? tab.badge : [tab.badge];
        const count = requests.filter(req => badges.includes(req.status)).length;
        return (
          <Button
            key={tab.key}
            variant={filter === tab.key ? 'default' : 'outline'}
            onClick={() => onChange(tab.key)}
            className="flex items-center gap-2"
          >
            {tab.label}
            <Badge variant={filter === tab.key ? 'secondary' : 'outline'}>{count}</Badge>
          </Button>
        );
      })}
    </div>
  );
}

function SupervisorRequestCard({ request, onOpenDetail }) {
  const student = request?.student;
  const fullName = student?.full_name ?? 'Student';
  const avatarUrl = student?.profile_picture ? `/storage/${student.profile_picture}` : null;
  const university = student?.university?.name ?? null;
  const status = request?.status ?? 'pending';
  const submittedAt = request?.submitted_at ? format(new Date(request.submitted_at), 'dd/MM/yyyy') : '—';
  const submittedAgo = request?.submitted_at
    ? formatDistanceToNow(new Date(request.submitted_at), { addSuffix: true })
    : null;

  // Status badge styling
  const STATUS_BADGE_VARIANTS = {
    pending: 'bg-amber-50 text-amber-700 border-none',
    pending_student_acceptance: 'bg-blue-50 text-blue-700 border-none',
    accepted: 'bg-emerald-50 text-emerald-700 border-none',
    rejected: 'bg-rose-50 text-rose-700 border-none',
    cancelled: 'bg-slate-100 text-slate-600 border-none',
    auto_cancelled: 'bg-slate-100 text-slate-600 border-none',
  };

  const STATUS_COPY = {
    pending: 'Awaiting your review',
    pending_student_acceptance: 'Awaiting student acceptance',
    accepted: 'Accepted — relationship established',
    rejected: 'Rejected — feedback provided',
    cancelled: 'Cancelled by student',
    auto_cancelled: 'Auto-cancelled after student accepted another offer',
  };

  const statusVariant = STATUS_BADGE_VARIANTS[status] ?? STATUS_BADGE_VARIANTS.pending;
  const statusCopy = STATUS_COPY[status] ?? 'Pending response';
  const formattedStatus = status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div 
      className="border rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onOpenDetail(request)}
    >
      {/* Header: Student Info + Status Badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center overflow-hidden flex-shrink-0">
            {avatarUrl ? (
              <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover rounded-full" />
            ) : (
              <User2 className="w-5 h-5 text-indigo-600" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-[1.05rem] font-semibold text-gray-900 leading-snug truncate">{fullName}</h3>
            {university && <p className="text-sm text-gray-600 truncate font-normal">{university}</p>}
            {submittedAgo && <p className="text-xs text-slate-500 mt-0.5">{submittedAgo}</p>}
          </div>
        </div>
        <Badge className={`${statusVariant} flex-shrink-0`}>
          {formattedStatus}
        </Badge>
      </div>

      {/* Proposal Title - More Prominent */}
      <div className="mt-4">
        <h4 className="text-base font-semibold text-slate-900 line-clamp-2 leading-snug">{request?.proposal_title ?? 'Supervision request'}</h4>
      </div>

      {/* Status Message with Context */}
      {statusCopy && (
        <div className="mt-2 flex items-start gap-1.5">
          <span className="text-sm text-slate-600">{statusCopy}</span>
        </div>
      )}

      {/* Quick Info Bar - Clean Inline Display */}
      <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <Clock3 className="w-3.5 h-3.5" />
          <span>{submittedAt}</span>
        </div>
        {request?.attachments && request.attachments.length > 0 && (
          <div className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            <span>{request.attachments.length} file{request.attachments.length !== 1 ? 's' : ''}</span>
          </div>
        )}
        {request?.conversation_id && (
          <div className="flex items-center gap-1.5">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Conversation active</span>
          </div>
        )}
      </div>

      {/* Actions - Simplified */}
      <div className="mt-4 flex items-center gap-2 pt-4 border-t">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetail(request);
          }}
        >
          <CheckCircle2 className="mr-2 h-4 w-4" />
          View Details
        </Button>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 h-4 w-4 text-slate-400" />
      <div>
        <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
        <div className="text-sm text-slate-700">{value || '—'}</div>
      </div>
    </div>
  );
}

function truncate(text, limit) {
  if (!text || text.length <= limit) return text;
  return `${text.slice(0, limit)}…`;
}

function SupervisorStudentCard({ relationship, onOpenDetail, onScheduleMeeting }) {
  const student = relationship.student;
  const avatarUrl = student?.profile_picture ? `/storage/${student.profile_picture}` : null;

  return (
    <Card className="flex h-full flex-col justify-between">
      <CardHeader className="space-y-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            {avatarUrl ? (
              <img src={avatarUrl} alt={student?.full_name} className="h-full w-full object-cover" />
            ) : (
              <AvatarFallback className="bg-indigo-50 text-indigo-600">
                {student?.full_name?.slice(0, 2)?.toUpperCase() ?? 'PG'}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="min-w-0">
            <CardTitle className="text-base font-semibold text-slate-900">{student?.full_name}</CardTitle>
            <p className="text-xs text-slate-500">Accepted {relationship?.accepted_at ? new Date(relationship.accepted_at).toLocaleDateString() : '—'}</p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-none w-fit">{relationship.role === 'main' ? 'Main supervisor' : 'Co-supervisor'}</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border border-slate-200 p-3">
          <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <BookOpenCheck className="h-4 w-4 text-indigo-500" />
            Meeting cadence
          </h4>
          <p className="mt-2 text-sm text-slate-600">{relationship.meeting_cadence || 'Not specified yet'}</p>
        </div>
        <div className="rounded-lg border border-slate-200 p-3">
          <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <GaugeCircle className="h-4 w-4 text-indigo-500" />
            ScholarLab workspace
          </h4>
          <p className="mt-2 text-sm text-slate-600">
            {relationship.scholarlab_board_id ? 'Workspace activated' : 'Not provisioned yet'}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button variant="outline" onClick={() => onOpenDetail?.({ ...relationship, preferred_tab: 'overview' })}>
          <MessageSquare className="mr-2 h-4 w-4" />
          Open student details
        </Button>
        <Button onClick={() => onScheduleMeeting?.(relationship)}>
          <CalendarClock className="mr-2 h-4 w-4" />
          Schedule meeting
        </Button>
      </CardFooter>
    </Card>
  );
}

function EmptyRequestState({ status }) {
  const copy = {
    pending: {
      title: 'No pending requests',
      description: 'You do not have any new supervision proposals right now. Students will appear here when they submit a request or when they need to accept your offer.'
    },
    accepted: {
      title: 'No accepted requests yet',
      description: 'Accepted proposals appear here. When you approve a student and they accept, they will transition to the My Students tab.'
    },
    rejected: {
      title: 'No rejected requests',
      description: 'Rejected proposals will appear here for reference.'
    },
    cancelled: {
      title: 'No cancelled requests',
      description: 'Cancelled requests (by student or system) will appear here for reference.'
    }
  }[status] || {
    title: 'No requests found',
    description: 'Try selecting another status filter.'
  };

  return (
    <Card className="border-dashed border-slate-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-800">{copy.title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-slate-600">{copy.description}</CardContent>
    </Card>
  );
}

function EmptyStudentState() {
  return (
    <Card className="border-dashed border-slate-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-800">No supervisees yet</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-slate-600">
        Once you accept a student, they will appear here for ongoing management. Use the Manage Requests tab to approve new proposals.
      </CardContent>
    </Card>
  );
}

function RequestSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={`request-skeleton-${index}`} className="border-dashed animate-pulse">
          <CardHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-slate-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 rounded bg-slate-200" />
                <div className="h-3 w-20 rounded bg-slate-100" />
              </div>
            </div>
            <div className="h-5 w-24 rounded bg-slate-100" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-14 w-full rounded bg-slate-100" />
            <div className="h-10 w-full rounded bg-slate-100" />
          </CardContent>
          <CardFooter className="space-y-2">
            <div className="h-10 w-full rounded bg-slate-200" />
            <div className="h-10 w-full rounded bg-slate-200" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

function StudentSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={`student-skeleton-${index}`} className="border-dashed animate-pulse">
          <CardHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-slate-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 rounded bg-slate-200" />
                <div className="h-3 w-20 rounded bg-slate-100" />
              </div>
            </div>
            <div className="h-5 w-24 rounded bg-slate-100" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-14 w-full rounded bg-slate-100" />
            <div className="h-10 w-full rounded bg-slate-100" />
          </CardContent>
          <CardFooter className="space-y-2">
            <div className="h-10 w-full rounded bg-slate-200" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
