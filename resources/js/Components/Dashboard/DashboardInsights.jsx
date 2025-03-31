import React, { useState, useEffect } from "react";
import QuickActions from "./QuickActions";
import UpcomingEvents from "./UpcomingEvents";
import RegisteredUser from "./RegisteredUser";
import ProfileCard from "../ProfileCard";
import useRoles from "../../Hooks/useRoles";
import Carousel from "./Carousel"; // Adjust the import path if needed
import { FaEye, FaHeart, FaShareAlt, FaUser } from 'react-icons/fa';
import { Link } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import AdminDashboardComponent from "./AdminDashboardComponent";

const DashboardInsight = ({
  totalUsers,
  onlineUsers,
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
  const { isAdmin, isFacultyAdmin } = useRoles();
  const [showAlert, setShowAlert] = useState(false);
  
  // Effect to track first appearance of the alert
  useEffect(() => {
    if (profileIncompleteAlert?.show) {
      setShowAlert(true);
    }
  }, [profileIncompleteAlert]);

  // Render functions for each carousel item
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
        {/* Date and Statistics Section */}
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

  const renderProjectItem = (project) => (
    <div
      className="block relative p-3 transform transition-opacity duration-500 rounded-2xl overflow-hidden h-full flex flex-col justify-end"
      style={{
        backgroundImage: `url(${encodeURI(
          project.image ? `/storage/${project.image}` : "/storage/default.jpg"
        )})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="relative z-10 text-white">
        <h3 className="text-lg font-bold truncate" title={project.title}>
          {project.title || "Untitled Project"}
        </h3>
        <p className="text-xs">
          {new Date(project.created_at).toLocaleDateString("en-GB", {
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

  // Component to display top viewed academicians
  const TopViewedAcademicians = ({ academicians }) => (
    <div className="bg-white p-4 rounded-lg shadow relative overflow-hidden">
      <div className="absolute top-0 right-0 p-3 rounded-bl-lg bg-indigo-500">
        <FaUser className="text-white text-xl" />
      </div>
      <h3 className="text-lg font-bold mb-3">Top Viewed Academicians</h3>
      <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2">
        {academicians && academicians.length > 0 ? (
          academicians.map((academician) => (
            <div key={academician.id} className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center">
                <div 
                  className="w-8 h-8 rounded-full bg-cover bg-center mr-2"
                  style={{
                    backgroundImage: `url(${encodeURI(
                      academician.profile_picture 
                        ? `/storage/${academician.profile_picture}` 
                        : "/storage/profile_pictures/default.jpg"
                    )})`
                  }}
                ></div>
                <div>
                  <p className="font-medium text-sm truncate max-w-[180px]" title={academician.full_name || 'Unknown'}>
                    {academician.full_name || 'Unknown'}
                  </p>
                  <p className="text-xs text-gray-500 truncate max-w-[180px]" title={academician.current_position || 'No position'}>
                    {academician.current_position || 'No position'}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <FaEye className="w-3 h-3 text-indigo-500 mr-1" />
                <span className="text-sm font-medium">{academician.total_views}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No view data available</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6 md:py-0 md:px-2 min-h-screen">
      {/* Profile Incomplete Alert */}
      <Transition
        show={showAlert && profileIncompleteAlert?.show}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="p-4 mb-4 text-sm text-yellow-800 bg-yellow-100 rounded-lg flex items-center justify-between" role="alert">
          <div className="flex items-center">
            {profileIncompleteAlert?.message}
          </div>
          <Link 
            href={route('role.edit')} 
            className="ml-4 px-4 py-2 bg-white text-yellow-800 border border-yellow-800 rounded-md hover:bg-yellow-50 transition-colors duration-200 flex items-center"
          >
            Update Now
            <span className="ml-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </Link>
        </div>
      </Transition>

      {/* Admin Dashboard - New Component */}
      {isAdmin && (
        <div className="mb-8">
          <AdminDashboardComponent 
            totalUsers={totalUsers}
            topViewedAcademicians={topViewedAcademicians}
            analyticsData={analyticsData}
          />
        </div>
      )}

      {isFacultyAdmin && (
        <ProfileCard
          profilesData={academicians}
          supervisorAvailabilityKey="availability_as_supervisor"
          universitiesList={universities}
          faculties={faculties}
          isPostgraduateList={false}
          isFacultyAdminDashboard={true}
          users={users}
          researchOptions={researchOptions}
        />
      )}

      {!isAdmin && (
        <div>
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-10 gap-6 mb-[10rem] h-[300px]">
          {/* First Column: Post Carousel (4/10) */}
          <div className="md:col-span-4 h-full">
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

          {/* Middle Column: Two Rows */}
          <div className="md:col-span-3 h-full flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4 h-1/2">
              {events.length > 0 && (
                <div className={`${projects.length === 0 ? 'col-span-2' : ''}`}>
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
              )}
              {projects.length > 0 && (
                <div className={`${events.length === 0 ? 'col-span-2' : ''}`}>
                  <Carousel
                    items={projects.slice(0, 5)}
                    timer={9000}
                    fadeDuration={300}
                    renderItem={renderProjectItem}
                    label="Project"
                    seoPrefix="/projects/"
                    label_color="bg-orange-500"
                  />
                </div>
              )}
            </div>
            <div className="h-1/2">
              <Carousel
                items={grants.slice(0, 5)}
                timer={10000}
                fadeDuration={300}
                renderItem={renderGrantItem}
                label="Grant"
                seoPrefix="/grants/"
                label_color="bg-green-700"
              />
            </div>
          </div>

          {/* Third Column: Upcoming Events (3/10) */}
          <div className="md:col-span-3 h-full">
            <UpcomingEvents events={events} />
          </div>
        </div>
        </div>
        )}

      {!isAdmin && (
        <div className="grid grid-cols-1 gap-4">
          <QuickActions />
        </div>
      )}
    </div>
  );
};

export default DashboardInsight;
