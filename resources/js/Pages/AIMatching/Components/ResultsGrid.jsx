import React, { useState, useEffect, useRef } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { FaEnvelope, FaGoogle, FaGlobe, FaLinkedin, FaUserPlus, FaPaperPlane, FaStar, FaLightbulb, FaHome, FaUniversity, FaSearch } from 'react-icons/fa';
import axios from "axios";
import RecommendationModal from "@/Components/RecommendationModal";
import RecommendationDisplay from "@/Components/RecommendationDisplay";
import BookmarkButton from "@/Components/BookmarkButton";
import MatchIndicator from "@/Components/MatchIndicator";
import ProgressiveLoadingResults from "@/Components/ProgressiveLoadingResults";
import ConnectionButton from "@/Components/ConnectionButton";
import { Sparkles } from 'lucide-react';

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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              Found {filteredResults.length} matching results for "{searchResults.query}"
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Loaded profiles */}
            {filteredResults.slice(0, loadedProfiles.length).map((match, index) => {
              // Get profile data from match
              const profile = match.academician || match.student || {};
              const profileId = profile.id || profile.academician_id || profile.postgraduate_id || profile.undergraduate_id || index;
              const isAcademician = !!match.academician || match.result_type === 'academician';
              
              // Store AI insights in the profile object itself for later access
              const aiInsights = match.ai_insights || '';
              profile.ai_insights = aiInsights; // Add ai_insights to the profile object
              
              // Debug: Log match structure to check for ai_insights
              console.log(`Match ${index} structure:`, match);
              console.log(`Match ${index} ai_insights:`, match.ai_insights);
              console.log(`Profile with ai_insights added:`, profile);
              
              return (
                <div 
                  key={`${match.result_type}-${profileId}`}
                  className="bg-white shadow-md rounded-lg overflow-hidden relative"
                >
                  {/* University Badge */}
                  <div className="absolute top-2 left-2 bg-blue-500 text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                    {universitiesList.find((u) => u.id === profile.university)?.short_name || 
                     profile.university_name || profile.university_short_name || 'Unknown University'}
                  </div>

                  {/* Match Score Badge */}
                  {match.score && (
                    <div className="absolute top-2 right-2 z-10">
                      <div className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">
                        {Math.round(match.score * 100)}% Match
                      </div>
                    </div>
                  )}

                  {/* Profile Banner */}
                  <div className="h-32">
                    <img
                      src={profile.background_image !== null ? `/storage/${profile.background_image}` : "/storage/profile_background_images/default.jpg"}
                      alt="Banner"
                      className="object-cover w-full h-full"
                    />
                  </div>

                  {/* Profile Image */}
                  <div className="flex justify-center -mt-12">
                    <div className="relative w-24 h-24">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                        <img
                          src={profile.profile_picture !== null ? `/storage/${profile.profile_picture}` : "/storage/profile_pictures/default.jpg"}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Verified badge */}
                      {profile.verified === 1 && (
                        <div className="absolute bottom-1 right-1 bg-white p-1 rounded-full group cursor-pointer shadow-md">
                          <div className="flex items-center justify-center w-7 h-7 bg-blue-500 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          {/* Tooltip */}
                          <div className="absolute bottom-8 right-0 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-3 py-2 shadow-lg z-10 w-48">
                            This account is verified by {universitiesList.find((u) => u.id === profile.university)?.full_name || "their institution"}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Profile Info */}
                  <div className="text-center mt-4">
                    <h2 className="text-lg font-semibold truncate px-6">{profile.full_name}</h2>
                    <p
                      className="text-gray-500 text-sm px-6"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        minHeight: "2.5rem",
                      }}
                    >
                      {(() => {
                        // Get research expertise/field based on profile type
                        let researchArray = [];
                        
                        if (isAcademician) {
                          researchArray = profile.research_expertise || [];
                        } else if (match.result_type === 'postgraduate' || profile.student_type === 'postgraduate') {
                          researchArray = profile.field_of_research || [];
                        } else {
                          researchArray = profile.research_preference || [];
                        }

                        if (Array.isArray(researchArray) && researchArray.length > 0) {
                          const id = researchArray[0];
                          const matchedOption = researchOptions.find(
                            (option) =>
                              `${option.field_of_research_id}-${option.research_area_id}-${option.niche_domain_id}` === id
                          );
                          
                          return matchedOption
                            ? `${matchedOption.field_of_research_name} - ${matchedOption.research_area_name} - ${matchedOption.niche_domain_name}`
                            : id; // Fallback to the ID if no match found
                        }
                        
                        return profile.current_position || "No Field of Research or Expertise";
                      })()}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {(() => {
                        // Display different text based on profile type
                        if (isAcademician) {
                          return profile.current_position || "No Position";
                        } else if (match.result_type === 'postgraduate' || profile.student_type === 'postgraduate') {
                          return "Postgraduate";
                        } else {
                          return "Undergraduate";
                        }
                      })()}
                    </p>
                    
                    {/* Match Indicator */}
                    {match.score && (
                      <div className="mt-3 px-4">
                        <MatchIndicator score={match.score} showDetails={false} />
                      </div>
                    )}
                    
                    {/* AI Insights Section */}
                    {aiInsights && (
                      <div className="mt-3 px-4 py-2 bg-blue-50 mx-4 rounded-md">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-blue-700 flex items-center">
                            <Sparkles className="w-4 h-4 mr-2" />
                            AI Match Insights
                          </span>
                          <button 
                            onClick={() => {
                              // Process the insights text to replace field IDs with readable names
                              let processedInsights = aiInsights;
                              
                              // Find all patterns like "field_id-area_id-domain_id" in the text
                              const fieldIdPattern = /\b(\d+-\d+-\d+)\b/g;
                              const matches = aiInsights.match(fieldIdPattern) || [];
                              
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
                              
                              // Call the parent component's function to show the insight in a modal
                              onShowInsight(processedInsights);
                            }}
                            className="text-blue-600 text-xs hover:underline flex items-center"
                          >
                            <span>Show Insight</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                        <p className="text-xs text-gray-700 text-left h-16 overflow-hidden pr-1 mt-1">
                          {aiInsights.substring(0, 210)}...
                        </p>
                      </div>
                    )}
                    
                    <div className="mt-4 flex justify-center gap-2">
                      <button
                        onClick={() => {
                          // Make sure we log what we're passing to handleQuickInfoClick
                          console.log('Quick Info clicked for profile:', profile);
                          console.log('Profile has ai_insights:', profile.ai_insights);
                          handleQuickInfoClick(profile);
                        }}
                        className="bg-blue-500 text-white text-[10px] px-2 font-semibold py-1 rounded-full hover:bg-blue-600"
                      >
                        Quick Info
                      </button>
                      <Link
                        href={
                          isAcademician 
                            ? route('academicians.show', profile.url || profile.academician_id || profile.id) 
                            : match.result_type === 'postgraduate' || profile.student_type === 'postgraduate'
                              ? route('postgraduates.show', profile.url || profile.postgraduate_id || profile.id)
                              : route('undergraduates.show', profile.url || profile.undergraduate_id || profile.id)
                        }
                        className="bg-green-500 text-white text-[10px] px-2 font-semibold py-1 rounded-full hover:bg-green-600"
                      >
                        Full Profile
                      </Link>
                    </div>
                  </div>

                  {/* Social Action Links */}
                  <div className="flex justify-around items-center mt-6 py-4 border-t px-10">
                    <ConnectionButton user={profile.user} />
                    <Link
                      href={route('email.compose', { 
                        to: users.find(
                          (user) =>
                            user.unique_id === 
                            (isAcademician ? profile.academician_id || profile.id : 
                             profile.postgraduate_id || profile.undergraduate_id || profile.id)
                        )?.email || profile.email || ''
                      })}
                      className="text-gray-500 text-lg cursor-pointer hover:text-blue-700" 
                      title="Send Email"
                    >
                      <FaPaperPlane className="text-lg" />
                    </Link>
                    <a
                      href="#"
                      onClick={(e) => handleRecommendClick(profile, e)}
                      className="text-gray-500 text-lg hover:text-yellow-500"
                      title="Recommend"
                    >
                      <FaStar className="text-lg" />
                    </a>
                    <BookmarkButton 
                      bookmarkableType={isAcademician ? "academician" : match.result_type} 
                      bookmarkableId={profileId}
                      category={isAcademician ? "Academicians" : "Students"} 
                    />
                  </div>
                </div>
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
          
          {/* Load more trigger/button */}
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
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-lg relative max-h-[80vh] overflow-y-auto"
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
                    
                    {/* Student-specific sections */}
                    {(selectedProfile.postgraduate_id || selectedProfile.undergraduate_id) && (
                      <>
                        {/* Skills */}
                        <div className="mb-6">
                          <h4 className="text-lg font-semibold text-gray-800 mb-2">Skills</h4>
                          {Array.isArray(selectedProfile.skills) && selectedProfile.skills.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {selectedProfile.skills.map((skill, index) => {
                                // Check different skill formats
                                let skillName = '';
                                
                                // If skill is already a string (name), use it directly
                                if (typeof skill === 'string') {
                                  skillName = skill;
                                } 
                                // If skill is an object with name property, use that
                                else if (typeof skill === 'object' && skill !== null && skill.name) {
                                  skillName = skill.name;
                                } 
                                // If skill is an ID, look it up in the skills list
                                else if (skills && (typeof skill === 'number' || !isNaN(parseInt(skill)))) {
                                  const skillId = typeof skill === 'number' ? skill : parseInt(skill);
                                  const foundSkill = skills.find(s => s.id === skillId);
                                  skillName = foundSkill ? foundSkill.name : `Skill #${skill}`;
                                }
                                // Fallback
                                else {
                                  skillName = `Skill #${index+1}`;
                                }
                                
                                return (
                                  <span 
                                    key={index} 
                                    className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                                  >
                                    {skillName}
                                  </span>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-gray-600">No skills listed</p>
                          )}
                        </div>
                      </>
                    )}
                    
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