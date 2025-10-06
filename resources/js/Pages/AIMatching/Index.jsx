import React, { useState, useEffect, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import GuidedSearchInterface from './Components/GuidedSearchInterface';
import ResultsGrid from './Components/ResultsGrid';
import SearchTypeSelector from './Components/SearchTypeSelector';
import FilterPanel from './Components/FilterPanel';
import TopMatchesPreview from './Components/TopMatchesPreview';
import { MultiStepLoader } from '@/Components/ui/multi-step-loader';
import { FaFilter, FaLightbulb, FaRobot, FaBrain, FaSearch, FaDatabase } from 'react-icons/fa';
import axios from 'axios';
import useRoles from '@/Hooks/useRoles';
import { isSessionExpired, handlePossibleSessionExpiration } from '@/Utils/csrfHelper';
import { Sparkles } from 'lucide-react';

export default function Index({ auth, universities, faculties, users, researchOptions, skills }) {
  const { isAdmin, isPostgraduate, isUndergraduate, isFacultyAdmin, isAcademician } = useRoles();
  
  // Generate context-aware storage key
  const getStorageKey = (baseKey, searchTypeParam = 'supervisor') => {
    return `${baseKey}_${auth.user.id}_${searchTypeParam}`;
  };
  
  // Helper function to get initial state from sessionStorage with context
  const getInitialState = (baseKey, searchTypeParam, defaultValue) => {
    try {
      const key = getStorageKey(baseKey, searchTypeParam);
      const savedState = sessionStorage.getItem(key);
      return savedState ? JSON.parse(savedState) : defaultValue;
    } catch (error) {
      console.error("Error reading from sessionStorage", error);
      return defaultValue;
    }
  };
  
  // Set default search type based on user role
  const getDefaultSearchType = () => {
    if (isAcademician) {
      return 'students'; // Academicians default to searching for students
    }
    return 'supervisor'; // Students default to searching for supervisors
  };
  
  const defaultSearchType = getDefaultSearchType();
  const [searchType, setSearchType] = useState(defaultSearchType);
  const [searchQuery, setSearchQuery] = useState(() => getInitialState('ai_search_query', defaultSearchType, ''));
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(() => getInitialState('ai_search_results', defaultSearchType, null));
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  
  // New state variables for AI Processing Modal
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  
  // New state variables for AI Insight Modal
  const [isInsightModalOpen, setIsInsightModalOpen] = useState(false);
  const [currentInsight, setCurrentInsight] = useState('');
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // New state for view management: 'search' | 'preview' | 'full'
  const [currentView, setCurrentView] = useState('search');
  
  // Filter states
  const [selectedArea, setSelectedArea] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]); // Add skills filter state
  const [showFilters, setShowFilters] = useState(false);
  
  // Save state to sessionStorage when navigating away (with context)
  useEffect(() => {
    // This cleanup function runs when the user navigates away
    return () => {
      try {
        const queryKey = getStorageKey('ai_search_query', searchType);
        const resultsKey = getStorageKey('ai_search_results', searchType);
        sessionStorage.setItem(queryKey, JSON.stringify(searchQuery));
        sessionStorage.setItem(resultsKey, JSON.stringify(searchResults));
      } catch (error) {
        console.error("Error saving to sessionStorage", error);
      }
    };
  }, [searchQuery, searchResults, searchType, auth.user.id]);
  
  // Handle search type change
  const handleSearchTypeChange = (newType) => {
    // DEBUG: Log search type change
    // console.log('🔄 Search type changing:', {
    //   from: searchType,
    //   to: newType,
    //   isAcademician
    // });
    
    // Only allow academicians to search for students
    if (newType === 'students' && !isAcademician) {
      console.warn('⚠️ Access denied: Only academicians can search for students');
      setError('You need to be an academician to search for students.');
      return;
    }
    
    // Load saved query and results for the new search type
    const savedQuery = getInitialState('ai_search_query', newType, '');
    const savedResults = getInitialState('ai_search_results', newType, null);
    
    // console.log('💾 Loading saved state for new search type:', {
    //   searchType: newType,
    //   hasSavedQuery: !!savedQuery,
    //   hasSavedResults: !!savedResults,
    //   savedResultsCount: savedResults?.matches?.length || 0
    // });
    
    setSearchType(newType);
    setSearchQuery(savedQuery); // Load saved query for this search type
    setSearchResults(savedResults); // Load saved results for this search type
    setError(null);
    
    // Update current view based on whether we have results
    if (savedResults && savedResults.matches && savedResults.matches.length > 0) {
      // console.log('✅ Showing preview with cached results');
      setCurrentView('preview'); // Show preview if we have results
    } else {
      // console.log('✅ Showing search interface');
      setCurrentView('search'); // Show search interface if no results
    }
  };
  
  // Handle search submission from the guided interface
  const handleSearch = async (query) => {
    // Skip if already searching or query is empty
    if (isSearching || !query || query.trim() === '') return;
    
    // Clear old results from sessionStorage before starting new search (context-aware)
    const resultsKey = getStorageKey('ai_search_results', searchType);
    sessionStorage.removeItem(resultsKey);
    
    // DEBUG: Log the search parameters
    // console.log('🔍 AI Matching Search Debug:', {
    //   query,
    //   searchType,
    //   userId: auth.user.id,
    //   storageKey: resultsKey
    // });
    
    setSearchQuery(query);
    setIsSearching(true);
    setError(null);
    setPage(1); // Reset to first page
    
    // Show the processing modal
    setShowProcessingModal(true);
    
    try {
      // DEBUG: Log the request payload
      console.log('📤 Sending request with payload:', { query, searchType });
      
      // Use the helper function to handle CSRF token refreshing if needed
      const response = await handlePossibleSessionExpiration(() => 
        axios.post(route('ai.matching.search'), { 
          query,
          searchType,
        })
      );
      
      // Process results
      if (response.data && response.data.matches) {
        // DEBUG: Log the response
        console.log('📥 Received response:', {
          searchType: response.data.searchType,
          totalMatches: response.data.total,
          matchTypes: response.data.matches.map(m => m.result_type),
          firstMatch: response.data.matches[0]
        });
        
        // Process the results based on the search type
        setSearchResults(response.data);
        // Show top matches preview after loading
        setCurrentView('preview');
      } else {
        console.error('❌ Invalid search results:', response.data);
        setError('Received invalid search results');
      }
    } catch (error) {
      console.error('Search error:', error);
      
      // Check if this is a CSRF token mismatch (419 status code)
      if (isSessionExpired(error)) {
        setError(
          'Your session has expired. Please refresh the page and try again.'
        );
      } else if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError(error.message || 'Failed to perform search. Please try again later.');
      }
    } finally {
      // Hide the processing modal
      setShowProcessingModal(false);
      setIsSearching(false);
    }
  };
  
  // Handle view all results - expand to full view
  const handleViewAllResults = () => {
    setCurrentView('full');
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Handle back to search
  const handleBackToSearch = () => {
    setCurrentView('search');
    setSearchResults(null);
    setSearchQuery('');
    setError(null);
  };
  
  // Handle collapse to preview
  const handleCollapseToPreview = () => {
    setCurrentView('preview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Load more results (pagination)
  const handleLoadMore = async () => {
    if (isLoadingMore || !searchResults || !searchResults.has_more) return;
    
    setIsLoadingMore(true);
    const nextPage = page + 1;
    
    try {
      // Use the helper function to handle CSRF token refreshing if needed
      const response = await handlePossibleSessionExpiration(() => 
        axios.post(route('ai.matching.search'), { 
          query: searchQuery,
          searchType,
          page: nextPage
        })
      );
      
      if (response.data && response.data.matches) {
        // Merge new results with existing ones
        setSearchResults(prevResults => {
          // Handle case where prevResults might be null
          if (!prevResults || !prevResults.matches) {
            return response.data;
          }
          
          return {
            ...response.data,
            matches: [
              ...prevResults.matches,
              ...response.data.matches
            ]
          };
        });
        setPage(nextPage);
      }
    } catch (error) {
      console.error('Error loading more results:', error);
      
      // Check if this is a CSRF token mismatch
      if (isSessionExpired(error)) {
        setError(
          'Your session has expired. Please refresh the page and try again.'
        );
      } else {
        setError(error.message || 'Failed to load more results. Please try again later.');
      }
    } finally {
      setIsLoadingMore(false);
    }
  };
  
  // Search tips based on search type
  const getSearchTips = () => {
    if (searchType === 'supervisor') {
      return [
        'Be specific about your research area (e.g., "Machine Learning for Medical Imaging" rather than just "AI")',
        'You can use vague queries like "recommend supervisors for me" to get results based on your profile',
        'Click on suggested research terms to quickly add them to your search'
      ];
    } else if (searchType === 'students') {
      return [
        'Search for specific research topics to find students interested in those areas',
        'Be specific about methodologies or techniques you\'re looking for',
        'You can search for broader fields to get a wider range of potential students'
      ];
    } else if (searchType === 'collaborators') {
      return [
        'Search for research topics that complement your expertise',
        'Look for interdisciplinary opportunities by searching for topics outside your direct field',
        'Use specific methodologies or techniques to find experts in those areas'
      ];
    }
    
    return [];
  };
  
  // Placeholder text based on search type
  const getPlaceholderText = () => {
    if (searchType === 'supervisor') {
      return 'e.g., Artificial Intelligence in Healthcare, Design Science Research...';
    } else if (searchType === 'students') {
      return 'e.g., Machine Learning, Quantum Computing, Climate Science...';
    } else if (searchType === 'collaborators') {
      return 'e.g., Interdisciplinary AI, Sustainable Development, Data Science...';
    }
    
    return 'Enter your search query...';
  };
  
  // Page title based on search type
  const getPageTitle = () => {
    if (searchType === 'supervisor') {
      return 'Find Your Perfect Research Supervisor';
    } else if (searchType === 'students') {
      return 'Find Students for Your Research Projects';
    } else if (searchType === 'collaborators') {
      return 'Find Research Collaborators';
    }
    
    return 'AI Matching';
  };
  
  // Search description based on search type
  const getSearchDescription = () => {
    if (searchType === 'supervisor') {
      return 'Enter your research interest, topic, or field of study below and we\'ll match you with supervisors who have relevant expertise.';
    } else if (searchType === 'students') {
      return 'Enter research topics or methods you\'re interested in to find students who may be suitable for your research projects.';
    } else if (searchType === 'collaborators') {
      return 'Enter research areas or methodologies to find potential academician collaborators for joint research projects.';
    }
    
    return 'Enter your search query below to find matches.';
  };
  
  // Define loading states for MultiStepLoader
  const loadingStates = [
    { text: "Analyzing your query..." },
    { text: "Converting to semantic vectors..." },
    { text: "Searching database for potential matches..." },
    { text: "Generating personalized insights with AI..." },
    { text: "Finalizing results..." },
  ];
  
  // AI Insight Modal component
  const AIInsightModal = ({ insight, onClose }) => {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        onClick={(e) => {
          // Close modal only if the click is on the backdrop itself
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
          <div className="flex items-center mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            <h3 className="text-xl font-bold text-gray-800">AI Match Insight</h3>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-gray-700 whitespace-pre-line">{insight}</p>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <MainLayout title="AI Matching">
      {/* MultiStepLoader for AI Processing */}
      <MultiStepLoader 
        loadingStates={loadingStates} 
        loading={showProcessingModal}
        duration={2000}
        loop={false}
      />
      
      {/* AI Insight Modal */}
      {isInsightModalOpen && (
        <AIInsightModal 
          insight={currentInsight} 
          onClose={() => setIsInsightModalOpen(false)} 
        />
      )}
      
      <div className="w-full">
        {/* View: SEARCH - Initial search interface */}
        {currentView === 'search' && (
          <div className="min-h-screen bg-white py-8">
          <GuidedSearchInterface
            onSearch={handleSearch}
            researchOptions={researchOptions}
            isSearching={isSearching}
            initialQuery={searchQuery}
            pageTitle={getPageTitle()}
            searchDescription={getSearchDescription()}
            placeholder={getPlaceholderText()}
            tips={getSearchTips()}
            error={error}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
              searchType={searchType}
              onSearchTypeChange={handleSearchTypeChange}
              isAcademician={isAcademician}
              userId={auth.user.id}
            />
          </div>
        )}
          
        {/* View: PREVIEW - Top 5 Matches Carousel */}
        {currentView === 'preview' && searchResults && searchResults.matches && (
          <div className="min-h-screen bg-white py-8">
              {/* Back to Search Button */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
                <button
                  onClick={handleBackToSearch}
                  className="flex items-center text-gray-600 hover:text-gray-900 font-medium transition-colors group"
                >
                  <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Search
                </button>
              </div>

              <TopMatchesPreview
                searchResults={searchResults}
                universitiesList={universities}
                researchOptions={researchOptions}
                users={users}
                onViewAllResults={handleViewAllResults}
                onQuickInfoClick={() => {}} // Handled in ResultsGrid modal
                onRecommendClick={() => {}} // Handled in ResultsGrid modal
                onShowInsight={(insight) => {
                  setCurrentInsight(insight);
                  setIsInsightModalOpen(true);
                }}
              />
          </div>
        )}

        {/* View: FULL - All Results with Filters */}
        {currentView === 'full' && searchResults && searchResults.matches && (
            <div className="min-h-screen bg-white">
              {/* Premium Header Section */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                  {/* Back Button - Premium Style */}
                  <button
                    onClick={handleCollapseToPreview}
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-all duration-300 group hover:-translate-x-1"
                  >
                    <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Back to Top 5</span>
                  </button>
                  
                  {/* Title Section with Gradient Line */}
                  <div className="flex-1 sm:text-right">
                    <div className="flex items-center justify-start sm:justify-end gap-3 mb-2">
                      <h2 className="text-4xl font-bold text-gray-900">All Results</h2>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        {searchResults.total_count || searchResults.total || searchResults.matches.length}
                      </span>
                    </div>
                    <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full sm:ml-auto"></div>
                    <p className="text-sm text-gray-500 mt-3">
                      Matches for "{searchResults.query}"
                    </p>
                  </div>
                </div>
              </div>

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <div className="flex flex-col lg:flex-row gap-8">
              {/* Filters - Desktop (Side) with Glass Morphism */}
              <div className="hidden lg:block w-full lg:w-1/4 xl:w-1/5">
                    <div className="sticky top-24 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/50 p-6">
                <FilterPanel
                  searchType={searchType}
                  searchResults={searchResults}
                  universities={universities}
                  faculties={faculties}
                  researchOptions={researchOptions}
                  skills={skills}
                  selectedArea={selectedArea}
                  setSelectedArea={setSelectedArea}
                  selectedUniversity={selectedUniversity}
                  setSelectedUniversity={setSelectedUniversity}
                  selectedAvailability={selectedAvailability}
                  setSelectedAvailability={setSelectedAvailability}
                  selectedSkills={selectedSkills}
                  setSelectedSkills={setSelectedSkills}
                />
                    </div>
              </div>
              
              {/* Filters - Mobile */}
              <div className="lg:hidden">
                <FilterPanel
                  searchType={searchType}
                  searchResults={searchResults}
                  universities={universities}
                  faculties={faculties}
                  researchOptions={researchOptions}
                  skills={skills}
                  selectedArea={selectedArea}
                  setSelectedArea={setSelectedArea}
                  selectedUniversity={selectedUniversity}
                  setSelectedUniversity={setSelectedUniversity}
                  selectedAvailability={selectedAvailability}
                  setSelectedAvailability={setSelectedAvailability}
                  selectedSkills={selectedSkills}
                  setSelectedSkills={setSelectedSkills}
                  isOpen={showFilters}
                  toggleOpen={setShowFilters}
                />
              </div>
              
                  {/* Results Grid */}
                <div className="w-full lg:w-3/4 xl:w-4/5">
                  <ResultsGrid
                    searchType={searchType}
                    searchResults={searchResults}
                    selectedArea={selectedArea}
                    selectedUniversity={selectedUniversity}
                    selectedAvailability={selectedAvailability}
                    selectedSkills={selectedSkills}
                    onLoadMore={handleLoadMore}
                    isLoadingMore={isLoadingMore}
                    universitiesList={universities}
                    faculties={faculties}
                    researchOptions={researchOptions}
                    users={users}
                    skills={skills}
                    onShowInsight={(insight) => {
                      setCurrentInsight(insight);
                      setIsInsightModalOpen(true);
                    }}
                  />
                  </div>
                </div>
                </div>
            </div>
          )}
      </div>
    </MainLayout>
  );
}