import React from 'react';
import { 
  GraduationCap,
  Users,
  DollarSign,
  Calendar,
  FileText,
  TrendingUp,
  Globe,
  Microscope,
  Brain,
  Lightbulb,
  Award,
  Bot,
  Bookmark,
  Grid3X3,
  Network,
  BarChart3,
  FolderOpen,
  Settings,
  User,
  LogOut,
  Menu
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  isTransitioning: boolean;
  onToggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, isTransitioning, onToggleSidebar }) => {
  const stats = [
    { value: '42', label: 'Publications' },
    { value: '156', label: 'Citations' },
    { value: '18', label: 'h-index' }
  ];

  const getQuickAccessItems = () => {
    switch (activeSection) {
      case 'dashboard':
        return [
          { icon: GraduationCap, label: 'Supervision', color: 'bg-blue-100 text-blue-600' },
          { icon: Users, label: 'Students', color: 'bg-green-100 text-green-600' },
          { icon: TrendingUp, label: 'Analytics', color: 'bg-pink-100 text-pink-600' },
          { icon: Award, label: 'Impact', color: 'bg-emerald-100 text-emerald-600' }
        ];
      
      case 'features':
        return [
          { icon: Bot, label: 'AI Matching', color: 'bg-purple-100 text-purple-600' },
          { icon: GraduationCap, label: 'Postgraduate Recommendations', color: 'bg-blue-100 text-blue-600' },
          { icon: Bookmark, label: 'My Bookmarks', color: 'bg-yellow-100 text-yellow-600' },
          { icon: Grid3X3, label: 'Scholar Lab', color: 'bg-indigo-100 text-indigo-600' },
          { icon: Network, label: 'Networking', color: 'bg-teal-100 text-teal-600' }
        ];
      
      case 'manage':
        return [
          { icon: DollarSign, label: 'Grant', color: 'bg-green-100 text-green-600' },
          { icon: FolderOpen, label: 'Project', color: 'bg-blue-100 text-blue-600' },
          { icon: Calendar, label: 'Event', color: 'bg-orange-100 text-orange-600' },
          { icon: FileText, label: 'Post', color: 'bg-purple-100 text-purple-600' }
        ];
      
      case 'settings':
        return [
          { icon: User, label: 'Profile', color: 'bg-gray-100 text-gray-600' },
          { icon: Settings, label: 'Preferences', color: 'bg-indigo-100 text-indigo-600' },
          { icon: LogOut, label: 'Log Out', color: 'bg-red-100 text-red-600' }
        ];
      
      default:
        return [];
    }
  };

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'dashboard':
        return 'Dashboard Overview';
      case 'features':
        return 'Platform Features';
      case 'manage':
        return 'Content Management';
      case 'settings':
        return 'Account Settings';
      default:
        return 'Quick Access';
    }
  };

  const quickAccessItems = getQuickAccessItems();

  return (
    <div className="w-64 bg-gray-100 text-gray-800 p-6 flex flex-col h-screen border-l border-gray-200 transform transition-all duration-300 ease-in-out">
      {/* Logo */}
      <div className="mb-8 flex justify-end">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-gray-200 rounded-lg transition-all duration-200 hover:scale-105"
          title="Collapse sidebar"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* User Profile */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-white bg-opacity-60 backdrop-blur-sm border border-white border-opacity-30 rounded-full flex items-center justify-center shadow-lg">
            <Users className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <h3 className="text-gray-800 font-medium text-sm">Prof. Ahmad Najmi</h3>
            <p className="text-xs text-gray-600">Computer Science</p>
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex space-x-6 text-sm">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-gray-700 font-semibold">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Quick Access */}
      <div className={`flex-1 transition-all duration-500 ease-in-out ${
        isTransitioning ? 'opacity-0 transform translate-y-4 scale-95' : 'opacity-100 transform translate-y-0 scale-100'
      }`}>
        <h3 className={`text-gray-700 text-sm font-medium mb-4 transition-all duration-300 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}>
          {getSectionTitle()}
        </h3>
        <div className={`grid gap-3 ${quickAccessItems.length <= 4 ? 'grid-cols-2' : 'grid-cols-3'} transition-all duration-500 ease-in-out ${
          isTransitioning ? 'opacity-0 transform scale-90 translate-y-2' : 'opacity-100 transform scale-100 translate-y-0'
        }`}>
          {quickAccessItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                className={`bg-white bg-opacity-80 backdrop-blur-sm border border-white border-opacity-50 shadow-lg p-3 rounded-lg cursor-pointer hover:bg-opacity-90 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:rotate-1 ${
                  isTransitioning ? 'opacity-0 transform translate-y-3 scale-90' : 'opacity-100 transform translate-y-0 scale-100'
                }`}
                style={{ 
                  transitionDelay: isTransitioning ? '0ms' : `${index * 50}ms`
                }}
              >
                <IconComponent className="w-5 h-5 text-gray-600 mx-auto" />
                <div className="text-xs text-gray-600 text-center mt-1 truncate">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Section Description */}
        <div className={`mt-6 p-4 bg-white bg-opacity-60 backdrop-blur-sm border border-white border-opacity-30 rounded-lg transition-all duration-700 ease-in-out ${
          isTransitioning ? 'opacity-0 transform translate-y-6 scale-95' : 'opacity-100 transform translate-y-0 scale-100'
        }`}>
          <p className="text-xs text-gray-600 leading-relaxed">
            {activeSection === 'dashboard' && 'Access your main academic dashboard with supervision tools and analytics.'}
            {activeSection === 'features' && 'Explore AI-powered features for student matching, recommendations, and networking.'}
            {activeSection === 'manage' && 'Manage your grants, projects, events, and academic content in one place.'}
            {activeSection === 'settings' && 'Configure your profile settings and account preferences.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;