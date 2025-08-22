import React, { useEffect } from 'react';
import { FaChalkboardTeacher, FaUserGraduate, FaUsers } from 'react-icons/fa';
import useRoles from '@/Hooks/useRoles';

export default function SearchTypeSelector({ currentType, onTypeChange, isAcademician }) {
  const { isUndergraduate, isPostgraduate, isAcademician: userIsAcademician } = useRoles();

  // Define the options
  const options = [
    {
      id: 'supervisor',
      label: 'Supervisor',
      icon: <FaChalkboardTeacher className="mr-2" />,
      description: 'Find academic supervisors for your research',
      available: !userIsAcademician // Not available to academicians
    },
    {
      id: 'students',
      label: 'Students',
      icon: <FaUserGraduate className="mr-2" />,
      description: 'Find postgraduates and undergraduates for your research projects',
      available: !isUndergraduate && !isPostgraduate // Not available to undergraduates or postgraduates
    },
    {
      id: 'collaborators',
      label: 'Collaborators',
      icon: <FaUsers className="mr-2" />,
      description: 'Find potential research collaborators among academicians',
      available: true // Available to all users
    }
  ];

  // Set default selection based on user role
  useEffect(() => {
    const availableOptions = options.filter(option => option.available);
    
    // If current selection is not available for this user, set a default
    const currentOption = options.find(opt => opt.id === currentType);
    if (!currentOption || !currentOption.available) {
      // Set default based on role
      let defaultType = 'collaborators'; // fallback
      
      if (userIsAcademician) {
        defaultType = 'students'; // Academicians default to students
      } else if (isUndergraduate || isPostgraduate) {
        defaultType = 'supervisor'; // Students default to supervisor
      }
      
      // Only change if the default is available and different from current
      if (availableOptions.find(opt => opt.id === defaultType) && defaultType !== currentType) {
        onTypeChange(defaultType);
      }
    }
  }, [userIsAcademician, isUndergraduate, isPostgraduate, currentType, onTypeChange, options]);

  return (
    <div>
      {/* Description for the selected option */}
      <div className="text-sm text-gray-600 mb-2">
        {options.find(opt => opt.id === currentType)?.description}
      </div>
      
      {/* Search type selector buttons */}
      <div className="inline-flex rounded-md shadow-sm bg-gray-50 p-1 mb-4">
        {options.filter(option => option.available).map((option, index, filteredOptions) => (
          <button
            key={option.id}
            className={`inline-flex items-center px-4 py-2 text-sm font-medium ${
              currentType === option.id
                ? 'bg-white text-blue-700 shadow-sm border-gray-200 z-10'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            } ${index === 0 ? 'rounded-l-md' : ''} 
              ${index === filteredOptions.length - 1 ? 'rounded-r-md' : ''}`}
            onClick={() => onTypeChange(option.id)}
          >
            {option.icon}
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}