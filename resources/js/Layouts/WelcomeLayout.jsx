// resources/js/Layouts/WelcomeLayout.jsx
import React from 'react';
import { Link } from '@inertiajs/react';

export default function WelcomeLayout({ children, auth }) {
  console.log(auth);
  const currentYear = new Date().getFullYear();
  return (
    <div>
      {/* Public Header */}
      <header className="w-full bg-white shadow-md">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <div className="text-blue-600 text-lg font-bold">Nexscholar</div>
          <div className="flex items-center space-x-4">
             {auth ? (
                <Link
                href={route('dashboard')}
                className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-blue-500"
                >
                Dashboard
                </Link>
            ) : (
            <>
                <Link
                    href={route('login')}
                    className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-blue-500"
                >
                    Log in
                </Link>
                <Link
                    href={route('register')}
                    className="rounded-md px-3 py-2 bg-blue-600 text-white transition hover:bg-blue-700 focus:outline-none focus:ring focus-visible:ring-blue-500"
                >
                    Register
                </Link>
            </>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main>{children}</main>

      {/* Public Footer */}
      <footer className="bg-gray-100 text-center py-4 mt-6">
        <p className="text-sm text-gray-700">NexScholar © {new Date().getFullYear()}. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
