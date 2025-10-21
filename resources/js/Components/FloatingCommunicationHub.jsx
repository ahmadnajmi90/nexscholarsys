import React from 'react';
import NotificationBell from './Notifications/NotificationBell';
import MessagingBell from './Messaging/MessagingBell';
import Dropdown from './Dropdown';
import { Settings, User2, LogOut } from 'lucide-react';

const FloatingCommunicationHub = ({ auth, getProfilePicture, showProfile = false }) => {
    return (
        // Card Container with rounded-full pill shape
        <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700">
            {/* Messaging Bell - Wrapped in circle container */}
            <div className="h-9 w-9 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <MessagingBell />
            </div>
            
            {/* Divider */}
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>
            
            {/* Notification Bell - Wrapped in circle container */}
            <div className="h-9 w-9 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <NotificationBell />
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

