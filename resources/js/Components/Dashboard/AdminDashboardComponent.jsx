import React, { useEffect, useState } from 'react';
import { FaUsers, FaDesktop, FaChartLine, FaEye, FaCheck, FaBell, FaFile } from 'react-icons/fa';

const AdminDashboardComponent = ({ totalUsers, topViewedAcademicians, analyticsData }) => {
    const [gaLoaded, setGaLoaded] = useState(!!analyticsData);

    // Render Google Analytics charts
    const renderGACharts = () => {
        if (!analyticsData) {
            return (
                <div className="bg-red-50 text-red-500 p-4 rounded-lg">
                    <p>Unable to load Google Analytics data. Please check your configuration.</p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Active Users Card */}
                <div className="bg-white shadow rounded-lg p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-sm font-semibold text-gray-500">ACTIVE USERS NOW</h2>
                        <p className="text-3xl font-bold">{analyticsData.activeUsers || 0}</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                        <FaUsers className="text-blue-500 text-xl" />
                    </div>
                </div>

                {/* Avg. Session Duration */}
                <div className="bg-white shadow rounded-lg p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-sm font-semibold text-gray-500">AVG. SESSION</h2>
                        <p className="text-3xl font-bold">{analyticsData.avgSessionDuration || 0}s</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                        <FaDesktop className="text-green-500 text-xl" />
                    </div>
                </div>

                {/* Total Users Card (from your database) */}
                <div className="bg-white shadow rounded-lg p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-sm font-semibold text-gray-500">REGISTERED USERS</h2>
                        <p className="text-3xl font-bold">{totalUsers}</p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-full">
                        <FaCheck className="text-purple-500 text-xl" />
                    </div>
                </div>

                {/* Content Views */}
                <div className="bg-white shadow rounded-lg p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-sm font-semibold text-gray-500">TOP PROFILE VIEWS</h2>
                        <p className="text-3xl font-bold">
                            {topViewedAcademicians && topViewedAcademicians.length > 0 
                                ? topViewedAcademicians[0].total_views 
                                : 0}
                        </p>
                    </div>
                    <div className="bg-yellow-100 p-3 rounded-full">
                        <FaEye className="text-yellow-500 text-xl" />
                    </div>
                </div>
            </div>
        );
    };

    // Top viewed academicians component
    const TopViewedAcademicians = ({ academicians }) => (
        <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Top Viewed Academicians</h2>
                <FaChartLine className="text-indigo-500" />
            </div>
            <div className="space-y-3 max-h-[350px] overflow-y-auto">
                {academicians && academicians.length > 0 ? (
                    academicians.map((academician, index) => (
                        <div key={academician.id} className="flex items-center justify-between border-b pb-2">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-indigo-500 font-bold">{index + 1}</span>
                                </div>
                                <div 
                                    className="w-8 h-8 rounded-full bg-cover bg-center mr-2"
                                    style={{
                                        backgroundImage: `url(${encodeURI(
                                        academician.profile_picture 
                                            ? `/storage/${academician.profile_picture}` 
                                            : "/storage/profile_pictures/default.jpg"
                                        )})`
                                    }}
                                ></div>
                                <div>
                                    <p className="font-medium text-sm truncate max-w-[150px]" title={academician.full_name || 'Unknown'}>
                                        {academician.full_name || 'Unknown'}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate max-w-[150px]" title={academician.current_position || 'No position'}>
                                        {academician.current_position || 'No position'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <FaEye className="w-3 h-3 text-indigo-500 mr-1" />
                                <span className="text-sm font-medium">{academician.total_views}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500">No view data available</p>
                )}
            </div>
        </div>
    );

    // Top pages component
    const TopPages = ({ pages }) => (
        <div className="bg-white shadow rounded-lg p-6 h-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Top Pages</h2>
                <FaFile className="text-indigo-500" />
            </div>
            {pages && pages.length > 0 ? (
                <div className="space-y-3">
                    {pages.map((page, index) => (
                        <div key={index} className="border-b pb-2">
                            <div className="flex items-center mb-1">
                                <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mr-2">
                                    <span className="text-indigo-500 font-bold text-xs">{index + 1}</span>
                                </div>
                                <p className="font-medium text-sm truncate max-w-[400px]" title={page.title}>
                                    {page.title || 'Untitled Page'}
                                </p>
                            </div>
                            <div className="flex justify-between text-xs pl-8">
                                <span className="text-gray-500">{page.path}</span>
                                <div className="flex items-center">
                                    <FaEye className="w-3 h-3 text-indigo-500 mr-1" />
                                    <span className="font-medium">{page.views}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex items-center justify-center h-[280px] bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">No page view data available</p>
                </div>
            )}
        </div>
    );

    // Page views over time visualization
    const PageViewsChart = ({ pageViewsData }) => {
        // Calculate max value for scaling the chart
        const maxViews = pageViewsData && pageViewsData.length > 0 
            ? Math.max(...pageViewsData.map(item => item.views)) 
            : 100;
        
        return (
            <div className="bg-white shadow rounded-lg p-6 h-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Page Views (Last 30 Days)</h2>
                    <FaBell className="text-indigo-500" />
                </div>
                
                {pageViewsData && pageViewsData.length > 0 ? (
                    <div className="h-[280px] flex items-end space-x-1">
                        {pageViewsData.map((day, index) => {
                            // Only show every 5th date label to avoid crowding
                            const showLabel = index % 5 === 0;
                            const height = (day.views / maxViews * 100) + '%';
                            
                            return (
                                <div key={index} className="flex flex-col items-center flex-1">
                                    <div 
                                        className="w-full bg-indigo-100 hover:bg-indigo-200 transition-all rounded-t"
                                        style={{ height }}
                                        title={`${day.date}: ${day.views} views`}
                                    ></div>
                                    {showLabel && (
                                        <div className="text-xs text-gray-500 mt-1 rotate-45 origin-left whitespace-nowrap">
                                            {day.date.substring(5)} {/* Show only MM-DD */}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-[280px] bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">No page view data available</p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <div className="text-sm text-gray-500">
                    {gaLoaded ? (
                        <span className="text-green-500">✓ Google Analytics connected</span>
                    ) : (
                        <span className="text-yellow-500">⟳ Loading analytics...</span>
                    )}
                </div>
            </div>

            {/* Google Analytics Integration */}
            {renderGACharts()}

            {/* Top Viewed Academicians and Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
                <div className="lg:col-span-1">
                    <TopViewedAcademicians academicians={topViewedAcademicians} />
                </div>
                <div className="lg:col-span-2">
                    <div className="grid grid-cols-1 gap-4">
                        <PageViewsChart pageViewsData={analyticsData?.pageViewsOverTime || []} />
                        <TopPages pages={analyticsData?.topPages || []} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardComponent; 