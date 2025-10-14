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
  const [selectedSkills, setSelectedSkills] = useState([]);
  
  // Supervision-related state (for postgraduate users searching supervisors)
  const [supervisionRequests, setSupervisionRequests] = useState([]);
  const [activeRelationship, setActiveRelationship] = useState(null);
  const [loadingSupervisionData, setLoadingSupervisionData] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  
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
    // DEBUG: Log search type change - ENABLE THIS FOR DEBUGGING
    console.log('🔄 Search type changing:', {
      from: searchType,
      to: newType,
      isAcademician
    });
    
    // Only allow academicians to search for students
    if (newType === 'students' && !isAcademician) {
      console.warn('⚠️ Access denied: Only academicians can search for students');
      setError('You need to be an academician to search for students.');
      return;
    }
    
    // Load saved query and results for the new search type
    const savedQuery = getInitialState('ai_search_query', newType, '');
    const savedResults = getInitialState('ai_search_results', newType, null);
    
    console.log('💾 Loading saved state for new search type:', {
      searchType: newType,
      hasSavedQuery: !!savedQuery,
      hasSavedResults: !!savedResults,
      savedResultsCount: savedResults?.matches?.length || 0
    });
    
    setSearchType(newType);
    setSearchQuery(savedQuery); // Load saved query for this search type
    setSearchResults(savedResults); // Load saved results for this search type
    setError(null);
    
    // Update current view based on whether we have results
    if (savedResults && savedResults.matches && savedResults.matches.length > 0) {
      console.log('✅ Showing preview with cached results');
      setCurrentView('preview'); // Show preview if we have results
    } else {
      console.log('✅ Showing search interface');
      setCurrentView('search'); // Show search interface if no results
    }
  };
  
  // Fetch supervision data for postgraduate users searching supervisors
  useEffect(() => {
    const fetchSupervisionData = async () => {
      // Only fetch if user is postgraduate and searching for supervisors
      if (!isPostgraduate || searchType !== 'supervisor') {
        setSupervisionRequests([]);
        setActiveRelationship(null);
        return;
      }
      
      setLoadingSupervisionData(true);
      try {
        // Fetch supervision requests
        const requestsResponse = await axios.get(route('supervision.requests.index'));
        setSupervisionRequests(requestsResponse.data?.data || []);
        
        // Fetch active relationship
        const relationshipResponse = await axios.get(route('supervision.relationships.index'));
        const relationships = relationshipResponse.data?.data || [];
        const active = relationships.find(r => r.status === 'active' && r.role === 'main');
        setActiveRelationship(active || null);
      } catch (error) {
        console.error('Error fetching supervision data:', error);
        // Silent fail - supervision features will be disabled
      } finally {
        setLoadingSupervisionData(false);
      }
    };
    
    fetchSupervisionData();
  }, [isPostgraduate, searchType]);
  
  // Callback to refresh supervision data after request submission
  const handleRequestSubmitted = () => {
    // Refetch supervision data
    if (isPostgraduate && searchType === 'supervisor') {
      const fetchSupervisionData = async () => {
        try {
          const requestsResponse = await axios.get(route('supervision.requests.index'));
          setSupervisionRequests(requestsResponse.data?.data || []);
          
          const relationshipResponse = await axios.get(route('supervision.relationships.index'));
          const relationships = relationshipResponse.data?.data || [];
          const active = relationships.find(r => r.status === 'active' && r.role === 'main');
          setActiveRelationship(active || null);
        } catch (error) {
          console.error('Error refreshing supervision data:', error);
        }
      };
      fetchSupervisionData();
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
      // DEBUG: Log the request payload - ALWAYS ENABLED FOR DEBUGGING
      console.log('📤 Sending search request:', { 
        query, 
        searchType,
        currentSearchTypeState: searchType,
        timestamp: new Date().toISOString()
      });
      
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
          <div className="h-[calc(100vh-100px)] sm:h-[calc(100vh-110px)] bg-white overflow-hidden flex items-start justify-center pt-[calc(50vh-180px)] sm:pt-[calc(50vh-200px)]">
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
              <div className="max-w-7xl mx-auto px-4 sm:px-0 md:px-6 lg:px-8 xl:px-0 mb-6">
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
                searchType={searchType}
                supervisionRequests={supervisionRequests}
                activeRelationship={activeRelationship}
                onRequestSubmitted={handleRequestSubmitted}
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
              {/* Premium Header Section with Filter Button */}
              <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-4 sm:pt-6 md:pt-8 pb-4 sm:pb-6 md:pb-8">
                {/* Mobile: Stack vertically | Tablet+: Horizontal layout */}
                <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-12 sm:gap-4 sm:items-center">
                  {/* Back Button - Mobile: Full width | Desktop: Left aligned */}
                  <div className="sm:col-span-3 lg:col-span-2">
                    <button
                      onClick={handleCollapseToPreview}
                      className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium 
                               transition-all duration-300 group text-sm sm:text-base"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      <span className="hidden xs:inline">Back to Top 5</span>
                      <span className="xs:hidden">Back</span>
                    </button>
                  </div>
                  
                  {/* Title Section - Centered on all screens */}
                  <div className="sm:col-span-6 lg:col-span-8 text-center">
                    <div className="flex flex-col xs:flex-row items-center justify-center gap-2 mb-2">
                      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">All Results</h2>
                      <span className="inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold 
                                     bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        {searchResults.total_count || searchResults.total || searchResults.matches.length}
                      </span>
                    </div>
                    <div className="h-0.5 sm:h-1 w-12 sm:w-16 md:w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"></div>
                    <p className="text-xs sm:text-sm text-gray-500 mt-2 px-2 sm:px-4 line-clamp-1">
                      Matches for "{searchResults.query}"
                    </p>
                  </div>

                  {/* Filter Button - Mobile: Full width | Desktop: Right aligned */}
                  <div className="sm:col-span-3 lg:col-span-2 flex justify-end">
                    <button
                      onClick={() => setIsFilterModalOpen(true)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 
                               px-4 sm:px-5 py-2.5 sm:py-3 
                               bg-gradient-to-r from-blue-600 to-purple-600 
                               hover:from-blue-700 hover:to-purple-700 
                               active:scale-95 sm:active:scale-100
                               text-white font-semibold rounded-xl 
                               shadow-lg hover:shadow-xl 
                               transition-all duration-300 sm:hover:scale-105 
                               group relative touch-manipulation"
                    >
                      <FaFilter className="text-base sm:text-lg group-hover:rotate-12 transition-transform" />
                      <span className="text-sm sm:text-base">Filters</span>
                      {/* Active Filter Count Badge */}
                      {(selectedArea.length > 0 || selectedUniversity.length > 0 || selectedSkills.length > 0 || selectedAvailability) && (
                        <span className="absolute -top-1.5 sm:-top-2 -right-1.5 sm:-right-2 
                                       bg-red-500 text-white text-xs font-bold rounded-full 
                                       h-5 w-5 sm:h-6 sm:w-6 
                                       flex items-center justify-center animate-pulse">
                          {selectedArea.length + selectedUniversity.length + selectedSkills.length + (selectedAvailability ? 1 : 0)}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Full-Width Results Section */}
              <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pb-12 sm:pb-16">
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
                  supervisionRequests={supervisionRequests}
                  activeRelationship={activeRelationship}
                  onRequestSubmitted={handleRequestSubmitted}
                  onShowInsight={(insight) => {
                    setCurrentInsight(insight);
                    setIsInsightModalOpen(true);
                  }}
                />
              </div>

              {/* Filter Modal */}
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
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
              />
            </div>
          )}
      </div>
    </MainLayout>
  );
}