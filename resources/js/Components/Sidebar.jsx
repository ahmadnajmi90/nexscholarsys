import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { FaUser, FaCog, FaNetworkWired, FaUserShield, FaProjectDiagram, FaShoppingCart, FaTachometerAlt } from 'react-icons/fa';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const user = usePage().props.auth.user;
    const [userMenuOpen, setUserMenuOpen] = useState(false); // Closed by default
    const [appsMenuOpen, setAppsMenuOpen] = useState(false); // Closed by default

    return (
        <div className={`bg-white h-full fixed z-10 transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}>
            {/* Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="absolute top-4 right-[-14px] w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
            >
                {isOpen ? '<' : '>'}
            </button>

            <div className="p-4">
                <div className="flex items-center mb-6">
                    <h2 className={`ml-2 text-lg font-semibold ${!isOpen && 'hidden'}`}>Nexscholar</h2>
                </div>

                {/* Navigation Sections */}
                <nav className="space-y-4">
                    <div>
                        <h3 className={`text-gray-500 uppercase text-xs font-bold ${!isOpen && 'hidden'}`}>User</h3>
                        <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded">
                            <FaUser className="text-gray-600" />
                            <span className={`ml-2 ${!isOpen && 'hidden'}`}>Public Profile</span>
                            {isOpen && <span className="ml-auto">{userMenuOpen ? '-' : '+'}</span>}
                        </button>
                        {userMenuOpen && (
                            <div className={`${!isOpen && 'hidden'} ml-6`}>
                                <Link href="#" className="block py-2 hover:bg-gray-100 rounded">My Account</Link>
                                <Link href="#" className="block py-2 hover:bg-gray-100 rounded">Network</Link>
                                <Link href="#" className="block py-2 hover:bg-gray-100 rounded">Authentication</Link>
                            </div>
                        )}
                    </div>

                    <div>
                        <h3 className={`text-gray-500 uppercase text-xs font-bold ${!isOpen && 'hidden'}`}>Apps</h3>
                        <button onClick={() => setAppsMenuOpen(!appsMenuOpen)} className="flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded">
                            <FaProjectDiagram className="text-gray-600" />
                            <span className={`ml-2 ${!isOpen && 'hidden'}`}>User Management</span>
                            {isOpen && <span className="ml-auto">{appsMenuOpen ? '-' : '+'}</span>}
                        </button>
                        {appsMenuOpen && (
                            <div className={`${!isOpen && 'hidden'} ml-6`}>
                                <Link href="#" className="block py-2 hover:bg-gray-100 rounded">Projects</Link>
                                <Link href="#" className="block py-2 hover:bg-gray-100 rounded">eCommerce</Link>
                            </div>
                        )}
                    </div>

                    {/* Additional Links */}
                    <Link href={route('dashboard')} className="flex items-center py-2 px-4 hover:bg-gray-100 rounded">
                        <FaTachometerAlt className="text-gray-600" />
                        <span className={`ml-2 ${!isOpen && 'hidden'}`}>Dashboard</span>
                    </Link>
                    <Link href={route('post-grants.index')} className="flex items-center py-2 px-4 hover:bg-gray-100 rounded">
                        <FaProjectDiagram className="text-gray-600" />
                        <span className={`ml-2 ${!isOpen && 'hidden'}`}>Post Grant</span>
                    </Link>
                    <Link href={route('profile.edit')} className="flex items-center py-2 px-4 hover:bg-gray-100 rounded">
                        <FaUser className="text-gray-600" />
                        <span className={`ml-2 ${!isOpen && 'hidden'}`}>Profile</span>
                    </Link>
                    <Link href={route('logout')} method="post" as="button" className="flex items-center py-2 px-4 hover:bg-gray-100 rounded">
                        <FaCog className="text-gray-600" />
                        <span className={`ml-2 ${!isOpen && 'hidden'}`}>Log Out</span>
                    </Link>
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;
