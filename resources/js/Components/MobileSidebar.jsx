import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home, Sparkles, Users, FolderOpen, Settings, ChevronLeft,
    GraduationCap, LayoutGrid, Shield, Calendar,
    FileText, ClipboardList, LogOut, Bookmark, Building2, Database, User2, BookUser, Library, Building, DollarSign,
    MessageSquare, UserCheck, School, FolderKanban, LayoutDashboard, Map
} from 'lucide-react';
import useRoles from '@/Hooks/useRoles';
import BetaBadge from '@/Components/BetaBadge';

const MobileSidebar = ({ isOpen, toggleSidebar }) => {
    const { isAdmin, isPostgraduate, isUndergraduate, isFacultyAdmin, isAcademician, canPostEvents, canPostProjects, canPostGrants, canCreatePosts, canCreateFacultyAdmin, canAssignAbilities } = useRoles();
    const { auth, pendingRequestCount } = usePage().props;
    const [menuHistory, setMenuHistory] = useState(['main']);
    const activeMenu = menuHistory[menuHistory.length - 1];

    // --- NAVIGATION STRUCTURE ---
    const navigationData = {
        main: {
            title: 'NexScholar',
            items: [
                { id: 'dashboard', label: 'Dashboard', icon: Home },
                { id: 'features', label: 'Features', icon: Sparkles },
                { id: 'networking', label: 'Networking', icon: Users },
                { id: 'manage', label: 'Manage', icon: FolderOpen },
                { id: 'survey', label: 'Survey', icon: ClipboardList },
                { id: 'settings', label: 'Settings', icon: Settings },
            ]
        },
        dashboard: {
            title: 'Dashboard',
            items: [
                { label: 'Dashboard Overview', href: route('dashboard'), icon: Home },
                // Faculty Admin items
                ...(isFacultyAdmin ? [
                    { label: 'Verify Academicians', href: route('faculty-admin.academicians'), icon: Shield },
                    { label: 'Academicians Directory', href: route('faculty-admin.directory'), icon: Users },
                ] : []),
                // Admin items
                ...(isAdmin ? [
                    { label: 'Faculty Admin', href: route('faculty-admins.index'), icon: Building2 },
                    { label: 'Roles & Permissions', href: route('roles.index'), icon: Settings },
                    { label: 'Profile Management', href: route('admin.profiles.index'), icon: Users },
                    { label: 'Data Management', href: route('admin.data-management.index'), icon: Database },
                ] : []),
            ]
        },
        features: {
            title: 'Features',
            items: [
                { label: 'AI Matching', href: route('ai.matching.index'), icon: Sparkles, beta: true },
                ...(isAdmin ? [{ label: 'Network Map', href: route('network.map'), icon: Map }] : []),
                { label: 'Postgraduate Recommendations', href: route('postgraduate-recommendations.index'), icon: GraduationCap, beta: true },
                { label: 'My Bookmarks', href: route('bookmarks.index'), icon: Bookmark },
                ...(isPostgraduate ? [{ label: 'My Supervisor', href: route('supervision.student.index'), icon: School, beta: true }] : []),
                ...(isAcademician ? [{ label: 'Supervisor Dashboard', href: route('supervision.supervisor.index'), icon: LayoutDashboard, beta: true }] : []),
                { label: 'NexLab', href: route('project-hub.index'), icon: FolderKanban, beta: true },
            ]
        },
        networking: {
            title: 'Networking',
            items: [
                { label: 'My Network', href: route('connections.index'), icon: Users, badge: pendingRequestCount },
                { label: 'Messages', href: route('messaging.inbox'), icon: MessageSquare, beta: true },
                { label: 'Postgraduate', href: '/postgraduates', icon: GraduationCap },
                { label: 'Undergraduate', href: '/undergraduates', icon: BookUser },
                { label: 'Academician', href: '/academicians', icon: Library },
                { label: 'University', href: '/universities', icon: Building },
            ]
        },
        manage: {
            title: 'Manage',
            items: [
                // Grant Management
                { label: 'View Funding', href: '/funding', icon: DollarSign },
                ...(canPostGrants ? [{ label: 'Manage Funding', href: route('funding.admin.index'), icon: DollarSign }] : []),
                // Project Management
                { label: 'View Project', href: '/projects', icon: FolderOpen },
                ...(canPostProjects ? [{ label: 'Manage Project', href: route('post-projects.index'), icon: FolderOpen }] : []),
                // Event Management
                { label: 'View Event', href: '/events', icon: Calendar },
                ...(canPostEvents ? [{ label: 'Manage Event', href: route('post-events.index'), icon: Calendar }] : []),
                // Post Management
                { label: 'View Post', href: '/posts', icon: FileText },
                ...(canCreatePosts ? [{ label: 'Manage Post', href: route('create-posts.index'), icon: FileText }] : []),
            ]
        },
        survey: {
            title: 'Survey',
            items: [
                { label: 'Free Survey', href: 'https://docs.google.com/forms/d/e/1FAIpQLSdPX9CXPOAZLedNsqA9iyMs5ZkAOACol4_wBVN2LPdxbnsJeg/viewform', icon: ClipboardList, external: true },
            ]
        },
        settings: {
            title: 'Settings',
            items: [
                { label: 'General Account Setting', href: route('profile.edit'), icon: Settings },
                { label: 'Personal Information', href: route('role.edit'), icon: User2 },
                { label: 'Log Out', href: route('logout'), method: 'post', as: 'button', icon: LogOut },
            ]
        },
    };

    const handleMenuClick = (menuId) => {
        setMenuHistory([...menuHistory, menuId]);
    };

    const handleBack = () => {
        setMenuHistory(menuHistory.slice(0, -1));
    };

    const animationVariants = {
        enter: (direction) => ({
            x: direction > 0 ? '100%' : '-100%',
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? '100%' : '-100%',
            opacity: 0
        })
    };

    const currentMenuData = navigationData[activeMenu];

    return (
        <>
            <div className={`fixed top-0 left-0 h-full w-64 shadow-lg z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} ${activeMenu === 'main' ? 'bg-indigo-700' : 'bg-white'}`}>
                <div className="flex flex-col h-full overflow-hidden">
                    {/* Static Header */}
                    <div className={`flex items-center p-4 border-b ${activeMenu === 'main' ? 'bg-indigo-800 border-indigo-600' : 'bg-gray-50 border-gray-200'}`}>
                        {activeMenu !== 'main' && (
                                <button
                                onClick={handleBack} 
                                className={`p-2 mr-2 rounded-md transition-colors ${activeMenu === 'main' ? 'hover:bg-indigo-600 text-white' : 'hover:bg-gray-200 text-gray-700'}`}
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                        )}
                        <h3 className={`text-lg font-semibold ${activeMenu === 'main' ? 'text-white ml-2' : 'text-gray-800'}`}>{currentMenuData.title}</h3>
                    </div>

                    {/* Animated Content */}
                    <div className="flex-1 overflow-hidden relative">
                        <AnimatePresence initial={false}>
                            <motion.div
                                key={activeMenu}
                                custom={1}
                                variants={animationVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                                className="absolute inset-0"
                            >
                                {/* Menu Items */}
                                <nav className="h-full overflow-y-auto p-4 space-y-1">
                                    {currentMenuData.items.map((item, index) => {
                                        const Icon = item.icon;

                                        if (item.href) { // It's a link
                                            const linkContent = (
                                                <div className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                                                    activeMenu === 'main' 
                                                        ? 'hover:bg-indigo-600' 
                                                        : 'hover:bg-gray-100'
                                                }`}>
                                                    <span className={`flex items-center ${
                                                        activeMenu === 'main' ? 'text-white' : 'text-gray-700'
                                                    }`}>
                                                        {Icon && <Icon className={`w-5 h-5 mr-3 ${
                                                            activeMenu === 'main' ? 'text-indigo-200' : 'text-gray-600'
                                                        }`} />}
                                                        {item.label}
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        {item.badge > 0 && (
                                                            <span className="bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                                                {item.badge}
                                                            </span>
                                                        )}
                                                        {item.beta && <BetaBadge variant="inline" />}
                                                    </div>
                                                </div>
                                            );

                                            if (item.external) {
                                                return (
                                                    <a 
                                                        key={index} 
                                                        href={item.href} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="block"
                                                    >
                                                        {linkContent}
                                                    </a>
                                                );
                                            } else {
                                                return (
                                        <Link
                                                        key={index} 
                                                        href={item.href} 
                                                        method={item.method} 
                                                        as={item.as || 'a'} 
                                                        className="block"
                                                    >
                                                        {linkContent}
                                        </Link>
                                                );
                                            }
                                        } else { // It's a button to open a sub-menu
                                            return (
                            <button
                                                    key={index} 
                                                    onClick={() => handleMenuClick(item.id)} 
                                                    className={`w-full flex items-center p-3 rounded-lg transition-colors text-left ${
                                                        activeMenu === 'main' 
                                                            ? 'hover:bg-indigo-600' 
                                                            : 'hover:bg-gray-100'
                                                    }`}
                                                >
                                                    {Icon && <Icon className={`w-5 h-5 mr-3 ${
                                                        activeMenu === 'main' ? 'text-indigo-200' : 'text-gray-600'
                                                    }`} />}
                                                    <span className={activeMenu === 'main' ? 'text-white' : 'text-gray-700'}>
                                                        {item.label}
                                                    </span>
                            </button>
                                            );
                                        }
                                    })}
                                </nav>
                            </motion.div>
                        </AnimatePresence>
                        </div>
                </div>
            </div>

            {/* Overlay for Mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40" 
                    onClick={toggleSidebar}
                />
            )}
        </>
    );
};

export default MobileSidebar;
