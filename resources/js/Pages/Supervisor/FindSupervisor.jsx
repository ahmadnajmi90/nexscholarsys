import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import SupervisorFilterGrid from '@/Components/SupervisorFilterGrid';
import { FaSearch, FaLightbulb } from 'react-icons/fa';
import axios from 'axios';
import useRoles from '@/Hooks/useRoles';

export default function FindSupervisor({ auth, universities, faculties, users, researchOptions }) {
  const { isAdmin, isPostgraduate, isUndergraduate, isFacultyAdmin, isAcademician } = useRoles();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (searchQuery.trim().length < 3) {
      setError('Please enter at least 3 characters to search');
      return;
    }
    
    setIsSearching(true);
    setError(null);
    
    try {
      const response = await axios.post(route('supervisor.search'), { query: searchQuery });
      
      // Log for debugging
      if (response.data && response.data.matches && response.data.matches.length > 0) {
        console.log('Sample profile data:', response.data.matches[0].academician);
        console.log('Research options:', researchOptions);
      }
      
      setSearchResults(response.data);
    } catch (error) {
      console.error('Search error:', error);
      setError('Failed to perform search. Please try again later.');
    } finally {
      setIsSearching(false);
    }
  };
  
  return (
    <MainLayout title="Find a Supervisor" isPostgraduate={isPostgraduate} isUndergraduate={isUndergraduate} isFacultyAdmin={isFacultyAdmin}>
      <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
        <div className="p-6">
          <div className="mb-8 text-center max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Find Your Perfect Research Supervisor</h1>
            <p className="text-gray-600">
              Enter your research interest, topic, or field of study below and we'll match you 
              with supervisors who have relevant expertise.
            </p>
          </div>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-8">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden shadow-sm">
              <input
                type="text"
                placeholder="e.g., Artificial Intelligence in Healthcare, Design Science Research..."
                className="flex-grow px-4 py-3 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                minLength={3}
              />
              <button
                type="submit"
                className={`bg-blue-600 text-white px-6 py-3 flex items-center ${isSearching ? 'opacity-70' : 'hover:bg-blue-700'}`}
                disabled={isSearching}
              >
                {isSearching ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    Searching...
                  </>
                ) : (
                  <>
                    <FaSearch className="mr-2" />
                    Search
                  </>
                )}
              </button>
            </div>
            {error && (
              <p className="text-red-500 mt-2 text-center">{error}</p>
            )}
          </form>
          
          {/* Search Results Area */}
          {searchResults && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <FaLightbulb className="text-yellow-500 mr-2" />
                  Supervisor Matches for "{searchResults.query}"
                </h2>
                <span className="text-gray-500">
                  {searchResults.total} match{searchResults.total !== 1 ? 'es' : ''} found
                </span>
              </div>
              
              {searchResults.total > 0 ? (
                <SupervisorFilterGrid 
                  profilesData={searchResults.matches.map(match => {
                    // Ensure we have required fields in the correct format
                    return {
                      ...match.academician,
                      ai_insight: match.ai_insights,
                      // Make sure research_expertise is an array
                      research_expertise: Array.isArray(match.academician.research_expertise) 
                        ? match.academician.research_expertise 
                        : [],
                      // Ensure availability_as_supervisor is present
                      availability_as_supervisor: match.academician.availability_as_supervisor || 0
                    };
                  })}
                  universitiesList={universities}
                  faculties={faculties}
                  users={users}
                  researchOptions={researchOptions}
                  searchQuery={searchResults.query}
                />
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <FaSearch className="text-gray-400 text-5xl mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 mb-2">No matching supervisors found</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Try broadening your search terms or exploring different research areas.
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* Initial State - Guidance */}
          {!searchResults && !isSearching && (
            <div className="border-t border-gray-200 pt-8 mt-8">
              <div className="max-w-3xl mx-auto">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <FaLightbulb className="text-yellow-500 mr-2" />
                  Tips for finding the right supervisor
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-700 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-1 flex-shrink-0">1</span>
                    <span>Be specific about your research area (e.g., "Machine Learning for Medical Imaging" rather than just "AI")</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-700 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-1 flex-shrink-0">2</span>
                    <span>Include methodologies or theoretical frameworks you're interested in</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-700 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-1 flex-shrink-0">3</span>
                    <span>Consider mentioning interdisciplinary interests if applicable</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-700 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-1 flex-shrink-0">4</span>
                    <span>Check supervisor profiles for their supervision style, current projects, and publication record</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
} 