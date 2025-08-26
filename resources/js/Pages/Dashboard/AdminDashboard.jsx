import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';

// Import all necessary components
import Header from '@/Components/Dashboard/Header';
import FeaturedCard from '@/Components/Dashboard/FeaturedCard';
import ProductGrid from '@/Components/Dashboard/ProductGrid';
import UpcomingEvents from '@/Components/Dashboard/UpcomingEvents';
import AdminDashboardComponent from '@/Components/Dashboard/AdminDashboardComponent';

const AdminDashboard = ({
  posts,
  events,
  projects,
  grants,
  totalUsers,
  topViewedAcademicians,
  analyticsData,
}) => {
  const { auth } = usePage().props;
  const user = auth.user;

  // Define tabs with "Administration" as the primary
  const tabs = ['Administration', 'Overview'];
  
  // Set the default active tab to "Administration"
  const [activeTab, setActiveTab] = useState('Administration');

  // Pagination state for the UpcomingEvents component in the Overview tab
  const [eventsPage, setEventsPage] = useState(1);
  const eventsPerPage = 8;

  const handleEventsPrevPage = () => {
    if (eventsPage > 1) setEventsPage(eventsPage - 1);
  };

  const handleEventsNextPage = () => {
    if (eventsPage < Math.ceil(events.length / eventsPerPage)) {
      setEventsPage(eventsPage + 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20 md:py-8 lg:py-8">
      <Header
        user={user}
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Conditional Rendering based on activeTab */}
      <div className="mt-8">
        {activeTab === 'Administration' && (
          <AdminDashboardComponent
            totalUsers={totalUsers}
            topViewedAcademicians={topViewedAcademicians}
            analyticsData={analyticsData}
          />
        )}

        {activeTab === 'Overview' && (
          <>
            <FeaturedCard posts={posts} />
            <ProductGrid posts={posts} events={events} grants={grants} projects={projects} />
            <UpcomingEvents
              events={events}
              eventsPage={eventsPage}
              eventsPerPage={eventsPerPage}
              handleEventsPrevPage={handleEventsPrevPage}
              handleEventsNextPage={handleEventsNextPage}
              setEventsPage={setEventsPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;