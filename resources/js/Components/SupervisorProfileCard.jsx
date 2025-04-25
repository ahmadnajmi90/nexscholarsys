import React, { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import { FaEnvelope, FaGoogle, FaGlobe, FaLinkedin, FaUserPlus, FaPaperPlane, FaStar, FaLightbulb } from "react-icons/fa";
import axios from "axios";
import RecommendationModal from "./RecommendationModal";
import RecommendationDisplay from "./RecommendationDisplay";
import BookmarkButton from "@/Components/BookmarkButton";

const SupervisorProfileCard = ({ 
  profile, 
  universitiesList, 
  faculties, 
  users, 
  researchOptions, 
  aiInsights,
  searchQuery
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingProfileData, setLoadingProfileData] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showRecommendationModal, setShowRecommendationModal] = useState(false);
  const [detailedInsights, setDetailedInsights] = useState(aiInsights);
  const [loadingInsights, setLoadingInsights] = useState(false);

  const handleQuickInfoClick = () => {
    setLoadingProfileData(true);
    // Fetch the academician's detailed data including counts
    axios.get(route('academicians.quick-info', profile.academician_id))
      .then(response => {
        if (response.data && response.data.academician) {
          // Update the profile with the detailed data including counts
          setSelectedProfile({
            ...profile,
            ...response.data.academician,
            projects_count: response.data.projects_count || 0,
            grants_count: response.data.grants_count || 0,
            publications_count: response.data.publications_count || 0
          });
          setIsModalOpen(true);
          
          // If we have a search query, also get more detailed AI insights
          if (searchQuery) {
            loadDetailedInsights();
          }
        } else {
          // Fallback if API fails
          setSelectedProfile(profile);
          setIsModalOpen(true);
        }
        setLoadingProfileData(false);
      })
      .catch(error => {
        console.error("Error fetching academician detail:", error);
        // Fallback if API fails
        setSelectedProfile(profile);
        setIsModalOpen(true);
        setLoadingProfileData(false);
      });
  };
  
  // Function to load detailed AI insights
  const loadDetailedInsights = () => {
    setLoadingInsights(true);
    axios.post(route('supervisor.insights'), {
      academician_id: profile.academician_id,
      query: searchQuery
    })
    .then(response => {
      if (response.data && response.data.insight) {
        setDetailedInsights(response.data.insight);
      }
      setLoadingInsights(false);
    })
    .catch(error => {
      console.error("Error fetching detailed insights:", error);
      setLoadingInsights(false);
    });
  };

  // Function to handle recommendation button click
  const handleRecommendClick = (e) => {
    e.preventDefault(); // Prevent navigation
    setShowRecommendationModal(true);
  };
  
  // Function to handle successful recommendation submission
  const handleRecommendationSuccess = () => {
    setShowRecommendationModal(false);
    // You could show a success message here if desired
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

  // Add better debugging to check the profile data
  console.log("Supervisor Profile Data:", profile);

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden relative">
      {/* University Badge */}
      <div className="absolute top-2 left-2 bg-blue-500 text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
        {universitiesList.find((u) => u.id === profile.university)?.short_name || "Unknown University"}
      </div>

      {/* Verified Badge */}
      <div className="relative group">
        <span className="absolute top-2 right-2 whitespace-nowrap rounded-full bg-red-100 px-2.5 py-0.5 text-[10px] text-red-700 cursor-pointer">
          AI Recommendation
        </span>
      </div>

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
          {/* Move verified badge outside the profile image circle */}
          {profile.verified === 1 && (
            <div className="absolute bottom-1 right-1 bg-white p-1 rounded-full group cursor-pointer shadow-md">
              <div className="flex items-center justify-center w-7 h-7 bg-blue-500 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              {/* Tooltip */}
              <div className="absolute bottom-8 right-0 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-3 py-2 shadow-lg z-10 w-48">
                This account is verified by {universitiesList.find((u) => u.id === profile.university)?.full_name || "Unknown University"}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Profile Info */}
      <div className="text-center mt-4">
        <h2 className="text-lg font-semibold truncate px-6">{profile.name}</h2>
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
          {Array.isArray(profile.research_expertise) && profile.research_expertise.length > 0
            ? profile.research_expertise[0]
            : "No Field of Research or Expertise"}
        </p>
        <p className="text-gray-500 text-sm">
          {profile.position ? profile.position : "No Position"}
        </p>
        
        {/* AI Insights Section */}
        {aiInsights && (
          <div className="mt-3 px-4 py-2 bg-blue-50 mx-4 rounded-md">
            <div className="flex items-center mb-1">
              <FaLightbulb className="text-yellow-500 mr-2" />
              <span className="text-xs font-semibold text-blue-700">AI Match Insights</span>
            </div>
            <p className="text-xs text-gray-700 text-left h-16 overflow-y-auto pr-1">
              {aiInsights}
            </p>
          </div>
        )}
        
        <div className="mt-4 flex justify-center gap-2">
          <button
            onClick={handleQuickInfoClick}
            className="bg-blue-500 text-white text-[10px] px-2 font-semibold py-1 rounded-full hover:bg-blue-600"
          >
            Quick Info
          </button>
          <Link
            href={route('academicians.show', profile.url)}
            className="bg-green-500 text-white text-[10px] px-2 font-semibold py-1 rounded-full hover:bg-green-600"
          >
            Full Profile
          </Link>
        </div>
      </div>

      {/* Social Action Links */}
      <div className="flex justify-around items-center mt-6 py-4 border-t px-10">
      <a
                  href="#"
                  className="text-gray-500 text-lg cursor-pointer hover:text-blue-700" 
                  title="Add Friend"
                >
                  <FaUserPlus className="text-lg" />
                </a>
                <Link
                  href={route('email.compose', { 
                    to: users.find(
                      (user) =>
                        user.unique_id === 
                        (profile.academician_id)
                    )?.email 
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
                  bookmarkableType="academician" 
                  bookmarkableId={profile.id}
                  category="Academicians" 
                  iconSize="text-lg"
                  tooltipPosition="top"
                />
      </div>
      
      {/* Modal for detailed profile view */}
      {isModalOpen && selectedProfile && (
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
                <p className="text-gray-600">Loading academician information...</p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-4 text-gray-800 ">
                  {selectedProfile.full_name}
                </h3>

                <hr className="border-t border-gray-800 mb-4"></hr>
                
                {/* AI Match Insights - Detailed */}
                {searchQuery && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="text-lg font-semibold text-blue-800 mb-2 flex items-center">
                      <FaLightbulb className="text-yellow-500 mr-2" />
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
                        {detailedInsights}
                      </p>
                    )}
                  </div>
                )}
                
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
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Research Interest</h4>
                    <div className="">
                      {(() => {
                        // Get the research expertise data
                        let researchArray = selectedProfile.research_expertise || [];

                        if (Array.isArray(researchArray) && researchArray.length > 0) {
                          // Only show the first research interest
                          const id = researchArray[0];
                          const matchedOption = researchOptions.find(
                            (option) =>
                              `${option.field_of_research_id}-${option.research_area_id}-${option.niche_domain_id}` === id
                          );
                          
                          if (matchedOption) {
                            return (
                              <p className="text-gray-600">
                                {matchedOption.field_of_research_name} - {matchedOption.research_area_name} - {matchedOption.niche_domain_name}
                              </p>
                            );
                          }
                        }
                        return <p className="text-gray-600">Not Provided</p>;
                      })()}
                    </div>
                  </div>
                  
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
                        href={route('academicians.projects', selectedProfile.url)}
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
                        href={route('academicians.publications', selectedProfile.url)}
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
                    <RecommendationDisplay academicianId={selectedProfile.academician_id} />
                  </div>
                  
                  {/* Connect via */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Connect via</h4>
                    <div className="flex items-center space-x-4">
                      <a
                        href={selectedProfile.google_scholar}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 text-lg hover:text-red-700"
                        title="Google Scholar"
                      >
                        <FaGoogle />
                      </a>
                      <a
                        href={selectedProfile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 text-lg hover:text-green-700"
                        title="Website"
                      >
                        <FaGlobe />
                      </a>
                      <a
                        href={selectedProfile.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 text-lg hover:text-blue-800"
                        title="LinkedIn"
                      >
                        <FaLinkedin />
                      </a>
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
      )}
      
      {/* Recommendation Modal */}
      {showRecommendationModal && (
        <RecommendationModal
          academician={profile}
          onClose={() => setShowRecommendationModal(false)}
          onSuccess={handleRecommendationSuccess}
        />
      )}
    </div>
  );
};

export default SupervisorProfileCard; 