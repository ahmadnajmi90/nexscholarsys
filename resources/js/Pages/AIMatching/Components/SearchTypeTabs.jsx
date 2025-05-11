import React from 'react';
import { FaChalkboardTeacher, FaUserGraduate, FaUsers } from 'react-icons/fa';

export default function SearchTypeTabs({ currentType, onTypeChange, isAcademician }) {
  // Define the tab options
  const tabs = [
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
      available: isAcademician // Only available to academicians
    },
    {
      id: 'collaborators',
      label: 'Collaborators',
      icon: <FaUsers className="mr-2" />,
      description: 'Find potential research collaborators (academicians and students)',
      available: isAcademician // Only available to academicians
    }
  ];

  return (
    <div className="mb-8">
      <div className="border-b border-gray-200">
        <div className="flex flex-wrap -mb-px">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`inline-flex items-center py-4 px-6 text-sm font-medium leading-5 ${
                currentType === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-500 focus:outline-none'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300'
              } ${!tab.available ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => tab.available && onTypeChange(tab.id)}
              disabled={!tab.available}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Description for the selected tab */}
      <div className="mt-4 text-sm text-gray-600">
        {tabs.find(tab => tab.id === currentType)?.description}
        {!isAcademician && currentType !== 'supervisor' && (
          <span className="ml-2 text-red-500">
            (You need to be an academician to access this feature)
          </span>
        )}
      </div>
    </div>
  );
} 