import React from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function ResourceLayout({ children }) {
    const { auth } = usePage().props;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header - Same as LegalLayout */}
            <header className="bg-white shadow-sm border-b sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <Link href={route('welcome')} className="flex items-center gap-2">
                                <img src="/images/logo.png" alt="NexScholar" className="w-8 h-8" />
                                <span className="text-xl font-semibold text-gray-900">NexScholar</span>
                            </Link>
                        </div>
                        <nav className="flex space-x-4">
                            {auth && auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href={route('login')}
                                    className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                                >
                                    Login
                                </Link>
                            )}
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>

            {/* Footer - Same as LegalLayout */}
            <footer className="bg-white border-t mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center text-sm text-gray-500">
                        <p>© 2025 NexScholar Sdn. Bhd. All rights reserved.</p>
                        <p className="mt-2">Built with integrity for academia, industry & community.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
