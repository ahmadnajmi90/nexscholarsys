import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { FaTrash, FaFilter } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import BookmarkButton from '@/Components/BookmarkButton';
import DOMPurify from 'dompurify';

// Helper function to safely render HTML content
const SafeHTML = ({ html, className }) => {
  const sanitizedHTML = DOMPurify.sanitize(html || '', {
    ALLOWED_TAGS: ['b', 'i', 'u', 'p', 'br', 'ul', 'ol', 'li', 'strong', 'em'],
    ALLOWED_ATTR: []
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

// Plain text truncated content
const TruncatedText = ({ text, maxLength = 100, className }) => {
  if (!text) return <p className={className}>No content available</p>;
  
  const plainText = text.replace(/<[^>]*>/g, ''); // Strip HTML tags
  const truncated = plainText.length > maxLength 
    ? plainText.substring(0, maxLength) + '...' 
    : plainText;
  
  return <p className={className}>{truncated}</p>;
};

const BookmarkCard = ({ bookmark, onRemove }) => {
  const renderBookmarkContent = () => {
    const { bookmarkable, bookmarkable_type } = bookmark;
    
    if (!bookmarkable) {
      return (
        <div className="p-4 bg-red-100 rounded-md">
          <p className="text-red-600">This item is no longer available</p>
        </div>
      );
    }
    
    switch (bookmarkable_type) {
      case 'App\\Models\\Academician':
        return (
          <div className="p-4 bg-white rounded-lg shadow-md">
            <div className="flex items-center mb-3">
              <img 
                src={bookmarkable.profile_picture ? `/storage/${bookmarkable.profile_picture}` : '/storage/profile_pictures/default.jpg'} 
                className="w-12 h-12 rounded-full mr-3" 
                alt={bookmarkable.full_name} 
              />
              <div>
                <h3 className="font-semibold">{bookmarkable.full_name}</h3>
                <p className="text-sm text-gray-600">{bookmarkable.current_position}</p>
              </div>
            </div>
            <div className="flex justify-between items-center mt-2">
              <a 
                href={route('academicians.show', bookmarkable.url)} 
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
              >
                View Profile
              </a>
              <button 
                onClick={() => onRemove(bookmark.id)}
                className="text-red-500 hover:text-red-700"
                aria-label="Remove bookmark"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        );
      
      case 'App\\Models\\Undergraduate':
        return (
          <div className="p-4 bg-white rounded-lg shadow-md">
            <div className="flex items-center mb-3">
              <img 
                src={bookmarkable.profile_picture ? `/storage/${bookmarkable.profile_picture}` : '/storage/profile_pictures/default.jpg'} 
                className="w-12 h-12 rounded-full mr-3" 
                alt={bookmarkable.full_name} 
              />
              <div>
                <h3 className="font-semibold">{bookmarkable.full_name}</h3>
                <p className="text-sm text-gray-600">Undergraduate Student</p>
              </div>
            </div>
            <div className="flex justify-between items-center mt-2">
              <a 
                href={route('undergraduates.show', bookmarkable.url)} 
                className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition"
              >
                View Profile
              </a>
              <button 
                onClick={() => onRemove(bookmark.id)}
                className="text-red-500 hover:text-red-700"
                aria-label="Remove bookmark"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        );
      
      case 'App\\Models\\Postgraduate':
        return (
          <div className="p-4 bg-white rounded-lg shadow-md">
            <div className="flex items-center mb-3">
              <img 
                src={bookmarkable.profile_picture ? `/storage/${bookmarkable.profile_picture}` : '/storage/profile_pictures/default.jpg'} 
                className="w-12 h-12 rounded-full mr-3" 
                alt={bookmarkable.full_name} 
              />
              <div>
                <h3 className="font-semibold">{bookmarkable.full_name}</h3>
                <p className="text-sm text-gray-600">Postgraduate Student</p>
              </div>
            </div>
            <div className="flex justify-between items-center mt-2">
              <a 
                href={route('postgraduates.show', bookmarkable.url)} 
                className="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600 transition"
              >
                View Profile
              </a>
              <button 
                onClick={() => onRemove(bookmark.id)}
                className="text-red-500 hover:text-red-700"
                aria-label="Remove bookmark"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        );
      
      case 'App\\Models\\PostGrant':
        return (
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="font-semibold">{bookmarkable.title}</h3>
            <TruncatedText 
              text={bookmarkable.description}
              className="text-sm text-gray-600 line-clamp-2"
            />
            <div className="flex justify-between items-center mt-3">
              <a 
                href={route('grants.show', bookmarkable.url)} 
                className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition"
              >
                View Grant
              </a>
              <button 
                onClick={() => onRemove(bookmark.id)}
                className="text-red-500 hover:text-red-700"
                aria-label="Remove bookmark"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        );
      
      case 'App\\Models\\PostProject':
        return (
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="font-semibold">{bookmarkable.title}</h3>
            <TruncatedText 
              text={bookmarkable.description}
              className="text-sm text-gray-600 line-clamp-2"
            />
            <div className="flex justify-between items-center mt-3">
              <a 
                href={route('projects.show', bookmarkable.url)} 
                className="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600 transition"
              >
                View Project
              </a>
              <button 
                onClick={() => onRemove(bookmark.id)}
                className="text-red-500 hover:text-red-700"
                aria-label="Remove bookmark"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        );
      
      case 'App\\Models\\PostEvent':
        return (
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="font-semibold">{bookmarkable.event_name}</h3>
            <TruncatedText 
              text={bookmarkable.description}
              className="text-sm text-gray-600 line-clamp-2"
            />
            <div className="flex justify-between items-center mt-3">
              <a 
                href={route('events.show', bookmarkable.url)} 
                className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 transition"
              >
                View Event
              </a>
              <button 
                onClick={() => onRemove(bookmark.id)}
                className="text-red-500 hover:text-red-700"
                aria-label="Remove bookmark"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        );
      
      case 'App\\Models\\CreatePost':
        return (
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="font-semibold">{bookmarkable.title}</h3>
            <TruncatedText 
              text={bookmarkable.content}
              className="text-sm text-gray-600 line-clamp-2"
            />
            <div className="flex justify-between items-center mt-3">
              <a 
                href={route('posts.show', bookmarkable.url)} 
                className="px-3 py-1 bg-indigo-500 text-white text-sm rounded hover:bg-indigo-600 transition"
              >
                View Post
              </a>
              <button 
                onClick={() => onRemove(bookmark.id)}
                className="text-red-500 hover:text-red-700"
                aria-label="Remove bookmark"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="p-4 bg-white rounded-lg shadow-md">
            <p className="text-gray-600">Unknown bookmark type</p>
            <button 
              onClick={() => onRemove(bookmark.id)}
              className="mt-2 text-red-500 hover:text-red-700"
              aria-label="Remove bookmark"
            >
              <FaTrash />
            </button>
          </div>
        );
    }
  };
  
  return (
    <div className="mb-4">
      {renderBookmarkContent()}
    </div>
  );
};

export default function Bookmarks({ auth, bookmarks }) {
  const [bookmarksList, setBookmarksList] = useState(bookmarks);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Create a mapping to categorize bookmarks by type if using the older "Profiles" category
  const categorizeBookmarks = () => {
    const updatedBookmarks = { ...bookmarksList };
    
    // Check if we have the old "Profiles" category that needs to be split
    if (updatedBookmarks.Profiles) {
      // Create new categories if they don't exist
      if (!updatedBookmarks.Academicians) updatedBookmarks.Academicians = [];
      if (!updatedBookmarks.Postgraduates) updatedBookmarks.Postgraduates = [];
      if (!updatedBookmarks.Undergraduates) updatedBookmarks.Undergraduates = [];
      
      // Distribute the profiles to their appropriate categories
      updatedBookmarks.Profiles.forEach(bookmark => {
        const type = bookmark.bookmarkable_type.toLowerCase();
        
        if (type.includes('academician')) {
          updatedBookmarks.Academicians.push(bookmark);
        } else if (type.includes('postgraduate')) {
          updatedBookmarks.Postgraduates.push(bookmark);
        } else if (type.includes('undergraduate')) {
          updatedBookmarks.Undergraduates.push(bookmark);
        }
      });
      
      // Remove empty categories
      if (updatedBookmarks.Academicians.length === 0) delete updatedBookmarks.Academicians;
      if (updatedBookmarks.Postgraduates.length === 0) delete updatedBookmarks.Postgraduates;
      if (updatedBookmarks.Undergraduates.length === 0) delete updatedBookmarks.Undergraduates;
      
      // Remove the old Profiles category if we've distributed all the bookmarks
      delete updatedBookmarks.Profiles;
      
      // Update the state with the new categorized bookmarks
      setBookmarksList(updatedBookmarks);
    }
  };
  
  // Run the categorization once when the component mounts
  useEffect(() => {
    categorizeBookmarks();
  }, []);
  
  const categories = Object.keys(bookmarksList).sort();
  
  const removeBookmark = async (id) => {
    try {
      await axios.delete(route('bookmarks.destroy', id));
      
      // Update the local state to remove the bookmark
      const updatedBookmarks = { ...bookmarksList };
      
      // Find and remove the bookmark from the appropriate category
      Object.keys(updatedBookmarks).forEach(category => {
        updatedBookmarks[category] = updatedBookmarks[category].filter(
          bookmark => bookmark.id !== id
        );
        
        // If category is empty, remove it
        if (updatedBookmarks[category].length === 0) {
          delete updatedBookmarks[category];
        }
      });
      
      setBookmarksList(updatedBookmarks);
      toast.success('Bookmark removed successfully', {
        position: "bottom-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error('Error removing bookmark:', error);
      toast.error('Failed to remove bookmark', {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };
  
  const filteredBookmarks = () => {
    // If no search term and showing all categories, return all bookmarks
    if (searchTerm === '' && selectedCategory === 'all') {
      return bookmarksList;
    }
    
    const filtered = {};
    
    // Filter by category first
    const categoriesToInclude = selectedCategory === 'all' 
      ? Object.keys(bookmarksList) 
      : [selectedCategory];
    
    // Apply search filter if needed
    categoriesToInclude.forEach(category => {
      if (bookmarksList[category]) {
        if (searchTerm === '') {
          filtered[category] = bookmarksList[category];
        } else {
          filtered[category] = bookmarksList[category].filter(bookmark => {
            const bookmarkable = bookmark.bookmarkable;
            if (!bookmarkable) return false;
            
            // Search based on bookmark type
            switch (bookmark.bookmarkable_type) {
              case 'App\\Models\\Academician':
                return bookmarkable.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       (bookmarkable.current_position && bookmarkable.current_position.toLowerCase().includes(searchTerm.toLowerCase()));
              
              case 'App\\Models\\PostGrant':
              case 'App\\Models\\PostProject':
                return bookmarkable.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       bookmarkable.description.toLowerCase().includes(searchTerm.toLowerCase());
              
              case 'App\\Models\\PostEvent':
                return bookmarkable.event_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       bookmarkable.description.toLowerCase().includes(searchTerm.toLowerCase());
              
              case 'App\\Models\\CreatePost':
                return bookmarkable.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       bookmarkable.content.toLowerCase().includes(searchTerm.toLowerCase());
              
              default:
                return false;
            }
          });
          
          // Only include category if it has bookmarks after filtering
          if (filtered[category].length === 0) {
            delete filtered[category];
          }
        }
      }
    });
    
    return filtered;
  };
  
  // Get the current filtered bookmarks
  const currentFilteredBookmarks = filteredBookmarks();
  
  // Count total bookmarks
  const totalBookmarks = Object.values(bookmarksList).reduce(
    (total, categoryBookmarks) => total + categoryBookmarks.length, 
    0
  );
  
  // Count filtered bookmarks
  const totalFilteredBookmarks = Object.values(currentFilteredBookmarks).reduce(
    (total, categoryBookmarks) => total + categoryBookmarks.length, 
    0
  );
  
  return (
    <MainLayout auth={auth} title="My Bookmarks">
      <Head title="My Bookmarks" />

      <div className="py-0">
        <div className="max-w-8xl mx-auto ">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              {/* Filters and search */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
                <div className="flex items-center">
                  <span className="mr-2 text-gray-700">Filter by:</span>
                  <FaFilter className="text-gray-500 mr-2" />
                  <select
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category} ({bookmarksList[category].length})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="relative w-full md:w-1/3">
                  <input
                    type="text"
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 pl-10"
                    placeholder="Search bookmarks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Bookmarks count */}
              <div className="mb-6 text-gray-600">
                {totalFilteredBookmarks === totalBookmarks ? (
                  <p>Showing all {totalBookmarks} bookmarks</p>
                ) : (
                  <p>Showing {totalFilteredBookmarks} of {totalBookmarks} bookmarks</p>
                )}
              </div>
              
              {/* Bookmarks content */}
              {Object.keys(currentFilteredBookmarks).length === 0 ? (
                <div className="py-10 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No bookmarks found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm || selectedCategory !== 'all' ? 
                      'Try adjusting your filters or search term' : 
                      'Start adding bookmarks by clicking the bookmark icon on profiles, posts, events, projects, or grants.'}
                  </p>
                </div>
              ) : (
                Object.keys(currentFilteredBookmarks).sort().map((category) => (
                  <div key={category} className="mb-8">
                    <h3 className="text-lg font-semibold mb-3 pb-2 border-b">{category} ({currentFilteredBookmarks[category].length})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {currentFilteredBookmarks[category].map((bookmark) => (
                        <BookmarkCard
                          key={bookmark.id}
                          bookmark={bookmark}
                          onRemove={removeBookmark}
                        />
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 