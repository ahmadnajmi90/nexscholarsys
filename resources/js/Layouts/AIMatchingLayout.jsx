import React from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { ClipboardList } from 'lucide-react';
import Dropdown from '../Components/Dropdown';
import { Settings, User2, LogOut } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

const AIMatchingLayout = ({ children, title = "AI Matching" }) => {
    const { auth } = usePage().props;

    // Helper function to get profile picture URL
    const getProfilePicture = (user) => {
        const profile = user.academician || user.postgraduate || user.undergraduate;
        return profile?.profile_picture ? `/storage/${profile.profile_picture}` : "/storage/profile_pictures/default.jpg";
    };

    // Handle exit to dashboard
    const handleExit = () => {
        router.visit(route('dashboard'));
    };

    return (
        <div className="min-h-screen">
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
                            background: '#22c55e',
                            color: '#fff',
                        },
                    },
                    error: {
                        duration: 4000,
                        style: {
                            background: '#ef4444',
                            color: '#fff',
                        },
                    },
                }}
            />

            <Head title={title} />

            {/* Minimal Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Left: Logo & Feature Name */}
                        <div className="flex items-center gap-4">
                            <Link href={route('dashboard')} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                                <img src="/images/logo.png" alt="Nexscholar Logo" className="w-10 h-10 bg-white rounded-lg object-contain p-1" />
                                <div className="hidden sm:block">
                                    <div className="text-sm font-semibold text-gray-900">Nexscholar</div>
                                    <div className="text-xs text-gray-500">AI Matching</div>
                                </div>
                            </Link>
                        </div>

                        {/* Right: Profile & Exit */}
                        <div className="flex items-center gap-3">
                            {/* Profile Dropdown */}
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                                        <img
                                            src={getProfilePicture(auth.user)}
                                            alt="Profile"
                                            className="h-9 w-9 rounded-full object-cover ring-2 ring-gray-200 hover:ring-blue-400 transition-all"
                                        />
                                    </button>
                                </Dropdown.Trigger>

                                <Dropdown.Content align="right" width="48">
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <span className="block text-sm font-medium text-gray-900 truncate">{auth.user.full_name}</span>
                                        <span className="block text-xs text-gray-500 truncate mt-1">{auth.user.email}</span>
                                    </div>
                                    <Dropdown.Link href={route('profile.edit')}>
                                        <Settings className="w-4 h-4 mr-2" />
                                        Account Settings
                                    </Dropdown.Link>
                                    <Dropdown.Link href={route('role.edit')}>
                                        <User2 className="w-4 h-4 mr-2" />
                                        Personal Info
                                    </Dropdown.Link>
                                    <div className="border-t border-gray-100 mt-1"></div>
                                    <Dropdown.Link href={route('logout')} method="post" as="button" className="w-full text-left text-red-600 hover:bg-red-50">
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Log Out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content - Full Width */}
            <main className="min-h-[calc(100vh-4rem)]">
                {children}
            </main>

            {/* Feedback Form Bubble */}
            <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSdPX9CXPOAZLedNsqA9iyMs5ZkAOACol4_wBVN2LPdxbnsJeg/viewform"
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
        </div>
    );
};

export default AIMatchingLayout;

