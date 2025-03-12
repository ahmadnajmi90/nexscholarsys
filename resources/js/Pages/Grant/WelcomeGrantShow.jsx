import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { FaArrowLeft } from 'react-icons/fa';

export default function WelcomeGrantShow() {
  const { grant, previous, next, academicians, auth } = usePage().props;
  const currentYear = new Date().getFullYear();

  // Determine the author from academicians only.
  const author =
    academicians && academicians.find(a => a.academician_id === grant.author_id) || null;

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
          {grant.title && (
            <h1 className="text-2xl md:text-3xl font-bold mb-4 text-left">{grant.title}</h1>
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
                {grant.created_at && (
                  <div className="text-gray-500">
                    {new Date(grant.created_at).toLocaleDateString()}
                  </div>
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
                {grant.created_at && (
                  <div className="text-gray-500">
                    {new Date(grant.created_at).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Banner */}
          {grant.image && (
            <img 
              src={`/storage/${grant.image}`} 
              alt="Banner" 
              className="w-full h-auto md:h-64 object-cover mb-4"
            />
          )}

          {/* Description with heading */}
          {grant.description && (
            <div className="mb-4">
              <h2 className="text-xl font-bold mb-2">Description</h2>
              <div 
                className="text-gray-700 prose" 
                dangerouslySetInnerHTML={{ __html: grant.description }} 
              />
            </div>
          )}

          {/* Grant Details (listed in a single column) */}
          <div className="mb-4 space-y-2">
            {grant.start_date && (
              <p>
                <span className="font-semibold">Start Date:</span>{" "}
                {new Date(grant.start_date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
            )}
            {grant.end_date && (
              <p>
                <span className="font-semibold">End Date:</span>{" "}
                {new Date(grant.end_date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
            )}
            {grant.application_deadline && (
              <p>
                <span className="font-semibold">Application Deadline:</span>{" "}
                {new Date(grant.application_deadline).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
            )}
            {grant.grant_type && (
              <p>
                <span className="font-semibold">Grant Type:</span> {grant.grant_type}
              </p>
            )}
            {grant.cycle && (
              <p>
                <span className="font-semibold">Cycle:</span> {grant.cycle}
              </p>
            )}
            {grant.sponsored_by && (
              <p>
                <span className="font-semibold">Sponsored By:</span> {grant.sponsored_by}
              </p>
            )}
            {grant.email && (
              <p>
                <span className="font-semibold">Email:</span> {grant.email}
              </p>
            )}
            {grant.website && (
              <p>
                <span className="font-semibold">Website:</span>
                <a
                  href={grant.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-500 underline"
                >
                  Website
                </a>
              </p>
            )}
            {grant.country && (
              <p>
                <span className="font-semibold">Country:</span> {grant.country}
              </p>
            )}
            {grant.grant_theme && (
              <p>
                <span className="font-semibold">Grant Themes:</span>{" "}
                {Array.isArray(grant.grant_theme)
                  ? grant.grant_theme.join(", ")
                  : grant.grant_theme}
              </p>
            )}
          </div>

          {/* Attachment */}
          {grant.attachment && (
            <div className="mb-2">
              <p>
                <span className="font-semibold">Attachment:</span>{" "}
                <a
                  href={`/storage/${grant.attachment}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  View Attachment
                </a>
              </p>
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
