import React from 'react';
import { FaChalkboardTeacher, FaUserGraduate, FaUsers } from 'react-icons/fa';

export default function SearchTypeSelector({ currentType, onTypeChange, isAcademician }) {
  // Define the options
  const options = [
    {
      id: 'supervisor',
      label: 'Supervisor',
      icon: <FaChalkboardTeacher className="mr-2" />,
      description: 'Find academic supervisors for your research',
      available: true // Available to all users
    },
    {
      id: 'students',
      label: 'Students',
      icon: <FaUserGraduate className="mr-2" />,
      description: 'Find postgraduates and undergraduates for your research projects',
      available: true // Available to all users
      // available: isAcademician // Only available to academicians
    },
    {
      id: 'collaborators',
      label: 'Collaborators',
      icon: <FaUsers className="mr-2" />,
      description: 'Find potential research collaborators (academicians only)',
      available: true // Available to all users
      // available: isAcademician // Only available to academicians
    }
  ];

  return (
    <div>
      {/* Description for the selected option */}
      <div className="text-sm text-gray-600 mb-2">
        {options.find(opt => opt.id === currentType)?.description}
        {!isAcademician && currentType !== 'supervisor' && (
          <span className="ml-2 text-red-500">
            (You need to be an academician to access this feature)
          </span>
        )}
      </div>
      
      {/* Search type selector buttons */}
      <div className="inline-flex rounded-md shadow-sm bg-gray-50 p-1 mb-4">
        {options.map(option => (
          <button
            key={option.id}
            className={`inline-flex items-center px-4 py-2 text-sm font-medium ${
              currentType === option.id
                ? 'bg-white text-blue-700 shadow-sm border-gray-200 z-10'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            } ${option.id === 'supervisor' ? 'rounded-l-md' : ''} 
              ${option.id === 'collaborators' ? 'rounded-r-md' : ''}
              ${!option.available ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => option.available && onTypeChange(option.id)}
            disabled={!option.available}
          >
            {option.icon}
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
} 