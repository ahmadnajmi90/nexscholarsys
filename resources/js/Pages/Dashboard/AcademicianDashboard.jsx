import React, { useState } from 'react';
import FeaturedCard from '@/Components/Dashboard/New/FeaturedCard';
import ProductGrid from '@/Components/Dashboard/New/ProductGrid';
import UpcomingEvents from '@/Components/Dashboard/New/UpcomingEvents';

const AcademicianDashboard = ({
  posts,
  events,
  projects,
  grants,
  academicians,
  universities,
  faculties,
  users,
  researchOptions,
  profileIncompleteAlert,
  topViewedAcademicians,
  analyticsData,
}) => {
  // Combine all activities into a single array for ProductGrid
  const allActivities = [
    // Map posts to the format expected by ProductGrid
    ...posts.map(post => ({
      id: `post-${post.id}`,
      title: post.title || 'Untitled Post',
      description: post.content ? stripHtml(post.content).substring(0, 150) + '...' : '',
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
      category: 'Research',
      bgColor: 'from-blue-900 to-purple-900',
      statusColor: 'bg-blue-500 text-white',
      backgroundImage: post.featured_image 
        ? `/storage/${post.featured_image}` 
        : 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=1200',
    })),
    
    // Map events to the format expected by ProductGrid
    ...events.map(event => ({
      id: `event-${event.id}`,
      title: event.title || 'Untitled Event',
      subtitle: event.subtitle || '',
      description: event.description || '',
      status: 'Event',
      date: new Date(event.event_date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      author: event.organizer || 'Unknown Organizer',
      readTime: 'Event',
      type: 'event',
      category: event.category || 'Conference',
      bgColor: 'from-purple-600 to-purple-800',
      statusColor: 'bg-red-500 text-white',
      backgroundImage: event.featured_image 
        ? `/storage/${event.featured_image}` 
        : 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=800',
    })),
    
    // Map projects to the format expected by ProductGrid
    ...projects.map(project => ({
      id: `project-${project.id}`,
      title: project.title || 'Untitled Project',
      subtitle: project.subtitle || '',
      description: project.description || '',
      status: 'Project',
      date: new Date(project.created_at).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      author: project.author?.name || 'Unknown Author',
      readTime: 'Project',
      type: 'project',
      category: project.category || 'Research',
      bgColor: 'from-indigo-600 to-indigo-800',
      statusColor: 'bg-indigo-500 text-white',
      backgroundImage: project.featured_image 
        ? `/storage/${project.featured_image}` 
        : 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800',
    })),
    
    // Map grants to the format expected by ProductGrid
    ...grants.map(grant => ({
      id: `grant-${grant.id}`,
      title: grant.title || 'Untitled Grant',
      subtitle: grant.subtitle || '',
      description: grant.description || '',
      status: 'Grant',
      date: new Date(grant.deadline).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      author: grant.funder || 'Unknown Funder',
      readTime: 'Grant',
      type: 'grant',
      category: 'Funding',
      bgColor: 'from-green-600 to-green-800',
      statusColor: 'bg-green-500 text-white',
      backgroundImage: grant.featured_image 
        ? `/storage/${grant.featured_image}` 
        : 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800',
    })),
  ];

  // Sort all activities by date (newest first)
  allActivities.sort((a, b) => {
    const dateA = new Date(a.date.split('/').reverse().join('-'));
    const dateB = new Date(b.date.split('/').reverse().join('-'));
    return dateB - dateA;
  });

  // State for events pagination
  const [eventsPage, setEventsPage] = useState(1);
  const eventsPerPage = 8;

  // We're now using the events prop directly in the UpcomingEvents component

  // Event pagination handlers
  const handleEventsPrevPage = () => {
    if (eventsPage > 1) {
      setEventsPage(eventsPage - 1);
    }
  };

  const handleEventsNextPage = () => {
    if (eventsPage < Math.ceil(events.length / eventsPerPage)) {
      setEventsPage(eventsPage + 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Featured Card at the top */}
      <FeaturedCard posts={posts} />
      
      {/* Product Grid below */}
      <ProductGrid allActivities={allActivities} />

      {/* Upcoming Events Section */}
      <UpcomingEvents 
        events={events}
        eventsPage={eventsPage}
        eventsPerPage={eventsPerPage}
        handleEventsPrevPage={handleEventsPrevPage}
        handleEventsNextPage={handleEventsNextPage}
        setEventsPage={setEventsPage}
      />
    </div>
  );
};

// Helper function to strip HTML tags
const stripHtml = (html) => {
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

export default AcademicianDashboard;