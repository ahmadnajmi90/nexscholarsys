// resources/js/Components/ProjectContent.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { 
  FaArrowLeft, FaEye, FaHeart, FaRegHeart, FaShareAlt, 
  FaLink, FaFacebook, FaWhatsapp, FaLinkedin, FaTimes
} from 'react-icons/fa';
import useRoles from '@/Hooks/useRoles';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { trackEvent, trackPageView } from '@/Utils/analytics';
import BookmarkButton from '@/Components/BookmarkButton';
import DOMPurify from 'dompurify';

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

export default function ProjectContent({ project, previous, next, academicians, researchOptions, universities, auth, isWelcome, relatedProjects }) {
  const { isAcademician } = useRoles();

  // State for like/share features.
  const [likes, setLikes] = useState(project.total_likes || 0);
  const [shares, setShares] = useState(project.total_shares || 0);
  const [liked, setLiked] = useState(project.liked || false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
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

  return (
    <div className="px-10 md:px-16">
      <div className="max-w-8xl mx-auto py-6">
        {/* Back Arrow */}
        {!isWelcome ? (
            <div className="absolute top-[1.8rem] left-2 md:top-[5.5rem] md:left-[19.5rem] z-10">
            <Link 
                onClick={() => window.history.back()}
                className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600"
            >
                <FaArrowLeft className="text-lg md:text-xl" />
            </Link>
            </div>
            ) : (
            <div className="absolute top-[6.2rem] left-2 md:top-[6.1rem] md:left-[1rem] z-10">
                <Link 
                onClick={() => window.history.back()}
                className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600"
                >
                <FaArrowLeft className="text-lg md:text-xl" />
                </Link>
            </div>
        )}

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
              className="mb-4 text-gray-700 prose w-full text-justify max-w-none break-words" 
            />
          </div>
        )}

        {/* Project Details */}
        <div className="mb-4 space-y-2">
          {project.project_theme && (
            <p>
              <span className="font-semibold">Project Theme:</span> {project.project_theme}
            </p>
          )}
          {project.purpose && (
            <p>
              <span className="font-semibold">Purpose:</span> {Array.isArray(project.purpose) ? project.purpose.join(", ") : project.purpose}
            </p>
          )}
          {project.start_date && (
            <p>
              <span className="font-semibold">Start Date:</span>{" "}
              {new Date(project.start_date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
          )}
          {project.end_date && (
            <p>
              <span className="font-semibold">End Date:</span>{" "}
              {new Date(project.end_date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
          )}
          {project.application_deadline && (
            <p>
              <span className="font-semibold">Application Deadline:</span>{" "}
              {new Date(project.application_deadline).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
          )}
          {project.duration && (
            <p>
              <span className="font-semibold">Duration:</span> {project.duration} <span>(months)</span>
            </p>
          )}
          {project.sponsored_by && (
            <p>
              <span className="font-semibold">Sponsored By:</span> {project.sponsored_by}
            </p>
          )}
          {project.category && (
            <p>
              <span className="font-semibold">Category:</span> {project.category}
            </p>
          )}
          {project.field_of_research && getResearchNames() && (
            <p>
              <span className="font-semibold">Field of Research:</span> {getResearchNames()}
            </p>
          )}
          {project.supervisor_category && (
            <p>
              <span className="font-semibold">Supervisor Category:</span> {project.supervisor_category}
            </p>
          )}
          {project.supervisor_name && (
            <p>
              <span className="font-semibold">Supervisor Name:</span> {project.supervisor_name}
            </p>
          )}
          {project.university && getUniversityName() && (
            <p>
              <span className="font-semibold">University:</span> {getUniversityName()}
            </p>
          )}
          {project.email && (
            <p>
              <span className="font-semibold">Email:</span> {project.email}
            </p>
          )}
          {project.origin_country && (
            <p>
              <span className="font-semibold">Origin Country:</span> {project.origin_country}
            </p>
          )}
          {project.student_nationality && (
            <p>
              <span className="font-semibold">Student Nationality:</span> {project.student_nationality}
            </p>
          )}
          {project.student_level && (
            <p>
              <span className="font-semibold">Student Level:</span> {project.student_level}
            </p>
          )}
          {project.appointment_type && (
            <p>
              <span className="font-semibold">Appointment Type:</span> {project.appointment_type}
            </p>
          )}
          {project.purpose_of_collaboration && (
            <p>
              <span className="font-semibold">Purpose of Collaboration:</span> {project.purpose_of_collaboration}
            </p>
          )}
          {project.amount && (
            <p>
              <span className="font-semibold">Amount:</span> {project.amount}
            </p>
          )}
          {project.application_url && (
            <p>
              <span className="font-semibold">Application:</span>
              <a
                href={project.application_url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-blue-500 underline"
              >
                Apply
              </a>
            </p>
          )}
        </div>

        {/* Attachment */}
        {project.attachment && (
          <div className="mb-2">
            <p>
              <span className="font-semibold">Attachment:</span>{" "}
              <a
                href={`/storage/${project.attachment}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                View Attachment
              </a>
            </p>
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
