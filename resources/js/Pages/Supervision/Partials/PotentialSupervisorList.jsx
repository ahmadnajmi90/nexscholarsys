import React, { useMemo, useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { User2, MessageSquareMore, Trash2, Loader2, BookOpen, FolderKanban, UserPlus, CheckCircle2, Send, Eye } from 'lucide-react';
import { logError } from '@/Utils/logError';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Avatar, AvatarFallback } from '@/Components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip';
import ConfirmationModal from '@/Components/ConfirmationModal';

const EMPTY_STATES = {
  default: {
    title: 'No potential supervisors yet',
    description: 'Start by adding supervisors from your recommendations list to keep track of who you want to approach.'
  },
  search: {
    title: 'No matches found',
    description: 'Try adjusting your search filters or browse the full list.'
  }
};

export default function PotentialSupervisorList({
  shortlist = [],
  requests = [],
  activeRelationship = null,
  isLoading = false,
  reload,
  onRequestSupervisor,
  onViewRequest,
  onRemoveSuccess,
  emptyState = 'default'
}) {
  const [removingId, setRemovingId] = useState(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  const activeRequestMap = useMemo(() => {
    if (!Array.isArray(requests)) return {};
    return requests.reduce((acc, request) => {
      // Exclude cancelled, auto_cancelled, and rejected requests - allow students to submit new requests
      if (!['cancelled', 'auto_cancelled', 'rejected'].includes(request.status)) {
        const key = String(request.academician_id ?? '');
        if (key) {
          acc[key] = request;
        }
      }
      return acc;
    }, {});
  }, [requests]);

  const handleRemoveClick = (item) => {
    setItemToRemove(item);
    setShowRemoveModal(true);
  };

  const handleConfirmRemove = async () => {
    if (!itemToRemove) return;
    
    // Get the actual academician_id (string like "ACAD-XXX") from the nested academician object
    const academicianId = itemToRemove?.academician?.academician_id;
    
    if (!academicianId) {
      toast.error('Unable to identify supervisor to remove');
      setShowRemoveModal(false);
      setItemToRemove(null);
      return;
    }
    
    setRemovingId(academicianId);
    setShowRemoveModal(false);
    
    try {
      await axios.delete(route('supervision.shortlist.destroy', academicianId));
      toast.success('Removed from your potential supervisor list');
      onRemoveSuccess?.(itemToRemove);
      reload?.();
    } catch (error) {
      logError(error, 'Supervision handleRemove');
      const message = error?.response?.data?.message || 'Failed to remove supervisor';
      toast.error(message);
    } finally {
      setRemovingId(null);
      setItemToRemove(null);
    }
  };

  const isEmpty = !isLoading && (!Array.isArray(shortlist) || shortlist.length === 0);
  const { title, description } = useMemo(() => EMPTY_STATES[emptyState] ?? EMPTY_STATES.default, [emptyState]);

  if (isLoading) {
    return (
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={`potential-skeleton-${index}`} className="border border-dashed rounded-xl p-4 sm:p-5 bg-white shadow-sm animate-pulse min-h-[320px] sm:min-h-[340px] flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2 sm:gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0" />
                <div className="flex-1 space-y-1.5 sm:space-y-2 min-w-0">
                  <div className="h-3.5 sm:h-4 w-28 sm:w-32 rounded bg-slate-200" />
                  <div className="h-2.5 sm:h-3 w-20 sm:w-24 rounded bg-slate-100" />
                </div>
              </div>
              <div className="h-2.5 sm:h-3 w-16 sm:w-20 rounded bg-slate-100 flex-shrink-0" />
            </div>
            
            {/* Metadata */}
            <div className="mt-3 sm:mt-4 flex items-center gap-3 sm:gap-4 flex-wrap">
              <div className="h-2.5 sm:h-3 w-20 sm:w-24 rounded bg-slate-100" />
              <div className="h-2.5 sm:h-3 w-24 sm:w-28 rounded bg-slate-100" />
              <div className="h-2.5 sm:h-3 w-16 sm:w-20 rounded bg-slate-100" />
            </div>
            
            {/* Research Areas */}
            <div className="mt-3 flex-1">
              <div className="h-2.5 sm:h-3 w-24 sm:w-32 rounded bg-slate-100 mb-2" />
              <div className="flex flex-wrap gap-2">
                <div className="h-5 sm:h-6 w-28 sm:w-32 rounded-full bg-slate-100" />
                <div className="h-5 sm:h-6 w-16 sm:w-20 rounded-full bg-slate-100" />
              </div>
              <div className="mt-2">
                <div className="h-5 sm:h-6 w-12 sm:w-16 rounded-full bg-slate-100" />
              </div>
            </div>
            
            {/* Actions */}
            <div className="mt-3 sm:mt-4 flex flex-col xs:flex-row items-stretch xs:items-center gap-2 pt-3 sm:pt-4 border-t border-slate-200">
              <div className="h-9 sm:h-10 flex-1 rounded bg-slate-200" />
              <div className="h-9 sm:h-10 flex-1 rounded bg-slate-200" />
              <div className="h-9 sm:h-10 w-full xs:w-10 rounded bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <Card className="border-dashed border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-800">{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">
          {description}
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={() => onRequestSupervisor?.(null)}>Find supervisors</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {shortlist.map((item) => {
          const identifier = item?.academician_id
            ?? item?.academician?.user?.academician?.academician_id
            ?? item?.academician?.academician_id
            ?? item?.academician?.user?.academician_id;
          const existingRequest = identifier ? activeRequestMap[String(identifier)] : null;
          const academicianId = item?.academician?.academician_id;

          return (
            <PotentialSupervisorCard
              key={item.id}
              item={item}
              existingRequest={existingRequest}
              activeRelationship={activeRelationship}
              onRemove={handleRemoveClick}
              onRequest={onRequestSupervisor}
              onViewRequest={onViewRequest}
              isRemoving={removingId === academicianId}
            />
          );
        })}
      </div>

      {/* Remove Confirmation Modal */}
      <ConfirmationModal
        show={showRemoveModal}
        onClose={() => {
          setShowRemoveModal(false);
          setItemToRemove(null);
        }}
        onConfirm={handleConfirmRemove}
        title="Remove from Potential Supervisors"
        message={`Are you sure you want to remove ${itemToRemove?.academician?.full_name || 'this supervisor'} from your potential supervisor list? You can always add them back later.`}
        confirmButtonText="Yes, Remove"
      />
    </>
  );
}

function PotentialSupervisorCard({ item, onRemove, onRequest, onViewRequest, isRemoving, existingRequest, activeRelationship = null }) {
  const [showAllAreas, setShowAllAreas] = useState(false);
  
  const academician = item?.academician ?? {};
  const fullName = academician.full_name ?? 'Supervisor';
  const availability = academician.availability_as_supervisor;
  const avatarUrl = academician.profile_picture ? `/storage/${academician.profile_picture}` : null;
  const savedAt = item?.saved_at ? formatDistanceToNow(new Date(item.saved_at), { addSuffix: true }) : null;
  const university = academician.university?.name || '';
  const publications = academician.publications_count ?? 0;
  const projects = academician.projects_count ?? 0;
  const researchAreas = academician.research_areas || [];
  const profileUrl = academician.url || null;

  const user = academician?.user;
  const displayedAreas = showAllAreas ? researchAreas : researchAreas.slice(0, 1);

  // Check if this supervisor is the student's current/bound supervisor
  const academicianIdentifier = item?.academician_id;
  const isCurrentSupervisor = useMemo(() => {
    if (!activeRelationship || !academicianIdentifier) return false;
    return String(activeRelationship.academician_id) === String(academicianIdentifier);
  }, [activeRelationship, academicianIdentifier]);

  // Check if student has any active relationship
  const hasActiveRelationship = Boolean(activeRelationship);

  // Connection state - initialize directly from user data (like SupervisorCard.jsx)
  const [isConnLoading, setIsConnLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(
    user?.connection_status_with_auth_user?.status || 'not_connected'
  );
  const [connectionId, setConnectionId] = useState(
    user?.connection_status_with_auth_user?.connection_id || null
  );

  const connect = async () => {
    if (!user?.id) return;
    setIsConnLoading(true);
    try {
      const response = await axios.post(route('api.app.connections.store', user.id));
      if (response.data && response.data.connection) {
        setConnectionStatus('pending_sent');
        setConnectionId(response.data.connection.id);
        toast.success('Connection request sent');
      }
    } catch (error) {
      logError(error, 'PotentialSupervisorCard connect');
      toast.error('Failed to send connection request');
    } finally {
      setIsConnLoading(false);
    }
  };

  const acceptRequest = async () => {
    if (!connectionId) return;
    setIsConnLoading(true);
    try {
      await axios.patch(route('api.app.connections.accept', connectionId));
      setConnectionStatus('connected');
      toast.success('Connection request accepted');
    } catch (error) {
      logError(error, 'PotentialSupervisorCard acceptRequest');
      toast.error('Failed to accept connection');
    } finally {
      setIsConnLoading(false);
    }
  };

  const withdrawOrRemove = async () => {
    if (!connectionId) return;
    setIsConnLoading(true);
    try {
      await axios.delete(route('api.app.connections.destroy', connectionId));
      setConnectionStatus('not_connected');
      setConnectionId(null);
      toast.success('Connection removed');
    } catch (error) {
      logError(error, 'PotentialSupervisorCard withdrawOrRemove');
      toast.error('Failed to remove connection');
    } finally {
      setIsConnLoading(false);
    }
  };

  return (
    <div className="border rounded-xl p-4 sm:p-5 bg-white shadow-sm hover:shadow-md transition-shadow min-h-[320px] sm:min-h-[340px] flex flex-col">
      {/* Card Content - Grows to fill space */}
      <div className="flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 sm:gap-3 min-w-0">
            {profileUrl ? (
              <Link href={route('academicians.show', profileUrl)} className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-indigo-300 transition-all cursor-pointer">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <User2 className="w-5 h-5 text-indigo-600" />
                  )}
                </div>
              </Link>
            ) : (
              <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <User2 className="w-5 h-5 text-indigo-600" />
                )}
              </div>
            )}
            <div className="min-w-0 flex-1">
              {profileUrl ? (
                <Link href={route('academicians.show', profileUrl)}>
                  <h3 className="text-sm sm:text-[1.05rem] font-semibold text-gray-900 leading-snug truncate hover:text-indigo-600 transition-colors cursor-pointer">{fullName}</h3>
                </Link>
              ) : (
                <h3 className="text-sm sm:text-[1.05rem] font-semibold text-gray-900 leading-snug truncate">{fullName}</h3>
              )}
              {university && <p className="text-xs sm:text-sm text-gray-600 truncate font-normal">{university}</p>}
            </div>
          </div>
          {savedAt && (
            <div className="text-[10px] sm:text-xs text-slate-500 flex-shrink-0">
              Saved {savedAt}
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="mt-3 sm:mt-4 flex items-center flex-wrap gap-x-3 sm:gap-x-4 gap-y-2 text-xs sm:text-sm text-gray-600">
          {availability && (
            <div className="inline-flex items-center gap-1.5 text-green-700">
              <MessageSquareMore className="w-4 h-4" />
              <span>Accepting Students</span>
            </div>
          )}
          <div className="flex items-center">
            <BookOpen className="w-4 h-4 mr-1.5 text-gray-400" />
            <span>{publications} Publications</span>
          </div>
          <div className="flex items-center">
            <FolderKanban className="w-4 h-4 mr-1.5 text-gray-400" />
            <span>{projects} Projects</span>
          </div>
        </div>

        {/* Research Areas */}
        {Array.isArray(researchAreas) && researchAreas.length > 0 && (
          <div className="mt-3">
            <p className="text-gray-800 text-sm font-medium mb-2">Research Areas:</p>
            <TooltipProvider delayDuration={300}>
              <div className="flex flex-wrap gap-2">
                {displayedAreas.map((area, i) => (
                  <Tooltip key={i}>
                    <TooltipTrigger asChild>
                      <span className="px-2.5 py-1 text-xs rounded-full bg-gray-100 text-gray-700 border border-gray-200 line-clamp-1 truncate max-w-[350px] cursor-help">
                        {area}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p className="text-xs">{area}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </TooltipProvider>
            {/* Count badge on separate line below research areas */}
            <div className="mt-2">
              {researchAreas.length > 1 ? (
                <button
                  onClick={() => setShowAllAreas(!showAllAreas)}
                  className="px-2.5 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors"
                >
                  {showAllAreas ? 'Show less' : `+${researchAreas.length - 1} more`}
                </button>
              ) : (
                <span className="px-2.5 py-1 text-xs rounded-full bg-slate-50 text-slate-500 border border-slate-200">
                  1 area
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Actions - Always at bottom */}
      <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 pt-3 sm:pt-4 border-t">
        {/* Primary Actions */}
        {(() => {
          if (isConnLoading) {
            return (
              <button className="inline-flex items-center justify-center px-4 py-2 bg-gray-400 text-white rounded-md text-sm font-medium flex-1" disabled>
                Processing...
              </button>
            );
          }
          switch (connectionStatus) {
            case 'connected':
              return (
                <button className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium flex-1" disabled>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Connected
                </button>
              );
            case 'pending_sent':
              return (
                <button className="inline-flex items-center justify-center px-4 py-2 bg-gray-400 text-white rounded-md text-sm font-medium flex-1" disabled>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Pending
                </button>
              );
            case 'pending_received':
              return (
                <button onClick={acceptRequest} className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 flex-1">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Accept
                </button>
              );
            case 'not_connected':
            default:
              return (
                <button onClick={connect} className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 flex-1">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Connect
                </button>
              );
          }
        })()}

        {!hasActiveRelationship ? (
          <Button
            className="flex-1 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            variant="ghost"
            onClick={() => (existingRequest ? onViewRequest?.(existingRequest) : onRequest?.(item))}
          >
            {existingRequest ? (
              <>
                <Eye className="mr-2 h-4 w-4" />
                View Request
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Request
              </>
            )}
          </Button>
        ) : isCurrentSupervisor ? (
          <Button
            className="flex-1 border-2 border-green-500 bg-green-50 text-green-700 hover:bg-green-100"
            onClick={() => onViewRequest?.(existingRequest)}
          >
            <CheckCircle2 className="mr-2 h-4 w-4 fill-current" />
            Your Current Supervisor
          </Button>
        ) : (
          <Button
            className="flex-1"
            variant="outline"
            disabled
          >
            <MessageSquareMore className="mr-2 h-4 w-4" />
            Request
          </Button>
        )}
        
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={isRemoving}
          onClick={() => onRemove?.(item)}
          className="h-10 w-10"
        >
          {isRemoving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}

