import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { ClipboardList, X } from 'lucide-react';
import Dropdown from '../Components/Dropdown';
import { Settings, User2, LogOut } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../Components/ui/dialog';
import { Button } from '../Components/ui/button';

const AIMatchingLayout = ({ children, title = "AI Matching" }) => {
    const { auth, preferences } = usePage().props;
    const [showFeedbackBubble, setShowFeedbackBubble] = useState(true);
    const [showDismissDialog, setShowDismissDialog] = useState(false);

    // Helper function to get profile picture URL
    const getProfilePicture = (user) => {
        const profile = user.academician || user.postgraduate || user.undergraduate;
        return profile?.profile_picture ? `/storage/${profile.profile_picture}` : "/storage/profile_pictures/default.jpg";
    };

    // Handle exit to dashboard
    const handleExit = () => {
        router.visit(route('dashboard'));
    };

    // Load feedback bubble visibility from backend session (via preferences) and localStorage
    useEffect(() => {
        const permanentlyDismissed = localStorage.getItem('feedbackBubbleDismissed');
        const sessionDismissed = preferences?.feedback_bubble_dismissed;
        
        if (permanentlyDismissed === 'true' || sessionDismissed === true) {
            setShowFeedbackBubble(false);
        }
    }, [preferences]);

    // Function to show dismissal dialog
    const showDismissalDialog = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowDismissDialog(true);
    };

    // Function to dismiss feedback bubble permanently
    const dismissPermanently = () => {
        setShowFeedbackBubble(false);
        setShowDismissDialog(false);
        localStorage.setItem('feedbackBubbleDismissed', 'true');
    };

    // Function to dismiss feedback bubble for this session only
    const dismissForSession = async () => {
        setShowFeedbackBubble(false);
        setShowDismissDialog(false);
        
        // Call backend API to store in Laravel session
        try {
            await fetch(route('preferences.feedback.dismiss'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
                body: JSON.stringify({ type: 'session' }),
            });
            
            // Reload only the preferences prop to get fresh session state
            router.reload({ only: ['preferences'] });
        } catch (error) {
            console.error('Failed to dismiss feedback bubble:', error);
        }
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

            {/* Feedback Form Bubble - Dismissible */}
            {showFeedbackBubble && (
                <div className="fixed z-40 right-4 bottom-24 md:bottom-10 md:right-8 group">
                    <a
                        href="https://docs.google.com/forms/d/e/1FAIpQLSdPX9CXPOAZLedNsqA9iyMs5ZkAOACol4_wBVN2LPdxbnsJeg/viewform"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Open feedback form"
                        className="flex items-center gap-3"
                    >
                        <span className="pointer-events-none rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-focus-within:opacity-100 group-focus-within:translate-x-0 transition-all duration-200">
                            Feedback Form
                        </span>
                        <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-xl opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-200">
                            <ClipboardList className="h-6 w-6" />
                            {/* Close button */}
                            <button
                                onClick={showDismissalDialog}
                                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                                aria-label="Dismiss feedback bubble"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    </a>
                </div>
            )}

            {/* Feedback Dismissal Dialog - Enhanced Design */}
            <Dialog open={showDismissDialog} onOpenChange={setShowDismissDialog}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                                <ClipboardList className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl">Hide Feedback Button?</DialogTitle>
                                <DialogDescription className="mt-1">
                                    Choose your preference below
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    
                    <div className="space-y-3 py-4">
                        {/* Hide until next login option */}
                        <button
                            onClick={dismissForSession}
                            className="w-full p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200 group"
                        >
                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                                    <LogOut className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="text-left flex-1">
                                    <div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                        Hide until next login
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Button will reappear when you log in again. Perfect if you just need a break!
                                    </div>
                                </div>
                            </div>
                        </button>

                        {/* Hide permanently option */}
                        <button
                            onClick={dismissPermanently}
                            className="w-full p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-red-500 dark:hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 group"
                        >
                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0 group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
                                    <X className="h-5 w-5 text-red-600 dark:text-red-400" />
                                </div>
                                <div className="text-left flex-1">
                                    <div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                        Hide permanently
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Button won't appear again on this device. You can still access feedback via sidebar.
                                    </div>
                                </div>
                            </div>
                        </button>
                    </div>

                    <DialogFooter className="sm:justify-center">
                        <Button
                            variant="ghost"
                            onClick={() => setShowDismissDialog(false)}
                            className="px-8"
                        >
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AIMatchingLayout;

