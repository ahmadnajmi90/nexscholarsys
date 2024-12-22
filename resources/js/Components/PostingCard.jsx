import React, { useState } from "react";
import axios from "axios";

const FilterDropdown = ({ label, options, selectedValues, setSelectedValues }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleCheckboxChange = (value) => {
    const updatedValues = selectedValues.includes(value)
      ? selectedValues.filter((item) => item !== value)
      : [...selectedValues, value];
    setSelectedValues(updatedValues);
  };

  return (
    <div>
      <label className="block text-gray-700 font-medium">{label}</label>
      <div
        className={`relative mt-1 w-full rounded-lg border border-gray-200 p-4 text-sm cursor-pointer bg-white ${
          dropdownOpen ? "shadow-lg" : ""
        }`}
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        {selectedValues && selectedValues.length > 0
          ? selectedValues.join(", ")
          : `Select ${label}`}
      </div>
      {dropdownOpen && (
        <div className="absolute z-10 mt-2 bg-white border border-gray-200 rounded shadow-lg">
          <div className="p-2 space-y-2">
            {options.map((option, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="checkbox"
                  value={option}
                  checked={selectedValues.includes(option)}
                  onChange={(e) => handleCheckboxChange(e.target.value)}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const PostingCard = ({ data, title, isProject, isEvent, isGrant }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [typeFilter, setTypeFilter] = useState([]);
  const [countryFilter, setCountryFilter] = useState([]);
  const [themeFilter, setThemeFilter] = useState([]);
  const [eventModeFilter, setEventModeFilter] = useState([]); // New filter for event mode
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const itemsPerPage = 9; // Number of items per page

  // Extract unique options dynamically
  const uniqueTypeOptions = [
    ...new Set(
      data.map((item) =>
        isProject
          ? item.category
          : isEvent
          ? item.event_type
          : isGrant
          ? item.grant_type
          : null
      )
    ),
  ].filter(Boolean);

  const uniqueCountryOptions = [
    ...new Set(
      data.map((item) =>
        isProject ? item.origin_country : isEvent || isGrant ? item.country : null
      )
    ),
  ].filter(Boolean);

  const handleQuickInfoClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  function trackClick(entityType, entityId, action) {
    axios
      .post("/click-tracking", {
        entity_type: entityType,
        entity_id: entityId,
        action: action,
      })
      .then((response) => {
        console.log("Click tracked successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error tracking click:", error);
      });
  }

  const uniqueThemeOptions = [
    ...new Set(
      data.flatMap((item) =>
        isProject
          ? item.project_theme || []
          : isEvent
          ? item.event_theme || []
          : isGrant
          ? item.grant_theme || []
          : []
      )
    ),
  ].filter(Boolean);

  const uniqueEventModeOptions = [
    ...new Set(
      isEvent ? data.map((item) => item.event_mode).filter(Boolean) : []
    ),
  ]; // Extract unique event_mode values

  // Filter data based on selected filters
  const filteredData = data.filter((item) => {
    const matchesType =
      typeFilter.length === 0 ||
      typeFilter.some((type) =>
        isProject
          ? item.category === type
          : isEvent
          ? item.event_type === type
          : isGrant
          ? item.grant_type === type
          : true
      );

    const matchesCountry =
      countryFilter.length === 0 ||
      countryFilter.some((country) =>
        isProject
          ? item.origin_country === country
          : isEvent || isGrant
          ? item.country === country
          : true
      );

    const matchesTheme =
      themeFilter.length === 0 ||
      themeFilter.some((theme) =>
        isProject
          ? item.project_theme?.includes(theme)
          : isEvent
          ? item.event_theme?.includes(theme)
          : isGrant
          ? item.grant_theme?.includes(theme)
          : true
      );

    const matchesEventMode =
      eventModeFilter.length === 0 ||
      (isEvent && eventModeFilter.includes(item.event_mode));

    return matchesType && matchesCountry && matchesTheme && matchesEventMode;
  });

   // Pagination logic
   const totalPages = Math.ceil(filteredData.length / itemsPerPage);
   const displayedData = filteredData.slice(
     (currentPage - 1) * itemsPerPage,
     currentPage * itemsPerPage
   );
 
   const handlePageChange = (page) => {
     setCurrentPage(page);
   };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar for Filters */}
      <div className="w-1/4 p-4 bg-gray-100 border-r">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="space-y-4">
          {/* Type Filter */}
          <FilterDropdown
            label={isProject ? "Purpose" : isEvent ? "Event Type" : "Grant Type"}
            options={uniqueTypeOptions}
            selectedValues={typeFilter}
            setSelectedValues={setTypeFilter}
          />
          {/* Event Mode Filter */}
          {isEvent && (
            <FilterDropdown
              label="Event Mode"
              options={uniqueEventModeOptions}
              selectedValues={eventModeFilter}
              setSelectedValues={setEventModeFilter}
            />
          )}
          {/* Theme Filter */}
          <FilterDropdown
            label={isProject ? "Project Theme" : isEvent ? "Event Theme" : "Grant Theme"}
            options={uniqueThemeOptions}
            selectedValues={themeFilter}
            setSelectedValues={setThemeFilter}
          />
          {/* Country Filter */}
          <FilterDropdown
            label="Country"
            options={uniqueCountryOptions}
            selectedValues={countryFilter}
            setSelectedValues={setCountryFilter}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-8">
        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedData.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden text-center pb-8"
            >
              {/* Image Section */}
              <img
                src={item.image !== null ? `/storage/${item.image}` : "/storage/default.jpg"}
                alt={item[title]}
                className="w-full h-48 object-cover"
              />

              {/* Content Section */}
              <div className="p-8">
                <h2
                  className="text-xl font-semibold text-gray-800 text-center truncate"
                  style={{ maxWidth: "100%" }}
                  title={item[title]}
                >
                  {item[title]}
                </h2>
                <p
                  className="text-gray-600 mt-4 text-center"
                  style={{
                    maxWidth: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: item.description || "No description available.",
                  }}
                ></p>
              </div>

              {/* Button Section */}
              <button
                  onClick={() => {
                    handleQuickInfoClick(item);
                    trackClick(
                      isProject ? "project" : isEvent ? "event" : "grant",
                      item.id,
                      "view_details"
                    );
                  }}
                  className="inline-block rounded-full border border-gray-300 px-7 py-2 text-base font-medium text-body-color transition hover:border-primary hover:bg-primary hover:text-dark dark:border-dark-300 dark:text-dark-600"
                >
                  View Details
                </button>
            </div>
          ))}
        </div>

        {/* Modal Section */}
        {isModalOpen && selectedItem && (
                  <div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-auto"
                  onClick={closeModal} // Close the modal when clicking on the background
              >
                  <div
                  className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl relative overflow-y-auto max-h-[90vh]"
                  onClick={(e) => e.stopPropagation()} // Prevent the click from propagating to the background
                  >
  
              {/* Modal Image */}
              {selectedItem.image && (
                <img
                  src={selectedItem.image !== null ? `/storage/${selectedItem.image}` : "/storage/default.jpg"}
                  alt={selectedItem[title]}
                  className="w-full h-48 object-cover rounded-t-lg mb-4"
                />
              )}
  
              {/* Modal Header */}
              <h3 className="text-xl font-bold mb-4 text-gray-800 text-center">
                {selectedItem[title]}
              </h3>
  
  
              {/* Modal Content */}
              <div className="space-y-4">
                  {isProject && (
                      <>
                      <div className="text-gray-600">
                                  <span className="font-semibold">Description:</span>
                                  {selectedItem.description ? (
                                      <div
                                          className="mt-2 text-sm"
                                          dangerouslySetInnerHTML={{ __html: selectedItem.description }}
                                      ></div>
                                  ) : (
                                      <p className="mt-2 text-sm text-gray-500">No description available.</p>
                                  )}
                              </div>
  
                      <p className="text-gray-600">
                          <span className="font-semibold">Category:</span>{" "}
                          {selectedItem.category || "Not provided"}
                      </p>
  
                      <p className="text-gray-600">
                          <span className="font-semibold">Project Theme:</span>{" "}
                          {selectedItem.project_theme || "Not provided"}
                      </p>
  
                      <p className="text-gray-600">
                          <span className="font-semibold">Purpose:</span>{" "}
                          {Array.isArray(selectedItem.purpose) ? selectedItem.purpose.join(", ") : "No Purpose Specified"}
                      </p>
  
                      <p className="text-gray-600">
                          <span className="font-semibold">Project Duration:</span>{" "}
                          {selectedItem.start_date ? `${selectedItem.start_date} - ${selectedItem.end_date}` : "Not provided"}
                      </p>
  
                      <p className="text-gray-600">
                          <span className="font-semibold">Application Deadline:</span>{" "}
                          {selectedItem.application_deadline || "Not provided"}
                      </p>
  
                      <p className="text-gray-600">
                          <span className="font-semibold">Contact Email:</span>{" "}
                          {selectedItem.email || "Not provided"}
                      </p>
  
                      <p className="text-gray-600">
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
  
  
                      </>
                  )}
  
                  {isEvent && (
                      <>
                      <div className="text-gray-600">
                                  <span className="font-semibold">Description:</span>
                                  {selectedItem.description ? (
                                      <div
                                          className="mt-2 text-sm"
                                          dangerouslySetInnerHTML={{ __html: selectedItem.description }}
                                      ></div>
                                  ) : (
                                      <p className="mt-2 text-sm text-gray-500">No description available.</p>
                                  )}
                              </div>
  
                      <p className="text-gray-600">
                          <span className="font-semibold">Event type:</span>{" "}
                          {selectedItem.event_type || "Not provided."}
                      </p>
  
                      <p className="text-gray-600">
                          <span className="font-semibold">Event Duration:</span>{" "}
                          {selectedItem.start_date ? `${selectedItem.start_date} - ${selectedItem.end_date}` : "Not provided"}
                      </p>
  
                      <p className="text-gray-600">
                          <span className="font-semibold">Registration Link:</span>{" "}
                          {selectedItem.registration_url ? (
                              <a
                              href={selectedItem.registration_url}
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
  
                      <p className="text-gray-600">
                          <span className="font-semibold">Registration Deadline:</span>{" "}
                          {selectedItem.registration_deadline || "Not provided"}
                      </p>
  
                      <p className="text-gray-600">
                          <span className="font-semibold">Contact Email:</span>{" "}
                          {selectedItem.contact_email || "Not provided"}
                      </p>
  
                      <p className="text-gray-600">
                          <span className="font-semibold">Location:</span>{" "}
                          {`${selectedItem.venue}, ${selectedItem.city}, ${selectedItem.country}` || "Not provided"}
                      </p>
  
                      <p className="text-gray-600">
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
  
  
                      </>
                  )}
  
                  {isGrant && (
                      <>
                     <div className="text-gray-600">
                                  <span className="font-semibold">Description:</span>
                                  {selectedItem.description ? (
                                      <div
                                          className="mt-2 text-sm"
                                          dangerouslySetInnerHTML={{ __html: selectedItem.description }}
                                      ></div>
                                  ) : (
                                      <p className="mt-2 text-sm text-gray-500">No description available.</p>
                                  )}
                              </div>
  
                      <p className="text-gray-600">
                          <span className="font-semibold">Grant Type:</span>{" "}
                          {selectedItem.grant_type || "Not provided"}
                      </p>
  
                      <p className="text-gray-600">
                          <span className="font-semibold">Grant Theme:</span>{" "}
                          {Array.isArray(selectedItem.grant_theme) ? selectedItem.grant_theme.join(", ") : "No Grant Theme Specified"}
                      </p>
  
                      <p className="text-gray-600">
                          <span className="font-semibold">Cycle:</span>{" "}
                          {selectedItem.cycle || "Not provided"}
                      </p>
  
                      <p className="text-gray-600">
                          <span className="font-semibold">Grant Duration:</span>{" "}
                          {selectedItem.start_date ? `${selectedItem.start_date} - ${selectedItem.end_date}` : "Not provided"}
                      </p>
  
                      <p className="text-gray-600">
                          <span className="font-semibold">Application Deadline:</span>{" "}
                          {selectedItem.application_deadline || "Not provided"}
                      </p>
  
                      <p className="text-gray-600">
                          <span className="font-semibold">Sponsored by:</span>{" "}
                          {selectedItem.sponsored_by || "Not provided"}
                      </p>
  
                      <p className="text-gray-600">
                          <span className="font-semibold">Website / Link:</span>{" "}
                          {selectedItem.website || "Not provided"}
                      </p>
  
                      <p className="text-gray-600">
                          <span className="font-semibold">Contact Email:</span>{" "}
                          {selectedItem.email || "Not provided"}
                      </p>
  
                      <p className="text-gray-600">
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
  
  
                      </>
                  )}
  
              </div>
  
              {/* Modal Footer */}
              <div className="mt-6 text-center">
                <button
                  onClick={closeModal}
                  className="px-6 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 border rounded ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
      </div>
    </div>
  );
};

export default PostingCard;
