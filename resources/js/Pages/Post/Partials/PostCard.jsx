import React, { useState } from "react";
import FilterDropdown from "@/Components/FilterDropdown";

const PostCard = ({ posts }) => {
  // State for filtering by category (allow multiple selection if needed)
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Extract unique categories from posts (filter out empty values)
  const uniqueCategories = [...new Set(posts.map(post => post.category))].filter(Boolean);

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
      {/* Sidebar for Filters */}
      <div className="w-full lg:w-1/4 p-4 bg-gray-100 border-r">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <FilterDropdown
          label="Category"
          options={uniqueCategories}
          selectedValues={categoryFilter}
          setSelectedValues={setCategoryFilter}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedPosts.map((post, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden text-center pb-8">
              <img
                src={post.featured_image ? `/storage/${post.featured_image}` : "/storage/default.jpg"}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 truncate" title={post.title}>
                  {post.title}
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
                  dangerouslySetInnerHTML={{ __html: post.content || "No content available." }}
                ></p>
              </div>
              <div className="px-4">
                <a href={route('posts.show', post.url)} 
                    className="inline-block rounded-full border border-gray-300 px-7 py-2 text-base font-medium text-body-color transition hover:border-primary hover:bg-primary hover:text-dark"
                    >View Details
                </a>
              </div>
            </div>
          ))}
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
                {index > 0 && page - arr[index - 1] > 1 && (
                  <span className="px-2">...</span>
                )}
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
