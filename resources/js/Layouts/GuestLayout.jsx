import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex flex-col items-center bg-gray-100 min-h-screen py-4 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-7xl mx-auto">
                {children}
            </div>
        </div>
    );
}
