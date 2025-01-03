import React from "react";
import { FaHome, FaUsers, FaCalendarAlt, FaUser } from "react-icons/fa";

const Dashboard_M = () => {
    return (
      <div className="bg-gray-100 min-h-screen flex flex-col">
        {/* Fixed Header */}
        <nav className="bg-blue-600 text-white p-4 flex items-center justify-between fixed top-0 w-full z-10">
          <div className="font-bold text-lg">Welcome Ahmad Najmi</div>
          <button className="p-2">
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </nav>

        {/* Content Section with Padding */}
        <div className="flex-1 overflow-y-auto pt-16">
          {/* Stories Section */}
          <section className="px-4 mt-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Story</h2>
              <a href="#" className="text-blue-600 text-sm">
                View All
              </a>
            </div>
            <div className="flex space-x-4 overflow-x-scroll scrollbar-hide">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="w-40 h-40 bg-gray-200 rounded-lg flex-shrink-0"
                ></div>
              ))}
            </div>
          </section>

          {/* Events Section */}
          <section className="px-4 mt-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Event</h2>
              <a href="#" className="text-blue-600 text-sm">
                View All
              </a>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="w-full h-40 bg-gray-200 rounded-lg"
                ></div>
              ))}
            </div>
          </section>
        </div>


      {/* Bottom Navigation Bar */}
      <footer className="fixed bottom-0 w-full bg-white shadow-md border-t border-gray-200">
        <div className="flex justify-around py-2">
          <button className="text-blue-600 flex flex-col items-center">
            <FaHome className="h-6 w-6" />
            <span className="text-sm">Home</span>
          </button>
          <button className="text-gray-500 flex flex-col items-center">
            <FaUsers className="h-6 w-6" />
            <span className="text-sm">Network</span>
          </button>
          <button className="text-gray-500 flex flex-col items-center">
            <FaCalendarAlt className="h-6 w-6" />
            <span className="text-sm">Event</span>
          </button>
          <button className="text-gray-500 flex flex-col items-center">
            <FaUser className="h-6 w-6" />
            <span className="text-sm">Profile</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard_M;
