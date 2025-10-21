import React from 'react';
import NotificationBell from './Notifications/NotificationBell';
import Dropdown from './Dropdown';
import { Settings, User2, LogOut } from 'lucide-react';

const FloatingCommunicationHub = ({ auth, getProfilePicture, showProfile = false }) => {
    return (
        // Card Container with rounded-full pill shape
        <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700">
            {/* Notification Bell */}
            <NotificationBell />
            
            {/* Divider */}
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>
            
            {/* Messaging Icon Placeholder - Future Feature */}
            <div className="relative">
                <button
                    className="relative p-1 text-gray-400 hover:text-indigo-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors cursor-not-allowed"
                    disabled
                    title="Messaging (Coming Soon)"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {/* Future: Badge for unread messages */}
                    {/* <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span> */}
                </button>
            </div>
            
            {/* Profile Dropdown - Only shown when header is hidden */}
            {showProfile && (
                <>
                    {/* Divider */}
                    <div className="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>
                    
                    <Dropdown>
                        <Dropdown.Trigger>
                            <img
                                src={getProfilePicture(auth.user)}
                                alt="Profile"
                                className="h-9 w-9 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-indigo-400 transition"
                            />
                        </Dropdown.Trigger>
                        <Dropdown.Content align="right" width="48">
                            <div className="px-4 py-3">
                                <span className="block text-sm font-medium text-gray-900 truncate">{auth.user.full_name}</span>
                                <span className="block text-sm text-gray-500 truncate">{auth.user.email}</span>
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
                </>
            )}
        </div>
    );
};

export default FloatingCommunicationHub;

