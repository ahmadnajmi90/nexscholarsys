import React, { useState, useEffect, useRef } from "react";
import { Link, usePage } from "@inertiajs/react";
import { FaEnvelope, FaGoogle, FaGlobe, FaLinkedin, FaUserPlus, FaPaperPlane, FaStar, FaFilter, FaHome, FaUniversity } from "react-icons/fa";
import axios from "axios";
import RecommendationModal from "./RecommendationModal";
import RecommendationDisplay from "./RecommendationDisplay";
import FilterDropdown from "@/Components/FilterDropdown";
import BookmarkButton from "@/Components/BookmarkButton";

const AcademicianProfileCard = ({
  profilesData,
  universitiesList,
  faculties,
  users,
  researchOptions,
  searchQuery
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showRecommendationModal, setShowRecommendationModal] = useState(false);
  const [recommendingProfile, setRecommendingProfile] = useState(null);
  const [loadingProfileData, setLoadingProfileData] = useState(false);
  
  // Filtering state variables
  const [selectedArea, setSelectedArea] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState([]);
  const [selectedSupervisorAvailability, setSelectedSupervisorAvailability] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const profilesPerPage = 9;
  
  // Reference to the filter container
  const filterContainerRef = useRef(null);

  // Function to handle clicks outside the filter container
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterContainerRef.current && !filterContainerRef.current.contains(event.target) && showFilters) {
        setShowFilters(false);
      }
    }

    // Add event listener when showFilters is true
    if (showFilters) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    // Clean up the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilters]);

  const handleQuickInfoClick = (profile) => {
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

  const getUniversityNameById = (id) => {
    const university = universitiesList.find((u) => u.id === id);
    return university ? university.full_name : "Unknown University";
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

  // Function to handle recommendation button click
  const handleRecommendClick = (profile, e) => {
    e.preventDefault(); // Prevent navigation
    setRecommendingProfile(profile);
    setShowRecommendationModal(true);
  };
  
  // Function to handle successful recommendation submission
  const handleRecommendationSuccess = () => {
    setShowRecommendationModal(false);
    // You could show a success message here if desired
  };

  // Extract unique research areas from profilesData
  const uniqueResearchAreas = (() => {
    // First collect all unique research expertise IDs from profiles
    const uniqueResearchIds = new Set();
    
    profilesData.forEach(profile => {
      if (Array.isArray(profile.research_expertise)) {
        profile.research_expertise.forEach(expertise => {
          uniqueResearchIds.add(expertise);
        });
      }
    });
    
    // Then create the options array with label/value format
    return Array.from(uniqueResearchIds).map(areaId => {
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
  })();

  // Extract unique university IDs and map them using universitiesList
  const uniqueUniversityIds = Array.from(
    new Set(profilesData.map((profile) => profile.university))
  );
  const uniqueUniversities = uniqueUniversityIds.map((id) => {
    const uni = universitiesList.find((u) => u.id === id);
    return {
      value: id ? id.toString() : "",
      label: uni ? uni.short_name : "Unknown University",
    };
  });

  const normalizeAvailability = (val) => {
    if (val === null) return "0";
    if (val === true || val === "1" || val === 1) return "1";
    if (val === false || val === "0" || val === 0) return "0";
    return "";
  };

  // Filter profiles based on selected criteria
  const filteredProfiles = profilesData.filter((profile) => {
    if (!profile) return false;

    // Convert university ID to string for comparison
    const profileUniversity = profile.university ? profile.university.toString() : "";
    
    // Check if the profile's research expertise matches any selected area
    let hasSelectedArea = true;
    if (selectedArea.length > 0) {
      hasSelectedArea = Array.isArray(profile.research_expertise) && 
        profile.research_expertise.some(area => selectedArea.includes(area));
    }
    
    // Check if the profile's university matches any selected university
    const hasSelectedUniversity =
      selectedUniversity.length === 0 || selectedUniversity.includes(profileUniversity);
    
    // Check availability as supervisor
    const availabilityVal = profile.availability_as_supervisor;
    const normalizedAvailability = normalizeAvailability(availabilityVal);
    
    const hasSelectedSupervisorAvailability =
      selectedSupervisorAvailability === "" ||
      normalizedAvailability === selectedSupervisorAvailability;
    
    // Return true if all filters match
    return hasSelectedArea && hasSelectedUniversity && hasSelectedSupervisorAvailability;
  });

  const totalPages = Math.ceil(filteredProfiles.length / profilesPerPage);
  const displayedProfiles = filteredProfiles.slice(
    (currentPage - 1) * profilesPerPage,
    currentPage * profilesPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen flex">
      {/* Mobile title and Filter Toggle Button */}
      <div className="fixed top-20 right-4 z-50 flex items-center space-x-4 lg:hidden">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="bg-blue-600 text-white p-2 rounded-full shadow-lg"
        >
          <FaFilter className="text-xl" />
        </button>
      </div>

      {/* Sidebar for Filters */}
      <div
        ref={filterContainerRef}
        className={`fixed lg:relative top-0 left-0 lg:block lg:w-1/4 w-3/4 h-full bg-gray-100 border-r rounded-lg p-4 transition-transform duration-300 z-50 ${
          showFilters ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <h2 className="text-lg font-semibold mb-4 flex justify-between items-center">
          Filters
          <button onClick={() => setShowFilters(false)} className="text-gray-600 lg:hidden">
            ✕
          </button>
        </h2>
        <div className="space-y-4">
          <FilterDropdown
            label="Research Expertise"
            options={uniqueResearchAreas}
            selectedValues={selectedArea}
            setSelectedValues={setSelectedArea}
          />
          <FilterDropdown
            label="University"
            options={uniqueUniversities}
            selectedValues={selectedUniversity}
            setSelectedValues={setSelectedUniversity}
          />
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Available As Supervisor
            </label>
            <select
              className="p-2 border border-gray-300 rounded w-full pl-4"
              value={selectedSupervisorAvailability}
              onChange={(e) => {
                setSelectedSupervisorAvailability(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">All</option>
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 py-6 sm:py-4 lg:py-0 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
          {displayedProfiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-white shadow-md rounded-lg overflow-hidden relative"
            >
              {/* University Badge */}
              <div className="absolute top-2 left-2 bg-blue-500 text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                {universitiesList.find((u) => u.id === profile.university)?.short_name || "Unknown University"}
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
                    <div className="absolute bottom-0 right-0 p-1 rounded-full group cursor-pointer">
                      <div className="flex items-center justify-center w-7 h-7 bg-blue-500 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      {/* Tooltip */}
                      <div className="absolute bottom-8 right-0 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-3 py-2 shadow-lg z-10 w-48">
                        This account is verified by {getUniversityNameById(profile.university)}
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
                  {Array.isArray(profile.research_expertise) && profile.research_expertise.length > 0
                    ? (() => {
                        const id = profile.research_expertise[0];
                        const matchedOption = researchOptions.find(
                          (option) =>
                            `${option.field_of_research_id}-${option.research_area_id}-${option.niche_domain_id}` === id
                        );
                        return matchedOption
                          ? `${matchedOption.field_of_research_name} - ${matchedOption.research_area_name} - ${matchedOption.niche_domain_name}`
                          : "Unknown";
                      })()
                    : "No Field of Research or Expertise"}
                </p>
                <p className="text-gray-500 text-sm">
                  {profile.current_position ? profile.current_position : "No Position"}
                </p>
                <div className="mt-2 flex justify-center gap-2">
                  <button
                    onClick={() => handleQuickInfoClick(profile)}
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
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 border rounded ${
                currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-white text-gray-700"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {/* No results message */}
        {displayedProfiles.length === 0 && (
          <div className="flex justify-center items-center h-48 w-full">
            <div className="text-center p-6 bg-gray-100 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Matching Academicians</h3>
              <p className="text-gray-600">
                Try adjusting your filters or search criteria to find academicians.
              </p>
            </div>
          </div>
        )}

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
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">Research Expertise</h4>
                      <div className="">
                        {(() => {
                          // Get the research expertise data for academicians
                          let researchArray = selectedProfile.research_expertise || [];

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
                                  return null;
                                })}
                              </div>
                            );
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
      </div>

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
};

export default AcademicianProfileCard; 