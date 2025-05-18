import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import Sidebar from '../Components/Sidebar';
import MobileSidebar from '../Components/MobileSidebar';
import { Head } from '@inertiajs/react';
import TopMenu from '../Components/TopMenu';
import { FaNewspaper, FaTh, FaStar, FaSearch } from "react-icons/fa";
import { Home, Calendar1, User, FileBadge, Briefcase } from 'lucide-react'; // Modern icons
import { trackPageView } from '../Utils/analytics';

const MainLayout = ({ children, title, TopMenuOpen }) => {
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

    // Track page views when the URL changes
    useEffect(() => {
        // Add a small delay to ensure GA has fully loaded
        setTimeout(() => {
            trackPageView(url);
        }, 100);
    }, [url]);

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
                    className={`flex-1 p-6 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'
                        }`}
                >
                    {TopMenuOpen && <TopMenu />}
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
                    <div className="pb-20">
                        {children}
                    </div>

                    {/* Bottom Navigation Bar */}
                    <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 rounded-t-3xl shadow-lg">
                        <div className="flex justify-around items-center relative py-3">
                            {/* Event */}
                            <Link href="/events" className={`flex flex-col items-center ${isActive('/event') ? 'text-blue-500' : 'text-gray-500'}`}>
                                <Calendar1 className="w-6 h-6 stroke-current" />
                                <span className="text-xs font-medium">Event</span>
                            </Link>

                            {/* Project */}
                            <Link href="/projects" className={`flex flex-col items-center ${isActive('/project') ? 'text-blue-500' : 'text-gray-500'}`}>
                                <Briefcase className="w-6 h-6 stroke-current" />
                                <span className="text-xs font-medium">Project</span>
                            </Link>

                            {/* Home (Floating Center Button) */}
                            <div className="absolute -top-6 w-14 h-14 flex items-center justify-center bg-blue-500 rounded-full shadow-lg border-4 border-white">
                                <Link href="/dashboard">
                                    <Home className="w-7 h-7 stroke-white stroke-[1.5]" />
                                </Link>
                            </div>

                            {/* Grant */}
                            <Link href="/grants" className={`flex flex-col items-center ${isActive('/grant') ? 'text-blue-500' : 'text-gray-500'}`}>
                                <FileBadge className="w-6 h-6 stroke-current" />
                                <span className="text-xs font-medium">Grant</span>
                            </Link>

                            {/* Profile */}
                            <Link href="/role" className={`flex flex-col items-center ${isActive('/role') ? 'text-blue-500' : 'text-gray-500'}`}>
                                <User className="w-6 h-6 stroke-current" />
                                <span className="text-xs font-medium">Profile</span>
                            </Link>
                        </div>
                    </div>
                </div>


            )}
        </div>
    );
};

export default MainLayout;
