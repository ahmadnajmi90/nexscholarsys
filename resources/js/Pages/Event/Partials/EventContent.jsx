// resources/js/Components/EventContent.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { 
  FaArrowLeft, 
  FaEye, 
  FaHeart, 
  FaRegHeart, 
  FaShareAlt, 
  FaLink, 
  FaFacebook, 
  FaWhatsapp, 
  FaLinkedin,
  FaTimes
} from 'react-icons/fa';
import useRoles from '@/Hooks/useRoles';
import axios from 'axios';

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
            <div 
              className="mb-4 text-gray-700 prose w-full text-justify max-w-none break-words" 
              dangerouslySetInnerHTML={{ __html: event.description }} 
            />
          </div>
        )}

        {/* Event Details */}
        <div className="mb-4 space-y-2">
          {event.event_type && (
            <p>
              <span className="font-semibold">Event Type:</span> {event.event_type}
            </p>
          )}
          {event.event_mode && (
            <p>
              <span className="font-semibold">Event Mode:</span> {event.event_mode}
            </p>
          )}
          {event.event_theme && (
            <p>
              <span className="font-semibold">Event Theme:</span> {event.event_theme}
            </p>
          )}
          {event.start_date && (
            <p>
              <span className="font-semibold">Start Date:</span>{" "}
              {new Date(event.start_date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
          )}
          {event.end_date && (
            <p>
              <span className="font-semibold">End Date:</span>{" "}
              {new Date(event.end_date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
          )}
          {event.start_time && (
            <p>
              <span className="font-semibold">Start Time:</span> {event.start_time}
            </p>
          )}
          {event.end_time && (
            <p>
              <span className="font-semibold">End Time:</span> {event.end_time}
            </p>
          )}
          {event.registration_deadline && (
            <p>
              <span className="font-semibold">Registration Deadline:</span>{" "}
              {new Date(event.registration_deadline).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
          )}
          {event.registration_url && (
            <p>
              <span className="font-semibold">Registration:</span>
              <a
                href={event.registration_url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-blue-500 underline"
              >
                Register
              </a>
            </p>
          )}
          {event.contact_email && (
            <p>
              <span className="font-semibold">Contact Email:</span> {event.contact_email}
            </p>
          )}
          {event.venue && (
            <p>
              <span className="font-semibold">Venue:</span> {event.venue}
            </p>
          )}
          {event.city && (
            <p>
              <span className="font-semibold">City:</span> {event.city}
            </p>
          )}
          {event.country && (
            <p>
              <span className="font-semibold">Country:</span> {event.country}
            </p>
          )}
          {event.field_of_research && getResearchNames() && (
            <p>
              <span className="font-semibold">Field of Research:</span> {getResearchNames()}
            </p>
          )}
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
                      <div
                        className="text-sm line-clamp-2 mb-2"
                        dangerouslySetInnerHTML={{ __html: relatedEvent.description }}
                      ></div>
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
