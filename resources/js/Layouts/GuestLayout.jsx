import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { Toaster } from 'react-hot-toast';

export default function GuestLayout({ children }) {
    return (
        <div className="flex flex-col items-center bg-gray-100 min-h-screen py-4 px-4 sm:px-6 lg:px-8">
            <Toaster 
                position="top-center"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    success: {
                        duration: 5000,
                        iconTheme: {
                            primary: '#10B981',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        duration: 5000,
                        iconTheme: {
                            primary: '#EF4444',
                            secondary: '#fff',
                        },
                    },
                }}
            />
            <div className="w-full max-w-7xl mx-auto">
                {children}
            </div>
        </div>
    );
}
