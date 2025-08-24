import React, { useState } from 'react';
import { Link } from '@inertiajs/react';

const Header = ({ auth }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { name: "Features", href: "#features" },
        { name: "Latest Info", href: "#latest-info" },
        { name: "Testimonials", href: "#testimonials" },
        { name: "AI Features", href: "#ai-features" },
        { name: "News", href: "#news" }
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="flex justify-between items-center py-6">
                    {/* Logo */}
                    <a href="#home" className="flex items-center space-x-3">
                        <img src="/images/logo.png" alt="NexScholar" className="w-10 h-10" />
                        <span className="text-white font-bold text-2xl tracking-tight">NexScholar</span>
                    </a>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-10">
                        {navLinks.map((link) => (
                            <a key={link.name} href={link.href} className="text-white/90 hover:text-white transition-colors font-medium text-sm uppercase tracking-wide">
                                {link.name}
                            </a>
                        ))}
                    </nav>

                    {/* Desktop Buttons */}
                    <div className="hidden lg:flex items-center space-x-4">
                        {auth.user ? (
                            <Link href={route('dashboard')} className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg">
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="px-8 py-3 border-2 border-white/30 text-white rounded-xl hover:bg-white/10 font-semibold">
                                    Log In
                                </Link>
                                <Link href={route('register')} className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white p-2">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden bg-black/40 backdrop-blur-md rounded-2xl mt-4 p-6 border border-white/10">
                        <nav className="flex flex-col space-y-6">
                            {navLinks.map((link) => (
                                <a key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-purple-300 font-medium">
                                    {link.name}
                                </a>
                            ))}
                            <div className="flex flex-col space-y-3 pt-6 border-t border-white/20">
                                {auth.user ? (
                                    <Link href={route('dashboard')} className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-center font-semibold">
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link href={route('login')} className="px-6 py-3 border-2 border-white/30 text-white rounded-xl text-center font-semibold">
                                            Log In
                                        </Link>
                                        <Link href={route('register')} className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-center font-semibold">
                                            Register
                                        </Link>
                                    </>
                                )}
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header; 