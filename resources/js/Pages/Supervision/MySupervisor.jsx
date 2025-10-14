import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import axios from 'axios';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { toast } from 'react-hot-toast';
import { logError } from '@/Utils/logError';
import PotentialSupervisorList from '@/Pages/Supervision/Partials/PotentialSupervisorList';
import RequestStatusList from '@/Pages/Supervision/Partials/RequestStatusList';
import UnifiedRequestDetailCard from '@/Pages/Supervision/Partials/UnifiedRequestDetailCard';
import ManageSupervisorPanel from '@/Pages/Supervision/Partials/ManageSupervisorPanel';
import ProposalModal from '@/Pages/Supervision/Partials/ProposalModal';
import RelationshipDetailModal from '@/Pages/Supervision/Partials/RelationshipDetailModal';
import ForceUnbindRequestModal from '@/Pages/Supervision/Partials/ForceUnbindRequestModal';
import RecommendedSupervisorsSection from '@/Pages/Supervision/Partials/RecommendedSupervisorsSection';
import UnifiedNotificationModal from '@/Pages/Supervision/Partials/UnifiedNotificationModal';
import RecentActivityPanel from '@/Pages/Supervision/Partials/RecentActivityPanel';
import UpcomingMeetingsPanel from '@/Pages/Supervision/Partials/UpcomingMeetingsPanel';
import { Card, CardContent } from '@/Components/ui/card';
import { Users, FileText, CalendarClock, UserCheck, ClipboardList } from 'lucide-react';

