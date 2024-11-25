import React, { useState } from "react";

const PostingCard = ({ data, title, isProject, isEvent, isGrant }) => {
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

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data?.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden text-center pb-8"
          >
            {/* Image Section */}
            <img
              src={item.image !== null ? `/storage/${item.image}` : '/storage/default.jpg'}
              alt={item[title]}
              className="w-full h-48 object-cover"
            />

            {/* Content Section */}
            <div className="p-8">
              <h2 className="text-xl font-semibold text-gray-800 text-center">{item[title]}</h2>
              <p className="text-gray-600 mt-4 text-center">{item.description}</p>
            </div>

            {/* Button Section */}
            <button
                onClick={() => handleQuickInfoClick(item)}
                className="inline-block rounded-full border border-gray-3 px-7 py-2 text-base font-medium text-body-color transition hover:border-primary hover:bg-primary hover:text-dark dark:border-dark-3 dark:text-dark-6"
            >
                View Details
            </button>
          </div>
        ))}
      </div>

      {/* Modal Section */}
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-lg relative">

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
                    </p>

                    <p className="text-gray-600">
                        <span className="font-semibold">Contact Email:</span>{" "}
                        {selectedItem.email || "Not provided"}
                    </p>

                    <p className="text-gray-600">
                        <span className="font-semibold">Contact No.:</span>{" "}
                        {selectedItem.contact_number || "Not provided"}
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
                        ):
                        "No attachment available."
                        }
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
                        {selectedItem.event_type || "Not provided"}
                    </p>

                    <p className="text-gray-600">
                        <span className="font-semibold">Event Duration:</span>{" "}
                        {selectedItem.start_date_time ? `${selectedItem.start_date_time} - ${selectedItem.end_date_time}` : "Not provided"}
                    </p>

                    <p className="text-gray-600">
                        <span className="font-semibold">Target Audience:</span>{" "}
                        {Array.isArray(selectedItem.target_audience)
                            ? selectedItem.target_audience.join(", ") // Join array items into a comma-separated string
                            : selectedItem.target_audience || "Not provided"} // Fallback for non-array or empty data
                    </p>

                    <p className="text-gray-600">
                        <span className="font-semibold">Organized by:</span>{" "}
                        {selectedItem.organized_by || "Not provided"}
                    </p>
                    
                    <p className="text-gray-600">
                        <span className="font-semibold">Registration Link:</span>{" "}
                        {selectedItem.registration_url || "Not provided"}
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
                        <span className="font-semibold">Contact No.:</span>{" "}
                        {selectedItem.contact_number || "Not provided"}
                    </p>

                    <p className="text-gray-600">
                        <span className="font-semibold">Location:</span>{" "}
                        {selectedItem.location || "Not provided"}
                    </p>

                    <p className="text-gray-600">
                        <span className="font-semibold">Fees:</span>{" "}
                        {selectedItem.fees || "Not provided"}
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
                        ):
                        "No attachment available."
                        }
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
                        {selectedItem.purpose === "find_collaboration" && "Find Collaboration"}
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
                        {selectedItem.contact_email || "Not provided"}
                    </p>

                    <p className="text-gray-600">
                        <span className="font-semibold">Contact No.:</span>{" "}
                        {selectedItem.contact_number || "Not provided"}
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
                        ):
                        "No attachment available."
                        }
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
