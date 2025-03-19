import React from 'react';
import { Link } from '@inertiajs/react';

export default function ItemCard({ item, auth, type }) {
  // For posts, use content; for others, use description.
  const title = type === 'event' ? item.event_name : item.title;
  const content = type === 'post' ? item.content : item.description;
  const image = type === 'post' ? item.featured_image : item.image;

  // Determine the correct route based on the type.
  const getRoute = () => {
    if (type === 'event') {
      return route("welcome.events.show", item.url);
    } else if (type === 'project') {
      return route("welcome.projects.show", item.url);
    } else if (type === 'grant') {
      return route("welcome.grants.show", item.url);
    } else if (type === 'post') {
      return route("welcome.posts.show", item.url);
    } else {
      return "#";
    }
  };

  const handleViewDetails = () => {
    // Navigate to the SEO-friendly URL.
    window.location.href = getRoute();
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden text-center pb-8 w-full">
      <img
        src={image ? `/storage/${image}` : "/storage/default.jpg"}
        alt={title}
        className="w-full h-48 object-cover"
      />
      {/* Content container */}
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-800 truncate" title={title}>
          {title}
        </h2>
        <p
          className="text-gray-600 mt-4 h-12 text-center font-extralight"
          style={{
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
          // For posts, this renders content; for other types, description.
          dangerouslySetInnerHTML={{ __html: content || "No content available." }}
        ></p>
      </div>
      {/* Button container */}
      <div className="px-4">
        <button
          onClick={handleViewDetails}
          className="inline-block rounded-full border border-gray-300 px-7 py-2 text-base font-medium text-body-color transition hover:border-primary hover:bg-primary hover:text-dark"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
