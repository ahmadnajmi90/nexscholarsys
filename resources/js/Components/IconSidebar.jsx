import React from 'react';
import {
    Zap, 
    Users, 
    Settings, 
    FolderOpen,
    House
} from 'lucide-react';

const IconSidebar = ({ activeSection, onSectionChange }) => {
    const sections = [
        { id: 'dashboard', icon: House, label: 'Dashboard' },
        { id: 'features', icon: Zap, label: 'Features' },
        { id: 'networking', icon: Users, label: 'Networking' },
        { id: 'content', icon: FolderOpen, label: 'Content' },
        { id: 'settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="fixed left-0 top-0 h-full w-16 bg-indigo-700 z-20">
            <div className="flex flex-col items-center py-4 space-y-4">
                {/* Logo/Brand */}
                <a href={route('welcome')} className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
                    <img src="/images/logo.png" alt="Nexscholar Logo" className="w-10 h-10 bg-white rounded-lg object-contain shadow-lg p-1" />
                </a>

                {/* Navigation Icons */}
                {sections.map((section) => {
                    const IconComponent = section.icon;
                    const isActive = activeSection === section.id;
                    
                    return (
                        <button
                            key={section.id}
                            onClick={() => onSectionChange(section.id)}
                            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 group relative ${
                                isActive 
                                    ? 'bg-white bg-opacity-20 text-white' 
                                    : 'text-white hover:bg-white hover:bg-opacity-20'
                            }`}
                            title={section.label}
                        >
                            <IconComponent className="w-5 h-5" />
                            
                            {/* Tooltip */}
                            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                                {section.label}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default IconSidebar; 