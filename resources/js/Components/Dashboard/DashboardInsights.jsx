import React, { useState, useEffect } from "react";
import QuickActions from "./QuickActions";
import UpcomingEvents from "./UpcomingEvents";
import RegisteredUser from "./RegisteredUser";
import OnlineUser from "./OnlineUser";
import ClicksByType from "./ClicksByType";
import ProfileCard from "../ProfileCard";
import useRoles from "../../Hooks/useRoles";

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
  const { isAdmin, isPostgraduate, isUndergraduate, isFacultyAdmin, isAcademician } = useRoles();

  // ----- Post Carousel -----
  const [postCurrentIndex, setPostCurrentIndex] = useState(0);
  const postLimited = posts.slice(0, 5);
  const handlePostDotClick = (index) => setPostCurrentIndex(index);
  useEffect(() => {
    const interval = setInterval(() => {
      setPostCurrentIndex(prev => (prev + 1) % postLimited.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [postLimited.length]);

  // ----- Event Carousel -----
  const [eventCurrentIndex, setEventCurrentIndex] = useState(0);
  const eventLimited = events.slice(0, 5);
  const handleEventDotClick = (index) => setEventCurrentIndex(index);
  useEffect(() => {
    const interval = setInterval(() => {
      setEventCurrentIndex(prev => (prev + 1) % eventLimited.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [eventLimited.length]);

  // ----- Project Carousel -----
  const [projectCurrentIndex, setProjectCurrentIndex] = useState(0);
  const projectLimited = projects.slice(0, 5);
  const handleProjectDotClick = (index) => setProjectCurrentIndex(index);
  useEffect(() => {
    const interval = setInterval(() => {
      setProjectCurrentIndex(prev => (prev + 1) % projectLimited.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [projectLimited.length]);

  // ----- Grant Carousel -----
  const [grantCurrentIndex, setGrantCurrentIndex] = useState(0);
  const grantLimited = grants.slice(0, 5);
  const handleGrantDotClick = (index) => setGrantCurrentIndex(index);
  useEffect(() => {
    const interval = setInterval(() => {
      setGrantCurrentIndex(prev => (prev + 1) % grantLimited.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [grantLimited.length]);

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
        <div className="relative md:col-span-4 h-full">
          {postLimited.length > 0 && (
            <div
              className="block relative p-5 transform transition-opacity duration-500 rounded-2xl overflow-hidden h-full flex flex-col justify-end"
              style={{
                backgroundImage: `url(${encodeURI(
                  postLimited[postCurrentIndex].featured_image
                    ? `/storage/${postLimited[postCurrentIndex].featured_image}`
                    : "/storage/default.jpg"
                )})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-black opacity-40"></div>
              {/* Bottom Overlay for Post Carousel */}
              <div className="relative z-10 text-white pr-10">
                <h2
                  className="text-4xl font-bold truncate"
                  title={postLimited[postCurrentIndex].title}
                >
                  {postLimited[postCurrentIndex].title || "Untitled Post"}
                </h2>
                {/* Content truncated */}
                {postLimited[postCurrentIndex].content && (
                  <div
                    className="text-sm line-clamp-2 mb-2"
                    dangerouslySetInnerHTML={{ __html: postLimited[postCurrentIndex].content }}
                  ></div>
                )}
                <p className="text-xs mt-1">
                  {new Date(postLimited[postCurrentIndex].created_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              {/* Pagination Dots */}
              <div className="absolute bottom-2 right-2 flex space-x-2">
                {postLimited.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePostDotClick(index)}
                    className={`w-2 h-2 rounded-full ${index === postCurrentIndex ? "bg-indigo-500" : "bg-gray-300"}`}
                  ></button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Middle Column: Two Rows (Top: Event & Project side-by-side, Bottom: Grant Carousel) */}
        <div className="md:col-span-3 h-full flex flex-col gap-4 h-full">
          {/* Top Half: Event & Project Carousels side by side */}
          <div className="grid grid-cols-2 gap-4 h-1/2">
            {/* Event Carousel */}
            <div className="relative h-full">
              {eventLimited.length > 0 && (
                <div
                  className="block relative p-3 transform transition-opacity duration-500 rounded-2xl overflow-hidden h-full flex flex-col justify-end"
                  style={{
                    backgroundImage: `url(${encodeURI(
                      eventLimited[eventCurrentIndex].image
                        ? `/storage/${eventLimited[eventCurrentIndex].image}`
                        : "/storage/default.jpg"
                    )})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-black opacity-40"></div>
                  {/* Bottom Overlay for Event Carousel */}
                  <div className="relative z-10 text-white">
                    <h3
                      className="text-lg font-bold truncate"
                      title={eventLimited[eventCurrentIndex].event_name}
                    >
                      {eventLimited[eventCurrentIndex].event_name || "Untitled Event"}
                    </h3>
                    <p className="text-xs">
                      {new Date(eventLimited[eventCurrentIndex].created_at).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  {/* Pagination Dots */}
                  <div className="absolute bottom-2 right-2 flex space-x-1">
                    {eventLimited.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handleEventDotClick(index)}
                        className={`w-2 h-2 rounded-full ${index === eventCurrentIndex ? "bg-indigo-500" : "bg-gray-300"}`}
                      ></button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* Project Carousel */}
            <div className="relative h-full">
              {projectLimited.length > 0 && (
                <div
                  className="block relative p-3 transform transition-opacity duration-500 rounded-2xl overflow-hidden h-full flex flex-col justify-end"
                  style={{
                    backgroundImage: `url(${encodeURI(
                      projectLimited[projectCurrentIndex].image
                        ? `/storage/${projectLimited[projectCurrentIndex].image}`
                        : "/storage/default.jpg"
                    )})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-black opacity-40"></div>
                  {/* Bottom Overlay for Project Carousel */}
                  <div className="relative z-10 text-white">
                    <h3
                      className="text-lg font-bold truncate"
                      title={projectLimited[projectCurrentIndex].title}
                    >
                      {projectLimited[projectCurrentIndex].title || "Untitled Project"}
                    </h3>
                    <p className="text-xs">
                      {new Date(projectLimited[projectCurrentIndex].created_at).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  {/* Pagination Dots */}
                  <div className="absolute bottom-2 right-2 flex space-x-1">
                    {projectLimited.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handleProjectDotClick(index)}
                        className={`w-2 h-2 rounded-full ${index === projectCurrentIndex ? "bg-indigo-500" : "bg-gray-300"}`}
                      ></button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Bottom Half: Grant Carousel (spanning full width of middle column) */}
          <div className="h-1/2">
            {grantLimited.length > 0 && (
              <div
                className="relative h-full p-3 transform transition-opacity duration-500 rounded-2xl overflow-hidden flex flex-col justify-end"
                style={{
                  backgroundImage: `url(${encodeURI(
                    grantLimited[grantCurrentIndex].image
                      ? `/storage/${grantLimited[grantCurrentIndex].image}`
                      : "/storage/default.jpg"
                  )})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-black opacity-40"></div>
                {/* Bottom Overlay for Grant Carousel */}
                <div className="relative z-10 text-white">
                  <h3
                    className="text-lg font-bold truncate"
                    title={grantLimited[grantCurrentIndex].title}
                  >
                    {grantLimited[grantCurrentIndex].title || "Untitled Grant"}
                  </h3>
                  <p className="text-xs">
                    {new Date(grantLimited[grantCurrentIndex].created_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                {/* Pagination Dots */}
                <div className="absolute bottom-2 right-2 flex space-x-1">
                  {grantLimited.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleGrantDotClick(index)}
                      className={`w-2 h-2 rounded-full ${index === grantCurrentIndex ? "bg-indigo-500" : "bg-gray-300"}`}
                    ></button>
                  ))}
                </div>
              </div>
            )}
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
