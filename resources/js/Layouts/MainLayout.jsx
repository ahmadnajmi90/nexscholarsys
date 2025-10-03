import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import IconSidebar from '../Components/IconSidebar';
import Sidebar from '../Components/Sidebar';
import MobileSidebar from '../Components/MobileSidebar';
import { Head } from '@inertiajs/react';
import TopMenu from '../Components/TopMenu';
import Dropdown from '../Components/Dropdown';
import { Home, Calendar1, User, FileBadge, Briefcase, Settings, User2, LogOut, DollarSign, ClipboardList } from 'lucide-react'; // Modern icons
import { trackPageView } from '../Utils/analytics';
import { Toaster } from 'react-hot-toast';
import NotificationBell from '../Components/Notifications/NotificationBell';
import ForceTermsModal from '../Components/ForceTermsModal';
import TutorialModal from '../Components/Tutorial/TutorialModal';
import StickyBanner from '../Components/ui/StickyBanner';

const MainLayout = ({ children, title, TopMenuOpen }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar toggle for mobile
    const [isDesktop, setIsDesktop] = useState(false); // Detect if it's desktop view
    const [activeSection, setActiveSection] = useState('dashboard'); // Active section for new sidebar
    const [showTermsModal, setShowTermsModal] = useState(false); // Terms agreement modal
    const [showTutorialModal, setShowTutorialModal] = useState(false); // Tutorial modal
    const { url } = usePage(); // Get current URL from Inertia
    const { auth } = usePage().props; // Get current URL and auth from Inertia

    // Helper function to get profile picture URL
    const getProfilePicture = (user) => {
        const profile = user.academician || user.postgraduate || user.undergraduate;
        return profile?.profile_picture ? `/storage/${profile.profile_picture}` : "/storage/profile_pictures/default.jpg";
    };

    // Function to determine active section based on current route
    const getActiveSectionFromRoute = (currentUrl) => {
        const path = currentUrl.toLowerCase();
        
        // Dashboard section
        if (path.includes('/dashboard')) {
            return 'dashboard';
        }
        
        // Features section
        if (path.includes('/ai-matching') ||
            path.includes('/postgraduate-recommendations') ||
            path.includes('/bookmarks') ||
            path.includes('/project-hub') ||
            path.includes('/my-supervisor') ||
            path.includes('/supervisor-dashboard')) {
            return 'features';
        }
        
        // Networking section
        if (path.includes('/connections') ||
            path.includes('/postgraduates') ||
            path.includes('/undergraduates') ||
            path.includes('/academicians') ||
            path.includes('/universities') ||
            path.includes('/messaging')) {
            return 'networking';
        }
        
        // Manage section
        if (path.includes('/funding') || 
            path.includes('/funding.admin') || 
            path.includes('/projects') || 
            path.includes('/post-projects') || 
            path.includes('/events') || 
            path.includes('/post-events') || 
            path.includes('/posts') || 
            path.includes('/create-posts')) {
            return 'content';
        }
        
        // Admin routes - check these first to avoid conflicts
        if (path.includes('/admin/roles') ||
            path.includes('/admin/faculty-admins') ||
            path.includes('/admin/profiles') ||
            path.includes('/admin/data-management') ||
            path.includes('/faculty-admin/')) {
            return 'dashboard'; // Don't highlight any section for admin routes
        }

        // Settings section - user profile routes only
        if (path.includes('/profile') ||
            path.includes('/role')) {
            return 'settings';
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

    // Check if user needs to agree to terms
    useEffect(() => {
        if (auth?.user && auth.user.agreed_to_terms === false) {
            setShowTermsModal(true);
        }
    }, [auth]);

    // Check if user needs to see tutorial (after terms are agreed)
    useEffect(() => {
        const shouldShowTutorial =
            auth?.user &&
            auth.user.agreed_to_terms === true &&
            !auth.user.has_seen_tutorial && // Check if falsy (0, false, null)
            !url.includes('/role'); // Skip on profile generation routes

        if (shouldShowTutorial) {
            // Small delay to ensure terms modal is closed first
            const timer = setTimeout(() => {
                setShowTutorialModal(true);
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [auth, url]);

    const isActive = (route) => url.startsWith(route); // Check if the current route matches

    // Banner configuration
    const bannerConfig = {
        message: "Messaging features are now available! Feel free to try them out. Any feedback or bugs can be reported through the provided feedback form.",
        type: "info", // 'info', 'warning', 'success', 'error'
        dismissible: true,
        persistKey: "messaging-launch-banner-2025", // Change this key when you want to show the banner again
        hideOnScroll: false // Set to true if you want banner to hide on scroll
    };

    const feedbackFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSdPX9CXPOAZLedNsqA9iyMs5ZkAOACol4_wBVN2LPdxbnsJeg/viewform';

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
            
            {/* Sticky Banner */}
            <StickyBanner 
                message={bannerConfig.message}
                type={bannerConfig.type}
                dismissible={bannerConfig.dismissible}
                persistKey={bannerConfig.persistKey}
                hideOnScroll={bannerConfig.hideOnScroll}
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
                    <div className={`${!title ? 'px-4 py-2' : 'p-4'} bg-white shadow min-h-screen`}>
                        {title && (
                            // --- START: MODIFIED HEADER ---
                            <div className="mb-4">
                                {/* Header content with padding */}
                                <div className="flex justify-between items-center pb-4">
                                    <h1 className="text-2xl font-semibold">{title}</h1>

                                    <div className="flex items-center space-x-4">
                                        {/* <NotificationBell /> */}
                                        
                                        {/* Profile Dropdown */}
                                        <Dropdown>
                                            <Dropdown.Trigger>
                                                <img
                                                    src={getProfilePicture(auth.user)}
                                                    alt="Profile"
                                                    className="h-10 w-10 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-indigo-400 transition"
                                                />
                                            </Dropdown.Trigger>

                                            <Dropdown.Content align="right" width="48">
                                                <div className="px-4 py-3">
                                                    <span className="block text-sm font-medium text-gray-900 truncate">{auth.user.full_name}</span>
                                                    <span className="block text-sm text-gray-500 truncate">{auth.user.email}</span>
                                                </div>
                                                <div className="border-t border-gray-200"></div>
                                                <Dropdown.Link href={route('profile.edit')}>
                                                    <Settings className="w-4 h-4 mr-2" />
                                                    General Account Setting
                                                </Dropdown.Link>
                                                <Dropdown.Link href={route('role.edit')}>
                                                    <User2 className="w-4 h-4 mr-2" />
                                                    Personal Information
                                                </Dropdown.Link>
                                                <div className="border-t border-gray-200"></div>
                                                <Dropdown.Link href={route('logout')} method="post" as="button" className="w-full text-left text-red-600 hover:bg-red-50">
                                                    <LogOut className="w-4 h-4 mr-2" />
                                                    Log Out
                                                </Dropdown.Link>
                                            </Dropdown.Content>
                                        </Dropdown>
                                    </div>
                                </div>
                                
                                {/* Full-width border line */}
                                <div className="border-b border-gray-200 -mx-4"></div>
                            </div>
                            // --- END: MODIFIED HEADER ---
                        )}
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
                            className="fixed top-6 right-4 z-40 bg-indigo-600 text-white p-3 rounded-md shadow-md lg:hidden"
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
                            <Link href="/events" className={`flex flex-col items-center ${isActive('/event') ? 'text-indigo-500' : 'text-gray-500'}`}>
                                <Calendar1 className="w-6 h-6 stroke-current" />
                                <span className="text-xs font-medium">Event</span>
                            </Link>

                            {/* Project */}
                            <Link href="/projects" className={`flex flex-col items-center ${isActive('/project') ? 'text-indigo-500' : 'text-gray-500'}`}>
                                <Briefcase className="w-6 h-6 stroke-current" />
                                <span className="text-xs font-medium">Project</span>
                            </Link>

                            {/* Home (Floating Center Button) */}
                            <div className="absolute -top-6 w-14 h-14 flex items-center justify-center bg-indigo-500 rounded-full shadow-lg border-4 border-white">
                                <Link href="/dashboard">
                                    <Home className="w-7 h-7 stroke-white stroke-[1.5]" />
                                </Link>
                            </div>

                            {/* fUNDING */}
                            <Link href="/funding" className={`flex flex-col items-center ${isActive('/funding') ? 'text-indigo-500' : 'text-gray-500'}`}>
                                <DollarSign className="w-6 h-6 stroke-current" />
                                <span className="text-xs font-medium">Funding</span>
                            </Link>

                            {/* Profile */}
                            <Link href="/role" className={`flex flex-col items-center ${isActive('/role') ? 'text-indigo-500' : 'text-gray-500'}`}>
                                <User className="w-6 h-6 stroke-current" />
                                <span className="text-xs font-medium">Profile</span>
                            </Link>
                        </div>
                    </div>
                </div>


            )}

            {/* Feedback Form Bubble */}
            <a
                href={feedbackFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open feedback form"
                className="fixed z-50 flex items-center gap-3 right-4 bottom-24 md:bottom-10 md:right-8 group"
            >
                <span className="pointer-events-none rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-focus-within:opacity-100 group-focus-within:translate-x-0 transition-all duration-200">
                    Feedback Form
                </span>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-xl transition-transform duration-200 group-hover:scale-105 group-focus-within:scale-105">
                    <ClipboardList className="h-6 w-6" />
                </div>
            </a>

            {/* Force Terms Agreement Modal */}
            <ForceTermsModal show={showTermsModal} />

            {/* Tutorial Modal */}
            <TutorialModal
                show={showTutorialModal}
                onClose={() => setShowTutorialModal(false)}
            />
        </div>
    );
};

export default MainLayout;
