import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

export default function SkillsSelector({ 
  value = [], 
  onChange, 
  error = null, 
  required = false, 
  label = "Skills",
  placeholder = "Select skills..." 
}) {
  const [domains, setDomains] = useState([]);
  const [subdomains, setSubdomains] = useState([]);
  const [skills, setSkills] = useState([]);
  
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedSubdomain, setSelectedSubdomain] = useState('');
  const [selectedSkills, setSelectedSkills] = useState(value || []);
  
  const [loading, setLoading] = useState({ domains: false, subdomains: false, skills: false });
  const [isOpen, setIsOpen] = useState(false);

  // Search/filter states for each layer
  const [domainSearch, setDomainSearch] = useState('');
  const [subdomainSearch, setSubdomainSearch] = useState('');
  const [skillsSearch, setSkillsSearch] = useState('');

  // Global search states
  const [globalSearch, setGlobalSearch] = useState('');
  const [globalSearchResults, setGlobalSearchResults] = useState([]);
  const [isGlobalSearching, setIsGlobalSearching] = useState(false);
  const [focusedResultIndex, setFocusedResultIndex] = useState(-1);

  // Mobile-specific states
  const [isMobile, setIsMobile] = useState(false);
  const [mobileStep, setMobileStep] = useState(1); // 1: Domain, 2: Subdomain, 3: Skills
  const [showMobileGlobalSearch, setShowMobileGlobalSearch] = useState(false);

  // Fetch skill details for display
  const [skillDetails, setSkillDetails] = useState({});

  // Load domains on component mount
  useEffect(() => {
    fetchDomains();
    
    // Check if mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load skill details when value changes
  useEffect(() => {
    if (value && value.length > 0) {
      setSelectedSkills(value);
      fetchSkillDetails(value);
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

  // Fetch all domains
  const fetchDomains = async () => {
    setLoading(prev => ({ ...prev, domains: true }));
    try {
      const response = await axios.get('/api/v1/app/skills/domains');
      setDomains(response.data.data || []);
    } catch (error) {
      console.error('Error fetching domains:', error);
    } finally {
      setLoading(prev => ({ ...prev, domains: false }));
    }
  };

  // Fetch subdomains when domain is selected
  const fetchSubdomains = async (domainId) => {
    if (!domainId) {
      setSubdomains([]);
      return;
    }

    setLoading(prev => ({ ...prev, subdomains: true }));
    try {
      const response = await axios.get(`/api/v1/app/skills/domains/${domainId}/subdomains`);
      setSubdomains(response.data.data || []);
    } catch (error) {
      console.error('Error fetching subdomains:', error);
      setSubdomains([]);
    } finally {
      setLoading(prev => ({ ...prev, subdomains: false }));
    }
  };

  // Fetch skills when subdomain is selected
  const fetchSkills = async (subdomainId) => {
    if (!subdomainId) {
      setSkills([]);
      return;
    }

    setLoading(prev => ({ ...prev, skills: true }));
    try {
      const response = await axios.get(`/api/v1/app/skills/subdomains/${subdomainId}/skills`);
      setSkills(response.data.data || []);
    } catch (error) {
      console.error('Error fetching skills:', error);
      setSkills([]);
    } finally {
      setLoading(prev => ({ ...prev, skills: false }));
    }
  };

  // Fetch skill details for display
  const fetchSkillDetails = async (skillIds) => {
    if (!skillIds || skillIds.length === 0) {
      setSkillDetails({});
      return;
    }

    try {
      const response = await axios.post('/api/v1/app/skills/details', {
        skill_ids: skillIds
      });
      
      const details = {};
      response.data.data.forEach(skill => {
        details[skill.id] = skill;
      });
      setSkillDetails(details);
    } catch (error) {
      console.error('Error fetching skill details:', error);
    }
  };

  // Handle domain selection
  const handleDomainChange = (domainId) => {
    setSelectedDomain(domainId);
    setSelectedSubdomain('');
    setSubdomains([]);
    setSkills([]);
    setSubdomainSearch(''); // Reset search when changing domain
    setSkillsSearch(''); // Reset search when changing domain
    
    if (domainId) {
      fetchSubdomains(domainId);
    }
  };

  // Handle subdomain selection
  const handleSubdomainChange = (subdomainId) => {
    setSelectedSubdomain(subdomainId);
    setSkills([]);
    setSkillsSearch(''); // Reset search when changing subdomain
    
    if (subdomainId) {
      fetchSkills(subdomainId);
    }
  };

  // Enhanced search with multiple criteria
  const enhancedDomainFilter = useMemo(() => {
    return domains.filter(domain => {
      const searchTerm = domainSearch.toLowerCase();
      return domain.name.toLowerCase().includes(searchTerm) ||
             (domain.description && domain.description.toLowerCase().includes(searchTerm));
    });
  }, [domains, domainSearch]);

  const enhancedSubdomainFilter = useMemo(() => {
    return subdomains.filter(subdomain => {
      const searchTerm = subdomainSearch.toLowerCase();
      return subdomain.name.toLowerCase().includes(searchTerm) ||
             (subdomain.description && subdomain.description.toLowerCase().includes(searchTerm));
    });
  }, [subdomains, subdomainSearch]);

  const enhancedSkillsFilter = useMemo(() => {
    return skills.filter(skill => {
      const searchTerm = skillsSearch.toLowerCase();
      return skill.name.toLowerCase().includes(searchTerm) ||
             (skill.description && skill.description.toLowerCase().includes(searchTerm)) ||
             (skill.full_name && skill.full_name.toLowerCase().includes(searchTerm));
    });
  }, [skills, skillsSearch]);

  // Filter functions for each layer (kept for backward compatibility)
  const filteredDomains = enhancedDomainFilter;
  const filteredSubdomains = enhancedSubdomainFilter;
  const filteredSkills = enhancedSkillsFilter;

  // Handle skill selection/deselection
  const handleSkillToggle = (skill) => {
    const isSelected = selectedSkills.includes(skill.id);
    let newSelectedSkills;

    if (isSelected) {
      // Remove skill
      newSelectedSkills = selectedSkills.filter(id => id !== skill.id);
    } else {
      // Add skill
      newSelectedSkills = [...selectedSkills, skill.id];
    }

    setSelectedSkills(newSelectedSkills);
    onChange(newSelectedSkills);

    // Update skill details
    if (!isSelected) {
      setSkillDetails(prev => ({
        ...prev,
        [skill.id]: skill
      }));
    }
  };

  // Remove skill from selection
  const handleRemoveSkill = (skillId) => {
    const newSelectedSkills = selectedSkills.filter(id => id !== skillId);
    setSelectedSkills(newSelectedSkills);
    onChange(newSelectedSkills);
    
    // Remove from skill details
    setSkillDetails(prev => {
      const newDetails = { ...prev };
      delete newDetails[skillId];
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
      const response = await axios.get('/api/v1/app/skills/search', {
        params: { 
          q: searchTerm,
          limit: 20 // Limit results for better performance
        },
        timeout: 5000 // 5 second timeout
      });
      
      const results = response.data.data || [];
      
      // Sort results by relevance (exact matches first, then partial matches)
      const sortedResults = results.sort((a, b) => {
        const aExact = a.name.toLowerCase() === searchTerm.toLowerCase();
        const bExact = b.name.toLowerCase() === searchTerm.toLowerCase();
        
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        
        // Then by name length (shorter names are more relevant)
        return a.name.length - b.name.length;
      });
      
      setGlobalSearchResults(sortedResults);
    } catch (error) {
      console.error('Error performing global search:', error);
      setGlobalSearchResults([]);
      
      // Optional: Show user-friendly error message
      if (error.code === 'ECONNABORTED') {
        console.warn('Search request timed out');
      }
    } finally {
      setIsGlobalSearching(false);
    }
  };

  // Handle global search selection
  const handleGlobalSearchSelect = (skill) => {
    // Add skill to selection if not already selected
    if (!selectedSkills.includes(skill.id)) {
      const newSelectedSkills = [...selectedSkills, skill.id];
      setSelectedSkills(newSelectedSkills);
      onChange(newSelectedSkills);
      
      // Update skill details
      setSkillDetails(prev => ({
        ...prev,
        [skill.id]: skill
      }));
    }

    // Auto-navigate to the skill's domain and subdomain
    if (skill.subdomain?.domain?.id && skill.subdomain?.id) {
      setSelectedDomain(skill.subdomain.domain.id);
      fetchSubdomains(skill.subdomain.domain.id);
      
      setTimeout(() => {
        setSelectedSubdomain(skill.subdomain.id);
        fetchSkills(skill.subdomain.id);
        
        // On mobile, navigate to skills step
        if (isMobile) {
          setMobileStep(3);
        }
      }, 100);
    }

    // Clear global search
    setGlobalSearch('');
    setGlobalSearchResults([]);
    setFocusedResultIndex(-1);
    setShowMobileGlobalSearch(false);
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

  // Mobile navigation handlers
  const handleMobileNext = () => {
    if (mobileStep === 1 && selectedDomain) {
      setMobileStep(2);
    } else if (mobileStep === 2 && selectedSubdomain) {
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

  // Mobile domain selection handler
  const handleMobileDomainSelect = (domainId) => {
    handleDomainChange(domainId);
    setMobileStep(2);
  };

  // Mobile subdomain selection handler
  const handleMobileSubdomainSelect = (subdomainId) => {
    handleSubdomainChange(subdomainId);
    setMobileStep(3);
  };

  // Calculate current step for progress indicator
  const currentStep = useMemo(() => {
    if (!selectedDomain) return 1;
    if (!selectedSubdomain) return 2;
    return 3;
  }, [selectedDomain, selectedSubdomain]);

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
  const renderSearchResult = useCallback((skill, searchTerm = '', index = -1) => {
    const isFocused = index === focusedResultIndex;
    
    return (
      <button
        key={skill.id}
        type="button"
        onClick={() => handleGlobalSearchSelect(skill)}
        className={`w-full text-left px-3 py-2 focus:outline-none text-sm border-b border-gray-100 last:border-b-0 transition-colors ${
          isFocused 
            ? 'bg-indigo-100 border-indigo-300' 
            : 'hover:bg-indigo-50 focus:bg-indigo-50'
        }`}
        aria-selected={isFocused}
        role="option"
      >
        <div className="font-medium text-gray-900">
          {highlightSearchTerm(skill.name, searchTerm)}
        </div>
        <div className="text-xs text-gray-500">
          {skill.subdomain?.domain?.name} - {skill.subdomain?.name}
        </div>
        {skill.description && (
          <div className="text-xs text-gray-400 mt-1 line-clamp-2">
            {highlightSearchTerm(skill.description, searchTerm)}
          </div>
        )}
        {selectedSkills.includes(skill.id) && (
          <div className="text-xs text-green-600 mt-1 font-medium">
            ✓ Already selected
          </div>
        )}
      </button>
    );
  }, [selectedSkills, highlightSearchTerm, handleGlobalSearchSelect, focusedResultIndex]);

  // Mobile step rendering function
  const renderMobileStep = () => {
    if (mobileStep === 1) {
      // Domain selection
      return (
        <div className="p-4">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search domains..."
              value={domainSearch}
              onChange={(e) => setDomainSearch(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base"
            />
          </div>
          <div className="space-y-2">
            {loading.domains ? (
              <div className="p-8 text-center text-gray-500">Loading...</div>
            ) : filteredDomains.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No domains found</div>
            ) : (
              filteredDomains.map(domain => (
                <button
                  key={domain.id}
                  type="button"
                  onClick={() => handleMobileDomainSelect(domain.id)}
                  className={`w-full text-left p-4 min-h-[48px] border rounded-lg transition-colors ${
                    selectedDomain === domain.id 
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-900' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{domain.name}</span>
                    {selectedDomain === domain.id && (
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
      // Subdomain selection
      return (
        <div className="p-4">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search subdomains..."
              value={subdomainSearch}
              onChange={(e) => setSubdomainSearch(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base"
            />
          </div>
          <div className="space-y-2">
            {loading.subdomains ? (
              <div className="p-8 text-center text-gray-500">Loading...</div>
            ) : filteredSubdomains.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No subdomains found</div>
            ) : (
              filteredSubdomains.map(subdomain => (
                <button
                  key={subdomain.id}
                  type="button"
                  onClick={() => handleMobileSubdomainSelect(subdomain.id)}
                  className={`w-full text-left p-4 min-h-[48px] border rounded-lg transition-colors ${
                    selectedSubdomain === subdomain.id 
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-900' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{subdomain.name}</span>
                    {selectedSubdomain === subdomain.id && (
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
      // Skills selection (multi-select)
      return (
        <div className="p-4">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search skills..."
              value={skillsSearch}
              onChange={(e) => setSkillsSearch(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base"
            />
          </div>
          <div className="space-y-2">
            {loading.skills ? (
              <div className="p-8 text-center text-gray-500">Loading...</div>
            ) : filteredSkills.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                {skills.length === 0 ? 'No skills available' : 'No skills found matching your search'}
              </div>
            ) : (
              filteredSkills.map(skill => {
                const isSelected = selectedSkills.includes(skill.id);
                return (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() => handleSkillToggle(skill)}
                    className={`w-full text-left p-4 min-h-[48px] border rounded-lg transition-colors ${
                      isSelected 
                        ? 'bg-green-50 border-green-500 text-green-900' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{skill.name}</div>
                        {skill.description && (
                          <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {skill.description}
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
        htmlFor="skills-selector" 
        value={
          <>
            {label} {required && <span className="text-red-600">*</span>}
          </>
        } 
        required={required}
      />
      
      {/* Selected Skills Display */}
      {selectedSkills.length > 0 && (
        <div className="mt-2 mb-3">
          <div className={`flex flex-wrap gap-2 ${isMobile ? 'gap-3' : 'gap-2'}`}>
            {selectedSkills.map(skillId => {
              const skill = skillDetails[skillId];
              if (!skill) return null;
              
              return (
                <div
                  key={skillId}
                  className={`inline-flex items-center rounded-full text-sm bg-blue-100 text-blue-800 ${
                    isMobile ? 'px-4 py-2 text-base' : 'px-3 py-1'
                  }`}
                >
                  <span className="mr-2">
                    {isMobile ? (
                      // Mobile: Show full hierarchy on separate lines
                      <div className="text-left">
                        <div className="font-medium">{skill.name}</div>
                        <div className="text-xs text-blue-600 opacity-75">
                          {skill.subdomain?.domain?.name} - {skill.subdomain?.name}
                        </div>
                      </div>
                    ) : (
                      // Desktop: Show single line hierarchy
                      `${skill.subdomain?.domain?.name} - ${skill.subdomain?.name} - ${skill.name}`
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skillId)}
                    className={`flex-shrink-0 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-600 focus:outline-none focus:bg-blue-500 focus:text-white ${
                      isMobile ? 'ml-3 h-6 w-6' : 'ml-1 h-4 w-4'
                    }`}
                    aria-label={`Remove ${skill.name}`}
                  >
                    <span className="sr-only">Remove skill</span>
                    <svg className={isMobile ? 'h-3 w-3' : 'h-2 w-2'} stroke="currentColor" fill="none" viewBox="0 0 8 8">
                      <path strokeLinecap="round" strokeWidth="1.5" d="m1 1 6 6m0-6-6 6" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Skills Selector Dropdown */}
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
                        {mobileStep === 1 ? 'Select Domain' : mobileStep === 2 ? 'Select Subdomain' : 'Select Skills'}
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
                        placeholder="Search all skills..."
                        value={globalSearch}
                        onChange={(e) => setGlobalSearch(e.target.value)}
                        onKeyDown={handleGlobalSearchKeyDown}
                        className="w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base"
                        aria-label="Search skills globally"
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
                        {globalSearchResults.map((skill, index) => (
                          <button
                            key={skill.id}
                            type="button"
                            onClick={() => handleGlobalSearchSelect(skill)}
                            className={`w-full text-left p-4 border-b border-gray-100 last:border-b-0 transition-colors ${
                              index === focusedResultIndex ? 'bg-indigo-100' : 'hover:bg-gray-50'
                            }`}
                          >
                            <div className="font-medium text-gray-900">
                              {highlightSearchTerm(skill.name, globalSearch)}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              {skill.subdomain?.domain?.name} - {skill.subdomain?.name}
                            </div>
                            {skill.description && (
                              <div className="text-sm text-gray-400 mt-1 line-clamp-2">
                                {highlightSearchTerm(skill.description, globalSearch)}
                              </div>
                            )}
                            {selectedSkills.includes(skill.id) && (
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
                        disabled={mobileStep === 1 ? !selectedDomain : !selectedSubdomain}
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
                        Done ({selectedSkills.length})
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
                    <h3 className="text-sm font-medium text-gray-900">Select Skills</h3>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${currentStep >= 1 ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
                      <div className={`w-2 h-2 rounded-full ${currentStep >= 2 ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
                      <div className={`w-2 h-2 rounded-full ${currentStep >= 3 ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600">
                    Step {currentStep} of 3: {currentStep === 1 ? 'Select Domain' : currentStep === 2 ? 'Select Subdomain' : 'Select Skills'}
                  </div>
                </div>

                {/* Global Search */}
                <div className="border-b border-gray-200 p-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search all skills globally..."
                      value={globalSearch}
                      onChange={(e) => setGlobalSearch(e.target.value)}
                      onKeyDown={handleGlobalSearchKeyDown}
                      className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                      aria-label="Search skills globally"
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
                      {globalSearchResults.map((skill, index) => renderSearchResult(skill, globalSearch, index))}
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
                      No skills found for "{globalSearch}"
                    </div>
                  )}
                </div>

              {/* Three Column Layout */}
              <div className="flex" style={{height: '300px'}}>
                {/* Left Column - Domains */}
                <div className="w-1/3 border-r border-gray-200 flex flex-col">
                  <div className="p-3 border-b border-gray-200 bg-gray-50">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Domains</h4>
                    <input
                      type="text"
                      placeholder="Search domains..."
                      value={domainSearch}
                      onChange={(e) => setDomainSearch(e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {loading.domains ? (
                      <div className="p-4 text-center text-sm text-gray-500">Loading...</div>
                    ) : filteredDomains.length === 0 ? (
                      <div className="p-4 text-center text-sm text-gray-500">No domains found</div>
                    ) : (
                      filteredDomains.map(domain => (
                        <button
                          key={domain.id}
                          type="button"
                          onClick={() => handleDomainChange(domain.id)}
                          className={`w-full text-left px-3 py-3 hover:bg-gray-50 focus:outline-none border-b border-gray-100 text-sm ${
                            selectedDomain === domain.id 
                              ? 'bg-indigo-50 border-l-4 border-l-indigo-500 text-indigo-900 font-medium' 
                              : 'text-gray-700'
                          }`}
                        >
                          {domain.name}
                        </button>
                      ))
                    )}
                  </div>
                </div>

                {/* Middle Column - Subdomains */}
                <div className="w-1/3 border-r border-gray-200 flex flex-col">
                  <div className="p-3 border-b border-gray-200 bg-gray-50">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Subdomains</h4>
                    {selectedDomain && (
                      <input
                        type="text"
                        placeholder="Search subdomains..."
                        value={subdomainSearch}
                        onChange={(e) => setSubdomainSearch(e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    )}
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {!selectedDomain ? (
                      <div className="p-4 text-center text-sm text-gray-500">Select a domain first</div>
                    ) : loading.subdomains ? (
                      <div className="p-4 text-center text-sm text-gray-500">Loading...</div>
                    ) : filteredSubdomains.length === 0 ? (
                      <div className="p-4 text-center text-sm text-gray-500">No subdomains found</div>
                    ) : (
                      filteredSubdomains.map(subdomain => (
                        <button
                          key={subdomain.id}
                          type="button"
                          onClick={() => handleSubdomainChange(subdomain.id)}
                          className={`w-full text-left px-3 py-3 hover:bg-gray-50 focus:outline-none border-b border-gray-100 text-sm ${
                            selectedSubdomain === subdomain.id 
                              ? 'bg-indigo-50 border-l-4 border-l-indigo-500 text-indigo-900 font-medium' 
                              : 'text-gray-700'
                          }`}
                        >
                          {subdomain.name}
                        </button>
                      ))
                    )}
                  </div>
                </div>

                {/* Right Column - Skills */}
                <div className="w-1/3 flex flex-col">
                  <div className="p-3 border-b border-gray-200 bg-gray-50">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Skills</h4>
                    {selectedSubdomain && (
                      <input
                        type="text"
                        placeholder="Search skills..."
                        value={skillsSearch}
                        onChange={(e) => setSkillsSearch(e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    )}
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {!selectedSubdomain ? (
                      <div className="p-4 text-center text-sm text-gray-500">Select a subdomain first</div>
                    ) : loading.skills ? (
                      <div className="p-4 text-center text-sm text-gray-500">Loading...</div>
                    ) : filteredSkills.length === 0 ? (
                      <div className="p-4 text-center text-sm text-gray-500">
                        {skills.length === 0 ? 'No skills available' : 'No skills found matching your search'}
                      </div>
                    ) : (
                      filteredSkills.map(skill => {
                        const isSelected = selectedSkills.includes(skill.id);
                        return (
                          <button
                            key={skill.id}
                            type="button"
                            onClick={() => handleSkillToggle(skill)}
                            className={`w-full text-left px-3 py-3 hover:bg-gray-50 focus:outline-none border-b border-gray-100 text-sm transition-colors ${
                              isSelected 
                                ? 'bg-green-50 border-l-4 border-l-green-500' 
                                : 'text-gray-700'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <div className={`font-medium ${isSelected ? 'text-green-900' : 'text-gray-900'}`}>
                                  {skill.name}
                                </div>
                                {skill.description && (
                                  <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                                    {skill.description}
                                  </div>
                                )}
                              </div>
                              {isSelected && (
                                <div className="ml-2 flex-shrink-0">
                                  <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
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
                    {selectedSkills.length} skill{selectedSkills.length !== 1 ? 's' : ''} selected
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
      
      {selectedSkills.length > 0 && (
        <p className="mt-1 text-sm text-gray-500">
          {selectedSkills.length} skill{selectedSkills.length !== 1 ? 's' : ''} selected
        </p>
      )}
    </div>
  );
}

// PropTypes for type safety
SkillsSelector.propTypes = {
  value: PropTypes.arrayOf(PropTypes.number),
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  required: PropTypes.bool,
  label: PropTypes.string,
  placeholder: PropTypes.string
};

// Default props
SkillsSelector.defaultProps = {
  value: [],
  error: null,
  required: false,
  label: 'Skills',
  placeholder: 'Select skills...'
};