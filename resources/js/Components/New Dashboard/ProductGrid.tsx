import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { Newspaper, Calendar, DollarSign, FolderOpen, ChevronLeft, ChevronRight, TrendingUp, Users, Award, BookOpen, Eye, Heart, Share2, Plus, Globe, Clock } from 'lucide-react';

const ProductGrid = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPage, setEventsPage] = useState(1);
  const itemsPerPage = 3; // 1 featured + 2 regular cards
  const eventsPerPage = 8;

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

  const upcomingEvents = [
    { 
      name: 'Mathematical Foundations of Computer Science 2025', 
      shortName: 'MFCS 2025',
      date: '25-27 Aug 2025', 
      location: 'Kuala Lumpur, Malaysia',
      type: 'Conference',
      status: 'Registration Open',
      deadline: '15 Jul 2025',
      flag: '🇲🇾',
      category: 'Computer Science'
    },
    { 
      name: 'Health Informatics in Africa Conference', 
      shortName: 'HELINA 2025',
      date: '26-28 Aug 2025', 
      location: 'Putrajaya, Malaysia',
      type: 'Conference',
      status: 'Call for Papers',
      deadline: '20 Jul 2025',
      flag: '🇲🇾',
      category: 'Health Informatics'
    },
    { 
      name: 'Computational Linguistics and Language Technology Research', 
      shortName: 'CLLTR3',
      date: '27-29 Aug 2025', 
      location: 'Penang, Malaysia',
      type: 'Workshop',
      status: 'Abstract Due',
      deadline: '10 Aug 2025',
      flag: '🇲🇾',
      category: 'Linguistics'
    },
    { 
      name: 'Head-driven Phrase Structure Grammar Conference', 
      shortName: 'HPSG 2025',
      date: '02-04 Sep 2025', 
      location: 'Johor Bahru, Malaysia',
      type: 'Conference',
      status: 'Registration Open',
      deadline: '25 Aug 2025',
      flag: '🇲🇾',
      category: 'Linguistics'
    },
    { 
      name: '16th International Microwave and Optical Conference', 
      shortName: '16. IMOC',
      date: '08-10 Sep 2025', 
      location: 'Cyberjaya, Malaysia',
      type: 'Conference',
      status: 'Paper Submission',
      deadline: '01 Sep 2025',
      flag: '🇲🇾',
      category: 'Engineering'
    },
    { 
      name: 'Association for the Advancement of Artificial Intelligence', 
      shortName: 'AAAI 2025',
      date: '15-17 Sep 2025', 
      location: 'Kuala Lumpur, Malaysia',
      type: 'Conference',
      status: 'Registration Open',
      deadline: '05 Sep 2025',
      flag: '🇲🇾',
      category: 'Artificial Intelligence'
    },
    { 
      name: 'Neural Information Processing Systems', 
      shortName: 'NeurIPS 2025',
      date: '22-24 Sep 2025', 
      location: 'Shah Alam, Malaysia',
      type: 'Conference',
      status: 'Call for Papers',
      deadline: '12 Sep 2025',
      flag: '🇲🇾',
      category: 'Machine Learning'
    },
    { 
      name: 'International Conference on Learning Representations', 
      shortName: 'ICLR 2025',
      date: '29 Sep - 01 Oct 2025', 
      location: 'Ipoh, Malaysia',
      type: 'Conference',
      status: 'Abstract Due',
      deadline: '20 Sep 2025',
      flag: '🇲🇾',
      category: 'Machine Learning'
    },
    { 
      name: 'Computer Vision and Pattern Recognition', 
      shortName: 'CVPR 2025',
      date: '05-07 Oct 2025', 
      location: 'Kota Kinabalu, Malaysia',
      type: 'Conference',
      status: 'Registration Open',
      deadline: '28 Sep 2025',
      flag: '🇲🇾',
      category: 'Computer Vision'
    },
    { 
      name: 'International Conference on Computer Vision', 
      shortName: 'ICCV 2025',
      date: '12-14 Oct 2025', 
      location: 'Malacca, Malaysia',
      type: 'Conference',
      status: 'Paper Submission',
      deadline: '05 Oct 2025',
      flag: '🇲🇾',
      category: 'Computer Vision'
    },
    { 
      name: 'European Conference on Computer Vision', 
      shortName: 'ECCV 2025',
      date: '19-21 Oct 2025', 
      location: 'Kuching, Malaysia',
      type: 'Workshop',
      status: 'Call for Papers',
      deadline: '10 Oct 2025',
      flag: '🇲🇾',
      category: 'Computer Vision'
    }
  ];

  const totalPages = Math.ceil(allActivities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentActivities = allActivities.slice(startIndex, startIndex + itemsPerPage);
  
  const featuredActivity = currentActivities.find(activity => activity.featured);
  const regularActivities = currentActivities.filter(activity => !activity.featured);

  const handlePageChange = (page: number) => {
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

  const handleEventsPrevPage = () => {
    if (eventsPage > 1) {
      setEventsPage(eventsPage - 1);
    }
  };

  const handleEventsNextPage = () => {
    if (eventsPage < Math.ceil(upcomingEvents.length / eventsPerPage)) {
      setEventsPage(eventsPage + 1);
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

      {/* Upcoming Events Section - Below Cards */}
      <div className="mb-8 bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Enhanced Table Header */}
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">Upcoming Academic Events</h3>
              <p className="text-sm text-gray-600">Conferences, workshops, and academic gatherings</p>
            </div>
            <span className="text-sm text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm border">
              {upcomingEvents.length} Events
            </span>
          </div>
          
          {/* Filter Tabs */}
          <div className="flex space-x-4">
            {['All Events', 'Conferences', 'Workshops', 'Deadlines'].map((filter, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  index === 0 
                    ? 'bg-blue-500 text-white shadow-md' 
                    : 'bg-white text-gray-600 hover:bg-gray-100 border'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
        
        {/* Enhanced Events Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Event</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date & Location</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type & Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Deadline</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {upcomingEvents.slice((eventsPage - 1) * eventsPerPage, eventsPage * eventsPerPage).map((event, index) => (
                <tr key={index} className="hover:bg-blue-50 transition-all duration-200 group">
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-200">
                        <span className="text-lg font-bold text-white">{event.flag}</span>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-lg mb-1 group-hover:text-blue-600 transition-colors duration-200">
                          {event.shortName}
                        </div>
                        <div className="text-sm text-gray-600 leading-relaxed max-w-xs">
                          {event.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{event.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{event.location}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {event.type}
                      </span>
                      <div className="text-sm text-gray-600">{event.category}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      event.status === 'Registration Open' ? 'bg-green-100 text-green-800' :
                      event.status === 'Call for Papers' ? 'bg-blue-100 text-blue-800' :
                      event.status === 'Abstract Due' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{event.deadline}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="w-10 h-10 bg-blue-500 text-white rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg group-hover:bg-blue-600">
                      <Plus className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Enhanced Table Pagination */}
        <div className="px-6 py-5 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {((eventsPage - 1) * eventsPerPage) + 1}-{Math.min(eventsPage * eventsPerPage, upcomingEvents.length)} of {upcomingEvents.length} events
            </div>
            
            <div className="flex items-center space-x-4">
            <button
              onClick={handleEventsPrevPage}
              disabled={eventsPage === 1}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                eventsPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-white shadow-sm'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Prev</span>
            </button>
            
            <div className="flex space-x-2">
              {Array.from({ length: Math.ceil(upcomingEvents.length / eventsPerPage) }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setEventsPage(page)}
                  className={`w-10 h-10 rounded-xl font-medium transition-all duration-200 ${
                    eventsPage === page
                      ? 'bg-blue-500 text-white shadow-md' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-white shadow-sm'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={handleEventsNextPage}
              disabled={eventsPage >= Math.ceil(upcomingEvents.length / eventsPerPage)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                eventsPage >= Math.ceil(upcomingEvents.length / eventsPerPage)
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-white bg-blue-500 hover:bg-blue-600 shadow-md'
              }`}
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Pagination */}
      <div className="flex items-center justify-center space-x-4 mt-8">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-200 ${
            currentPage === 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 shadow-lg hover:shadow-xl'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-medium">Previous</span>
        </button>

        <div className="flex space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-12 h-12 rounded-xl font-bold transition-all duration-200 ${
                currentPage === page
                  ? 'bg-indigo-600 text-white shadow-lg transform scale-105' 
                  : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 shadow-lg hover:shadow-xl'
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-200 ${
            currentPage === totalPages
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 shadow-lg hover:shadow-xl'
          }`}
        >
          <span className="font-medium">Next</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Page Info */}
      <div className="text-center mt-6">
        <p className="text-sm text-gray-500">
          Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, allActivities.length)} of {allActivities.length} articles
        </p>
      </div>
    </div>
  );
};

export default ProductGrid;