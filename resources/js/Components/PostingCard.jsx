import React, { useState } from "react";
import axios from "axios";

const PostingCard = ({ data, title, isProject, isEvent, isGrant }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filter, setFilter] = useState(""); // Filter value
  const [currentPage, setCurrentPage] = useState(1); // Current page

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

  // Extract unique filter options dynamically
  const uniqueFilterOptions = [
    ...new Set(
      data.map((item) =>
        isProject
          ? item.project_type
          : isEvent
          ? item.event_type
          : isGrant
          ? item.category
          : null
      )
    ),
  ].filter(Boolean);

  // Filter data based on the selected filter value
  const filteredData = data.filter((item) =>
    filter === ""
      ? true
      : isProject
      ? item.project_type === filter
      : isEvent
      ? item.event_type === filter
      : isGrant
      ? item.category === filter
      : true
  );

  // Pagination logic
  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const displayedDatas = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto px-4">
       {/* Filter Section */}
       <div className="mb-6 flex justify-center">
        <select
          className="p-2 border border-gray-300 rounded w-full sm:w-1/6"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setCurrentPage(1); // Reset to page 1 when filter changes
          }}
        >
          <option value="">
            {isProject ? "All Project Types" : isEvent ? "All Event Types" : "All Categories"}
          </option>
          {uniqueFilterOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayedDatas.map((item, index) => (
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
                style={{ maxWidth: "100%" }} // Optional to ensure it respects the card's width
                title={item[title]} // Tooltip to display full text on hover
            >
                {item[title]}
            </h2>
              <p className="text-gray-600 mt-4 text-center truncate" style={{ maxWidth: "100%" }} >{item.description}</p>
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

      {/* Pagination */}
      <div className="flex justify-center mt-6 space-x-2">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-4 py-2 border rounded ${currentPage === index + 1
                            ? "bg-blue-500 text-white"
                            : "bg-white text-gray-700"
                            }`}
                    >
                        {index + 1}
                    </button>
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
                    <p className="text-gray-600">
                        <span className="font-semibold">Description:</span>{" "}
                        {selectedItem.description || "No description available."}
                    </p>

                    <p className="text-gray-600">
                        <span className="font-semibold">Category:</span>{" "}
                        {selectedItem.project_type || "Not provided"}
                    </p>

                    <p className="text-gray-600">
                        <span className="font-semibold">Project Duration:</span>{" "}
                        {selectedItem.start_date ? `${selectedItem.start_date} - ${selectedItem.end_date}` : "Not provided"}
                    </p>


                    <p className="text-gray-600">
                        <span className="font-semibold">Purpose:</span>{" "}
                        {selectedItem.purpose === "find_accollaboration" && "Find Academician Collaboration"}
                        {selectedItem.purpose === "find_incollaboration" && "Find Industry Collaboration"}
                        {selectedItem.purpose === "find_sponsorship" && "Find Sponsorship"}
                        {selectedItem.purpose === "showcase" && "Showcase"}
                    </p>

                    <p className="text-gray-600">
                        <span className="font-semibold">Contact Email:</span>{" "}
                        {selectedItem.email || "Not provided"}
                    </p>

                    <p className="text-gray-600">
                        <span className="font-semibold">Location:</span>{" "}
                        {selectedItem.location || "Not provided"}
                    </p>

                    <p className="text-gray-600">
                        <span className="font-semibold">Budget:</span>{" "}
                        {selectedItem.budget || "Not provided"}
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
                    <p className="text-gray-600">
                        <span className="font-semibold">Description:</span>{" "}
                        {selectedItem.description || "No description available."}
                    </p>

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
                    <p className="text-gray-600">
                        <span className="font-semibold">Description:</span>{" "}
                        {selectedItem.description || "No description available."}
                    </p>

                    <p className="text-gray-600">
                        <span className="font-semibold">Category:</span>{" "}
                        {selectedItem.category || "Not provided"}
                    </p>

                    <p className="text-gray-600">
                        <span className="font-semibold">Purpose:</span>{" "}
                        {selectedItem.purpose === "find_pgstudent" && "Find Postgraduate Student"}
                        {selectedItem.purpose === "find_academic_collaboration" && "Find Academician Collaboration"}
                        {selectedItem.purpose === "find_industry_collaboration" && "Find Industry Collaboration - Matching Grant"}
                    </p>

                    <p className="text-gray-600">
                        <span className="font-semibold">Grant Duration:</span>{" "}
                        {selectedItem.start_date ? `${selectedItem.start_date} - ${selectedItem.end_date}` : "Not provided"}
                    </p>

                    <p className="text-gray-600">
                        <span className="font-semibold">Sponsored by:</span>{" "}
                        {selectedItem.sponsored_by || "Not provided"}
                    </p>

                    <p className="text-gray-600">
                        <span className="font-semibold">Application Link:</span>{" "}
                        {selectedItem.application_url || "Not provided"}
                    </p>

                    <p className="text-gray-600">
                        <span className="font-semibold">Contact Email:</span>{" "}
                        {selectedItem.email || "Not provided"}
                    </p>

                    <p className="text-gray-600">
                        <span className="font-semibold">Amount:</span>{" "}
                        {selectedItem.amount || "Not provided"}
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
    </div>
  );
};

export default PostingCard;
