import React, { useState } from "react";
import { usePage } from "@inertiajs/react";
import FilterDropdown from "@/Components/FilterDropdown";
import { FaFilter } from "react-icons/fa";
import SupervisorProfileCard from "./SupervisorProfileCard";

const SupervisorFilterGrid = ({
  profilesData,
  universitiesList,
  faculties,
  users,
  researchOptions,
  searchQuery
}) => {
  const [selectedArea, setSelectedArea] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState([]);
  const [selectedSupervisorAvailability, setSelectedSupervisorAvailability] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const profilesPerPage = 9;

  // Updated research area extraction with better debugging
  // Extract unique research areas from profilesData using the researchOptions format
  console.log('Research options format sample:', researchOptions.length > 0 ? researchOptions[0] : 'No options');

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

    // For debugging
    console.log('Unique research IDs found:', Array.from(uniqueResearchIds));
    
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
        console.log('No match found for research ID:', areaId);
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

  // Add debugging to see the profiles data
  console.log('Profiles data sample:', profilesData.length > 0 ? profilesData[0] : 'No profiles');

  // Improve the filteredProfiles function
  const filteredProfiles = profilesData.filter((profile) => {
    // For debugging
    if (!profile) {
      console.warn('Empty profile in filterProfiles');
      return false;
    }

    // Convert university ID to string for comparison
    const profileUniversity = profile.university ? profile.university.toString() : "";
    
    // Check if the profile's research expertise matches any selected area
    let hasSelectedArea = true;
    if (selectedArea.length > 0) {
      hasSelectedArea = Array.isArray(profile.research_expertise) && 
        profile.research_expertise.some(area => selectedArea.includes(area));
      
      // Debug log if research expertise doesn't match
      if (!hasSelectedArea && selectedArea.length > 0) {
        console.log('Research area mismatch for profile:', profile.id, 
          'Has:', profile.research_expertise, 
          'Looking for:', selectedArea);
      }
    }
    
    // Check if the profile's university matches any selected university
    const hasSelectedUniversity =
      selectedUniversity.length === 0 || selectedUniversity.includes(profileUniversity);
    
    // Check availability as supervisor - handle both boolean and string/number values
    const availabilityVal = profile.availability_as_supervisor;
    const normalizedAvailability = normalizeAvailability(availabilityVal);
    
    const hasSelectedSupervisorAvailability =
      selectedSupervisorAvailability === "" ||
      normalizedAvailability === selectedSupervisorAvailability;
    
    // Debug log if supervisor availability doesn't match
    if (!hasSelectedSupervisorAvailability && selectedSupervisorAvailability !== "") {
      console.log('Supervisor availability mismatch for profile:', profile.id, 
        'Has:', availabilityVal, 
        'Normalized:', normalizedAvailability,
        'Looking for:', selectedSupervisorAvailability);
    }
    
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
            label="Field of Research"
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
            <SupervisorProfileCard
              key={profile.id}
              profile={profile}
              universitiesList={universitiesList}
              faculties={faculties}
              users={users}
              researchOptions={researchOptions}
              aiInsights={profile.ai_insight}
              searchQuery={searchQuery}
            />
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
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Matching Supervisors</h3>
              <p className="text-gray-600">
                Try adjusting your filters or search criteria to find potential supervisors.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupervisorFilterGrid; 