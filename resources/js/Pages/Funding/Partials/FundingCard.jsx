import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import FilterDropdown from "@/Components/FilterDropdown";
import SearchBar from "@/Components/SearchBar";
import Pagination from "@/Components/Pagination";
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

const FundingCard = ({ fundingItems, isLoading }) => {
    const [activeTab, setActiveTab] = useState('all');
    const [fundingTypeFilter, setFundingTypeFilter] = useState([]);
    const [fundingThemeFilter, setFundingThemeFilter] = useState([]);
    const [countryFilter, setCountryFilter] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const itemsPerPage = 9;

    // Filter items based on active tab
    const tabFilteredItems = fundingItems.filter((item) => {
        if (activeTab === 'all') return true;
        if (activeTab === 'grants') return item.type === 'grant';
        if (activeTab === 'scholarships') return item.type === 'scholarship';
        return true;
    });

    // Unique filter options based on funding attributes (combine grant_type and scholarship_type)
    const uniqueFundingTypes = [...new Set(tabFilteredItems.flatMap((item) => {
        const types = [];
        if (item.grant_type) types.push(item.grant_type);
        if (item.scholarship_type) types.push(item.scholarship_type);
        return types;
    }))].filter(Boolean).map((type) => ({ value: type, label: type }));

    // Combine grant_theme and scholarship_theme
    const uniqueFundingThemes = [
        ...new Set(tabFilteredItems.flatMap((item) => {
            const themes = [];
            if (item.grant_theme) themes.push(...item.grant_theme);
            if (item.scholarship_theme) themes.push(...item.scholarship_theme);
            return themes;
        }))
    ].filter(Boolean).map((theme) => ({ value: theme, label: theme }));

    const uniqueCountries = [...new Set(tabFilteredItems.map((item) => item.country))]
        .filter(Boolean)
        .map((country) => ({ value: country, label: country }));

    // Filter funding items based on selected filters
    const filteredFundingItems = tabFilteredItems.filter((item) => {
        const matchesType =
            fundingTypeFilter.length === 0 ||
            fundingTypeFilter.includes(item.grant_type) ||
            fundingTypeFilter.includes(item.scholarship_type);
        const matchesTheme =
            fundingThemeFilter.length === 0 ||
            (item.grant_theme && item.grant_theme.some((theme) => fundingThemeFilter.includes(theme))) ||
            (item.scholarship_theme && item.scholarship_theme.some((theme) => fundingThemeFilter.includes(theme)));
        const matchesCountry =
            countryFilter.length === 0 || countryFilter.includes(item.country);
        return matchesType && matchesTheme && matchesCountry;
    });

    // Sort items: active items first (by closest deadline), then ended items (by furthest deadline)
    const sortedFundingItems = [...filteredFundingItems].sort((a, b) => {
        const today = new Date();
        const deadlineA = new Date(a.application_deadline);
        const deadlineB = new Date(b.application_deadline);

        const isEndedA = deadlineA < today;
        const isEndedB = deadlineB < today;

        // If one is ended and the other is not, put active first
        if (!isEndedA && isEndedB) return -1;
        if (isEndedA && !isEndedB) return 1;

        // If both are active, sort by deadline ascending (closest first)
        if (!isEndedA && !isEndedB) {
            return deadlineA - deadlineB;
        }

        // If both are ended, sort by deadline descending (furthest first)
        if (isEndedA && isEndedB) {
            return deadlineB - deadlineA;
        }

        return 0;
    });

    const totalPages = Math.ceil(sortedFundingItems.length / itemsPerPage);
    const displayedFundingItems = sortedFundingItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1); // Reset to first page when changing tabs
        setFundingTypeFilter([]); // Reset filters
        setFundingThemeFilter([]);
        setCountryFilter([]);
    };

    const handleTooltipToggle = () => {
        setShowTooltip(!showTooltip);
    };

    // Close tooltip when clicking outside (for mobile)
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (showTooltip && !event.target.closest('.tooltip-container')) {
                setShowTooltip(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [showTooltip]);

    return (
        <div className="min-h-screen">
            {/* Mobile Header with Search and Filter */}
            <div className="fixed top-20 right-4 z-50 flex flex-col items-end space-y-2 lg:hidden">
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="bg-indigo-600 text-white p-2 rounded-lg shadow-lg"
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
                    placeholder="Search funding..."
                    routeName="funding.index"
                    className=""
                />
            </div>

            {/* Tab Navigation with Info Tooltip */}
            <div className="mb-0 lg:mb-6 px-4 md:px-6 lg:px-0">
                <div className="flex items-center gap-4">
                    <div className="flex space-x-1 bg-gray-200 lg:bg-gray-100 p-1 rounded-lg w-fit mt-4 lg:mt-0">
                        <button
                            onClick={() => handleTabChange('all')}
                            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                                activeTab === 'all'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            All ({fundingItems.length})
                        </button>
                        <button
                            onClick={() => handleTabChange('grants')}
                            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                                activeTab === 'grants'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Grants ({fundingItems.filter(item => item.type === 'grant').length})
                        </button>
                        <button
                            onClick={() => handleTabChange('scholarships')}
                            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                                activeTab === 'scholarships'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Scholarships ({fundingItems.filter(item => item.type === 'scholarship').length})
                        </button>
                    </div>

                    {/* Desktop: Info Icon with Hover Tooltip */}
                    <div className="hidden lg:block relative group tooltip-container">
                        <button
                            className="flex items-center justify-center w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label="Information about grants and scholarships"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </button>

                        {/* Desktop Hover Tooltip */}
                        <div className="absolute left-0 top-full mt-2 w-80 p-3 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                            <div className="text-sm text-gray-700 space-y-2">
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-1">Grants:</h4>
                                    <p>A sum of money awarded to Academicians to fund specific research projects. Postgraduates can join these projects as Research Assistants but typically do not apply for the grant itself.</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-1">Scholarships:</h4>
                                    <p>Financial aid awarded directly to Students to support their education, often based on merit or financial need.</p>
                                </div>
                            </div>

                            {/* Arrow pointing up */}
                            <div className="absolute -top-1 left-2 w-0 h-0 border-l-3 border-r-3 border-b-3 border-transparent border-b-white"></div>
                        </div>
                    </div>
                </div>

                {/* Mobile: Static informational text underneath tabs */}
                <div className="lg:hidden mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-sm text-gray-700 space-y-3">
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-1">Grants:</h4>
                            <p>A sum of money awarded to Academicians to fund specific research projects. Postgraduates can join these projects as Research Assistants but typically do not apply for the grant itself.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-1">Scholarships:</h4>
                            <p>Financial aid awarded directly to Students to support their education, often based on merit or financial need.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Two-Column Layout */}
            <div className="flex flex-col lg:flex-row gap-6 p-4 md:p-0 md:py-2 md:px-4 lg:p-0 lg:py-2 lg:pr-2">
                {/* Left Column - Filter Panel */}
                <div className="lg:w-1/4">
                    <div
                        className={`fixed lg:relative top-0 left-0 lg:block lg:w-full w-3/4 h-full bg-gray-100 border-r rounded-lg p-4 transition-transform duration-300 z-50 ${
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
                            label="Funding Type"
                            options={uniqueFundingTypes}
                            selectedValues={fundingTypeFilter}
                            setSelectedValues={setFundingTypeFilter}
                        />
                        <FilterDropdown
                            label="Funding Theme"
                            options={uniqueFundingThemes}
                            selectedValues={fundingThemeFilter}
                            setSelectedValues={setFundingThemeFilter}
                        />
                        <FilterDropdown
                            label="Country"
                            options={uniqueCountries}
                            selectedValues={countryFilter}
                            setSelectedValues={setCountryFilter}
                        />
                    </div>
                </div>

                {/* Right Column - Search Bar and Content */}
                <div className="lg:w-3/4">
                    {/* Search Bar - Desktop */}
                    <div className="mb-6 hidden lg:block">
                        <SearchBar
                            placeholder="Search funding..."
                            routeName="funding.index"
                            className=""
                        />
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-0 md:px-2 lg:px-0">
                        {isLoading ? (
                            // Show skeleton cards while loading
                            Array.from({ length: 9 }, (_, index) => (
                                <ContentSkeletonCard key={index} />
                            ))
                        ) : displayedFundingItems.length === 0 ? (
                            // Show empty state when no items match the current filters/tabs
                            <div className="col-span-full flex flex-col items-center justify-center py-16 px-4">
                                <div className="text-center">
                                    <svg
                                        className="mx-auto h-24 w-24 text-gray-400 mb-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        {activeTab === 'grants' ? 'No Grants Available' :
                                         activeTab === 'scholarships' ? 'No Scholarships Available' :
                                         'No Funding Opportunities Available'}
                                    </h3>
                                    <p className="text-gray-500 mb-4 max-w-md mx-auto">
                                        {activeTab === 'grants'
                                            ? 'There are currently no grants available. Please check back later or try adjusting your filters.'
                                            : activeTab === 'scholarships'
                                            ? 'There are currently no scholarships available. Please check back later or try adjusting your filters.'
                                            : 'There are currently no funding opportunities available. Please check back later or try adjusting your filters.'
                                        }
                                    </p>
                                    {(fundingTypeFilter.length > 0 || fundingThemeFilter.length > 0 || countryFilter.length > 0) && (
                                        <button
                                            onClick={() => {
                                                setFundingTypeFilter([]);
                                                setFundingThemeFilter([]);
                                                setCountryFilter([]);
                                            }}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            Clear All Filters
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            // Show actual funding cards when not loading and items exist
                            displayedFundingItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-lg shadow-md overflow-hidden text-center pb-8 relative"
                                >
                                    {/* Type Label */}
                                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold text-white z-10 ${
                                        item.type === 'grant'
                                            ? 'bg-blue-500'
                                            : item.type === 'scholarship'
                                            ? 'bg-green-500'
                                            : 'bg-gray-500'
                                    }`}>
                                        {item.type === 'grant' ? 'Grant' : item.type === 'scholarship' ? 'Scholarship' : 'Funding'}
                                    </div>

                                    {/* Ended Label */}
                                    {new Date(item.application_deadline) < new Date() && (
                                        <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold text-white bg-red-500 z-10">
                                            Ended
                                        </div>
                                    )}

                                    <img
                                        src={item.image ? `/storage/${item.image}` : "/storage/default.jpg"}
                                        alt={item.title}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-6">
                                        <h2
                                            className="text-lg font-semibold text-gray-800 truncate"
                                            title={item.title}
                                        >
                                            {item.title}
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
                                                html={item.description || "No description available."}
                                                maxLength={100}
                                            />
                                        </p>
                                    </div>
                                    {/* View Details Link */}
                                    <Link
                                        href={item.type === 'grant'
                                            ? route("funding.show.grant", { url: item.url })
                                            : route("funding.show.scholarship", { url: item.url })}
                                        className="inline-block rounded-full border border-gray-300 px-7 py-2 text-base font-medium transition hover:border-primary hover:bg-primary hover:text-white"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="mt-6">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FundingCard;
