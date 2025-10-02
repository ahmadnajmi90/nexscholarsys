import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import axios from 'axios';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { toast } from 'react-hot-toast';
import { logError } from '@/Utils/logError';
import PotentialSupervisorList from '@/Pages/Supervision/Partials/PotentialSupervisorList';
import RequestStatusList from '@/Pages/Supervision/Partials/RequestStatusList';
import RequestDetailCard from '@/Pages/Supervision/Partials/RequestDetailCard';
import ManageSupervisorPanel from '@/Pages/Supervision/Partials/ManageSupervisorPanel';
import ProposalModal from '@/Pages/Supervision/Partials/ProposalModal';
import RelationshipDetailModal from '@/Pages/Supervision/Partials/RelationshipDetailModal';

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

  const hasActiveRelationship = relationships.some(rel => rel.status === 'active');
  const activeRelationship = relationships.find(rel => rel.status === 'active') || null;

  return (
    <MainLayout title="My Supervisor">
      <Head title="My Supervisor" />
      <div className="max-w-7xl mx-auto pb-6">
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
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 bg-gray-100 p-1 rounded-lg h-12">
              <TabsTrigger 
                value="potential"
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 rounded-md transition-all py-2"
              >
                Potential Supervisors
              </TabsTrigger>
              <TabsTrigger 
                value="status"
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 rounded-md transition-all py-2"
              >
                Proposal Status
              </TabsTrigger>
              <TabsTrigger 
                value="manage" 
                disabled
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-400 rounded-md transition-all py-2"
              >
                Manage Supervisor
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
                  onRemoveSuccess={() => toast.success('Removed from potential supervisors')}
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
                <RequestStatusList
                  requests={requests}
                  reload={loadData}
                  onOpenDetail={(request) => {
                    setDetailRequest(request);
                    setDetailRelationship(null);
                  }}
                />
              )}
            </TabsContent>
            <TabsContent value="manage">
              <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
                No supervisors yet.
              </div>
            </TabsContent>
          </Tabs>
        )}
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
          <RequestDetailCard
            request={detailRequest}
            onClose={() => {
              setDetailRequest(null);
            }}
            onUpdated={loadData}
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
      </div>
    </MainLayout>
  );
}

