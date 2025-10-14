import React, { useRef, useEffect, useState } from 'react';
import Select from 'react-select';
import { FaTimes, FaFilter, FaCheck } from 'react-icons/fa';

export default function FilterPanel({
  searchType,
  searchResults,
  universities,
  faculties,
  researchOptions,
  skills,
  selectedArea,
  setSelectedArea,
  selectedUniversity,
  setSelectedUniversity,
  selectedAvailability,
  setSelectedAvailability,
  selectedSkills,
  setSelectedSkills,
  isOpen = false,
  onClose
}) {
  const filterContainerRef = useRef(null);

  // Handle clicks outside the filter panel to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterContainerRef.current && 
          !filterContainerRef.current.contains(event.target) &&
          isOpen) {
        if (onClose) onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Close on Escape key
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape' && isOpen) {
        if (onClose) onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Don't render if not open
  if (!isOpen) return null;

  // Extract filter options from search results
  const getFilterOptions = () => {
    if (!searchResults || !searchResults.matches) {
      return {
        researchAreas: [],
        universities: [],
        skills: []
      };
    }
    
    // Extract unique research expertise/field IDs
    const uniqueResearchIds = new Set();
    // Extract unique skill IDs from profiles
    const uniqueProfileSkillIds = new Set();
    
    searchResults.matches.forEach(match => {
      const profile = match.academician || match.student || {};
      const researchField = (searchType === 'supervisor' || searchType === 'collaborators' && match.result_type === 'academician')
        ? profile.research_expertise
        : (profile.student_type === 'postgraduate' ? profile.field_of_research : profile.research_preference);
        
      if (Array.isArray(researchField)) {
        researchField.forEach(expertise => {
          uniqueResearchIds.add(expertise);
        });
      }
      
      // Extract skills from profile
      if (Array.isArray(profile.skills)) {
        profile.skills.forEach(skill => {
          if (skill && skill.id) {
            uniqueProfileSkillIds.add(skill.id);
          }
        });
      }
    });
    
    // Filter the global skills list so that only skills used in search results are shown
    const filteredSkillsOptions = (Array.isArray(skills) ? skills : [])
      .filter((skill) => uniqueProfileSkillIds.has(skill.id))
      .map((skill) => {
        // Construct hierarchical label
        let label = skill.name;
        if (skill.subdomain && skill.subdomain.domain) {
          label = `${skill.subdomain.domain.name} - ${skill.subdomain.name} - ${skill.name}`;
        } else if (skill.full_name) {
          label = skill.full_name;
        } else {
          label = skill.name;
        }
        
        return {
          value: skill.id,
          label: label,
        };
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
      const profile = match.academician || match.student || {};
      if (profile.university) {
        uniqueUniversityIds.add(profile.university.toString());
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
      universities: universityOptions,
      skills: filteredSkillsOptions
    };
  };

  const filterOptions = getFilterOptions();
  
  // Get availability label based on search type
  const getAvailabilityLabel = () => {
    if (searchType === 'supervisor') {
      return 'Available for Supervision';
    } else if (searchType === 'students') {
      return 'Looking for Supervision';
    } else if (searchType === 'collaborators') {
      const hasAcademicians = searchResults?.matches?.some(match => match.result_type === 'academician');
      const hasStudents = searchResults?.matches?.some(match => match.result_type !== 'academician');
      
      if (hasAcademicians && !hasStudents) {
        return 'Available for Collaboration';
      } else if (!hasAcademicians && hasStudents) {
        return 'Looking for Supervision';
      } else {
        return 'Availability';
      }
    }
    
    return 'Availability';
  };

  return (
    <>
      {/* Backdrop Overlay with Blur Effect */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Filter Modal Panel - Slides from Right */}
      <div
        ref={filterContainerRef}
        className="fixed top-0 right-0 h-full w-full sm:w-[420px] md:w-[480px] lg:w-[520px] 
                   bg-white shadow-2xl z-50 animate-slideInRight flex flex-col
                   safe-area-inset-right"
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-modal-title"
      >
        {/* Header - Premium Glass Morphism Style */}
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 px-4 sm:px-6 py-4 sm:py-5 shadow-lg">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h2 
                id="filter-modal-title"
                className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2"
              >
                <FaFilter className="text-lg sm:text-xl flex-shrink-0" />
                <span className="truncate">Filters</span>
              </h2>
              <p className="text-blue-100 text-xs sm:text-sm mt-1 truncate">
                Refine your search results
              </p>
            </div>
            
            <button 
              onClick={onClose}
              className="p-2 sm:p-2.5 rounded-lg bg-white/20 hover:bg-white/30 active:bg-white/40 
                       text-white transition-all duration-200 hover:scale-110 active:scale-95 
                       flex-shrink-0 touch-manipulation"
              aria-label="Close filters"
            >
              <FaTimes className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Filter Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 space-y-5 sm:space-y-6">
          {/* Active Filters Count Badge */}
          {(selectedArea.length > 0 || selectedUniversity.length > 0 || selectedSkills?.length > 0 || selectedAvailability) && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 
                          flex items-center gap-2 shadow-sm">
              <FaCheck className="text-blue-600 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-blue-900">
                {(selectedArea.length + selectedUniversity.length + (selectedSkills?.length || 0) + (selectedAvailability ? 1 : 0))} filter(s) active
              </span>
            </div>
          )}
          
          {/* Research Area Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-900">
              Research Area
            </label>
            <Select
              isMulti
              name="researchAreas"
              options={filterOptions.researchAreas}
              value={filterOptions.researchAreas.filter(option => selectedArea.includes(option.value))}
              onChange={(selected) => 
                setSelectedArea(selected ? selected.map(option => option.value) : [])
              }
              placeholder="Select research areas..."
              className="basic-multi-select"
              classNamePrefix="select"
              isSearchable={true}
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: '0.75rem',
                  borderColor: '#e5e7eb',
                  '&:hover': { borderColor: '#3b82f6' }
                })
              }}
            />
          </div>
          
          {/* Elegant Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
          </div>
          
          {/* University Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-900">
              University
            </label>
            <Select
              isMulti
              name="universities"
              options={filterOptions.universities}
              value={filterOptions.universities.filter(option => selectedUniversity.includes(option.value))}
              onChange={(selected) => 
                setSelectedUniversity(selected ? selected.map(option => option.value) : [])
              }
              placeholder="Select universities..."
              className="basic-multi-select"
              classNamePrefix="select"
              isSearchable={true}
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: '0.75rem',
                  borderColor: '#e5e7eb',
                  '&:hover': { borderColor: '#3b82f6' }
                })
              }}
            />
          </div>
          
          {/* Elegant Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
          </div>
          
          {/* Skills Filter - Only show for student/collaborator searches */}
          {(searchType === 'students' || searchType === 'collaborators') && (
            <>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-900">
                  Skills
                </label>
                <Select
                  isMulti
                  name="skills"
                  options={filterOptions.skills}
                  value={filterOptions.skills.filter(option => selectedSkills?.includes(option.value))}
                  onChange={(selected) => 
                    setSelectedSkills(selected ? selected.map(option => option.value) : [])
                  }
                  placeholder="Select skills..."
                  className="basic-multi-select"
                  classNamePrefix="select"
                  isSearchable={true}
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: '0.75rem',
                      borderColor: '#e5e7eb',
                      '&:hover': { borderColor: '#3b82f6' }
                    })
                  }}
                />
              </div>
              
              {/* Elegant Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
              </div>
            </>
          )}
          
          {/* Availability Filter - Hide for collaborators */}
          {searchType !== 'collaborators' && (
            <>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-900">
                  {getAvailabilityLabel()}
                </label>
                <select
                  className="mt-1 block w-full px-4 py-3 text-base border-gray-300 
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                            rounded-xl shadow-sm transition-all duration-200 bg-white hover:border-blue-400"
                  value={selectedAvailability}
                  onChange={(e) => setSelectedAvailability(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </div>
              
              {/* Elegant Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer with Action Buttons - Sticky at Bottom */}
        <div className="border-t border-gray-200 px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 space-y-2.5 sm:space-y-3 
                      shadow-lg sm:shadow-xl">
          {/* Reset Filters Button */}
          <button
            className="w-full px-4 sm:px-5 py-3 sm:py-3.5 
                     bg-white border-2 border-gray-300 hover:border-gray-400 active:border-gray-500
                     rounded-xl text-xs sm:text-sm font-semibold text-gray-700 
                     transition-all duration-200 hover:shadow-md active:scale-98
                     flex items-center justify-center gap-2 
                     touch-manipulation"
            onClick={() => {
              setSelectedArea([]);
              setSelectedUniversity([]);
              setSelectedAvailability("");
              setSelectedSkills([]);
            }}
          >
            <FaTimes className="text-gray-500 flex-shrink-0" />
            <span>Reset All Filters</span>
          </button>
          
          {/* Apply/Close Button */}
          <button
            className="w-full px-4 sm:px-5 py-3 sm:py-3.5 
                     bg-gradient-to-r from-blue-600 to-purple-600 
                     hover:from-blue-700 hover:to-purple-700
                     active:from-blue-800 active:to-purple-800
                     rounded-xl text-xs sm:text-sm font-semibold text-white 
                     transition-all duration-200 hover:shadow-lg active:scale-98
                     flex items-center justify-center gap-2
                     touch-manipulation"
            onClick={onClose}
          >
            <FaCheck className="flex-shrink-0" />
            <span>Apply Filters</span>
          </button>
        </div>
      </div>
    </>
  );
}