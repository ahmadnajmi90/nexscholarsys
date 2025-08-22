import React, { useState, useEffect, useRef } from 'react';
import { FaLightbulb, FaPlus, FaTimes } from 'react-icons/fa';

const NaturalLanguageQueryBuilder = ({ 
  onQueryChange, 
  value = '', 
  researchOptions,
  placeholder = 'e.g., Artificial Intelligence in Healthcare, Design Science Research...',
  onEnterPress = null
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestedTerms, setSuggestedTerms] = useState([]);
  const suggestionsRef = useRef(null);
  
  // Handle clicks outside the suggestions container
  useEffect(() => {
    function handleClickOutside(event) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [suggestionsRef]);
  
  // Extract research fields from research options for suggestions
  useEffect(() => {
    if (researchOptions && researchOptions.length > 0) {
      // Extract unique field and area names
      const uniqueTerms = new Set();
      
      researchOptions.forEach(option => {
        if (option.field_of_research_name) uniqueTerms.add(option.field_of_research_name);
        if (option.research_area_name) uniqueTerms.add(option.research_area_name);
        if (option.niche_domain_name) uniqueTerms.add(option.niche_domain_name);
      });
      
      // Convert to array and limit to 15 suggestions
      const termsArray = Array.from(uniqueTerms).slice(0, 15);
      setSuggestedTerms(termsArray);
    }
  }, [researchOptions]);
  
  // Handle query changes
  const handleQueryChange = (e) => {
    onQueryChange(e.target.value);
  };
  
  // Handle key down events for the input field
  const handleKeyDown = (e) => {
    // If the user presses Enter and we have a callback function
    if (e.key === 'Enter' && onEnterPress) {
      e.preventDefault();
      onEnterPress();
    }
  };
  
  // Add a suggested term to the query
  const addTermToQuery = (term) => {
    const newQuery = value ? `${value}, ${term}` : term;
    onQueryChange(newQuery);
    setShowSuggestions(false);
  };
  
  return (
    <div className="w-full">
      {/* Query input - simplified to match image */}
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleQueryChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full px-4 pr-14 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
          onFocus={() => setShowSuggestions(true)}
          autoFocus
        />
        
        {/* Show X icon to clear input when there's text */}
        {value && (
          <button 
            className="absolute right-10 top-4 text-gray-400 hover:text-gray-600"
            onClick={() => {
              onQueryChange('');
            }}
          >
            <FaTimes />
          </button>
        )}
      </div>
      
      {/* Suggested terms panel */}
      {showSuggestions && suggestedTerms.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3 absolute z-20 w-full max-w-3xl"
        >
          <div className="flex items-center mb-2">
            <FaLightbulb className="text-yellow-500 mr-2" />
            <span className="text-sm font-medium">Suggested research terms</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestedTerms.map((term, index) => (
              <button
                key={index}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm flex items-center"
                onClick={() => addTermToQuery(term)}
              >
                <FaPlus className="mr-1 text-xs text-gray-500" />
                {term}
              </button>
            ))}
          </div>
          <button 
            className="mt-2 text-xs text-gray-500 hover:text-gray-700"
            onClick={() => setShowSuggestions(false)}
          >
            Close suggestions
          </button>
        </div>
      )}
    </div>
  );
};

export default NaturalLanguageQueryBuilder; 