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
  CheckCircle2
} from 'lucide-react';

const REQUEST_TABS = [
  { key: 'pending', label: 'Pending', badge: 'pending' },
  { key: 'accepted', label: 'Accepted', badge: 'accepted' },
  { key: 'rejected', label: 'Rejected', badge: 'rejected' },
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
    return requests.filter(req => req.status === requestFilter);
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
        const count = requests.filter(req => req.status === tab.badge).length;
        return (
          <Button
            key={tab.key}
            variant={filter === tab.badge ? 'default' : 'outline'}
            onClick={() => onChange(tab.badge)}
            className="flex items-center gap-2"
          >
            {tab.label}
            <Badge variant={filter === tab.badge ? 'secondary' : 'outline'}>{count}</Badge>
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
  const submittedAt = request?.submitted_at ? format(new Date(request.submitted_at), 'PPP') : '—';
  const submittedAgo = request?.submitted_at
    ? formatDistanceToNow(new Date(request.submitted_at), { addSuffix: true })
    : null;
  const status = request?.status ?? 'pending';

  // Status badge styling
  const STATUS_BADGE_VARIANTS = {
    pending: 'bg-amber-50 text-amber-700 border-none',
    accepted: 'bg-emerald-50 text-emerald-700 border-none',
    rejected: 'bg-rose-50 text-rose-700 border-none',
  };

  const statusVariant = STATUS_BADGE_VARIANTS[status] ?? STATUS_BADGE_VARIANTS.pending;
  const formattedStatus = status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <Card 
      className="shadow-sm hover:shadow-md transition-shadow cursor-pointer" 
      onClick={() => onOpenDetail(request)}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar className="h-10 w-10">
              {avatarUrl ? (
                <img src={avatarUrl} alt={fullName} className="h-full w-full object-cover" />
              ) : (
                <AvatarFallback className="bg-indigo-50 text-indigo-600">
                  {fullName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-slate-800">{fullName}</div>
              {submittedAgo && <div className="text-xs text-slate-500">Submitted {submittedAgo}</div>}
            </div>
          </div>
          <Badge className={statusVariant}>
            {formattedStatus}
          </Badge>
        </div>
        <div className="mt-3">
          <CardTitle className="text-base font-semibold text-slate-900 line-clamp-2">
            {request?.proposal_title ?? 'Supervision request'}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-slate-600">
        <Separator />
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoRow icon={Clock3} label="Submitted on" value={submittedAt} />
          <InfoRow icon={FileText} label="Motivation" value={truncate(request?.motivation, 100)} />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 text-xs text-slate-500">
          <Badge variant="outline" className="border-slate-200 text-slate-500">
            <MessageSquare className="mr-1 h-3.5 w-3.5" />
            Conversation ready
          </Badge>
        </div>
        <Button 
          className="sm:w-36" 
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetail(request);
          }}
        >
          <CheckCircle2 className="mr-2 h-4 w-4" />
          View details
        </Button>
      </CardFooter>
    </Card>
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
      description: 'You do not have any new supervision proposals right now. Students will appear here when they submit a request.'
    },
    accepted: {
      title: 'No accepted requests yet',
      description: 'Accepted proposals appear here. When you approve a student, they will transition to the My Students tab.'
    },
    rejected: {
      title: 'No rejected requests',
      description: 'Rejected proposals will appear here for reference.'
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
