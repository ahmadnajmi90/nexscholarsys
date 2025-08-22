import React, { useState } from "react";
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

const PostCard = ({ posts, isLoading }) => {
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [showFilters, setShowFilters] = useState(false);

  // Convert unique categories into objects for the FilterDropdown
  const uniqueCategories = [...new Set(posts.map(post => post.category))]
    .filter(Boolean)
    .map(cat => ({ value: cat, label: cat }));

  // Filter posts based on selected category values
  const filteredPosts = posts.filter(post => {
    return categoryFilter.length === 0 || categoryFilter.includes(post.category);
  });

  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const displayedPosts = filteredPosts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen flex">
      {/* Search Bar - Desktop */}
      <div className="fixed top-20 left-4 z-50 lg:left-auto lg:right-20 hidden lg:block">
        <SearchBar
          placeholder="Search posts..."
          routeName="posts.index"
          className=""
        />
      </div>

      {/* Mobile Header with Search and Filter */}
      <div className="fixed top-20 right-4 z-50 flex flex-col items-end space-y-2 lg:hidden">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="bg-blue-600 text-white p-2 rounded-lg shadow-lg"
        >
          {/* Simple filter icon SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" 
               viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 14.414V19a1 1 0 01-1 1h-2a1 1 0 01-1-1v-4.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
        </button>
        <SearchBar
          placeholder="Search posts..."
          routeName="posts.index"
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
          {/* Close button for mobile */}
          <button onClick={() => setShowFilters(false)} className="text-gray-600 lg:hidden">
            ✕
          </button>
        </h2>
        <FilterDropdown
          label="Category"
          options={uniqueCategories}
          selectedValues={categoryFilter}
          setSelectedValues={setCategoryFilter}
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
            // Show actual post cards when not loading
            displayedPosts.map((post, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden text-center pb-8">
              <img
                src={post.featured_image ? `/storage/${post.featured_image}` : "/storage/default.jpg"}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-800 truncate" title={post.title}>
                  {post.title}
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
                    html={post.content || "No content available."}
                    maxLength={100}
                  />
                </p>
              </div>
              <div className="px-4">
                <a 
                  href={route('posts.show', post.url)}
                  className="inline-block rounded-full border border-gray-300 px-7 py-2 text-base font-medium text-body-color transition hover:border-primary hover:bg-primary hover:text-dark"
                >
                  View Details
                </a>
              </div>
            </div>
          ))
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6 space-x-2 items-center">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded bg-white text-gray-700 hover:bg-gray-200 disabled:opacity-50"
          >
            ◄
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1)
            .filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
            .map((page, index, arr) => (
              <React.Fragment key={page}>
                {index > 0 && page - arr[index - 1] > 1 && <span className="px-2">...</span>}
                <button
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 border rounded ${currentPage === page ? "bg-blue-500 text-white" : "bg-white text-gray-700"}`}
                >
                  {page}
                </button>
              </React.Fragment>
            ))}
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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

export default PostCard;
