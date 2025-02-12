import React from 'react';
import { Link } from '@inertiajs/react';

export default function ItemCard({ item, auth, type }) {
  // Determine title based on type.
  const title = type === 'event' ? item.event_name : item.title;
  // Use item.description for preview.
  const description = item.description;

  const handleViewDetails = () => {
    if (!auth || !auth.user) {
      // Redirect guest users to the login page.
      window.location.href = route('login');
    } else {
      // Navigate based on item type.
      if (type === 'event') {
        window.location.href = route('event.index', item.url);
      } else if (type === 'project') {
        window.location.href = route('project.index', item.url);
      } else if (type === 'grant') {
        window.location.href = route('grant.index', item.url);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col text-center pb-6">
      <img
        src={item.image ? `/storage/${item.image}` : "/storage/default.jpg"}
        alt={title}
        className="w-full h-48 object-cover"
      />
      
      {/* Content container that grows */}
      <div className="p-6 flex-grow">
        <h2 className="text-xl font-semibold text-gray-800 truncate" title={title}>
          {title}
        </h2>
        <p
          className="text-gray-600 mt-4 text-center font-extralight"
          style={{
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
          dangerouslySetInnerHTML={{ __html: description || "No content available." }}
        ></p>
      </div>
      
      {/* Button container aligned to bottom right */}
      <div className="px-4 mt-auto pb-4">
        <button
          onClick={handleViewDetails}
          className="inline-block rounded-full border border-gray-300 px-7 py-2 text-base font-medium transition hover:border-primary hover:bg-primary hover:text-dark"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
