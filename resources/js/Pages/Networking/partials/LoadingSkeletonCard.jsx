import React from 'react';

const LoadingSkeletonCard = () => (
  <div className="bg-white shadow-md rounded-lg overflow-hidden animate-pulse w-full">
    <div className="h-32 bg-gray-200"></div>
    <div className="flex justify-center -mt-12">
      <div className="w-24 h-24 rounded-full bg-gray-300 border-4 border-white"></div>
    </div>
    <div className="text-center mt-4 px-6 pb-6">
      <div className="h-6 w-3/4 mx-auto bg-gray-300 rounded"></div>
      <div className="h-4 w-1/2 mx-auto bg-gray-200 rounded mt-2"></div>
      <div className="flex justify-center gap-2 mt-4">
        <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
        <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
      </div>
    </div>
    <div className="flex justify-around items-center py-4 border-t mt-2">
        <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
        <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
        <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
        <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
    </div>
  </div>
);

export default LoadingSkeletonCard; 