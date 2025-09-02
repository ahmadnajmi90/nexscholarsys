import React, { useState } from 'react';
import Carousel from './Carousel';
import { TrendingUp, Users, Award, BookOpen, Newspaper, Calendar, DollarSign, FolderOpen } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import useIsDesktop from '@/Hooks/useIsDesktop';

const ProductGrid = ({ posts = [], events = [], grants = [], scholarships = [], projects = [] }) => {
  const { auth } = usePage().props;
  const user = auth.user;
  const [activeCategory, setActiveCategory] = useState('All');
  const isDesktop = useIsDesktop();

  const stripHtml = (html) => {
    if (typeof window === 'undefined') return '';
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  // --- Data Mapping Functions ---
  const mapPostToCard = (post) => ({
    id: `post-${post.id}`,
    title: post.title || 'Untitled Post',
    subtitle: post.category || 'Post',
    description: post.content ? stripHtml(post.content).substring(0, 120) + '...' : '',
    status: 'Post',
    date: new Date(post.created_at).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }),
    author: post.author?.name || 'Unknown Author',
    readTime: `${Math.ceil((post.content?.length || 0) / 1000)} min read`,
    views: post.total_views || '0',
    likes: post.total_likes || '0',
    shares: post.total_shares || '0',
    type: 'post',
    category: post.category || 'Research',
    bgColor: 'from-blue-900 to-purple-900',
    statusColor: 'bg-blue-500 text-white',
    backgroundImage: post.featured_image
      ? `/storage/${post.featured_image}`
      : 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=1200',
    url: `/posts/${post.url}`,
  });

  const mapEventToCard = (event) => ({
    id: `event-${event.id}`,
    title: event.event_name || 'Untitled Event',
    subtitle: event.event_theme || 'Event',
    description: event.description ? stripHtml(event.description).substring(0, 120) + '...' : '',
    status: 'Event',
    date: new Date(event.start_date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }),
    author: event.author_id || 'Organizer',
    readTime: 'Event',
    views: event.total_views || '0',
    likes: event.total_likes || '0',
    shares: event.total_shares || '0',
    type: 'event',
    category: event.event_type || 'Conference',
    bgColor: 'from-purple-600 to-purple-800',
    statusColor: 'bg-red-500 text-white',
    backgroundImage: event.image
      ? `/storage/${event.image}`
      : 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=800',
    url: `/events/${event.url}`,
  });

  const mapFundingToCard = (funding, type) => ({
    id: `${type}-${funding.id}`,
    title: funding.title || `Untitled ${type.charAt(0).toUpperCase() + type.slice(1)}`,
    subtitle: type === 'grant'
      ? (Array.isArray(funding.grant_theme) ? funding.grant_theme.join(', ') : 'Grant')
      : (Array.isArray(funding.scholarship_type) ? funding.scholarship_type.join(', ') : 'Scholarship'),
    description: funding.description ? stripHtml(funding.description).substring(0, 120) + '...' : '',
    status: type === 'grant' ? 'Grant' : 'Scholarship',
    date: new Date(funding.application_deadline).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }),
    author: funding.sponsored_by || 'Funder',
    readTime: type === 'grant' ? 'Grant' : 'Scholarship',
    views: funding.total_views || '0',
    likes: funding.total_likes || '0',
    shares: funding.total_shares || '0',
    type: type,
    category: type === 'grant' ? (funding.grant_type || 'Funding') : (funding.scholarship_type || 'Scholarship'),
    bgColor: type === 'grant' ? 'from-green-600 to-green-800' : 'from-blue-600 to-blue-800',
    statusColor: type === 'grant' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white',
    backgroundImage: funding.image
      ? `/storage/${funding.image}`
      : type === 'grant'
        ? 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800'
        : 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=800',
    url: type === 'grant' ? `/funding/grants/${funding.url}` : `/funding/scholarships/${funding.url}`,
  });

  const mapProjectToCard = (project) => ({
    id: `project-${project.id}`,
    title: project.title || 'Untitled Project',
    subtitle: project.category || 'Project',
    description: project.description ? stripHtml(project.description).substring(0, 120) + '...' : '',
    status: 'Project',
    date: new Date(project.created_at).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }),
    author: project.author?.name || 'Unknown Author',
    readTime: 'Project',
    views: project.total_views || '0',
    likes: project.total_likes || '0',
    shares: project.total_shares || '0',
    type: 'project',
    category: project.category || 'Research',
    bgColor: 'from-cyan-900 to-teal-900',
    statusColor: 'bg-cyan-500 text-white',
    backgroundImage: project.image ? `/storage/${project.image}` : 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg',
    icon: FolderOpen,
    url: `/projects/${project.url}`,
  });

  const mappedPosts = posts.slice(0, 5).map(mapPostToCard);
  const mappedEvents = events.slice(0, 5).map(mapEventToCard);

  // Combine grants and scholarships into funding
  const allFundingItems = [
    ...grants.map(grant => ({ ...grant, fundingType: 'grant' })),
    ...scholarships.map(scholarship => ({ ...scholarship, fundingType: 'scholarship' }))
  ].sort((a, b) => {
    const today = new Date();
    const deadlineA = new Date(a.application_deadline);
    const deadlineB = new Date(b.application_deadline);

    const isEndedA = deadlineA < today;
    const isEndedB = deadlineB < today;

    // If one is ended and the other is not, put active first
    if (!isEndedA && isEndedB) return -1;
    if (isEndedA && !isEndedB) return 1;

    // If both are active, sort by deadline ascending (closest first)
    if (!isEndedA && !isEndedB) {
      return deadlineA - deadlineB;
    }

    // If both are ended, sort by deadline descending (furthest first)
    if (isEndedA && isEndedB) {
      return deadlineB - deadlineA;
    }

    return 0;
  });

  const mappedFunding = allFundingItems.slice(0, 5).map(item => mapFundingToCard(item, item.fundingType));
  const mappedProjects = projects.slice(0, 5).map(mapProjectToCard);
  
  // Combine all for the single carousel view
  const allMappedActivities = {
    'Posts': mappedPosts,
    'Events': mappedEvents,
    'Funding': mappedFunding,
    'Projects': mappedProjects
  };

  // Debug logging
  console.log('allMappedActivities:', allMappedActivities);
  console.log('mappedPosts length:', mappedPosts.length);
  console.log('mappedEvents length:', mappedEvents.length);
  console.log('mappedFunding length:', mappedFunding.length);
  console.log('mappedProjects length:', mappedProjects.length);

  // --- Dynamic Category Tabs ---
  const availableCategories = ['All'];
  
  // Only add categories that have data
  if (posts.length > 0) availableCategories.push('Posts');
  if (events.length > 0) availableCategories.push('Events');
  if (grants.length > 0 || scholarships.length > 0) availableCategories.push('Funding');

  // Update the carousel data to use mappedFunding
  if (grants.length > 0 || scholarships.length > 0) {
    allMappedActivities['Funding'] = mappedFunding;
  }
  if (projects.length > 0) availableCategories.push('Projects');

  // Reset active category if it's not available
  React.useEffect(() => {
    if (!availableCategories.includes(activeCategory)) {
      setActiveCategory('All');
    }
  }, [availableCategories, activeCategory]);

  return (
    <div>
      {/* Header and Category Tags */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Academic Insights</h2>
            <p className="text-gray-600 text-sm md:text-base">Stay updated with the latest in research, funding, and academic opportunities</p>
          </div>
          {/* Hide stats on mobile */}
          {user.academician?.scholar_profile && (
            <div className="hidden md:flex items-center space-x-6">
              {[
                { icon: Users, value: user.collaborator_count, label: 'Collaborations', color: 'text-green-600' },
                { icon: Award, value: user.academician.scholar_profile.total_citations, label: 'Citations', color: 'text-purple-600' },
                { icon: BookOpen, value: user.academician.total_publications, label: 'Publications', color: 'text-orange-600' }
              ].map((stat, index) => {
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
          )}
        </div>
        
        {/* Category Tags */}
        <div className="flex items-center space-x-2 md:space-x-4 mb-6 overflow-x-auto">
          <span className="text-sm font-medium text-gray-500 whitespace-nowrap">CATEGORIES:</span>
          {availableCategories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-3 md:px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                activeCategory === category
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* --- RESPONSIVE LAYOUT SWITCH --- */}
      {isDesktop ? (
        // --- DESKTOP VIEW ---
                 activeCategory === 'All' ? (
           // Three-carousel layout for "All" category
           <div className="grid grid-cols-1 md:grid-cols-9 gap-6 mb-8">
             <div className="md:col-span-6">
               <Carousel
                 items={mappedPosts}
                 cardType="featured"
                 key="posts-carousel"
                 timer={8000}
                 className="h-96"
               />
             </div>
             <div className="md:col-span-3 flex flex-col space-y-4">
               {mappedEvents.length > 0 && (
                 <div className="h-48">
                   <Carousel
                     items={mappedEvents}
                     cardType="regular"
                     key="events-carousel"
                     timer={6000}
                     className="h-full"
                   />
                 </div>
               )}
               {mappedFunding.length > 0 && (
                 <div className="h-48">
                   <Carousel
                     items={mappedFunding}
                     cardType="regular"
                     key="funding-carousel"
                     timer={7000}
                     className="h-full"
                   />
                 </div>
               )}
             </div>
           </div>
        ) : (
          // Single full-width carousel for specific categories
          <div className="grid grid-cols-1 md:grid-cols-9 gap-6 mb-8">
            <div className="col-span-1 md:col-span-9">
              {(() => {
                const selectedItems = allMappedActivities[activeCategory];
                console.log('Selected category:', activeCategory);
                console.log('Available items:', selectedItems);
                
                if (!selectedItems || selectedItems.length === 0) {
                  return (
                    <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <p className="text-gray-500 text-lg">No {activeCategory.toLowerCase()} available</p>
                        <p className="text-gray-400 text-sm">Check back later for new content</p>
                      </div>
                    </div>
                  );
                }
                
                                 console.log('Rendering Carousel for category:', activeCategory, 'with items:', selectedItems.length);
                 console.log('Selected items:', selectedItems);
                 return (
                   <div className="h-96">
                     <Carousel
                       items={selectedItems}
                       cardType="featured"
                       key={`${activeCategory}-carousel-${selectedItems.length}`}
                       timer={8000}
                       className="h-full"
                     />
                   </div>
                 );
              })()}
            </div>
          </div>
        )
      ) : (
        // --- MOBILE VIEW ---
        <div className="space-y-6 mb-8">
          {(activeCategory === 'All' || activeCategory === 'Posts') && mappedPosts.length > 0 ? (
            <div className="h-80">
              <Carousel
                items={mappedPosts}
                cardType="featured"
                key="posts-mobile"
              />
            </div>
          ) : null}
          {(activeCategory === 'All' || activeCategory === 'Events') && mappedEvents.length > 0 ? (
            <div className={activeCategory === 'All' ? 'h-48' : 'h-80'}>
              <Carousel
                items={mappedEvents}
                cardType={activeCategory === 'All' ? 'regular' : 'featured'}
                key={`events-mobile-${activeCategory}`}
              />
            </div>
          ) : null}
          {(activeCategory === 'All' || activeCategory === 'Funding') && mappedFunding.length > 0 ? (
            <div className={activeCategory === 'All' ? 'h-48' : 'h-80'}>
              <Carousel
                items={mappedFunding}
                cardType={activeCategory === 'All' ? 'regular' : 'featured'}
                key={`funding-mobile-${activeCategory}`}
              />
            </div>
          ) : null}
          {(activeCategory === 'All' || activeCategory === 'Projects') && mappedProjects.length > 0 ? (
            <div className={activeCategory === 'All' ? 'h-48' : 'h-80'}>
              <Carousel
                items={mappedProjects}
                cardType={activeCategory === 'All' ? 'regular' : 'featured'}
                key={`projects-mobile-${activeCategory}`}
              />
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;