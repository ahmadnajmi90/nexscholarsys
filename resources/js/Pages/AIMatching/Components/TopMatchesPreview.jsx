import React, { useRef, useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { IconArrowNarrowLeft, IconArrowNarrowRight } from "@tabler/icons-react";
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { FaGoogle, FaLinkedin, FaHome, FaUniversity } from 'react-icons/fa';
import axios from "axios";
import ProfileCard from './ProfileCard';
import RecommendationModal from "@/Pages/Networking/partials/RecommendationModal";
import RecommendationDisplay from "@/Pages/Networking/partials/RecommendationDisplay";

export default function TopMatchesPreview({ 
  searchResults, 
  universitiesList, 
  researchOptions,
  users,
  onViewAllResults,
  onQuickInfoClick,
  onRecommendClick,
  onShowInsight
}) {
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingProfileData, setLoadingProfileData] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showRecommendationModal, setShowRecommendationModal] = useState(false);
  const [detailedInsights, setDetailedInsights] = useState('');
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [recommendingProfile, setRecommendingProfile] = useState(null);
  
  // Get top 5 matches
  const topMatches = searchResults?.matches?.slice(0, 5) || [];
  
  if (!topMatches || topMatches.length === 0) {
    return null;
  }

  useEffect(() => {
    checkScrollability();
  }, []);

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      const scrollAmount = window.innerWidth < 640 ? 280 : window.innerWidth < 1024 ? 300 : 320;
      carouselRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      setTimeout(checkScrollability, 300);
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      const scrollAmount = window.innerWidth < 640 ? 280 : window.innerWidth < 1024 ? 300 : 320;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      setTimeout(checkScrollability, 300);
    }
  };

  // Handle quick info click
  const handleQuickInfoClick = (profile) => {
    setLoadingProfileData(true);
    setLoadingInsights(true);
    
    // Use AI insights from profile if it exists
    let briefInsights = profile.ai_insights || '';
    
    // If profile doesn't have AI insights, try to find the matching result
    if (!briefInsights) {
      const matchingResult = searchResults.matches.find(match => {
        const matchProfile = match.academician || match.student || {};
        const matchProfileId = matchProfile.id || matchProfile.academician_id || 
                              matchProfile.postgraduate_id || matchProfile.undergraduate_id;
        return matchProfileId === (profile.academician_id || profile.postgraduate_id || profile.undergraduate_id || profile.id);
      });
      
      briefInsights = matchingResult?.ai_insights || '';
    }
    
    // Process the insights to replace field IDs with readable names
    let processedInsights = briefInsights;
    if (briefInsights) {
      const fieldIdPattern = /\b(\d+-\d+-\d+)\b/g;
      const matches = briefInsights.match(fieldIdPattern) || [];
      
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
    
    setSelectedProfile(enhancedProfile);
    setDetailedInsights(processedInsights);
    
    // Different API endpoint based on profile type
    const isAcademician = profile.academician_id || (profile.result_type === 'academician');
    const profileId = profile.academician_id || profile.postgraduate_id || profile.undergraduate_id || profile.id;
    
    if (isAcademician) {
      // Fetch the academician's detailed data
      axios.get(route('academicians.quick-info', profileId))
        .then(response => {
          if (response.data && response.data.academician) {
            const updatedProfile = {
              ...enhancedProfile,
              ...response.data.academician,
              ai_insights: briefInsights,
              processedInsights: processedInsights,
              projects_count: response.data.projects_count || 0,
              grants_count: response.data.grants_count || 0,
              publications_count: response.data.publications_count || 0
            };
            
            setSelectedProfile(updatedProfile);
          }
          setIsModalOpen(true);
          setLoadingProfileData(false);
          setLoadingInsights(false);
        })
        .catch(error => {
          console.error("Error fetching academician detail:", error);
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

  // Handle recommend click
  const handleRecommendClick = (profile, e) => {
    e.preventDefault();
    setRecommendingProfile(profile);
    setShowRecommendationModal(true);
  };

  // Handle recommendation success
  const handleRecommendationSuccess = () => {
    setShowRecommendationModal(false);
  };

  // Count helper functions for academician profiles
  const countProjects = () => {
    return selectedProfile?.projects_count || 0;
  };

  const countGrants = () => {
    return selectedProfile?.grants_count || 0;
  };

  const countPublications = () => {
    return selectedProfile?.publications_count || 0;
  };

  return (
    <div className="w-full py-4 overflow-hidden max-w-sm sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-7xl mx-auto">
      {/* Premium Header with Gradient Line */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 sm:mb-12 px-4 sm:px-0 md:px-4 lg:px-2 xl:px-0"
      >
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
          Top 5 Matches
        </h2>
        <div className="h-1 w-16 sm:w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
      </motion.div>

      {/* Carousel Container */}
      <div className="relative w-full overflow-hidden px-4 sm:px-0 md:px-4 lg:px-2 xl:px-0">
        {/* Cards Carousel */}
        <div
          ref={carouselRef}
          onScroll={checkScrollability}
          className="flex overflow-x-auto overscroll-x-none scroll-smooth gap-4 sm:gap-6 lg:gap-8 pb-6 sm:pb-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {topMatches.map((match, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="flex-shrink-0 w-[280px] sm:w-[300px] lg:w-[320px]"
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
          ))}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="px-4 sm:px-0 md:px-4 lg:px-2 xl:px-0">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 sm:mt-8 lg:mt-10">
          {/* View All Button - Premium CTA */}
          {searchResults.matches.length > 5 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              onClick={onViewAllResults}
              className="group inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5 lg:py-4 text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 w-full sm:w-auto"
            >
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="truncate">View All {searchResults.total_count || searchResults.total || searchResults.matches.length} Results</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform flex-shrink-0" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </motion.button>
          )}

          {/* Navigation Arrows - Modern Style */}
          <div className="flex gap-2 sm:gap-3 sm:ml-auto">
            <button
              className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 border border-gray-200"
              onClick={scrollLeft}
              disabled={!canScrollLeft}
            >
              <IconArrowNarrowLeft className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
            </button>
            <button
              className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 border border-gray-200"
              onClick={scrollRight}
              disabled={!canScrollRight}
            >
              <IconArrowNarrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal for detailed profile view */}
      {isModalOpen && selectedProfile && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsModalOpen(false)}
          ></div>

          {/* Modal Container */}
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
                  <h3 className="text-xl font-bold mb-4 text-gray-800">
                    {selectedProfile.full_name}
                  </h3>

                  <hr className="border-t border-gray-800 mb-4" />
                  
                  {/* AI Match Insights */}
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="text-lg font-semibold text-blue-800 mb-2 flex items-center">
                      <Sparkles className="w-4 h-4 mr-2" />
                      AI Match Insights
                    </h4>
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
                          let researchArray = [];
                          
                          if (selectedProfile.academician_id) {
                            researchArray = selectedProfile.research_expertise || [];
                          } else if (selectedProfile.postgraduate_id || selectedProfile.student_type === 'postgraduate') {
                            researchArray = selectedProfile.field_of_research || [];
                          } else {
                            researchArray = selectedProfile.research_preference || [];
                          }

                          if (Array.isArray(researchArray) && researchArray.length > 0) {
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
                    
                    {/* Connect via */}
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

