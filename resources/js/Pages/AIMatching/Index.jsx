import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import GuidedSearchInterface from '@/Components/GuidedSearchInterface';
import ResultsGrid from './Components/ResultsGrid';
import SearchTypeSelector from './Components/SearchTypeSelector';
import FilterPanel from './Components/FilterPanel';
import { FaFilter } from 'react-icons/fa';
import axios from 'axios';
import useRoles from '@/Hooks/useRoles';

export default function Index({ auth, universities, faculties, users, researchOptions, skills }) {
  const { isAdmin, isPostgraduate, isUndergraduate, isFacultyAdmin, isAcademician } = useRoles();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('supervisor'); // Default: supervisor
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Filter states
  const [selectedArea, setSelectedArea] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  // Handle search type change
  const handleSearchTypeChange = (newType) => {
    // Only allow academicians to search for students and collaborators
    if ((newType === 'students' || newType === 'collaborators') && !isAcademician) {
      setError('You need to be an academician to search for students or collaborators.');
      return;
    }
    
    setSearchType(newType);
    setSearchResults(null); // Clear previous results when changing search type
    setError(null);
  };
  
  // Handle search submission from the guided interface
  const handleSearch = async (query) => {
    // Skip if already searching or query is empty
    if (isSearching || !query || query.trim() === '') return;
    
    setSearchQuery(query);
    setIsSearching(true);
    setError(null);
    setPage(1); // Reset to first page
    
    try {
      const response = await axios.post(route('ai.matching.search'), { 
        query,
        searchType,
      });
      
      // Process results
      if (response.data && response.data.matches) {
        console.log('Search results:', response.data);
        // Process the results based on the search type
        setSearchResults(response.data);
      } else {
        setError('Received invalid search results');
      }
    } catch (error) {
      console.error('Search error:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('Failed to perform search. Please try again later.');
      }
    } finally {
      setIsSearching(false);
    }
  };
  
  // Load more results (pagination)
  const handleLoadMore = async () => {
    if (isLoadingMore || !searchResults || !searchResults.has_more) return;
    
    setIsLoadingMore(true);
    const nextPage = page + 1;
    
    try {
      const response = await axios.post(route('ai.matching.search'), { 
        query: searchQuery,
        searchType,
        page: nextPage
      });
      
      if (response.data && response.data.matches) {
        // Merge new results with existing ones
        setSearchResults(prevResults => ({
          ...response.data,
          matches: [
            ...prevResults.matches,
            ...response.data.matches
          ]
        }));
        setPage(nextPage);
      }
    } catch (error) {
      console.error('Error loading more results:', error);
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
      return 'Enter research areas or methodologies to find potential collaborators for joint research projects.';
    }
    
    return 'Enter your search query below to find matches.';
  };
  
  return (
    <MainLayout title="AI Matching" isPostgraduate={isPostgraduate} isUndergraduate={isUndergraduate} isFacultyAdmin={isFacultyAdmin}>
      <Head>
        <title>AI Matching - Nexscholar</title>
        <meta name="description" content="Find academic matches using AI-powered semantic search" />
      </Head>
      
      <div className="bg-white overflow-hidden shadow-sm rounded-lg">
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
          >
            {/* Search Type Selection */}
            <SearchTypeSelector
              currentType={searchType}
              onTypeChange={handleSearchTypeChange}
              isAcademician={isAcademician}
            />
          </GuidedSearchInterface>
          
          {/* Mobile Filter Toggle Button */}
          {searchResults && searchResults.matches && searchResults.matches.length > 0 && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="fixed bottom-8 right-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg lg:hidden"
            >
              <FaFilter className="text-xl" />
            </button>
          )}
          
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
              
              {/* Filters - Mobile (Top, conditional) */}
              {showFilters && (
                <div className="lg:hidden w-full">
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
                    onClose={() => setShowFilters(false)}
                  />
                </div>
              )}
              
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
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
} 