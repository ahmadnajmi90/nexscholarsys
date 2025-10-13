import React from 'react';
import { User, Lock, Trash2, Calendar } from 'lucide-react';

const navigationItems = [
  { id: 'account', label: 'Account Information', icon: User },
  { id: 'password', label: 'Password', icon: Lock },
  { id: 'calendar', label: 'Calendar Integration', icon: Calendar },
  { id: 'danger', label: 'Delete Account', icon: Trash2 },
];

export default function SettingsNavigation({ activeSection }) {
  const handleClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Offset for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className="space-y-1">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => handleClick(e, item.id)}
            className={`
              flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md
              transition-colors duration-150
              ${isActive 
                ? 'bg-indigo-50 text-indigo-600' 
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }
            `}
          >
            <Icon className="w-4 h-4" />
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}

