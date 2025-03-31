import React, { useEffect, useState } from 'react';
import { FaUsers, FaDesktop, FaChartLine, FaEye, FaCheck, FaBell } from 'react-icons/fa';
import RegisteredUser from './RegisteredUser';

const AdminDashboardComponent = ({ totalUsers, topViewedAcademicians }) => {
    const [gaLoaded, setGaLoaded] = useState(false);
    const [activeUsers, setActiveUsers] = useState(0);
    const [sessionDuration, setSessionDuration] = useState(0);
    const [isGaError, setIsGaError] = useState(false);

    // Function to load Google Analytics scripts
    const loadGoogleAnalytics = () => {
        // Check if GA is already loaded
        if (window.gapi) {
            initializeGA();
            return;
        }

        // Create script element to load the Google Analytics libraries
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/platform.js';
        script.async = true;
        script.onload = initializeGA;
        script.onerror = () => setIsGaError(true);
        document.head.appendChild(script);
    };

    // Initialize Google Analytics
    const initializeGA = () => {
        try {
            window.gapi.load('analytics', () => {
                // Replace with your GA property ID
                const propertyId = 'G-XXXXXXXXXX'; 
                
                // Initialize the Embed API
                window.gapi.analytics.ready(() => {
                    // Auth with a client ID (need to set up properly in GA and GCP)
                    // This is a placeholder - you'll need to configure actual auth
                    try {
                        // Mock data for development/preview
                        setActiveUsers(Math.floor(Math.random() * 15) + 5);
                        setSessionDuration(Math.floor(Math.random() * 120) + 60);
                        setGaLoaded(true);
                    } catch (error) {
                        console.error('GA initialization error:', error);
                        setIsGaError(true);
                    }
                });
            });
        } catch (error) {
            console.error('GA loading error:', error);
            setIsGaError(true);
        }
    };

    useEffect(() => {
        loadGoogleAnalytics();
    }, []);

    // Render Google Analytics charts
    const renderGACharts = () => {
        if (isGaError) {
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
                        <p className="text-3xl font-bold">{activeUsers}</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                        <FaUsers className="text-blue-500 text-xl" />
                    </div>
                </div>

                {/* Avg. Session Duration */}
                <div className="bg-white shadow rounded-lg p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-sm font-semibold text-gray-500">AVG. SESSION</h2>
                        <p className="text-3xl font-bold">{sessionDuration}s</p>
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

            {/* Top Viewed Academicians */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
                <div className="lg:col-span-1">
                    <TopViewedAcademicians academicians={topViewedAcademicians} />
                </div>
                <div className="lg:col-span-2">
                    {/* Placeholder for GA charts that would be populated once GA is properly set up */}
                    <div className="bg-white shadow rounded-lg p-6 h-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Content Performance</h2>
                            <FaBell className="text-indigo-500" />
                        </div>
                        <div className="flex items-center justify-center h-[300px] bg-gray-50 rounded-lg">
                            <div className="text-center p-4">
                                <p className="text-gray-500 mb-2">
                                    Google Analytics chart will be displayed here
                                </p>
                                <p className="text-xs text-gray-400">
                                    Configure your Google Analytics account to show content performance metrics
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardComponent; 