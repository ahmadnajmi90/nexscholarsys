import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarLogo,
  NavbarButton,
} from '@/components/ui/resizable-navbar';

const Header = ({ auth }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { name: "Features", link: "#features" },
        { name: "Latest Info", link: "#latest-info" },
        { name: "Testimonials", link: "#testimonials" },
        { name: "AI Features", link: "#ai-features" },
        { name: "News", link: "#news" }
    ];

    const handleItemClick = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <Navbar>
            {/* Desktop Navigation */}
            <NavBody>
                    {/* Logo */}
                <NavbarLogo
                    src="/images/logo.png"
                    alt="NexScholar"
                    text="NexScholar"
                />

                {/* Navigation Items */}
                <NavItems
                    items={navLinks}
                    onItemClick={handleItemClick}
                />

                    {/* Desktop Buttons */}
                <div className="flex items-center space-x-3">
                        {auth.user ? (
                            <NavbarButton href={route('dashboard')} variant="gradient">
                                Dashboard
                            </NavbarButton>
                        ) : (
                            <>
                                <NavbarButton href={route('login')} variant="secondary">
                                    Log In
                                </NavbarButton>
                                <NavbarButton href={route('register')} variant="gradient">
                                    Register
                                </NavbarButton>
                            </>
                        )}
                </div>
            </NavBody>

            {/* Mobile Navigation */}
            <MobileNav>
                <MobileNavHeader>
                    {/* Mobile Logo */}
                    <NavbarLogo
                        src="/images/logo.png"
                        alt="NexScholar"
                        text="NexScholar"
                    />

                    {/* Mobile Menu Toggle */}
                    <MobileNavToggle
                        isOpen={isMobileMenuOpen}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    />
                </MobileNavHeader>

                {/* Mobile Menu */}
                <MobileNavMenu
                    isOpen={isMobileMenuOpen}
                    onClose={() => setIsMobileMenuOpen(false)}
                >
                    <nav className="flex flex-col space-y-4 w-full">
                            {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.link}
                                onClick={handleItemClick}
                                className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white font-medium transition-colors px-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                    {link.name}
                                </a>
                            ))}

                        {/* Mobile Auth Buttons */}
                        <div className="flex flex-col space-y-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                                {auth.user ? (
                                    <NavbarButton href={route('dashboard')} variant="gradient" className="w-full">
                                        Dashboard
                                    </NavbarButton>
                                ) : (
                                    <>
                                        <NavbarButton href={route('login')} variant="secondary" className="w-full">
                                            Log In
                                        </NavbarButton>
                                        <NavbarButton href={route('register')} variant="gradient" className="w-full">
                                            Register
                                        </NavbarButton>
                                    </>
                                )}
                            </div>
                        </nav>
                </MobileNavMenu>
            </MobileNav>
        </Navbar>
    );
};

export default Header; 