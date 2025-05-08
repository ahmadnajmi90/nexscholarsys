import React, { useState, useEffect, useRef } from 'react';
import SupervisorProfileCard from './SupervisorProfileCard';
import { FaSearch } from 'react-icons/fa';

const ProgressiveLoadingResults = ({
  searchResults,
  universitiesList,
  faculties,
  users,
  researchOptions,
  searchQuery,
  isSearching,
  isLoadingMore = false,
  onLoadMore = () => {}
}) => {
  const [loadedProfiles, setLoadedProfiles] = useState([]);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const loadMoreRef = useRef(null);
  
  // Progressive loading of profile cards
  useEffect(() => {
    if (searchResults && searchResults.matches) {
      // Reset loaded profiles when new results arrive
      setLoadedProfiles([]);
      
      // Load first batch immediately
      const initialBatch = searchResults.matches.slice(0, 6);
      setLoadedProfiles(initialBatch);
      
      // Load the rest progressively
      const remaining = searchResults.matches.slice(6);
      if (remaining.length > 0) {
        const timer = setTimeout(() => {
          setLoadedProfiles(searchResults.matches);
        }, 300);
        
        return () => clearTimeout(timer);
      }
    }
  }, [searchResults]);
  
  // Intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }
    
    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [loadMoreRef]);
  
  // Trigger load more when intersection is detected
  useEffect(() => {
    if (isIntersecting && !isLoadingMore && searchResults && 
        searchResults.has_more && loadedProfiles.length > 0) {
      onLoadMore();
    }
  }, [isIntersecting, isLoadingMore, searchResults, onLoadMore]);
  
  // Generate skeleton cards for loading state
  const renderSkeletons = (count) => {
    return Array(count)
      .fill(null)
      .map((_, index) => (
        <SkeletonCard key={`skeleton-${index}`} />
      ));
  };
  
  // If no results are available yet, show skeleton loaders
  if (isSearching && (!searchResults || !searchResults.matches)) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {renderSkeletons(6)}
      </div>
    );
  }
  
  // If results are available, show them with progressive loading
  if (searchResults && searchResults.matches) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            Supervisor Matches for "{searchResults.query}"
          </h2>
          <span className="text-gray-500">
            {searchResults.total} match{searchResults.total !== 1 ? 'es' : ''} found
          </span>
        </div>
        
        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Loaded profiles */}
          {loadedProfiles.map((match, index) => (
            <SupervisorProfileCard
              key={`${match.academician.id}-${index}`}
              profile={{
                ...match.academician,
                ai_insight: match.ai_insights,
                research_expertise: Array.isArray(match.academician.research_expertise) 
                  ? match.academician.research_expertise 
                  : [],
                availability_as_supervisor: match.academician.availability_as_supervisor || 0,
                match_score: match.score
              }}
              universitiesList={universitiesList}
              faculties={faculties}
              users={users}
              researchOptions={researchOptions}
              aiInsights={match.ai_insights}
              searchQuery={searchQuery}
            />
          ))}
          
          {/* If more profiles are being loaded, show skeletons */}
          {loadedProfiles.length < searchResults.matches.length && 
            renderSkeletons(Math.min(3, searchResults.matches.length - loadedProfiles.length))}
        </div>
        
        {/* Load more trigger */}
        {searchResults.has_more && (
          <div 
            ref={loadMoreRef} 
            className="mt-8 text-center py-4"
          >
            {isLoadingMore ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Loading more results...
              </div>
            ) : (
              <button 
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
                onClick={onLoadMore}
              >
                Load more results
              </button>
            )}
          </div>
        )}
        
        {/* No results message */}
        {searchResults.total === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <FaSearch className="text-gray-400 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No matching supervisors found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Try broadening your search terms or exploring different research areas.
            </p>
          </div>
        )}
      </div>
    );
  }
  
  // Fallback for initial state
  return null;
};

// Skeleton loader component for supervisor cards
const SkeletonCard = () => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden relative animate-pulse">
      {/* Banner */}
      <div className="h-32 bg-gray-200"></div>
      
      {/* Profile image */}
      <div className="flex justify-center -mt-12">
        <div className="w-24 h-24 rounded-full bg-gray-300 border-4 border-white"></div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6 mx-auto mb-4"></div>
        
        {/* AI Insights section */}
        <div className="mt-3 bg-gray-100 p-3 rounded-md">
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6 mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-full"></div>
        </div>
        
        {/* Buttons */}
        <div className="mt-4 flex justify-center gap-2">
          <div className="h-8 bg-gray-200 rounded w-24"></div>
          <div className="h-8 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-4 border-t border-gray-100 p-4 flex justify-around">
        <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
        <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
        <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  );
};

export default ProgressiveLoadingResults; 