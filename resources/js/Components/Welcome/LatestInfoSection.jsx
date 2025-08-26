import React, { useState } from 'react';

const InfoCard = ({ tag, organization, title, location, displayField, deadline, dateRange, description, keywords, url, type }) => {
    const handleViewDetails = () => {
        if (!url) return;

        let routeName = '';
        if (type === 'grant') {
            routeName = route("welcome.grants.show", url);
        } else if (type === 'event') {
            routeName = route("welcome.events.show", url);
        }

        if (routeName) {
            window.location.href = routeName;
        }
    };

    return (
        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <span className="bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {tag}
                </span>
                <span className="text-gray-500 text-sm font-medium line-clamp-1 max-w-[200px]">{organization}</span>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight line-clamp-1">
                {title}
            </h3>

            {/* Conditional Content based on tag */}
            {tag.includes('Grant') || tag.includes('Fund') || tag.includes('Initiative') ? (
                <>
                    {/* Location for Grants */}
                    <div className="flex items-center mb-3">
                        <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        <span className="text-blue-600 font-semibold text-normal">{location}</span>
                    </div>

                    {/* Deadline for Grants */}
                    <div className="flex items-center mb-4">
                        <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        <span className="text-gray-500 text-sm">Deadline: {deadline}</span>
                    </div>
                </>
            ) : (
                <>
                    {/* Event Mode for Events */}
                    <div className="flex items-center mb-3">
                        <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                        </svg>
                        <span className="text-green-600 font-semibold text-normal">{displayField}</span>
                    </div>

                    {/* Date Range for Events */}
                    <div className="flex items-center mb-4">
                        <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        <span className="text-gray-500 text-sm">Date: {dateRange}</span>
                    </div>
                </>
            )}

            {/* Description */}
            <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3 overflow-hidden">
                {description}
            </p>

            {/* Keywords */}
            <div className="flex flex-wrap gap-2 mb-6">
                {keywords.map((keyword, index) => (
                    <span key={index} className="border border-gray-300 text-gray-700 text-xs px-2 py-1 rounded-full">
                        {keyword}
                    </span>
                ))}
            </div>

            {/* Action Button */}
            <button 
                onClick={handleViewDetails}
                className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center"
            >
                Apply Now
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                </svg>
            </button>
        </div>
    );
};

const LatestInfoSection = ({ grants = [], events = [] }) => {
    const [activeTab, setActiveTab] = useState('funding');
    const [currentPage, setCurrentPage] = useState(0);

    // Map backend data to component structure
    const fundingData = grants.map(grant => ({
        tag: grant.grant_type,
        organization: grant.sponsored_by,
        title: grant.title,
        location: grant.country ? grant.country : 'N/A',
        deadline: new Date(grant.application_deadline).toLocaleDateString(),
        description: grant.description.replace(/<[^>]*>/g, ''), // Strip HTML tags
        keywords: Array.isArray(grant.grant_theme) ? grant.grant_theme : ['N/A'],
        url: grant.url,
        type: 'grant'
    }));

    const eventsData = events.map(event => ({
        tag: event.event_type,
        organization: 'Event', // Using a placeholder as organization is not in the event data
        title: event.event_name,
        displayField: event.event_mode,
        dateRange: `${new Date(event.start_date).toLocaleDateString()} - ${new Date(event.end_date).toLocaleDateString()}`,
        description: event.description.replace(/<[^>]*>/g, ''), // Strip HTML tags
        keywords: Array.isArray(event.event_theme) ? event.event_theme : ['N/A'],
        url: event.url,
        type: 'event'
    }));

    const currentData = activeTab === 'funding' ? fundingData : eventsData;

    // Carousel Logic
    const itemsPerPage = 3;
    const totalPages = Math.ceil(currentData.length / itemsPerPage);
    const displayedData = currentData.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleNext = () => {
        setCurrentPage((prev) => (prev + 1) % totalPages);
    };

    const handlePrevious = () => {
        setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setCurrentPage(0); // Reset to first page when changing tabs
    };

    return (
        <section id="latest-info" className="py-40 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-5xl font-extrabold text-gray-900 mb-6 font-[sans-serif]">
                        Latest Information
                    </h2>
                    <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
                        Stay up to date with the latest funding opportunities, conferences, workshops, and academic programs tailored to your research domain.
                    </p>
                </div>

                {/* Tabbed Interface - Visible on All Screens */}
                <div className="flex justify-center mb-12">
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => handleTabChange('funding')}
                            className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                                activeTab === 'funding'
                                    ? 'bg-purple-600 text-white shadow-lg'
                                    : 'text-gray-700 hover:text-gray-900'
                            }`}
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                            </svg>
                            Funding
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-bold ${
                                activeTab === 'funding'
                                    ? 'bg-white text-purple-600'
                                    : 'bg-purple-600 text-white'
                            }`}>
                                {fundingData.length}
                            </span>
                        </button>
                        <button
                            onClick={() => handleTabChange('events')}
                            className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                                activeTab === 'events'
                                    ? 'bg-purple-600 text-white shadow-lg'
                                    : 'text-gray-700 hover:text-gray-900'
                            }`}
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                            Events
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-bold ${
                                activeTab === 'events'
                                    ? 'bg-white text-purple-600'
                                    : 'bg-purple-600 text-white'
                            }`}>
                                {eventsData.length}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Carousel Container */}
                <div className="relative mb-12">
                    {/* Previous Button */}
                    {totalPages > 1 && (
                        <button
                            onClick={handlePrevious}
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-20 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors duration-200 border border-gray-200"
                        >
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                            </svg>
                        </button>
                    )}

                    {/* Content Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {displayedData.map((item, index) => (
                            <InfoCard key={index} {...item} />
                        ))}
                    </div>

                    {/* Next Button */}
                    {totalPages > 1 && (
                        <button
                            onClick={handleNext}
                            className="hidden lg:flex absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-20 z-10 w-12 h-12 bg-white rounded-full shadow-lg items-center justify-center hover:bg-gray-50 transition-colors duration-200 border border-gray-200"
                        >
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                            </svg>
                        </button>
                    )}
                </div>

                {/* Pagination Dots */}
                {totalPages > 1 && (
                    <div className="flex justify-center space-x-2">
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handlePageChange(index)}
                                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                                    currentPage === index ? 'bg-purple-600' : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                                aria-label={`Go to page ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default LatestInfoSection; 