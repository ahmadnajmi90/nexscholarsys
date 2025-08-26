import React from 'react';

const Header = ({ user, tabs, activeTab, setActiveTab }) => {
  return (
    <div className="mb-8">
      {/* Welcome Message */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          Welcome back, {user?.full_name || 'User'}! 
          <span className="ml-2 text-2xl">👋</span>
        </h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening with your academic activities today
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === tab
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
                transition-colors duration-200 ease-in-out focus:outline-none
              `}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Header;
