import React, { useState } from "react";
import FilterDropdown from "@/Components/FilterDropdown";

const ProjectCard = ({ projects }) => {
  const [typeFilter, setTypeFilter] = useState([]);
  const [countryFilter, setCountryFilter] = useState([]);
  const [themeFilter, setThemeFilter] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 9;

  const uniqueTypeOptions = [...new Set(projects.map((project) => project.category))].filter(Boolean);
  const uniqueCountryOptions = [...new Set(projects.map((project) => project.origin_country))].filter(Boolean);
  const uniqueThemeOptions = [...new Set(projects.flatMap((project) => project.project_theme || []))].filter(Boolean);

  const filteredProjects = projects.filter((project) => {
    const matchesType =
      typeFilter.length === 0 || typeFilter.includes(project.category);
    const matchesCountry =
      countryFilter.length === 0 || countryFilter.includes(project.origin_country);
    const matchesTheme =
      themeFilter.length === 0 || project.project_theme?.some((theme) => themeFilter.includes(theme));

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

  const handleViewMore = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar for Filters */}
      <div className="w-1/4 p-4 bg-gray-100 border-r">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
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
      <div className="flex-1 px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedProjects.map((project, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden text-center pb-8"
            >
              <img
                src={project.image ? `/storage/${project.image}` : "/storage/default.jpg"}
                alt={project.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-8">
                <h2 className="text-xl font-semibold text-gray-800 text-center truncate" 
                    style={{ maxWidth: "100%" }}
                    title={project.title}>
                  
                  {project.title}
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
                  dangerouslySetInnerHTML={{ __html: project.description || "No description available." }}
                ></p>
              </div>

              
              <button
                  onClick={() => handleViewMore(project)}
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

      {/* Modal for View More */}
      {isModalOpen && selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeModal}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
          >
            <img
              src={selectedProject.image ? `/storage/${selectedProject.image}` : "/storage/default.jpg"}
              alt={selectedProject.title}
              className="w-full h-48 object-cover rounded-t-lg mb-4"
            />
            <h3 className="text-xl font-bold mb-4 text-gray-800 text-center">
              {selectedProject.title}
            </h3>
            <p
              className="text-gray-600 mb-2"
              dangerouslySetInnerHTML={{ __html: selectedProject.description }}
            ></p>
            <p className="text-gray-600 mb-2">
                <span className="font-semibold">Purpose:</span>{" "}
                {selectedProject.category || "Not provided"}
            </p>

            <p className="text-gray-600 mb-2">
                <span className="font-semibold">Project Theme:</span>{" "}
                {selectedProject.project_theme || "Not provided"}
            </p>

            <p className="text-gray-600 mb-2">
                <span className="font-semibold">Purpose:</span>{" "}
                {Array.isArray(selectedProject.purpose) ? selectedProject.purpose.join(", ") : "No Purpose Specified"}
            </p>

            <p className="text-gray-600 mb-2">
                <span className="font-semibold">Project Duration:</span>{" "}
                {selectedProject.start_date ? `${selectedProject.start_date} - ${selectedProject.end_date}` : "Not provided"}
            </p>

            <p className="text-gray-600 mb-2">
                <span className="font-semibold">Application Deadline:</span>{" "}
                {selectedProject.application_deadline || "Not provided"}
            </p>

            <p className="text-gray-600 mb-2">
                <span className="font-semibold">Contact Email:</span>{" "}
                {selectedProject.email || "Not provided"}
            </p>

            <p className="text-gray-600">
                <span className="font-semibold">Attachment:</span>{" "}
                {selectedProject.attachment ? (
                    <a
                    href={`/storage/${selectedProject.attachment}`}
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

export default ProjectCard;
