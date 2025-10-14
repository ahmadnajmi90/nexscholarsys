import React, { useEffect, useState, useMemo } from 'react';
import { Link, router } from '@inertiajs/react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { User2, CheckCircle2, BookOpen, FolderKanban, Sparkles, Mail, ExternalLink, UserPlus, BookmarkPlus, Bookmark, Send, Eye } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import InsightModal from '@/Components/Postgraduate/InsightModal';
import ProposalModal from '@/Pages/Supervision/Partials/ProposalModal';
import BookmarkHandler from '@/Utils/BookmarkHandler';
import { logError } from '@/Utils/logError';

export default function SupervisorCard({ supervisor, requests = [], activeRelationship = null, onRequestSubmitted }) {
  if (!supervisor) return null;

  const [showAllAreas, setShowAllAreas] = useState(false);
  const name = supervisor.name || 'Supervisor';
  console.log(supervisor)
  
  // Get current position and university from root level (SupervisorMatchingService provides this)
  const currentPosition = supervisor.current_position || '';
  const universityName = supervisor.university?.name || supervisor.university?.full_name || '';
  
  const score = typeof supervisor.match_score === 'number' ? Math.round(supervisor.match_score * 100) : null;
  const accepting = supervisor.accepting_students !== false;
  const tags = Array.isArray(supervisor.research_areas) ? supervisor.research_areas : [];
  const publications = supervisor.publications_count ?? 0;
  const projects = supervisor.post_projects_count ?? 0;
  const [isInsightModalOpen, setIsInsightModalOpen] = useState(false);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const why = supervisor.justification || '';
  const academician = supervisor.academician || {};
  const user = academician.user || supervisor.user || null;
  const displayedTags = showAllAreas ? tags : tags.slice(0, 1);

  // Connection state
  const [isConnLoading, setIsConnLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(
    user?.connection_status_with_auth_user?.status || 'not_connected'
  );
  const [connectionId, setConnectionId] = useState(
    user?.connection_status_with_auth_user?.connection_id || null
  );

  // Potential Supervisor (Shortlist) state
  const [isShortlistLoading, setIsShortlistLoading] = useState(true);
  const [isInShortlist, setIsInShortlist] = useState(false);
  
  // Bookmark state (keeping for compatibility)
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const bookmarkableType = 'academician';
  const bookmarkableId = academician.id
    || supervisor?.user?.academician?.academician_id
    || supervisor.academician_id
    || supervisor.id;

  // Get academician identifier for supervision requests
  const academicianIdentifier = useMemo(() => {
    return supervisor?.user?.academician?.academician_id
      ?? academician?.academician_id
      ?? supervisor?.academician_id
      ?? supervisor?.id;
  }, [supervisor, academician]);

  // Check for existing supervision request (exclude cancelled, auto_cancelled, and rejected)
  const existingRequest = useMemo(() => {
    if (!Array.isArray(requests) || !academicianIdentifier) return null;
    
    return requests.find(request => {
      if (['cancelled', 'auto_cancelled', 'rejected'].includes(request.status)) return false;
      const requestAcademicianId = String(request.academician_id ?? '');
      return requestAcademicianId === String(academicianIdentifier);
    });
  }, [requests, academicianIdentifier]);

  // Check if this supervisor is the student's current/bound supervisor
  const isCurrentSupervisor = useMemo(() => {
    if (!activeRelationship || !academicianIdentifier) return false;
    return String(activeRelationship.academician_id) === String(academicianIdentifier);
  }, [activeRelationship, academicianIdentifier]);

  // Check if student has any active relationship (to disable actions for other supervisors)
  const hasActiveRelationship = Boolean(activeRelationship);

  // Check if already in shortlist
  useEffect(() => {
    let mounted = true;
    async function checkShortlist() {
      if (!academicianIdentifier) {
        setIsShortlistLoading(false);
        return;
      }
      
      try {
        const response = await axios.get(route('supervision.shortlist.index'));
        if (mounted) {
          const shortlist = response.data?.data || [];
          const exists = shortlist.some(item => 
            String(item.academician_id) === String(academicianIdentifier)
          );
          setIsInShortlist(exists);
        }
      } catch (e) {
        // silent fail
      } finally {
        if (mounted) setIsShortlistLoading(false);
      }
    }
    checkShortlist();
    return () => {
      mounted = false;
    };
  }, [academicianIdentifier]);

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
      logError(error, 'SupervisorCard connect');
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
      logError(error, 'SupervisorCard acceptRequest');
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
      logError(error, 'SupervisorCard withdrawOrRemove');
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
      logError(e, 'SupervisorCard toggleBookmark');
    } finally {
      setIsBookmarkLoading(false);
    }
  };

  const addToPotentialSupervisors = async () => {
    if (isShortlistLoading || isInShortlist || hasActiveRelationship) return;
    setIsShortlistLoading(true);
    try {
      if (!academicianIdentifier) {
        logError(new Error('Missing academician identifier'), 'SupervisorCard shortlist');
        toast.error('Cannot save supervisor right now. Please try again later.');
        return;
      }

      await axios.post(route('supervision.shortlist.store'), {
        academician_id: String(academicianIdentifier),
        postgraduate_program_id: supervisor.postgraduate_program_id ?? null,
      });
      setIsInShortlist(true);
      toast.success('Added to Potential Supervisors');
    } catch (error) {
      logError(error, 'SupervisorCard shortlist');
      toast.error(error.response?.data?.message || 'Failed to save');
    } finally {
      setIsShortlistLoading(false);
    }
  };

  const handleProposalSubmitted = () => {
    setIsProposalModalOpen(false);
    onRequestSubmitted?.();
  };

  const handleRequestClick = () => {
    if (hasActiveRelationship && !isCurrentSupervisor) {
      // Student already has a supervisor, prevent action
      toast.error('You already have an active supervision relationship.');
      return;
    }

    if (existingRequest || isCurrentSupervisor) {
      // Store the request ID in session storage to open the detail modal after navigation
      sessionStorage.setItem('openRequestId', existingRequest?.id || '');
      
      // Navigate to the supervision page where RequestStatusList is located
      router.visit(route('supervision.student.index'), {
        preserveState: false,
        preserveScroll: false
      });
    } else {
      setIsProposalModalOpen(true);
    }
  };

  // Transform supervisor data for ProposalModal
  const transformedSupervisor = useMemo(() => {
    // Backend now provides all necessary fields via SupervisorMatchingService
    // Structure matches PotentialSupervisorResource format
    const transformed = {
      ...supervisor,
      academician: {
        full_name: supervisor.name || academician.full_name || 'Supervisor',
        current_position: supervisor.current_position || academician.current_position || currentPosition || '',
        university: supervisor.university || {
          name: supervisor.university?.name || academician.university?.name || universityName || ''
        },
        universityDetails: {
          full_name: supervisor.university?.full_name || academician.universityDetails?.full_name || universityName || ''
        },
        research_domains: supervisor.research_domains || academician.research_domains || [],
        academician_id: academicianIdentifier,
        url: academician.url || supervisor.url || null
      },
      user: user,
      postgraduate_program_id: supervisor.postgraduate_program_id
    };
    
    return transformed;
  }, [supervisor, academician, academicianIdentifier, user, currentPosition, universityName]);

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
            <h3 className="text-[1.05rem] font-semibold text-gray-900 leading-snug truncate">{name}</h3>
            {currentPosition && <p className="text-sm text-gray-600 truncate font-normal">{currentPosition}</p>}
            {universityName && <p className="text-xs text-gray-500 truncate font-normal">{universityName}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {!hasActiveRelationship && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={addToPotentialSupervisors}
                  disabled={isShortlistLoading || isInShortlist}
                  className={`inline-flex items-center justify-center h-8 w-8 border rounded-md text-sm font-medium transition-colors ${
                    isInShortlist
                      ? 'border-indigo-300 bg-indigo-50 text-indigo-600'
                      : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
                  } disabled:opacity-50`}
                >
                  <span className="sr-only">
                    {isInShortlist ? 'Already in potential supervisors' : 'Add to potential supervisors'}
                  </span>
                  {isInShortlist ? (
                    <Bookmark className="w-4 h-4 fill-current" />
                  ) : (
                    <BookmarkPlus className="w-4 h-4" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isInShortlist ? 'Already in Potential Supervisors' : 'Add to Potential Supervisors'}</p>
              </TooltipContent>
            </Tooltip>
          )}
          {isCurrentSupervisor && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  disabled
                  className="inline-flex items-center justify-center h-8 w-8 border border-indigo-300 bg-indigo-50 text-indigo-600 rounded-md text-sm font-medium"
                >
                  <span className="sr-only">Your current supervisor</span>
                  <Bookmark className="w-4 h-4 fill-current" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Your Current Supervisor</p>
              </TooltipContent>
            </Tooltip>
          )}
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
        <div className="mt-3">
          <p className="text-gray-800 text-sm font-medium mb-2">Research Areas:</p>
          <div className="flex flex-wrap gap-2">
            {displayedTags.map((t, i) => (
              <span key={i} className="px-2.5 py-1 text-xs rounded-full bg-gray-100 text-gray-700 border border-gray-200">{t}</span>
            ))}
            {tags.length > 1 && (
              <button
                onClick={() => setShowAllAreas(!showAllAreas)}
                className="px-2.5 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors"
              >
                {showAllAreas ? 'Show less' : `+${tags.length - 1} more`}
              </button>
            )}
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

        {!hasActiveRelationship ? (
          <button
            onClick={handleRequestClick}
            className="inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium flex-1 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          >
            {existingRequest ? (
              <>
                <Eye className="w-4 h-4 mr-2" />
                View Request
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Request Supervision
              </>
            )}
          </button>
        ) : isCurrentSupervisor ? (
          <button
            onClick={handleRequestClick}
            className="inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium flex-1 border-2 border-green-500 bg-green-50 text-green-700"
          >
            <CheckCircle2 className="w-4 h-4 mr-2 fill-current" />
            Your Current Supervisor
          </button>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                disabled
                className="inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium flex-1 border border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
              >
                <Send className="w-4 h-4 mr-2" />
                Request Supervision
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>You already have an active supervision relationship</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>

    {/* Proposal Modal */}
    <ProposalModal
      isOpen={isProposalModalOpen}
      supervisor={transformedSupervisor}
      onClose={() => setIsProposalModalOpen(false)}
      onSubmitted={handleProposalSubmitted}
    />
    </TooltipProvider>
  );
}

