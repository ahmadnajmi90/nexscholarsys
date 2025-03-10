import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { FaArrowLeft } from 'react-icons/fa';
import useRoles from '@/Hooks/useRoles';

export default function Show() {
  // Get grant, academicians, previous/next grants from Inertia props.
  const { grant, previous, next, academicians } = usePage().props;
  const { isAcademician } = useRoles();

  // Determine the author from academicians only.
  const author =
    academicians && academicians.find(a => a.academician_id === grant.author_id) || null;

  return (
    <MainLayout>
      {/* Back arrow */}
      <div className="absolute top-[1.8rem] left-2 md:top-[5.5rem] md:left-[19.5rem] z-50">
        <Link 
          href={route('grants.index')}
          className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600"
        >
          <FaArrowLeft className="text-lg md:text-xl" />
        </Link>
      </div>

      <div className="px-10 md:px-16">
        <div className="max-w-8xl mx-auto py-6">
          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold mb-4 text-left">{grant.title}</h1>

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
                <div className="text-gray-500">
                  {new Date(grant.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 mb-4">
              <img 
                src={`/storage/Admin.jpg`} 
                alt='Admin'
                className="w-12 h-12 rounded-full object-cover shadow-md border-2 border-white"
              />
              <div>
                <div className="text-lg font-semibold">Admin</div>
                <div className="text-gray-500">
                  {new Date(grant.created_at).toLocaleDateString()}
                </div>
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
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">Description</h2>
            <div 
              className="text-gray-700 text-justify" 
              dangerouslySetInnerHTML={{ __html: grant.description }} 
            />
          </div>

          {/* Grant Details (listed in a single column) */}
          <div className="mb-4 space-y-2">
            <p>
              <span className="font-semibold">Start Date:</span>{" "}
              {new Date(grant.start_date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
            <p>
              <span className="font-semibold">End Date:</span>{" "}
              {new Date(grant.end_date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
            <p>
              <span className="font-semibold">Application Deadline:</span>{" "}
              {new Date(grant.application_deadline).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
            <p>
              <span className="font-semibold">Grant Type:</span> {grant.grant_type}
            </p>
            <p>
              <span className="font-semibold">Cycle:</span> {grant.cycle}
            </p>
            <p>
              <span className="font-semibold">Sponsored By:</span> {grant.sponsored_by}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {grant.email}
            </p>
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
            <p>
              <span className="font-semibold">Country:</span> {grant.country}
            </p>
            <p>
              <span className="font-semibold">Grant Themes:</span>{" "}
              {Array.isArray(grant.grant_theme)
                ? grant.grant_theme.join(", ")
                : grant.grant_theme}
            </p>
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

        {/* Navigation Buttons */}
        <div className="max-w-3xl mx-auto py-6 flex justify-between">
          {previous ? (
            <Link 
              href={route('grants.show', previous.url)} 
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Previous
            </Link>
          ) : (
            <span></span>
          )}
          {next ? (
            <Link 
              href={route('grants.show', next.url)} 
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Next
            </Link>
          ) : (
            <span></span>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
