import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import FilterDropdown from "@/Components/FilterDropdown";
import SearchBar from "@/Components/SearchBar";
import ContentSkeletonCard from "@/Pages/Components/ContentSkeletonCard";
import DOMPurify from 'dompurify';

// Plain text truncated content
const TruncatedText = ({ html, maxLength = 100, className }) => {
  if (!html) return <p className={className}>No content available</p>;
  
  // Strip HTML tags and get plain text
  const plainText = html.replace(/<[^>]*>/g, '');
  const truncated = plainText.length > maxLength 
    ? plainText.substring(0, maxLength) + '...' 
    : plainText;
  
  return <p className={className}>{truncated}</p>;
};

const ProjectCard = ({ projects, isLoading }) => {
  const [typeFilter, setTypeFilter] = useState([]);
  const [countryFilter, setCountryFilter] = useState([]);
  const [themeFilter, setThemeFilter] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 9;

  // Convert unique filter options to objects for the FilterDropdown
  const uniqueTypeOptions = [
    ...new Set(
      projects.flatMap((project) =>
        Array.isArray(project.purpose)
          ? project.purpose
          : [project.purpose]
      )
    ),
  ]
    .filter(Boolean)
    .map((type) => ({ value: type, label: type }));

  const uniqueCountryOptions = [...new Set(projects.map((project) => project.origin_country))]
    .filter(Boolean)
    .map((country) => ({ value: country, label: country }));

  const uniqueThemeOptions = [...new Set(projects.flatMap((project) => project.project_theme || []))]
    .filter(Boolean)
    .map((theme) => ({ value: theme, label: theme }));

  // Filtering projects based on selected filters
  const filteredProjects = projects.filter((project) => {
    const projectPurposes = Array.isArray(project.purpose)
      ? project.purpose
      : [project.purpose];
    const matchesType =
      typeFilter.length === 0 ||
      typeFilter.some((filterVal) => projectPurposes.includes(filterVal));
    const matchesCountry =
      countryFilter.length === 0 || countryFilter.includes(project.origin_country);
    const matchesTheme =
      themeFilter.length === 0 ||
      themeFilter.includes(project.project_theme);
    return matchesType && matchesCountry && matchesTheme;
  });

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const displayedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen flex">
      {/* Search Bar - Desktop */}
      <div className="fixed top-20 left-4 z-50 lg:left-auto lg:right-20 hidden lg:block">
        <SearchBar
          placeholder="Search projects..."
          routeName="projects.index"
          className=""
        />
      </div>

      {/* Mobile Header with Search and Filter */}
      <div className="fixed top-20 right-4 z-50 flex flex-col items-end space-y-2 lg:hidden">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="bg-blue-600 text-white p-2 rounded-lg shadow-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 14.414V19a1 1 0 01-1 1h-2a1 1 0 01-1-1v-4.586L3.293 6.707A1 1 0 013 6V4z"
            />
          </svg>
        </button>
        <SearchBar
          placeholder="Search projects..."
          routeName="projects.index"
          className=""
        />
      </div>

      {/* Sidebar for Filters */}
      <div
        className={`fixed lg:relative top-0 left-0 lg:block lg:w-1/4 w-3/4 h-full bg-gray-100 border-r rounded-lg p-4 transition-transform duration-300 z-50 ${
          showFilters ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <h2 className="text-lg font-semibold mb-4 flex justify-between items-center">
          Filters
          <button onClick={() => setShowFilters(false)} className="text-gray-600 lg:hidden">
            ✕
          </button>
        </h2>
        <FilterDropdown
          label="Purpose"
          options={uniqueTypeOptions}
          selectedValues={typeFilter}
          setSelectedValues={setTypeFilter}
        />
        <FilterDropdown
          label="Country"
          options={uniqueCountryOptions}
          selectedValues={countryFilter}
          setSelectedValues={setCountryFilter}
        />
        <FilterDropdown
          label="Project Theme"
          options={uniqueThemeOptions}
          selectedValues={themeFilter}
          setSelectedValues={setThemeFilter}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 py-6 sm:py-4 lg:py-0 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Show skeleton cards while loading
            Array.from({ length: 9 }, (_, index) => (
              <ContentSkeletonCard key={index} />
            ))
          ) : (
            // Show actual project cards when not loading
            displayedProjects.map((project, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden text-center pb-8 relative"
            >
              <img
                src={project.image ? `/storage/${project.image}` : "/storage/default.jpg"}
                alt={project.title}
                className="w-full h-48 object-cover"
              />
              {/* Purpose Labels */}
              <div className="absolute top-2 left-2 flex flex-wrap gap-2">
                {Array.isArray(project.purpose) ? (
                  project.purpose.map((purpose, index) => {
                    let labelText = "";
                    let labelColor = "bg-blue-500"; // default color

                    switch (purpose) {
                      case "For Showcase":
                        labelText = "Showcase";
                        labelColor = "bg-purple-500";
                        break;
                      case "Seek for Postgraduate":
                        labelText = "Grant for Postgraduate";
                        labelColor = "bg-green-500";
                        break;
                      case "Seek for Undergraduate":
                        labelText = "Grant for Undergraduate";
                        labelColor = "bg-yellow-500";
                        break;
                      case "Seek for Academician Collaboration":
                        labelText = "Academician Collaboration";
                        labelColor = "bg-indigo-500";
                        break;
                      case "Seek for Industrial Collaboration":
                        labelText = "Industry Collaboration";
                        labelColor = "bg-orange-500";
                        break;
                      default:
                        labelText = purpose;
                    }

                    return (
                      <span
                        key={index}
                        className={`${labelColor} text-white text-xs font-semibold px-2 py-1 rounded`}
                      >
                        {labelText}
                      </span>
                    );
                  })
                ) : (
                  <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded">
                    {project.purpose}
                  </span>
                )}
              </div>
              <div className="p-8">
                <h2
                  className="text-lg font-semibold text-gray-800 text-center truncate"
                  style={{ maxWidth: "100%" }}
                  title={project.title}
                >
                  {project.title}
                </h2>
                <p
                  className="text-gray-600 h-12 mt-4 text-center font-extralight"
                  style={{
                    maxWidth: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  <TruncatedText 
                    html={project.description || "No description available."}
                    maxLength={100}
                  />
                </p>
              </div>
              <Link
                href={route("projects.show", project.url)}
                className="inline-block rounded-full border border-gray-300 px-7 py-2 text-base font-medium text-body-color transition hover:border-primary hover:bg-primary hover:text-dark"
              >
                View Details
              </Link>
            </div>
          ))
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6 space-x-2 items-center">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded bg-white text-gray-700 hover:bg-gray-200 disabled:opacity-50"
          >
            ◄
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1)
            .filter((page) => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
            .map((page, index, arr) => (
              <React.Fragment key={page}>
                {index > 0 && page - arr[index - 1] > 1 && <span className="px-2">...</span>}
                <button
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 border rounded ${
                    currentPage === page ? "bg-blue-500 text-white" : "bg-white text-gray-700"
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
    </div>
  );
};

export default ProjectCard;
