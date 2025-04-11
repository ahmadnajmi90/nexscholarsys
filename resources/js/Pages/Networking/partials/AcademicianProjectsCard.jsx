import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import { FaArrowLeft } from "react-icons/fa";

const AcademicianProjectsCard = ({ academician, university, faculty, user, projects, researchOptions }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const displayedProjects = projects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
      {/* Back Button */}
      <div className="absolute top-[2rem] left-6 md:top-[3rem] md:left-[20.2rem] z-10">
        <Link 
          onClick={() => window.history.back()}
          className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"
        >
          <FaArrowLeft className="text-xl" />
        </Link>
      </div>

      {/* Profile Header */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-4 sm:mb-6">
        <div className="relative h-48 sm:h-64">
          <img
            src={academician.background_image 
              ? `/storage/${academician.background_image}`
              : '/storage/profile_background_images/default.jpg'}
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute -bottom-16 left-4 sm:left-8">
            <img
              src={academician.profile_picture 
                ? `/storage/${academician.profile_picture}`
                : '/images/default-avatar.jpg'}
              alt={academician.full_name}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />
          </div>
        </div>
        
        <div className="px-4 sm:px-8 pt-20 pb-4 sm:pb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{academician.full_name}</h1>
          {academician.current_position && (
            <p className="text-base sm:text-lg text-gray-600 mt-1">{academician.current_position}</p>
          )}
          <div className="mt-2 flex flex-wrap items-center text-gray-500">
            <p className="text-sm sm:text-base">{university?.full_name} - {faculty?.name}</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-300 mb-6">
        <div className="flex md:space-x-12 space-x-4 px-4 sm:px-8">
          <Link
            href={route('academicians.show', academician.url)}
            className="md:text-lg text-base font-semibold text-gray-600 hover:text-blue-600 pb-2"
          >
            Profile
          </Link>
          <Link
            href={route('academicians.publications', academician.url)}
            className="md:text-lg text-base font-semibold text-gray-600 hover:text-blue-600 pb-2"
          >
            Publications
          </Link>
          <Link
            href={route('academicians.projects', academician.url)}
            className="md:text-lg text-base font-semibold text-blue-600 hover:text-blue-800 border-b-2 border-blue-600 pb-2"
          >
            Projects
          </Link>
          <Link
            href="#"
            className="md:text-lg text-base font-semibold text-gray-600 hover:text-blue-600 pb-2"
          >
            Supervisors
          </Link>
        </div>
      </div>

      {/* Projects Content */}
      <div className="min-h-screen">
        {/* Main Content */}
        <div className="py-6 px-4">
          {projects.length === 0 ? (
            <div className="text-center py-10">
              <h3 className="text-xl font-medium text-gray-700 mb-2">No Projects Found</h3>
              <p className="text-gray-500">This academician has not published any projects yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedProjects.map((project, index) => (
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
                      className="text-gray-600 mt-4 h-12 text-center font-extralight"
                      style={{
                        maxWidth: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                      dangerouslySetInnerHTML={{
                        __html: project.description || "No description available.",
                      }}
                    ></p>
                  </div>
                  <Link
                    href={route("projects.show", project.url)}
                    className="inline-block rounded-full border border-gray-300 px-7 py-2 text-base font-medium text-body-color transition hover:border-primary hover:bg-primary hover:text-dark"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Pagination - only show if we have more than one page */}
          {totalPages > 1 && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default AcademicianProjectsCard; 