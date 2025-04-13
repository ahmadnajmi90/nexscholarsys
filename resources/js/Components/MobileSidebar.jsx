import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import {
    FaTachometerAlt,
    FaUsers,
    FaHandshake,
    FaChartBar,
    FaCalendarAlt,
    FaPoll,
    FaUser,
    FaCog,
    FaBookOpen,
    FaNewspaper,
    FaFilter,
    FaBookmark,
    FaSearch
} from 'react-icons/fa';
import useRoles from '@/Hooks/useRoles';

const MobileSidebar = () => {
    const { isAdmin, isPostgraduate, isUndergraduate, isFacultyAdmin, isAcademician, canPostEvents, canPostProjects, canPostGrants, canCreateFacultyAdmin, canAssignAbilities } = useRoles();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState({
        networking: false,
        grant: false,
        project: false,
        event: false,
        survey: false,
        profile: false,
    });

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const toggleMenu = (menu) => {
        setMenuOpen((prevState) => ({
            ...prevState,
            [menu]: !prevState[menu],
        }));
    };

    return (
        <>
            {/* Toggle Button - visible below lg */}
            <button
                className="fixed top-4 right-4 z-50 bg-blue-600 text-white p-3 rounded-md shadow-md lg:hidden"
                onClick={toggleSidebar}
            >
                {isSidebarOpen ? '✕' : '☰'}
            </button>

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md z-40 transform transition-transform duration-300 ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0`}
            >
                <div className="p-4 h-full overflow-auto">
                    {/* Header */}
                    <div className="flex items-center mb-6">
                        <a href="/" className="flex items-center space-x-2">
                            <h2 className="text-lg text-blue-600 font-semibold">NexScholar</h2>
                        </a>
                    </div>

                    {/* Navigation Sections */}
                    <nav className="space-y-4">
                        {/* Main Section */}
                        <div>
                            <h3 className="text-gray-500 uppercase text-xs font-bold">Main</h3>
                            <Link
                                href={route('dashboard')}
                                className="flex items-center py-2 px-4 hover:bg-gray-100 rounded"
                            >
                                <FaTachometerAlt className="text-gray-600" />
                                <span className="ml-2">Dashboard</span>
                            </Link>

                            {isFacultyAdmin && (
                                <Link
                                    href={route('faculty-admin.academicians')}
                                    className="flex items-center py-2 px-4 hover:bg-gray-100 rounded"
                                >
                                    <FaTachometerAlt className="text-gray-600" />
                                    <span className="ml-2">Verify Academicians</span>
                                </Link>
                            )}
                        </div>

                        {/* Admin Features Section */}
                        {isAdmin && (
                            <div>
                                <h3 className="text-gray-500 uppercase text-xs font-bold">Admin Features</h3>
                                <Link
                                    href={route('faculty-admins.index')}
                                    className="flex items-center py-2 px-4 hover:bg-gray-100 rounded"
                                >
                                    <FaTachometerAlt className="text-gray-600" />
                                    <span className="ml-2">Create Faculty Admin</span>
                                </Link>
                                <Link
                                    href={route('roles.index')}
                                    className="flex items-center py-2 px-4 hover:bg-gray-100 rounded"
                                >
                                    <FaTachometerAlt className="text-gray-600" />
                                    <span className="ml-2">Assign Abilities</span>
                                </Link>
                            </div>
                        )}

                        {/* Networking Section */}
                        <div>
                            <h3 className="text-gray-500 uppercase text-xs font-bold">Networking</h3>
                            <button
                                onClick={() => toggleMenu('networking')}
                                className="flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded"
                            >
                                <FaUsers className="text-gray-600" />
                                <span className="ml-2">Networking</span>
                                <span className="ml-auto">{menuOpen.networking ? '-' : '+'}</span>
                            </button>
                            {menuOpen.networking && (
                                <div className="ml-6">
                                    <Link href="/postgraduates" className="block py-2 hover:bg-gray-100 rounded">
                                        Postgraduate
                                    </Link>
                                    <Link href="/undergraduates" className="block py-2 hover:bg-gray-100 rounded">
                                        Undergraduate
                                    </Link>
                                    <Link href="/academicians" className="block py-2 hover:bg-gray-100 rounded">
                                        Academician
                                    </Link>
                                    <Link href="/universities" className="block py-2 hover:bg-gray-100 rounded">
                                        University
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Features Section */}
                        <div>
                            <h3 className="text-gray-500 uppercase text-xs font-bold">Features</h3>
                            <Link
                                href={route('supervisor.find')}
                                className="flex items-center py-2 px-4 hover:bg-gray-100 rounded"
                            >
                                <FaSearch className="text-gray-600" />
                                <span className="ml-2">Find Supervisor</span>
                            </Link>
                            <Link
                                href={route('bookmarks.index')}
                                className="flex items-center py-2 px-4 hover:bg-gray-100 rounded"
                            >
                                <FaBookmark className="text-gray-600" />
                                <span className="ml-2">My Bookmarks</span>
                            </Link>
                            <button
                                onClick={() => toggleMenu('grant')}
                                className="flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded"
                            >
                                <FaHandshake className="text-gray-600" />
                                <span className="ml-2">Grant</span>
                                <span className="ml-auto">{menuOpen.grant ? '-' : '+'}</span>
                            </button>
                            {menuOpen.grant && (
                                <div className="ml-6">
                                    <Link href="/grants" className="block py-2 hover:bg-gray-100 rounded">
                                        View Grant
                                    </Link>
                                    {canPostGrants && (
                                        <Link
                                            href={route('post-grants.index')}
                                            className="block py-2 hover:bg-gray-100 rounded"
                                        >
                                            Manage Grants
                                        </Link>
                                    )}
                                </div>
                            )}
                            <button
                                onClick={() => toggleMenu('project')}
                                className="flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded"
                            >
                                <FaChartBar className="text-gray-600" />
                                <span className="ml-2">Project</span>
                                <span className="ml-auto">{menuOpen.project ? '-' : '+'}</span>
                            </button>
                            {menuOpen.project && (
                                <div className="ml-6">
                                    <Link href="/projects" className="block py-2 hover:bg-gray-100 rounded">
                                        View project
                                    </Link>
                                    {canPostProjects && (
                                        <Link
                                            href={route('post-projects.index')}
                                            className="block py-2 hover:bg-gray-100 rounded"
                                        >
                                            Manage project
                                        </Link>
                                    )}
                                </div>
                            )}
                            <button
                                onClick={() => toggleMenu('event')}
                                className="flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded"
                            >
                                <FaCalendarAlt className="text-gray-600" />
                                <span className="ml-2">Event</span>
                                <span className="ml-auto">{menuOpen.event ? '-' : '+'}</span>
                            </button>
                            {menuOpen.event && (
                                <div className="ml-6">
                                    <Link href="/events" className="block py-2 hover:bg-gray-100 rounded">
                                        View event
                                    </Link>
                                    {canPostEvents && (
                                        <Link
                                            href={route('post-events.index')}
                                            className="block py-2 hover:bg-gray-100 rounded"
                                        >
                                            Manage event
                                        </Link>
                                    )}
                                </div>
                            )}
                            <button
                                onClick={() => toggleMenu('post')}
                                className="flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded"
                            >
                                <FaNewspaper className="text-gray-600" />
                                <span className="ml-2">Post</span>
                                <span className="ml-auto">{menuOpen.post ? '-' : '+'}</span>
                            </button>
                            {menuOpen.post && (
                                <div className="ml-6">
                                    <Link href="/posts" className="block py-2 hover:bg-gray-100 rounded">
                                        View post
                                    </Link>
                                    <Link
                                        href={route('create-posts.index')}
                                        className="block py-2 hover:bg-gray-100 rounded"
                                    >
                                        Manage post
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Survey Section */}
                        <div>
                            <h3 className="text-gray-500 uppercase text-xs font-bold">Survey</h3>
                            <button
                                onClick={() => toggleMenu('survey')}
                                className="flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded"
                            >
                                <FaPoll className="text-gray-600" />
                                <span className="ml-2">Survey</span>
                                <span className="ml-auto">{menuOpen.survey ? '-' : '+'}</span>
                            </button>
                            {menuOpen.survey && (
                                <div className="ml-6">
                                    <a href="https://docs.google.com/forms/d/e/1FAIpQLSdPX9CXPOAZLedNsqA9iyMs5ZkAOACol4_wBVN2LPdxbnsJeg/viewform" className="block py-2 hover:bg-gray-100 rounded" target="_blank" rel="noopener noreferrer">
                                        Free Survey
                                    </a>
                                    {/* <Link href="/survey/with-token" className="block py-2 hover:bg-gray-100 rounded">
                                        Survey With Token
                                    </Link> */}
                                </div>
                            )}
                        </div>

                        {/* Profile Section */}
                        <div>
                            <h3 className="text-gray-500 uppercase text-xs font-bold">Settings</h3>
                            <button
                                onClick={() => toggleMenu('profile')}
                                className="flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded"
                            >
                                <FaUser className="text-gray-600" />
                                <span className="ml-2">Profile</span>
                                <span className="ml-auto">{menuOpen.profile ? '-' : '+'}</span>
                            </button>
                            {menuOpen.profile && (
                                <div className="ml-6">
                                    <Link
                                        href={route('profile.edit')}
                                        className="block py-2 hover:bg-gray-100 rounded"
                                    >
                                        General Account Setting
                                    </Link>
                                    <Link
                                        href={route('role.edit')}
                                        className="block py-2 hover:bg-gray-100 rounded"
                                    >
                                        Personal Information
                                    </Link>
                                </div>
                            )}
                        </div>

                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="flex items-center py-2 px-4 hover:bg-gray-100 rounded"
                        >
                            <FaCog className="text-gray-600" />
                            <span className="ml-2">Log Out</span>
                        </Link>
                    </nav>
                </div>
            </div>

            {/* Overlay for Mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}
        </>
    );
};

export default MobileSidebar;