export default function MySupervisor() {
  const [tab, setTab] = useState(() => {
    // Check if we need to open a specific request on load
    const openRequestId = sessionStorage.getItem('openRequestId');
    return openRequestId ? 'status' : 'potential';
  });
  const [shortlist, setShortlist] = useState([]);
  const [requests, setRequests] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProposalOpen, setIsProposalOpen] = useState(false);
  const [proposalSupervisor, setProposalSupervisor] = useState(null);
  const [detailRequest, setDetailRequest] = useState(null);
  const [detailRelationship, setDetailRelationship] = useState(null);
  const [pendingRequestId, setPendingRequestId] = useState(() => {
    // Store the pending request ID to open after data loads
    const openRequestId = sessionStorage.getItem('openRequestId');
    if (openRequestId) {
      sessionStorage.removeItem('openRequestId'); // Clear immediately
      return openRequestId;
    }
    return null;
  });

  // Notification modals state
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [rejectionData, setRejectionData] = useState([]);
  const [offerData, setOfferData] = useState([]);

  // Activity sidebar refresh trigger
  const [activityTrigger, setActivityTrigger] = useState(0);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [shortlistResp, requestResp, relationshipResp] = await Promise.all([
        axios.get(route('supervision.shortlist.index')),
        axios.get(route('supervision.requests.index')),
        axios.get(route('supervision.relationships.index')),
      ]);
      const loadedRequests = requestResp.data.data || [];
      
      setShortlist(shortlistResp.data.data || []);
      setRequests(loadedRequests);
      setRelationships(relationshipResp.data.data || []);

      // Trigger activity sidebar reload
      setActivityTrigger(prev => prev + 1);

      // If there's a pending request to open, find and open it after data loads
      if (pendingRequestId) {
        const requestToOpen = loadedRequests.find(req => String(req.id) === String(pendingRequestId));
        if (requestToOpen) {
          setDetailRequest(requestToOpen);
        }
        setPendingRequestId(null); // Clear after handling
      }
    } catch (error) {
      logError(error, 'Supervision loadData');
      toast.error('Failed to load supervision data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check for unacknowledged notifications after requests load
  useEffect(() => {
    if (isLoading || requests.length === 0) return;

    // Check for new offers (highest priority)
    const newOffers = requests.filter(req =>
      req.status === 'pending_student_acceptance' && 
      !req.offer_acknowledged_at
    );

    // Check for new rejections
    const newRejections = requests.filter(req =>
      req.status === 'rejected' && 
      !req.rejection_acknowledged_at
    );

    // Show modals in priority order: Offers first, then rejections
    if (newOffers.length > 0) {
      setOfferData(newOffers);
      setShowOfferModal(true);
    } else if (newRejections.length > 0) {
      setRejectionData(newRejections);
      setShowRejectionModal(true);
    }
  }, [requests, isLoading]);

  const hasActiveRelationship = relationships.some(rel => rel.status === 'active');
  const activeRelationship = relationships.find(rel => rel.status === 'active') || null;

  // Calculate metrics for dashboard cards
  const metrics = React.useMemo(() => {
    const activeRelationships = relationships.filter(rel => rel.status === 'active');
    
    if (hasActiveRelationship) {
      // Metrics for students with active supervisor
      const primaryCount = activeRelationships.filter(rel => rel.role === 'main').length;
      const coSupervisorCount = activeRelationships.filter(rel => rel.role === 'co' || rel.role === 'co-supervisor').length;
      
      // Count meetings this month
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      
      const meetingsThisMonth = activeRelationships.reduce((count, rel) => {
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
      
      // Count incomplete onboarding tasks
      const pendingTasks = activeRelationships.reduce((count, rel) => {
        if (rel.onboarding_checklist_items && Array.isArray(rel.onboarding_checklist_items)) {
          const incompleteTasks = rel.onboarding_checklist_items.filter(item => !item.completed);
          return count + incompleteTasks.length;
        }
        return count;
      }, 0);
      
      return {
        metric1: { value: primaryCount, label: 'Primary Supervisors', icon: UserCheck, iconColor: 'text-indigo-600', bgColor: 'bg-indigo-50' },
        metric2: { value: coSupervisorCount, label: 'Co-supervisors', icon: Users, iconColor: 'text-blue-600', bgColor: 'bg-blue-50' },
        metric3: { value: meetingsThisMonth, label: 'Meetings this Month', icon: CalendarClock, iconColor: 'text-green-600', bgColor: 'bg-green-50' },
        metric4: { value: pendingTasks, label: 'Pending Tasks', icon: ClipboardList, iconColor: 'text-amber-600', bgColor: 'bg-amber-50' },
      };
    } else {
      // Metrics for students without active supervisor
      const totalRequests = requests.length;
      const pendingRequests = requests.filter(req => 
        req.status === 'pending' || req.status === 'pending_student_acceptance'
      ).length;
      
      // Upcoming meetings count
      const upcomingMeetings = requests.reduce((count, req) => {
        if (req.meetings && Array.isArray(req.meetings)) {
          const futureMeetings = req.meetings.filter(m => 
            m.scheduled_for && new Date(m.scheduled_for) > new Date()
          );
          return count + futureMeetings.length;
        }
        return count;
      }, 0);
      
      // Shortlist count
      const shortlistCount = shortlist.length;
      
      return {
        metric1: { value: totalRequests, label: 'Total Requests', icon: FileText, iconColor: 'text-indigo-600', bgColor: 'bg-indigo-50' },
        metric2: { value: pendingRequests, label: 'Pending Requests', icon: Users, iconColor: 'text-amber-600', bgColor: 'bg-amber-50' },
        metric3: { value: upcomingMeetings, label: 'Upcoming Meetings', icon: CalendarClock, iconColor: 'text-green-600', bgColor: 'bg-green-50' },
        metric4: { value: shortlistCount, label: 'Shortlisted', icon: UserCheck, iconColor: 'text-blue-600', bgColor: 'bg-blue-50' },
      };
    }
  }, [requests, relationships, shortlist, hasActiveRelationship]);

  // Check for supervisor-initiated unbind requests that need student approval
  const pendingUnbindRequest = React.useMemo(() => {
    for (const relationship of relationships) {
      const unbindRequest = relationship.activeUnbindRequest || relationship.active_unbind_request;
      if (unbindRequest && 
          unbindRequest.status === 'pending' && 
          unbindRequest.initiated_by === 'supervisor') {
        return {
          unbindRequest,
          relationship
        };
      }
    }
    return null;
  }, [relationships]);

  return (
    <MainLayout title="My Supervisor">
      <Head title="My Supervisor" />
      <div className="max-w-7xl mx-auto px-3 py-3 sm:px-4 sm:py-4 md:px-5 md:py-5 lg:px-0 lg:py-0 pb-6 space-y-6">
        {/* Metrics Cards */}
        {!isLoading && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pb-6 border-b border-slate-200">
            <MetricCard {...metrics.metric1} />
            <MetricCard {...metrics.metric2} />
            <MetricCard {...metrics.metric3} />
            <MetricCard {...metrics.metric4} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Main Content */}
          <div className="lg:col-span-9 lg:pr-6 lg:border-r border-slate-200">
            {hasActiveRelationship ? (
              <ManageSupervisorPanel
            relationships={relationships}
            reload={loadData}
            onOpenDetail={(relationship) => {
              setDetailRelationship(relationship);
              setDetailRequest(null);
            }}
            onOpenMeetings={(relationship) => {
              setDetailRelationship(relationship);
              setDetailRequest(null);
            }}
          />
        ) : (
          <Tabs value={tab} onValueChange={setTab} className="w-full space-y-4">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg h-12">
              <TabsTrigger 
                value="potential"
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 rounded-md transition-all py-2"
              >
                <span className="hidden xs:inline">Potential Supervisors</span>
                <span className="xs:hidden">Potential</span>
              </TabsTrigger>
              <TabsTrigger 
                value="status"
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 rounded-md transition-all py-2"
              >
                <span className="hidden xs:inline">Proposal Status</span>
                <span className="xs:hidden">Status</span>
              </TabsTrigger>
              <TabsTrigger 
                value="manage" 
                disabled
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-400 rounded-md transition-all py-2"
              >
                <span className="hidden xs:inline">Manage Supervisor</span>
                <span className="xs:hidden">Manage</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="potential">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center space-y-3">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="text-sm text-slate-600">Loading potential supervisors...</p>
                  </div>
                </div>
              ) : (
                <PotentialSupervisorList
                  shortlist={shortlist}
                  requests={requests}
                  activeRelationship={activeRelationship}
                  reload={loadData}
                  isLoading={isLoading}
                  onRequestSupervisor={(supervisor) => {
                    setProposalSupervisor(supervisor);
                    setIsProposalOpen(true);
                  }}
                  onViewRequest={(request) => {
                    setDetailRequest(request);
                    setDetailRelationship(null);
                    setTab('status');
                  }}
                />
              )}
            </TabsContent>
            <TabsContent value="status">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center space-y-3">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="text-sm text-slate-600">Loading your requests...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Show recommended supervisors for rejected requests */}
                  {requests
                    .filter(req => req.status === 'rejected' && req.recommended_supervisors && req.recommended_supervisors.length > 0)
                    .map((req, index) => (
                      <RecommendedSupervisorsSection
                        key={req.id}
                        requestId={req.id}
                        isFirstSection={index === 0}
                      />
                    ))
                  }
                  
                  <RequestStatusList
                    requests={requests}
                    reload={loadData}
                    onOpenDetail={(request) => {
                      setDetailRequest(request);
                      setDetailRelationship(null);
                    }}
                  />
                </div>
              )}
            </TabsContent>
            <TabsContent value="manage">
              <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
                No supervisors yet.
              </div>
              </TabsContent>
            </Tabs>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3 lg:pl-6 mt-6 lg:mt-0">
            <div className="sticky top-6 space-y-6">
              <RecentActivityPanel userRole="student" triggerReload={activityTrigger} />
              <UpcomingMeetingsPanel userRole="student" triggerReload={activityTrigger} />
            </div>
          </div>
        </div>

        <ProposalModal
          isOpen={isProposalOpen}
          onClose={() => {
            setIsProposalOpen(false);
            setProposalSupervisor(null);
          }}
          supervisor={proposalSupervisor}
          onSubmitted={() => {
            setIsProposalOpen(false);
            setProposalSupervisor(null);
            loadData();
          }}
        />

        {/* Request Detail Card for viewing requests */}
        {detailRequest && !detailRelationship && (
          <UnifiedRequestDetailCard
            request={detailRequest}
            onClose={() => {
              setDetailRequest(null);
            }}
            onUpdated={loadData}
            userRole="student"
          />
        )}

        {/* Relationship Detail Modal for active supervisions */}
        {detailRelationship && (
          <RelationshipDetailModal
            request={detailRequest}
            relationship={detailRelationship}
            onClose={() => {
              setDetailRequest(null);
              setDetailRelationship(null);
            }}
            onUpdated={loadData}
          />
        )}

        {/* Force Unbind Request Modal - Supervisor-initiated unbind requests */}
        {pendingUnbindRequest && (
          <ForceUnbindRequestModal
            unbindRequest={pendingUnbindRequest.unbindRequest}
            relationship={pendingUnbindRequest.relationship}
            onResponse={loadData}
            userRole="student"
          />
        )}

        {/* Student Notification Modals */}
        <UnifiedNotificationModal
          type="offer"
          data={offerData}
          isOpen={showOfferModal}
          onClose={() => setShowOfferModal(false)}
          onNavigate={() => {
            setTab('status');
            setShowOfferModal(false);
          }}
        />

        <UnifiedNotificationModal
          type="rejection"
          data={rejectionData}
          isOpen={showRejectionModal}
          onClose={() => setShowRejectionModal(false)}
          onNavigate={() => {
            setTab('status');
            setShowRejectionModal(false);
          }}
        />
      </div>
    </MainLayout>
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
