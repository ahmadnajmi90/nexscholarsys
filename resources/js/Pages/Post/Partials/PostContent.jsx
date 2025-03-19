import React, { useState, useRef, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { FaArrowLeft, FaEye, FaHeart, FaRegHeart, FaShareAlt, FaLink, FaFacebook, FaWhatsapp, FaLinkedin } from 'react-icons/fa';
import useRoles from '@/Hooks/useRoles';
import axios from 'axios';
import { Helmet } from 'react-helmet';

export default function PostContent({ post, previous, next, academicians, postgraduates, undergraduates, isWelcome, auth }) {
  const { isAcademician, isPostgraduate, isUndergraduate } = useRoles();

  // Initialize state for like/share features.
  const [likes, setLikes] = useState(post.total_likes || 0);
  const [shares, setShares] = useState(post.total_shares || 0);
  const [liked, setLiked] = useState(post.liked || false);
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

  // Determine author based on the post's author_id.
  const author =
    (isAcademician && academicians && academicians.find(a => a.academician_id === post.author_id)) ||
    (isPostgraduate && postgraduates && postgraduates.find(p => p.postgraduate_id === post.author_id)) ||
    (isUndergraduate && undergraduates && undergraduates.find(u => u.undergraduate_id === post.author_id)) ||
    null;

  // Open Graph meta tags
  const ogTitle = post.title;
  const ogDescription = post.excerpt || post.content.substring(0, 200); // Shortened description (you can customize this)
  const ogUrl = window.location.href;
  const ogImage = post.featured_image ? `/storage/${post.featured_image}` : "/storage/default-image.jpg";

  // Toggle like
  const handleLike = () => {
    // Check if auth.user exists (i.e. user is logged in)
    if (!auth) {
      // Redirect to login page if not logged in
      window.location.href = route('login');
      return;
    }
    
    // Otherwise, perform the like toggle action
    axios.post(route('posts.toggleLike', post.url))
      .then(response => {
        setLikes(response.data.total_likes);
        setLiked(response.data.liked);
      })
      .catch(error => console.error(error));
  };  

  // Generic share handler
  const handleShare = (shareFunc) => {
    shareFunc();
    axios.post(route('posts.share', post.url))
      .then(response => {
        setShares(response.data.total_shares);
      })
      .catch(error => console.error(error));
  };

  // Sharing functions
  const shareOnFacebook = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const shareOnWhatsApp = () => {
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(window.location.href)}`;
    window.open(shareUrl, '_blank');
  };

  const shareOnLinkedIn = () => {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert("Link copied to clipboard");
    });
  };

  return (
    <div className="px-10 md:px-16">
      {/* Open Graph Meta Tags */}
      <Helmet>
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:url" content={ogUrl} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Nexscholar" />
        {/* Facebook Meta Tags */}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        {/* WhatsApp Meta Tags */}
        <meta property="og:image" content={ogImage} />

        {/* LinkedIn Meta Tags */}
        <meta property="og:image" content={ogImage} />
      </Helmet>

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

      <div className="max-w-8xl mx-auto py-6">
        {/* Title */}
        {post.title && (
          <h1 className="text-2xl md:text-3xl font-bold mb-4 text-left">{post.title}</h1>
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
              <div className="text-gray-500">{new Date(post.created_at).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}</div>
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
              <div className="text-gray-500">{new Date(post.created_at).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}</div>
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
              <span className="ml-2 text-gray-600">{post.total_views}</span>
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
        {post.featured_image && (
          <img 
            src={`/storage/${post.featured_image}`} 
            alt="Banner" 
            className="w-full h-auto md:h-64 object-cover mb-4 rounded"
          />
        )}

        {/* Content */}
        <div
          className="mb-4 text-gray-700 prose w-full text-justify max-w-none break-words"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Category */}
        {post.category && (
          <p className="mb-2">
            <span className="font-semibold">Category:</span> {post.category}
          </p>
        )}

        {/* Tags */}
        {post.tags && (
          <p className="mb-2">
            <span className="font-semibold">Tags:</span>{" "}
            {Array.isArray(post.tags) ? post.tags.join(', ') : post.tags}
          </p>
        )}

        {/* Attachment */}
        {post.attachment && (
          <p className="mb-2">
            <span className="font-semibold">Attachment:</span>
            <a
              href={`/storage/${post.attachment}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-blue-500 underline"
            >
              View Attachment
            </a>
          </p>
        )}

        {/* Gallery */}
        {post.images && (
          <div className="mt-4">
            <h2 className="text-xl font-bold mb-2">Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {JSON.parse(post.images).map((img, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img
                    src={`/storage/${img}`}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-auto md:h-32 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        {!isWelcome && (
        <div className="max-w-3xl mx-auto py-6 flex justify-between">
          {previous ? (
            <Link href={route('posts.show', previous.url)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
              Previous
            </Link>
          ) : (
            <span></span>
          )}
          {next ? (
            <Link href={route('posts.show', next.url)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
              Next
            </Link>
          ) : (
            <span></span>
          )}
        </div>
        )}
      </div>
    </div>
  );
}
