import React from "react";
import Carousel from "./Carousel"; // Adjust the import path as needed
import QuickLinks from "./QuickActions"; // Adjust the import path as needed

const Dashboard_M = ({ posts, events, grants, users }) => {
  // Format today’s date as dd/mm/yyyy
  const todayDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

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
        <p className="text-xs mt-1">
          {new Date(post.created_at).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </p>
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
    <div className="w-screen bg-gray-200 flex items-center justify-center p-4">
      <div
        className="bg-white text-gray-800 rounded-xl shadow-lg overflow-hidden relative flex flex-col"
        style={{ width: "414px", maxWidth: "100%" }}
      >
        <div className="bg-white w-full px-5 pt-6 pb-4 overflow-y-auto">
          {/* Today Section */}
          <div className="mb-3">
            <h1 className="text-3xl font-bold">Today</h1>
            <p className="text-sm text-gray-500 uppercase font-bold">
              {todayDate}
            </p>
          </div>

          {/* Carousel Section */}
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
                />
              </div>
            </div>
          </div>

          {/* QuickLinks Section */}
          <div className="mb-4">
            <QuickLinks />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard_M;
