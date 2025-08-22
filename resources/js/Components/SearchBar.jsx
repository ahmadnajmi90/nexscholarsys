import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import useDebounce from '@/Hooks/useDebounce';

const SearchBar = ({ 
  placeholder = "Search...",
  routeName,
  className = "",
  debounceDelay = 300,
  onSearch = null // Optional callback for custom search handling
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, debounceDelay);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle clicks outside search bar to close it (mobile)
  useEffect(() => {
    if (isMobile && isSearchExpanded) {
      const handleClickOutside = (event) => {
        const searchBar = event.target.closest('.search-bar-container');
        if (!searchBar) {
          setIsSearchExpanded(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMobile, isSearchExpanded]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  // Handle search bar toggle (mobile)
  const handleSearchToggle = () => {
    if (isMobile) {
      setIsSearchExpanded(!isSearchExpanded);
    }
  };

  // Handle mouse events (desktop)
  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsSearchExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile && !searchTerm.trim()) {
      setIsSearchExpanded(false);
    }
  };

  // Effect to handle debounced search
  React.useEffect(() => {
    if (onSearch) {
      // Use custom search handler if provided
      onSearch(debouncedSearchTerm);
    } else if (routeName) {
      // Use Inertia router to refetch data with search parameter
      router.get(route(routeName), { search: debouncedSearchTerm }, {
        preserveState: true,
        replace: true,
      });
    }
  }, [debouncedSearchTerm, routeName, onSearch]);

  return (
    <div className={`search-bar-container relative ${className}`}>
      <div 
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {isSearchExpanded ? (
          <div className="flex items-center bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out">
            <div className="flex items-center pl-3 pointer-events-none pr-3">
              <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            <input
              type="text"
              className="w-80 bg-transparent text-gray-900 text-sm p-2.5 focus:outline-none focus:ring-0"
              placeholder={placeholder}
              value={searchTerm}
              onChange={handleSearchChange}
              autoFocus
            />
          </div>
        ) : (
          <button
            className="bg-white border border-gray-300 text-gray-500 p-2.5 rounded-lg shadow-lg hover:bg-gray-50 hover:text-gray-700 transition-all duration-200"
            title={placeholder}
            onClick={handleSearchToggle}
          >
            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar; 