import React, { useEffect, useState } from 'react';
import { Link, router } from '@inertiajs/react';
import axios from 'axios';
import { User2, CheckCircle2, BookOpen, FolderKanban, Sparkles, Mail, ExternalLink, UserPlus, Heart } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import InsightModal from '@/Components/Postgraduate/InsightModal';
import BookmarkHandler from '@/Utils/BookmarkHandler';

export default function SupervisorCard({ supervisor }) {
  if (!supervisor) return null;

  console.log(supervisor);

  const name = supervisor.name || 'Supervisor';
  const department = supervisor.department || '';
  const score = typeof supervisor.match_score === 'number' ? Math.round(supervisor.match_score * 100) : null;
  const accepting = supervisor.accepting_students !== false;
  const tags = Array.isArray(supervisor.research_areas) ? supervisor.research_areas : [];
  const publications = supervisor.publications_count ?? 0;
  const projects = supervisor.post_projects_count ?? 0;
  const [isInsightModalOpen, setIsInsightModalOpen] = useState(false);
  const why = supervisor.justification || '';
  const academician = supervisor.academician || {};
  const user = academician.user || supervisor.user || null;

  // Connection state
  const [isConnLoading, setIsConnLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(
    user?.connection_status_with_auth_user?.status || 'not_connected'
  );
  const [connectionId, setConnectionId] = useState(
    user?.connection_status_with_auth_user?.connection_id || null
  );

  // Bookmark state
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const bookmarkableType = 'academician';
  const bookmarkableId = academician.id || supervisor.academician_id || supervisor.id;

  useEffect(() => {
    let mounted = true;
    async function checkBookmark() {
      try {
        const resp = await BookmarkHandler.checkBookmarkStatus(bookmarkableType, bookmarkableId);
        if (mounted) setIsBookmarked(!!resp.is_bookmarked);
      } catch (e) {
        // silent fail
      } finally {
        if (mounted) setIsBookmarkLoading(false);
      }
    }
    if (bookmarkableId) {
      checkBookmark();
    } else {
      setIsBookmarkLoading(false);
    }
    return () => {
      mounted = false;
    };
  }, [bookmarkableId]);

  const connect = async () => {
    if (!user?.id) return;
    setIsConnLoading(true);
    try {
              const response = await axios.post(route('api.app.connections.store', user.id));
      if (response.data && response.data.connection) {
        setConnectionStatus('pending_sent');
        setConnectionId(response.data.connection.id);
      }
    } catch (error) {
      console.error('Error sending connection request:', error);
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
    } catch (error) {
      console.error('Error accepting connection request:', error);
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
    } catch (error) {
      console.error('Error removing connection:', error);
    } finally {
      setIsConnLoading(false);
    }
  };

  const toggleBookmark = async () => {
    if (!bookmarkableId || isBookmarkLoading) return;
    setIsBookmarkLoading(true);
    try {
      const resp = await BookmarkHandler.toggleBookmark(bookmarkableType, bookmarkableId, 'Academicians');
      setIsBookmarked(!!resp.is_bookmarked);
    } catch (e) {
      console.error('Error toggling bookmark:', e);
    } finally {
      setIsBookmarkLoading(false);
    }
  };

  const profileUrl = academician.url || supervisor.url || null;
  const emailTo = supervisor?.email || '';

  return (
    <TooltipProvider delayDuration={0}>
      <div className="border rounded-xl p-5 bg-white shadow-sm transition-all duration-200 ease-in-out hover:shadow-lg hover:ring-2 hover:ring-indigo-200 hover:-translate-y-1">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center">
            <img src={supervisor.avatar_url !== null ? `/storage/${supervisor.avatar_url}` : "/storage/profile_pictures/default.jpg"} alt={name} className="w-full h-full object-cover rounded-full" />
          </div>
          <div className="min-w-0">
            <h3 className="text-[1.05rem] font-semibold text-gray-900 leading-snug truncate">{name}
            {department && <p className="text-sm text-gray-600 truncate font-normal">{department}</p>}
            </h3>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-1 flex-shrink-0">
        {score !== null && (
          <div className="px-2.5 py-1 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-semibold">
            {score}% <span className="font-normal text-[11px]">Match</span>
          </div>
        )}
        </div>
      </div>

      {/* Updated Metadata */}
      <div className="mt-4 flex items-center space-x-4 text-sm text-gray-600">
        {accepting && (
          <div className="inline-flex items-center gap-1.5 text-green-700">
            <CheckCircle2 className="w-4 h-4" />
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
      {tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          <p className="text-gray-800 text-sm font-medium">Research Areas:</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((t, i) => (
              <span key={i} className="px-2.5 py-1 text-xs rounded-full bg-gray-100 text-gray-700 border border-gray-200">{t}</span>
            ))}
          </div>
        </div>
      )}

      {/* Why this match */}
      {why && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-900">
          <div className="flex items-center gap-2 mb-1 text-blue-800 font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>AI Insight</span>
          </div>
          <div className="flex items-start gap-2">
            <p className="leading-relaxed line-clamp-3">{why}</p>
          </div>
          {why.length > 200 && (
            <button onClick={() => setIsInsightModalOpen(true)} className="mt-2 text-xs text-blue-700 hover:underline">Show More…</button>
          )}
          <InsightModal
            isOpen={isInsightModalOpen}
            onClose={() => setIsInsightModalOpen(false)}
            title="AI Insight"
            content={why}
          />
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex items-center gap-2 pt-4 border-t">
        {/* Primary Actions */}
        {(() => {
          // Determine button appearance and behavior based on connection status
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

        {profileUrl ? (
          <Link href={route('academicians.show', profileUrl)} className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 flex-1">
            <ExternalLink className="w-4 h-4 mr-2" />
            View Profile
          </Link>
        ) : (
          <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-400 bg-white flex-1" disabled>
            <ExternalLink className="w-4 h-4 mr-2" />
            View Profile
          </button>
        )}

        {/* Secondary Icon-Only Actions */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button onClick={toggleBookmark} className="inline-flex items-center justify-center h-9 w-9 border border-gray-300 rounded-md text-gray-600 bg-white hover:bg-gray-50" disabled={isBookmarkLoading}>
              <span className="sr-only">Save</span>
              {isBookmarked ? (
                <Heart className="w-4 h-4 fill-red-500 text-red-500" />
              ) : (
                <Heart className="w-4 h-4" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Save</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            {emailTo ? (
              <Link href={route('email.compose', { to: emailTo })} className="inline-flex items-center justify-center h-9 w-9 border border-gray-300 rounded-md text-gray-600 bg-white hover:bg-gray-50">
                <span className="sr-only">Contact</span>
                <Mail className="w-4 h-4" />
              </Link>
            ) : (
              <button className="inline-flex items-center justify-center h-9 w-9 border border-gray-300 rounded-md text-gray-300 bg-white" disabled>
                <span className="sr-only">Contact</span>
                <Mail className="w-4 h-4" />
              </button>
            )}
          </TooltipTrigger>
          <TooltipContent>
            <p>Contact</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
    </TooltipProvider>
  );
}

