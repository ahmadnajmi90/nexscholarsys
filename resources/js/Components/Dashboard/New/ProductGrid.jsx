import React, { useState } from 'react';
import Carousel from '../Carousel';
import { TrendingUp, Users, Award, BookOpen } from 'lucide-react';
import { usePage } from '@inertiajs/react';

const ProductGrid = ({ posts = [], events = [], grants = [] }) => {
  const { auth } = usePage().props;
  const user = auth.user;
  console.log(user);
  // State for active category tab
  const [activeCategory, setActiveCategory] = useState('All');
  // Helper function to strip HTML tags
  const stripHtml = (html) => {
    if (typeof window === 'undefined') return ''; // Avoid server-side errors
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  // Helper function to map post to card format
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

  // Helper function to map event to card format
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
    type: 'event',
    category: event.event_type || 'Conference',
    bgColor: 'from-purple-600 to-purple-800',
    statusColor: 'bg-red-500 text-white',
    backgroundImage: event.image
      ? `/storage/${event.image}`
      : 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=800',
    url: `/events/${event.url}`,
  });

  // Helper function to map grant to card format
  const mapGrantToCard = (grant) => ({
    id: `grant-${grant.id}`,
    title: grant.title || 'Untitled Grant',
    subtitle: Array.isArray(grant.grant_theme) ? grant.grant_theme.join(', ') : 'Grant',
    description: grant.description ? stripHtml(grant.description).substring(0, 120) + '...' : '',
    status: 'Grant',
    date: new Date(grant.application_deadline).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }),
    author: grant.sponsored_by || 'Funder',
    readTime: 'Grant',
    type: 'grant',
    category: grant.grant_type || 'Funding',
    bgColor: 'from-green-600 to-green-800',
    statusColor: 'bg-green-500 text-white',
    backgroundImage: grant.image
      ? `/storage/${grant.image}`
      : 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800',
    url: `/grants/${grant.url}`,
  });

  // Map data for carousels (first 5 items from each array)
  const mappedPosts = posts.slice(0, 5).map(mapPostToCard);
  const mappedEvents = events.slice(0, 5).map(mapEventToCard);
  const mappedGrants = grants.slice(0, 5).map(mapGrantToCard);

  return (
    <div>
      {/* Magazine Header */}
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
          {['All', 'Posts', 'Events', 'Funding'].map((category) => (
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

      {/* Conditional Carousel Layout */}
      {activeCategory === 'All' ? (
        // Default three-carousel layout
        <div className="grid grid-cols-1 md:grid-cols-9 gap-6 mb-8">
          {/* Left Column: Posts Carousel */}
          <div className="md:col-span-6">
            <Carousel
              items={mappedPosts}
              cardType="featured"
              key="posts-carousel"
              timer={8000}
              className="h-96"
            />
          </div>

          {/* Right Column: Events and Grants Carousels */}
          <div className="md:col-span-3 flex flex-col space-y-4">
            <div className="h-48">
              <Carousel
                items={mappedEvents}
                cardType="regular"
                key="events-carousel"
                timer={6000}
                className="h-full"
              />
            </div>
            <div className="h-48">
              <Carousel
                items={mappedGrants}
                cardType="regular"
                key="grants-carousel"
                timer={7000}
                className="h-full"
              />
            </div>
          </div>
        </div>
      ) : (
        // Single full-width carousel for specific categories
        <div className="grid grid-cols-1 md:grid-cols-9 gap-6 mb-8">
          <div className="col-span-1 md:col-span-9">
            <Carousel
              items={(() => {
                switch (activeCategory) {
                  case 'Posts':
                    return mappedPosts;
                  case 'Events':
                    return mappedEvents;
                  case 'Funding':
                    return mappedGrants;
                  default:
                    return mappedPosts;
                }
              })()}
              cardType="featured"
              key={`${activeCategory}-carousel`}
              timer={8000}
              className="h-96"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;