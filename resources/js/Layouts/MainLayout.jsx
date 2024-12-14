import React, { useState, useEffect } from 'react';
import Sidebar from '../Components/Sidebar';
import MobileSidebar from '../Components/MobileSidebar';
import { Head } from '@inertiajs/react';
import TopMenu from '../Components/TopMenu';

const MainLayout = ({ children, title, isPostgraduate }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar toggle for mobile
    const [isDesktop, setIsDesktop] = useState(false); // Detect if it's desktop view

    // Function to toggle sidebar
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Effect to determine screen size for responsiveness
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsDesktop(true); // lg breakpoint (desktop)
                setIsSidebarOpen(true); // Sidebar always open on desktop
            } else {
                setIsDesktop(false); // Mobile view
                setIsSidebarOpen(false); // Sidebar hidden by default on mobile
            }
        };

        // Run on initial render and on resize
        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar for Desktop */}
            {isDesktop && (
                <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} isPostgraduate={isPostgraduate} />
            )}

            {/* Mobile Sidebar */}
            {!isDesktop && (
                <MobileSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} isPostgraduate={isPostgraduate} />
            )}

            {/* Main Content Area */}
            {isDesktop ? (
                // Desktop-specific content area
                <div
                    className={`flex-1 p-6 transition-all duration-300 ${
                        isSidebarOpen ? 'ml-64' : 'ml-20'
                    }`}
                >
                    <Head title={title} />
                     {/* Top Menu */}
                <TopMenu />
                    <div className="p-4 bg-white rounded-lg shadow">
                        <h1 className="text-2xl font-semibold mb-4">{title}</h1>
                        {children}
                    </div>
                </div>
            ) : (
                // Mobile-specific content area
                <div
                    className={`flex-1 p-6 transition-all duration-300 ${
                        isSidebarOpen ? 'ml-64' : 'ml-0'
                    }`}
                >
                    <Head title={title} />
                    <div className="p-4 bg-white rounded-lg shadow">
                        <h1 className="text-2xl font-semibold mb-4">{title}</h1>
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MainLayout;
