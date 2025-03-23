import React, { useState, useRef, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { FaArrowLeft, FaEye, FaHeart, FaRegHeart, FaShareAlt, FaLink, FaFacebook, FaWhatsapp, FaLinkedin, FaTimes } from 'react-icons/fa';
import useRoles from '@/Hooks/useRoles';
import axios from 'axios';
import Carousel from '@/Components/Dashboard/Carousel';

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
    <div className="px-10 md:px-16">
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
                      <div
                        className="text-sm line-clamp-2 mb-2"
                        dangerouslySetInnerHTML={{ __html: relatedPost.content }}
                      ></div>
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
