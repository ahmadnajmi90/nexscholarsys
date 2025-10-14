import React, { useMemo, useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Avatar, AvatarFallback } from '@/Components/ui/avatar';
import { Separator } from '@/Components/ui/separator';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/Components/ui/tabs';
import {
  CalendarClock,
  MessageCircle,
  GaugeCircle,
  ExternalLink,
  User2,
  Upload,
  FileText,
  Settings,
  Info,
  UserPlus,
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  Clock3
} from 'lucide-react';
import { logError } from '@/Utils/logError';
import StudentRelationshipDetailModal from '@/Pages/Supervision/Partials/StudentRelationshipDetailModal';
import UniversityLetterUploadModal from '@/Pages/Supervision/Partials/UniversityLetterUploadModal';
import ScheduleMeetingDialog from '@/Pages/Supervision/Partials/ScheduleMeetingDialog';
import CoSupervisorSearchModal from '@/Pages/Supervision/Partials/CoSupervisorSearchModal';
import CoSupervisorInvitationCard from '@/Pages/Supervision/Partials/CoSupervisorInvitationCard';
import CoSupervisorInvitationDetailPanel from '@/Pages/Supervision/Partials/CoSupervisorInvitationDetailPanel';
import UnifiedRequestDetailCard from '@/Pages/Supervision/Partials/UnifiedRequestDetailCard';
import ResearchTab from '@/Pages/Supervision/Partials/ResearchTab';
import DocumentsTab from '@/Pages/Supervision/Partials/DocumentsTab';
import ThreadPane from '@/Components/Messaging/ThreadPane';
import { router, Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { format, formatDistanceToNow } from 'date-fns';

export default function ManageSupervisorPanel({ relationships = [], reload, onOpenDetail, onOpenMeetings }) {
  const { auth } = usePage().props;
  const [activeTab, setActiveTab] = useState('active');
  const [selectedRelationship, setSelectedRelationship] = useState(null);
  const [selectedDetailTab, setSelectedDetailTab] = useState('overview');
  const [isScheduleMeetingOpen, setIsScheduleMeetingOpen] = useState(false);
  const [isCoSupervisorModalOpen, setIsCoSupervisorModalOpen] = useState(false);
  const [selectedMainRelationship, setSelectedMainRelationship] = useState(null);
  const [allInvitations, setAllInvitations] = useState([]);
  const [mainSupervisionRequest, setMainSupervisionRequest] = useState(null);
  const [selectedCoSupervisorInvitation, setSelectedCoSupervisorInvitation] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [studentData, setStudentData] = useState(null);

  const activeRelationships = useMemo(
    () => (Array.isArray(relationships) ? relationships.filter(rel => rel.status === 'active') : []),
    [relationships]
  );

  const terminatedRelationships = useMemo(
    () => (Array.isArray(relationships) ? relationships.filter(rel => rel.status === 'terminated') : []),
    [relationships]
  );

  const mainRelationship = useMemo(
    () => activeRelationships.find(rel => rel.role === 'main'),
    [activeRelationships]
  );

  // Combine all supervisors (main first, then co-supervisors) for unified grid
  const allSupervisors = useMemo(() => {
    const coSupers = activeRelationships.filter(rel => rel.role === 'co');
    if (mainRelationship) {
      return [mainRelationship, ...coSupers];
    }
    return coSupers;
  }, [mainRelationship, activeRelationships]);

  // Load co-supervisor invitations and main supervision request
  useEffect(() => {
    if (mainRelationship) {
      loadInvitationsAndRequests();
    }
  }, [mainRelationship]);

  const loadInvitationsAndRequests = async () => {
    try {
      // Load all co-supervisor invitations
      const invResponse = await axios.get('/api/v1/app/supervision/cosupervisor-invitations/my-invitations');
      const allInvs = [
        ...(invResponse.data.as_cosupervisor || []),
        ...(invResponse.data.to_approve || []),
        ...(invResponse.data.as_initiator || [])
      ];
      setAllInvitations(allInvs);

      // Load main supervision request (the original accepted request)
      if (mainRelationship.academician_id) {
        try {
          const reqResponse = await axios.get('/api/v1/app/supervision/requests');
          const requests = reqResponse.data.data || [];
          const mainRequest = requests.find(req => 
            req.academician_id === mainRelationship.academician_id && 
            req.status === 'accepted'
          );
          setMainSupervisionRequest(mainRequest);
        } catch (error) {
          console.error('Error loading supervision request:', error);
        }
      }

      // Load student data with group conversation
      if (mainRelationship.student) {
        setStudentData(mainRelationship.student);
      }
    } catch (error) {
      console.error('Error loading invitations:', error);
    }
  };

  const handleAddCoSupervisor = (relationship) => {
    setSelectedMainRelationship(relationship);
    setIsCoSupervisorModalOpen(true);
  };

  const handleInviteSent = () => {
    loadInvitationsAndRequests();
    reload?.();
    toast.success('Co-supervisor invitation sent!');
  };

  const handleOpenModal = (relationship, tab = 'overview') => {
    setSelectedRelationship(relationship);
    setSelectedDetailTab(tab);
  };

  const handleCloseModal = () => {
    setSelectedRelationship(null);
    setSelectedDetailTab('overview');
  };

  const handleUpdated = () => {
    reload?.();
  };

  const handleScheduleMeetingClose = () => {
    setIsScheduleMeetingOpen(false);
  };

  const handleScheduleMeetingSuccess = () => {
    setIsScheduleMeetingOpen(false);
    setSelectedRelationship(null);
    reload?.();
  };

  if (!activeRelationships.length && !terminatedRelationships.length && allInvitations.length === 0) {
    return (
      <Card className="border-dashed border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-800">You do not have an active supervisor yet</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">
          Once a supervisor accepts your proposal, their details will appear here and the management tools will unlock.
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-slate-100 h-auto gap-1">
          <TabsTrigger value="active" className="flex flex-col lg:flex-row items-center gap-1 lg:gap-2 py-2 lg:py-3 px-1 lg:px-3">
            <div className="flex items-center gap-1 lg:gap-2">
              <CheckCircle2 className="h-3 w-3 lg:h-4 lg:w-4 flex-shrink-0" />
              <span className="text-[10px] lg:text-sm font-medium">Active</span>
            </div>
            {allSupervisors.length > 0 && (
              <Badge variant="secondary" className="bg-green-100 text-green-700 h-4 px-1.5 text-[10px]">
                {allSupervisors.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="invitations" className="flex flex-col lg:flex-row items-center gap-1 lg:gap-2 py-2 lg:py-3 px-1 lg:px-3">
            <div className="flex items-center gap-1 lg:gap-2">
              <Clock className="h-3 w-3 lg:h-4 lg:w-4 flex-shrink-0" />
              <span className="text-[10px] lg:text-sm font-medium">
                <span className="hidden xl:inline">Invitations/Requests</span>
                <span className="xl:hidden">Requests</span>
              </span>
            </div>
            {(allInvitations.length > 0 || mainSupervisionRequest) && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 h-4 px-1.5 text-[10px]">
                {allInvitations.length + (mainSupervisionRequest ? 1 : 0)}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="terminated" className="flex flex-col lg:flex-row items-center gap-1 lg:gap-2 py-2 lg:py-3 px-1 lg:px-3">
            <div className="flex items-center gap-1 lg:gap-2">
              <XCircle className="h-3 w-3 lg:h-4 lg:w-4 flex-shrink-0" />
              <span className="text-[10px] lg:text-sm font-medium">
                <span className="hidden md:inline">Terminated</span>
                <span className="md:hidden">Term.</span>
              </span>
            </div>
            {terminatedRelationships.length > 0 && (
              <Badge variant="secondary" className="bg-slate-100 text-slate-700 h-4 px-1.5 text-[10px]">
                {terminatedRelationships.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Active Tab */}
        <TabsContent value="active" className="space-y-6">
          {allSupervisors.length === 0 ? (
            <Card className="border-dashed border-slate-200">
              <CardContent className="text-center py-12">
                <User2 className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No Active Supervisors</h3>
                <p className="text-sm text-slate-500">You don't have any active supervisors at the moment.</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Supervisor Cards Grid */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Supervisors</h3>
                <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {allSupervisors.map((relationship) => (
          <ActiveRelationshipCard
            key={relationship.id}
            relationship={relationship}
            onOpenDetail={handleOpenModal}
            onOpenMeetings={onOpenMeetings}
            reload={reload}
                      onAddCoSupervisor={relationship.role === 'main' ? handleAddCoSupervisor : undefined}
                    />
                  ))}
                </div>
              </div>

              {/* Shared Research Section */}
              {mainRelationship && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-600" />
                    Research Management (Shared)
                  </h3>
                  <Card>
                    <CardContent className="p-0">
                      <ResearchTab 
                        relationship={mainRelationship} 
                        onUpdated={reload} 
                        isReadOnly={false}
                      />
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Shared Documents Section */}
              {mainRelationship && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-green-600" />
                    Research Documents (Shared)
                  </h3>
                  <Card>
                    <CardContent className="p-0">
                      <DocumentsTab 
                        relationship={mainRelationship} 
                        onUpdated={reload} 
                        isReadOnly={false}
                      />
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Group Chat Section (Only if co-supervisors exist) */}
              {studentData?.supervision_group_conversation_id && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    Team Discussion
                  </h3>
                  <Card>
                    <CardContent className="p-6">
                      <div className="border border-slate-200 rounded-lg bg-white shadow-sm h-[600px] overflow-hidden">
                        <ThreadPane
                          conversationId={studentData.supervision_group_conversation_id}
                          auth={auth}
                          onConversationRead={() => {}}
                          onConversationIncrementUnread={() => {}}
                          onAfterSend={() => reload?.()}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </>
          )}
        </TabsContent>

        {/* Invitations/Requests Tab */}
        <TabsContent value="invitations" className="space-y-6">
          {/* Main Supervision Request History */}
          {mainSupervisionRequest && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Main Supervisor Request
              </h3>
              <MainSupervisionRequestCard 
                request={mainSupervisionRequest} 
                onOpenDetail={setSelectedRequest}
              />
            </div>
          )}

          {/* Co-Supervisor Invitations */}
          {allInvitations.length > 0 ? (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                Co-Supervisor Invitations ({allInvitations.length})
              </h3>
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {allInvitations.map((invitation) => (
                  <CoSupervisorInvitationCard
                    key={invitation.id}
                    invitation={invitation}
                    onClick={() => setSelectedCoSupervisorInvitation(invitation)}
                  />
                ))}
              </div>
            </div>
          ) : !mainSupervisionRequest && (
            <Card className="border-dashed border-slate-200">
              <CardContent className="text-center py-12">
                <Clock className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No Invitations or Requests</h3>
                <p className="text-sm text-slate-500">You don't have any co-supervisor invitations or request history.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Terminated Tab */}
        <TabsContent value="terminated" className="space-y-4">
          {terminatedRelationships.length === 0 ? (
            <Card className="border-dashed border-slate-200">
              <CardContent className="text-center py-12">
                <XCircle className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No Terminated Relationships</h3>
                <p className="text-sm text-slate-500">You don't have any terminated supervisor relationships.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {terminatedRelationships.map((relationship) => (
                <TerminatedRelationshipCard
                  key={relationship.id}
                  relationship={relationship}
                  onOpenDetail={handleOpenModal}
          />
        ))}
      </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Relationship Detail Modal */}
      {selectedRelationship && (
        <StudentRelationshipDetailModal
          relationship={selectedRelationship}
          onClose={handleCloseModal}
          onUpdated={handleUpdated}
          defaultTab={selectedDetailTab}
        />
      )}

      {/* Schedule Meeting Dialog */}
      {isScheduleMeetingOpen && selectedRelationship && (
        <ScheduleMeetingDialog
          relationship={selectedRelationship}
          onClose={handleScheduleMeetingClose}
          onScheduled={handleScheduleMeetingSuccess}
          userRole="student"
        />
      )}

      {/* Co-Supervisor Search Modal */}
      {isCoSupervisorModalOpen && selectedMainRelationship && (
        <CoSupervisorSearchModal
          isOpen={isCoSupervisorModalOpen}
          onClose={() => setIsCoSupervisorModalOpen(false)}
          relationship={selectedMainRelationship}
          onInvite={handleInviteSent}
        />
      )}

      {/* Co-Supervisor Invitation Detail Panel */}
      {selectedCoSupervisorInvitation && (
        <CoSupervisorInvitationDetailPanel
          invitation={selectedCoSupervisorInvitation}
          onClose={() => setSelectedCoSupervisorInvitation(null)}
          onUpdated={() => {
            loadInvitationsAndRequests();
            reload();
          }}
        />
      )}

      {/* Main Supervision Request Detail Modal */}
      {selectedRequest && (
        <UnifiedRequestDetailCard
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onUpdated={() => {
            loadInvitationsAndRequests();
            reload();
          }}
          userRole="student"
        />
      )}
    </>
  );
}

function MainSupervisionRequestCard({ request, onOpenDetail }) {
  if (!request) return null;

  const academician = request.academician || {};
  const university = academician.university?.name || academician.university?.full_name || '';
  const fullName = academician.full_name || academician.user?.name || 'Supervisor';
  const avatarUrl = academician.profile_picture ? `/storage/${academician.profile_picture}` : null;
  const proposalTitle = request.proposal_title || 'Supervision request';
  const submittedAt = request.submitted_at ? format(new Date(request.submitted_at), 'dd/MM/yyyy') : '—';
  const submittedAgo = request.submitted_at
    ? formatDistanceToNow(new Date(request.submitted_at), { addSuffix: true })
    : null;

  return (
    <div 
      className="border rounded-xl p-4 sm:p-5 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer min-h-[300px] sm:min-h-[320px] flex flex-col"
      onClick={() => onOpenDetail?.(request)}
    >
      {/* Card Content - Grows to fill space */}
      <div className="flex-1">
        {/* Header: Supervisor Info + Status Badge */}
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center overflow-hidden flex-shrink-0">
              {avatarUrl ? (
                <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover rounded-full" />
              ) : (
                <User2 className="w-5 h-5 text-indigo-600" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm sm:text-[1.05rem] font-semibold text-gray-900 leading-snug truncate">{fullName}</h3>
              {university && <p className="text-xs sm:text-sm text-gray-600 truncate font-normal">{university}</p>}
              {submittedAgo && <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">{submittedAgo}</p>}
            </div>
          </div>
          <Badge className="bg-emerald-50 text-emerald-700 border-none flex-shrink-0 text-[10px] sm:text-xs">
            Accepted
          </Badge>
        </div>

        {/* Proposal Title - More Prominent */}
        <div className="mt-3 sm:mt-4">
          <h4 className="text-sm sm:text-base font-semibold text-slate-900 line-clamp-2 leading-snug">{proposalTitle}</h4>
        </div>

        {/* Status-specific Information Section */}
        <div className="mt-2 min-h-[60px] sm:min-h-[72px] space-y-2">
          <div className="p-2 rounded-md bg-green-50 border border-green-100">
            <div className="text-xs text-green-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Accepted — next steps available</span>
            </div>
          </div>
          <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200">
            <FileText className="h-3 w-3 mr-1" />
            View full supervision details
          </Badge>
        </div>

        {/* Quick Info Bar - Clean Inline Display */}
        <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Clock3 className="w-3.5 h-3.5" />
            <span>{submittedAt}</span>
          </div>
          {request.attachments && request.attachments.length > 0 && (
            <div className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>{request.attachments.length} file{request.attachments.length !== 1 ? 's' : ''}</span>
            </div>
          )}
          {request.conversation_id && (
            <div className="flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Conversation active</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions - Always at bottom */}
      <div className="mt-3 sm:mt-4 flex items-center gap-2 pt-3 sm:pt-4 border-t">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs sm:text-sm"
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetail?.(request);
          }}
        >
          <CheckCircle2 className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          View Details
        </Button>
      </div>
    </div>
  );
}

function TerminatedRelationshipCard({ relationship, onOpenDetail }) {
  const academician = relationship?.academician ?? {};
  const fullName = academician.full_name ?? 'Supervisor';
  const avatarUrl = academician.profile_picture ? `/storage/${academician.profile_picture}` : null;
  const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const university = academician.university?.name || academician.university?.full_name || '';
  const role = relationship?.role === 'main' ? 'Main' : 'Co-supervisor';

  return (
    <Card 
      className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onOpenDetail?.(relationship, 'overview')}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12 border-2 border-slate-200">
            {avatarUrl ? (
              <img src={avatarUrl} alt={fullName} className="h-full w-full object-cover" />
            ) : (
              <AvatarFallback className="bg-indigo-100 text-indigo-700 font-semibold text-xs">
                {initials}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-slate-900 truncate">{fullName}</h3>
            <p className="text-sm text-slate-600 truncate">{university || 'University'}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge className="bg-slate-100 text-slate-700 border-slate-300 px-2 py-0.5 text-xs">
              {role}
            </Badge>
            <Badge className="bg-red-50 text-red-700 border-red-200 border px-2 py-0.5 text-xs">
              Terminated
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {relationship.accepted_at && (
          <p className="text-xs text-slate-500">
            Started: {new Date(relationship.accepted_at).toLocaleDateString()}
          </p>
        )}
        {relationship.terminated_at && (
          <p className="text-xs text-red-600 font-medium">
            Terminated: {new Date(relationship.terminated_at).toLocaleDateString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function ActiveRelationshipCard({ relationship, onOpenDetail, onOpenMeetings, reload, onAddCoSupervisor }) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  const academician = relationship?.academician ?? {};
  const profilePicture = academician.profile_picture ? `/storage/${academician.profile_picture}` : null;
  const fullName = academician.full_name ?? 'Supervisor';
  const university = academician.university?.name || academician.university?.full_name || '';
  const department = academician.department || '';
  
  // Get first research expertise only (research_domains is the cleaned-up name)
  const researchTopic = academician.research_domains?.[0] || '';
  
  const role = relationship?.role === 'main' ? 'Main' : 'Co-supervisor';
  const statusLabel = 'Accepted by Student';
  const cohort = relationship?.cohort || '';
  
  // Capitalize meeting cadence (e.g., "weekly" -> "Weekly")
  const cadence = relationship?.meeting_cadence 
    ? relationship.meeting_cadence.charAt(0).toUpperCase() + relationship.meeting_cadence.slice(1)
    : '';
  
  const hasUniversityLetter = !!relationship?.university_letter_path;
  
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

  const handleOpenChat = () => {
    if (relationship?.conversation_id) {
      onOpenDetail?.(relationship, 'chat');
    }
  };

  const handleScheduleMeeting = () => {
    // First open the modal
    onOpenDetail?.(relationship, 'overview');
    // Then open the schedule meeting dialog
    // We need to delay this slightly so the modal renders first
    setTimeout(() => {
      setIsUploadModalOpen(false); // Make sure upload modal is closed
      const event = new CustomEvent('open-schedule-meeting', { detail: { relationship } });
      window.dispatchEvent(event);
    }, 100);
  };

  const handleManage = () => {
    // Navigate to full-page view
    router.visit(route('supervision.relationships.show', relationship.id));
  };

  return (
    <>
      <Card 
        className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => onOpenDetail?.(relationship, 'overview')}
      >
        {/* Header Section */}
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <Avatar className="h-12 w-12 border-2 border-slate-200">
                {profilePicture ? (
                  <img src={profilePicture} alt={fullName} className="h-full w-full object-cover" />
                ) : (
                  <AvatarFallback className="bg-indigo-100 text-indigo-700 font-semibold text-xs">
                    {initials}
                  </AvatarFallback>
                )}
              </Avatar>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-slate-900 truncate mb-1">{fullName}</h3>
              <p className="text-sm text-slate-600 truncate">
                {university && department ? `${university} • ${department}` : (university || department || 'University')}
              </p>
              {researchTopic && (
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-1">{researchTopic}</p>
              )}
            </div>

            {/* Badges */}
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <Badge className="bg-slate-900 text-white border-none hover:bg-slate-800 px-2 py-0.5 text-xs">
                {role}
              </Badge>
              <Badge className="bg-green-50 text-green-700 border-green-200 border px-2 py-0.5 text-xs">
                {statusLabel}
              </Badge>
              {cohort && cadence && (
                <p className="text-xs text-slate-500 mt-0.5">{cohort} • {cadence}</p>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 pb-4">
          {/* University Letter Alert - Only show when NOT uploaded (reminder) */}
          {!hasUniversityLetter && (
            <Alert className="bg-blue-50 border-blue-200 py-2.5">
              <FileText className="h-3.5 w-3.5 text-blue-600" />
              <AlertDescription className="text-xs">
                <div className="space-y-2">
                  <div>
                    <p className="font-semibold text-blue-900">
                      University Letter
                    </p>
                    <p className="text-blue-700 text-xs mt-0.5">
                      Upload official letter to complete validation.
                    </p>
                  </div>
                  <div>
                    <Button 
                      size="sm" 
                      className="bg-blue-600 hover:bg-blue-700 h-7 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsUploadModalOpen(true);
                      }}
                    >
                      <Upload className="mr-1 h-3 w-3" />
                      Upload Letter
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Metrics Row */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-lg bg-slate-50">
              <div className="text-xl font-bold text-slate-900">{meetingsCount}</div>
              <div className="text-xs text-slate-600 mt-1">Meetings</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50">
              <div className="text-xl font-bold text-slate-900">{tasksCount}</div>
              <div className="text-xs text-slate-600 mt-1">Tasks</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50">
              <div className="text-xl font-bold text-slate-900">{documentsCount}</div>
              <div className="text-xs text-slate-600 mt-1">Documents</div>
            </div>
          </div>

          {/* Action Buttons Grid */}
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="w-full h-8 text-xs" 
              onClick={(e) => {
                e.stopPropagation();
                handleScheduleMeeting();
              }}
            >
              <CalendarClock className="mr-1.5 h-3.5 w-3.5" />
              Schedule Meeting
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="w-full h-8 text-xs" 
              onClick={(e) => {
                e.stopPropagation();
                handleOpenChat();
              }}
            >
              <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
              Chat
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="col-span-2 w-full h-8 text-xs" 
              onClick={(e) => {
                e.stopPropagation();
                handleManage();
              }}
            >
              <Settings className="mr-1.5 h-3.5 w-3.5" />
              Manage
            </Button>
          </div>

          {/* Add Co-Supervisor Button (Only for Main Supervisor) */}
          {relationship?.role === 'main' && onAddCoSupervisor && (
            <Button
              variant="default"
              size="sm"
              className="w-full h-8 text-xs bg-indigo-600 hover:bg-indigo-700"
              onClick={(e) => {
                e.stopPropagation();
                onAddCoSupervisor(relationship);
              }}
            >
              <UserPlus className="mr-1.5 h-3.5 w-3.5" />
              Add Co-Supervisor
            </Button>
          )}
        </CardContent>
      </Card>

      {/* University Letter Upload Modal */}
      <UniversityLetterUploadModal
        isOpen={isUploadModalOpen}
        relationship={relationship}
        onClose={() => setIsUploadModalOpen(false)}
        onUploaded={() => {
          setIsUploadModalOpen(false);
          reload?.();
        }}
      />
    </>
  );
}

function InfoColumn({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 text-slate-400" />
      <div>
        <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
        <div className="text-sm text-slate-700">{value}</div>
      </div>
    </div>
  );
}

