// resources/js/Components/EventContent.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { 
  FaEye, 
  FaHeart, 
  FaRegHeart, 
  FaShareAlt, 
  FaLink, 
  FaFacebook, 
  FaWhatsapp, 
  FaLinkedin
} from 'react-icons/fa';
import {
  ArrowLeft, Info, MapPin, Clock, Mail,
  Calendar
} from 'lucide-react';
import useRoles from '@/Hooks/useRoles';
import axios from 'axios';
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

export default function EventContent({ 
  event, 
  academicians, 
  researchOptions,
  isWelcome, 
  auth,
  relatedEvents
}) {
  const { isAcademician } = useRoles();

  // Like/share state for event.
  const [likes, setLikes] = useState(event.total_likes || 0);
  const [shares, setShares] = useState(event.total_shares || 0);
  const [liked, setLiked] = useState(event.liked || false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const shareMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (evt) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(evt.target)) {
        setShareMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Track event view when component mounts
  useEffect(() => {
    // Track page view
    trackPageView(window.location.pathname);
    
    // Track event view event
    trackEvent(
      'Event', 
      'view', 
      event.event_name,
      event.id
    );
  }, [event]);

  // Determine author from academicians only.
  const author = (academicians && academicians.find(a => a.academician_id === event.author_id)) || null;

  // Helper: composite field of research names.
  const getResearchNames = () => {
    if (!event.field_of_research) return null;
    const ids = Array.isArray(event.field_of_research)
      ? event.field_of_research
      : [event.field_of_research];
    const names = ids.map(id => {
      const option = researchOptions.find(
        opt =>
          `${opt.field_of_research_id}-${opt.research_area_id}-${opt.niche_domain_id}` === id
      );
      return option ? `${option.field_of_research_name} - ${option.research_area_name} - ${option.niche_domain_name}` : null;
    }).filter(Boolean);
    return names.length ? names.join(", ") : null;
  };

  // Toggle like for the event.
  const handleLike = () => {
    // Check if auth.user exists (i.e. user is logged in)
    if (!auth) {
      // Redirect to login page if not logged in
      window.location.href = route('login');
      return;
    }
    
    // Otherwise, perform the like toggle action
    axios.post(route('events.toggleLike', event.url))
      .then(response => {
        setLikes(response.data.total_likes);
        setLiked(response.data.liked);
      })
      .catch(error => console.error(error));
  };  

  // Generic share handler.
  const handleShare = (shareFunc) => {
    shareFunc();
    axios.post(route('events.share', event.url))
      .then(response => {
        setShares(response.data.total_shares);
      })
      .catch(error => console.error(error));
  };

  // Sharing functions.
  const shareOnFacebook = () => {
    const shareUrl = route('welcome.events.show', event.url);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank', 'width=600,height=400');
  };

  const shareOnWhatsApp = () => {
    const shareUrl = route('welcome.events.show', event.url);
    window.open(`https://wa.me/?text=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    const shareUrl = route('welcome.events.show', event.url);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank', 'width=600,height=400');
  };

  const copyLink = () => {
    const shareUrl = route('welcome.events.show', event.url);
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert("Link copied to clipboard");
    });
  };

  return (
    <div className="px-6 md:px-8 lg:px-4">
        <div className="max-w-8xl mx-auto py-4 lg:pt-4">
        {/* Back Button */}
        <div className="mb-6">
            <Link 
                onClick={() => window.history.back()}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                aria-label="Go back to previous page"
            >
                <ArrowLeft className="w-4 h-4" />
                Back
            </Link>
            </div>

        {/* Title */}
        {event.event_name && (
          <h1 className="text-2xl md:text-3xl font-bold mb-4 text-left">{event.event_name}</h1>
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
                {event.created_at ? new Date(event.created_at).toLocaleDateString("en-GB", {
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
                {event.created_at ? new Date(event.created_at).toLocaleDateString("en-GB", {
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
              <span className="ml-2 text-gray-600">{event.total_views}</span>
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
              bookmarkableType="event"
              bookmarkableId={event.id}
              category="Events"
              iconSize="w-6 h-6"
              tooltipPosition="top"
            />
          </div>
          <hr />
        </div>

        {/* Banner */}
        {event.image && (
          <img 
            src={`/storage/${event.image}`} 
            alt="Banner" 
            className="w-full h-auto md:h-64 object-cover mb-4"
          />
        )}

        {/* Description with Heading */}
        {event.description && (
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">Description</h2>
            <SafeHTML
              html={event.description}
              className="mb-4 text-gray-700 prose w-full text-left max-w-none break-words leading-relaxed"
            />
          </div>
        )}

        {/* Event Details */}
        <div className="mt-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-gray-200">
            Event Details
          </h2>

          {/* Two-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Left Column */}
            <div className="space-y-6">

              {/* About the Event */}
              {(event.event_type || event.event_mode || event.event_theme || event.field_of_research) && (
                <div>
                  <div className="flex items-center mb-4">
                    <Info className="w-5 h-5 text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">About the Event</h3>
                  </div>
                  <div className="space-y-3 ml-7">
          {event.event_type && (
                      <div className="flex items-center">
                        <span className="text-gray-600 font-medium w-24">Type:</span>
                        <span className="text-gray-900">{event.event_type}</span>
                      </div>
          )}
          {event.event_mode && (
                      <div className="flex items-center">
                        <span className="text-gray-600 font-medium w-24">Mode:</span>
                        <span className="text-gray-900">{event.event_mode}</span>
                      </div>
          )}
          {event.event_theme && (
                      <div className="flex items-center">
                        <span className="text-gray-600 font-medium w-24">Theme:</span>
                        <span className="text-gray-900">{event.event_theme}</span>
                      </div>
                    )}
                    {event.field_of_research && getResearchNames() && (
                      <div className="flex items-start">
                        <span className="text-gray-600 font-medium w-24 mt-0.5">Research Field:</span>
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
                  </div>
                </div>
              )}

              {/* Location */}
              {(event.venue || event.city || event.country) && (
                <div>
                  <div className="flex items-center mb-4">
                    <MapPin className="w-5 h-5 text-green-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Location</h3>
                  </div>
                  <div className="space-y-3 ml-7">
                    {event.venue && (
                      <div className="flex items-center">
                        <span className="text-gray-600 font-medium w-20">Venue:</span>
                        <span className="text-gray-900">{event.venue}</span>
                      </div>
                    )}
                    {event.city && (
                      <div className="flex items-center">
                        <span className="text-gray-600 font-medium w-20">City:</span>
                        <span className="text-gray-900">{event.city}</span>
                      </div>
                    )}
                    {event.country && (
                      <div className="flex items-center">
                        <span className="text-gray-600 font-medium w-20">Country:</span>
                        <span className="text-gray-900">{event.country}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* Right Column */}
            <div className="space-y-6">

              {/* Schedule & Registration */}
              {(event.start_date || event.end_date || event.start_time || event.end_time || event.registration_deadline || event.registration_url) && (
                <div>
                  <div className="flex items-center mb-4">
                    <Clock className="w-5 h-5 text-orange-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Schedule & Registration</h3>
                  </div>
                  <div className="space-y-3 ml-7">
                    {(event.start_date || event.start_time) && (
                      <div className="flex items-center">
                        <span className="text-gray-600 font-medium w-28">Start:</span>
                        <span className="text-gray-900">
                          {event.start_date && new Date(event.start_date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
                          {event.start_time && ` ${event.start_time}`}
                        </span>
                      </div>
                    )}
                    {(event.end_date || event.end_time) && (
                      <div className="flex items-center">
                        <span className="text-gray-600 font-medium w-28">End:</span>
                        <span className="text-gray-900">
                          {event.end_date && new Date(event.end_date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
                          {event.end_time && ` ${event.end_time}`}
                        </span>
                      </div>
          )}
          {event.registration_deadline && (
                      <div className="flex items-center">
                        <span className="text-red-600 font-medium w-28">Deadline:</span>
                        <span className={`font-semibold ${new Date(event.registration_deadline) < new Date() ? 'text-red-600' : 'text-red-600'}`}>
              {new Date(event.registration_deadline).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
                          {new Date(event.registration_deadline) < new Date() && (
                            <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-semibold">
                              Ended
                            </span>
                          )}
                        </span>
                      </div>
          )}
          {event.registration_url && (
                      <div className="flex items-center">
                        <span className="text-gray-600 font-medium w-28">Registration:</span>
              <a
                href={event.registration_url}
                target="_blank"
                rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
              >
                Register
              </a>
                      </div>
                    )}
                  </div>
                </div>
          )}

              {/* Contact */}
          {event.contact_email && (
                <div>
                  <div className="flex items-center mb-4">
                    <Mail className="w-5 h-5 text-purple-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Contact</h3>
                  </div>
                  <div className="ml-7">
                    <div className="flex items-center">
                      <span className="text-gray-600 font-medium w-20">Email:</span>
                      <a href={`mailto:${event.contact_email}`} className="text-blue-600 hover:text-blue-800 underline">
                        {event.contact_email}
                      </a>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        <hr className="my-6 border-gray-200" />

        {/* Related Events Section */}
        {relatedEvents && relatedEvents.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6">Other Events</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedEvents.map((relatedEvent) => (
                <Link 
                  key={relatedEvent.id}
                  href={isWelcome ? route('welcome.events.show', relatedEvent.url) : route('events.show', relatedEvent.url)}
                  className="block relative p-5 transform transition-opacity duration-500 rounded-2xl overflow-hidden h-[300px] flex flex-col justify-end hover:opacity-90"
                  style={{
                    backgroundImage: `url(${encodeURI(
                      relatedEvent.image ? `/storage/${relatedEvent.image}` : "/storage/default.jpg"
                    )})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-black opacity-40"></div>
                  <div className="relative z-10 text-white pr-10">
                    <h2 className="text-2xl font-bold truncate" title={relatedEvent.event_name}>
                      {relatedEvent.event_name || "Untitled Event"}
                    </h2>
                    {relatedEvent.description && (
                      <SafeHTML
                        html={relatedEvent.description}
                        className="text-sm line-clamp-2 mb-2"
                      />
                    )}
                    {/* Date and Statistics Section */}
                    <div className="flex items-center mt-1 space-x-2">
                      <p className="text-xs">
                        {new Date(relatedEvent.start_date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </p>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center text-xs">
                          <FaEye className="w-4 h-4" />
                          <span className="ml-1">{relatedEvent.total_views || 0}</span>
                        </div>
                        <div className="flex items-center text-xs">
                          <FaHeart className="w-4 h-4 text-red-500" />
                          <span className="ml-1">{relatedEvent.total_likes || 0}</span>
                        </div>
                        <div className="flex items-center text-xs">
                          <FaShareAlt className="w-4 h-4" />
                          <span className="ml-1">{relatedEvent.total_shares || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
