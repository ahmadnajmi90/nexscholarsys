import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    FaTachometerAlt,
    FaNewspaper,
    FaUsers,
    FaBook,
    FaSearch,
    FaHandshake,
    FaUniversity,
    FaChartBar,
    FaCalendarAlt,
    FaPoll,
    FaUser,
    FaCog,
    FaBookReader,
    FaBookOpen,
} from 'react-icons/fa';

const Sidebar = ({ isOpen, toggleSidebar, isPostgraduate }) => {
    const user = usePage().props.auth.user;

    const [menuOpen, setMenuOpen] = useState({
        networking: false,
        journal: false,
        grant: false,
        project: false,
        event: false,
        survey: false,
        workspace: false,
        profile: false, // Added profile toggle state
    });

    const toggleMenu = (menu) => {
        setMenuOpen((prevState) => ({
            ...prevState,
            [menu]: !prevState[menu],
        }));
    };

    return (
        <div className={`bg-white h-full fixed z-10 transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}>
            {/* Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="absolute top-4 right-[-14px] w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
            >
                {isOpen ? '<' : '>'}
            </button>



            <div className="p-4 h-full overflow-auto">

                <div className="flex items-center mb-6">
                    <a href="/" className="flex items-center space-x-2">
                        <h2 className={`ml-2 text-lg text-blue-600 font-semibold ${!isOpen && 'hidden'}`}>Nexscholar</h2>
                    </a>
                </div>

                {/* Navigation Sections */}
                <nav className="space-y-4">
                    {/* Main Section */}
                    <div>
                        <h3 className={`text-gray-500 uppercase text-xs font-bold ${!isOpen && 'hidden'}`}>Main</h3>
                        <Link href={route('dashboard')} className="flex items-center py-2 px-4 hover:bg-gray-100 rounded">
                            <FaTachometerAlt className="text-gray-600" />
                            <span className={`ml-2 ${!isOpen && 'hidden'}`}>Dashboard</span>
                        </Link>


                    </div>

                    {/* Networking Section */}
                    <div>
                        <h3 className={`text-gray-500 uppercase text-xs font-bold ${!isOpen && 'hidden'}`}>Networking</h3>
                        <button
                            onClick={() => toggleMenu('networking')}
                            className="flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded"
                        >
                            <FaUsers className="text-gray-600" />
                            <span className={`ml-2 ${!isOpen && 'hidden'}`}>Networking</span>
                            {isOpen && <span className="ml-auto">{menuOpen.networking ? '-' : '+'}</span>}
                        </button>
                        {menuOpen.networking && (
                            <div className={`${!isOpen && 'hidden'} ml-6`}>
                                <Link href="/postgraduates" className="block py-2 hover:bg-gray-100 rounded">Postgraduate</Link>
                                <Link href="/undergraduates" className="block py-2 hover:bg-gray-100 rounded">Undergraduate</Link>
                                <Link href="/academicians" className="block py-2 hover:bg-gray-100 rounded">Academician</Link>
                                {/* <Link href="#" className="block py-2 hover:bg-gray-100 rounded">Industry</Link> */}
                            </div>
                        )}
                    </div>

                    {/*Researeh*/}
                    <div>
                        <h3 className={`text-gray-500 uppercase text-xs font-bold ${!isOpen && 'hidden'}`}>Features</h3>

                           <button
                            onClick={() => toggleMenu('grant')}
                            className="flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded"
                        >
                            <FaHandshake className="text-gray-600" />
                            <span className={`ml-2 ${!isOpen && 'hidden'}`}>Grant</span>
                            {isOpen && <span className="ml-auto">{menuOpen.grant ? '-' : '+'}</span>}
                        </button>
                        {menuOpen.grant && (
                            <div className={`${!isOpen && 'hidden'} ml-6`}>
                                <Link href="/grant" className="block py-2 hover:bg-gray-100 rounded">View Grant</Link>
                                {!isPostgraduate && (
                                <Link href={route('post-grants.index')} className="block py-2 hover:bg-gray-100 rounded">Manage Grants
                                </Link>)}
                                {/* <Link href="#" className="block py-2 hover:bg-gray-100 rounded">Sponsorship</Link>
                                <Link href="#" className="block py-2 hover:bg-gray-100 rounded">journal Collaboration</Link> */}
                            </div>
                        )}
                         <button
                            onClick={() => toggleMenu('project')}
                            className="flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded"
                        >
                            <FaChartBar className="text-gray-600" />
                            <span className={`ml-2 ${!isOpen && 'hidden'}`}>Project</span>
                            {isOpen && <span className="ml-auto">{menuOpen.project ? '-' : '+'}</span>}
                        </button>
                        {menuOpen.project && (
                            <div className={`${!isOpen && 'hidden'} ml-6`}>
                                <Link href="/project" className="block py-2 hover:bg-gray-100 rounded"> View Project</Link>
                                {!isPostgraduate && (
                                <Link href={route('post-projects.index')} className="block py-2 hover:bg-gray-100 rounded">Manage Projects
                                </Link>)}
                                {/* <Link href="#" className="block py-2 hover:bg-gray-100 rounded">Paper</Link>
                                <Link href="#" className="block py-2 hover:bg-gray-100 rounded">Thesis</Link> */}
                            </div>
                        )}

                        <button
                            onClick={() => toggleMenu('event')}
                            className="flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded"
                        >
                            <FaCalendarAlt className="text-gray-600" />
                            <span className={`ml-2 ${!isOpen && 'hidden'}`}>Event</span>
                            {isOpen && <span className="ml-auto">{menuOpen.event ? '-' : '+'}</span>}
                        </button>
                        {menuOpen.event && (
                            <div className={`${!isOpen && 'hidden'} ml-6`}>
                                <Link href="/event" className="block py-2 hover:bg-gray-100 rounded">View Event</Link>
                                {!isPostgraduate && (
                                <Link href={route('post-events.index')} className="block py-2 hover:bg-gray-100 rounded">Manage Event
                                </Link>)}
                                {/* <Link href="#" className="block py-2 hover:bg-gray-100 rounded">Conference</Link>
                                <Link href="#" className="block py-2 hover:bg-gray-100 rounded">Talk</Link> */}
                            </div>
                        )}

                    </div>

                       {/* Features In Development */}
                       {/* <div>
                        <h3 className={`text-blue-500 uppercase text-xs font-bold ${!isOpen && 'hidden'}`}>Features In Development </h3>
                        <button
                            onClick={() => toggleMenu('workspace')}
                            className="flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded"
                        >
                            <FaBookOpen className="text-gray-600" />
                            <span className={`ml-2 ${!isOpen && 'hidden'}`}>Workspace</span>
                            {isOpen && <span className="ml-auto">{menuOpen.workspace ? '-' : '+'}</span>}
                        </button>
                        {menuOpen.workspace && (
                            <div className={`${!isOpen && 'hidden'} ml-6`}>
                                <Link href="#" className="block py-2 hover:bg-gray-100 rounded">View Board</Link>
                                <Link href="#" className="block py-2 hover:bg-gray-100 rounded">Manage Board</Link>
                                <Link href="#" className="block py-2 hover:bg-gray-100 rounded">Members</Link>
                            </div>
                        )}
                        <button
                            onClick={() => toggleMenu('journal')}
                            className="flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded"
                        >
                            <FaBook className="text-gray-600" />
                            <span className={`ml-2 ${!isOpen && 'hidden'}`}>Journal Database</span>
                            {isOpen && <span className="ml-auto">{menuOpen.journal ? '-' : '+'}</span>}
                        </button>
                        {menuOpen.journal && (
                            <div className={`${!isOpen && 'hidden'} ml-6`}>
                                <Link href="#" className="block py-2 hover:bg-gray-100 rounded">Discontinued Journal</Link>
                                <Link href="#" className="block py-2 hover:bg-gray-100 rounded">Predator Journal</Link>
                            </div>
                        )}
                          <button
                            onClick={() => toggleMenu('survey')}
                            className="flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded"
                        >
                            <FaPoll className="text-gray-600" />
                            <span className={`ml-2 ${!isOpen && 'hidden'}`}>Survey</span>
                            {isOpen && <span className="ml-auto">{menuOpen.survey ? '-' : '+'}</span>}
                        </button>
                        {menuOpen.survey && (
                            <div className={`${!isOpen && 'hidden'} ml-6`}>
                                <Link href="#" className="block py-2 hover:bg-gray-100 rounded">Survey (Free)</Link>
                                <Link href="#" className="block py-2 hover:bg-gray-100 rounded">Survey (With Token)</Link>
                            </div>
                        )}
                                <Link href="#" className="flex items-center justify-between py-2 px-4 hover:bg-gray-100 rounded">
                            <div className="flex items-center">
                                <FaNewspaper className="text-gray-600" />
                                <span className={`ml-2 ${!isOpen && 'hidden'}`}>Newsfeed</span>
                            </div>
                            {/* <span className="whitespace-nowrap rounded-full border border-purple-500 px-2.5 py-0.5 text-sm text-purple-700">
                                Soon
                            </span> */}
                        {/* </Link>

                        <Link href="#" className="flex items-center justify-between py-2 px-4 hover:bg-gray-100 rounded">
                            <div className="flex items-center">
                                <FaUsers className="text-gray-600" />
                                <span className={`ml-2 ${!isOpen && 'hidden'}`}>Forums</span>
                            </div> */}

                            {/* <span className="whitespace-nowrap rounded-full border border-purple-500 px-2.5 py-0.5 text-sm text-purple-700">
                                Soon
                            </span> */}
                        {/* </Link>
                    </div> */}

                    {/* Survey Section */}
                    <div>
                        <h3 className={`text-gray-500 uppercase text-xs font-bold ${!isOpen && 'hidden'}`}>Setting</h3>
                        {/* Profile Section */}
                        <div>
                            <button
                                onClick={() => toggleMenu('profile')}
                                className="flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded"
                            >
                                <FaUser className="text-gray-600" />
                                <span className={`ml-2 ${!isOpen && 'hidden'}`}>Profile</span>
                                {isOpen && <span className="ml-auto">{menuOpen.profile ? '-' : '+'}</span>}
                            </button>
                            {menuOpen.profile && (
                                <div className={`${!isOpen && 'hidden'} ml-6`}>
                                    <Link href={route('profile.edit')} className="block py-2 hover:bg-gray-100 rounded">
                                        My Account
                                    </Link>
                                    <Link href={route('role.edit')} className="block py-2 hover:bg-gray-100 rounded">
                                       Profile
                                    </Link>
                                </div>
                            )}
                        </div>
                        <Link href={route('logout')} method="post" as="button" className="flex items-center py-2 px-4 hover:bg-gray-100 rounded">
                            <FaCog className="text-gray-600" />
                            <span className={`ml-2 ${!isOpen && 'hidden'}`}>Log Out</span>
                        </Link>
                    </div>
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;
