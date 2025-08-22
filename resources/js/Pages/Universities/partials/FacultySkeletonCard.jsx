import React from 'react';

const FacultySkeletonCard = () => (
  <div className="bg-white shadow-md rounded-lg overflow-hidden relative animate-pulse">
    {/* Faculty Banner */}
    <div className="h-32 bg-gray-200"></div>

    {/* Faculty Logo */}
    <div className="flex justify-center -mt-12">
      <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-300"></div>
    </div>

    {/* Faculty Info */}
    <div className="text-center mt-4">
      <div className="h-6 w-3/4 mx-auto bg-gray-300 rounded mb-2"></div>
      <div className="h-4 w-1/2 mx-auto bg-gray-200 rounded mb-4"></div>
      <div className="h-6 w-16 mx-auto bg-gray-300 rounded-full"></div>
    </div>

    {/* Social Links */}
    <div className="flex justify-around items-center mt-6 py-4 border-t px-10">
      <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
      <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
      <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
      <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
    </div>
  </div>
);

export default FacultySkeletonCard; 