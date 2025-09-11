import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * SkillsGroupedDisplay Component
 * 
 * Displays skills in a grouped hierarchical format for full profile pages.
 * Features collapsible domains, summary bar, and tooltip support.
 * Reuses the same grouping logic from SelectedSkillsDisplay.
 */
export default function SkillsGroupedDisplay({ 
  skills = [], 
  title = "Skills",
  showSummaryBar = true,
  showCounts = true,
  className = "",
  cardClassName = "bg-white shadow sm:rounded-lg p-4 sm:p-6"
}) {
  const [collapsedDomains, setCollapsedDomains] = useState(new Set());

  // Update collapsed domains when skills data changes to ensure all domains start collapsed
  useEffect(() => {
    if (skills.length > 0) {
      const allDomainNames = new Set();
      skills.forEach(skill => {
        if (skill?.subdomain?.domain?.name) {
          allDomainNames.add(skill.subdomain.domain.name);
        }
      });
      setCollapsedDomains(allDomainNames);
    }
  }, [skills]);

  // Group skills by domain and subdomain (reuse logic from SelectedSkillsDisplay)
  const groupedSkills = useMemo(() => {
    const groups = {};
    
    skills.forEach(skill => {
      if (!skill || !skill.subdomain?.domain) return;
      
      const domainName = skill.subdomain.domain.name;
      const subdomainName = skill.subdomain.name;
      
      if (!groups[domainName]) {
        groups[domainName] = {
          domain: skill.subdomain.domain,
          subdomains: {},
          totalSkills: 0
        };
      }
      
      if (!groups[domainName].subdomains[subdomainName]) {
        groups[domainName].subdomains[subdomainName] = {
          subdomain: skill.subdomain,
          skills: []
        };
      }
      
      groups[domainName].subdomains[subdomainName].skills.push(skill);
      groups[domainName].totalSkills++;
    });
    
    return groups;
  }, [skills]);

  const totalSkillsCount = skills.length;
  const totalDomainsCount = Object.keys(groupedSkills).length;

  const toggleDomainCollapse = (domainName) => {
    const newCollapsed = new Set(collapsedDomains);
    if (newCollapsed.has(domainName)) {
      newCollapsed.delete(domainName);
    } else {
      newCollapsed.add(domainName);
    }
    setCollapsedDomains(newCollapsed);
  };

  // Don't render if no skills
  if (!Array.isArray(skills) || skills.length === 0) {
    return null;
  }

  return (
    <div className={cardClassName}>
      <h2 className="text-lg sm:text-xl font-semibold mb-4">{title}</h2>
      
      <div className={`${className}`}>
        {/* Summary Bar */}
        {showSummaryBar && (
          <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-blue-900">
                ✨ {totalSkillsCount} skill{totalSkillsCount !== 1 ? 's' : ''} across {totalDomainsCount} domain{totalDomainsCount !== 1 ? 's' : ''}
              </div>
              <div className="flex items-center space-x-2 text-xs text-blue-700">
                <span>💡 Click domains to expand/collapse</span>
              </div>
            </div>
          </div>
        )}

        {/* Grouped Skills Display */}
        <div className="space-y-3">
          {Object.entries(groupedSkills).map(([domainName, domainData]) => {
            const isCollapsed = collapsedDomains.has(domainName);
            const subdomainEntries = Object.entries(domainData.subdomains);
            
            return (
              <div key={domainName} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Domain Header */}
                <button
                  type="button"
                  onClick={() => toggleDomainCollapse(domainName)}
                  className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 text-left flex items-center justify-between transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-inset"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`transform transition-transform ${isCollapsed ? 'rotate-0' : 'rotate-90'}`}>
                      <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{domainName}</div>
                      {showCounts && (
                        <div className="text-sm text-gray-500">
                          {domainData.totalSkills} skill{domainData.totalSkills !== 1 ? 's' : ''} • {subdomainEntries.length} subdomain{subdomainEntries.length !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {isCollapsed ? 'Click to expand' : 'Click to collapse'}
                  </div>
                </button>

                {/* Domain Content */}
                {!isCollapsed && (
                  <div className="border-t border-gray-200">
                    {subdomainEntries.map(([subdomainName, subdomainData]) => (
                      <div key={subdomainName} className="px-4 py-3 border-b border-gray-100 last:border-b-0">
                        {/* Subdomain Header */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-gray-700 text-sm">
                            📁 {subdomainName}
                          </div>
                          {showCounts && (
                            <div className="text-xs text-gray-500">
                              {subdomainData.skills.length} skill{subdomainData.skills.length !== 1 ? 's' : ''}
                            </div>
                          )}
                        </div>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-2">
                          {subdomainData.skills.map(skill => (
                            <div
                              key={skill.id}
                              className="group relative inline-flex items-center"
                            >
                              {/* Skill Badge */}
                              <div
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800 hover:bg-indigo-200 transition-colors cursor-help"
                                title={`${domainName} → ${subdomainName} → ${skill.name}`}
                              >
                                <span className="mr-1">🔧</span>
                                <span className="font-medium">{skill.name}</span>
                              </div>

                              {/* Tooltip for full hierarchy (desktop only) */}
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap hidden md:block">
                                <div className="font-medium">{domainName}</div>
                                <div className="text-gray-300">→ {subdomainName}</div>
                                <div className="text-gray-300">→ {skill.name}</div>
                                {skill.description && (
                                  <div className="text-gray-400 text-xs mt-1 max-w-xs truncate">
                                    {skill.description}
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
          💡 Tap and hold skill badges to see full hierarchy
        </div>
      </div>
    </div>
  );
}

SkillsGroupedDisplay.propTypes = {
  skills: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    subdomain: PropTypes.shape({
      name: PropTypes.string,
      domain: PropTypes.shape({
        name: PropTypes.string
      })
    })
  })).isRequired,
  title: PropTypes.string,
  showSummaryBar: PropTypes.bool,
  showCounts: PropTypes.bool,
  className: PropTypes.string,
  cardClassName: PropTypes.string
};

SkillsGroupedDisplay.defaultProps = {
  skills: [],
  title: "Skills",
  showSummaryBar: true,
  showCounts: true,
  className: "",
  cardClassName: "bg-white shadow sm:rounded-lg p-4 sm:p-6"
};