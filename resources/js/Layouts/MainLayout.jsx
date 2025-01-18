import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import Sidebar from '../Components/Sidebar';
import MobileSidebar from '../Components/MobileSidebar';
import { Head } from '@inertiajs/react';
import TopMenu from '../Components/TopMenu';
import { FaNewspaper, FaTh, FaStar, FaSearch } from "react-icons/fa";

const MainLayout = ({ children, title }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar toggle for mobile
    const [isDesktop, setIsDesktop] = useState(false); // Detect if it's desktop view
    const { url } = usePage(); // Get current URL from Inertia

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
            setIsDesktop(window.innerWidth >= 1024);
            if (window.innerWidth >= 1024) {
                setIsSidebarOpen(true); // Sidebar always open on desktop
            } else {
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

    const isActive = (route) => url.startsWith(route); // Check if the current route matches

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar for Desktop */}
            {isDesktop && (
                <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            )}

            {/* Mobile Sidebar */}
            {!isDesktop && (
                <MobileSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
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
                        <h1 className="text-2xl font-semibold mb-4 pt-2 pl-2">{title}</h1>
                        {children}
                    </div>
                </div>
            ) : (
                // Mobile-specific content area
                <div>
                    <Head title={title} />
                    {children}

                    {/* Bottom Navigation Bar */}
                    <div className="bg-white fixed bottom-0 w-full border-t border-gray-200 flex">
                        <Link
                            href="/dashboard"
                            className={`flex flex-grow items-center justify-center p-2 ${
                                isActive('/dashboard') ? 'text-indigo-500' : 'text-gray-500'
                            }`}
                        >
                            <div className="text-center">
                                <FaNewspaper className="text-3xl" />
                                <span className="block text-xs leading-none">Home</span>
                            </div>
                        </Link>
                        <Link
                            href="/event"
                            className={`flex flex-grow items-center justify-center p-2 ${
                                isActive('/event') ? 'text-indigo-500' : 'text-gray-500'
                            }`}
                        >
                            <div className="text-center">
                                <FaTh className="text-3xl" />
                                <span className="block text-xs leading-none">Event</span>
                            </div>
                        </Link>
                        <Link
                            href="#"
                            className={`flex flex-grow items-center justify-center p-2 ${
                                isActive('#') ? 'text-indigo-500' : 'text-gray-500'
                            }`}
                        >
                            <div className="text-center">
                                <FaStar className="text-3xl" />
                                <span className="block text-xs leading-none">Inbox</span>
                            </div>
                        </Link>
                        <Link
                            href={route('role.edit')}
                            className={`flex flex-grow items-center justify-center p-2 ${
                                isActive(route('role.edit')) ? 'text-indigo-500' : 'text-gray-500'
                            }`}
                        >
                            <div className="text-center">
                                <FaSearch className="text-3xl" />
                                <span className="block text-xs leading-none">Profile</span>
                            </div>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MainLayout;
