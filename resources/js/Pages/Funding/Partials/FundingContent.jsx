// resources/js/Components/FundingContent.jsx   
import React, { useState, useRef, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import {
    FaEye, FaHeart, FaRegHeart, FaShareAlt
} from 'react-icons/fa';
import {
    ArrowLeft, Eye, Heart, Share, Link as LinkIcon,
    Calendar, DollarSign, Building, Globe, Mail,
    ExternalLink, Tag, X, Facebook, MessageCircle, Linkedin, User
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

export default function FundingContent({
    fundingItem,
    academicians,
    auth,
    isWelcome,
    relatedFunding
}) {
    const { isAcademician } = useRoles();

    // Initialize state for like/share features.
    const [likes, setLikes] = useState(fundingItem.total_likes || 0);
    const [shares, setShares] = useState(fundingItem.total_shares || 0);
    const [liked, setLiked] = useState(fundingItem.liked || false);
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

    // Track funding view when component mounts
    useEffect(() => {
        // Track page view
        trackPageView(window.location.pathname);

        // Track funding view event
        const fundingType = fundingItem.type === 'grant' ? 'Grant' : 'Scholarship';
        trackEvent(
            fundingType,
            'view',
            fundingItem.grant_name || fundingItem.title,
            fundingItem.id
        );
    }, [fundingItem]);

    // Determine the author from academicians.
    const author =
        (academicians && academicians.find(a => a.academician_id === fundingItem.author_id)) || null;

    // Toggle like (like if not liked, unlike if already liked)
    const handleLike = () => {
        // Check if auth.user exists (i.e. user is logged in)
        if (!auth) {
            // Redirect to login page if not logged in
            window.location.href = route('login');
            return;
        }

            // Otherwise, perform the like toggle action
    const toggleRoute = fundingItem.type === 'grant'
      ? route('funding.toggleLike.grant', { url: fundingItem.url })
      : route('funding.toggleLike.scholarship', { url: fundingItem.url });

    axios.post(toggleRoute)
      .then(response => {
        setLikes(response.data.total_likes);
        setLiked(response.data.liked);
      })
      .catch(error => console.error(error));
    };

        // Generic handler for sharing actions.
    const handleShare = (shareFunc) => {
        shareFunc();

        const shareRoute = fundingItem.type === 'grant'
          ? route('funding.share.grant', { url: fundingItem.url })
          : route('funding.share.scholarship', { url: fundingItem.url });

        axios.post(shareRoute)
          .then(response => {
            setShares(response.data.total_shares);
          })
          .catch(error => console.error(error));
    };

    // Sharing functions for various platforms.
    const shareOnFacebook = () => {
        const shareUrl = fundingItem.type === 'grant'
          ? route('funding.show.grant', { url: fundingItem.url })
          : route('funding.show.scholarship', { url: fundingItem.url });
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank', 'width=600,height=400');
    };

    const shareOnWhatsApp = () => {
        const shareUrl = fundingItem.type === 'grant'
          ? route('funding.show.grant', { url: fundingItem.url })
          : route('funding.show.scholarship', { url: fundingItem.url });
        window.open(`https://wa.me/?text=${encodeURIComponent(shareUrl)}`, '_blank');
    };

    const shareOnLinkedIn = () => {
        const shareUrl = fundingItem.type === 'grant'
          ? route('funding.show.grant', { url: fundingItem.url })
          : route('funding.show.scholarship', { url: fundingItem.url });
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank', 'width=600,height=400');
    };

    const copyLink = () => {
        const shareUrl = fundingItem.type === 'grant'
          ? route('funding.show.grant', { url: fundingItem.url })
          : route('funding.show.scholarship', { url: fundingItem.url });
        navigator.clipboard.writeText(shareUrl).then(() => {
            alert("Link copied to clipboard");
        });
    };

    return (
        <div className="px-6 md:px-8 lg:px-4">
            <div className="max-w-7xl mx-auto py-4 lg:pt-4">
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
                {fundingItem.title && (
                    <h1 className="text-2xl md:text-3xl font-bold mb-4 text-left">{fundingItem.title}</h1>
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
                            {fundingItem.created_at && (
                                <div className="text-gray-500">
                                    {new Date(fundingItem.created_at).toLocaleDateString("en-GB", {
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
                            {fundingItem.created_at && (
                                <div className="text-gray-500">
                                    {new Date(fundingItem.created_at).toLocaleDateString("en-GB", {
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
                            <span className="ml-2 text-gray-600">{fundingItem.total_views}</span>
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
                                        <LinkIcon className="w-5 h-5 mr-2 text-gray-600" />
                                        Copy Link
                                    </button>
                                    <hr className="my-1" />
                                    <button
                                        onClick={() => { handleShare(shareOnFacebook); setShareMenuOpen(false); }}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                                    >
                                        <Facebook className="w-5 h-5 mr-2 text-blue-600" />
                                        Facebook
                                    </button>
                                    <button
                                        onClick={() => { handleShare(shareOnWhatsApp); setShareMenuOpen(false); }}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                                    >
                                        <MessageCircle className="w-5 h-5 mr-2 text-green-600" />
                                        WhatsApp
                                    </button>
                                    <button
                                        onClick={() => { handleShare(shareOnLinkedIn); setShareMenuOpen(false); }}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                                    >
                                        <Linkedin className="w-5 h-5 mr-2 text-blue-700" />
                                        LinkedIn
                                    </button>
                                </div>
                            )}
                        </div>
                        {/* Bookmark Button */}
                        <BookmarkButton
                            bookmarkableType="funding"
                            bookmarkableId={fundingItem.id}
                            category="Funding"
                            iconSize="w-6 h-6"
                            tooltipPosition="top"
                        />
                    </div>
                    <hr />
                </div>

                {/* Banner */}
                {fundingItem.image && (
                    <img
                        src={`/storage/${fundingItem.image}`}
                        alt="Banner"
                        className="w-full h-auto md:h-64 object-cover mb-4"
                    />
                )}

                {/* Description with Heading */}
                {fundingItem.description && (
                    <div className="mb-4">
                        <h2 className="text-xl font-bold mb-2">Description</h2>
                        <SafeHTML
                            html={fundingItem.description}
                            className="mb-4 text-gray-700 prose w-full text-left max-w-none break-words leading-relaxed"
                        />
                    </div>
                )}

                {/* Funding Details */}
                {/* Details Section */}
                <div className="mt-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-gray-200">
                        Details
                    </h2>

                    {/* Two-Column Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* Left Column */}
                        <div className="space-y-6">

                            {/* Key Dates Section */}
                            <div>
                                <div className="flex items-center mb-4">
                                    <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                                    <h3 className="text-lg font-semibold text-gray-900">Key Dates</h3>
                                </div>
                                <div className="space-y-3 ml-7">
                                    {fundingItem.start_date && (
                                        <div className="flex items-center">
                                            <span className="text-gray-600 font-medium w-24">Start:</span>
                                            <span className="text-gray-900">
                                                {new Date(fundingItem.start_date).toLocaleDateString("en-GB", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                })}
                                            </span>
                                        </div>
                                    )}
                                    {fundingItem.end_date && (
                                        <div className="flex items-center">
                                            <span className="text-gray-600 font-medium w-24">End:</span>
                                            <span className="text-gray-900">
                                                {new Date(fundingItem.end_date).toLocaleDateString("en-GB", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                })}
                                            </span>
                                        </div>
                                    )}
                                    {fundingItem.application_deadline && (
                                        <div className="flex items-center">
                                            <span className="text-red-600 font-medium w-24">Deadline:</span>
                                            <span className={`font-semibold ${new Date(fundingItem.application_deadline) < new Date() ? 'text-red-600' : 'text-red-600'}`}>
                                                {new Date(fundingItem.application_deadline).toLocaleDateString("en-GB", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                })}
                                                {new Date(fundingItem.application_deadline) < new Date() && (
                                                    <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-semibold">
                                                        Ended
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Funding Information */}
                            <div>
                                <div className="flex items-center mb-4">
                                    <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                                    <h3 className="text-lg font-semibold text-gray-900">Funding Information</h3>
                                </div>
                                <div className="space-y-3 ml-7">
                                    {/* Funding Type */}
                                    {(fundingItem.grant_type || fundingItem.scholarship_type) && (
                                        <div className="flex items-center">
                                            <span className="text-gray-600 font-medium w-24">Type:</span>
                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                                fundingItem.type === 'grant' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                            }`}>
                                                {fundingItem.grant_type || fundingItem.scholarship_type}
                                            </span>
                                        </div>
                                    )}

                                    {/* Cycle - only for grants */}
                                    {fundingItem.type === 'grant' && fundingItem.cycle && (
                                        <div className="flex items-center">
                                            <span className="text-gray-600 font-medium w-24">Cycle:</span>
                                            <span className="text-gray-900">{fundingItem.cycle}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">

                            {/* Contact & Organization */}
                            <div>
                                <div className="flex items-center mb-4">
                                    <Building className="w-5 h-5 text-purple-600 mr-2" />
                                    <h3 className="text-lg font-semibold text-gray-900">Organization & Contact</h3>
                                </div>
                                <div className="space-y-3 ml-7">
                                    {fundingItem.sponsored_by && (
                                        <div className="flex items-center">
                                            <User className="w-4 h-4 text-gray-500 mr-1" />
                                            <span className="text-gray-600 font-medium w-20 ml-1">Sponsor:</span>
                                            <span className="text-gray-900 font-medium">{fundingItem.sponsored_by}</span>
                                        </div>
                                    )}

                                    {fundingItem.country && (
                                        <div className="flex items-center">
                                            <Globe className="w-4 h-4 text-gray-500 mr-1" />
                                            <span className="text-gray-600 font-medium w-20 ml-1">Country:</span>
                                            <span className="text-gray-900">{fundingItem.country}</span>
                                        </div>
                                    )}

                                    {fundingItem.email && (
                                        <div className="flex items-center">
                                            <Mail className="w-4 h-4 text-gray-500 mr-1" />
                                            <span className="text-gray-600 font-medium w-20 ml-1">Email:</span>
                                            <a href={`mailto:${fundingItem.email}`} className="text-blue-600 hover:text-blue-800 underline">
                                                {fundingItem.email}
                                            </a>
                                        </div>
                                    )}

                                    {fundingItem.website && (
                                        <div className="flex items-center">
                                            <ExternalLink className="w-4 h-4 text-gray-500 mr-1" />
                                            <span className="text-gray-600 font-medium w-20 ml-1">Website:</span>
                                            <a
                                                href={fundingItem.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 underline"
                                            >
                                                Visit Website
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Funding Themes */}
                            {(fundingItem.grant_theme || fundingItem.scholarship_theme) && (
                                <div>
                                    <div className="flex items-center mb-4">
                                        <Tag className="w-5 h-5 text-orange-600 mr-2" />
                                        <h3 className="text-lg font-semibold text-gray-900">Research Themes</h3>
                                    </div>
                                    <div className="ml-7">
                                        <div className="flex flex-wrap gap-2">
                                            {(() => {
                                                const themes = Array.isArray(fundingItem.grant_theme)
                                                    ? fundingItem.grant_theme
                                                    : Array.isArray(fundingItem.scholarship_theme)
                                                    ? fundingItem.scholarship_theme
                                                    : [fundingItem.grant_theme || fundingItem.scholarship_theme].filter(Boolean);

                                                return themes.map((theme, index) => (
                                                    <span
                                                        key={index}
                                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 border border-orange-200"
                                                    >
                                                        {theme}
                                                    </span>
                                                ));
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Attachment */}
                {fundingItem.attachment && (
                    <div className="mb-2">
                        <p>
                            <span className="font-semibold">Attachment:</span>{" "}
                            <a
                                href={`/storage/${fundingItem.attachment}`}
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

                {/* Related Funding Section */}
                {(() => {
                    // Convert object with numeric keys to array if needed
                    const relatedFundingArray = relatedFunding ?
                        (Array.isArray(relatedFunding) ? relatedFunding : Object.values(relatedFunding)) :
                        [];

                    return relatedFundingArray && relatedFundingArray.length > 0 && (
                        <div className="mt-8">
                            <h2 className="text-2xl font-bold mb-6">Other Funding Opportunities</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {relatedFundingArray.map((relatedItem) => (
                                    <Link
                                        key={relatedItem.id}
                                        href={isWelcome
                                            ? (relatedItem.type === 'grant'
                                                ? route('welcome.funding.show.grant', relatedItem.url)
                                                : route('welcome.funding.show.scholarship', relatedItem.url))
                                            : (relatedItem.type === 'grant'
                                                ? route('funding.show.grant', { url: relatedItem.url })
                                                : route('funding.show.scholarship', { url: relatedItem.url }))}
                                        className="block relative p-5 transform transition-opacity duration-500 rounded-2xl overflow-hidden h-[300px] flex flex-col justify-end hover:opacity-90"
                                        style={{
                                            backgroundImage: `url(${encodeURI(
                                                relatedItem.image ? `/storage/${relatedItem.image}` : "/storage/default.jpg"
                                            )})`,
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                        }}
                                >
                                    <div className="absolute inset-0 bg-black opacity-40"></div>

                                    {/* Type Label */}
                                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold text-white z-20 ${
                                        relatedItem.type === 'grant'
                                            ? 'bg-blue-500'
                                            : relatedItem.type === 'scholarship'
                                            ? 'bg-green-500'
                                            : 'bg-gray-500'
                                    }`}>
                                        {relatedItem.type === 'grant' ? 'Grant' : relatedItem.type === 'scholarship' ? 'Scholarship' : 'Funding'}
                                    </div>

                                    {/* Ended Label */}
                                    {new Date(relatedItem.application_deadline) < new Date() && (
                                        <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold text-white bg-red-500 z-20">
                                            Ended
                                        </div>
                                    )}

                                    <div className="relative z-10 text-white pr-10">
                                        <h2 className="text-2xl font-bold truncate" title={relatedItem.title}>
                                            {relatedItem.title || "Untitled Funding"}
                                        </h2>
                                        {relatedItem.description && (
                                            <SafeHTML
                                                html={relatedItem.description}
                                                className="text-sm line-clamp-2 mb-2"
                                            />
                                        )}
                                        {/* Date and Statistics Section */}
                                        <div className="flex items-center mt-1 space-x-2">
                                            <p className="text-xs">
                                                Deadline: {new Date(relatedItem.application_deadline).toLocaleDateString("en-GB", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                })}
                                            </p>
                                            <div className="flex items-center space-x-2">
                                                <div className="flex items-center text-xs">
                                                    <FaEye className="w-4 h-4" />
                                                    <span className="ml-1">{relatedItem.total_views || 0}</span>
                                                </div>
                                                <div className="flex items-center text-xs">
                                                    <FaHeart className="w-4 h-4 text-red-500" />
                                                    <span className="ml-1">{relatedItem.total_likes || 0}</span>
                                                </div>
                                                <div className="flex items-center text-xs">
                                                    <FaShareAlt className="w-4 h-4" />
                                                    <span className="ml-1">{relatedItem.total_shares || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                );
                })()}
            </div>
        </div>
    );
}
