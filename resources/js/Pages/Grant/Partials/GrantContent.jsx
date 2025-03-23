// resources/js/Components/GrantContent.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { 
  FaArrowLeft, FaEye, FaHeart, FaRegHeart, FaShareAlt, 
  FaLink, FaFacebook, FaWhatsapp, FaLinkedin 
} from 'react-icons/fa';
import useRoles from '@/Hooks/useRoles';
import axios from 'axios';

export default function GrantContent({ 
  grant, 
  previous, 
  next, 
  academicians, 
  auth,
  isWelcome,
  relatedGrants
}) {
  const { isAcademician } = useRoles();

  // Initialize state for like/share features.
  const [likes, setLikes] = useState(grant.total_likes || 0);
  const [shares, setShares] = useState(grant.total_shares || 0);
  const [liked, setLiked] = useState(grant.liked || false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const shareMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
        setShareMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Determine the author from academicians.
  const author =
    (academicians && academicians.find(a => a.academician_id === grant.author_id)) || null;

  // Toggle like (like if not liked, unlike if already liked)
  const handleLike = () => {
    // Check if auth.user exists (i.e. user is logged in)
    if (!auth) {
      // Redirect to login page if not logged in
      window.location.href = route('login');
      return;
    }
    
    // Otherwise, perform the like toggle action
    axios.post(route('grants.toggleLike', grant.url))
      .then(response => {
        setLikes(response.data.total_likes);
        setLiked(response.data.liked);
      })
      .catch(error => console.error(error));
  };  

  // Generic handler for sharing actions.
  const handleShare = (shareFunc) => {
    shareFunc();
    axios.post(route('grants.share', grant.url))
      .then(response => {
        setShares(response.data.total_shares);
      })
      .catch(error => console.error(error));
  };

  // Sharing functions for various platforms.
  const shareOnFacebook = () => {
    const shareUrl = route('welcome.grants.show', grant.url);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank', 'width=600,height=400');
  };

  const shareOnWhatsApp = () => {
    const shareUrl = route('welcome.grants.show', grant.url);
    window.open(`https://wa.me/?text=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    const shareUrl = route('welcome.grants.show', grant.url);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank', 'width=600,height=400');
  };

  const copyLink = () => {
    const shareUrl = route('welcome.grants.show', grant.url);
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
        {grant.title && (
          <h1 className="text-2xl md:text-3xl font-bold mb-4 text-left">{grant.title}</h1>
        )}

        {/* Author Info Section */}
        {author ? (
          <div className="flex items-center gap-4 mb-4">
            <img 
              src={`/storage/${author.profile_picture}`} 
              alt={author.full_name} 
              className="w-12 h-12 rounded-full object-cover shadow-md bg-gray-200 border-2 border-white"
            />
            <div>
              <div className="text-lg font-semibold">{author.full_name}</div>
              {grant.created_at && (
                <div className="text-gray-500">
                  {new Date(grant.created_at).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </div>
              )}
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
              {grant.created_at && (
                <div className="text-gray-500">
                  {new Date(grant.created_at).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Statistics Section (between Author and Banner) */}
        <div className="my-4">
          <hr />
          <div className="flex flex-wrap items-center space-x-4 py-2">
            {/* View icon */}
            <div className="flex items-center">
              <FaEye className="w-6 h-6 text-gray-600" />
              <span className="ml-2 text-gray-600">{grant.total_views}</span>
            </div>
            {/* Like icon */}
            <button onClick={handleLike} className="flex items-center">
              {liked ? (
                <FaHeart className="w-6 h-6 text-red-600" />
              ) : (
                <FaRegHeart className="w-6 h-6 text-gray-600" />
              )}
              <span className="ml-2 text-gray-600">{likes}</span>
            </button>
            {/* Share icon with dropdown */}
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
        {grant.image && (
          <img 
            src={`/storage/${grant.image}`} 
            alt="Banner" 
            className="w-full h-auto md:h-64 object-cover mb-4"
          />
        )}

        {/* Description with Heading */}
        {grant.description && (
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">Description</h2>
            <div 
              className="mb-4 text-gray-700 prose w-full text-justify max-w-none break-words" 
              dangerouslySetInnerHTML={{ __html: grant.description }} 
            />
          </div>
        )}

        {/* Grant Details */}
        <div className="mb-4 space-y-2">
          {grant.start_date && (
            <p>
              <span className="font-semibold">Start Date:</span>{" "}
              {new Date(grant.start_date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
          )}
          {grant.end_date && (
            <p>
              <span className="font-semibold">End Date:</span>{" "}
              {new Date(grant.end_date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
          )}
          {grant.application_deadline && (
            <p>
              <span className="font-semibold">Application Deadline:</span>{" "}
              {new Date(grant.application_deadline).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
          )}
          {grant.grant_type && (
            <p>
              <span className="font-semibold">Grant Type:</span> {grant.grant_type}
            </p>
          )}
          {grant.cycle && (
            <p>
              <span className="font-semibold">Cycle:</span> {grant.cycle}
            </p>
          )}
          {grant.sponsored_by && (
            <p>
              <span className="font-semibold">Sponsored By:</span> {grant.sponsored_by}
            </p>
          )}
          {grant.email && (
            <p>
              <span className="font-semibold">Email:</span> {grant.email}
            </p>
          )}
          {grant.website && (
            <p>
              <span className="font-semibold">Website:</span>
              <a
                href={grant.website}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-blue-500 underline"
              >
                Website
              </a>
            </p>
          )}
          {grant.country && (
            <p>
              <span className="font-semibold">Country:</span> {grant.country}
            </p>
          )}
          {grant.grant_theme && (
            <p>
              <span className="font-semibold">Grant Themes:</span>{" "}
              {Array.isArray(grant.grant_theme)
                ? grant.grant_theme.join(", ")
                : grant.grant_theme}
            </p>
          )}
        </div>

        {/* Attachment */}
        {grant.attachment && (
          <div className="mb-2">
            <p>
              <span className="font-semibold">Attachment:</span>{" "}
              <a
                href={`/storage/${grant.attachment}`}
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

        {/* Related Grants Section */}
        {relatedGrants && relatedGrants.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6">Other Grants</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedGrants.map((relatedGrant) => (
                <Link 
                  key={relatedGrant.id}
                  href={isWelcome ? route('welcome.grants.show', relatedGrant.url) : route('grants.show', relatedGrant.url)}
                  className="block relative p-5 transform transition-opacity duration-500 rounded-2xl overflow-hidden h-[300px] flex flex-col justify-end hover:opacity-90"
                  style={{
                    backgroundImage: `url(${encodeURI(
                      relatedGrant.image ? `/storage/${relatedGrant.image}` : "/storage/default.jpg"
                    )})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-black opacity-40"></div>
                  <div className="relative z-10 text-white pr-10">
                    <h2 className="text-2xl font-bold truncate" title={relatedGrant.title}>
                      {relatedGrant.title || "Untitled Grant"}
                    </h2>
                    {relatedGrant.description && (
                      <div
                        className="text-sm line-clamp-2 mb-2"
                        dangerouslySetInnerHTML={{ __html: relatedGrant.description }}
                      ></div>
                    )}
                    {/* Date and Statistics Section */}
                    <div className="flex items-center mt-1 space-x-2">
                      <p className="text-xs">
                        Deadline: {new Date(relatedGrant.application_deadline).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </p>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center text-xs">
                          <FaEye className="w-4 h-4" />
                          <span className="ml-1">{relatedGrant.total_views || 0}</span>
                        </div>
                        <div className="flex items-center text-xs">
                          <FaHeart className="w-4 h-4 text-red-500" />
                          <span className="ml-1">{relatedGrant.total_likes || 0}</span>
                        </div>
                        <div className="flex items-center text-xs">
                          <FaShareAlt className="w-4 h-4" />
                          <span className="ml-1">{relatedGrant.total_shares || 0}</span>
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
              href={route('grants.show', previous.url)} 
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Previous
            </Link>
          ) : (
            <span></span>
          )}
          {next ? (
            <Link 
              href={route('grants.show', next.url)} 
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
