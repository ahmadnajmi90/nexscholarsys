import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { FaArrowLeft } from 'react-icons/fa';

export default function WelcomePostShow() {
  const { post, auth, academicians, postgraduates, undergraduates, previous, next } = usePage().props;
  const currentYear = new Date().getFullYear();

  // Determine the author based on the post's author_id.
  const author =
    (auth && auth.user && academicians && academicians.find(a => a.academician_id === post.author_id)) ||
    (auth && auth.user && postgraduates && postgraduates.find(p => p.postgraduate_id === post.author_id)) ||
    (auth && auth.user && undergraduates && undergraduates.find(u => u.undergraduate_id === post.author_id)) ||
    null;

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

      {/* Back Arrow */}
      <div className="absolute top-[6.2rem] left-2 md:top-[6.5rem] md:left-[3.5rem] z-50">
        <Link 
          href={route('welcome')}
          className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600"
        >
          <FaArrowLeft className="text-lg md:text-xl" />
        </Link>
      </div>

      {/* Main Content */}
      <div className="px-10 md:px-28 md:py-2">
        <div className="max-w-8xl mx-auto py-6">
          {/* Title */}
          {post.title && (
            <h1 className="text-2xl md:text-3xl font-bold mb-4 text-left">{post.title}</h1>
          )}

          {/* Author Info Section */}
          {author ? (
            <div className="flex items-center gap-4 mb-4">
              <img 
                src={`/storage/${author.profile_picture}`} 
                alt={author.full_name} 
                className="w-12 h-12 rounded-full object-cover shadow-md bg-gray-200 border-2 border-white"
              />
              <div>
                <div className="text-lg font-semibold">{author.full_name}</div>
                {post.created_at && (
                  <div className="text-gray-500">{new Date(post.created_at).toLocaleDateString()}</div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 mb-4">
              <img 
                src={`/storage/Admin.jpg`} 
                alt="Admin"
                className="w-12 h-12 rounded-full object-cover shadow-md border-2 border-white"
              />
              <div>
                <div className="text-lg font-semibold">Admin</div>
                {post.created_at && (
                  <div className="text-gray-500">{new Date(post.created_at).toLocaleDateString()}</div>
                )}
              </div>
            </div>
          )}

          {/* Banner */}
          {post.featured_image && (
            <img 
              src={`/storage/${post.featured_image}`} 
              alt="Banner" 
              className="w-full h-auto md:h-64 object-cover mb-4 rounded"
            />
          )}

          {/* Content */}
          <div
            className="mb-4 text-gray-700 prose w-full text-justify max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Category */}
          {post.category && (
            <p className="mb-2">
              <span className="font-semibold">Category:</span> {post.category}
            </p>
          )}

          {/* Tags */}
          {post.tags && (
            <p className="mb-2">
              <span className="font-semibold">Tags:</span>{" "}
              {Array.isArray(post.tags) ? post.tags.join(', ') : post.tags}
            </p>
          )}

          {/* Attachment */}
          {post.attachment && (
            <p className="mb-2">
              <span className="font-semibold">Attachment:</span>
              <a
                href={`/storage/${post.attachment}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-blue-500 underline"
              >
                View Attachment
              </a>
            </p>
          )}

          {/* Gallery */}
          {post.images && (
            <div className="mt-4">
              <h2 className="text-xl font-bold mb-2">Gallery</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {JSON.parse(post.images).map((img, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <img
                      src={`/storage/${img}`}
                      alt={`Gallery image ${index + 1}`}
                      className="w-full h-auto md:h-32 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 text-center py-4 mt-6">
        <p className="text-sm text-gray-700">NexScholar © {currentYear}. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
