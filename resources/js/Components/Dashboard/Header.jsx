import React from 'react';
import Dropdown from '../Dropdown';
import NotificationBell from '../Notifications/NotificationBell';
import MessagingBell from '../Messaging/MessagingBell';
import { Settings, User2, LogOut } from 'lucide-react';

const Header = ({ user, tabs, activeTab, setActiveTab }) => {
  // Helper function to get profile picture URL
  const getProfilePicture = (user) => {
    const profile = user.academician || user.postgraduate || user.undergraduate;
    return profile?.profile_picture ? `/storage/${profile.profile_picture}` : "/storage/profile_pictures/default.jpg";
  };

  return (
    <div className="mb-6 md:mb-8">
      {/* Welcome Message with Communication Bubbles */}
      <div className="mb-4 md:mb-6 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center">
            Welcome back, {user?.full_name || 'User'}!
            <span className="ml-2 text-xl md:text-2xl">👋</span>
          </h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            Here's what's happening with your academic activities today
          </p>
        </div>

        {/* Communication Bubbles - Desktop Only */}
        <div className="hidden md:flex items-center gap-2">
          {/* Messaging Bell */}
          <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <MessagingBell />
          </div>
          
          {/* Notification Bell */}
          <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <NotificationBell />
          </div>
          
          {/* Profile Dropdown */}
          <Dropdown>
            <Dropdown.Trigger>
              <img
                src={getProfilePicture(user)}
                alt="Profile"
                className="h-10 w-10 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-indigo-400 transition"
              />
            </Dropdown.Trigger>
            <Dropdown.Content align="right" width="48">
              <div className="px-4 py-3">
                <span className="block text-sm font-medium text-gray-900 truncate">{user.full_name}</span>
                <span className="block text-sm text-gray-500 truncate">{user.email}</span>
              </div>
              <div className="border-t border-gray-200"></div>
              <Dropdown.Link href={route('profile.edit')}>
                <Settings className="w-4 h-4 mr-2" />
                General Account Setting
              </Dropdown.Link>
              <Dropdown.Link href={route('role.edit')}>
                <User2 className="w-4 h-4 mr-2" />
                Personal Information
              </Dropdown.Link>
              <div className="border-t border-gray-200"></div>
              <Dropdown.Link href={route('logout')} method="post" as="button" className="w-full text-left text-red-600 hover:bg-red-50">
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </Dropdown.Link>
            </Dropdown.Content>
          </Dropdown>
        </div>
      </div>

      {/* Tab Navigation - now scrollable on mobile */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6 md:space-x-8 overflow-x-auto" aria-label="Tabs">
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
