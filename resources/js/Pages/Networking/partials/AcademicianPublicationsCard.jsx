import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import { FaArrowLeft, FaExternalLinkAlt, FaQuoteLeft, FaListAlt, FaChevronDown, FaChevronUp } from "react-icons/fa";

const AcademicianPublicationsCard = ({ 
    academician, 
    university, 
    faculty, 
    user, 
    publications, 
    scholarProfile,
    researchOptions 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedAbstracts, setExpandedAbstracts] = useState({});
  const itemsPerPage = 10;

  const totalPages = Math.ceil(publications.length / itemsPerPage);
  const displayedPublications = publications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Count publications by year
  const publicationsByYear = publications.reduce((acc, pub) => {
    const year = pub.year || 'Unknown';
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {});

  // Sort years in descending order
  const yearCounts = Object.entries(publicationsByYear)
    .sort(([a], [b]) => {
      if (a === 'Unknown') return 1;
      if (b === 'Unknown') return -1;
      return parseInt(b) - parseInt(a);
    });
    
  // Toggle abstract visibility
  const toggleAbstract = (id) => {
    setExpandedAbstracts(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
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
            className="md:text-lg text-base font-semibold text-blue-600 hover:text-blue-800 border-b-2 border-blue-600 pb-2"
          >
            Publications
          </Link>
          <Link
            href={route('academicians.projects', academician.url)}
            className="md:text-lg text-base font-semibold text-gray-600 hover:text-blue-600 pb-2"
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

      {/* Publications Content */}
      <div className="min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Scholar Stats */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold mb-4">Overview</h3>
              
              {scholarProfile ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Total Citations</h4>
                    <p className="text-xl font-semibold">{scholarProfile.total_citations}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">h-index</h4>
                    <p className="text-xl font-semibold">{scholarProfile.h_index}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">i10-index</h4>
                    <p className="text-xl font-semibold">{scholarProfile.i10_index}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Last Updated</h4>
                    <p className="text-sm text-gray-700">
                      {scholarProfile.last_scraped_at 
                        ? new Date(scholarProfile.last_scraped_at).toLocaleDateString()
                        : 'Not available'}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">
                  Scholar profile information not available
                </p>
              )}
            </div>

            <div className="bg-white shadow rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Publications by Year</h3>
              
              {yearCounts.length > 0 ? (
                <div className="space-y-2">
                  {yearCounts.map(([year, count]) => (
                    <div key={year} className="flex justify-between items-center">
                      <span className="text-gray-700">{year}</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No publication data available</p>
              )}
            </div>
          </div>

          {/* Main Content - Publications List */}
          <div className="lg:col-span-3">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Publications</h2>
                {academician.google_scholar && (
                  <a 
                    href={academician.google_scholar}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <span className="mr-2">View on Google Scholar</span>
                    <FaExternalLinkAlt />
                  </a>
                )}
              </div>

              {publications.length === 0 ? (
                <div className="text-center py-10">
                  <h3 className="text-xl font-medium text-gray-700 mb-2">No Publications Found</h3>
                  <p className="text-gray-500">This academician has no recorded publications yet.</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {displayedPublications.map((publication, index) => (
                    <div key={index} className="border-b pb-6 last:border-0 last:pb-0">
                      <h3 className="text-lg font-semibold text-blue-800 hover:text-blue-600 mb-2">
                        {publication.url ? (
                          <a 
                            href={publication.url} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {publication.title}
                          </a>
                        ) : (
                          publication.title
                        )}
                      </h3>
                      
                      <div className="text-sm text-gray-600 mb-2">
                        {publication.authors}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-700 mb-3">
                        <span className="font-medium">{publication.venue}</span>
                        {publication.year && (
                          <>
                            <span className="mx-2">•</span>
                            <span>{publication.year}</span>
                          </>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm">
                        {publication.citations > 0 && (
                          <div className="flex items-center text-gray-600">
                            <FaQuoteLeft className="mr-2 text-xs" />
                            <span>Cited by {publication.citations}</span>
                          </div>
                        )}
                        
                        {publication.abstract && (
                          <button 
                            onClick={() => toggleAbstract(publication.id)} 
                            className="flex items-center text-gray-600 hover:text-blue-600"
                          >
                            <FaListAlt className="mr-2 text-xs" />
                            <span>Abstract</span>
                            {expandedAbstracts[publication.id] ? (
                              <FaChevronUp className="ml-1 text-xs" />
                            ) : (
                              <FaChevronDown className="ml-1 text-xs" />
                            )}
                          </button>
                        )}
                      </div>
                      
                      {/* Publication Abstract - Expandable */}
                      {publication.abstract && expandedAbstracts[publication.id] && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-md text-sm text-gray-700">
                          <h4 className="font-semibold mb-2">Abstract</h4>
                          <p>{publication.abstract}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination - only show if we have more than one page */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8 space-x-2 items-center">
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
      </div>
    </div>
  );
};

export default AcademicianPublicationsCard; 