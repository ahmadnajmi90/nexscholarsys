import React, { useState } from 'react';
import { usePage, Link } from '@inertiajs/react';
import { FaUserShield, FaUsers } from 'react-icons/fa';

// Import all necessary components
import Header from '@/Components/Dashboard/New/Header';
import FeaturedCard from '@/Components/Dashboard/New/FeaturedCard';
import ProductGrid from '@/Components/Dashboard/New/ProductGrid';
import UpcomingEvents from '@/Components/Dashboard/New/UpcomingEvents';
import FacultyAdminDashboardComponent from '@/Components/Dashboard/FacultyAdminDashboardComponent';

const FacultyAdminDashboard = ({
  posts,
  events,
  projects,
  grants,
  facultyAdminDashboardData,
}) => {
  const { auth } = usePage().props;
  const { user } = auth;

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
          <div className="space-y-8">
            <FacultyAdminDashboardComponent dashboardData={facultyAdminDashboardData} />
            
            <div className="border-t pt-8">
              <h2 className="text-xl font-semibold mb-4">Faculty Administration</h2>
              <div className="bg-white shadow-md rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-lg p-6 flex flex-col items-center text-center">
                    <div className="bg-blue-100 p-4 rounded-full mb-4">
                      <FaUserShield className="text-blue-700 text-2xl" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Verify Academicians</h3>
                    <p className="text-gray-600 mb-4">Review and verify unverified academicians in your faculty.</p>
                    <Link 
                      href={route('faculty-admin.academicians')}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Go to Verification
                    </Link>
                  </div>
                  
                  <div className="bg-indigo-50 rounded-lg p-6 flex flex-col items-center text-center">
                    <div className="bg-indigo-100 p-4 rounded-full mb-4">
                      <FaUsers className="text-indigo-700 text-2xl" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Academicians Directory</h3>
                    <p className="text-gray-600 mb-4">View and manage all academicians in your faculty.</p>
                    <Link 
                      href={route('faculty-admin.directory')}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      View Directory
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
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

export default FacultyAdminDashboard;
