import React, { useState, useEffect } from 'react';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import toast from 'react-hot-toast';
import BookmarkHandler from '@/Utils/BookmarkHandler';

const BookmarkButton = ({ 
  bookmarkableType, 
  bookmarkableId, 
  category = 'general',
  className = '',
  iconSize = 'text-lg',
  showText = false,
  tooltipPosition = 'bottom'
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Check if the item is already bookmarked when component mounts
    checkBookmarkStatus();
  }, [bookmarkableId, bookmarkableType]);

  const checkBookmarkStatus = async () => {
    setIsLoading(true);
    try {
      const response = await BookmarkHandler.checkBookmarkStatus(bookmarkableType, bookmarkableId);
      setIsBookmarked(response.is_bookmarked);
    } catch (error) {
      console.error('Error checking bookmark status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleBookmark = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await BookmarkHandler.toggleBookmark(bookmarkableType, bookmarkableId, category);
      
      setIsBookmarked(response.is_bookmarked);
      
      // Show success message
      toast.success(
        response.is_bookmarked
          ? 'Added to bookmarks'
          : 'Removed from bookmarks'
      );
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast.error('Failed to update bookmark. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className={`relative cursor-pointer ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <button
        onClick={toggleBookmark}
        className={`flex items-center focus:outline-none ${isBookmarked ? 'text-yellow-500' : 'text-gray-500 hover:text-yellow-500'} transition duration-200`}
        disabled={isLoading}
        aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
      >
        {isLoading ? (
          <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
        ) : (
          <>
            {isBookmarked ? (
              <FaBookmark className={iconSize} />
            ) : (
              <FaRegBookmark className={iconSize} />
            )}
          </>
        )}
        
        {showText && (
          <span className="ml-1">
            {isBookmarked ? 'Bookmarked' : 'Bookmark'}
          </span>
        )}
      </button>
      
      {/* Tooltip */}
      {showTooltip && (
        <div className={`
          absolute z-50 w-max 
          ${tooltipPosition === 'bottom' ? 'top-full mt-2 left-1/2 transform -translate-x-1/2' : 
            tooltipPosition === 'top' ? 'bottom-full mb-2 left-1/2 transform -translate-x-1/2' : 
            tooltipPosition === 'right' ? 'left-full ml-2 top-1/2 transform -translate-y-1/2' : 
            'right-full mr-2 top-1/2 transform -translate-y-1/2'} 
          px-3 py-2 text-sm font-medium text-gray-800 bg-white border border-gray-200 rounded-lg shadow-lg whitespace-nowrap
        `}>
          <div className={`
            absolute w-3 h-3 bg-white transform rotate-45 border-gray-200
            ${tooltipPosition === 'bottom' ? 'top-0 -translate-y-1/2 border-t border-l left-1/2 -translate-x-1/2' : 
              tooltipPosition === 'top' ? 'bottom-0 translate-y-1/2 border-b border-r left-1/2 -translate-x-1/2' : 
              tooltipPosition === 'right' ? 'left-0 -translate-x-1/2 border-l border-t top-1/2 -translate-y-1/2' : 
              'right-0 translate-x-1/2 border-r border-b top-1/2 -translate-y-1/2'}
          `}></div>
          <div className="relative z-10">
            {isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookmarkButton; 