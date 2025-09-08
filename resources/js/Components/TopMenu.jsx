import React from 'react';
import { Link } from '@inertiajs/react';

const TopMenu = ({ profilePicture }) => {
    return (
        <nav className="border-b border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mx-auto">
                {/* Left Side Links */}
                {/* <div className="flex items-center space-x-6">
                    <Link
                        href={route('profile.edit')}
                        className="text-gray-700 hover:text-blue-600 font-medium"
                    >
                        My Account
                    </Link>
                    <Link
                        href={route('role.edit')}
                        className="text-gray-700 hover:text-blue-600 font-medium"
                    >
                        Profile
                    </Link>
                </div> */}

                {/* Right Side - Profile Image */}
                <div className="flex items-center space-x-4">
                    {/* <button className="rounded-full bg-gray-200 p-2">

                        <svg
                            className="h-6 w-6 text-gray-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M10 2a6 6 0 00-6 6v5H3a1 1 0 000 2h14a1 1 0 000-2h-1V8a6 6 0 00-6-6z"></path>
                            <path d="M8.293 16.707a1 1 0 011.414 0l.293.293h-2l.293-.293z"></path>
                        </svg>
                    </button> */}

                    {/* Profile Image */}
                    {/* <Link href={route('profile.edit')}>
                        <img
                            src={`/storage/${profilePicture || "default-profile.jpg"}`}
                            alt="User Profile"
                            className="h-8 w-8 rounded-full object-cover border-2 border-gray-300"
                        />
                    </Link> */}
                </div>
            </div>
        </nav>
    );
};

export default TopMenu;
