import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';

export default function SelectedResearchAreasDisplay({
  selectedResearchAreas = [],
  researchAreaDetails = {},
  onRemoveResearchArea,
  showCounts = true,
  showRemoveButtons = true,
  className = ""
}) {
  const [collapsedFields, setCollapsedFields] = useState(new Set());
  const [expandedAreas, setExpandedAreas] = useState(new Set());

  // Update collapsed fields when research areas data changes to ensure all fields start collapsed
  useEffect(() => {
    if (selectedResearchAreas.length > 0 && Object.keys(researchAreaDetails).length > 0) {
      const allFieldNames = new Set();
      selectedResearchAreas.forEach(researchAreaId => {
        const details = researchAreaDetails[researchAreaId];
        if (details?.area?.field?.name) {
          allFieldNames.add(details.area.field.name);
        }
      });
      setCollapsedFields(allFieldNames);
    }
  }, [selectedResearchAreas, researchAreaDetails]);

  // Group research areas by field and area
  const groupedResearchAreas = useMemo(() => {
    
    const groups = {};
    
    selectedResearchAreas.forEach(researchAreaId => {
      const details = researchAreaDetails[researchAreaId];
      
      if (!details || !details.area || !details.area.field) {
        return;
      }
      
      const fieldId = details.area.field.id;
      const fieldName = details.area.field.name;
      const areaId = details.area.id;
      const areaName = details.area.name;
      
      if (!groups[fieldName]) {
        groups[fieldName] = {
          field: details.area.field,
          areas: {},
          totalCount: 0
        };
      }
      
      if (!groups[fieldName].areas[areaName]) {
        groups[fieldName].areas[areaName] = {
          area: details.area,
          niches: []
        };
      }
      
      groups[fieldName].areas[areaName].niches.push({
        id: researchAreaId,
        name: details.name,
        description: details.description
      });
      
      groups[fieldName].totalCount++;
    });
    
    return groups;
  }, [selectedResearchAreas, researchAreaDetails]);

  const totalSelected = selectedResearchAreas.length;
  const fieldCount = Object.keys(groupedResearchAreas).length;

  const toggleFieldCollapse = (fieldName) => {
    const newCollapsed = new Set(collapsedFields);
    if (newCollapsed.has(fieldName)) {
      newCollapsed.delete(fieldName);
    } else {
      newCollapsed.add(fieldName);
    }
    setCollapsedFields(newCollapsed);
  };

  // Handle research area removal
  const handleRemove = (researchAreaId) => {
    if (onRemoveResearchArea) {
      onRemoveResearchArea(researchAreaId);
    }
  };

  if (totalSelected === 0) {
    return null;
  }

  return (
    <div className={`mt-2 mb-3 ${className}`}>
      {/* Sticky Summary Bar */}
      <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-blue-900">
            ✨ You selected {totalSelected} research area{totalSelected !== 1 ? 's' : ''} across {fieldCount} field{fieldCount !== 1 ? 's' : ''}
          </div>
          <div className="flex items-center space-x-2 text-xs text-blue-700">
            <span>💡 Click fields to expand/collapse</span>
          </div>
        </div>
      </div>

      {/* Grouped Research Areas Display */}
      <div className="space-y-3">
        {Object.entries(groupedResearchAreas).map(([fieldName, fieldData]) => {
          const isCollapsed = collapsedFields.has(fieldName);
          const areaEntries = Object.entries(fieldData.areas);
          
          return (
            <div key={fieldName} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Field Header */}
              <button
                type="button"
                onClick={() => toggleFieldCollapse(fieldName)}
                className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 text-left flex items-center justify-between transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-inset"
              >
                <div className="flex items-center space-x-3">
                  <div className={`transform transition-transform ${isCollapsed ? 'rotate-0' : 'rotate-90'}`}>
                    <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{fieldName}</div>
                    {showCounts && (
                      <div className="text-sm text-gray-500">
                        {fieldData.totalCount} research area{fieldData.totalCount !== 1 ? 's' : ''} • {areaEntries.length} area{areaEntries.length !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  {isCollapsed ? 'Click to expand' : 'Click to collapse'}
                </div>
              </button>

              {/* Field Content */}
              {!isCollapsed && (
                <div className="border-t border-gray-200">
                  {areaEntries.map(([areaName, areaData]) => (
                    <div key={areaName} className="px-4 py-3 border-b border-gray-100 last:border-b-0">
                      {/* Area Header */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-gray-700 text-sm">
                          📁 {areaName}
                        </div>
                        {showCounts && (
                          <div className="text-xs text-gray-500">
                            {areaData.niches.length} niche{areaData.niches.length !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>

                      {/* Niches */}
                      <div className="flex flex-wrap gap-2">
                        {areaData.niches.map(niche => (
                          <div
                            key={niche.id}
                            className="group relative inline-flex items-center"
                          >
                            {/* Research Area Badge */}
                            <div
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800 hover:bg-indigo-200 transition-colors cursor-help"
                              title={`${fieldName} → ${areaName} → ${niche.name}`}
                            >
                              <span className="mr-1">🔬</span>
                              <span className="font-medium">{niche.name}</span>
                              {showRemoveButtons && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onRemoveResearchArea?.(niche.id);
                                  }}
                                  className="ml-2 flex-shrink-0 rounded-full inline-flex items-center justify-center h-4 w-4 text-indigo-400 hover:bg-indigo-300 hover:text-indigo-600 focus:outline-none focus:bg-indigo-500 focus:text-white transition-colors"
                                  aria-label={`Remove ${niche.name}`}
                                >
                                  <span className="sr-only">Remove research area</span>
                                  <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                                    <path strokeLinecap="round" strokeWidth="1.5" d="m1 1 6 6m0-6-6 6" />
                                  </svg>
                                </button>
                              )}
                            </div>

                            {/* Tooltip for full hierarchy (desktop only) */}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap hidden md:block">
                              <div className="font-medium">{fieldName}</div>
                              <div className="text-gray-300">→ {areaName}</div>
                              <div className="text-gray-300">→ {niche.name}</div>
                              {niche.description && (
                                <div className="text-gray-400 text-xs mt-1 max-w-xs truncate">
                                  {niche.description}
                                </div>
                              )}
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile-friendly tap tooltip instructions */}
      <div className="mt-3 text-xs text-gray-500 md:hidden">
        💡 Tap and hold research area badges to see full hierarchy
      </div>
    </div>
  );
}

// PropTypes for type safety
SelectedResearchAreasDisplay.propTypes = {
  selectedResearchAreas: PropTypes.arrayOf(PropTypes.string).isRequired,
  researchAreaDetails: PropTypes.object.isRequired,
  onRemoveResearchArea: PropTypes.func,
  showCounts: PropTypes.bool,
  showRemoveButtons: PropTypes.bool,
  className: PropTypes.string
};

// Default props
SelectedResearchAreasDisplay.defaultProps = {
  selectedResearchAreas: [],
  researchAreaDetails: {},
  onRemoveResearchArea: null,
  showCounts: true,
  showRemoveButtons: true,
  className: ''
};