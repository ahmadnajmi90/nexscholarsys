import React from 'react';
import { FaUsers, FaDesktop, FaChartLine, FaEye, FaCheck, FaBell, FaFile } from 'react-icons/fa';

const AdminDashboardComponent_m = ({ totalUsers, topViewedAcademicians, analyticsData }) => {
    // Determine if Google Analytics data is loaded
    const gaLoaded = !!analyticsData;

    // Top viewed academicians component (mobile optimized)
    const TopViewedAcademicians = ({ academicians }) => (
        <div className="bg-white shadow rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-base font-semibold">Top Viewed Academicians</h2>
                <FaChartLine className="text-indigo-500" />
            </div>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {academicians && academicians.length > 0 ? (
                    academicians.slice(0, 5).map((academician, index) => (
                        <div key={academician.id} className="flex items-center justify-between border-b pb-2">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mr-2">
                                    <span className="text-indigo-500 font-bold text-xs">{index + 1}</span>
                                </div>
                                <div 
                                    className="w-6 h-6 rounded-full bg-cover bg-center mr-2"
                                    style={{
                                        backgroundImage: `url(${encodeURI(
                                        academician.profile_picture 
                                            ? `/storage/${academician.profile_picture}` 
                                            : "/storage/profile_pictures/default.jpg"
                                        )})`
                                    }}
                                ></div>
                                <div>
                                    <p className="font-medium text-xs truncate max-w-[120px]" title={academician.full_name || 'Unknown'}>
                                        {academician.full_name || 'Unknown'}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate max-w-[120px]" title={academician.current_position || 'No position'}>
                                        {academician.current_position || 'No position'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <FaEye className="w-3 h-3 text-indigo-500 mr-1" />
                                <span className="text-xs font-medium">{academician.total_views}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-xs text-gray-500">No view data available</p>
                )}
            </div>
        </div>
    );

    // Page views over time visualization - simplified for mobile
    const PageViewsChart = ({ pageViewsData }) => {
        // Calculate max value for scaling the chart
        const maxViews = pageViewsData && pageViewsData.length > 0 
            ? Math.max(...pageViewsData.map(item => item.views)) 
            : 100;
        
        return (
            <div className="bg-white shadow rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-base font-semibold">Page Views (30 Days)</h2>
                    <FaBell className="text-indigo-500" />
                </div>
                
                {pageViewsData && pageViewsData.length > 0 ? (
                    <div className="h-[150px] flex items-end space-x-[1px]">
                        {/* Show only the last 15 days on mobile for better visibility */}
                        {pageViewsData.slice(-15).map((day, index) => {
                            // Only show every 3rd date label on mobile to prevent overcrowding
                            const showLabel = index % 3 === 0;
                            const height = (day.views / maxViews * 100) + '%';
                            
                            return (
                                <div key={index} className="flex flex-col items-center flex-1">
                                    <div 
                                        className="w-full bg-indigo-100 hover:bg-indigo-200 transition-all rounded-t"
                                        style={{ height }}
                                        title={`${day.date}: ${day.views} views`}
                                    ></div>
                                    {showLabel && (
                                        <div className="text-[8px] text-gray-500 mt-1 rotate-45 origin-left whitespace-nowrap">
                                            {day.date.substring(5)} {/* Show only MM-DD */}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-[150px] bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">No page view data available</p>
                    </div>
                )}
            </div>
        );
    };

    // Analytics summary cards - displayed in a mobile-friendly column layout
    const renderAnalyticsSummary = () => {
        if (!analyticsData) {
            return (
                <div className="bg-red-50 text-red-500 p-3 rounded-lg text-xs mb-4">
                    <p>Unable to load analytics data. Check configuration.</p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-2 gap-3 mb-4">
                {/* Active Users Card */}
                <div className="bg-white shadow rounded-lg p-3 flex justify-between items-center">
                    <div>
                        <h2 className="text-xs font-semibold text-gray-500">ACTIVE USERS</h2>
                        <p className="text-xl font-bold">{analyticsData.activeUsers || 0}</p>
                    </div>
                    <div className="bg-blue-100 p-2 rounded-full">
                        <FaUsers className="text-blue-500 text-sm" />
                    </div>
                </div>

                {/* Avg. Session Duration */}
                <div className="bg-white shadow rounded-lg p-3 flex justify-between items-center">
                    <div>
                        <h2 className="text-xs font-semibold text-gray-500">AVG. SESSION</h2>
                        <p className="text-xl font-bold">{analyticsData.avgSessionDuration || 0}s</p>
                    </div>
                    <div className="bg-green-100 p-2 rounded-full">
                        <FaDesktop className="text-green-500 text-sm" />
                    </div>
                </div>

                {/* Total Users Card */}
                <div className="bg-white shadow rounded-lg p-3 flex justify-between items-center">
                    <div>
                        <h2 className="text-xs font-semibold text-gray-500">USERS</h2>
                        <p className="text-xl font-bold">{totalUsers}</p>
                    </div>
                    <div className="bg-purple-100 p-2 rounded-full">
                        <FaCheck className="text-purple-500 text-sm" />
                    </div>
                </div>

                {/* Content Views */}
                <div className="bg-white shadow rounded-lg p-3 flex justify-between items-center">
                    <div>
                        <h2 className="text-xs font-semibold text-gray-500">TOP VIEWS</h2>
                        <p className="text-xl font-bold">
                            {topViewedAcademicians && topViewedAcademicians.length > 0 
                                ? topViewedAcademicians[0].total_views 
                                : 0}
                        </p>
                    </div>
                    <div className="bg-yellow-100 p-2 rounded-full">
                        <FaEye className="text-yellow-500 text-sm" />
                    </div>
                </div>
            </div>
        );
    };

    // Top pages component - simplified for mobile
    const TopPages = ({ pages }) => (
        <div className="bg-white shadow rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-base font-semibold">Top Pages</h2>
                <FaFile className="text-indigo-500" />
            </div>
            {pages && pages.length > 0 ? (
                <div className="space-y-2">
                    {/* Show only top 3 pages on mobile */}
                    {pages.slice(0, 3).map((page, index) => (
                        <div key={index} className="border-b pb-2">
                            <div className="flex items-center mb-1">
                                <div className="flex-shrink-0 w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center mr-2">
                                    <span className="text-indigo-500 font-bold text-xs">{index + 1}</span>
                                </div>
                                <p className="font-medium text-xs truncate max-w-[250px]" title={page.title}>
                                    {page.title || 'Untitled Page'}
                                </p>
                            </div>
                            <div className="flex justify-between text-xs pl-7">
                                <span className="text-gray-500 truncate max-w-[200px]">{page.path}</span>
                                <div className="flex items-center">
                                    <FaEye className="w-2.5 h-2.5 text-indigo-500 mr-1" />
                                    <span className="font-medium">{page.views}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex items-center justify-center h-[100px] bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">No page view data available</p>
                </div>
            )}
        </div>
    );

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <div className="text-xs text-gray-500">
                    {gaLoaded ? (
                        <span className="text-green-500">✓ GA connected</span>
                    ) : (
                        <span className="text-yellow-500">⟳ Loading...</span>
                    )}
                </div>
            </div>

            {/* Analytics Summary Cards */}
            {renderAnalyticsSummary()}

            {/* Charts and Data Components */}
            <PageViewsChart pageViewsData={analyticsData?.pageViewsOverTime || []} />
            <TopPages pages={analyticsData?.topPages || []} />
            <TopViewedAcademicians academicians={topViewedAcademicians} />
        </div>
    );
};

export default AdminDashboardComponent_m; 