import React, { useState } from 'react';

export default function ItemCard({ item, auth, type }) {
  const [isModalOpen, setModalOpen] = useState(false);

  // Determine title and description based on type.
  const title = type === 'event' ? item.event_name : item.title;
  const description = item.description;

  const handleViewDetails = () => {
    // Open modal regardless of auth status.
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col text-center pb-6">
        <img
          src={item.image ? `/storage/${item.image}` : "/storage/default.jpg"}
          alt={title}
          className="w-full h-48 object-cover"
        />
        {/* Content container */}
        <div className="p-6 flex-grow">
          <h2 className="text-xl font-semibold text-gray-800 truncate" title={title}>
            {title}
          </h2>
          <p
            className="text-gray-600 mt-4 text-center font-extralight"
            style={{
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
            dangerouslySetInnerHTML={{ __html: description || "No content available." }}
          ></p>
        </div>
        {/* Button container */}
        <div className="px-4 mt-auto pb-4">
          <button
            onClick={handleViewDetails}
            className="inline-block rounded-full border border-gray-300 px-7 py-2 text-base font-medium transition hover:border-primary hover:bg-primary hover:text-dark"
          >
            View Details
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeModal}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={item.image ? `/storage/${item.image}` : "/storage/default.jpg"}
              alt={title}
              className="w-full h-48 object-cover rounded-t-lg mb-4"
            />
            <h3 className="text-xl font-bold mb-4 text-gray-800 text-center">
              {title}
            </h3>
            {/* Common description */}
            <div className="text-gray-600 mb-2" dangerouslySetInnerHTML={{ __html: description }}></div>
            
            {/* Conditional content */}
            {type === 'event' && (
              <>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Event Type:</span> {item.event_type || "Not provided."}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Event Duration:</span>{" "}
                  {item.start_date ? `${item.start_date} - ${item.end_date}` : "Not provided"}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Registration Link:</span>{" "}
                  {item.registration_url ? (
                    <a
                      href={item.registration_url}
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
                  {item.registration_deadline || "Not provided"}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Contact Email:</span>{" "}
                  {item.contact_email || "Not provided"}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Location:</span>{" "}
                  {`${item.venue}, ${item.city}, ${item.country}` || "Not provided"}
                </p>
              </>
            )}
            {type === 'project' && (
              <>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Purpose:</span>{" "}
                  {item.category || "Not provided"}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Project Theme:</span>{" "}
                  {item.project_theme || "Not provided"}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Purpose:</span>{" "}
                  {Array.isArray(item.purpose) ? item.purpose.join(", ") : "No Purpose Specified"}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Project Duration:</span>{" "}
                  {item.start_date ? `${item.start_date} - ${item.end_date}` : "Not provided"}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Application Deadline:</span>{" "}
                  {item.application_deadline || "Not provided"}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Contact Email:</span>{" "}
                  {item.email || "Not provided"}
                </p>
              </>
            )}
            {type === 'grant' && (
              <>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Grant Type:</span>{" "}
                  {item.grant_type || "Not provided"}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Grant Theme:</span>{" "}
                  {Array.isArray(item.grant_theme) ? item.grant_theme.join(", ") : "No Grant Theme Specified"}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Cycle:</span>{" "}
                  {item.cycle || "Not provided"}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Grant Duration:</span>{" "}
                  {item.start_date ? `${item.start_date} - ${item.end_date}` : "Not provided"}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Application Deadline:</span>{" "}
                  {item.application_deadline || "Not provided"}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Sponsored by:</span>{" "}
                  {item.sponsored_by || "Not provided"}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Website / Link:</span>{" "}
                  {item.website || "Not provided"}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Contact Email:</span>{" "}
                  {item.email || "Not provided"}
                </p>
              </>
            )}
            {/* Attachment (common to all types) */}
            <p className="text-gray-600">
              <span className="font-semibold">Attachment:</span>{" "}
              {item.attachment ? (
                <a
                  href={`/storage/${item.attachment}`}
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
    </>
  );
}
