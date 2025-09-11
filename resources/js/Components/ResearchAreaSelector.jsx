import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import SelectedResearchAreasDisplay from '@/Components/SelectedResearchAreasDisplay';

export default function ResearchAreaSelector({ 
  value = [], 
  onChange, 
  error = null, 
  required = false, 
  label = "Research Areas",
  placeholder = "Select research areas..." 
}) {
  const [fields, setFields] = useState([]);
  const [areas, setAreas] = useState([]);
  const [niches, setNiches] = useState([]);
  
  const [selectedField, setSelectedField] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedResearchAreas, setSelectedResearchAreas] = useState(value || []);
  
  const [loading, setLoading] = useState({ fields: false, areas: false, niches: false });
  const [isOpen, setIsOpen] = useState(false);

  // Search/filter states for each layer
  const [fieldSearch, setFieldSearch] = useState('');
  const [areaSearch, setAreaSearch] = useState('');
  const [nicheSearch, setNicheSearch] = useState('');

  // Global search states
  const [globalSearch, setGlobalSearch] = useState('');
  const [globalSearchResults, setGlobalSearchResults] = useState([]);
  const [isGlobalSearching, setIsGlobalSearching] = useState(false);
  const [focusedResultIndex, setFocusedResultIndex] = useState(-1);

  // Mobile-specific states
  const [isMobile, setIsMobile] = useState(false);
  const [mobileStep, setMobileStep] = useState(1); // 1: Field, 2: Area, 3: Niches
  const [showMobileGlobalSearch, setShowMobileGlobalSearch] = useState(false);

  // Fetch research area details for display
  const [researchAreaDetails, setResearchAreaDetails] = useState({});

  // Load fields on component mount
  useEffect(() => {
    fetchFields();
    
    // Check if mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load research area details when value changes
  useEffect(() => {
    if (value && value.length > 0) {
      setSelectedResearchAreas(value);
      fetchResearchAreaDetails(value);
    } else {
      setSelectedResearchAreas([]);
      setResearchAreaDetails({});
    }
  }, [value]);

  // Debounced global search effect
  useEffect(() => {
    if (!globalSearch.trim()) {
      setGlobalSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      performGlobalSearch(globalSearch);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [globalSearch]);

  // Fetch all fields
  const fetchFields = async () => {
    setLoading(prev => ({ ...prev, fields: true }));
    try {
      const response = await axios.get('/api/v1/app/fields-of-research');
      setFields(response.data.data || []);
    } catch (error) {
    } finally {
      setLoading(prev => ({ ...prev, fields: false }));
    }
  };

  // Fetch areas when field is selected
  const fetchAreas = async (fieldId) => {
    if (!fieldId) {
      setAreas([]);
      return;
    }

    setLoading(prev => ({ ...prev, areas: true }));
    try {
      const url = `/api/v1/app/research-areas`;
      const params = { field_of_research_id: fieldId };
      const response = await axios.get(url, { params });
      setAreas(response.data.data || []);
    } catch (error) {
      setAreas([]);
    } finally {
      setLoading(prev => ({ ...prev, areas: false }));
    }
  };

  // Fetch niches when area is selected
  const fetchNiches = async (areaId) => {
    if (!areaId) {
      setNiches([]);
      return;
    }

    setLoading(prev => ({ ...prev, niches: true }));
    try {
      const url = `/api/v1/app/niche-domains`;
      const params = { research_area_id: areaId };
      const response = await axios.get(url, { params });
      setNiches(response.data.data || []);
    } catch (error) {
      setNiches([]);
    } finally {
      setLoading(prev => ({ ...prev, niches: false }));
    }
  };

  // Fetch research area details for display
  const fetchResearchAreaDetails = async (researchAreaIds) => {
    if (!researchAreaIds || researchAreaIds.length === 0) {
      setResearchAreaDetails({});
      return;
    }

    try {
      // Parse the IDs and fetch details for each
      const details = {};
      
      for (const researchAreaId of researchAreaIds) {
        const parts = researchAreaId.split('-');
        
        if (parts.length === 3) {
          const [fieldId, areaId, nicheId] = parts;
          
          // Fetch field, area, and niche details
          try {
            const [fieldResponse, areaResponse, nicheResponse] = await Promise.all([
              axios.get(`/api/v1/app/fields-of-research/${fieldId}`),
              axios.get(`/api/v1/app/research-areas/${areaId}`),
              axios.get(`/api/v1/app/niche-domains/${nicheId}`)
            ]);
            
            details[researchAreaId] = {
              id: researchAreaId,
              name: nicheResponse.data.data.name,
              description: nicheResponse.data.data.description || '',
              area: {
                id: areaResponse.data.data.id,
                name: areaResponse.data.data.name,
                field: {
                  id: fieldResponse.data.data.id,
                  name: fieldResponse.data.data.name
                }
              }
            };
          } catch (detailError) {
            // Fallback with just the ID
            details[researchAreaId] = {
              id: researchAreaId,
              name: `Research Area ${researchAreaId}`,
              description: '',
              area: {
                id: areaId,
                name: 'Unknown Area',
                field: {
                  id: fieldId,
                  name: 'Unknown Field'
                }
              }
            };
          }
        } else {
        }
      }
      
      setResearchAreaDetails(details);
    } catch (error) {
    }
  };

  // Handle field selection
  const handleFieldChange = (fieldId) => {
    setSelectedField(fieldId);
    setSelectedArea('');
    setAreas([]);
    setNiches([]);
    setAreaSearch(''); // Reset search when changing field
    setNicheSearch(''); // Reset search when changing field
    
    if (fieldId) {
      fetchAreas(fieldId);
    }
  };

  // Handle area selection
  const handleAreaChange = (areaId) => {
    setSelectedArea(areaId);
    setNiches([]);
    setNicheSearch(''); // Reset search when changing area
    
    if (areaId) {
      fetchNiches(areaId);
    }
  };

  // Enhanced search with multiple criteria
  const enhancedFieldFilter = useMemo(() => {
    return fields.filter(field => {
      const searchTerm = fieldSearch.toLowerCase();
      return field.name.toLowerCase().includes(searchTerm) ||
             (field.description && field.description.toLowerCase().includes(searchTerm));
    });
  }, [fields, fieldSearch]);

  const enhancedAreaFilter = useMemo(() => {
    return areas.filter(area => {
      const searchTerm = areaSearch.toLowerCase();
      return area.name.toLowerCase().includes(searchTerm) ||
             (area.description && area.description.toLowerCase().includes(searchTerm));
    });
  }, [areas, areaSearch]);

  const enhancedNicheFilter = useMemo(() => {
    return niches.filter(niche => {
      const searchTerm = nicheSearch.toLowerCase();
      return niche.name.toLowerCase().includes(searchTerm) ||
             (niche.description && niche.description.toLowerCase().includes(searchTerm));
    });
  }, [niches, nicheSearch]);

  // Filter functions for each layer (kept for backward compatibility)
  const filteredFields = enhancedFieldFilter;
  const filteredAreas = enhancedAreaFilter;
  const filteredNiches = enhancedNicheFilter;

  // Handle research area selection/deselection
  const handleResearchAreaToggle = (niche) => {
    const researchAreaId = `${selectedField}-${selectedArea}-${niche.id}`;
    const isSelected = selectedResearchAreas.includes(researchAreaId);
    let newSelectedResearchAreas;

    if (isSelected) {
      // Remove research area
      newSelectedResearchAreas = selectedResearchAreas.filter(id => id !== researchAreaId);
    } else {
      // Add research area
      newSelectedResearchAreas = [...selectedResearchAreas, researchAreaId];
    }

    setSelectedResearchAreas(newSelectedResearchAreas);
    onChange(newSelectedResearchAreas);

    // Update research area details
    if (!isSelected) {
      const field = fields.find(f => f.id == selectedField);
      const area = areas.find(a => a.id == selectedArea);
      
      setResearchAreaDetails(prev => ({
        ...prev,
        [researchAreaId]: {
          id: researchAreaId,
          name: niche.name,
          description: niche.description || '',
          area: {
            id: area.id,
            name: area.name,
            field: {
              id: field.id,
              name: field.name
            }
          }
        }
      }));
    }
  };

  // Remove research area from selection
  const handleRemoveResearchArea = (researchAreaId) => {
    const newSelectedResearchAreas = selectedResearchAreas.filter(id => id !== researchAreaId);
    setSelectedResearchAreas(newSelectedResearchAreas);
    onChange(newSelectedResearchAreas);
    
    // Remove from research area details
    setResearchAreaDetails(prev => {
      const newDetails = { ...prev };
      delete newDetails[researchAreaId];
      return newDetails;
    });
  };

  // Enhanced global search with error handling and result limiting
  const performGlobalSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setGlobalSearchResults([]);
      return;
    }

    // Minimum search length for better performance
    if (searchTerm.length < 2) {
      return;
    }

    setIsGlobalSearching(true);
    try {
      // Search niche domains with related data
      const url = '/api/v1/app/niche-domains';
      const params = { search: searchTerm, per_page: 15, with_area: true };
      
      const nicheResults = await axios.get(url, { params });
      
      // Format niche results for display
      const nicheData = nicheResults.data.data || [];
      
      const formattedResults = nicheData
        .filter(niche => {
          const hasArea = !!niche.research_area;
          return hasArea;
        })
        .map(niche => {
          const result = {
            id: `${niche.research_area.field_of_research_id}-${niche.research_area_id}-${niche.id}`,
            name: niche.name,
            description: niche.description,
            area: {
              id: niche.research_area_id,
              name: niche.research_area.name,
              field: {
                id: niche.research_area.field_of_research_id,
                name: 'Field' // We'll need field name from another call
              }
            }
          };
          return result;
        })
        .slice(0, 20); // Limit results for better performance
      
      setGlobalSearchResults(formattedResults);
    } catch (error) {
      setGlobalSearchResults([]);
    } finally {
      setIsGlobalSearching(false);
    }
  };

  // Handle global search selection
  const handleGlobalSearchSelect = (researchArea) => {
    // Add research area to selection if not already selected
    if (!selectedResearchAreas.includes(researchArea.id)) {
      const newSelectedResearchAreas = [...selectedResearchAreas, researchArea.id];
      setSelectedResearchAreas(newSelectedResearchAreas);
      onChange(newSelectedResearchAreas);
      
      // Update research area details
      setResearchAreaDetails(prev => ({
        ...prev,
        [researchArea.id]: researchArea
      }));
    }

    // Clear global search
    setGlobalSearch('');
    setGlobalSearchResults([]);
    setFocusedResultIndex(-1);
    setShowMobileGlobalSearch(false);
  };

  // Mobile navigation handlers
  const handleMobileNext = () => {
    if (mobileStep === 1 && selectedField) {
      setMobileStep(2);
    } else if (mobileStep === 2 && selectedArea) {
      setMobileStep(3);
    }
  };

  const handleMobileBack = () => {
    if (mobileStep > 1) {
      setMobileStep(mobileStep - 1);
    }
  };

  const handleMobileCancel = () => {
    setIsOpen(false);
    setMobileStep(1);
    setShowMobileGlobalSearch(false);
    setGlobalSearch('');
    setGlobalSearchResults([]);
  };

  const handleMobileDone = () => {
    setIsOpen(false);
    setMobileStep(1);
    setShowMobileGlobalSearch(false);
    setGlobalSearch('');
    setGlobalSearchResults([]);
  };

  // Mobile field selection handler
  const handleMobileFieldSelect = (fieldId) => {
    handleFieldChange(fieldId);
    setMobileStep(2);
  };

  // Mobile area selection handler
  const handleMobileAreaSelect = (areaId) => {
    handleAreaChange(areaId);
    setMobileStep(3);
  };

  // Handle keyboard navigation in global search
  const handleGlobalSearchKeyDown = useCallback((e) => {
    if (globalSearchResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedResultIndex(prev => 
          prev < globalSearchResults.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedResultIndex(prev => 
          prev > 0 ? prev - 1 : globalSearchResults.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedResultIndex >= 0 && focusedResultIndex < globalSearchResults.length) {
          handleGlobalSearchSelect(globalSearchResults[focusedResultIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setGlobalSearch('');
        setGlobalSearchResults([]);
        setFocusedResultIndex(-1);
        break;
    }
  }, [globalSearchResults, focusedResultIndex, handleGlobalSearchSelect]);

  // Reset focused index when search results change
  useEffect(() => {
    setFocusedResultIndex(-1);
  }, [globalSearchResults]);

  // Calculate current step for progress indicator
  const currentStep = useMemo(() => {
    if (!selectedField) return 1;
    if (!selectedArea) return 2;
    return 3;
  }, [selectedField, selectedArea]);

  // Helper function to highlight search terms
  const highlightSearchTerm = useCallback((text, searchTerm) => {
    if (!searchTerm || !text) return text;
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? 
        <mark key={index} className="bg-yellow-200 text-gray-900">{part}</mark> : 
        part
    );
  }, []);

  // Enhanced search result display function
  const renderSearchResult = useCallback((researchArea, searchTerm = '', index = -1) => {
    const isFocused = index === focusedResultIndex;
    
    return (
      <button
        key={researchArea.id}
        type="button"
        onClick={() => handleGlobalSearchSelect(researchArea)}
        className={`w-full text-left px-3 py-2 focus:outline-none text-sm border-b border-gray-100 last:border-b-0 transition-colors ${
          isFocused 
            ? 'bg-indigo-100 border-indigo-300' 
            : 'hover:bg-indigo-50 focus:bg-indigo-50'
        }`}
        aria-selected={isFocused}
        role="option"
      >
        <div className="font-medium text-gray-900">
          {highlightSearchTerm(researchArea.name, searchTerm)}
        </div>
        <div className="text-xs text-gray-500">
          {researchArea.area?.field?.name} - {researchArea.area?.name}
        </div>
        {researchArea.description && (
          <div className="text-xs text-gray-400 mt-1 line-clamp-2">
            {highlightSearchTerm(researchArea.description, searchTerm)}
          </div>
        )}
        {selectedResearchAreas.includes(researchArea.id) && (
          <div className="text-xs text-green-600 mt-1 font-medium">
            ✓ Already selected
          </div>
        )}
      </button>
    );
  }, [selectedResearchAreas, highlightSearchTerm, handleGlobalSearchSelect, focusedResultIndex]);

  // Mobile step rendering function
  const renderMobileStep = () => {
    if (mobileStep === 1) {
      // Field selection
      return (
        <div className="p-4">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search fields..."
              value={fieldSearch}
              onChange={(e) => setFieldSearch(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base"
            />
          </div>
          <div className="space-y-2">
            {loading.fields ? (
              <div className="p-8 text-center text-gray-500">Loading...</div>
            ) : filteredFields.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No fields found</div>
            ) : (
              filteredFields.map(field => (
                <button
                  key={field.id}
                  type="button"
                  onClick={() => handleMobileFieldSelect(field.id)}
                  className={`w-full text-left p-4 min-h-[48px] border rounded-lg transition-colors ${
                    selectedField === field.id 
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-900' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{field.name}</span>
                    {selectedField === field.id && (
                      <svg className="h-5 w-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      );
    }

    if (mobileStep === 2) {
      // Area selection
      return (
        <div className="p-4">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search areas..."
              value={areaSearch}
              onChange={(e) => setAreaSearch(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base"
            />
          </div>
          <div className="space-y-2">
            {loading.areas ? (
              <div className="p-8 text-center text-gray-500">Loading...</div>
            ) : filteredAreas.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No areas found</div>
            ) : (
              filteredAreas.map(area => (
                <button
                  key={area.id}
                  type="button"
                  onClick={() => handleMobileAreaSelect(area.id)}
                  className={`w-full text-left p-4 min-h-[48px] border rounded-lg transition-colors ${
                    selectedArea === area.id 
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-900' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{area.name}</span>
                    {selectedArea === area.id && (
                      <svg className="h-5 w-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      );
    }

    if (mobileStep === 3) {
      // Niches selection (multi-select)
      return (
        <div className="p-4">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search niches..."
              value={nicheSearch}
              onChange={(e) => setNicheSearch(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base"
            />
          </div>
          <div className="space-y-2">
            {loading.niches ? (
              <div className="p-8 text-center text-gray-500">Loading...</div>
            ) : filteredNiches.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                {niches.length === 0 ? 'No niches available' : 'No niches found matching your search'}
              </div>
            ) : (
              filteredNiches.map(niche => {
                const researchAreaId = `${selectedField}-${selectedArea}-${niche.id}`;
                const isSelected = selectedResearchAreas.includes(researchAreaId);
                return (
                  <button
                    key={niche.id}
                    type="button"
                    onClick={() => handleResearchAreaToggle(niche)}
                    className={`w-full text-left p-4 min-h-[48px] border rounded-lg transition-colors ${
                      isSelected 
                        ? 'bg-green-50 border-green-500 text-green-900' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{niche.name}</div>
                        {niche.description && (
                          <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {niche.description}
                          </div>
                        )}
                      </div>
                      {isSelected && (
                        <svg className="h-5 w-5 text-green-600 ml-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="w-full">
      <InputLabel 
        htmlFor="research-area-selector" 
        value={
          <>
            {label} {required && <span className="text-red-600">*</span>}
          </>
        } 
        required={required}
      />
      
      {/* Selected Research Areas Display - New Hierarchical Layout */}
      <SelectedResearchAreasDisplay 
        selectedResearchAreas={selectedResearchAreas}
        researchAreaDetails={researchAreaDetails}
        onRemoveResearchArea={handleRemoveResearchArea}
        showCounts={true}
        showRemoveButtons={true}
      />

      {/* Research Area Selector Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm bg-white text-left focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
            isMobile ? 'px-4 py-3 text-base' : 'px-3 py-2'
          }`}
        >
          <span className="block truncate text-gray-500">
            {placeholder}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pointer-events-none pr-2">
            <svg
              className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''} ${
                isMobile ? 'h-6 w-6' : 'h-5 w-5'
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </button>

        {/* Enhanced Dropdown Panel */}
        {isOpen && (
          isMobile ? (
            // Mobile Fullscreen Modal
            <div className="fixed inset-0 z-50 bg-white">
              <div className="h-screen flex flex-col">
                {/* Mobile Header */}
                <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 flex-shrink-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      {mobileStep > 1 && (
                        <button
                          type="button"
                          onClick={handleMobileBack}
                          className="p-1 hover:bg-gray-200 rounded"
                          aria-label="Go back"
                        >
                          <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                      )}
                      <h3 className="text-lg font-medium text-gray-900">
                        {mobileStep === 1 ? 'Select Field' : mobileStep === 2 ? 'Select Area' : 'Select Niches'}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowMobileGlobalSearch(!showMobileGlobalSearch)}
                      className="p-2 hover:bg-gray-200 rounded-full"
                      aria-label="Search"
                    >
                      <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1 flex-1">
                      {[1, 2, 3].map((step) => (
                        <div
                          key={step}
                          className={`h-2 flex-1 rounded ${
                            step <= mobileStep ? 'bg-indigo-600' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">
                      Step {mobileStep} of 3
                    </span>
                  </div>
                </div>

                {/* Mobile Global Search */}
                {showMobileGlobalSearch && (
                  <div className="border-b border-gray-200 p-4 bg-white flex-shrink-0">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search all research areas..."
                        value={globalSearch}
                        onChange={(e) => setGlobalSearch(e.target.value)}
                        onKeyDown={handleGlobalSearchKeyDown}
                        className="w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base"
                        aria-label="Search research areas globally"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      {isGlobalSearching && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                          <div className="animate-spin h-5 w-5 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
                        </div>
                      )}
                    </div>
                    
                    {/* Mobile Global Search Results */}
                    {globalSearchResults.length > 0 && (
                      <div className="mt-3 max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
                        {globalSearchResults.map((researchArea, index) => (
                          <button
                            key={researchArea.id}
                            type="button"
                            onClick={() => handleGlobalSearchSelect(researchArea)}
                            className={`w-full text-left p-4 border-b border-gray-100 last:border-b-0 transition-colors ${
                              index === focusedResultIndex ? 'bg-indigo-100' : 'hover:bg-gray-50'
                            }`}
                          >
                            <div className="font-medium text-gray-900">
                              {highlightSearchTerm(researchArea.name, globalSearch)}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              {researchArea.area?.field?.name} - {researchArea.area?.name}
                            </div>
                            {researchArea.description && (
                              <div className="text-sm text-gray-400 mt-1 line-clamp-2">
                                {highlightSearchTerm(researchArea.description, globalSearch)}
                              </div>
                            )}
                            {selectedResearchAreas.includes(researchArea.id) && (
                              <div className="text-sm text-green-600 mt-1 font-medium">
                                ✓ Already selected
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Mobile Content Area */}
                <div className="flex-1 overflow-y-auto">
                  {renderMobileStep()}
                </div>

                {/* Mobile Sticky Footer */}
                <div className="border-t border-gray-200 bg-white p-4 flex-shrink-0">
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={handleMobileCancel}
                      className="flex-1 px-4 py-3 text-base font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      Cancel
                    </button>
                    {mobileStep < 3 ? (
                      <button
                        type="button"
                        onClick={handleMobileNext}
                        disabled={mobileStep === 1 ? !selectedField : !selectedArea}
                        className="flex-1 px-4 py-3 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleMobileDone}
                        className="flex-1 px-4 py-3 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Done ({selectedResearchAreas.length})
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Desktop Dropdown
            <div className="absolute z-20 mt-1 w-full bg-white shadow-xl border border-gray-200 rounded-lg overflow-hidden" style={{minWidth: '600px'}}>
            {/* Header with Progress Indicator */}
            <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-900">Select Research Areas</h3>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${currentStep >= 1 ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
                  <div className={`w-2 h-2 rounded-full ${currentStep >= 2 ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
                  <div className={`w-2 h-2 rounded-full ${currentStep >= 3 ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
                </div>
              </div>
              <div className="text-xs text-gray-600">
                Step {currentStep} of 3: {currentStep === 1 ? 'Select Field' : currentStep === 2 ? 'Select Area' : 'Select Niches'}
              </div>
            </div>

            {/* Global Search */}
            <div className="border-b border-gray-200 p-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search all research areas globally..."
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  onKeyDown={handleGlobalSearchKeyDown}
                  className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  aria-label="Search research areas globally"
                  aria-describedby="global-search-help"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {isGlobalSearching && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <div className="animate-spin h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
                  </div>
                )}
              </div>
              
              {/* Global Search Results */}
              {globalSearchResults.length > 0 && (
                <div 
                  className="mt-2 max-h-40 overflow-y-auto border border-gray-200 rounded-md"
                  role="listbox"
                  aria-label="Search results"
                >
                  {globalSearchResults.map((researchArea, index) => renderSearchResult(researchArea, globalSearch, index))}
                </div>
              )}
              
              {/* Search help text */}
              {globalSearch.trim() && (
                <div id="global-search-help" className="mt-1 text-xs text-gray-500">
                  Use ↑↓ to navigate, Enter to select, Esc to clear
                </div>
              )}
              
              {/* No results message */}
              {globalSearch.trim() && !isGlobalSearching && globalSearchResults.length === 0 && (
                <div className="mt-2 p-3 text-sm text-gray-500 text-center border border-gray-200 rounded-md">
                  No research areas found for "{globalSearch}"
                </div>
              )}
            </div>

            {/* Three Column Layout */}
            <div className="flex" style={{height: '300px'}}>
              {/* Left Column - Fields */}
              <div className="w-1/3 border-r border-gray-200 flex flex-col">
                <div className="p-3 border-b border-gray-200 bg-gray-50">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Fields</h4>
                  <input
                    type="text"
                    placeholder="Search fields..."
                    value={fieldSearch}
                    onChange={(e) => setFieldSearch(e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex-1 overflow-y-auto">
                  {loading.fields ? (
                    <div className="p-4 text-center text-sm text-gray-500">Loading...</div>
                  ) : filteredFields.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500">No fields found</div>
                  ) : (
                    filteredFields.map(field => (
                      <button
                        key={field.id}
                        type="button"
                        onClick={() => handleFieldChange(field.id)}
                        className={`w-full text-left px-3 py-3 hover:bg-gray-50 focus:outline-none border-b border-gray-100 text-sm ${
                          selectedField === field.id 
                            ? 'bg-indigo-50 border-l-4 border-l-indigo-500 text-indigo-900 font-medium' 
                            : 'text-gray-700'
                        }`}
                      >
                        {field.name}
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Middle Column - Areas */}
              <div className="w-1/3 border-r border-gray-200 flex flex-col">
                <div className="p-3 border-b border-gray-200 bg-gray-50">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Areas</h4>
                  {selectedField && (
                    <input
                      type="text"
                      placeholder="Search areas..."
                      value={areaSearch}
                      onChange={(e) => setAreaSearch(e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  )}
                </div>
                <div className="flex-1 overflow-y-auto">
                  {!selectedField ? (
                    <div className="p-4 text-center text-sm text-gray-500">Select a field first</div>
                  ) : loading.areas ? (
                    <div className="p-4 text-center text-sm text-gray-500">Loading...</div>
                  ) : filteredAreas.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500">No areas found</div>
                  ) : (
                    filteredAreas.map(area => (
                      <button
                        key={area.id}
                        type="button"
                        onClick={() => handleAreaChange(area.id)}
                        className={`w-full text-left px-3 py-3 hover:bg-gray-50 focus:outline-none border-b border-gray-100 text-sm ${
                          selectedArea === area.id 
                            ? 'bg-indigo-50 border-l-4 border-l-indigo-500 text-indigo-900 font-medium' 
                            : 'text-gray-700'
                        }`}
                      >
                        {area.name}
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Right Column - Niches */}
              <div className="w-1/3 flex flex-col">
                <div className="p-3 border-b border-gray-200 bg-gray-50">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Niches</h4>
                  {selectedArea && (
                    <input
                      type="text"
                      placeholder="Search niches..."
                      value={nicheSearch}
                      onChange={(e) => setNicheSearch(e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  )}
                </div>
                <div className="flex-1 overflow-y-auto">
                  {!selectedArea ? (
                    <div className="p-4 text-center text-sm text-gray-500">Select an area first</div>
                  ) : loading.niches ? (
                    <div className="p-4 text-center text-sm text-gray-500">Loading...</div>
                  ) : filteredNiches.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500">
                      {niches.length === 0 ? 'No niches available' : 'No niches found matching your search'}
                    </div>
                  ) : (
                    filteredNiches.map(niche => {
                      const researchAreaId = `${selectedField}-${selectedArea}-${niche.id}`;
                      const isSelected = selectedResearchAreas.includes(researchAreaId);
                      return (
                        <button
                          key={niche.id}
                          type="button"
                          onClick={() => handleResearchAreaToggle(niche)}
                          className={`w-full text-left px-3 py-3 hover:bg-gray-50 focus:outline-none border-b border-gray-100 text-sm ${
                            isSelected 
                              ? 'bg-green-50 border-l-4 border-l-green-500 text-green-900 font-medium' 
                              : 'text-gray-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="font-medium">{niche.name}</div>
                              {niche.description && (
                                <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                                  {niche.description}
                                </div>
                              )}
                            </div>
                            {isSelected && (
                              <svg className="h-4 w-4 text-green-600 ml-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

              {/* Sticky Footer with Done Button */}
              <div className="border-t border-gray-200 bg-white p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {selectedResearchAreas.length} research area{selectedResearchAreas.length !== 1 ? 's' : ''} selected
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      <InputError className="mt-2" message={error} />
    </div>
  );
}

// PropTypes for type safety
ResearchAreaSelector.propTypes = {
  value: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  required: PropTypes.bool,
  label: PropTypes.string,
  placeholder: PropTypes.string
};

// Default props
ResearchAreaSelector.defaultProps = {
  value: [],
  error: null,
  required: false,
  label: 'Research Areas',
  placeholder: 'Select research areas...'
};