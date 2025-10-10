import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { MdVerified } from 'react-icons/md';
import { MoreVertical, Bookmark, UserPlus, Mail, Star, BookmarkPlus, Send, Eye, CheckCircle2, ChevronDown, User, Info } from 'lucide-react';
import BookmarkButton from "@/Components/BookmarkButton";
import ConnectionButton from "@/Components/ConnectionButton";
import ProposalModal from '@/Pages/Supervision/Partials/ProposalModal';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { logError } from '@/Utils/logError';
import useRoles from '@/Hooks/useRoles';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export default function ProfileCard({
  match,
  universitiesList,
  researchOptions,
  users,
  searchType,
  supervisionRequests = [],
  activeRelationship = null,
  onRequestSubmitted,
  onQuickInfoClick,
  onRecommendClick,
  onShowInsight
}) {
  // Get profile data from match
  const profile = match.academician || match.student || {};
  const profileId = profile.id || profile.academician_id || profile.postgraduate_id || profile.undergraduate_id;
  const isAcademician = !!match.academician || match.result_type === 'academician';
  const isPostgraduate = match.result_type === 'postgraduate' || profile.student_type === 'postgraduate';
  const isUndergraduate = match.result_type === 'undergraduate' || profile.student_type === 'undergraduate';
  
  // Store AI insights in the profile object itself for later access
  const aiInsights = match.ai_insights || '';
  profile.ai_insights = aiInsights;
  
  // Get current authenticated user role using useRoles hook
  const { isPostgraduate: isCurrentUserPostgraduate } = useRoles();
  
  // Check if supervision features should be shown (3 conditions)
  const showSupervisionFeatures = isAcademician && isCurrentUserPostgraduate && searchType === 'supervisor';
  
  // Card state management
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  
  // Supervision-related state
  const [isShortlistLoading, setIsShortlistLoading] = useState(true);
  const [isInShortlist, setIsInShortlist] = useState(false);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  
  // Get academician identifier for supervision requests
  const academicianIdentifier = useMemo(() => {
    if (!showSupervisionFeatures) return null;
    return profile?.academician_id || profile?.id || null;
  }, [showSupervisionFeatures, profile]);
  
  // Check for existing supervision request (exclude cancelled, auto_cancelled, and rejected)
  const existingRequest = useMemo(() => {
    if (!showSupervisionFeatures || !Array.isArray(supervisionRequests) || !academicianIdentifier) return null;
    
    return supervisionRequests.find(request => {
      if (['cancelled', 'auto_cancelled', 'rejected'].includes(request.status)) return false;
      const requestAcademicianId = String(request.academician_id ?? '');
      return requestAcademicianId === String(academicianIdentifier);
    });
  }, [showSupervisionFeatures, supervisionRequests, academicianIdentifier]);
  
  // Check if this supervisor is the student's current/bound supervisor
  const isCurrentSupervisor = useMemo(() => {
    if (!showSupervisionFeatures || !activeRelationship || !academicianIdentifier) return false;
    return String(activeRelationship.academician_id) === String(academicianIdentifier);
  }, [showSupervisionFeatures, activeRelationship, academicianIdentifier]);
  
  // Check if student has any active relationship (to disable actions for other supervisors)
  const hasActiveRelationship = Boolean(activeRelationship);
  
  // Ref for actions menu
  const actionsMenuRef = useRef(null);
  
  // Get background image (only use profile_picture)
  const getBackgroundImage = () => {
    if (profile.profile_picture && profile.profile_picture !== 'profile_pictures/default.jpg') {
      return `/storage/${profile.profile_picture}`;
    }
    return '/storage/profile_pictures/default.jpg';
  };
  
  // Get university short name
  const universityShortName = universitiesList.find((u) => u.id === profile.university)?.short_name || 
                              profile.university_name || profile.university_short_name || 'Unknown';
  
  // Get tagline based on profile type
  const getTagline = () => {
    if (isAcademician) {
      // Try to get bio first, or construct from position + research
      if (profile.bio) {
        return profile.bio.substring(0, 100);
      }
      
      const researchArray = profile.research_expertise || [];
      if (researchArray.length > 0 && profile.current_position) {
        const firstResearch = researchArray[0];
        const matchedOption = researchOptions.find(
          (option) => `${option.field_of_research_id}-${option.research_area_id}-${option.niche_domain_id}` === firstResearch
        );
        const researchName = matchedOption ? matchedOption.research_area_name : 'research';
        return `${profile.current_position} specializing in ${researchName}`;
      }
      
      return profile.current_position || 'Academic Researcher';
    }
    
    if (isPostgraduate) {
      if (profile.bio) {
        return profile.bio.substring(0, 100);
      }
      
      const degreeLevel = profile.master_type || 'PhD';
      const researchArray = profile.field_of_research || [];
      if (researchArray.length > 0) {
        const firstResearch = researchArray[0];
        const matchedOption = researchOptions.find(
          (option) => `${option.field_of_research_id}-${option.research_area_id}-${option.niche_domain_id}` === firstResearch
        );
        const researchName = matchedOption ? matchedOption.research_area_name : 'research';
        return `${degreeLevel} Candidate researching ${researchName}`;
      }
      
      return profile.suggested_research_title || `${degreeLevel} Candidate`;
    }
    
    // Undergraduate
    if (profile.bio) {
      return profile.bio.substring(0, 100);
    }
    
    const researchArray = profile.research_preference || [];
    if (researchArray.length > 0) {
      const firstResearch = researchArray[0];
      const matchedOption = researchOptions.find(
        (option) => `${option.field_of_research_id}-${option.research_area_id}-${option.niche_domain_id}` === firstResearch
      );
      const researchName = matchedOption ? matchedOption.research_area_name : 'research';
      return `Undergraduate interested in ${researchName}`;
    }
    
    return 'Undergraduate student exploring research opportunities';
  };
  
  // Get metrics based on profile type
  const getMetrics = () => {
    if (isAcademician) {
      return [
        {
          value: profile.scholar_profile?.hindex || profile.total_publications || 0,
          label: 'h-index'
        },
        {
          value: profile.total_publications ? `${profile.total_publications}+` : '0',
          label: 'Publications'
        },
        {
          value: `${Math.round((match.score || 0) * 100)}%`,
          label: 'Match'
        }
      ];
    }
    
    if (isPostgraduate) {
      const degreeLevel = profile.master_type || (profile.previous_degree === 'Master' ? 'PhD' : 'Master');
      const researchCount = Array.isArray(profile.field_of_research) ? profile.field_of_research.length : 0;
      
      return [
        {
          value: degreeLevel,
          label: 'Degree Level'
        },
        {
          value: researchCount,
          label: 'Research Fields'
        },
        {
          value: `${Math.round((match.score || 0) * 100)}%`,
          label: 'Match'
        }
      ];
    }
    
    // Undergraduate
    const cgpa = parseFloat(profile.CGPA_bachelor) || 0;
    const interestCount = Array.isArray(profile.research_preference) ? profile.research_preference.length : 0;
    
    return [
      {
        value: cgpa > 0 ? cgpa.toFixed(2) : 'N/A',
        label: 'CGPA'
      },
      {
        value: interestCount,
        label: 'Research Interests'
      },
      {
        value: `${Math.round((match.score || 0) * 100)}%`,
        label: 'Match'
      }
    ];
  };
  
  const handleCardClick = (e) => {
    // Don't expand if clicking on buttons or links
    if (e.target.closest('button') || e.target.closest('a')) {
      return;
    }
    
    // If already expanded and has AI insights, flip the card
    if (isExpanded && aiInsights) {
      setIsFlipped(!isFlipped);
    } else {
      // Otherwise, expand the card
      setIsExpanded(true);
    }
  };
  
  const handleFlip = (e) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };
  
  const handleClose = () => {
    setIsFlipped(false);
    setIsExpanded(false);
    setShowActionsMenu(false);
  };
  
  // Supervision Functions
  // Check if already in shortlist
  useEffect(() => {
    if (!showSupervisionFeatures) {
      setIsShortlistLoading(false);
      return;
    }
    
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
  }, [showSupervisionFeatures, academicianIdentifier]);
  
  const addToPotentialSupervisors = async () => {
    if (isShortlistLoading || isInShortlist || hasActiveRelationship) return;
    setIsShortlistLoading(true);
    try {
      if (!academicianIdentifier) {
        logError(new Error('Missing academician identifier'), 'ProfileCard shortlist');
        toast.error('Cannot save supervisor right now. Please try again later.');
        return;
      }

      await axios.post(route('supervision.shortlist.store'), {
        academician_id: String(academicianIdentifier),
        postgraduate_program_id: profile.postgraduate_program_id ?? null,
      });
      setIsInShortlist(true);
      toast.success('Added to Potential Supervisors');
    } catch (error) {
      logError(error, 'ProfileCard shortlist');
      toast.error(error.response?.data?.message || 'Failed to save');
    } finally {
      setIsShortlistLoading(false);
    }
  };
  
  const handleProposalSubmitted = () => {
    setIsProposalModalOpen(false);
    onRequestSubmitted?.();
  };
  
  const handleRequestClick = (e) => {
    e.stopPropagation();
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
    if (!showSupervisionFeatures) return null;
    
    const universityName = universitiesList.find((u) => u.id === profile.university)?.name || 
                          profile.university_name || '';
    const universityFullName = universitiesList.find((u) => u.id === profile.university)?.full_name || 
                               profile.university_full_name || universityName;
    
    return {
      ...match,
      academician: {
        full_name: profile.full_name || 'Supervisor',
        current_position: profile.current_position || '',
        university: {
          name: universityName
        },
        universityDetails: {
          full_name: universityFullName
        },
        research_domains: profile.research_expertise || [],
        academician_id: academicianIdentifier,
        url: profile.url || null
      },
      user: users.find(u => u.unique_id === profile.academician_id || u.unique_id === profile.id) || null,
      postgraduate_program_id: profile.postgraduate_program_id || null
    };
  }, [showSupervisionFeatures, match, profile, academicianIdentifier, users, universitiesList]);
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionsMenuRef.current && !actionsMenuRef.current.contains(event.target)) {
        setShowActionsMenu(false);
      }
    };
    
    if (showActionsMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showActionsMenu]);

  const metrics = getMetrics();
  const tagline = getTagline();
  
  return (
    <>
      {/* Expanded Overlay */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={handleClose}
        />
      )}
      
      {/* Card Container */}
      <div 
        className={`
          ${isExpanded 
            ? 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[420px]' 
            : 'relative w-full cursor-pointer'
          }
        `}
        style={{ perspective: '1000px', WebkitFontSmoothing: 'antialiased' }}
        onClick={handleCardClick}
      >
        <div 
          className={`
            relative transition-transform duration-600 ease-in-out
            ${isFlipped ? '[transform:rotateY(180deg)]' : ''}
          `}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* FRONT OF CARD */}
          <div 
            className={`
              relative rounded-2xl overflow-hidden border-[3px] border-white
              transition-all duration-500 ease-out
              ${isExpanded ? 'h-[580px]' : 'h-[500px]'}
              shadow-lg hover:shadow-2xl hover:-translate-y-2
            `}
            style={{ 
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'translateZ(0)',
              willChange: 'transform',
              boxShadow: '0 10px 40px rgba(0,0,0,0.15)'
            }}
          >
            {/* Background Image Layer */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out hover:scale-105"
              style={{ 
                backgroundImage: `url('${getBackgroundImage()}')`,
              }}
            />
            
            {/* Gradient Scrim Overlay */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to bottom, transparent 0%, transparent 40%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.8) 100%)'
              }}
            />
            
            {/* Content Layer */}
            <div className={`relative h-full flex flex-col text-white ${isExpanded ? 'p-6 pb-7' : 'p-4 pb-5'}`}>
              {/* Header Row - Top floating badges */}
              <div className="flex justify-between items-start">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/70 backdrop-blur-md border border-white/30">
                  {universityShortName}
                </span>
                
                {/* Kebab Menu */}
                <div className="relative" ref={actionsMenuRef}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowActionsMenu(!showActionsMenu);
                    }}
                    className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all shadow-lg"
                    style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
                  >
                    <MoreVertical className="w-5 h-5 text-gray-700" />
                  </button>
                  
                  {/* Actions Dropdown Menu - Bubble Buttons */}
                  {showActionsMenu && (
                    <TooltipProvider delayDuration={0}>
                      <div className="absolute right-0 mt-2 flex flex-col gap-2 z-[100]">
                        {/* Bookmark */}
                        <div 
                          onClick={(e) => e.stopPropagation()}
                          className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all shadow-lg flex items-center justify-center"
                        >
                          <div className="flex items-center justify-center w-5 h-5">
                            <BookmarkButton 
                              bookmarkableType={isAcademician ? "academician" : match.result_type} 
                              bookmarkableId={profileId}
                              category={isAcademician ? "Academicians" : "Students"} 
                            />
                          </div>
                        </div>
                        
                        {/* Add Connection */}
                        <div 
                          onClick={(e) => e.stopPropagation()}
                          className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all shadow-lg flex items-center justify-center"
                        >
                          <div className="flex items-center justify-center w-5 h-5">
                            <ConnectionButton user={users.find(
                              (user) =>
                                user.unique_id === 
                                (isAcademician ? profile.academician_id || profile.id : 
                                 profile.postgraduate_id || profile.undergraduate_id || profile.id)
                            )} />
                          </div>
                        </div>
                        
                        {/* Compose Email */}
                        <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            href={route('email.compose', { 
                              to: users.find(
                                (user) =>
                                  user.unique_id === 
                                  (isAcademician ? profile.academician_id || profile.id : 
                                   profile.postgraduate_id || profile.undergraduate_id || profile.id)
                              )?.email || profile.email || ''
                            })}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all shadow-lg"
                          >
                            <Mail className="w-5 h-5 text-gray-700" />
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Send Email</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      {/* Recommend */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowActionsMenu(false);
                              onRecommendClick(profile, e);
                            }}
                            className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all shadow-lg"
                          >
                            <Star className="w-5 h-5 text-gray-700" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Recommend</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      {/* Add to Potential Supervisors (Only for supervision search) */}
                      {showSupervisionFeatures && !hasActiveRelationship && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowActionsMenu(false);
                                addToPotentialSupervisors();
                              }}
                              disabled={isShortlistLoading || isInShortlist}
                              className={`bg-white/90 backdrop-blur-sm p-2 rounded-full transition-all shadow-lg ${
                                isInShortlist
                                  ? 'bg-indigo-50'
                                  : 'hover:bg-white'
                              } disabled:opacity-50`}
                            >
                              {isInShortlist ? (
                                <Bookmark className="w-5 h-5 text-indigo-600 fill-current" />
                              ) : (
                                <BookmarkPlus className="w-5 h-5 text-gray-700" />
                              )}
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{isInShortlist ? 'Already in Potential Supervisors' : 'Add to Potential Supervisors'}</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      
                      {/* Current Supervisor Badge (Only for supervision search) */}
                      {showSupervisionFeatures && isCurrentSupervisor && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              disabled
                              className="bg-indigo-50 backdrop-blur-sm p-2 rounded-full shadow-lg"
                            >
                              <Bookmark className="w-5 h-5 text-indigo-600 fill-current" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Your Current Supervisor</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      </div>
                    </TooltipProvider>
                  )}
                </div>
              </div>
              
              {/* Spacer to push content to bottom */}
              <div className="flex-grow" />
              
              {/* Bottom Content Section */}
              <div className="space-y-3">
                {/* (a) Header Row - Name + Verified Badge */}
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-extrabold leading-tight truncate tracking-tight" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
                    {profile.full_name}
                  </h2>
                  {profile.verified === 1 && (
                    <div className="bg-blue-500 rounded-full p-1 flex-shrink-0">
                      <MdVerified className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                
                {/* (b) Tagline */}
                <p 
                  className="text-sm font-normal text-white/80 line-clamp-2 max-w-[300px] leading-relaxed"
                  style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
                >
                  {tagline}
                </p>
                
                {/* (c) Metrics Row - Modern Design with Dividers */}
                <div className="flex items-center justify-between py-2">
                  {metrics.map((metric, index) => (
                    <React.Fragment key={index}>
                      <div className="flex flex-col items-center flex-1">
                        <span 
                          className="text-lg font-bold leading-none mb-1.5" 
                          style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
                        >
                          {metric.value}
                        </span>
                        <span className="text-[10px] uppercase tracking-wide text-white/60 font-medium text-center leading-tight">
                          {metric.label}
                        </span>
                      </div>
                      {index < metrics.length - 1 && (
                        <div className="h-12 w-px bg-white/20" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
                
                {/* (d) Action Bar - Single Row with Split Button */}
                <div>
                  <div className="flex gap-3 items-stretch">
                    {/* Main Button Area */}
                    {showSupervisionFeatures && isCurrentSupervisor ? (
                      // Case 1: Current Supervisor - Premium Split Button with Dropdown
                      <DropdownMenu>
                        <div className="flex-1 flex items-stretch gap-0 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
                          <button
                            onClick={handleRequestClick}
                            className="flex-1 flex items-center justify-center px-4 py-3 text-sm font-semibold bg-gradient-to-r from-emerald-500 to-green-500 text-white transition-all duration-300 hover:from-emerald-600 hover:to-green-600"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2 drop-shadow-sm" />
                            <span className="drop-shadow-sm">Your Supervisor</span>
                          </button>
                          
                          <DropdownMenuTrigger asChild>
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="px-3 border-l border-emerald-400/30 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white transition-all duration-300"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>
                          </DropdownMenuTrigger>
                        </div>
                        
                        <DropdownMenuContent 
                          align="end" 
                          className="w-48 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-xl"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <DropdownMenuItem asChild>
                            <Link
                              href={route('academicians.show', profile.url || profile.academician_id || profile.id)}
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center cursor-pointer text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 transition-colors"
                            >
                              <User className="w-4 h-4 mr-2 flex-shrink-0" />
                              <span className="text-sm font-medium">View Profile</span>
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : showSupervisionFeatures && !hasActiveRelationship ? (
                      // Case 2: Can Request Supervision - Split Button with Dropdown
                      <DropdownMenu>
                        <div className="flex-1 flex items-stretch gap-0 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                          <button
                            onClick={handleRequestClick}
                            className="flex-1 flex items-center justify-center px-4 py-3 text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-300"
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
                          
                          <DropdownMenuTrigger asChild>
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="px-3 border-l border-indigo-500 bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-300"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>
                          </DropdownMenuTrigger>
                        </div>
                        
                        <DropdownMenuContent 
                          align="end" 
                          className="w-48 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-xl"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <DropdownMenuItem asChild>
                            <Link
                              href={route('academicians.show', profile.url || profile.academician_id || profile.id)}
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center cursor-pointer text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 transition-colors"
                            >
                              <User className="w-4 h-4 mr-2 flex-shrink-0" />
                              <span className="text-sm font-medium">View Profile</span>
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : showSupervisionFeatures && hasActiveRelationship ? (
                      // Case 3: Has Supervisor, Viewing Others - Simple Button, No Dropdown
                      <Link
                        href={route('academicians.show', profile.url || profile.academician_id || profile.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold bg-white text-gray-900 hover:bg-gray-100 transition-all duration-300 hover:-translate-y-0.5 shadow-md hover:shadow-lg"
                      >
                        View Full Profile
                      </Link>
                    ) : (
                      // Case 4: Regular Search - Simple Button, No Dropdown
                      <Link
                        href={
                          isAcademician 
                            ? route('academicians.show', profile.url || profile.academician_id || profile.id) 
                            : isPostgraduate
                              ? route('postgraduates.show', profile.url || profile.postgraduate_id || profile.id)
                              : route('undergraduates.show', profile.url || profile.undergraduate_id || profile.id)
                        }
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold bg-white text-gray-900 hover:bg-gray-100 transition-all duration-300 hover:-translate-y-0.5 shadow-md hover:shadow-lg"
                      >
                        View Full Profile
                      </Link>
                    )}
                    
                    {/* Quick Info Eye Icon - Always Visible */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickInfoClick(profile);
                      }}
                      className="bg-white/20 backdrop-blur-md text-white p-3.5 rounded-xl hover:bg-white/30 transition-all duration-300 hover:scale-110 flex-shrink-0 shadow-md"
                      title="Quick Info"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Tap to flip text - only when expanded and has insights */}
                  {isExpanded && aiInsights && (
                    <div className="mt-3 text-center">
                      <button
                        onClick={handleFlip}
                        className="text-xs text-white/50 hover:text-white/80 transition-colors font-medium"
                      >
                        Tap card to see AI insights →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* BACK OF CARD */}
          <div 
            className={`
              absolute inset-0 rounded-3xl overflow-hidden shadow-xl border-[3px] border-white
              bg-gray-900 text-white p-6
              ${isExpanded ? 'h-[580px]' : 'h-[500px]'}
            `}
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            {/* Flip Back Button */}
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={handleFlip}
                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
              >
                <span className="text-lg">↺</span>
                <span className="text-sm font-medium">Flip Back</span>
              </button>
              <button
                onClick={handleClose}
                className="text-white/80 hover:text-white transition-colors text-2xl"
              >
                ×
              </button>
            </div>
            
            {/* AI Insights Title */}
            <div className="mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                🤖 AI Match Insights
              </h3>
              <div className="h-px bg-white/20 mt-2" />
            </div>
            
            {/* AI Insights Content */}
            <div className="space-y-4 overflow-y-auto max-h-[400px]">
              <div className="text-sm text-white/90 whitespace-pre-line leading-relaxed">
                {(() => {
                  // Process insights text
                  let processedInsights = aiInsights;
                  const fieldIdPattern = /\b(\d+-\d+-\d+)\b/g;
                  const matches = aiInsights.match(fieldIdPattern) || [];
                  
                  matches.forEach(match => {
                    const matchedOption = researchOptions.find(
                      option => `${option.field_of_research_id}-${option.research_area_id}-${option.niche_domain_id}` === match
                    );
                    
                    if (matchedOption) {
                      const readableName = `${matchedOption.field_of_research_name} - ${matchedOption.research_area_name} - ${matchedOption.niche_domain_name}`;
                      processedInsights = processedInsights.replace(new RegExp(match, 'g'), readableName);
                    }
                  });
                  
                  return processedInsights;
                })()}
              </div>
              
              {/* Infographics */}
              <div className="space-y-4 pt-4 border-t border-white/20">
                {/* Research Overlap */}
                {match.comparison?.researchOverlap ? (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">📊 Research Overlap</h4>
                    <div className="bg-white/10 rounded-lg p-4">
                      {/* Overall Overlap Percentage */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-white/70">Overlap</span>
                        <span className="text-lg font-bold">{match.comparison.researchOverlap.overlapPercentage}%</span>
                      </div>
                      
                      {/* Common Research Areas */}
                      {match.comparison.researchOverlap.commonAreas.length > 0 && (
                        <div className="mb-3">
                          <div className="text-xs text-white/70 mb-1">Common Areas ({match.comparison.researchOverlap.totalCommon})</div>
                          <div className="flex flex-wrap gap-1">
                            {match.comparison.researchOverlap.commonAreas.slice(0, 3).map((area, idx) => (
                              <span key={idx} className="text-xs bg-green-500/30 text-green-100 px-2 py-0.5 rounded-full">
                                ✓ Area {idx + 1}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Comparison Bars */}
                      <div className="space-y-2 text-xs">
                        <div>
                          <div className="flex justify-between text-white/70 mb-1">
                            <span>Your Fields</span>
                            <span>{match.comparison.researchOverlap.totalYours}</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-1.5">
                            <div 
                              className="bg-blue-400 h-1.5 rounded-full"
                              style={{ width: `${Math.min(100, (match.comparison.researchOverlap.totalYours / 10) * 100)}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-white/70 mb-1">
                            <span>Their Fields</span>
                            <span>{match.comparison.researchOverlap.totalTheirs}</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-1.5">
                            <div 
                              className="bg-purple-400 h-1.5 rounded-full"
                              style={{ width: `${Math.min(100, (match.comparison.researchOverlap.totalTheirs / 10) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">📊 Research Overlap</h4>
                    <div className="bg-white/10 rounded-lg p-4 text-center text-xs text-white/60">
                      Comparison data not available
                    </div>
                  </div>
                )}
                
                {/* Collaboration Score */}
                <div>
                  <h4 className="text-sm font-semibold mb-2">📈 Collaboration Score</h4>
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Overall Match</span>
                      <span className="text-lg font-bold">{Math.round((match.score || 0) * 100)}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.round((match.score || 0) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Key Strengths Match */}
                {match.comparison?.skillsMatch ? (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">🎯 Key Strengths Match</h4>
                    <div className="bg-white/10 rounded-lg p-4">
                      {/* Overall Skills Match */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-white/70">Skills Alignment</span>
                        <span className="text-lg font-bold">{match.comparison.skillsMatch.overallSkillMatch}%</span>
                      </div>
                      
                      {/* Top Matching Skills */}
                      {match.comparison.skillsMatch.topMatches.length > 0 ? (
                        <div className="space-y-2">
                          {match.comparison.skillsMatch.topMatches.slice(0, 5).map((skill, idx) => (
                            <div key={idx}>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs text-white/90 truncate flex-1">{skill.skill}</span>
                                <span className="text-xs text-white/70 ml-2">{skill.matchScore}%</span>
                              </div>
                              <div className="w-full bg-white/10 rounded-full h-1.5">
                                <div 
                                  className={`h-1.5 rounded-full transition-all duration-300 ${
                                    skill.matchScore >= 80 ? 'bg-green-400' :
                                    skill.matchScore >= 60 ? 'bg-yellow-400' :
                                    'bg-orange-400'
                                  }`}
                                  style={{ width: `${skill.matchScore}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-white/60 text-center py-2">
                          No matching skills found
                        </div>
                      )}
                      
                      {/* Total Matched Skills */}
                      {match.comparison.skillsMatch.totalMatchedSkills > 0 && (
                        <div className="mt-3 pt-3 border-t border-white/10 text-center">
                          <span className="text-xs text-white/60">
                            {match.comparison.skillsMatch.totalMatchedSkills} total matched skill{match.comparison.skillsMatch.totalMatchedSkills !== 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">🎯 Key Strengths Match</h4>
                    <div className="bg-white/10 rounded-lg p-4 text-xs text-white/60 text-center">
                      Skills comparison data not available
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Proposal Modal - Only for supervision features */}
      {showSupervisionFeatures && transformedSupervisor && (
        <ProposalModal
          isOpen={isProposalModalOpen}
          supervisor={transformedSupervisor}
          onClose={() => setIsProposalModalOpen(false)}
          onSubmitted={handleProposalSubmitted}
        />
      )}
    </>
  );
}

