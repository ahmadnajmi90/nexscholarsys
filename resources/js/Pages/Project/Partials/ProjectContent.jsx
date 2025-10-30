// resources/js/Components/ProjectContent.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { 
  FaEye, FaHeart, FaRegHeart, FaShareAlt,
  FaLink, FaFacebook, FaWhatsapp, FaLinkedin
} from 'react-icons/fa';
import {
  ArrowLeft, Briefcase, Users, Calendar, Building,
  FileText, Mail, ExternalLink
} from 'lucide-react';
import useRoles from '@/Hooks/useRoles';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { trackEvent, trackPageView } from '@/Utils/analytics';
import BookmarkButton from '@/Components/BookmarkButton';
import BackButton from '@/Components/BackButton';
import DOMPurify from 'dompurify';
import { toast } from 'react-hot-toast';

// Helper component for safely rendering HTML content
const SafeHTML = ({ html, className }) => {
  const sanitizedHTML = DOMPurify.sanitize(html || '', {
    ALLOWED_TAGS: ['b', 'i', 'u', 'p', 'br', 'ul', 'ol', 'li', 'strong', 'em', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    ALLOWED_ATTR: ['href', 'target', 'rel']
  });
  
  // For empty content
  if (!sanitizedHTML || sanitizedHTML.trim() === '') {
    return <p className={className}>No content available</p>;
  }
  
  return (
    <div 
      className={className} 
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
    />
  );
};

export default function ProjectContent({ project, previous, next, academicians, researchOptions, universities, auth, isWelcome, relatedProjects, scholarLabProject, joinRequestStatus, isMember }) {
  const { isAcademician } = useRoles();

  // State for like/share features.
  const [likes, setLikes] = useState(project.total_likes || 0);
  const [shares, setShares] = useState(project.total_shares || 0);
  const [liked, setLiked] = useState(project.liked || false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestStatus, setRequestStatus] = useState(joinRequestStatus);
  const shareMenuRef = useRef(null);
  console.log(relatedProjects);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
        setShareMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Track project view when component mounts
  useEffect(() => {
    // Track page view
    trackPageView(window.location.pathname);
    
    // Track project view event
    trackEvent(
      'Project', 
      'view', 
      project.project_name,
      project.id
    );
  }, [project]);

  // Determine the author from academicians.
  const author = (academicians && academicians.find(a => a.academician_id === project.author_id)) || null;

  // Helper to get research names.
  const getResearchNames = () => {
    if (!project.field_of_research) return null;
    const ids = Array.isArray(project.field_of_research)
      ? project.field_of_research
      : [project.field_of_research];
    const names = ids.map(id => {
      const option = researchOptions.find(
        opt =>
          `${opt.field_of_research_id}-${opt.research_area_id}-${opt.niche_domain_id}` === id
      );
      return option
        ? `${option.field_of_research_name} - ${option.research_area_name} - ${option.niche_domain_name}`
        : null;
    }).filter(Boolean);
    return names.length ? names.join(", ") : null;
  };

  // Helper to get university name.
  const getUniversityName = () => {
    if (!project.university) return null;
    const uni = universities.find(u => String(u.id) === String(project.university));
    return uni ? uni.full_name : null;
  };

  // Toggle like.
  const handleLike = () => {
    // Check if auth.user exists (i.e. user is logged in)
    if (!auth) {
      // Redirect to login page if not logged in
      window.location.href = route('login');
      return;
    }
    
    // Otherwise, perform the like toggle action
    axios.post(route('projects.toggleLike', project.url))
      .then(response => {
        setLikes(response.data.total_likes);
        setLiked(response.data.liked);
      })
      .catch(error => console.error(error));
  };  

  // Generic share handler.
  const handleShare = (shareFunc) => {
    shareFunc();
    axios.post(route('projects.share', project.url))
      .then(response => {
        setShares(response.data.total_shares);
      })
      .catch(error => console.error(error));
  };

  // Sharing functions.
  const shareOnFacebook = () => {
    const shareUrl = route('welcome.projects.show', project.url);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank', 'width=600,height=400');
  };

  const shareOnWhatsApp = () => {
    const shareUrl = route('welcome.projects.show', project.url);
    window.open(`https://wa.me/?text=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    const shareUrl = route('welcome.projects.show', project.url);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank', 'width=600,height=400');
  };

  const copyLink = () => {
    const shareUrl = route('welcome.projects.show', project.url);
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert("Link copied to clipboard");
    });
  };

  // Handle join request
  const handleJoinRequest = () => {
    if (!auth) {
      // Redirect to login page if not logged in
      window.location.href = route('login');
      return;
    }

    setIsSubmitting(true);
    
    axios.post(route('projects.join.request', scholarLabProject.id))
      .then(response => {
        toast.success(response.data.message);
        setRequestStatus('pending');
      })
      .catch(error => {
        const message = error.response?.data?.message || 'Failed to send join request';
        toast.error(message);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  // Determine join button status
  const renderJoinButton = () => {
    if (!scholarLabProject) return null;
    
    if (isMember) return null;
    
    if (requestStatus === 'pending') {
      return (
        <button 
          disabled 
          className="mt-4 px-6 py-2 bg-gray-300 text-gray-700 rounded-md flex items-center justify-center"
        >
          <FaUsers className="mr-2" /> Request Sent
        </button>
      );
    }
    
    if (requestStatus === 'rejected') {
      return (
        <button 
          onClick={handleJoinRequest} 
          disabled={isSubmitting}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
        >
          <FaUsers className="mr-2" /> Request Again
        </button>
      );
    }
    
    return (
      <button 
        onClick={handleJoinRequest} 
        disabled={isSubmitting}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
      >
        <FaUsers className="mr-2" /> Request to Join Project
      </button>
    );
  };

  return (
    <div className="px-6 md:px-8 lg:px-4">
        <div className="max-w-7xl mx-auto py-4 lg:pt-4">
        {/* Back Button */}
        <div className="mb-6">
            <BackButton />
            </div>

        {/* Title */}
        {project.title && (
          <h1 className="text-2xl md:text-3xl font-bold mb-4 text-left">{project.title}</h1>
        )}

        {/* Author Info */}
        {author ? (
          <div className="flex items-center gap-4 mb-4">
            <img 
              src={`/storage/${author.profile_picture}`} 
              alt={author.full_name} 
              className="w-12 h-12 rounded-full object-cover shadow-md bg-gray-200 border-2 border-white"
            />
            <div>
              <div className="text-lg font-semibold">{author.full_name}</div>
              <div className="text-gray-500">
                {project.created_at ? new Date(project.created_at).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }) : ""}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 mb-4">
            <img 
              src={`/storage/Admin.jpg`} 
              alt="Admin"
              className="w-12 h-12 rounded-full object-cover shadow-md border-2 border-white"
            />
            <div>
              <div className="text-lg font-semibold">Admin</div>
              <div className="text-gray-500">
                {project.created_at ? new Date(project.created_at).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }) : ""}
              </div>
            </div>
          </div>
        )}

        {/* Statistics Section */}
        <div className="my-4">
          <hr />
          <div className="flex flex-wrap items-center space-x-4 py-2">
            {/* View */}
            <div className="flex items-center">
              <FaEye className="w-6 h-6 text-gray-600" />
              <span className="ml-2 text-gray-600">{project.total_views}</span>
            </div>
            {/* Like */}
            <button onClick={handleLike} className="flex items-center">
              {liked ? (
                <FaHeart className="w-6 h-6 text-red-600" />
              ) : (
                <FaRegHeart className="w-6 h-6 text-gray-600" />
              )}
              <span className="ml-2 text-gray-600">{likes}</span>
            </button>
            {/* Share with Dropdown */}
            <div className="relative" ref={shareMenuRef}>
              <button onClick={() => setShareMenuOpen(!shareMenuOpen)} className="flex items-center">
                <FaShareAlt className="w-6 h-6 text-gray-600" />
              </button>
              {shareMenuOpen && (
                <div className="absolute left-0 mt-2 w-40 bg-white shadow-lg rounded z-10">
                  <button
                    onClick={() => { handleShare(copyLink); setShareMenuOpen(false); }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                  >
                    <FaLink className="w-5 h-5 inline mr-2 text-gray-600" />
                    Copy Link
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={() => { handleShare(shareOnFacebook); setShareMenuOpen(false); }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                  >
                    <FaFacebook className="w-5 h-5 inline mr-2 text-blue-600" />
                    Facebook
                  </button>
                  <button
                    onClick={() => { handleShare(shareOnWhatsApp); setShareMenuOpen(false); }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                  >
                    <FaWhatsapp className="w-5 h-5 inline mr-2 text-green-600" />
                    WhatsApp
                  </button>
                  <button
                    onClick={() => { handleShare(shareOnLinkedIn); setShareMenuOpen(false); }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                  >
                    <FaLinkedin className="w-5 h-5 inline mr-2 text-blue-700" />
                    LinkedIn
                  </button>
                </div>
              )}
            </div>
            {/* Bookmark Button */}
            <BookmarkButton
              bookmarkableType="project"
              bookmarkableId={project.id}
              category="Projects"
              iconSize="w-6 h-6"
              tooltipPosition="top"
            />
          </div>
          <hr />
        </div>

        {/* Request to Join Project Button */}
        <div className="my-4">
          {renderJoinButton()}
        </div>

        {/* Banner */}
        {project.image && (
          <img 
            src={`/storage/${project.image}`} 
            alt="Banner" 
            className="w-full h-auto md:h-64 object-cover mb-4"
          />
        )}

        {/* Description */}
        {project.description && (
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">Description</h2>
            <SafeHTML
              html={project.description}
              className="mb-4 text-gray-700 prose w-full text-left max-w-none break-words leading-relaxed" 
            />
          </div>
        )}

        {/* Project Details */}
        <div className="mt-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-gray-200">
            Project Details
          </h2>

          {/* Two-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Left Column */}
            <div className="space-y-6">

              {/* Key Information */}
              {(project.project_theme || project.purpose || project.field_of_research || project.category) && (
                <div>
                  <div className="flex items-center mb-4">
                    <Briefcase className="w-5 h-5 text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Key Information</h3>
                  </div>
                  <div className="space-y-3 ml-7">
          {project.project_theme && (
                      <div className="flex items-center">
                        <span className="text-gray-600 font-medium w-32">Theme:</span>
                        <span className="text-gray-900">{project.project_theme}</span>
                      </div>
          )}
          {project.purpose && (
                      <div className="flex items-start">
                        <span className="text-gray-600 font-medium w-32 mt-0.5">Purpose:</span>
                        <div className="flex flex-wrap gap-2">
                          {Array.isArray(project.purpose) ? project.purpose.map((purpose, index) => (
                            <span
                              key={index}
                              className="px-4 md:px-2.5 lg:px-2.5 py-1 text-xs rounded-full bg-gray-100 text-gray-800 font-medium border border-gray-200 w-3/4 ml-6 md:ml-6 lg:ml-0"
                            >
                              {purpose}
                            </span>
                          )) : (
                            <span className="px-4 md:px-2.5 lg:px-2.5 py-1 text-xs rounded-full bg-gray-100 text-gray-800 font-medium border border-gray-200 w-3/4 ml-6 md:ml-6 lg:ml-0">
                              {project.purpose}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    {project.field_of_research && getResearchNames() && (
                      <div className="flex items-start">
                        <span className="text-gray-600 font-medium w-32 mt-0.5">Research Field:</span>
                        <div className="flex flex-wrap gap-2">
                          {getResearchNames().split(', ').map((field, index) => (
                            <span
                              key={index}
                              className="px-4 md:px-2.5 lg:px-2.5 py-1 text-xs rounded-full bg-gray-100 text-gray-800 font-medium border border-gray-200 w-3/4 ml-6 md:ml-6 lg:ml-0"
                            >
                              {field.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {project.category && (
                      <div className="flex items-center">
                        <span className="text-gray-600 font-medium w-32">Category:</span>
                        <span className="text-gray-900">{project.category}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Student Requirements */}
              {(project.student_nationality || project.student_level || project.student_mode_study) && (
                <div>
                  <div className="flex items-center mb-4">
                    <Users className="w-5 h-5 text-green-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Student Requirements</h3>
                  </div>
                  <div className="space-y-3 ml-7">
                    {project.student_nationality && (
                      <div className="flex items-center">
                        <span className="text-gray-600 font-medium w-32">Nationality:</span>
                        <span className="text-gray-900">{project.student_nationality}</span>
                      </div>
                    )}
                    {project.student_level && (
                      <div className="flex items-center">
                        <span className="text-gray-600 font-medium w-32">Student Level:</span>
                        <span className="text-gray-900">{Array.isArray(project.student_level) ? project.student_level.join(', ') : project.student_level}</span>
                      </div>
                    )}
                    {project.student_mode_study && (
                      <div className="flex items-center">
                        <span className="text-gray-600 font-medium w-32">Mode of Study:</span>
                        <span className="text-gray-900">{Array.isArray(project.student_mode_study) ? project.student_mode_study.join(', ') : project.student_mode_study}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* Right Column */}
            <div className="space-y-6">

              {/* Schedule & Duration */}
              {(project.start_date || project.end_date || project.application_deadline || project.duration) && (
                <div>
                  <div className="flex items-center mb-4">
                    <Calendar className="w-5 h-5 text-orange-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Schedule & Duration</h3>
                  </div>
                  <div className="space-y-3 ml-7">
          {project.start_date && (
                      <div className="flex items-center">
                        <span className="text-gray-600 font-medium w-24">Start:</span>
                        <span className="text-gray-900">
              {new Date(project.start_date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
                        </span>
                      </div>
          )}
          {project.end_date && (
                      <div className="flex items-center">
                        <span className="text-gray-600 font-medium w-24">End:</span>
                        <span className="text-gray-900">
              {new Date(project.end_date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
                        </span>
                      </div>
          )}
          {project.application_deadline && (
                      <div className="flex items-center">
                        <span className="text-red-600 font-medium w-24">Deadline:</span>
                        <span className={`font-semibold ${new Date(project.application_deadline) < new Date() ? 'text-red-600' : 'text-red-600'}`}>
              {new Date(project.application_deadline).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
                          {new Date(project.application_deadline) < new Date() && (
                            <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-semibold">
                              Ended
                            </span>
                          )}
                        </span>
                      </div>
          )}
          {project.duration && (
                      <div className="flex items-center">
                        <span className="text-gray-600 font-medium w-24">Duration:</span>
                        <span className="text-gray-900">{project.duration} months</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Organization & Contact */}
              {(project.sponsored_by || project.university || project.email || project.application_url) && (
                <div>
                  <div className="flex items-center mb-4">
                    <Building className="w-5 h-5 text-purple-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Organization & Contact</h3>
                  </div>
                  <div className="space-y-3 ml-7">
          {project.sponsored_by && (
                      <div className="flex items-center">
                        <Users className="w-4 h-4 text-gray-500 mr-1" />
                        <span className="text-gray-600 font-medium w-24">Sponsor:</span>
                        <span className="text-gray-900 font-medium">{project.sponsored_by}</span>
                      </div>
          )}
          {project.university && getUniversityName() && (
                      <div className="flex items-center">
                        <Building className="w-4 h-4 text-gray-500 mr-1" />
                        <span className="text-gray-600 font-medium w-24">University:</span>
                        <span className="text-gray-900">{getUniversityName()}</span>
                      </div>
          )}
          {project.email && (
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 text-gray-500 mr-1" />
                        <span className="text-gray-600 font-medium w-24">Email:</span>
                        <a href={`mailto:${project.email}`} className="text-blue-600 hover:text-blue-800 underline">
                          {project.email}
                        </a>
                      </div>
          )}
          {project.application_url && (
                      <div className="flex items-center">
                        <ExternalLink className="w-4 h-4 text-gray-500 mr-1" />
                        <span className="text-gray-600 font-medium w-24">Application:</span>
              <a
                href={project.application_url}
                target="_blank"
                rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
              >
                Apply
              </a>
                      </div>
                    )}
                  </div>
                </div>
          )}

            </div>
          </div>
        </div>

        {/* Attachment */}
        {project.attachment && (
          <div className="mb-2">
            <div className="flex items-center">
              <FileText className="w-4 h-4 text-gray-500 mr-1" />
              <span className="text-gray-600 font-medium mr-2">Attachment:</span>
              <a
                href={`/storage/${project.attachment}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                View Attachment
              </a>
            </div>
          </div>
        )}

        <hr className="my-6 border-gray-200" />

        {/* Related Projects Section */}
        {relatedProjects && relatedProjects.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6">Other Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProjects.map((relatedProject) => (
                <Link 
                  key={relatedProject.id}
                  href={isWelcome ? route('welcome.projects.show', relatedProject.url) : route('projects.show', relatedProject.url)}
                  className="block relative p-5 transform transition-opacity duration-500 rounded-2xl overflow-hidden h-[300px] flex flex-col justify-end hover:opacity-90"
                  style={{
                    backgroundImage: `url(${encodeURI(
                      relatedProject.image ? `/storage/${relatedProject.image}` : "/storage/default.jpg"
                    )})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-black opacity-40"></div>
                  <div className="relative z-10 text-white pr-10">
                    <h2 className="text-2xl font-bold truncate" title={relatedProject.title}>
                      {relatedProject.title || "Untitled Project"}
                    </h2>
                    {relatedProject.description && (
                      <SafeHTML
                        html={relatedProject.description}
                        className="text-sm line-clamp-2 mb-2"
                      />
                    )}
                    {/* Date and Statistics Section */}
                    <div className="flex items-center mt-1 space-x-2">
                      <p className="text-xs">
                        Deadline: {new Date(relatedProject.application_deadline).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </p>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center text-xs">
                          <FaEye className="w-4 h-4" />
                          <span className="ml-1">{relatedProject.total_views || 0}</span>
                        </div>
                        <div className="flex items-center text-xs">
                          <FaHeart className="w-4 h-4 text-red-500" />
                          <span className="ml-1">{relatedProject.total_likes || 0}</span>
                        </div>
                        <div className="flex items-center text-xs">
                          <FaShareAlt className="w-4 h-4" />
                          <span className="ml-1">{relatedProject.total_shares || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="max-w-3xl mx-auto py-6 flex justify-between">
          {previous ? (
            <Link 
              href={route('projects.show', previous.url)} 
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Previous
            </Link>
          ) : (
            <span></span>
          )}
          {next ? (
            <Link 
              href={route('projects.show', next.url)} 
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Next
            </Link>
          ) : (
            <span></span>
          )}
        </div>
      </div>
    </div>
  );
}
