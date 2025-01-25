import React, { useState } from "react";
import FilterDropdown from "@/Components/FilterDropdown";

const EventCard = ({ events }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventModeFilter, setEventModeFilter] = useState([]);
  const [eventTypeFilter, setEventTypeFilter] = useState([]);
  const [eventThemeFilter, setEventThemeFilter] = useState([]);
  const [countryFilter, setCountryFilter] = useState([]);
  const [startDateFilter, setStartDateFilter] = useState(""); // Start date filter
  const [endDateFilter, setEndDateFilter] = useState(""); // End date filter
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Extract unique options for filters
  const uniqueEventModes = [...new Set(events.map((event) => event.event_mode))].filter(Boolean);
  const uniqueEventTypes = [...new Set(events.map((event) => event.event_type))].filter(Boolean);
  const uniqueEventThemes = [
    ...new Set(events.flatMap((event) => event.event_theme || [])),
  ].filter(Boolean);
  const uniqueCountries = [...new Set(events.map((event) => event.country))].filter(Boolean);

  // Filter events based on selected filters
  const filteredEvents = events.filter((event) => {
    const matchesMode =
      eventModeFilter.length === 0 || eventModeFilter.includes(event.event_mode);
    const matchesType =
      eventTypeFilter.length === 0 || eventTypeFilter.includes(event.event_type);
    const matchesTheme =
      eventThemeFilter.length === 0 || event.event_theme?.some((theme) => eventThemeFilter.includes(theme));
    const matchesCountry =
      countryFilter.length === 0 || countryFilter.includes(event.country);

    // Compare event.start_date with selected startDateFilter and endDateFilter
    const matchesDate =
      (!startDateFilter || new Date(event.start_date) >= new Date(startDateFilter)) &&
      (!endDateFilter || new Date(event.start_date) <= new Date(endDateFilter));

    return matchesMode && matchesType && matchesTheme && matchesCountry && matchesDate;
  });

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const displayedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleQuickInfoClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar for Filters */}
      <div className="w-1/4 p-4 bg-gray-100 border-r">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <FilterDropdown
          label="Event Mode"
          options={uniqueEventModes}
          selectedValues={eventModeFilter}
          setSelectedValues={setEventModeFilter}
        />
        <FilterDropdown
          label="Event Type"
          options={uniqueEventTypes}
          selectedValues={eventTypeFilter}
          setSelectedValues={setEventTypeFilter}
        />
        <FilterDropdown
          label="Event Theme"
          options={uniqueEventThemes}
          selectedValues={eventThemeFilter}
          setSelectedValues={setEventThemeFilter}
        />
        <FilterDropdown
          label="Country"
          options={uniqueCountries}
          selectedValues={countryFilter}
          setSelectedValues={setCountryFilter}
        />

        {/* Date Range Filter */}
        <div className="mt-4">
          <label className="block text-gray-700 font-medium">Start Date</label>
          <input
            type="date"
            value={startDateFilter}
            onChange={(e) => setStartDateFilter(e.target.value)}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200"
          />
        </div>
        <div className="mt-4">
          <label className="block text-gray-700 font-medium">End Date</label>
          <input
            type="date"
            value={endDateFilter}
            onChange={(e) => setEndDateFilter(e.target.value)}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedEvents.map((event, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden text-center pb-8"
            >
              <img
                src={event.image ? `/storage/${event.image}` : "/storage/default.jpg"}
                alt={event.event_name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 truncate" title={event.event_name}>
                  {event.event_name}
                </h2>
                <p
                  className="text-gray-600 mt-4 text-center font-extralight"
                  style={{
                    maxWidth: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                  dangerouslySetInnerHTML={{ __html: event.description || "No description available." }}
                ></p>
              </div>

              <button
                onClick={() => handleQuickInfoClick(event)}
                className="inline-block rounded-full border border-gray-300 px-7 py-2 text-base font-medium text-body-color transition hover:border-primary hover:bg-primary hover:text-dark dark:border-dark-300 dark:text-dark-600"
              >
                View Details
              </button>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-4 py-2 border rounded ${
                currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-white text-gray-700"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Modal for View More */}
      {isModalOpen && selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeModal}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
          >
            <img
              src={selectedEvent.image ? `/storage/${selectedEvent.image}` : "/storage/default.jpg"}
              alt={selectedEvent.event_name}
              className="w-full h-48 object-cover rounded-t-lg mb-4"
            />
            <h3 className="text-xl font-bold mb-4 text-gray-800 text-center">
              {selectedEvent.event_name}
            </h3>
            <p
              className="text-gray-600 mb-2"
              dangerouslySetInnerHTML={{ __html: selectedEvent.description }}
            ></p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Event Type:</span> {selectedEvent.event_type || "Not provided."}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Event Duration:</span>{" "}
              {selectedEvent.start_date
                ? `${selectedEvent.start_date} - ${selectedEvent.end_date}`
                : "Not provided"}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Registration Link:</span>{" "}
              {selectedEvent.registration_url ? (
                <a
                  href={selectedEvent.registration_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  Click Here
                </a>
              ) : (
                "Not provided"
              )}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Registration Deadline:</span>{" "}
              {selectedEvent.registration_deadline || "Not provided"}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Contact Email:</span>{" "}
              {selectedEvent.contact_email || "Not provided"}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Location:</span>{" "}
              {`${selectedEvent.venue}, ${selectedEvent.city}, ${selectedEvent.country}` || "Not provided"}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Attachment:</span>{" "}
              {selectedEvent.attachment ? (
                <a
                  href={`/storage/${selectedEvent.attachment}`}
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
            <div className="mt-6 text-center">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
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

export default EventCard;
