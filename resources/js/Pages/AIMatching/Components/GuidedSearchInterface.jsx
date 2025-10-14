import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Search, History, ChevronDown, X } from 'lucide-react';

const GuidedSearchInterface = ({ 
  onSearch, 
  researchOptions,
  isSearching = false,
  initialQuery = '',
  pageTitle = 'Find Your Perfect Research Supervisor',
  searchDescription = 'Enter your research interest, topic, or field of study below and we\'ll match you with supervisors who have relevant expertise.',
  placeholder = 'e.g., Artificial Intelligence in Healthcare, Design Science Research...',
  tips = [],
  error = null,
  children, // Add children prop for search type selector
  searchQuery,
  onSearchQueryChange,
  searchType,
  onSearchTypeChange,
  isAcademician,
  userId
}) => {
  // Generate context-aware storage key for recent searches
  const getRecentSearchesKey = () => {
    return `ai_recent_searches_${userId}_${searchType}`;
  };
  const [recentSearches, setRecentSearches] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState('history'); // 'history' or 'suggestions'
  const [localError, setLocalError] = useState(null);
  const [suggestedTerms, setSuggestedTerms] = useState([]);
  const dropdownRef = useRef(null);
  
  // Handle clicks outside the dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);
  
  // Load recent searches from localStorage (context-aware)
  useEffect(() => {
    try {
      const storageKey = getRecentSearchesKey();
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const searches = parsed.slice(0, 5);
          setRecentSearches(searches);
          // Set default tab based on whether we have history
          setActiveTab(searches.length > 0 ? 'history' : 'suggestions');
        }
      } else {
        // No history, default to suggestions
        setActiveTab('suggestions');
      }
    } catch (e) {
      console.error('Error loading recent searches:', e);
      setActiveTab('suggestions');
    }
  }, [userId, searchType]);
  
  // Generate natural language suggestions that showcase NLP capabilities
  useEffect(() => {
    // DEBUG: Log current search type when generating suggestions
    console.log('💡 Generating suggestions for searchType:', searchType);
    
    // Smart, context-aware suggestions based on search type
    const generateSmartSuggestions = () => {
      const suggestions = [];
      
      if (searchType === 'supervisor') {
        suggestions.push(
          "Find me a supervisor specializing in machine learning and AI",
          "I'm looking for experts in sustainable energy research",
          "Who can guide me in data science and analytics?",
          "Recommend supervisors for biomedical engineering research",
          "Looking for mentors in computer vision and robotics"
        );
      } else if (searchType === 'students') {
        suggestions.push(
          "Students interested in deep learning and neural networks",
          "Find motivated researchers for data analysis projects",
          "Looking for students passionate about climate change research",
          "Find postgraduates with experience in molecular biology",
          "Students working on mobile and web development"
        );
      } else if (searchType === 'collaborators') {
        // Explicit case for collaborators to avoid falling through
        suggestions.push(
          "Find collaborators for interdisciplinary AI research",
          "Looking for partners in climate science and sustainability",
          "Who's working on cybersecurity and privacy research?",
          "Find colleagues interested in educational technology",
          "Collaborators for joint publication in data science"
        );
      } else {
        // Fallback for any unexpected search type
        console.warn('⚠️ Unexpected search type:', searchType, '- using default suggestions');
        suggestions.push(
          "Find collaborators for interdisciplinary AI research",
          "Looking for partners in climate science and sustainability",
          "Who's working on cybersecurity and privacy research?",
          "Find colleagues interested in educational technology",
          "Collaborators for joint publication in data science"
        );
      }
      
      return suggestions;
    };
    
    setSuggestedTerms(generateSmartSuggestions());
  }, [searchType]);
  
  // Save a search to recent searches (context-aware)
  const saveSearchToRecent = (query) => {
    try {
      // Ensure query is a string
      const queryString = typeof query === 'string' ? query : String(query);
      
      if (queryString && queryString.trim().length > 0) {
        // Add to beginning, remove duplicates, limit to 5
        const updatedSearches = [queryString, ...recentSearches.filter(s => s !== queryString)].slice(0, 5);
        setRecentSearches(updatedSearches);
        const storageKey = getRecentSearchesKey();
        localStorage.setItem(storageKey, JSON.stringify(updatedSearches));
      }
    } catch (e) {
      console.error('Error saving recent search:', e);
    }
  };
  
  // Delete a search from history (context-aware)
  const deleteSearchFromHistory = (searchToDelete, e) => {
    e.stopPropagation(); // Prevent triggering the search
    try {
      const updatedSearches = recentSearches.filter(s => s !== searchToDelete);
      setRecentSearches(updatedSearches);
      const storageKey = getRecentSearchesKey();
      localStorage.setItem(storageKey, JSON.stringify(updatedSearches));
      
      // If no more history, switch to suggestions tab
      if (updatedSearches.length === 0) {
        setActiveTab('suggestions');
      }
    } catch (e) {
      console.error('Error deleting search:', e);
    }
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    
    
    setLocalError(null);
    saveSearchToRecent(searchQuery);
    onSearch(searchQuery);
  };
  
  const handleQueryChange = (e) => {
    // Ensure we're always working with a string value
    const value = typeof e === 'string' ? e : e?.target?.value || '';
    onSearchQueryChange(value);
    setLocalError(null);
  };
  
  const handleItemSelect = (item) => {
    // Ensure we're passing a string, not an object
    const value = typeof item === 'string' ? item : String(item);
    onSearchQueryChange(value);
    setShowDropdown(false);
  };
  
  // Get search type label
  const getSearchTypeLabel = () => {
    if (searchType === 'supervisor') return 'Supervisor';
    if (searchType === 'students') return 'Students';
    if (searchType === 'collaborators') return 'Collaborators';
    return 'Supervisor';
  };
  
  // Get available search types based on role
  const getAvailableSearchTypes = () => {
    const types = [];
    
    // Students can search for supervisors
    if (!isAcademician) {
      types.push({ value: 'supervisor', label: 'Supervisor' });
    }
    
    // Academicians can search for students only
    if (isAcademician) {
      types.push({ value: 'students', label: 'Students'});
    }
    
    // Everyone can search for collaborators
    types.push({ value: 'collaborators', label: 'Collaborators' });
    
    return types;
  };
  
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      {/* Simplified header */}
      <div className="mb-4 sm:mb-6 text-center">
        <h1 className="text-base sm:text-lg text-gray-600 font-normal">What can we match you?</h1>
      </div>
      
      {/* Modern search bar */}
      <div className="w-full max-w-4xl">
        <form onSubmit={handleSearchSubmit} className="relative">
          {/* Main search container */}
          <div className="relative bg-white rounded-full shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center">
              {/* Search type dropdown */}
              <div className="relative flex-shrink-0">
                <select
                  value={searchType}
                  onChange={(e) => onSearchTypeChange(e.target.value)}
                  className="appearance-none bg-transparent border-none pl-3 sm:pl-5 pr-7 sm:pr-9 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-gray-700 focus:outline-none cursor-pointer"
                  style={{ minWidth: '110px' }}
                >
                  {getAvailableSearchTypes().map(type => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 sm:right-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5 sm:w-4 sm:h-4 pointer-events-none" />
          </div>
          
              {/* Divider */}
              <div className="h-5 sm:h-6 w-px bg-gray-300 flex-shrink-0"></div>
              
              {/* Search input */}
              <input
                type="text"
                value={typeof searchQuery === 'string' ? searchQuery : ''}
                onChange={handleQueryChange}
                onFocus={() => setShowDropdown(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (searchQuery.trim().length >= 3) {
                      setLocalError(null);
                      saveSearchToRecent(searchQuery);
                      onSearch(searchQuery);
                      setShowDropdown(false);
                    } else {
                      setLocalError('Please enter at least 3 characters to search');
                    }
                  }
                }}
                placeholder="Ask me anything about your research match..."
                className="flex-1 px-3 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base border-none outline-none focus:outline-none focus:ring-0 bg-transparent min-w-0"
              />
          
          {/* Search button */}
          <button
            type="submit"
                disabled={isSearching}
                className={`mr-1.5 sm:mr-2 p-2 sm:p-2.5 rounded-full flex-shrink-0 ${
                  isSearching 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-colors'
                }`}
          >
            {isSearching ? (
                  <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
            ) : (
                  <Search className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            )}
          </button>
            </div>
          </div>
          
          {/* Dropdown with tabs */}
          {showDropdown && (
            <div 
              ref={dropdownRef}
              className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden animate-slideDown max-h-[40vh]"
              style={{
                animation: 'slideDown 0.2s ease-out'
              }}
            >
              {/* Tabs */}
              <div className="flex border-b border-gray-200 bg-gray-50 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab('history')}
                  className={`flex-1 px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-medium transition-colors ${
                    activeTab === 'history'
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <History className="inline w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  History {recentSearches.length > 0 && `(${recentSearches.length})`}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('suggestions')}
                  className={`flex-1 px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-medium transition-colors ${
                    activeTab === 'suggestions'
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Sparkles className="inline w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  Suggestions
                </button>
              </div>
              
              {/* Tab content */}
              <div className="overflow-y-auto p-2 sm:p-3" style={{ maxHeight: 'calc(40vh - 42px)' }}>
                {activeTab === 'history' ? (
                  <>
                      {recentSearches.length > 0 ? (
                      <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleItemSelect(search)}
                            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-colors flex items-center group"
                          >
                            <History className="mr-3 text-gray-400 group-hover:text-blue-600 w-4 h-4 flex-shrink-0" />
                            <span className="flex-1">{search}</span>
                            <button
                              onClick={(e) => deleteSearchFromHistory(search, e)}
                              className="ml-2 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                              title="Delete"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <History className="mx-auto w-12 h-12 mb-3 text-gray-300" />
                        <p className="text-sm">No search history yet</p>
                        <p className="text-xs mt-1">Your recent searches will appear here</p>
                      </div>
                    )}
                  </>
                  ) : (
                    <div className="space-y-2">
                      {suggestedTerms.map((term, index) => (
                      <button
                          key={index}
                        type="button"
                          onClick={() => handleItemSelect(term)}
                          className="w-full px-4 py-3 text-sm text-gray-700 bg-gradient-to-r from-gray-50 to-blue-50 hover:from-blue-50 hover:to-blue-100 hover:text-blue-800 rounded-lg transition-all text-left border border-gray-200 hover:border-blue-400 hover:shadow-sm flex items-start group"
                      >
                          <Sparkles className="w-4 h-4 mr-3 mt-0.5 text-gray-400 group-hover:text-blue-500 flex-shrink-0" />
                          <span className="flex-1">{term}</span>
                      </button>
                  ))}
                    </div>
                  )}
              </div>
            </div>
          )}
        </form>
        
        {/* Error message */}
        {(localError || error) && (
          <p className="text-red-500 mt-2 text-center text-xs sm:text-sm">{localError || error}</p>
        )}
      </div>
    </div>
  );
};

export default GuidedSearchInterface; 

// Add slideDown animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
if (typeof document !== 'undefined' && !document.getElementById('slideDown-animation')) {
  style.id = 'slideDown-animation';
  document.head.appendChild(style);
} 