import React, { useState, useEffect } from 'react';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { Popover } from '@headlessui/react';
import axios from 'axios';
import { toast } from 'react-toastify';

/**
 * Bookmark Button Component
 * 
 * @param {Object} props Component props
 * @param {number} props.bookmarkableId - ID of the item to bookmark
 * @param {string} props.bookmarkableType - Type of the item to bookmark (must be one of: 'academician', 'grant', 'project', 'event', 'post', 'undergraduate', 'postgraduate')
 * @param {string} [props.category='general'] - Category for the bookmark
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {string} [props.iconSize='text-xl'] - Size of the bookmark icon
 * @param {string} [props.tooltipPosition='bottom'] - Position of the tooltip
 */
const BookmarkButton = ({ 
  bookmarkableId, 
  bookmarkableType,
  category = 'general',
  className = '',
  iconSize = 'text-xl',
  tooltipPosition = 'bottom'
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Convert fully qualified model name to the format expected by the API
  const normalizeBookmarkableType = (type) => {
    if (type.includes('\\')) {
      const parts = type.split('\\');
      return parts[parts.length - 1].toLowerCase();
    }
    return type.toLowerCase();
  };

  // Get the normalized type for API calls
  const normalizedType = normalizeBookmarkableType(bookmarkableType);

  useEffect(() => {
    // Check if item is already bookmarked when component mounts
    checkBookmarkStatus();
  }, [bookmarkableId, normalizedType]);

  const checkBookmarkStatus = async () => {
    if (!bookmarkableId || !normalizedType) return;
    
    setIsLoading(true);
    try {
      const response = await axios.post(route('bookmarks.check'), {
        bookmarkable_id: bookmarkableId,
        bookmarkable_type: normalizedType
      });
      
      setIsBookmarked(response.data.is_bookmarked);
    } catch (error) {
      console.error('Error checking bookmark status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleBookmark = async () => {
    if (!bookmarkableId || !normalizedType || isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await axios.post(route('bookmarks.toggle'), {
        bookmarkable_id: bookmarkableId,
        bookmarkable_type: normalizedType,
        category: category
      });
      
      setIsBookmarked(response.data.is_bookmarked);
      
      // Show success message
      toast.success(
        response.data.is_bookmarked 
          ? 'Added to bookmarks' 
          : 'Removed from bookmarks',
        {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast.error('Failed to update bookmark. Please try again.', {
        position: "bottom-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTooltipPositionClasses = () => {
    switch (tooltipPosition) {
      case 'top':
        return 'bottom-full mb-2';
      case 'bottom':
        return 'top-full mt-2';
      case 'left':
        return 'right-full mr-2';
      case 'right':
        return 'left-full ml-2';
      default:
        return 'top-full mt-2';
    }
  };

  return (
    <Popover className={`relative ${className}`}>
      {({ open }) => (
        <>
          <Popover.Button as="div" className="focus:outline-none cursor-pointer">
      <button
        onClick={toggleBookmark}
        className={`flex items-center focus:outline-none ${isBookmarked ? 'text-yellow-500' : 'text-gray-500 hover:text-yellow-500'} transition duration-200`}
        disabled={isLoading}
              aria-label={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
      >
        {isLoading ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
              ) : isBookmarked ? (
              <FaBookmark className={iconSize} />
            ) : (
              <FaRegBookmark className={iconSize} />
        )}
      </button>
          </Popover.Button>
          <Popover.Panel className={`absolute z-10 transform ${getTooltipPositionClasses()} -translate-x-1/2 bg-white border border-gray-200 shadow-lg rounded-md p-2 text-sm whitespace-nowrap`}>
            {isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
          </Popover.Panel>
        </>
      )}
    </Popover>
  );
};

export default BookmarkButton; 