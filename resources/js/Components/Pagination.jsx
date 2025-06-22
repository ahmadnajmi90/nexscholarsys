import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const handlePageClick = (page) => {
        onPageChange(page);
    };

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        if (totalPages <= maxVisiblePages) {
            // Show all pages if total is small
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Show ellipsis logic for larger page counts
            const startPage = Math.max(1, currentPage - 2);
            const endPage = Math.min(totalPages, currentPage + 2);
            
            if (startPage > 1) {
                pages.push(1);
                if (startPage > 2) {
                    pages.push('...');
                }
            }
            
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }
            
            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    pages.push('...');
                }
                pages.push(totalPages);
            }
        }
        
        return pages;
    };

    if (totalPages <= 1) {
        return null; // Don't show pagination if there's only one page or no pages
    }

    return (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
            {/* Mobile view */}
            <div className="flex justify-between flex-1 sm:hidden">
                <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className={`
                        relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md border
                        ${currentPage === 1
                            ? 'text-gray-300 bg-gray-100 border-gray-300 cursor-not-allowed'
                            : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                        }
                    `}
                >
                    Previous
                </button>
                <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className={`
                        relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium rounded-md border
                        ${currentPage === totalPages
                            ? 'text-gray-300 bg-gray-100 border-gray-300 cursor-not-allowed'
                            : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                        }
                    `}
                >
                    Next
                </button>
            </div>

            {/* Desktop view */}
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700">
                        Page <span className="font-medium">{currentPage}</span> of{' '}
                        <span className="font-medium">{totalPages}</span>
                    </p>
                </div>
                <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        {/* Previous button */}
                        <button
                            onClick={handlePrevious}
                            disabled={currentPage === 1}
                            className={`
                                relative inline-flex items-center px-2 py-2 rounded-l-md border text-sm font-medium
                                ${currentPage === 1
                                    ? 'text-gray-300 bg-gray-100 border-gray-300 cursor-not-allowed'
                                    : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50'
                                }
                            `}
                        >
                            <span className="sr-only">Previous</span>
                            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                        </button>

                        {/* Page numbers */}
                        {getPageNumbers().map((page, index) => (
                            <React.Fragment key={index}>
                                {page === '...' ? (
                                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                        ...
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => handlePageClick(page)}
                                        className={`
                                            relative inline-flex items-center px-4 py-2 border text-sm font-medium
                                            ${page === currentPage
                                                ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                            }
                                        `}
                                    >
                                        {page}
                                    </button>
                                )}
                            </React.Fragment>
                        ))}

                        {/* Next button */}
                        <button
                            onClick={handleNext}
                            disabled={currentPage === totalPages}
                            className={`
                                relative inline-flex items-center px-2 py-2 rounded-r-md border text-sm font-medium
                                ${currentPage === totalPages
                                    ? 'text-gray-300 bg-gray-100 border-gray-300 cursor-not-allowed'
                                    : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50'
                                }
                            `}
                        >
                            <span className="sr-only">Next</span>
                            <ChevronRight className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
} 