import React, { useState } from "react";

const UpcomingEvents = ({ events = [] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const handleQuickInfoClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

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
            <button
              onClick={() => handleQuickInfoClick(event)}
              className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-blue-700 text-xs"
            >
              &rarr;
            </button>
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

      {/* Modal Section */}
      {isModalOpen && selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-4 w-11/12 max-w-2xl relative overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <h3 className="text-xl font-bold mb-3 text-gray-800 text-center">
              {selectedItem.event_name}
            </h3>

            {/* Modal Content */}
            <div className="space-y-2">
              <div className="text-gray-600">
                <span className="font-semibold">Description:</span>
                {selectedItem.description ? (
                  <div
                    className="mt-1 text-sm"
                    dangerouslySetInnerHTML={{ __html: selectedItem.description }}
                  ></div>
                ) : (
                  <p className="mt-1 text-sm text-gray-500">No description available.</p>
                )}
              </div>

              <p className="text-gray-600 text-sm">
                <span className="font-semibold">Event type:</span>{" "}
                {(() => {
                  switch (selectedItem.event_type) {
                    case "competition":
                      return "Competition";
                    case "conference":
                      return "Conference";
                    case "workshop":
                      return "Workshop";
                    case "seminar":
                      return "Seminar";
                    case "webinar":
                      return "Webinar";
                    default:
                      return "Not provided";
                  }
                })()}
              </p>

              <p className="text-gray-600 text-sm">
                <span className="font-semibold">Event Duration:</span>{" "}
                {selectedItem.start_date_time
                  ? `${selectedItem.start_date_time} - ${selectedItem.end_date_time}`
                  : "Not provided"}
              </p>

              <p className="text-gray-600 text-sm">
                <span className="font-semibold">Target Audience:</span>{" "}
                {(() => {
                  try {
                    const parsedAudience = JSON.parse(selectedItem.target_audience);
                    if (Array.isArray(parsedAudience)) {
                      return parsedAudience.join(", ");
                    }
                    return "Invalid format";
                  } catch (e) {
                    return selectedItem.target_audience || "Not provided";
                  }
                })()}
              </p>

              <p className="text-gray-600 text-sm">
                <span className="font-semibold">Organized by:</span>{" "}
                {selectedItem.organized_by || "Not provided"}
              </p>

              <p className="text-gray-600 text-sm">
                <span className="font-semibold">Registration Link:</span>{" "}
                {selectedItem.registration_url || "Not provided"}
              </p>

              <p className="text-gray-600 text-sm">
                <span className="font-semibold">Registration Deadline:</span>{" "}
                {selectedItem.registration_deadline || "Not provided"}
              </p>

              <p className="text-gray-600 text-sm">
                <span className="font-semibold">Contact Email:</span>{" "}
                {selectedItem.contact_email || "Not provided"}
              </p>

              <p className="text-gray-600 text-sm">
                <span className="font-semibold">Contact No.:</span>{" "}
                {selectedItem.contact_number || "Not provided"}
              </p>

              <p className="text-gray-600 text-sm">
                <span className="font-semibold">Location:</span>{" "}
                {selectedItem.location || "Not provided"}
              </p>

              <p className="text-gray-600 text-sm">
                <span className="font-semibold">Fees:</span>{" "}
                {selectedItem.fees || "Not provided"}
              </p>

              <p className="text-gray-600 text-sm">
                <span className="font-semibold">Attachment:</span>{" "}
                {selectedItem.attachment ? (
                  <a
                    href={`/storage/${selectedItem.attachment}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    View Attachment
                  </a>
                ) : (
                  "No attachment available."
                )}
              </p>
            </div>

            {/* Modal Footer */}
            <div className="mt-4 text-center">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingEvents;
