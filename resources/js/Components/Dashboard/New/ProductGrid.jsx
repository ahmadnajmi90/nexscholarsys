import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { Newspaper, Calendar, DollarSign, FolderOpen, ChevronLeft, ChevronRight, TrendingUp, Users, Award, BookOpen, Eye, Heart, Share2 } from 'lucide-react';

const ProductGrid = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // 1 featured + 2 regular cards

  const allActivities = [
    {
      id: 1,
      title: 'Go Cashless and Save',
      subtitle: 'Digital Payment Revolution in Academic Research',
      description: 'Ever found yourself fumbling with cash or coins at the counter, wishing for an easier way to pay? You\'re not alone! Many Malaysians are embracing digital payment solutions for seamless transactions.',
      status: 'Post',
      date: '13/03/2025',
      author: 'Dr. Sarah Chen',
      readTime: '8 min read',
      views: '401',
      likes: '3',
      shares: '33',
      type: 'post',
      category: 'Technology',
      bgColor: 'from-blue-900 to-purple-900',
      statusColor: 'bg-blue-500 text-white',
      backgroundImage: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=1200',
      icon: Newspaper,
      featured: true
    },
    {
      id: 2,
      title: 'HELINA 2025',
      subtitle: 'Health Informatics in Africa Conference',
      description: 'Join leading researchers from around the world for cutting-edge health informatics presentations',
      status: 'Event',
      date: '21/01/2025',
      author: 'HELINA Committee',
      readTime: 'Event',
      type: 'event',
      category: 'Conference',
      bgColor: 'from-purple-600 to-purple-800',
      statusColor: 'bg-red-500 text-white',
      backgroundImage: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=800',
      icon: Calendar,
      featured: false
    },
    {
      id: 3,
      title: 'RF Catalytic Capital, Inc.',
      subtitle: 'Research Funding Opportunity',
      description: 'Innovative funding solutions for academic research projects',
      status: 'Grant',
      date: '01/02/2025',
      author: 'RF Capital',
      readTime: 'Grant',
      type: 'grant',
      category: 'Funding',
      bgColor: 'from-gray-600 to-gray-800',
      statusColor: 'bg-green-500 text-white',
      backgroundImage: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800',
      icon: DollarSign,
      featured: false
    },
    {
      id: 4,
      title: 'AI Research Breakthrough',
      subtitle: 'Revolutionary deep learning architecture',
      description: 'Groundbreaking research from MIT and Stanford shows unprecedented results in automated medical imaging analysis.',
      status: 'Post',
      date: '15/03/2025',
      author: 'Prof. Ahmad Najmi',
      readTime: '6 min read',
      views: '256',
      likes: '12',
      shares: '18',
      type: 'post',
      category: 'Research',
      bgColor: 'from-indigo-900 to-blue-900',
      statusColor: 'bg-blue-500 text-white',
      backgroundImage: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200',
      icon: Newspaper,
      featured: true
    },
    {
      id: 5,
      title: 'ICML 2025 Conference',
      subtitle: 'International Conference on Machine Learning',
      description: 'Premier conference on machine learning and artificial intelligence',
      status: 'Event',
      date: '15/07/2025',
      author: 'ICML Committee',
      readTime: 'Event',
      type: 'event',
      category: 'Conference',
      bgColor: 'from-purple-600 to-purple-800',
      statusColor: 'bg-red-500 text-white',
      backgroundImage: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=800',
      icon: Calendar,
      featured: false
    },
    {
      id: 6,
      title: 'NSF Research Grant',
      subtitle: 'National Science Foundation Funding',
      description: 'Up to $500,000 funding available for innovative research projects',
      status: 'Grant',
      date: '20/04/2025',
      author: 'NSF Foundation',
      readTime: 'Grant',
      type: 'grant',
      category: 'Funding',
      bgColor: 'from-gray-600 to-gray-800',
      statusColor: 'bg-green-500 text-white',
      backgroundImage: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800',
      icon: DollarSign,
      featured: false
    }
  ];

  const totalPages = Math.ceil(allActivities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentActivities = allActivities.slice(startIndex, startIndex + itemsPerPage);
  
  const featuredActivity = currentActivities.find(activity => activity.featured);
  const regularActivities = currentActivities.filter(activity => !activity.featured);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const stats = [
    { icon: TrendingUp, value: '2.4K', label: 'Articles Read', color: 'text-blue-600' },
    { icon: Users, value: '156', label: 'Collaborations', color: 'text-green-600' },
    { icon: Award, value: '24', label: 'Citations', color: 'text-purple-600' },
    { icon: BookOpen, value: '8', label: 'Publications', color: 'text-orange-600' }
  ];

  return (
    <div>
      {/* Magazine Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Academic Insights</h2>
            <p className="text-gray-600">Stay updated with the latest in research, funding, and academic opportunities</p>
          </div>
          <div className="flex items-center space-x-6">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <IconComponent className={`w-5 h-5 ${stat.color} mr-2`} />
                    <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">{stat.label}</span>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Category Tags */}
        <div className="flex items-center space-x-4 mb-6">
          <span className="text-sm font-medium text-gray-500">CATEGORIES:</span>
          {['All', 'Research', 'Funding', 'Events', 'Projects'].map((category, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                index === 0 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Two Column Layout - Featured and Regular Cards */}
      <div className="grid grid-cols-9 gap-6 mb-8">
        {/* Featured Article - Large Card (Left) */}
        {featuredActivity && (
          <div className="col-span-6">
            <div className="relative h-96 rounded-2xl overflow-hidden group cursor-pointer shadow-2xl">
              <div 
                className="absolute inset-0 bg-cover bg-center transform group-hover:scale-105 transition-transform duration-700"
                style={{ backgroundImage: `url(${featuredActivity.backgroundImage})` }}
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${featuredActivity.bgColor} opacity-90 group-hover:opacity-80 transition-opacity duration-300`} />
              
              {/* Content Overlay */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                <div className="flex items-start justify-between">
                  <span className={`text-sm font-bold px-3 py-1 rounded-lg ${featuredActivity.statusColor} backdrop-blur-md shadow-lg`}>
                    {featuredActivity.status}
                  </span>
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full opacity-100"></div>
                    <div className="w-2 h-2 bg-white rounded-full opacity-50"></div>
                    <div className="w-2 h-2 bg-white rounded-full opacity-50"></div>
                    <div className="w-2 h-2 bg-white rounded-full opacity-50"></div>
                    <div className="w-2 h-2 bg-white rounded-full opacity-50"></div>
                  </div>
                </div>

                <div>
                  <h1 className="text-2xl font-bold mb-3 leading-tight">
                    {featuredActivity.title}
                  </h1>
                  <p className="text-sm opacity-90 mb-4 leading-relaxed">
                    {featuredActivity.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="opacity-75">{featuredActivity.date}</span>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{featuredActivity.views}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span>{featuredActivity.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Share2 className="w-4 h-4" />
                          <span>{featuredActivity.shares}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regular Articles - Medium Cards (Middle) */}
        <div className="col-span-3 space-y-4">
          {regularActivities.map((activity, index) => (
            <div
              key={activity.id}
              className="relative h-44 rounded-xl overflow-hidden group cursor-pointer shadow-lg"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transform group-hover:scale-105 transition-transform duration-500"
                style={{ backgroundImage: `url(${activity.backgroundImage})` }}
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${activity.bgColor} opacity-80 group-hover:opacity-70 transition-opacity duration-300`} />
              
              <div className="absolute inset-0 p-4 flex flex-col justify-between text-white">
                <div className="flex items-start justify-between">
                  <span className={`text-xs font-bold px-2 py-1 rounded ${activity.statusColor}`}>
                    {activity.status}
                  </span>
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-white rounded-full opacity-100"></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full opacity-50"></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full opacity-50"></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full opacity-50"></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full opacity-50"></div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2 leading-tight">
                    {activity.title}
                  </h3>
                  <p className="text-xs opacity-75">{activity.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;