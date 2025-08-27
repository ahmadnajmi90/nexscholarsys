import React, { useState, useEffect, useRef } from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import GuidedSearchInterface from './Components/GuidedSearchInterface';
import ResultsGrid from './Components/ResultsGrid';
import SearchTypeSelector from './Components/SearchTypeSelector';
import FilterPanel from './Components/FilterPanel';
import { FaFilter, FaLightbulb, FaRobot, FaBrain, FaSearch, FaDatabase } from 'react-icons/fa';
import axios from 'axios';
import useRoles from '@/Hooks/useRoles';
import { isSessionExpired, handlePossibleSessionExpiration } from '@/Utils/csrfHelper';
import { Sparkles } from 'lucide-react';

export default function Index({ auth, universities, faculties, users, researchOptions, skills }) {
  const { isAdmin, isPostgraduate, isUndergraduate, isFacultyAdmin, isAcademician } = useRoles();
  
  // Helper function to get initial state from sessionStorage
  const getInitialState = (key, defaultValue) => {
    try {
      const savedState = sessionStorage.getItem(key);
      return savedState ? JSON.parse(savedState) : defaultValue;
    } catch (error) {
      console.error("Error reading from sessionStorage", error);
      return defaultValue;
    }
  };
  
  const [searchQuery, setSearchQuery] = useState(() => getInitialState('ai_search_query', ''));
  const [searchType, setSearchType] = useState('supervisor'); // Default: supervisor
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(() => getInitialState('ai_search_results', null));
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  
  // New state variables for AI Processing Modal
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const processingInterval = useRef(null);
  
  // New state variables for AI Insight Modal
  const [isInsightModalOpen, setIsInsightModalOpen] = useState(false);
  const [currentInsight, setCurrentInsight] = useState('');
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Filter states
  const [selectedArea, setSelectedArea] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  // Save state to sessionStorage when navigating away
  useEffect(() => {
    // This cleanup function runs when the user navigates away
    return () => {
      try {
        sessionStorage.setItem('ai_search_query', JSON.stringify(searchQuery));
        sessionStorage.setItem('ai_search_results', JSON.stringify(searchResults));
      } catch (error) {
        console.error("Error saving to sessionStorage", error);
      }
    };
  }, [searchQuery, searchResults]);
  
  // Handle search type change
  const handleSearchTypeChange = (newType) => {
    // Only allow academicians to search for students
    if (newType === 'students' && !isAcademician) {
      setError('You need to be an academician to search for students.');
      return;
    }
    
    setSearchType(newType);
    setSearchQuery(''); // Clear search query when changing search type
    setSearchResults(null); // Clear previous results when changing search type
    setError(null);
    
    // Clear sessionStorage when changing search type
    try {
      sessionStorage.removeItem('ai_search_query');
      sessionStorage.removeItem('ai_search_results');
    } catch (error) {
      console.error("Error clearing sessionStorage", error);
    }
  };
  
  // Handle search submission from the guided interface
  const handleSearch = async (query) => {
    // Skip if already searching or query is empty
    if (isSearching || !query || query.trim() === '') return;
    
    // Clear old results from sessionStorage before starting new search
    sessionStorage.removeItem('ai_search_results');
    
    setSearchQuery(query);
    setIsSearching(true);
    setError(null);
    setPage(1); // Reset to first page
    
    // Show the processing modal
    setShowProcessingModal(true);
    setProcessingStep(0);
    
    // Set up the processing steps animation
    const processingSteps = [
      "Analyzing your query...",
      "Converting to semantic vectors...",
      "Searching database for potential matches...",
      "Generating personalized insights with AI...",
      "Finalizing results..."
    ];
    
    // Start cycling through processing steps - only advance until the last step
    processingInterval.current = setInterval(() => {
      setProcessingStep(prevStep => {
        // If we are already at the last message, don't advance further
        if (prevStep >= processingSteps.length - 1) {
          return prevStep;
        }
        // Otherwise, go to the next message
        return prevStep + 1;
      });
    }, 2000); // Change message every 2 seconds
    
    try {
      // Use the helper function to handle CSRF token refreshing if needed
      const response = await handlePossibleSessionExpiration(() => 
        axios.post(route('ai.matching.search'), { 
          query,
          searchType,
        })
      );
      
      // Process results
      if (response.data && response.data.matches) {
        // Process the results based on the search type
        setSearchResults(response.data);
      } else {
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
      // Clear the interval and hide the processing modal
      if (processingInterval.current) {
        clearInterval(processingInterval.current);
        processingInterval.current = null;
      }
      setShowProcessingModal(false);
      setIsSearching(false);
    }
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
  
  // AI Processing Modal component
  const AIProcessingModal = () => {
    // Processing steps messages
    const processingSteps = [
      { text: "Analyzing your query...", icon: <FaSearch className="text-blue-500" /> },
      { text: "Converting to semantic vectors...", icon: <FaBrain className="text-purple-500" /> },
      { text: "Searching database for potential matches...", icon: <FaDatabase className="text-green-500" /> },
      { text: "Generating personalized insights with AI...", icon: <Sparkles className="w-4 h-4 mr-2" /> },
      { text: "Finalizing results...", icon: <FaRobot className="text-red-500" /> }
    ];
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="flex flex-col items-center">
            {/* Animated AI Icon */}
            <div className="w-20 h-20 mb-6 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                {processingSteps[processingStep].icon}
              </div>
              <div className="absolute inset-0 border-t-4 border-blue-500 rounded-full animate-spin opacity-25"></div>
            </div>
            
            {/* Processing Step Text */}
            <h3 className="text-xl font-bold mb-2 text-gray-800">AI Processing</h3>
            <p className="text-gray-600 text-center mb-4 min-h-[24px]">
              {processingSteps[processingStep].text}
            </p>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
                style={{ width: `${(processingStep + 1) * 20}%` }}
              ></div>
            </div>
            
            <p className="text-sm text-gray-500 italic">
              Our AI is working to find the best matches for your query...
            </p>
          </div>
        </div>
      </div>
    );
  };
  
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
    <MainLayout title="AI Matching" isPostgraduate={isPostgraduate} isUndergraduate={isUndergraduate} isFacultyAdmin={isFacultyAdmin}>
      {/* AI Processing Modal */}
      {showProcessingModal && <AIProcessingModal />}
      
      {/* AI Insight Modal */}
      {isInsightModalOpen && (
        <AIInsightModal 
          insight={currentInsight} 
          onClose={() => setIsInsightModalOpen(false)} 
        />
      )}
      
      <div className="bg-white">
        <div className="p-6 pb-16">
          {/* Guided Search Interface with Search Type Selector inside */}
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
          >
            {/* Search Type Selection */}
            <SearchTypeSelector
              currentType={searchType}
              onTypeChange={handleSearchTypeChange}
              isAcademician={isAcademician}
            />
          </GuidedSearchInterface>
          
          {/* Results and Filters */}
          {searchResults && searchResults.matches && (
            <div className="mt-8 flex flex-col lg:flex-row gap-6">
              {/* Filters - Desktop (Side) */}
              <div className="hidden lg:block w-full lg:w-1/4 xl:w-1/5">
                <FilterPanel
                  searchType={searchType}
                  searchResults={searchResults}
                  universities={universities}
                  faculties={faculties}
                  researchOptions={researchOptions}
                  selectedArea={selectedArea}
                  setSelectedArea={setSelectedArea}
                  selectedUniversity={selectedUniversity}
                  setSelectedUniversity={setSelectedUniversity}
                  selectedAvailability={selectedAvailability}
                  setSelectedAvailability={setSelectedAvailability}
                />
              </div>
              
              {/* Filters - Mobile */}
              <div className="lg:hidden">
                <FilterPanel
                  searchType={searchType}
                  searchResults={searchResults}
                  universities={universities}
                  faculties={faculties}
                  researchOptions={researchOptions}
                  selectedArea={selectedArea}
                  setSelectedArea={setSelectedArea}
                  selectedUniversity={selectedUniversity}
                  setSelectedUniversity={setSelectedUniversity}
                  selectedAvailability={selectedAvailability}
                  setSelectedAvailability={setSelectedAvailability}
                  isOpen={showFilters}
                  toggleOpen={setShowFilters}
                />
              </div>
              
              {/* Results */}
                <div className="w-full lg:w-3/4 xl:w-4/5">
                  <ResultsGrid
                    searchType={searchType}
                    searchResults={searchResults}
                    selectedArea={selectedArea}
                    selectedUniversity={selectedUniversity}
                    selectedAvailability={selectedAvailability}
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
          )}
        </div>
      </div>
    </MainLayout>
  );
}