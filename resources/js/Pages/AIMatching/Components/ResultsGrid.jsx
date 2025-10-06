import React, { useState, useEffect, useRef } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { FaEnvelope, FaGoogle, FaGlobe, FaLinkedin, FaUserPlus, FaPaperPlane, FaStar, FaLightbulb, FaHome, FaUniversity, FaSearch } from 'react-icons/fa';
import axios from "axios";
import RecommendationModal from "@/Pages/Networking/partials/RecommendationModal";
import RecommendationDisplay from "@/Pages/Networking/partials/RecommendationDisplay";
import ProgressiveLoadingResults from "./ProgressiveLoadingResults";
import ProfileCard from "./ProfileCard";
import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export default function ResultsGrid({
  searchType,
  searchResults,
  universitiesList,
  faculties,
  researchOptions,
  users,
  skills,
  selectedArea,
  selectedUniversity,
  selectedAvailability,
  selectedSkills, // Add selectedSkills prop
  onLoadMore,
  isLoadingMore,
  onShowInsight
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingProfileData, setLoadingProfileData] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showRecommendationModal, setShowRecommendationModal] = useState(false);
  const [detailedInsights, setDetailedInsights] = useState('');
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [recommendingProfile, setRecommendingProfile] = useState(null);
  const [loadedProfiles, setLoadedProfiles] = useState([]);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const loadMoreRef = useRef(null);

  // Detect when search results are loading or updating
  useEffect(() => {
    if (!searchResults) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  }, [searchResults]);
  
  // Progressive loading of profile cards when results change
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
        searchResults.has_more && filteredResults.length > 0) {
      onLoadMore();
    }
  }, [isIntersecting, isLoadingMore, searchResults]);
  
  if (!searchResults || !searchResults.matches || searchResults.matches.length === 0) {
    return null;
  }
  
  // Filter results based on selected filters
  const filteredResults = searchResults.matches.filter(match => {
    const profile = match.academician || match.student || {};
    
    // Filter by research area if selected
    if (selectedArea && selectedArea.length > 0) {
      const researchField = (searchType === 'supervisor' || searchType === 'collaborators' && match.result_type === 'academician')
        ? profile.research_expertise
        : (profile.student_type === 'postgraduate' ? profile.field_of_research : profile.research_preference);
        
      // Skip if no research fields match the selected filters
      if (!researchField || !Array.isArray(researchField) || !researchField.some(area => selectedArea.includes(area))) {
        return false;
      }
    }
    
    // Filter by university if selected
    if (selectedUniversity && selectedUniversity.length > 0) {
      if (!profile.university || !selectedUniversity.includes(profile.university.toString())) {
        return false;
      }
    }
    
    // Filter by skills if selected
    if (selectedSkills && selectedSkills.length > 0) {
      if (!profile.skills || !Array.isArray(profile.skills) || 
          !profile.skills.some(skill => selectedSkills.includes(skill.id))) {
        return false;
      }
    }
    
    // Filter by availability if selected
    if (selectedAvailability) {
      let availabilityField;
      
      if (searchType === 'supervisor') {
        availabilityField = 'availability_as_supervisor';
      } else if (searchType === 'students') {
        availabilityField = 'supervisorAvailability';
      } else if (searchType === 'collaborators') {
        availabilityField = match.result_type === 'academician' ? 'availability_as_supervisor' : 'supervisorAvailability';
      }
      
      const availability = profile[availabilityField];
      
      if (availability === undefined || availability.toString() !== selectedAvailability) {
        return false;
      }
    }
    
    return true;
  });

  // Format name for display
  const formatName = (profile) => {
    if (!profile) return 'Unknown';
    
    return `${profile.full_name}`.trim();
  };

  // Get profile route based on result type
  const getProfileRoute = (match) => {
    try {
      if (match.result_type === 'academician' && match.academician) {
        // Different ways academician ID might be stored
        const id = match.academician.id || match.academician.academician_id;
        if (id) {
          return route('academicians.show', { academician: id });
        }
      } else if ((match.result_type === 'postgraduate' || match.result_type === 'undergraduate') && match.student) {
        // Different ways student ID might be stored
        const id = match.student.id || 
                  (match.result_type === 'postgraduate' ? match.student.postgraduate_id : match.student.undergraduate_id);
        
        if (id) {
          if (match.result_type === 'postgraduate') {
            return route('postgraduates.show', { postgraduate: id });
          } else {
            return route('undergraduates.show', { undergraduate: id });
          }
        }
      }
      
      // If we couldn't determine the right route, log and return fallback
      console.error('Could not determine profile route for:', match);
      return '#';
    } catch (error) {
      console.error('Error getting profile route:', error, match);
      return '#';
    }
  };

  // Get icon for result type
  const getTypeIcon = (match) => {
    if (match.result_type === 'academician') {
      return <FaUser className="text-blue-600" />;
    } else if (match.result_type === 'postgraduate') {
      return <FaUserGraduate className="text-green-600" />;
    } else if (match.result_type === 'undergraduate') {
      return <FaGraduationCap className="text-yellow-600" />;
    }
    return <FaUser className="text-gray-600" />;
  };

  // Handle quick info click
  const handleQuickInfoClick = (profile) => {
    setLoadingProfileData(true);
    setLoadingInsights(true);
    
    // Use AI insights from profile if it exists, otherwise try to find it in the match
    let briefInsights = profile.ai_insights || '';
    
    // If profile doesn't have AI insights, try to find the matching result
    if (!briefInsights) {
      const matchingResult = searchResults.matches.find(match => {
        const matchProfile = match.academician || match.student || {};
        const matchProfileId = matchProfile.id || matchProfile.academician_id || 
                              matchProfile.postgraduate_id || matchProfile.undergraduate_id;
        return matchProfileId === (profile.academician_id || profile.postgraduate_id || profile.undergraduate_id || profile.id);
      });
      
      // Get AI insights from matching result if found
      briefInsights = matchingResult?.ai_insights || '';
    }
    
    // Process the insights to replace field IDs with readable names
    let processedInsights = briefInsights;
    if (briefInsights) {
      // Find all patterns like "field_id-area_id-domain_id" in the text
      const fieldIdPattern = /\b(\d+-\d+-\d+)\b/g;
      const matches = briefInsights.match(fieldIdPattern) || [];
      
      // Replace each match with the corresponding readable name
      matches.forEach(match => {
        const matchedOption = researchOptions.find(
          option => `${option.field_of_research_id}-${option.research_area_id}-${option.niche_domain_id}` === match
        );
        
        if (matchedOption) {
          const readableName = `${matchedOption.field_of_research_name} - ${matchedOption.research_area_name} - ${matchedOption.niche_domain_name}`;
          processedInsights = processedInsights.replace(new RegExp(match, 'g'), readableName);
        }
      });
    }
    
    // Create an enhanced profile with the processed insights
    const enhancedProfile = {
      ...profile,
      ai_insights: briefInsights,
      processedInsights: processedInsights
    };
    
    console.log('Enhanced profile with insights:', enhancedProfile);
    
    setSelectedProfile(enhancedProfile);
    setDetailedInsights(processedInsights); // Use the processed insights directly
    
    // Different API endpoint based on profile type
    const isAcademician = profile.academician_id || (profile.result_type === 'academician');
    const profileId = profile.academician_id || profile.postgraduate_id || profile.undergraduate_id || profile.id;
    
    if (isAcademician) {
      // Fetch the academician's detailed data including counts
      axios.get(route('academicians.quick-info', profileId))
        .then(response => {
          if (response.data && response.data.academician) {
            // Update the profile with the detailed data including counts
            // BUT ensure we preserve our AI insights
            const updatedProfile = {
              ...enhancedProfile,
              ...response.data.academician,
              ai_insights: briefInsights, // Preserve the AI insights
              processedInsights: processedInsights, // Preserve the processed insights
              projects_count: response.data.projects_count || 0,
              grants_count: response.data.grants_count || 0,
              publications_count: response.data.publications_count || 0
            };
            
            console.log('Final updatedProfile with insights preserved:', updatedProfile);
            setSelectedProfile(updatedProfile);
          }
          setIsModalOpen(true);
          setLoadingProfileData(false);
          setLoadingInsights(false);
        })
        .catch(error => {
          console.error("Error fetching academician detail:", error);
          // Fallback if API fails
          setIsModalOpen(true);
          setLoadingProfileData(false);
          setLoadingInsights(false);
        });
    } else {
      // For student profiles, use the current data
      setIsModalOpen(true);
      setLoadingProfileData(false);
      setLoadingInsights(false);
    }
  };

  // Handle recommendation button click
  const handleRecommendClick = (profile, e) => {
    e.preventDefault(); // Prevent navigation
    setRecommendingProfile(profile);
    setShowRecommendationModal(true);
  };
  
  // Function to handle successful recommendation submission
  const handleRecommendationSuccess = () => {
    setShowRecommendationModal(false);
  };
  
  // Function to count grants for an academician
  const countGrants = () => {
    return selectedProfile?.grants_count || 0;
  }

  // Function to count projects for an academician
  const countProjects = () => {
    return selectedProfile?.projects_count || 0;
  }

  // Function to count publications for an academician
  const countPublications = () => {
    return selectedProfile?.publications_count || 0;
  }

  return (
    <div className="space-y-8">
      {/* Loading state - Using ProgressiveLoadingResults component */}
      {isSearching && (
        <ProgressiveLoadingResults
          isSearching={true}
          searchQuery={searchResults?.query || ""}
          showHeader={true}
          visibleCount={6}
          universitiesList={universitiesList}
          faculties={faculties}
          users={users}
          researchOptions={researchOptions}
        />
      )}
      
      {/* No filter matches message */}
      {!isSearching && searchResults && searchResults.matches && filteredResults.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">No results match your filters. Try adjusting your filter criteria.</p>
        </div>
      )}
      
      {/* Results */}
      {!isSearching && searchResults && searchResults.matches && filteredResults.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {/* Loaded profiles using ProfileCard component with staggered animation */}
            {filteredResults.slice(0, loadedProfiles.length).map((match, index) => {
              // Get profile data from match
              const profile = match.academician || match.student || {};
              const profileId = profile.id || profile.academician_id || profile.postgraduate_id || profile.undergraduate_id || index;
              
              return (
                <motion.div
                  key={`${match.result_type}-${profileId}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: index * 0.05,
                    ease: "easeOut"
                  }}
                >
                  <ProfileCard
                    match={match}
                    universitiesList={universitiesList}
                    researchOptions={researchOptions}
                    users={users}
                    onQuickInfoClick={handleQuickInfoClick}
                    onRecommendClick={handleRecommendClick}
                    onShowInsight={onShowInsight}
                  />
                </motion.div>
              );
            })}
            
            {/* If more profiles are being loaded or fetched, show skeletons */}
            {filteredResults.length > loadedProfiles.length && (
              <div className="col-span-full">
                <ProgressiveLoadingResults
                  isSearching={true}
                  showHeader={false}
                  visibleCount={Math.min(3, filteredResults.length - loadedProfiles.length)}
                  universitiesList={universitiesList}
                  faculties={faculties}
                  users={users}
                  researchOptions={researchOptions}
                  searchQuery="Loading more profiles..."
                />
              </div>
            )}
          </div>
          
          {/* Load more trigger/button - Premium Style */}
          {searchResults.has_more && (
            <div 
              ref={loadMoreRef} 
              className="mt-12 text-center py-6"
            >
              {isLoadingMore ? (
                <div className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  <span className="text-gray-600 font-medium">Loading more results...</span>
                </div>
              ) : (
                <button 
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  onClick={onLoadMore}
                >
                  <Sparkles className="h-5 w-5" />
                  <span>Load More Results</span>
                </button>
              )}
            </div>
          )}
          
          {/* End of Results Indicator */}
          {!searchResults.has_more && filteredResults.length > 0 && (
            <div className="mt-12 text-center py-6">
              <div className="inline-flex items-center gap-2 text-gray-400">
                <div className="h-px w-12 bg-gray-300"></div>
                <span className="text-sm font-medium">End of results</span>
                <div className="h-px w-12 bg-gray-300"></div>
              </div>
            </div>
          )}
        </>
      )}
      
      {/* No results at all message */}
      {!isSearching && searchResults && searchResults.matches && searchResults.matches.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FaSearch className="text-gray-400 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">No matching results found</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Try broadening your search terms or exploring different research areas.
          </p>
        </div>
      )}
      
      {/* Modal for detailed profile view */}
      {isModalOpen && selectedProfile && (
        <>
          {console.log('Modal opening with selectedProfile:', selectedProfile)}
          {console.log('AI insights available:', selectedProfile.ai_insights)}
          <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Layer 1: Dedicated full-screen backdrop */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setIsModalOpen(false)}
            ></div>

            {/* Layer 2: Centering container for the modal panel */}
            <div className="flex items-center justify-center min-h-screen p-4">
              <div
                className="relative bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-lg max-h-[80vh] overflow-y-auto z-10"
                onClick={(e) => e.stopPropagation()}
              >
                {loadingProfileData ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <svg className="animate-spin h-8 w-8 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    <p className="text-gray-600">Loading profile information...</p>
                  </div>
                ) : (
                  <>
                    {/* All the existing modal content (header, bio, insights, etc.) goes here */}
                    <h3 className="text-xl font-bold mb-4 text-gray-800">
                      {selectedProfile.full_name}
                    </h3>

                    <hr className="border-t border-gray-800 mb-4" />
                    
                    {/* AI Match Insights - Detailed */}
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                      <h4 className="text-lg font-semibold text-blue-800 mb-2 flex items-center">
                        <Sparkles className="w-4 h-4 mr-2" />
                        AI Match Insights
                      </h4>
                      {console.log('Rendering AI insights section with:', {
                        ai_insights: selectedProfile.ai_insights,
                        processedInsights: selectedProfile.processedInsights
                      })}
                      {loadingInsights ? (
                        <div className="flex items-center justify-center p-4">
                          <svg className="animate-spin h-5 w-5 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                          </svg>
                          <p className="text-gray-600">Generating detailed insights...</p>
                        </div>
                      ) : (
                        <p className="text-gray-700 whitespace-pre-line">
                          {selectedProfile.processedInsights || selectedProfile.ai_insights || "No insights available for this profile."}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-6">
                      {/* Short Bio */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">Short Bio</h4>
                        <p className="text-gray-600 whitespace-pre-line">
                          {selectedProfile.bio || "Not Provided"}
                        </p>
                      </div>
                      
                      {/* Research Interests */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">
                          {selectedProfile.academician_id ? "Research Expertise" : "Research Interests"}
                        </h4>
                        <div className="">
                          {(() => {
                            // Get the research expertise data based on profile type
                            let researchArray = [];
                            
                            if (selectedProfile.academician_id) {
                              researchArray = selectedProfile.research_expertise || [];
                            } else if (selectedProfile.postgraduate_id || selectedProfile.student_type === 'postgraduate') {
                              researchArray = selectedProfile.field_of_research || [];
                            } else {
                              researchArray = selectedProfile.research_preference || [];
                            }

                            if (Array.isArray(researchArray) && researchArray.length > 0) {
                              // Show all research interests with numbering
                              return (
                                <div className="space-y-2">
                                  {researchArray.map((id, index) => {
                                    const matchedOption = researchOptions.find(
                                      (option) =>
                                        `${option.field_of_research_id}-${option.research_area_id}-${option.niche_domain_id}` === id
                                    );
                                    
                                    if (matchedOption) {
                                      return (
                                        <p key={index} className="text-gray-600">
                                          {index + 1}. {matchedOption.field_of_research_name} - {matchedOption.research_area_name} - {matchedOption.niche_domain_name}
                                        </p>
                                      );
                                    }
                                    return (
                                      <p key={index} className="text-gray-600">
                                        {index + 1}. {id}
                                      </p>
                                    );
                                  })}
                                </div>
                              );
                            }
                            return <p className="text-gray-600">Not Provided</p>;
                          })()}
                        </div>
                      </div>
                      
                      {/* Academician-specific sections */}
                      {selectedProfile.academician_id && (
                        <>
                          {/* Style of Supervision */}
                          <div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-2">Style of Supervision</h4>
                            <div className="space-y-2">
                              {Array.isArray(selectedProfile.style_of_supervision) && selectedProfile.style_of_supervision.length > 0 ? (
                                <div className="mt-2 text-normal text-gray-600">
                                  {selectedProfile.style_of_supervision.map((style, index) => (
                                    <div key={index} className="mb-2">
                                      <span className="font-medium">{index + 1}. {style}</span>
                                      <div className="ml-4 text-sm">
                                        {style === 'Directive Supervision' && 'Structured approach with active guidance and regular monitoring'}
                                        {style === 'Facilitative Supervision' && 'Supportive approach encouraging student independence'}
                                        {style === 'Coaching Supervision' && 'Focuses on personal development and academic growth'}
                                        {style === 'Adaptive Supervision' && 'Flexible support based on student\'s changing needs'}
                                        {style === 'Participatory Supervision' && 'Collaborative approach with shared decision-making'}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-gray-600">Not Specified</p>
                              )}
                            </div>
                          </div>
                          
                          {/* Total Supervised Student */}
                          <div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-2">Total Supervised Student</h4>
                            <p className="text-gray-600">{selectedProfile.supervised_students_count || "Not Provided"}</p>
                          </div>
                          
                          {/* Total Available Grant and Project */}
                          <div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-2">Total Available Grant and Project</h4>
                            <div className="flex flex-col">
                              <p className="text-gray-600">
                                {countGrants() + countProjects()} Projects/Grants
                              </p>
                              <Link
                                href={route('academicians.projects', selectedProfile.url || selectedProfile.academician_id)}
                                className="mt-2 self-start text-xs px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 flex items-center"
                              >
                                <span>View Projects</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </Link>
                            </div>
                          </div>
                          
                          {/* Total Publication */}
                          <div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-2">Total Publication</h4>
                            <div className="flex flex-col">
                              <p className="text-gray-600">
                                {countPublications()} Publications
                              </p>
                              <Link
                                href={route('academicians.publications', selectedProfile.url || selectedProfile.academician_id)}
                                className="mt-2 self-start text-xs px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 flex items-center"
                              >
                                <span>View Publications</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </Link>
                            </div>
                          </div>
                          
                          {/* Recommendation by Others */}
                          <div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-2">Recommendation by Others</h4>
                            <RecommendationDisplay academicianId={selectedProfile.academician_id || selectedProfile.id} />
                          </div>
                        </>
                      )}
                      
                      {/* Skills */}
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">Skills</h4>
                        {Array.isArray(selectedProfile.skills) && selectedProfile.skills.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {selectedProfile.skills.map((skill, index) => {
                              // Construct hierarchical name
                              let displayName = skill.name;
                              if (skill.subdomain && skill.subdomain.domain) {
                                displayName = `${skill.subdomain.domain.name} - ${skill.subdomain.name} - ${skill.name}`;
                              } else if (skill.full_name) {
                                displayName = skill.full_name;
                              } else {
                                displayName = skill.name || `Skill #${index+1}`;
                              }
                              
                              return (
                                <span 
                                  key={skill.id || index} 
                                  className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                                >
                                  {displayName}
                                </span>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-gray-600">No skills listed</p>
                        )}
                      </div>
                      
                      {/* Connect via - For all profiles */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">Connect via</h4>
                        <div className="flex items-center space-x-4">
                          {selectedProfile.google_scholar && (
                            <a
                              href={selectedProfile.google_scholar}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-500 text-lg hover:text-red-700"
                              title="Google Scholar"
                            >
                              <FaGoogle />
                            </a>
                          )}
                          {selectedProfile.personal_website && (
                            <a
                              href={selectedProfile.personal_website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-500 text-lg hover:text-green-700"
                              title="Personal Website"
                            >
                              <FaHome />
                            </a>
                          )}
                          {selectedProfile.institution_website && (
                            <a
                              href={selectedProfile.institution_website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-500 text-lg hover:text-blue-700"
                              title="Institutional Website"
                            >
                              <FaUniversity />
                            </a>
                          )}
                          {selectedProfile.linkedin && (
                            <a
                              href={selectedProfile.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-500 text-lg hover:text-blue-800"
                              title="LinkedIn"
                            >
                              <FaLinkedin />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
                
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Recommendation Modal */}
      {showRecommendationModal && recommendingProfile && (
        <RecommendationModal
          academician={recommendingProfile}
          onClose={() => setShowRecommendationModal(false)}
          onSuccess={handleRecommendationSuccess}
        />
      )}
    </div>
  );
}