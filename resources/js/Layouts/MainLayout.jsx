import React, { useState, useEffect } from 'react';
import Sidebar from '../Components/Sidebar';
import MobileSidebar from '../Components/MobileSidebar';
import { Head } from '@inertiajs/react';
import TopMenu from '../Components/TopMenu';
import Dashboard_m from "../Components/Dashboard_m"; // Import the mobile view component

const MainLayout = ({ children, title, isPostgraduate, isUndergraduate, isFacultyAdmin }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar toggle for mobile
    const [isDesktop, setIsDesktop] = useState(false); // Detect if it's desktop view

    // Function to toggle sidebar
    const toggleSidebar = () => {
        const newSidebarState = !isSidebarOpen;
        setIsSidebarOpen(newSidebarState);

        // Save the state to localStorage
        localStorage.setItem('isSidebarOpen', newSidebarState);
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

    // Effect to load the sidebar state from localStorage
    useEffect(() => {
        const savedSidebarState = localStorage.getItem('isSidebarOpen');
        if (savedSidebarState !== null) {
            setIsSidebarOpen(savedSidebarState === 'true');
        }
    }, []); // This runs only on the initial render

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar for Desktop */}
            {isDesktop && (
                <Sidebar
                    isOpen={isSidebarOpen}
                    toggleSidebar={toggleSidebar}
                    isPostgraduate={isPostgraduate}
                    isUndergraduate={isUndergraduate}
                    isFacultyAdmin={isFacultyAdmin}
                />
            )}

            {/* Mobile Sidebar */}
            {!isDesktop && (
                <MobileSidebar
                    isOpen={isSidebarOpen}
                    toggleSidebar={toggleSidebar}
                    isPostgraduate={isPostgraduate}
                    isUndergraduate={isUndergraduate}
                    isFacultyAdmin={isFacultyAdmin}
                />
            )}

            {/* Main Content Area */}
            {isDesktop ? (
                // Desktop-specific content area
                <div
                    className={`flex-1 p-6 transition-all duration-300 ${
                        isSidebarOpen ? 'ml-64' : 'ml-20'
                    }`}
                >
                    <TopMenu />
                    <Head title={title} />
                    <div className="p-4 bg-white rounded-lg shadow">
                        <h1 className="text-2xl font-semibold mb-4">{title}</h1>
                        {children}
                    </div>
                </div>
            ) : (
                // Mobile-specific content area
                <div
                    // className={`flex-1 p-6 transition-all duration-300 ${
                    //     isSidebarOpen ? 'ml-64' : 'ml-0'
                    // }`}
                >
                    <Head title={title} />
                    <Dashboard_m /> {/* Render the mobile dashboard */}
                </div>
            )}
        </div>
    );
};

export default MainLayout;
