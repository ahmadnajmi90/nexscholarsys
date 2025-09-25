import React, { useState, useEffect } from 'react';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import toast from 'react-hot-toast';
import BookmarkHandler from '@/Utils/BookmarkHandler';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`cursor-pointer ${className}`}>
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
          </div>
        </TooltipTrigger>
        <TooltipContent side={tooltipPosition}>
          <p>{isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BookmarkButton; 