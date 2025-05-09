import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaLightbulb, FaHistory } from 'react-icons/fa';
import NaturalLanguageQueryBuilder from './NaturalLanguageQueryBuilder';

const GuidedSearchInterface = ({ 
  onSearch, 
  researchOptions,
  isSearching = false,
  initialQuery = ''
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecent, setShowRecent] = useState(false);
  const [error, setError] = useState(null);
  const recentSearchesRef = useRef(null);
  
  // Handle clicks outside the recent searches dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (recentSearchesRef.current && !recentSearchesRef.current.contains(event.target)) {
        setShowRecent(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [recentSearchesRef]);
  
  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('supervisor_recent_searches');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setRecentSearches(parsed.slice(0, 5)); // Keep last 5 searches
        }
      }
    } catch (e) {
      console.error('Error loading recent searches:', e);
    }
  }, []);
  
  // Save a search to recent searches
  const saveSearchToRecent = (query) => {
    try {
      if (query && query.trim().length > 0) {
        // Add to beginning, remove duplicates, limit to 5
        const updatedSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
        setRecentSearches(updatedSearches);
        localStorage.setItem('supervisor_recent_searches', JSON.stringify(updatedSearches));
      }
    } catch (e) {
      console.error('Error saving recent search:', e);
    }
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    
    if (searchQuery.trim().length < 3) {
      setError('Please enter at least 3 characters to search');
      return;
    }
    
    setError(null);
    saveSearchToRecent(searchQuery);
    onSearch(searchQuery);
  };
  
  const handleQueryChange = (newQuery) => {
    setSearchQuery(newQuery);
    setError(null);
  };
  
  const handleRecentSearch = (query) => {
    setSearchQuery(query);
    onSearch(query);
    setShowRecent(false);
  };
  
  // Handle Enter key press from NaturalLanguageQueryBuilder
  const handleEnterPress = () => {
    if (searchQuery.trim().length < 3) {
      setError('Please enter at least 3 characters to search');
      return;
    }
    
    setError(null);
    saveSearchToRecent(searchQuery);
    onSearch(searchQuery);
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Find Your Perfect Research Supervisor</h1>
        <p className="text-gray-600 mb-6">
          Enter your research interest, topic, or field of study below and we'll match you with supervisors who have relevant expertise.
        </p>
      </div>
      
      <form onSubmit={handleSearchSubmit} className="mb-8">
        <div className="relative flex">
          <div className="relative flex-grow">
            <NaturalLanguageQueryBuilder
              onQueryChange={handleQueryChange}
              initialQuery={searchQuery}
              researchOptions={researchOptions}
              onEnterPress={handleEnterPress}
              placeholder="e.g., Artificial Intelligence in Healthcare, Design Science Research..."
            />
          </div>
          
          {/* Recent searches button */}
          <div className="absolute right-20 top-4 z-10">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setShowRecent(!showRecent)}
              title="Recent searches"
            >
              <FaHistory />
            </button>
          </div>
          
          {/* Search button */}
          <button
            type="submit"
            className={`bg-blue-600 text-white px-6 py-3 rounded-r-lg flex items-center justify-center ${
              isSearching ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
            disabled={isSearching}
          >
            {isSearching ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
            ) : (
              <FaSearch />
            )}
          </button>
          
          {/* Recent searches dropdown */}
          {showRecent && recentSearches.length > 0 && (
            <div 
              ref={recentSearchesRef}
              className="absolute top-12 right-0 mt-2 w-full md:w-72 bg-white border border-gray-200 rounded-md shadow-lg z-30"
            >
              <div className="p-3">
                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaHistory className="mr-2 text-gray-500" /> Recent Searches
                </h3>
                <ul className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <li key={index}>
                      <button
                        type="button"
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                        onClick={() => handleRecentSearch(search)}
                      >
                        {search}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
        
        {error && (
          <p className="text-red-500 mt-2 text-center">{error}</p>
        )}
      </form>
      
      {/* Search guidance - redesigned to match the image */}
      <div className="mt-8 border-t border-gray-200 pt-10">
        <div className="flex items-center mb-4">
          <FaLightbulb className="text-yellow-500 mr-2" />
          <h3 className="text-lg font-semibold">Tips for finding the right supervisor</h3>
        </div>
        
        <ol className="space-y-3 text-gray-600 list-decimal list-inside">
          <li className="flex items-start">
            <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">1</span>
            <span>Be specific about your research area (e.g., "Machine Learning for Medical Imaging" rather than just "AI")</span>
          </li>
          <li className="flex items-start">
            <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">2</span>
            <span>You can also use vague queries like "recommend supervisors for me" to get results based on your profile</span>
          </li>
          <li className="flex items-start">
            <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">3</span>
            <span>Click on suggested research terms to quickly add them to your search</span>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default GuidedSearchInterface; 