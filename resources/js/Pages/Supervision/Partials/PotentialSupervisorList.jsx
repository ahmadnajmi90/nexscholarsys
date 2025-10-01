import React, { useMemo, useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { User2, MessageSquareMore, Trash2, Loader2, BookOpen, FolderKanban, UserPlus } from 'lucide-react';
import { logError } from '@/Utils/logError';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Avatar, AvatarFallback } from '@/Components/ui/avatar';

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
  isLoading = false,
  reload,
  onRequestSupervisor,
  onViewRequest,
  onRemoveSuccess,
  emptyState = 'default'
}) {
  const [removingId, setRemovingId] = useState(null);

  const activeRequestMap = useMemo(() => {
    if (!Array.isArray(requests)) return {};
    return requests.reduce((acc, request) => {
      if (!['cancelled', 'auto_cancelled'].includes(request.status)) {
        const key = String(request.academician_id ?? '');
        if (key) {
          acc[key] = request;
        }
      }
      return acc;
    }, {});
  }, [requests]);

  const handleRemove = async (item) => {
    if (!item?.academician_id) return;
    setRemovingId(item.academician_id);
    try {
      await axios.delete(route('supervision.shortlist.destroy', item.academician_id));
      toast.success('Removed from your potential supervisor list');
      onRemoveSuccess?.(item);
      reload?.();
    } catch (error) {
      logError(error, 'Supervision handleRemove');
      const message = error?.response?.data?.message || 'Failed to remove supervisor';
      toast.error(message);
    } finally {
      setRemovingId(null);
    }
  };

  const isEmpty = !isLoading && (!Array.isArray(shortlist) || shortlist.length === 0);
  const { title, description } = useMemo(() => EMPTY_STATES[emptyState] ?? EMPTY_STATES.default, [emptyState]);

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={`potential-skeleton-${index}`} className="border border-dashed rounded-xl p-5 bg-white shadow-sm animate-pulse">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-full bg-slate-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 rounded bg-slate-200" />
                  <div className="h-3 w-24 rounded bg-slate-100" />
                </div>
              </div>
              <div className="h-3 w-20 rounded bg-slate-100" />
            </div>
            <div className="mt-4 flex items-center gap-4">
              <div className="h-3 w-24 rounded bg-slate-100" />
              <div className="h-3 w-28 rounded bg-slate-100" />
              <div className="h-3 w-20 rounded bg-slate-100" />
            </div>
            <div className="mt-3 space-y-2">
              <div className="h-3 w-32 rounded bg-slate-100" />
              <div className="flex gap-2">
                <div className="h-6 w-24 rounded-full bg-slate-100" />
                <div className="h-6 w-20 rounded-full bg-slate-100" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 pt-4 border-t">
              <div className="h-10 flex-1 rounded bg-slate-200" />
              <div className="h-10 flex-1 rounded bg-slate-200" />
              <div className="h-10 w-10 rounded bg-slate-200" />
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
    <div className="grid gap-4 sm:grid-cols-2">
      {shortlist.map((item) => {
        const identifier = item?.academician_id
          ?? item?.academician?.user?.academician?.academician_id
          ?? item?.academician?.academician_id
          ?? item?.academician?.user?.academician_id;
        const existingRequest = identifier ? activeRequestMap[String(identifier)] : null;

        return (
          <PotentialSupervisorCard
            key={item.id}
            item={item}
            existingRequest={existingRequest}
            onRemove={handleRemove}
            onRequest={onRequestSupervisor}
            onViewRequest={onViewRequest}
            isRemoving={removingId === item.academician_id}
          />
        );
      })}
    </div>
  );
}

function PotentialSupervisorCard({ item, onRemove, onRequest, onViewRequest, isRemoving, existingRequest }) {
  const [showAllAreas, setShowAllAreas] = useState(false);
  const [isConnLoading, setIsConnLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('not_connected');
  const [connectionId, setConnectionId] = useState(null);
  
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

  // Initialize connection status from user data
  useEffect(() => {
    if (user?.connection_status_with_auth_user) {
      setConnectionStatus(user.connection_status_with_auth_user.status || 'not_connected');
      setConnectionId(user.connection_status_with_auth_user.connection_id || null);
    }
  }, [user]);

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
    <div className="border rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 min-w-0">
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
                <h3 className="text-[1.05rem] font-semibold text-gray-900 leading-snug truncate hover:text-indigo-600 transition-colors cursor-pointer">{fullName}</h3>
              </Link>
            ) : (
              <h3 className="text-[1.05rem] font-semibold text-gray-900 leading-snug truncate">{fullName}</h3>
            )}
            {university && <p className="text-sm text-gray-600 truncate font-normal">{university}</p>}
          </div>
        </div>
        {savedAt && (
          <div className="text-xs text-slate-500 flex-shrink-0">
            Saved {savedAt}
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="mt-4 flex items-center flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600">
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
          <div className="flex flex-wrap gap-2">
            {displayedAreas.map((area, i) => (
              <span key={i} className="px-2.5 py-1 text-xs rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                {area}
              </span>
            ))}
            {researchAreas.length > 1 && (
              <button
                onClick={() => setShowAllAreas(!showAllAreas)}
                className="px-2.5 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors"
              >
                {showAllAreas ? 'Show less' : `+${researchAreas.length - 1} more`}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Info Note */}
      {/* <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-xs text-blue-900">
        Your proposal and documents will be included when you submit a supervision request.
      </div> */}

      {/* Actions */}
      <div className="mt-4 flex items-center gap-2 pt-4 border-t">
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

        <Button
          className="flex-1"
          variant={existingRequest ? 'outline' : 'default'}
          onClick={() => (existingRequest ? onViewRequest?.(existingRequest) : onRequest?.(item))}
        >
          <MessageSquareMore className="mr-2 h-4 w-4" />
          {existingRequest ? 'View Request' : 'Request Supervision'}
        </Button>
        
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

