import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import Header from '@/Components/Dashboard/Header';
import FeaturedCard from '@/Components/Dashboard/FeaturedCard';
import ProductGrid from '@/Components/Dashboard/ProductGrid';
import UpcomingEvents from '@/Components/Dashboard/UpcomingEvents';

const AcademicianDashboard = ({
  posts,
  events,
  projects,
  grants,
}) => {
  // Get authenticated user from Inertia props
  const { auth } = usePage().props;
  const user = auth.user;

  // Define tab names
  const tabs = ['Overview'];

  // State for active tab
  const [activeTab, setActiveTab] = useState('Overview');


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
    <div className="container mx-auto px-4 py-20 md:py-8 lg:py-8">
      {/* Header with welcome message and tabs */}
      <Header 
        user={user}
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Tab Content */}
      {activeTab === 'Overview' && (
        <div>
          {/* Featured Card at the top */}
          <FeaturedCard posts={posts} />
          
          {/* Product Grid below */}
          <ProductGrid
            posts={posts}
            events={events}
            grants={grants}
          />

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
      )}
    </div>
  );
};

export default AcademicianDashboard;