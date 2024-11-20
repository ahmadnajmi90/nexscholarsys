import React, { useState } from "react";

const UpcomingConferences = () => {
  // Conferences Data
  const conferences = [
    { title: "AI & Machine Learning Summit", date: "25-12-2024", location: "Langkawi" },
    { title: "Robot Vs Chicken in a Whereabouts Exploration", date: "25-12-2024", location: "Langkawi" },
    { title: "Quantum Computing Conference", date: "12-01-2025", location: "Kuala Lumpur" },
    { title: "Clean Energy Technologies Expo", date: "20-03-2025", location: "Penang" },
    { title: "Synthetic Biology Meet", date: "15-05-2025", location: "Johor Bahru" },
    { title: "Climate Action Conference", date: "10-07-2025", location: "Melaka" },
    { title: "Advanced Robotics Fair", date: "05-09-2025", location: "Kuching" },
    { title: "Renewable Energy Summit", date: "25-11-2025", location: "Langkawi" },
    { title: "Cybersecurity Forum", date: "08-02-2026", location: "Kuala Lumpur" },
    { title: "Space Exploration Technologies Summit", date: "18-04-2026", location: "Penang" },
    { title: "IoT & Smart Cities Conference", date: "22-06-2026", location: "Johor Bahru" },
    { title: "Agricultural Biotechnology Meet", date: "30-08-2026", location: "Melaka" },
  ];

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate paginated data
  const totalPages = Math.ceil(conferences.length / itemsPerPage);
  const currentData = conferences.slice(
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
    <div className="col-span-2 md:col-span-1 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-lg font-bold mb-4">Upcoming Conferences</h2>
      <ul className="space-y-4">
        {currentData.map((conf, index) => (
          <li
            key={index}
            className="flex items-center justify-between p-3 rounded-lg bg-gray-50 shadow hover:shadow-md transition-all"
          >
            <div className="flex items-start space-x-4">
              <img
                src="https://flagcdn.com/w40/my.png"
                alt="Malaysia Flag"
                className="w-8 h-5"
              />
              <div>
                <p
                  className="font-medium text-gray-800 truncate w-40 md:w-48"
                  title={conf.title}
                >
                  {conf.title}
                </p>
                <p className="text-sm text-gray-600">{conf.date} &nbsp; {conf.location}</p>

              </div>
            </div>
            <button className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-blue-700">
              &rarr;
            </button>
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className={`px-4 py-2 text-sm font-medium rounded-lg ${
            currentPage === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Prev
        </button>
        <p className="text-sm">
          Page {currentPage} of {totalPages}
        </p>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 text-sm font-medium rounded-lg ${
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

export default UpcomingConferences;
