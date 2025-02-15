import React, { useState } from "react";
import FilterDropdown from "@/Components/FilterDropdown";

const GrantCard = ({ grants }) => {
  const [selectedGrant, setSelectedGrant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [grantTypeFilter, setGrantTypeFilter] = useState([]);
  const [grantThemeFilter, setGrantThemeFilter] = useState([]);
  const [countryFilter, setCountryFilter] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Convert unique options to objects for react-select
  const uniqueGrantTypes = [...new Set(grants.map((grant) => grant.grant_type))]
    .filter(Boolean)
    .map((type) => ({ value: type, label: type }));

  const uniqueGrantThemes = [
    ...new Set(grants.flatMap((grant) => grant.grant_theme || [])),
  ]
    .filter(Boolean)
    .map((theme) => ({ value: theme, label: theme }));

  const uniqueCountries = [...new Set(grants.map((grant) => grant.country))]
    .filter(Boolean)
    .map((country) => ({ value: country, label: country }));

  // Filter grants based on selected filters.
  // Note: selectedGrantType, etc., will be an array of string values
  const filteredGrants = grants.filter((grant) => {
    const matchesType =
      grantTypeFilter.length === 0 || grantTypeFilter.includes(grant.grant_type);
    const matchesTheme =
      grantThemeFilter.length === 0 ||
      (grant.grant_theme && grant.grant_theme.some((theme) => grantThemeFilter.includes(theme)));
    const matchesCountry =
      countryFilter.length === 0 || countryFilter.includes(grant.country);

    return matchesType && matchesTheme && matchesCountry;
  });

  const totalPages = Math.ceil(filteredGrants.length / itemsPerPage);
  const displayedGrants = filteredGrants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleQuickInfoClick = (grant) => {
    setSelectedGrant(grant);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedGrant(null);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar for Filters */}
      <div className="w-1/4 p-4 bg-gray-100 border-r">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <FilterDropdown
          label="Grant Type"
          options={uniqueGrantTypes}
          selectedValues={grantTypeFilter}
          setSelectedValues={setGrantTypeFilter}
        />
        <FilterDropdown
          label="Grant Theme"
          options={uniqueGrantThemes}
          selectedValues={grantThemeFilter}
          setSelectedValues={setGrantThemeFilter}
        />
        <FilterDropdown
          label="Country"
          options={uniqueCountries}
          selectedValues={countryFilter}
          setSelectedValues={setCountryFilter}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedGrants.map((grant, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden text-center pb-8"
            >
              <img
                src={grant.image ? `/storage/${grant.image}` : "/storage/default.jpg"}
                alt={grant.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2
                  className="text-xl font-semibold text-gray-800 truncate"
                  title={grant.title}
                >
                  {grant.title}
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
                  dangerouslySetInnerHTML={{ __html: grant.description || "No description available." }}
                ></p>
              </div>

              <button
                onClick={() => handleQuickInfoClick(grant)}
                className="inline-block rounded-full border border-gray-300 px-7 py-2 text-base font-medium text-body-color transition hover:border-primary hover:bg-primary hover:text-dark dark:border-dark-300 dark:text-dark-600"
              >
                View Details
              </button>
            </div>
          ))}
        </div>

        {/* Pagination (using arrow-based pagination as in your EventCard) */}
        <div className="flex justify-center mt-6 space-x-2 items-center">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded bg-white text-gray-700 hover:bg-gray-200 disabled:opacity-50"
          >
            ◄
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1)
            .filter(
              (page) =>
                page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1
            )
            .map((page, index, arr) => (
              <React.Fragment key={page}>
                {index > 0 && page - arr[index - 1] > 1 && (
                  <span className="px-2">...</span>
                )}
                <button
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 border rounded ${
                    currentPage === page
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  {page}
                </button>
              </React.Fragment>
            ))}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded bg-white text-gray-700 hover:bg-gray-200 disabled:opacity-50"
          >
            ►
          </button>
        </div>
      </div>

      {/* Modal for View More */}
      {isModalOpen && selectedGrant && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeModal}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedGrant.image ? `/storage/${selectedGrant.image}` : "/storage/default.jpg"}
              alt={selectedGrant.title}
              className="w-full h-48 object-cover rounded-t-lg mb-4"
            />
            <h3 className="text-xl font-bold mb-4 text-gray-800 text-center">
              {selectedGrant.title}
            </h3>
            <p
              className="text-gray-600 mb-2"
              dangerouslySetInnerHTML={{ __html: selectedGrant.description }}
            ></p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Grant Type:</span>{" "}
              {selectedGrant.grant_type || "Not provided"}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Grant Theme:</span>{" "}
              {Array.isArray(selectedGrant.grant_theme)
                ? selectedGrant.grant_theme.join(", ")
                : "No Grant Theme Specified"}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Cycle:</span>{" "}
              {selectedGrant.cycle || "Not provided"}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Grant Duration:</span>{" "}
              {selectedGrant.start_date
                ? `${selectedGrant.start_date} - ${selectedGrant.end_date}`
                : "Not provided"}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Application Deadline:</span>{" "}
              {selectedGrant.application_deadline || "Not provided"}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Sponsored by:</span>{" "}
              {selectedGrant.sponsored_by || "Not provided"}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Website / Link:</span>{" "}
              {selectedGrant.website || "Not provided"}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Contact Email:</span>{" "}
              {selectedGrant.email || "Not provided"}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Attachment:</span>{" "}
              {selectedGrant.attachment ? (
                <a
                  href={`/storage/${selectedGrant.attachment}`}
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

export default GrantCard;
