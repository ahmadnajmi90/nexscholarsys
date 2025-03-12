import React, { useState } from "react";
import { Link } from "@inertiajs/react";

const UpcomingEvents = ({ events = [] }) => {
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate paginated data
  const totalPages = Math.ceil(events.length / itemsPerPage);
  const currentData = events.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Pagination Handlers
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 h-full">
      <h2 className="text-base font-bold mb-3">Upcoming Events</h2>
      <ul className="space-y-2">
        {currentData.map((event, index) => (
          <li
            key={index}
            className="flex items-center justify-between p-2 rounded-lg bg-gray-50 shadow hover:shadow-md transition-all"
          >
            <div className="flex items-start space-x-2">
              <img
                src="https://flagcdn.com/w40/my.png"
                alt="Malaysia Flag"
                className="w-6 h-4 mt-1 ml-2"
              />
              <div>
                <p
                  className="font-medium text-gray-800 truncate pr-2 w-32"
                  title={event.event_name}
                >
                  {event.event_name}
                </p>
                <p className="text-xs text-gray-600">
                  {event.start_date_time} &nbsp; {event.location}
                </p>
              </div>
            </div>
            {/* Link to the event's show page using its SEO-friendly URL */}
            <Link
              href={route("events.show", event.url)}
              className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-blue-700 text-xs"
            >
              &rarr;
            </Link>
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-3">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className={`px-3 py-1 text-xs font-medium rounded-lg ${
            currentPage === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Prev
        </button>
        <p className="text-xs">
          Page {currentPage} of {totalPages}
        </p>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 text-xs font-medium rounded-lg ${
            currentPage === totalPages
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UpcomingEvents;
