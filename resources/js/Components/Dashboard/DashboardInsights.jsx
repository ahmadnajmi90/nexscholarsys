import React from "react";
import QuickActions from "./QuickActions";
import UpcomingEvents from "./UpcomingEvents";
import RegisteredUser from "./RegisteredUser";
import OnlineUser from "./OnlineUser";
import ClicksByType from "./ClicksByType";
import ProfileCard from "../ProfileCard";
import useRoles from "../../Hooks/useRoles";
import Carousel from "./Carousel"; // Adjust the import path if needed
import { FaEye, FaHeart, FaShareAlt } from 'react-icons/fa';

const DashboardInsight = ({
  totalUsers,
  onlineUsers,
  clicksByType,
  posts,
  events,
  projects,
  grants,
  academicians,
  universities,
  faculties,
  users,
  researchOptions,
}) => {
  const { isAdmin, isFacultyAdmin } = useRoles();

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

  return (
    <div className="p-6 min-h-screen">
      {/* Admin Insights */}
      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <RegisteredUser totalUsers={totalUsers} />
          <OnlineUser onlineUsers={onlineUsers} />
          <ClicksByType clicksByType={clicksByType} />
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
            <Carousel
              items={events.slice(0, 5)}
              timer={8000}
              fadeDuration={300}
              renderItem={renderEventItem}
              label="Event"
              seoPrefix="/events/"
              label_color="bg-red-500"
            />
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

      {/* Other Dashboard Content */}
      <div className="grid grid-cols-1 gap-4">
        <QuickActions />
      </div>
    </div>
  );
};

export default DashboardInsight;
