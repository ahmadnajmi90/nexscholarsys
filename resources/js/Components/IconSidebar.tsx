import React from 'react';
import { 
  Home,
  Sparkles,
  Settings,
  FolderOpen
} from 'lucide-react';

interface IconSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const IconSidebar: React.FC<IconSidebarProps> = ({ activeSection, onSectionChange }) => {
  const iconItems = [
    { 
      id: 'dashboard',
      icon: Home, 
      label: 'Dashboard',
      active: activeSection === 'dashboard' 
    },
    { 
      id: 'features',
      icon: Sparkles, 
      label: 'Features',
      active: activeSection === 'features' 
    },
    { 
      id: 'manage',
      icon: FolderOpen, 
      label: 'Manage',
      active: activeSection === 'manage' 
    },
    { 
      id: 'settings',
      icon: Settings, 
      label: 'Settings',
      active: activeSection === 'settings' 
    }
  ];

  return (
    <div className="w-16 bg-indigo-700 flex flex-col items-center py-6 space-y-6">
      {/* Logo */}
      <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
        <div className="w-4 h-4 bg-white rounded"></div>
      </div>

      {/* Navigation Icons */}
      {iconItems.map((item) => {
        const IconComponent = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-white hover:bg-opacity-20 ${
              item.active 
                ? 'bg-white bg-opacity-20 text-white' 
                : 'text-white text-opacity-60 hover:text-opacity-100'
            }`}
            title={item.label}
          >
            <IconComponent className="w-5 h-5" />
          </button>
        );
      })}
    </div>
  );
};

export default IconSidebar;