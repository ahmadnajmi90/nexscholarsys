import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import IconSidebar from '../Components/IconSidebar';
import Sidebar from '../Components/Sidebar';
import MobileSidebar from '../Components/MobileSidebar';
import { Head } from '@inertiajs/react';
import TopMenu from '../Components/TopMenu';
import { FaNewspaper, FaTh, FaStar, FaSearch } from "react-icons/fa";
import { Home, Calendar1, User, FileBadge, Briefcase } from 'lucide-react'; // Modern icons
import { trackPageView } from '../Utils/analytics';
import { Toaster } from 'react-hot-toast';
import NotificationBell from '../Components/Notifications/NotificationBell';

const MainLayout = ({ children, title, TopMenuOpen }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar toggle for mobile
    const [isDesktop, setIsDesktop] = useState(false); // Detect if it's desktop view
    const [activeSection, setActiveSection] = useState('dashboard'); // Active section for new sidebar
    const { url } = usePage(); // Get current URL from Inertia

    // Function to determine active section based on current route
    const getActiveSectionFromRoute = (currentUrl) => {
        const path = currentUrl.toLowerCase();
        
        // Dashboard section
        if (path.includes('/dashboard')) {
            return 'dashboard';
        }
        
        // Features section
        if (path.includes('/ai/matching') || 
            path.includes('/postgraduate-recommendations') || 
            path.includes('/bookmarks') || 
            path.includes('/project-hub')) {
            return 'features';
        }
        
        // Networking section
        if (path.includes('/connections') || 
            path.includes('/postgraduates') || 
            path.includes('/undergraduates') || 
            path.includes('/academicians') || 
            path.includes('/universities')) {
            return 'networking';
        }
        
        // Manage section
        if (path.includes('/grants') || 
            path.includes('/post-grants') || 
            path.includes('/projects') || 
            path.includes('/post-projects') || 
            path.includes('/events') || 
            path.includes('/post-events') || 
            path.includes('/posts') || 
            path.includes('/create-posts')) {
            return 'manage';
        }
        
        // Settings section
        if (path.includes('/profile') || 
            path.includes('/role')) {
            return 'settings';
        }
        
        // Admin routes
        if (path.includes('/roles') || 
            path.includes('/faculty-admins') || 
            path.includes('/admin/profiles') || 
            path.includes('/admin/data-management') ||
            path.includes('/faculty-admin')) {
            return 'dashboard';
        }
        
        // Default to dashboard
        return 'dashboard';
    };

    // Function to toggle sidebar
    const toggleSidebar = () => {
        const newSidebarState = !isSidebarOpen;
        setIsSidebarOpen(newSidebarState);

        // Save the state to localStorage
        localStorage.setItem('isSidebarOpen', newSidebarState);
    };

    // Function to handle section changes
    const handleSectionChange = (section) => {
        setActiveSection(section);
        // Open the sidebar when a section is selected
        if (!isSidebarOpen) {
            setIsSidebarOpen(true);
            localStorage.setItem('isSidebarOpen', 'true');
        }
    };

    // Effect to update active section when URL changes
    useEffect(() => {
        const newActiveSection = getActiveSectionFromRoute(url);
        setActiveSection(newActiveSection);
    }, [url]);

    // Track page views when the URL changes
    useEffect(() => {
        // Add a small delay to ensure both GA has loaded
        // and the document title has been updated by Inertia
        setTimeout(() => {
            // Get the actual title from various sources with fallbacks for SEO URLs
            let pageTitle = title;
            
            // If title is undefined (common with SEO URLs), try to get it from document
            if (pageTitle === undefined) {
                pageTitle = document.title;
                
                // If document title is just the site name, try to extract from URL
                if (pageTitle === 'Nexscholar' || pageTitle.endsWith('- Nexscholar')) {
                    // Extract title from SEO URL if available
                    const urlPath = url.split('/').filter(Boolean);
                    if (urlPath.length > 0) {
                        const lastSegment = urlPath[urlPath.length - 1];
                        // Convert slug to title case: money-matters-how -> Money Matters How
                        pageTitle = lastSegment
                            .split('-')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ');
                    }
                }
            }

            // Pass both URL and explicit title to ensure correct tracking
            trackPageView(url, pageTitle);
        }, 250); // Slightly longer delay to ensure title is updated
    }, [url, title]);

    // Combined effect to handle responsive logic and localStorage with proper precedence
    useEffect(() => {
        const handleResize = () => {
            const isCurrentlyDesktop = window.innerWidth >= 1024;
            setIsDesktop(isCurrentlyDesktop);
            
            if (isCurrentlyDesktop) {
                // Desktop: Load from localStorage or default to true
                const savedSidebarState = localStorage.getItem('isSidebarOpen');
                setIsSidebarOpen(savedSidebarState !== null ? savedSidebarState === 'true' : true);
            } else {
                // Mobile: Always start closed, ignore localStorage
                setIsSidebarOpen(false);
            }
        };

        // Run on initial render and on resize
        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []); // Empty dependencies - runs only once on mount

    // Effect to close sidebar when navigation starts (using Inertia events)
    useEffect(() => {
        // This function will be called whenever a new Inertia visit starts
        const handleStart = () => {
            // Check current screen size at the time of navigation (not stale closure)
            const isCurrentlyDesktop = window.innerWidth >= 1024;
            
            // Only close sidebar on mobile (when not desktop)
            if (!isCurrentlyDesktop) {
                setIsSidebarOpen(false);
            }
        };

        // Set up the event listener on component mount
        const removeListener = router.on('start', handleStart);

        // Return a cleanup function to remove the event listener 
        // when the component unmounts to prevent memory leaks
        return removeListener;
    }, []); // Empty dependencies are safe now since we check screen size directly

    const isActive = (route) => url.startsWith(route); // Check if the current route matches

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Toast notifications */}
            <Toaster 
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    success: {
                        duration: 3000,
                        style: {
                            background: '#22c55e', // Green background for success
                            color: '#fff',
                        },
                    },
                    error: {
                        duration: 4000,
                        style: {
                            background: '#ef4444', // Red background for errors
                            color: '#fff',
                        },
                    },
                }}
            />
            
            {/* New Two-Part Sidebar System for Desktop */}
            {isDesktop && (
                <>
                    <IconSidebar 
                        activeSection={activeSection} 
                        onSectionChange={handleSectionChange} 
                    />
                    <Sidebar 
                        activeSection={activeSection}
                        isOpen={isSidebarOpen} 
                        onToggleSidebar={toggleSidebar} 
                    />
                </>
            )}

            {/* Mobile Sidebar */}
            {!isDesktop && (
                <MobileSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            )}

            {/* Main Content Area */}
            {isDesktop ? (
                // Desktop-specific content area
                <div
                    className={`flex-1 transition-all duration-300 ${
                        isSidebarOpen ? 'ml-80' : 'ml-16'
                    }`}
                >
                    {TopMenuOpen && <TopMenu />}
                    <Head title={title} />
                    <div className="p-4 bg-white rounded-lg shadow">
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-2xl font-semibold pt-2 pl-2">{title}</h1>
                            <div className="flex items-center space-x-4">
                                {/* <NotificationBell /> */}
                            </div>
                        </div>
                        {children}
                    </div>
                </div>
            ) : (
                // Mobile-specific content area
                <div>
                    <Head title={title} />
                    <div className="pb-20">
                        {/* Fixed sidebar toggle button for mobile */}
                        <button
                            className="fixed top-4 right-4 z-50 bg-blue-600 text-white p-3 rounded-md shadow-md lg:hidden"
                            onClick={toggleSidebar}
                        >
                            {isSidebarOpen ? '✕' : '☰'}
                        </button>
                        
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
