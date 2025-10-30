import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { FaArrowLeft, FaExternalLinkAlt, FaQuoteLeft, FaListAlt, FaChevronDown, FaChevronUp, FaSync } from "react-icons/fa";
import axios from "axios";
import BackButton from '@/Components/BackButton';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

const AcademicianPublicationsCard = ({ 
    academician, 
    university, 
    faculty, 
    user, 
    publications, 
    scholarProfile,
    researchOptions,
    isEditing = false,
    hideNavigation = false,
    hideProfile = false 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedAbstracts, setExpandedAbstracts] = useState({});
  const [isScrapingScholar, setIsScrapingScholar] = useState(false);
  const [scholarStatus, setScholarStatus] = useState(null);
  const [canUpdateScholar, setCanUpdateScholar] = useState(false);
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
  
  // Generate pagination page numbers with ellipsis
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('ellipsis-start');
      }
      
      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('ellipsis-end');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  // Fetch Google Scholar status when in editing mode
  useEffect(() => {
    if (isEditing && academician?.google_scholar) {
      fetchScholarStatus();
    }
  }, [isEditing, academician?.google_scholar]);

  // Function to fetch Google Scholar scraping status
  const fetchScholarStatus = () => {
    axios.get('/api/scholar/status')
      .then(response => {
        if (response.data.success) {
          setScholarStatus(response.data);
          setCanUpdateScholar(response.data.can_update);
        }
      })
      .catch(error => {
        console.error("Error fetching Google Scholar status:", error);
      });
  };

  // Function to trigger Google Scholar scraping
  const handleScholarScrape = () => {
    if (!academician.google_scholar) {
      alert("Please add your Google Scholar URL first in your profile settings.");
      return;
    }

    setIsScrapingScholar(true);
    axios.post('/api/scholar/scrape')
      .then(response => {
        setIsScrapingScholar(false);
        if (response.data.success) {
          alert(response.data.message);
          fetchScholarStatus(); // Refresh status after successful scrape
          // Reload the page to show updated publications
          window.location.reload();
        } else {
          alert(response.data.message || "Failed to update Google Scholar profile.");
        }
      })
      .catch(error => {
        setIsScrapingScholar(false);
        console.error("Error scraping Google Scholar:", error);
        alert(error.response?.data?.message || "An error occurred while updating your Google Scholar profile.");
      });
  };

  return (
    <div className={`${hideProfile ? '' : 'max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8'}`}>
      {/* Back Button - only shown when not hidden */}
      {!hideNavigation && (
        <div className="mb-4">
          <BackButton />
        </div>
      )}

      {/* Profile Header - only shown when not hidden */}
      {!hideProfile && (
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
      )}

      {/* Navigation Tabs - only shown when not hidden */}
      {!hideNavigation && (
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
      )}

      {/* Publications Content */}
      <div className={hideProfile ? '' : 'min-h-screen'}>
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
                  
                  {/* Update Google Scholar Button - only shown in editing mode */}
                  {isEditing && (
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={handleScholarScrape}
                        disabled={isScrapingScholar || !canUpdateScholar}
                        className={`w-full flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium 
                          ${isScrapingScholar || !canUpdateScholar
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                          } transition-colors`}
                      >
                        <FaSync className={`mr-2 ${isScrapingScholar ? 'animate-spin' : ''}`} />
                        {isScrapingScholar ? 'Updating...' : 'Update Google Scholar Data'}
                      </button>
                      
                      {scholarStatus && !canUpdateScholar && scholarStatus.latest_scraping && (
                        <p className="text-xs text-gray-500 mt-2">
                          Profile was recently updated. Next update available {scholarStatus.latest_scraping.created_at_human}.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <p className="text-gray-500 mb-4">
                    Scholar profile information not available
                  </p>
                  
                  {/* Update Google Scholar Button for new profiles - only in editing mode */}
                  {isEditing && academician.google_scholar && (
                    <button
                      type="button"
                      onClick={handleScholarScrape}
                      disabled={isScrapingScholar}
                      className={`w-full flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium 
                        ${isScrapingScholar 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                        } transition-colors`}
                    >
                      <FaSync className={`mr-2 ${isScrapingScholar ? 'animate-spin' : ''}`} />
                      {isScrapingScholar ? 'Updating...' : 'Import Google Scholar Data'}
                    </button>
                  )}
                </>
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
                  <p className="text-gray-500">
                    {isEditing 
                      ? "You don't have any recorded publications yet. Add your Google Scholar URL in the profile tab and click the Update button to import your publications."
                      : "This academician has no recorded publications yet."}
                  </p>
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
                      
                      {expandedAbstracts[publication.id] && publication.abstract && (
                        <div className="mt-4 p-4 bg-gray-50 rounded text-sm text-gray-700">
                          {publication.abstract}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Pagination */}
                  {publications.length > itemsPerPage && (
                    <Pagination className="mt-8">
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                        
                        {generatePageNumbers().map((page, index) => (
                          <PaginationItem key={`page-${page}-${index}`}>
                            {typeof page === 'number' ? (
                              <PaginationLink
                                onClick={() => setCurrentPage(page)}
                                isActive={currentPage === page}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            ) : (
                              <PaginationEllipsis />
                            )}
                          </PaginationItem>
                        ))}
                        
                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
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