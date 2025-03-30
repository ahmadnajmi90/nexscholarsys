import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import FilterDropdown from "@/Components/FilterDropdown";
import { FaEnvelope, FaGoogle, FaGlobe, FaLinkedin, FaFilter } from "react-icons/fa";

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

  const handleQuickInfoClick = (profile) => {
    setSelectedProfile(profile);
    setIsModalOpen(true);
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

  return (
    <div className="min-h-screen flex">
      {/* Mobile Filter Toggle Button */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="fixed top-20 right-4 z-50 bg-blue-600 text-white p-2 rounded-full shadow-lg lg:hidden"
      >
        <FaFilter className="text-xl" />
      </button>

      {/* Sidebar for Filters */}
      <div
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

              {!isUndergraduateList && (
                <div className="relative group">
                  {profile.verified === 1 && (
                    <span className="absolute top-2 right-2 whitespace-nowrap rounded-full bg-purple-100 px-2.5 py-0.5 text-[10px] text-purple-700 cursor-pointer">
                      Verified
                    </span>
                  )}
                  {profile.verified !== 1 && (
                    <span className="absolute top-2 right-2 whitespace-nowrap rounded-full bg-red-100 px-2.5 py-0.5 text-[10px] text-red-700 cursor-pointer">
                      Not Verified
                    </span>
                  )}
                  <div className="absolute top-8 right-0 hidden group-hover:flex items-center bg-gray-800 text-white text-xs rounded px-3 py-2 shadow-lg z-10">
                    {profile.verified === 1
                      ? `This account is verified by ${getUniversityNameById(profile.university)}`
                      : "This account is not verified"}
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
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <img
                    src={profile.profile_picture !== null ? `/storage/${profile.profile_picture}` : "/storage/profile_pictures/default.jpg"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
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
                    : Array.isArray(profile.research_expertise) && profile.research_expertise.length > 0
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
                    : "No Field of Research or Expertise"}
                </p>
                {/* Only show position for Academicians */}
                {!isPostgraduateList && !isUndergraduateList && (
                  <p className="text-gray-500 text-sm">
                    {profile.current_position ? profile.current_position : "No Position"}
                  </p>
                )}
                <div className="mt-2 flex justify-center gap-2">
                  <button
                    onClick={() => handleQuickInfoClick(profile)}
                    className="bg-blue-500 text-white text-[10px] px-2 font-semibold py-1 rounded-full hover:bg-blue-600"
                  >
                    Quick Info
                  </button>
                  <Link
                    href={
                      !isPostgraduateList && !isUndergraduateList
                        ? route('academicians.show', profile.url)
                        : isPostgraduateList && !isUndergraduateList
                        ? route('postgraduates.show', profile.url)
                        : route('undergraduates.show', profile.url)
                    }
                    className="bg-green-500 text-white text-[10px] px-2 font-semibold py-1 rounded-full hover:bg-green-600"
                  >
                    Full Profile
                  </Link>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex justify-around items-center mt-6 py-4 border-t px-10">
                <Link
                  href={route('email.compose', { 
                    to: users.find(
                      (user) =>
                        user.unique_id === 
                        (profile.academician_id || profile.postgraduate_id || profile.undergraduate_id)
                    )?.email 
                  })}
                  className="text-gray-500 text-sm cursor-pointer hover:text-blue-700" 
                  title="Send Email"
                >
                  <FaEnvelope />
                </Link>
                <a
                  href={profile.google_scholar}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 text-sm hover:text-red-700"
                  title="Google Scholar"
                >
                  <FaGoogle />
                </a>
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 text-sm hover:text-green-700"
                  title="Website"
                >
                  <FaGlobe />
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 text-sm hover:text-blue-800"
                  title="LinkedIn"
                >
                  <FaLinkedin />
                </a>
              </div>
            </div>
          ))}
          {isModalOpen && selectedProfile && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-lg relative max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h3 className="text-xl font-bold mb-4 text-gray-800 text-center">
                {selectedProfile.full_name}
              </h3>
              <div className="space-y-6">
                {/* Research Information */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">
                    {!isPostgraduateList && !isUndergraduateList 
                      ? "Research Expertise"
                      : isPostgraduateList && !isUndergraduateList
                      ? "Field of Research"
                      : "Research Preference"}
                  </h4>
                  <div className="pl-4 space-y-1">
                    {(() => {
                      let researchArray = [];
                      // For Academicians
                      if (!isPostgraduateList && !isUndergraduateList) {
                        researchArray = selectedProfile.research_expertise || [];
                      }
                      // For Postgraduates
                      else if (isPostgraduateList && !isUndergraduateList) {
                        researchArray = selectedProfile.field_of_research || [];
                      }
                      // For Undergraduates
                      else {
                        researchArray = selectedProfile.research_preference || [];
                      }

                      if (Array.isArray(researchArray) && researchArray.length > 0) {
                        return researchArray.map((id, index) => {
                          const matchedOption = researchOptions.find(
                            (option) =>
                              `${option.field_of_research_id}-${option.research_area_id}-${option.niche_domain_id}` === id
                          );
                          if (!matchedOption) return null;
                          return (
                            <p key={index} className="text-gray-600">
                              {index + 1}. {matchedOption.field_of_research_name} - {matchedOption.research_area_name} - {matchedOption.niche_domain_name}
                            </p>
                          );
                        });
                      }
                      return <p className="text-gray-600">Not Provided</p>;
                    })()}
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Bio</h4>
                  <p className="text-gray-600 whitespace-pre-line">
                    {selectedProfile.bio || "Not Provided"}
                  </p>
                </div>
              </div>
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
  
        {/* Pagination */}
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 border rounded ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-white text-gray-700"}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileGridWithDualFilter;
