import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * SkillsSummary Component
 * 
 * Generates a dynamic summary line for skills display such as:
 * "✨ 14 skills across 2 domains"
 * 
 * Reusable component for both ProfileCard (networking) and ProfileContent (full profile) views
 */
export default function SkillsSummary({ 
  skills = [], 
  showIcon = true, 
  iconEmoji = "✨", 
  className = "",
  textClass = "text-sm font-medium text-blue-900"
}) {
  // Calculate skills statistics
  const skillsStats = useMemo(() => {
    if (!Array.isArray(skills) || skills.length === 0) {
      return {
        totalSkills: 0,
        totalDomains: 0,
        domainNames: []
      };
    }

    const domainSet = new Set();
    
    skills.forEach(skill => {
      if (skill?.subdomain?.domain?.name) {
        domainSet.add(skill.subdomain.domain.name);
      }
    });

    return {
      totalSkills: skills.length,
      totalDomains: domainSet.size,
      domainNames: Array.from(domainSet)
    };
  }, [skills]);

  // Don't render if no skills
  if (skillsStats.totalSkills === 0) {
    return null;
  }

  const { totalSkills, totalDomains } = skillsStats;
  
  // Generate summary text
  const summaryText = `${totalSkills} skill${totalSkills !== 1 ? 's' : ''} across ${totalDomains} domain${totalDomains !== 1 ? 's' : ''}`;

  return (
    <div className={className}>
      <span className={textClass}>
        {showIcon && (
          <span className="mr-1" role="img" aria-label="skills">
            {iconEmoji}
          </span>
        )}
        {summaryText}
      </span>
    </div>
  );
}

SkillsSummary.propTypes = {
  skills: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    subdomain: PropTypes.shape({
      name: PropTypes.string,
      domain: PropTypes.shape({
        name: PropTypes.string
      })
    })
  })).isRequired,
  showIcon: PropTypes.bool,
  iconEmoji: PropTypes.string,
  className: PropTypes.string,
  textClass: PropTypes.string
};

SkillsSummary.defaultProps = {
  skills: [],
  showIcon: true,
  iconEmoji: "✨",
  className: "",
  textClass: "text-sm font-medium text-blue-900"
};