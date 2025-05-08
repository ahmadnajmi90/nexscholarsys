import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import SupervisorFilterGrid from '@/Components/SupervisorFilterGrid';
import GuidedSearchInterface from '@/Components/GuidedSearchInterface';
import ProgressiveLoadingResults from '@/Components/ProgressiveLoadingResults';
import FilterDropdown from '@/Components/FilterDropdown';
import { FaFilter } from 'react-icons/fa';
import axios from 'axios';
import useRoles from '@/Hooks/useRoles';

export default function FindSupervisor({ auth, universities, faculties, users, researchOptions }) {
  const { isAdmin, isPostgraduate, isUndergraduate, isFacultyAdmin, isAcademician } = useRoles();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Filter states
  const [selectedArea, setSelectedArea] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState([]);
  const [selectedSupervisorAvailability, setSelectedSupervisorAvailability] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  // Handle search submission from the guided interface
  const handleSearch = async (query) => {
    // Skip if already searching or query is empty
    if (isSearching || !query || query.trim() === '') return;
    
    setSearchQuery(query);
    setIsSearching(true);
    setError(null);
    setPage(1); // Reset to first page
    
    try {
      const response = await axios.post(route('supervisor.search'), { query });
      
      // Process results
      if (response.data && response.data.matches) {
        console.log('Search results:', response.data);
        // Add match_score to each result if not present
        const processedResults = {
          ...response.data,
          matches: response.data.matches.map(match => ({
            ...match,
            score: match.score || 0.5, // Default score if none provided
          }))
        };
        setSearchResults(processedResults);
      } else {
        setError('Received invalid search results');
      }
    } catch (error) {
      console.error('Search error:', error);
      setError('Failed to perform search. Please try again later.');
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
      const response = await axios.post(route('supervisor.search'), { 
        query: searchQuery,
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
  
  // Handle filtered results
  const getFilteredResults = () => {
    if (!searchResults || !searchResults.matches) return [];
    
    return searchResults.matches.filter(match => {
      const profile = match.academician;
      
      // Research expertise filter
      const hasSelectedArea = selectedArea.length === 0 || 
        (Array.isArray(profile.research_expertise) && 
          profile.research_expertise.some(area => selectedArea.includes(area)));
      
      // University filter
      const profileUniversity = profile.university ? profile.university.toString() : "";
      const hasSelectedUniversity = selectedUniversity.length === 0 || 
        selectedUniversity.includes(profileUniversity);
      
      // Supervisor availability filter
      let hasSelectedAvailability = true;
      if (selectedSupervisorAvailability !== "") {
        const availVal = profile.availability_as_supervisor;
        const normalizedAvail = availVal === true || availVal === "1" || availVal === 1 ? "1" : "0";
        hasSelectedAvailability = normalizedAvail === selectedSupervisorAvailability;
      }
      
      return hasSelectedArea && hasSelectedUniversity && hasSelectedAvailability;
    });
  };
  
  // Prepare filter options from search results
  const getFilterOptions = () => {
    if (!searchResults || !searchResults.matches) {
      return {
        researchAreas: [],
        universities: []
      };
    }
    
    // Extract unique research expertise IDs
    const uniqueResearchIds = new Set();
    searchResults.matches.forEach(match => {
      if (Array.isArray(match.academician.research_expertise)) {
        match.academician.research_expertise.forEach(expertise => {
          uniqueResearchIds.add(expertise);
        });
      }
    });
    
    // Create research options with labels
    const researchAreas = Array.from(uniqueResearchIds).map(areaId => {
      const matchedOption = researchOptions.find(
        option => `${option.field_of_research_id}-${option.research_area_id}-${option.niche_domain_id}` === areaId
      );
      
      if (matchedOption) {
        return {
          value: areaId,
          label: `${matchedOption.field_of_research_name} - ${matchedOption.research_area_name} - ${matchedOption.niche_domain_name}`
        };
      } else {
        return {
          value: areaId,
          label: `${areaId}`
        };
      }
    });
    
    // Extract unique university IDs
    const uniqueUniversityIds = new Set();
    searchResults.matches.forEach(match => {
      if (match.academician.university) {
        uniqueUniversityIds.add(match.academician.university.toString());
      }
    });
    
    // Create university options with labels
    const universityOptions = Array.from(uniqueUniversityIds).map(id => {
      const uni = universities.find(u => u.id.toString() === id);
      return {
        value: id,
        label: uni ? uni.short_name : "Unknown University"
      };
    });
    
    return {
      researchAreas,
      universities: universityOptions
    };
  };
  
  const filterOptions = getFilterOptions();
  const filteredResults = searchResults ? {
    ...searchResults,
    matches: getFilteredResults(),
    total: getFilteredResults().length
  } : null;
  
  return (
    <MainLayout title="Find a Supervisor" isPostgraduate={isPostgraduate} isUndergraduate={isUndergraduate} isFacultyAdmin={isFacultyAdmin}>
      <Head>
        <title>Find a Supervisor - Nexscholar</title>
        <meta name="description" content="Search for academic supervisors based on your research interests" />
      </Head>
      
      <div className="bg-white overflow-hidden shadow-sm rounded-lg">
        <div className="p-6 pb-16">
          {/* Guided Search Interface */}
          <GuidedSearchInterface
            onSearch={handleSearch}
            researchOptions={researchOptions}
            isSearching={isSearching}
            initialQuery={searchQuery}
          />
          
          {/* Mobile Filter Toggle Button */}
          {searchResults && searchResults.total > 0 && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="fixed bottom-8 right-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg lg:hidden"
            >
              <FaFilter className="text-xl" />
            </button>
          )}
          
          {/* Results and Filters */}
          {(searchResults || isSearching) && (
            <div className="mt-10 flex flex-col lg:flex-row gap-6">
              {/* Sidebar Filters - Desktop */}
              {searchResults && searchResults.total > 0 && (
                <div className={`lg:block lg:w-1/4 bg-gray-50 p-4 rounded-lg shadow-sm ${
                  showFilters ? 'block fixed inset-0 z-50 bg-white overflow-auto p-6' : 'hidden'
                }`}>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Refine Results</h2>
                    <button 
                      onClick={() => setShowFilters(false)}
                      className="text-gray-500 hover:text-gray-700 lg:hidden"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    <FilterDropdown
                      label="Field of Research"
                      options={filterOptions.researchAreas}
                      selectedValues={selectedArea}
                      setSelectedValues={setSelectedArea}
                    />
                    
                    <FilterDropdown
                      label="University"
                      options={filterOptions.universities}
                      selectedValues={selectedUniversity}
                      setSelectedValues={setSelectedUniversity}
                    />
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mt-4 mb-2">
                        Available As Supervisor
                      </label>
                      <select
                        className="w-full p-2 border border-gray-300 rounded"
                        value={selectedSupervisorAvailability}
                        onChange={(e) => setSelectedSupervisorAvailability(e.target.value)}
                      >
                        <option value="">All</option>
                        <option value="1">Yes</option>
                        <option value="0">No</option>
                      </select>
                    </div>
                    
                    <div className="pt-4 lg:hidden">
                      <button
                        onClick={() => setShowFilters(false)}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Search Results */}
              <div className={`${searchResults && searchResults.total > 0 ? 'lg:w-3/4' : 'w-full'}`}>
                <ProgressiveLoadingResults
                  searchResults={filteredResults || searchResults}
                  universitiesList={universities}
                  faculties={faculties}
                  users={users}
                  researchOptions={researchOptions}
                  searchQuery={searchQuery}
                  isSearching={isSearching}
                  isLoadingMore={isLoadingMore}
                  onLoadMore={handleLoadMore}
                />
              </div>
            </div>
          )}
          
          {/* Error message */}
          {error && !isSearching && (
            <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
} 