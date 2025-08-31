import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) {
        return null; // Don't render if there's only one page or less
    }

    // Logic to generate the page numbers with ellipsis
    const getPageNumbers = () => {
        const pages = [];
        const pageLimit = 3; // How many pages to show around the current page
        let startPage = Math.max(2, currentPage - 1);
        let endPage = Math.min(totalPages - 1, currentPage + 1);

        pages.push(1); // Always show the first page

        if (currentPage > pageLimit) {
            pages.push('...');
        }

        for (let i = startPage; i <= endPage; i++) {
            if (i !== 1 && i !== totalPages) {
                pages.push(i);
            }
        }
        
        if (totalPages - currentPage > pageLimit - 1) {
            pages.push('...');
        }

        if (totalPages > 1) {
            pages.push(totalPages); // Always show the last page
        }
        
        return [...new Set(pages)]; // Remove duplicates
    };

    const pageNumbers = getPageNumbers();

    return (
        <nav className="flex items-center justify-center space-x-2" aria-label="Pagination">
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
            </button>

            {/* Page Number Buttons */}
            <div className="flex items-center space-x-1">
                {pageNumbers.map((page, index) =>
                    typeof page === 'number' ? (
                        <button
                            key={index}
                            onClick={() => onPageChange(page)}
                            className={`inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-semibold transition-colors
                                ${currentPage === page
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'text-gray-700 bg-white hover:bg-gray-100 border border-gray-200'
                                }`
                            }
                        >
                            {page}
                        </button>
                    ) : (
                        <span key={index} className="px-2 py-2 text-sm font-medium text-gray-500">...</span>
                    )
                )}
            </div>

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
            </button>
        </nav>
    );
} 