import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import GoogleCalendarSettings from './Partials/GoogleCalendarSettings';
import MainLayout from '@/Layouts/MainLayout';
import SettingsCard from '@/Components/Profile/SettingsCard';
import SettingsNavigation from '@/Components/Profile/SettingsNavigation';
import useRoles from '@/Hooks/useRoles';
import BetaBadge from '@/Components/BetaBadge';

export default function Edit({ mustVerifyEmail, status }) {
    const { isAdmin, isPostgraduate, isUndergraduate, isFacultyAdmin, isAcademician } = useRoles();
    const [activeSection, setActiveSection] = useState('account');

    // Intersection Observer for active section detection
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { 
                rootMargin: '-20% 0px -70% 0px',
                threshold: 0.1
            }
        );

        // Observe all sections
        const sections = document.querySelectorAll('section[id]');
        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
    }, []);

    return (
        <MainLayout
            TopMenuOpen={true}
        >
            <Head title="Settings" />

            <div className="min-h-screen bg-white">
                <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-4 pb-8 pt-8 sm:pt-8 md:pt-8 lg:pt-4">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage your account settings and preferences
                        </p>
                    </div>

                    {/* Mobile Navigation */}
                    <div className="lg:hidden mb-6 overflow-x-auto">
                        <nav className="flex space-x-2 pb-2">
                            {['account', 'password', 'calendar', 'danger'].map((section) => {
                                const labels = {
                                    account: 'Account',
                                    password: 'Password',
                                    calendar: 'Calendar',
                                    danger: 'Delete'
                                };
                                return (
                                    <a
                                        key={section}
                                        href={`#${section}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            const element = document.getElementById(section);
                                            if (element) {
                                                const offset = 100;
                                                const elementPosition = element.getBoundingClientRect().top;
                                                const offsetPosition = elementPosition + window.pageYOffset - offset;
                                                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                                            }
                                        }}
                                        className={`
                                            px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap
                                            transition-colors duration-150
                                            ${activeSection === section
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                                            }
                                        `}
                                    >
                                        {labels[section]}
                                    </a>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
                        {/* Sticky Navigation - Left Side (Desktop Only) */}
                        <aside className="hidden lg:block lg:col-span-3">
                            <nav className="sticky top-8">
                                <SettingsNavigation activeSection={activeSection} />
                            </nav>
                        </aside>
                        
                        {/* Content Area - Right Side */}
                        <main className="lg:col-span-9 space-y-6">
                            {/* Account Information Section */}
                            <SettingsCard
                                id="account"
                                title="Account Information"
                                description="Update your account's profile information and email address."
                            >
                                <UpdateProfileInformationForm
                                    mustVerifyEmail={mustVerifyEmail}
                                    status={status}
                                />
                            </SettingsCard>

                            {/* Password Section */}
                            <SettingsCard
                                id="password"
                                title="Password"
                                description="Ensure your account is using a long, random password to stay secure."
                            >
                                <UpdatePasswordForm />
                            </SettingsCard>

                            {/* Calendar Integration Section */}
                            <SettingsCard
                                id="calendar"
                                title={
                                    <div className="flex items-center gap-2">
                                        Calendar Integration
                                        <BetaBadge variant="inline" />
                                    </div>
                                }
                                description="Connect your Google Calendar to automatically sync supervision meetings."
                            >
                                <GoogleCalendarSettings />
                            </SettingsCard>

                            {/* Delete Account Section */}
                            <SettingsCard
                                id="danger"
                                title="Delete Account"
                                description="Permanently delete your account and all associated data."
                                className="border-red-200"
                            >
                                <DeleteUserForm />
                            </SettingsCard>
                        </main>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
