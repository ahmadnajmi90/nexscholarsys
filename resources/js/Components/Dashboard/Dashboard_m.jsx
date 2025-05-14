import React, { useState, useEffect } from "react";
import Carousel from "./Carousel"; // Adjust the import path as needed
import QuickLinks from "./QuickActions"; // Adjust the import path as needed
import { FaEye, FaHeart, FaShareAlt, FaUserShield, FaUsers } from 'react-icons/fa';
import { Link } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import AdminDashboardComponent_m from "./AdminDashboardComponent_m"; // Import AdminDashboardComponent_m
import FacultyAdminDashboardComponent_m from "./FacultyAdminDashboardComponent_m"; // Import FacultyAdminDashboardComponent_m
import useRoles from '@/Hooks/useRoles';

const Dashboard_M = ({ 
  posts, 
  events, 
  grants, 
  users, 
  profileIncompleteAlert, 
  totalUsers, 
  topViewedAcademicians, 
  analyticsData,
  facultyAdminDashboardData,
  academicians,
  universities,
  faculties,
  researchOptions
}) => {
  // Format today's date as dd/mm/yyyy
  const todayDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  
  // State to track if alert should be shown with animation
  const [showAlert, setShowAlert] = useState(false);
  
  // Effect to track first appearance of the alert
  useEffect(() => {
    if (profileIncompleteAlert?.show) {
      setShowAlert(true);
    }
  }, [profileIncompleteAlert]);

  // Get user roles
  const { isAdmin, isFacultyAdmin } = useRoles();

  // Render functions for carousel items
  const renderPostItem = (post) => (
    <div
      className="block relative p-5 transform transition-opacity duration-500 rounded-2xl overflow-hidden h-full flex flex-col justify-end"
      style={{
        backgroundImage: `url(${encodeURI(
          post.featured_image ? `/storage/${post.featured_image}` : "/storage/default.jpg"
        )})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="relative z-10 text-white pr-10">
        <h2 className="text-4xl font-bold truncate" title={post.title}>
          {post.title || "Untitled Post"}
        </h2>
        {post.content && (
          <div
            className="text-sm line-clamp-2 mb-2"
            dangerouslySetInnerHTML={{ __html: post.content }}
          ></div>
        )}
        {/* Date and Statistics */}
        <div className="flex items-center mt-1 space-x-2">
          <p className="text-xs">
            {new Date(post.created_at).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </p>
          <div className="flex items-center space-x-2">
            <div className="flex items-center text-xs">
              <FaEye className="w-4 h-4" />
              <span className="ml-1">{post.total_views}</span>
            </div>
            <div className="flex items-center text-xs">
              <FaHeart className="w-4 h-4 text-red-500" />
              <span className="ml-1">{post.total_likes}</span>
            </div>
            <div className="flex items-center text-xs">
              <FaShareAlt className="w-4 h-4" />
              <span className="ml-1">{post.total_shares}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEventItem = (event) => (
    <div
      className="block relative p-3 transform transition-opacity duration-500 rounded-2xl overflow-hidden h-full flex flex-col justify-end"
      style={{
        backgroundImage: `url(${encodeURI(
          event.image ? `/storage/${event.image}` : "/storage/default.jpg"
        )})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="relative z-10 text-white">
        <h3 className="text-lg font-bold truncate" title={event.event_name}>
          {event.event_name || "Untitled Event"}
        </h3>
        <p className="text-xs">
          {new Date(event.created_at).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  );

  const renderGrantItem = (grant) => (
    <div
      className="relative p-3 transform transition-opacity duration-500 rounded-2xl overflow-hidden h-full flex flex-col justify-end"
      style={{
        backgroundImage: `url(${encodeURI(
          grant.image ? `/storage/${grant.image}` : "/storage/default.jpg"
        )})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="relative z-10 text-white">
        <h3 className="text-lg font-bold truncate" title={grant.title}>
          {grant.title || "Untitled Grant"}
        </h3>
        <p className="text-xs">
          {new Date(grant.created_at).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  );

  return (
    <div className="w-screen bg-gray-200 flex items-center justify-center">
      <div
        className="bg-white text-gray-800 shadow-lg overflow-hidden relative flex flex-col"
        style={{ width: "500px", maxWidth: "100%" }}
      >
        <div className="bg-white w-full px-5 pt-6 pb-4 overflow-y-auto">
          {/* Profile Incomplete Alert */}
          <Transition
            show={showAlert && profileIncompleteAlert?.show}
            enter="transition-all duration-300 ease-in-out"
            enterFrom="opacity-0 -translate-y-4"
            enterTo="opacity-100 translate-y-0"
            leave="transition-all duration-200"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 -translate-y-4"
          >
            <div className="p-4 mb-4 text-sm text-yellow-800 bg-yellow-100 rounded-lg" role="alert">
              <div className="flex items-center mb-2">
                {profileIncompleteAlert?.message}
              </div>
              <Link 
                href={route('role.edit')} 
                className="mt-2 inline-flex items-center px-4 py-2 bg-white text-yellow-800 border border-yellow-800 rounded-md hover:bg-yellow-50 transition-colors duration-200"
              >
                Update Now
                <span className="ml-2 w-2 h-2 bg-red-500 rounded-full"></span>
              </Link>
            </div>
          </Transition>
          
          {/* Admin Dashboard Section (conditionally rendered) */}
          {isAdmin && (
            <div className="mb-5">
              <AdminDashboardComponent_m 
                totalUsers={totalUsers}
                topViewedAcademicians={topViewedAcademicians}
                analyticsData={analyticsData}
              />
            </div>
          )}
          
          {/* Faculty Admin Dashboard Section (conditionally rendered) */}
          {isFacultyAdmin && (
            <div className="mb-5">
              <FacultyAdminDashboardComponent_m 
                dashboardData={facultyAdminDashboardData}
              />
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h2 className="text-base font-semibold mb-3">Faculty Administration</h2>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 p-3 rounded-lg text-sm text-center">
                    <div className="bg-blue-100 p-2 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-2">
                      <FaUserShield className="text-blue-700" />
                    </div>
                    <p className="font-medium mb-2">Verify Academicians</p>
                    <Link
                      href={route('faculty-admin.academicians')}
                      className="mt-1 inline-flex items-center justify-center px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors w-full text-xs"
                    >
                      Go to Verification
                    </Link>
                  </div>
                  <div className="bg-indigo-50 p-3 rounded-lg text-sm text-center">
                    <div className="bg-indigo-100 p-2 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-2">
                      <FaUsers className="text-indigo-700" />
                    </div>
                    <p className="font-medium mb-2">Academicians Directory</p>
                    <Link
                      href={route('faculty-admin.directory')}
                      className="mt-1 inline-flex items-center justify-center px-3 py-1.5 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors w-full text-xs"
                    >
                      View Directory
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Today Section - Only show for students and academicians */}
          {!isAdmin && !isFacultyAdmin && (
          <div className="mb-3">
            <h1 className="text-3xl font-bold">Today</h1>
            <p className="text-sm text-gray-500 uppercase font-bold">
              {todayDate}
            </p>
          </div>
          )}

          {/* Carousel Section */}
          {!isAdmin && !isFacultyAdmin && (
          <div className="mb-5">
            {/* First Row: Post Carousel (full width, spans both columns) */}
            <div className="mb-4 h-[280px]">
              <Carousel
                items={posts.slice(0, 5)}
                timer={7000}
                fadeDuration={300}
                renderItem={renderPostItem}
                label="Post"
                seoPrefix="/posts/"
                label_color="bg-blue-500"
              />
            </div>

            {/* Second Row: Two Columns - Event Carousel and Grant Carousel */}
            <div className="grid grid-cols-2 gap-4">
              <div className="h-[160px]">
                <Carousel
                  items={events.slice(0, 5)}
                  timer={8000}
                  fadeDuration={300}
                  renderItem={renderEventItem}
                  label="Event"
                  seoPrefix="/events/"
                  label_color="bg-red-500"
                />
              </div>
              <div className="h-[160px]">
                <Carousel
                  items={grants.slice(0, 5)}
                  timer={9000}
                  fadeDuration={300}
                  renderItem={renderGrantItem}
                  label="Grant"
                  seoPrefix="/grants/"
                  label_color="bg-green-700"
                />
              </div>
            </div>
          </div>
          )}

          {/* QuickLinks Section */}
          {!isAdmin && !isFacultyAdmin && (
          <div className="mb-4">
            <QuickLinks />
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard_M;
