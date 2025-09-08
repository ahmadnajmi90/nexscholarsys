import React, { useState, useEffect, useRef } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import FilterDropdown from "@/Components/FilterDropdown";
import { FaEnvelope, FaGoogle, FaGlobe, FaLinkedin, FaFilter, FaUserPlus, FaPaperPlane, FaStar, FaHandsHelping, FaLightbulb, FaClock, FaCheck, FaTimes, FaSpinner } from "react-icons/fa";
import axios from "axios";
import RecommendationModal from "@/Pages/Networking/partials/RecommendationModal";
import RecommendationDisplay from "@/Pages/Networking/partials/RecommendationDisplay";
import BookmarkButton from "@/Components/BookmarkButton";
import ConnectionButton from "@/Components/ConnectionButton";
import SearchBar from "@/Components/SearchBar";
import Pagination from "@/Components/Pagination";
import LoadingSkeletonCard from "./LoadingSkeletonCard";

// Helper function to capitalize each skill
const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

const ProfileGridWithDualFilter = ({
  profilesData,
  supervisorAvailabilityKey,
  universitiesList,
  faculties,
  isPostgraduateList,
  isUndergraduateList,
  isFacultyAdminDashboard,
  users,
  researchOptions,
  searchQuery,
  isLoading,
  onSearch
}) => {
  // Global skills from the backend (all skills in the table)
  const { skills } = usePage().props;

  // Determine which skills are actually used in profilesData
  const uniqueProfileSkillIds = new Set(
    profilesData.flatMap((profile) =>
      Array.isArray(profile.skills) ? profile.skills : []
    )
  );

  // Filter the global skills list so that only skills used in profilesData are shown
  const filteredSkillsOptions = (Array.isArray(skills) ? skills : [])
  .filter((skill) => uniqueProfileSkillIds.has(skill.id))
  .map((skill) => ({
    value: skill.id,
    label: capitalize(skill.name),
  }));


  const [selectedArea, setSelectedArea] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState([]);
  const [selectedSupervisorAvailability, setSelectedSupervisorAvailability] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]); // Skills filter
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false); // Mobile filter toggle
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const profilesPerPage = 9;
  const [showRecommendationModal, setShowRecommendationModal] = useState(false);
  const [recommendingProfile, setRecommendingProfile] = useState(null);
  const [loadingProfileData, setLoadingProfileData] = useState(false);
  
  // Search state - removed as it's now handled by SearchBar component
  
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
    // Set profile for modal display
    setSelectedProfile(profile);
    setIsModalOpen(true);
    setLoadingProfileData(false);
  };

  // Extract unique research areas from profilesData
  const uniqueResearchAreas = Array.from(
    new Set(
      profilesData.flatMap((profile) => {
        const fieldOfResearch = Array.isArray(profile.field_of_research)
          ? profile.field_of_research
          : [];
        const researchExpertise = Array.isArray(profile.research_expertise)
          ? profile.research_expertise
          : [];
        const researchPreference = Array.isArray(profile.research_preference)
          ? profile.research_preference
          : [];
        return [...fieldOfResearch, ...researchExpertise, ...researchPreference];
      })
    )
  ).map((area) => {
    const matchedOption = researchOptions.find(
      (option) =>
        `${option.field_of_research_id}-${option.research_area_id}-${option.niche_domain_id}` === area
    );
    return {
      value: area,
      label: matchedOption
        ? `${matchedOption.field_of_research_name} - ${matchedOption.research_area_name} - ${matchedOption.niche_domain_name}`
        : "Unknown Research Area",
    };
  });

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

  const filteredProfiles = profilesData.filter((profile) => {
    const profileUniversity = profile.university ? profile.university.toString() : "";
    const hasSelectedArea =
      selectedArea.length === 0 ||
      (profile.field_of_research ||
        profile.research_expertise ||
        profile.research_preference ||
        []).some((area) => selectedArea.includes(area));
    const hasSelectedUniversity =
      selectedUniversity.length === 0 || selectedUniversity.includes(profileUniversity);
    const normalizedAvailability = normalizeAvailability(profile[supervisorAvailabilityKey]);
    const hasSelectedSupervisorAvailability =
      selectedSupervisorAvailability === "" ||
      normalizedAvailability === selectedSupervisorAvailability;
    const hasSelectedSkills =
      selectedSkills.length === 0 ||
      (profile.skills && profile.skills.some((skill) => selectedSkills.includes(skill)));
    return hasSelectedArea && hasSelectedUniversity && hasSelectedSupervisorAvailability && hasSelectedSkills;
  });

  const totalPages = Math.ceil(filteredProfiles.length / profilesPerPage);
  const displayedProfiles = filteredProfiles.slice(
    (currentPage - 1) * profilesPerPage,
    currentPage * profilesPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getUniversityNameById = (id) => {
    const university = universitiesList.find((u) => u.id === id);
    return university ? university.full_name : "Unknown University";
  };

  const getFacultyNameById = (id) => {
    const faculty = faculties.find((u) => u.id === id);
    return faculty ? faculty.name : "Unknown University";
  };

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

  return (
    <div className="min-h-screen">
      {/* Mobile Header with Search and Filter */}
      <div className="fixed top-20 right-4 z-50 flex flex-col items-end space-y-2 lg:hidden">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="bg-indigo-600 text-white p-2 rounded-lg shadow-lg"
        >
          <FaFilter className="text-xl" />
        </button>
        <SearchBar
          placeholder={`Search ${isUndergraduateList ? 'undergraduates' : 'postgraduates'}...`}
          onSearch={onSearch}
          className=""
        />
      </div>

      {/* Two-Column Layout */}
      <div className="flex flex-col lg:flex-row gap-6 p-4 md:p-0 md:py-2 lg:p-0 lg:py-2">
        {/* Left Column - Filter Panel */}
        <div className="lg:w-1/4">
          <div
            ref={filterContainerRef}
            className={`fixed lg:relative top-0 left-0 lg:block lg:w-full w-3/4 h-full bg-gray-100 border-r rounded-lg p-4 transition-transform duration-300 z-50 ${
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
                label={isUndergraduateList ? "Preferred Research Area" : "Field of Research"}
                options={uniqueResearchAreas}
                selectedValues={selectedArea}
                setSelectedValues={setSelectedArea}
              />
              {(isPostgraduateList || isUndergraduateList) && (
                <FilterDropdown
                  label="Skills"
                  options={filteredSkillsOptions}
                  selectedValues={selectedSkills}
                  setSelectedValues={setSelectedSkills}
                />
              )}
              {!isFacultyAdminDashboard && (
                <FilterDropdown
                  label="University"
                  options={uniqueUniversities}
                  selectedValues={selectedUniversity}
                  setSelectedValues={setSelectedUniversity}
                />
              )}
              {!isUndergraduateList && (
                <div>
                  {supervisorAvailabilityKey === "availability_as_supervisor" ? (
                    <label className="block text-gray-700 font-medium mb-2">
                      Available As Supervisor
                    </label>
                  ) : (
                    <label className="block text-gray-700 font-medium mb-2">
                      Looking for a supervisor
                    </label>
                  )}
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
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Search Bar and Content */}
        <div className="lg:w-3/4">
          {/* Search Bar - Desktop */}
          <div className="mb-6 hidden lg:block">
            <SearchBar
              placeholder={`Search ${isUndergraduateList ? 'undergraduates' : 'postgraduates'}...`}
              onSearch={onSearch}
              className=""
            />
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6 px-0 md:px-6 lg:px-0">
            {isLoading ? (
              // Show skeleton cards while loading
              Array.from({ length: 9 }, (_, index) => (
                <div key={index} className="w-full">
                  <LoadingSkeletonCard />
                </div>
              ))
            ) : (
              // Show actual profile cards when not loading
              displayedProfiles.map((profile) => (
              <div
                key={profile.id}
                className="bg-white shadow-md rounded-lg overflow-hidden relative"
              >
                {/* University Badge */}
                <div className="absolute top-2 left-2 bg-blue-500 text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                  {universitiesList.find((u) => u.id === profile.university)?.short_name || "Unknown University"}
                </div>

                {!isUndergraduateList && (
                  <div className="relative">
                    {/* Removed the tooltip from here as it's now part of the verified badge */}
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
                    {Array.isArray(profile.field_of_research) && profile.field_of_research.length > 0
                      ? (() => {
                          const id = profile.field_of_research[0];
                          const matchedOption = researchOptions.find(
                            (option) =>
                              `${option.field_of_research_id}-${option.research_area_id}-${option.niche_domain_id}` === id
                          );
                          return matchedOption
                            ? `${matchedOption.field_of_research_name} - ${matchedOption.research_area_name} - ${matchedOption.niche_domain_name}`
                            : "Unknown";
                        })()
                      : Array.isArray(profile.research_preference) && profile.research_preference.length > 0
                      ? (() => {
                          const id = profile.research_preference[0];
                          const matchedOption = researchOptions.find(
                            (option) =>
                              `${option.field_of_research_id}-${option.research_area_id}-${option.niche_domain_id}` === id
                          );
                          return matchedOption
                            ? `${matchedOption.field_of_research_name} - ${matchedOption.research_area_name} - ${matchedOption.niche_domain_name}`
                            : "Unknown";
                        })()
                      : "No Field of Research or Preference"}
                  </p>
                  <div className="mt-2 flex justify-center gap-2">
                    <button
                      onClick={() => handleQuickInfoClick(profile)}
                      className="bg-blue-500 text-white text-[10px] px-2 font-semibold py-1 rounded-full hover:bg-blue-600"
                    >
                      Quick Info
                    </button>
                    <Link
                      href={
                        isPostgraduateList && !isUndergraduateList
                          ? route('postgraduates.show', profile.url)
                          : route('undergraduates.show', profile.url)
                      }
                      className="bg-green-500 text-white text-[10px] px-2 font-semibold py-1 rounded-full hover:bg-green-600"
                    >
                      Full Profile
                    </Link>
                  </div>
                </div>

                {/* Social Action Links - MODIFIED */}
                <div className="flex justify-around items-center mt-6 py-4 border-t px-10">
                  {/* Connection Button */}
                  <ConnectionButton user={profile.user} />
                  
                  <Link
                    href={route('email.compose', { 
                      to: users.find(
                        (user) =>
                          user.unique_id === 
                          (profile.postgraduate_id || profile.undergraduate_id)
                      )?.email 
                    })}
                    className="text-gray-500 text-lg cursor-pointer hover:text-blue-700" 
                    title="Send Email"
                  >
                    <FaPaperPlane className="text-lg" />
                  </Link>
                  <a
                    href={profile.linkedin || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 text-lg hover:text-blue-800"
                    title="LinkedIn"
                  >
                    <FaLinkedin className="text-lg" />
                  </a>
                  <BookmarkButton 
                    bookmarkableType={isUndergraduateList ? "undergraduate" : isPostgraduateList ? "postgraduate" : "academician"}
                    bookmarkableId={profile.id}
                    category={isUndergraduateList ? "Undergraduates" : isPostgraduateList ? "Postgraduates" : "Academicians"}
                    iconSize="text-lg"
                    tooltipPosition="top"
                  />
                </div>
              </div>
            ))
            )}
          </div>

          {/* Pagination */}
          <div className="mt-6">
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
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
                <p className="text-gray-600">Loading profile information...</p>
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
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                      {isPostgraduateList && !isUndergraduateList ? "Field of Research" : "Research Interest"}
                    </h4>
                    <div className="">
                      {(() => {
                        // Get the relevant research data
                        let researchArray = [];
                        // For Postgraduates
                        if (isPostgraduateList && !isUndergraduateList) {
                          researchArray = selectedProfile.field_of_research || [];
                        }
                        // For Undergraduates
                        else {
                          researchArray = selectedProfile.research_preference || [];
                        }

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
                  
                  {/* Skills */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(selectedProfile.skills) && selectedProfile.skills.length > 0 ? (
                        selectedProfile.skills.map((skillId) => {
                          const skillObj = (Array.isArray(skills) ? skills : []).find(s => s.id === skillId);
                          return skillObj ? (
                            <span 
                              key={skillId} 
                              className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
                            >
                              {capitalize(skillObj.name)}
                            </span>
                          ) : null;
                        })
                      ) : (
                        <p className="text-gray-600">No skills listed</p>
                      )}
                    </div>
                  </div>

                  {/* Connect via */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Connect via</h4>
                    <div className="flex items-center space-x-4">
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

export default ProfileGridWithDualFilter;
