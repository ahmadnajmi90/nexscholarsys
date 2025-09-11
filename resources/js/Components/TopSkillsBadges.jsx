import React from 'react';
import PropTypes from 'prop-types';

/**
 * TopSkillsBadges Component
 * 
 * Displays the first 3-5 skills as compact badges with tooltips showing full hierarchy.
 * Used in ProfileCard (networking view) to show top skills with tooltips.
 */
export default function TopSkillsBadges({ 
  skills = [], 
  maxSkills = 5, 
  className = "",
  onViewAll = null,
  showViewAllButton = true
}) {
  // If no skills, don't render
  if (!Array.isArray(skills) || skills.length === 0) {
    return null;
  }

  // Get top skills (first n skills up to maxSkills)
  const topSkills = skills.slice(0, maxSkills);
  const hasMoreSkills = skills.length > maxSkills;

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Top Skills Badges */}
      <div className="flex flex-wrap gap-2">
        {topSkills.map(skill => {
          // Generate tooltip text showing full hierarchy
          const tooltipText = skill?.subdomain?.domain?.name && skill?.subdomain?.name
            ? `${skill.subdomain.domain.name} → ${skill.subdomain.name} → ${skill.name}`
            : skill?.name || 'Unknown Skill';

          return (
            <div
              key={skill.id || skill.name}
              className="group relative inline-flex items-center"
            >
              {/* Skill Badge */}
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 hover:bg-indigo-200 transition-colors cursor-help"
                title={tooltipText}
              >
                <span className="mr-1" role="img" aria-label="skill">🔧</span>
                <span>{skill.name}</span>
              </span>

              {/* Desktop Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap hidden md:block">
                <div className="space-y-1">
                  {skill?.subdomain?.domain?.name && (
                    <div className="font-medium">{skill.subdomain.domain.name}</div>
                  )}
                  {skill?.subdomain?.name && (
                    <div className="text-gray-300">→ {skill.subdomain.name}</div>
                  )}
                  <div className="text-gray-300">→ {skill.name}</div>
                  {skill?.description && (
                    <div className="text-gray-400 text-xs mt-1 max-w-xs">
                      {skill.description}
                    </div>
                  )}
                </div>
                {/* Tooltip Arrow */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          );
        })}

        {/* View All Button */}
        {hasMoreSkills && showViewAllButton && onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors border border-gray-300"
          >
            <span className="mr-1" role="img" aria-label="view all">👁️</span>
            <span>View all ({skills.length}) →</span>
          </button>
        )}
      </div>

      {/* Mobile tap instructions */}
      <div className="text-xs text-gray-500 md:hidden">
        💡 Tap and hold skill badges to see full hierarchy
      </div>
    </div>
  );
}

TopSkillsBadges.propTypes = {
  skills: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    subdomain: PropTypes.shape({
      name: PropTypes.string,
      domain: PropTypes.shape({
        name: PropTypes.string
      })
    })
  })).isRequired,
  maxSkills: PropTypes.number,
  className: PropTypes.string,
  onViewAll: PropTypes.func,
  showViewAllButton: PropTypes.bool
};

TopSkillsBadges.defaultProps = {
  skills: [],
  maxSkills: 5,
  className: "",
  onViewAll: null,
  showViewAllButton: true
};