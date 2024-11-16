import React from "react";
import { Head, Link } from '@inertiajs/react';

const HeroSection = ({ auth }) => {
  return (
<div
  className="bg-cover bg-center min-h-screen flex flex-col"
  style={{
    backgroundImage:
      "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/background.png')",
  }}
>
      {/* Navbar */}
      <header className="w-full bg-white shadow-md">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          {/* Logo */}
          <div className="text-blue-600 text-lg font-bold">NexScholar</div>

          {/* Authentication Links */}
          <div className="flex items-center space-x-4">
            {auth.user ? (
              <>
                <Link
                  href={route('dashboard')}
                  className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-blue-500 dark:text-white dark:hover:text-white/80"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={route('login')}
                  className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-blue-500 dark:text-white dark:hover:text-white/80"
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

      {/* Hero Content */}
      <section className="flex-grow flex flex-col justify-center items-center text-center px-6 bg-opacity-75">
  <h4 className="text-blue-600 font-medium">
    Built with NexScholar Components
  </h4>
  <h1 className="text-4xl font-bold text-white mt-4 leading-tight">
    Ready for Researchers and Academics
  </h1>
  <p className="text-white mt-4 max-w-2xl">
    NexScholar helps academics and researchers thrive by simplifying their
    work and fostering collaboration. Build your academic solutions with
    ease and efficiency.
  </p>

  {/* Buttons */}
  <div className="mt-8 flex space-x-4">
    <a
      href="#know-more"
      className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
    >
      Know More
    </a>
    <a
      href="#contact-us"
      className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
    >
      Contact Us
    </a>
  </div>
</section>

    </div>
  );
};

export default HeroSection;
