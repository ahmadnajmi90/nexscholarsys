// resources/js/Pages/Components/ContentSkeletonCard.jsx
import React from 'react';

const ContentSkeletonCard = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
    <div className="w-full h-48 bg-gray-200"></div>
    <div className="p-6 text-center">
      <div className="h-6 w-3/4 mx-auto bg-gray-300 rounded"></div>
      <div className="mt-4 space-y-2">
        <div className="h-4 w-full mx-auto bg-gray-200 rounded"></div>
        <div className="h-4 w-5/6 mx-auto bg-gray-200 rounded"></div>
      </div>
    </div>
    <div className="pb-8 text-center">
        <div className="h-10 w-32 mx-auto bg-gray-300 rounded-full"></div>
    </div>
  </div>
);

export default ContentSkeletonCard; 