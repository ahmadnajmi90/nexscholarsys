import React from 'react';

const UniversitySkeletonCard = () => (
  <div className="flex justify-center">
    <div className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col w-full max-w-[450px] sm:max-w-[250px] animate-pulse">
      {/* Faculty Banner */}
      <div className="h-32 bg-gray-200"></div>

      {/* University Logo */}
      <div className="flex justify-center -mt-12">
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-300"></div>
      </div>

      {/* University Info */}
      <div className="text-center mt-4 px-4 flex-grow">
        <div className="h-6 w-3/4 mx-auto bg-gray-300 rounded mb-2"></div>
        <div className="h-4 w-1/2 mx-auto bg-gray-200 rounded mb-4"></div>
        <div className="h-6 w-16 mx-auto bg-gray-300 rounded-full"></div>
      </div>

      {/* Social Links */}
      <div className="flex justify-center items-center mt-4 py-3 border-t space-x-6 px-4">
        <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
        <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
        <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
        <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  </div>
);

export default UniversitySkeletonCard; 