import React, { useState, useRef, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { FaEye, FaHeart, FaRegHeart, FaShareAlt, FaLink, FaFacebook, FaWhatsapp, FaLinkedin, FaTimes } from 'react-icons/fa';
import {
  ArrowLeft, Tag, FileText
} from 'lucide-react';
import useRoles from '@/Hooks/useRoles';
import axios from 'axios';
import Carousel from '@/Components/Dashboard/Carousel';
import { trackEvent, trackPageView } from '@/Utils/analytics';
import BookmarkButton from '@/Components/BookmarkButton';
import BackButton from '@/Components/BackButton';
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

export default function PostContent({ 
  post, 
  academicians, 
  postgraduates, 
  undergraduates, 
  isWelcome, 
  auth,
  metaTags,
  relatedPosts
}) {
  const { isAcademician, isPostgraduate, isUndergraduate } = useRoles();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Track post view when component mounts
  useEffect(() => {
    // Track page view
    trackPageView(window.location.pathname);
    
    // Track post view event
    trackEvent(
      'Post', 
      'view', 
      post.title, 
      post.id
    );
  }, []);

  // Determine author based on the post's author_id.
  const author =
    (isAcademician && academicians && academicians.find(a => a.academician_id === post.author_id)) ||
    (isPostgraduate && postgraduates && postgraduates.find(p => p.postgraduate_id === post.author_id)) ||
    (isUndergraduate && undergraduates && undergraduates.find(u => u.undergraduate_id === post.author_id)) ||
    null;

  console.log('Props:', { post, metaTags });

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
  const handleShare = (platform) => {
    const shareUrl = route('welcome.posts.show', post.url);

    switch (platform) {
      case 'copy':
        navigator.clipboard.writeText(shareUrl);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(post.title)}`, '_blank');
        break;
    }

    // Increment share count
    axios.post(route('posts.share', post.url))
      .then(response => {
        setShares(response.data.total_shares);
      })
      .catch(error => {
        console.error('Error sharing:', error);
      });
  };

  // Handle image click
  const handleImageClick = (img) => {
    setSelectedImage(img);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleCloseModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  // Render function for related posts carousel
  const renderRelatedPost = (post) => (
    <div className="relative h-full">
      <Link href={isWelcome ? route('welcome.posts.show', post.url) : route('posts.show', post.url)}>
        <div className="relative h-full">
          {post.featured_image ? (
            <img
              src={`/storage/${post.featured_image}`}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
            <h3 className="text-lg font-semibold line-clamp-2">{post.title}</h3>
            <p className="text-sm text-gray-200">
              {new Date(post.created_at).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );

  return (
    <div className="px-6 md:px-8 lg:px-4">
      <div className="max-w-7xl mx-auto py-4 lg:pt-4">
        {/* Back Button */}
        <div className="mb-6">
          <BackButton />
        </div>

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
                    onClick={() => { handleShare('copy'); setShareMenuOpen(false); }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                  >
                    <FaLink className="w-5 h-5 inline mr-2 text-gray-600" />
                    Copy Link
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={() => { handleShare('facebook'); setShareMenuOpen(false); }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                  >
                    <FaFacebook className="w-5 h-5 inline mr-2 text-blue-600" />
                    Facebook
                  </button>
                  <button
                    onClick={() => { handleShare('whatsapp'); setShareMenuOpen(false); }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                  >
                    <FaWhatsapp className="w-5 h-5 inline mr-2 text-green-600" />
                    WhatsApp
                  </button>
                  <button
                    onClick={() => { handleShare('linkedin'); setShareMenuOpen(false); }}
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
              bookmarkableType="post"
              bookmarkableId={post.id}
              category="Posts"
              iconSize="w-6 h-6"
              tooltipPosition="top"
            />
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
        <SafeHTML
          html={post.content}
          className="mb-4 text-gray-700 prose w-full text-left max-w-none break-words leading-relaxed"
        />

        {/* Details Section */}
        {(post.category || post.tags) && (
          <div className="mt-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-gray-200">
              Details
            </h2>

            {/* Information Group */}
            <div className="space-y-4">
              <div className="flex items-center mb-4">
                <Tag className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Information</h3>
              </div>
              <div className="ml-7 space-y-3">
                {post.category && (
                  <div className="flex items-center">
                    <span className="text-gray-600 font-medium w-20">Category:</span>
                    <span className="text-gray-900">{post.category}</span>
                  </div>
                )}
                {post.tags && (
                  <div className="flex items-start">
                    <span className="text-gray-600 font-medium w-20 mt-0.5">Tags:</span>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(post.tags) ? post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200"
                        >
                          {tag}
                        </span>
                      )) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                          {post.tags}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Attachment */}
        {post.attachment && (
          <div className="mb-2">
            <div className="flex items-center">
              <FileText className="w-4 h-4 text-gray-500 mr-1" />
              <span className="text-gray-600 font-medium mr-2">Attachment:</span>
              <a
                href={`/storage/${post.attachment}`}
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

        {/* Gallery */}
        {post.images && (
          <div className="mt-4">
            <h2 className="text-2xl font-bold mb-6">Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {JSON.parse(post.images).map((img, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-lg shadow-md overflow-hidden aspect-square cursor-pointer"
                  onClick={() => handleImageClick(img)}
                >
                  <img
                    src={`/storage/${img}`}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <hr className="my-6 border-gray-200" />

        {/* Other Posts Section */}
        {relatedPosts && relatedPosts.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6">Other Posts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link 
                  key={relatedPost.id}
                  href={isWelcome ? route('welcome.posts.show', relatedPost.url) : route('posts.show', relatedPost.url)}
                  className="block relative p-5 transform transition-opacity duration-500 rounded-2xl overflow-hidden h-[300px] flex flex-col justify-end hover:opacity-90"
                  style={{
                    backgroundImage: `url(${encodeURI(
                      relatedPost.featured_image ? `/storage/${relatedPost.featured_image}` : "/storage/default.jpg"
                    )})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-black opacity-40"></div>
                  <div className="relative z-10 text-white pr-10">
                    <h2 className="text-2xl font-bold truncate" title={relatedPost.title}>
                      {relatedPost.title || "Untitled Post"}
                    </h2>
                    {relatedPost.content && (
                      <SafeHTML
                        html={relatedPost.content}
                        className="text-sm line-clamp-2 mb-2"
                      />
                    )}
                    {/* Date and Statistics Section */}
                    <div className="flex items-center mt-1 space-x-2">
                      <p className="text-xs">
                        {new Date(relatedPost.created_at).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </p>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center text-xs">
                          <FaEye className="w-4 h-4" />
                          <span className="ml-1">{relatedPost.total_views || 0}</span>
                        </div>
                        <div className="flex items-center text-xs">
                          <FaHeart className="w-4 h-4 text-red-500" />
                          <span className="ml-1">{relatedPost.total_likes || 0}</span>
                        </div>
                        <div className="flex items-center text-xs">
                          <FaShareAlt className="w-4 h-4" />
                          <span className="ml-1">{relatedPost.total_shares || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Image Modal */}
        {isModalOpen && selectedImage && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
            onClick={handleCloseModal}
          >
            <div 
              className="relative max-w-7xl mx-auto p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-red-500 hover:text-red-900 z-50"
              >
                <FaTimes className="w-8 h-8" />
              </button>
              <img
                src={`/storage/${selectedImage}`}
                alt="Full size image"
                className="max-h-[90vh] w-auto object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
