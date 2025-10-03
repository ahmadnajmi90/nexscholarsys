import React, { useEffect, useMemo, useState } from 'react';
import { Head, router } from '@inertiajs/react';
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
import SupervisorRelationshipDetailModal from '@/Pages/Supervision/Partials/SupervisorRelationshipDetailModal';
import ScheduleMeetingDialog from '@/Pages/Supervision/Partials/ScheduleMeetingDialog';
import SupervisorRequestDetailCard from '@/Pages/Supervision/Partials/SupervisorRequestDetailCard';
import ForceUnbindRequestModal from '@/Pages/Supervision/Partials/ForceUnbindRequestModal';
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
  MessageCircle,
  History,
  XCircle,
  Users,
  UserPlus,
  Settings
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
  const [terminatedRelationships, setTerminatedRelationships] = useState([]);
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
      const allRelationships = relationshipResp.data.data || [];
      const activeRelationships = allRelationships.filter(rel => rel.status === 'active' || (rel.status === 'active' && rel.activeUnbindRequest));
      const terminated = allRelationships.filter(rel => rel.status === 'terminated');
      
      setStudents(activeRelationships);
      setTerminatedRelationships(terminated);
      
      // Update selectedRelationship with fresh data if modal is open
      if (selectedRelationship) {
        const updatedRelationship = activeRelationships.find(s => s.id === selectedRelationship.id) || 
                                     terminated.find(s => s.id === selectedRelationship.id);
        if (updatedRelationship) {
          setSelectedRelationship(updatedRelationship);
        } else {
          // Relationship no longer exists, close modal
          setSelectedRelationship(null);
        }
      }
      
      return allRelationships;
    } catch (err) {
      logError(err, 'Supervision fetchData');
      setError('Unable to load supervision data right now.');
      return [];
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

  // Check for student-initiated unbind requests that need supervisor approval
  const pendingUnbindRequest = useMemo(() => {
    for (const student of students) {
      const unbindRequest = student.activeUnbindRequest;
      if (unbindRequest && 
          unbindRequest.status === 'pending' && 
          unbindRequest.initiated_by === 'student') {
        return {
          unbindRequest,
          relationship: student
        };
      }
    }
    return null;
  }, [students]);

  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      const filterConfig = REQUEST_TABS.find(t => t.key === requestFilter);
      if (!filterConfig) return false;
      
      const badges = Array.isArray(filterConfig.badge) ? filterConfig.badge : [filterConfig.badge];
      return badges.includes(req.status);
    });
  }, [requests, requestFilter]);

  // Calculate metrics for dashboard cards
  const metrics = useMemo(() => {
    // Total active students
    const totalStudents = students.length;
    
    // Pending requests (pending + pending_student_acceptance)
    const pendingRequests = requests.filter(req => 
      req.status === 'pending' || req.status === 'pending_student_acceptance'
    ).length;
    
    // Meetings this month across all students
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const meetingsThisMonth = students.reduce((count, rel) => {
      if (rel.meetings && Array.isArray(rel.meetings)) {
        const monthMeetings = rel.meetings.filter(meeting => {
          if (!meeting.scheduled_for) return false;
          const meetingDate = new Date(meeting.scheduled_for);
          return meetingDate.getMonth() === currentMonth && meetingDate.getFullYear() === currentYear;
        });
        return count + monthMeetings.length;
      }
      return count;
    }, 0);
    
    // Active workspaces (ScholarLab)
    const activeWorkspaces = students.filter(rel => rel.scholarlab_board_id).length;
    
    return {
      totalStudents,
      pendingRequests,
      meetingsThisMonth,
      activeWorkspaces
    };
  }, [students, requests]);

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

        {/* Metrics Cards */}
        {!isLoading && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              value={metrics.totalStudents}
              label="Total Students"
              icon={Users}
              iconColor="text-indigo-600"
              bgColor="bg-indigo-50"
            />
            <MetricCard
              value={metrics.pendingRequests}
              label="Pending Requests"
              icon={UserPlus}
              iconColor="text-amber-600"
              bgColor="bg-amber-50"
            />
            <MetricCard
              value={metrics.meetingsThisMonth}
              label="Meetings this Month"
              icon={CalendarClock}
              iconColor="text-green-600"
              bgColor="bg-green-50"
            />
            <MetricCard
              value={metrics.activeWorkspaces}
              label="Active Workspaces"
              icon={GaugeCircle}
              iconColor="text-blue-600"
              bgColor="bg-blue-50"
            />
          </div>
        )}

        <Tabs value={tab} onValueChange={setTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg h-12">
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
            <TabsTrigger 
              value="terminated"
              className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 rounded-md transition-all py-2"
            >
              Terminated
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

          <TabsContent value="terminated">
            {isLoading ? (
              <StudentSkeleton />
            ) : terminatedRelationships.length === 0 ? (
              <EmptyTerminatedState />
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {terminatedRelationships.map(relationship => (
                  <TerminatedRelationshipCard
                    key={relationship.id}
                    relationship={relationship}
                    onViewHistory={(rel) => {
                      setSelectedRelationship(rel);
                      setSelectedRequest(null);
                    }}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Use SupervisorRelationshipDetailModal for active relationships */}
        {selectedRelationship && !selectedRequest && (
          <SupervisorRelationshipDetailModal
            relationship={selectedRelationship}
            onClose={() => setSelectedRelationship(null)}
            onUpdated={refresh}
          />
        )}
        
        {/* Use old modal for pending relationships with requests */}
        {selectedRequest && (
          <RelationshipDetailModal
            request={selectedRequest}
            relationship={selectedRelationship}
            onClose={() => {
              setSelectedRequest(null);
              setSelectedRelationship(null);
            }}
            onUpdated={refresh}
          />
        )}
        <ScheduleMeetingDialog
          relationship={meetingRelationship}
          onClose={() => setMeetingRelationship(null)}
          onScheduled={refresh}
          userRole="supervisor"
        />
        {detailRequest && (
          <SupervisorRequestDetailCard
            request={detailRequest}
            onClose={() => setDetailRequest(null)}
            onUpdated={refresh}
          />
        )}

        {/* Force Unbind Request Modal - Student-initiated unbind requests */}
        {pendingUnbindRequest && (
          <ForceUnbindRequestModal
            unbindRequest={pendingUnbindRequest.unbindRequest}
            relationship={pendingUnbindRequest.relationship}
            onResponse={refresh}
            userRole="supervisor"
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
        {/* {request?.conversation_id && (
          <div className="flex items-center gap-1.5">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Conversation active</span>
          </div>
        )} */}
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
  const student = relationship?.student ?? {};
  const profilePicture = student.profile_picture ? `/storage/${student.profile_picture}` : null;
  const fullName = student.full_name ?? 'Student';
  const university = student.university?.name || student.university?.full_name || '';
  const faculty = student.faculty?.name || '';
  
  // Get research topic from student's field_of_research (first domain)
  const researchTopic = student.research_domains?.[0] || student.field_of_research?.[0] || '';
  
  const role = relationship?.role === 'main' ? 'Main' : 'Co-supervisor';
  const statusLabel = 'Accepted by Student';
  const cohort = relationship?.cohort || '';
  
  // Capitalize meeting cadence
  const cadence = relationship?.meeting_cadence 
    ? relationship.meeting_cadence.charAt(0).toUpperCase() + relationship.meeting_cadence.slice(1)
    : '';
  
  // Get initials for avatar
  const initials = fullName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 3);

  // Calculate metrics
  const meetingsCount = relationship?.meetings?.length || 0;
  const tasksCount = relationship?.onboarding_checklist_items?.filter(item => !item.completed).length || 0;
  const documentsCount = relationship?.documents?.length || 0;

  const handleScheduleMeeting = () => {
    // Open the modal first, then trigger schedule meeting dialog
    onOpenDetail?.({ ...relationship, preferred_tab: 'overview' });
    // Trigger the schedule meeting dialog after modal opens
    setTimeout(() => {
      onScheduleMeeting?.(relationship);
    }, 100);
  };

  const handleOpenChat = () => {
    onOpenDetail?.({ ...relationship, preferred_tab: 'chat' });
  };

  const handleShareDocument = () => {
    onOpenDetail?.({ ...relationship, preferred_tab: 'documents' });
  };

  const handleManage = () => {
    // Navigate to full-page view
    router.visit(route('supervision.relationships.show', relationship.id));
  };

  return (
    <Card 
      className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onOpenDetail?.({ ...relationship, preferred_tab: 'overview' })}
    >
      {/* Header Section */}
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <Avatar className="h-14 w-14 border-2 border-slate-200">
              {profilePicture ? (
                <img src={profilePicture} alt={fullName} className="h-full w-full object-cover" />
              ) : (
                <AvatarFallback className="bg-indigo-100 text-indigo-700 font-semibold text-sm">
                  {initials}
                </AvatarFallback>
              )}
            </Avatar>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-slate-900 truncate mb-1">{fullName}</h3>
            <p className="text-sm text-slate-600 truncate">
              {university && faculty ? `${university} • ${faculty}` : (university || faculty || 'University')}
            </p>
            {researchTopic && (
              <p className="text-xs text-slate-500 mt-1.5 line-clamp-1">{researchTopic}</p>
            )}
          </div>

          {/* Badges */}
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <Badge className="bg-slate-900 text-white border-none hover:bg-slate-800 px-3 py-1">
              {role}
            </Badge>
            {/* <Badge className="bg-green-50 text-green-700 border-green-200 border px-3 py-1">
              {statusLabel}
            </Badge> */}
            {cohort && cadence && (
              <p className="text-xs text-slate-500 mt-1">{cohort} • {cadence}</p>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 pb-5">
        {/* Metrics Row */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-lg bg-slate-50">
            <div className="text-2xl font-bold text-slate-900">{meetingsCount}</div>
            <div className="text-xs text-slate-600 mt-1.5">Meetings</div>
          </div>
          <div className="p-4 rounded-lg bg-slate-50">
            <div className="text-2xl font-bold text-slate-900">{tasksCount}</div>
            <div className="text-xs text-slate-600 mt-1.5">Tasks</div>
          </div>
          <div className="p-4 rounded-lg bg-slate-50">
            <div className="text-2xl font-bold text-slate-900">{documentsCount}</div>
            <div className="text-xs text-slate-600 mt-1.5">Documents</div>
          </div>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={(e) => {
              e.stopPropagation();
              handleScheduleMeeting();
            }}
          >
            <CalendarClock className="mr-2 h-4 w-4" />
            Schedule Meeting
          </Button>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={(e) => {
              e.stopPropagation();
              handleOpenChat();
            }}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Chat
          </Button>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={(e) => {
              e.stopPropagation();
              handleShareDocument();
            }}
          >
            <FileText className="mr-2 h-4 w-4" />
            Share Document
          </Button>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={(e) => {
              e.stopPropagation();
              handleManage();
            }}
          >
            <Settings className="mr-2 h-4 w-4" />
            Manage
          </Button>
        </div>
      </CardContent>
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

function EmptyTerminatedState() {
  return (
    <Card className="border-dashed border-slate-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-800">No terminated relationships</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-slate-600">
        Terminated supervision relationships will appear here for historical reference. This includes unbind requests, graduations, and other reasons for ending supervision.
      </CardContent>
    </Card>
  );
}

function TerminatedRelationshipCard({ relationship, onViewHistory }) {
  const student = relationship?.student;
  const fullName = student?.full_name || 'Student';
  const initials = fullName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 3);

  const startDate = relationship?.accepted_at ? format(new Date(relationship.accepted_at), 'dd/MM/yyyy') : '—';
  const endDate = relationship?.terminated_at ? format(new Date(relationship.terminated_at), 'dd/MM/yyyy') : '—';
  
  // Determine termination reason
  const getTerminationReason = () => {
    // Check for unbind request
    const unbindRequest = relationship?.unbindRequests?.find(req => 
      req.status === 'approved' || req.status === 'force_unbind'
    );
    
    if (unbindRequest) {
      if (unbindRequest.status === 'force_unbind') {
        return 'Force Unbind (3 attempts)';
      }
      return 'Unbind Request Approved';
    }
    
    return 'Supervision Ended';
  };

  const terminationReason = getTerminationReason();

  return (
    <Card className="border-slate-200 bg-slate-50/50 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12">
            {student?.profile_picture ? (
              <img src={`/storage/${student.profile_picture}`} alt={fullName} className="h-full w-full object-cover" />
            ) : (
              <AvatarFallback className="bg-slate-200 text-slate-600 font-semibold">
                {initials}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 truncate">{fullName}</h3>
            <p className="text-sm text-slate-500">{student?.university?.name || 'University'}</p>
            <div className="mt-2">
              <Badge className="bg-red-50 text-red-700 border-red-200 border">
                Terminated
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3 pb-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-xs text-slate-500 mb-1">Started</div>
            <div className="font-medium text-slate-700">{startDate}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Ended</div>
            <div className="font-medium text-slate-700">{endDate}</div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-200">
          <div className="flex items-start gap-2">
            <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-xs text-slate-500 mb-0.5">Reason</div>
              <div className="text-sm text-slate-700">{terminationReason}</div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => onViewHistory(relationship)}
        >
          <History className="mr-2 h-4 w-4" />
          View History
        </Button>
      </CardFooter>
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

function MetricCard({ value, label, icon: Icon, iconColor, bgColor }) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold text-slate-900">{value}</p>
            <p className="text-sm text-slate-600 mt-1">{label}</p>
          </div>
          <div className={`${bgColor} p-3 rounded-lg`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
