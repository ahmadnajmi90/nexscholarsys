import React, { useState, useRef, useEffect } from 'react';
import { FaSearch, FaInfoCircle, FaLightbulb } from 'react-icons/fa';

export default function GuidedSearchInterface({
  searchType = 'supervisor',
  onSearch,
  placeholderText = 'Enter your search query...',
  isSearching = false,
  initialQuery = '',
  searchTips = []
}) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [showSearchTips, setShowSearchTips] = useState(false);
  const searchInputRef = useRef(null);
  const tipsRef = useRef(null);

  // Focus the search input on component mount
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchType]);

  // Update local state when initialQuery changes
  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  // Handle clicks outside of the search tips dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (tipsRef.current && !tipsRef.current.contains(event.target)) {
        setShowSearchTips(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle search submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  // Handle a search tip click
  const handleSearchTipClick = (tip) => {
    setSearchQuery(tip);
    setShowSearchTips(false);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  return (
    <div className="mb-8">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          {/* Search input */}
          <div className="flex-grow relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={placeholderText}
              className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg 
                       focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
              disabled={isSearching}
            />
            {/* Search tips button */}
            <button
              type="button"
              onClick={() => setShowSearchTips(!showSearchTips)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <FaLightbulb className={`h-5 w-5 ${showSearchTips ? 'text-blue-500' : 'text-gray-400'}`} />
            </button>
          </div>
          
          {/* Search button */}
          <button
            type="submit"
            disabled={!searchQuery.trim() || isSearching}
            className={`px-6 py-3 rounded-lg text-white font-medium text-base
                      ${!searchQuery.trim() || isSearching
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                      }`}
          >
            {isSearching ? (
              <div className="flex items-center space-x-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Searching...</span>
              </div>
            ) : (
              'Search'
            )}
          </button>
        </div>

        {/* Search tips dropdown */}
        {showSearchTips && searchTips.length > 0 && (
          <div 
            ref={tipsRef}
            className="absolute z-10 mt-2 w-full md:w-3/4 bg-white shadow-lg rounded-lg border border-gray-200 py-2 overflow-hidden"
          >
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center">
              <FaInfoCircle className="text-blue-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Search tips</span>
            </div>
            <ul className="py-1">
              {searchTips.map((tip, index) => (
                <li 
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                  onClick={() => handleSearchTipClick(tip)}
                >
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </div>
  );
} 