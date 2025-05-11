import React from 'react';
import Select from 'react-select';
import { FaTimes } from 'react-icons/fa';

export default function FilterPanel({
  searchType,
  searchResults,
  universities,
  faculties,
  researchOptions,
  selectedArea,
  setSelectedArea,
  selectedUniversity,
  setSelectedUniversity,
  selectedAvailability,
  setSelectedAvailability,
  onClose = null // For mobile close button
}) {
  // Extract filter options from search results
  const getFilterOptions = () => {
    if (!searchResults || !searchResults.matches) {
      return {
        researchAreas: [],
        universities: []
      };
    }
    
    // Extract unique research expertise/field IDs
    const uniqueResearchIds = new Set();
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
      universities: universityOptions
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
      // For collaborators, the label depends on the profile types in the results
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
  
  // Get the availability key based on search type
  const getAvailabilityKey = () => {
    if (searchType === 'supervisor') {
      return 'availability_as_supervisor';
    } else if (searchType === 'students') {
      return 'supervisorAvailability';
    } else if (searchType === 'collaborators') {
      // For simplicity, we'll use the same key for both types in collaborators view
      return 'availability_as_supervisor';
    }
    
    return 'availability';
  };

  return (
    <div className="bg-white rounded-lg shadow p-5 mb-6">
      {/* Mobile Close Button */}
      {onClose && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Filters</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>
      )}
      
      {/* Desktop Title */}
      {!onClose && (
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
      )}
      
      {/* Research Area Filter */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">
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
          placeholder="Filter by research area..."
          className="basic-multi-select"
          classNamePrefix="select"
          isSearchable={true}
        />
      </div>
      
      {/* University Filter */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">
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
          placeholder="Filter by university..."
          className="basic-multi-select"
          classNamePrefix="select"
          isSearchable={true}
        />
      </div>
      
      {/* Availability Filter - Hide for collaborators */}
      {searchType !== 'collaborators' && (
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {getAvailabilityLabel()}
          </label>
          <select
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 
                      focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm 
                      rounded-md"
            value={selectedAvailability}
            onChange={(e) => setSelectedAvailability(e.target.value)}
          >
            <option value="">All</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>
      )}
      
      {/* Reset Filters Button */}
      <button
        className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm 
                font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none 
                focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        onClick={() => {
          setSelectedArea([]);
          setSelectedUniversity([]);
          setSelectedAvailability("");
        }}
      >
        Reset All Filters
      </button>
    </div>
  );
} 