import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { FileText, Shield, Cookie, Users } from 'lucide-react';

export default function LegalLayout({ children, headings = [] }) {
    const { url } = usePage();
    const { auth } = usePage().props;

    const navigationItems = [
        {
            name: 'Terms of Use',
            href: route('legal.terms'),
            icon: FileText,
            current: url === '/legal/terms-of-use'
        },
        {
            name: 'Privacy Policy',
            href: route('legal.privacy'),
            icon: Shield,
            current: url === '/legal/privacy-policy'
        },
        {
            name: 'Cookie Policy',
            href: route('legal.cookies'),
            icon: Cookie,
            current: url === '/legal/cookie-policy'
        },
        {
            name: 'Trust & Security',
            href: route('legal.security'),
            icon: Users,
            current: url === '/legal/trust-and-security'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Table of Contents Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
                            <h2 className="text-base font-semibold text-gray-900 mb-4">Table of Contents</h2>
                            {headings.length > 0 ? (
                                <nav className="space-y-1">
                                    {headings.map((heading, index) => (
                                        <a
                                            key={index}
                                            href={`#${heading.id}`}
                                            className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                                        >
                                            {heading.text}
                                        </a>
                                    ))}
                                </nav>
                            ) : (
                                <p className="text-sm text-gray-500">No sections found</p>
                            )}
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-lg shadow-sm border">
                            {children}
                        </div>
                    </div>

                    {/* Document Navigation Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
                            <h2 className="text-base font-semibold text-gray-900 mb-4">Legal Documents</h2>
                            <nav className="space-y-2">
                                {navigationItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                                item.current
                                                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
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
