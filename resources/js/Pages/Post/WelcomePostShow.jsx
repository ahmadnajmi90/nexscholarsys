import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { FaArrowLeft } from 'react-icons/fa';

export default function WelcomePostShow() {
  const { post, auth } = usePage().props;
  const currentYear = new Date().getFullYear();

  return (
    <div>
      {/* Header */}
      <header className="w-full bg-white shadow-md">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <div className="text-blue-600 text-lg font-bold">Nexscholar</div>
          <div className="flex items-center space-x-4">
            {auth && auth.user ? (
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

      {/* Main Content */}
      <div className="absolute top-[7rem] left-[2rem] z-50">
            <Link 
                href="/"
                className="flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600"
            >
                <FaArrowLeft className="text-2xl" />
            </Link>
        </div>

      <div className="container mx-auto py-6 px-28">
        {post.image && (
          <div className="mt-4">
            <img
              src={`/storage/${post.image}`}
              alt={post.title}
              className="w-full h-64 object-cover rounded"
            />
          </div>
        )}

        <h1 className="text-4xl font-bold mt-4 text-center">{post.title}</h1>

        <div
          className="mt-4 text-gray-700"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        <p className="mt-4 mb-2">
          <span className="font-semibold">Category:</span> {post.category}
        </p>
        <p className="mt-2 mb-2">
          <span className="font-semibold">Tags:</span>{" "}
          {Array.isArray(post.tags) ? post.tags.join(', ') : post.tags}
        </p>
        {post.attachment && (
          <p className="mt-2">
            <span className="font-semibold">Attachment:</span>{" "}
            <a
              href={`/storage/${post.attachment}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              View Attachment
            </a>
          </p>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 text-center py-4 mt-6">
        <p className="text-sm text-gray-700">
          NexScholar © {currentYear}. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
