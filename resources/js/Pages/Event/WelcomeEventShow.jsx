import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { FaArrowLeft } from 'react-icons/fa';

export default function WelcomeEventShow() {
  const { event, previous, next, academicians, researchOptions, auth } = usePage().props;
  const currentYear = new Date().getFullYear();

  // Determine the author from academicians only.
  const author =
    academicians && academicians.find(a => a.academician_id === event.author_id) || null;

  // Helper to get the field of research names using composite keys.
  const getResearchNames = () => {
    if (!event.field_of_research) return null;
    const ids = Array.isArray(event.field_of_research)
      ? event.field_of_research
      : [event.field_of_research];
    const names = ids.map(id => {
      const option = researchOptions.find(
        opt =>
          `${opt.field_of_research_id}-${opt.research_area_id}-${opt.niche_domain_id}` === id
      );
      if (option) {
        return `${option.field_of_research_name} - ${option.research_area_name} - ${option.niche_domain_name}`;
      }
      return null;
    }).filter(Boolean);
    return names.length ? names.join(", ") : null;
  };

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
          {event.event_name && (
            <h1 className="text-2xl md:text-3xl font-bold mb-4 text-left">{event.event_name}</h1>
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
                {event.created_at && (
                  <div className="text-gray-500">
                    {new Date(event.created_at).toLocaleDateString()}
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
                {event.created_at && (
                  <div className="text-gray-500">
                    {new Date(event.created_at).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Banner */}
          {event.image && (
            <img 
              src={`/storage/${event.image}`} 
              alt="Banner" 
              className="w-full h-auto md:h-64 object-cover mb-4"
            />
          )}

          {/* Description with heading */}
          {event.description && (
            <div className="mb-4">
              <h2 className="text-xl font-bold mb-2">Description</h2>
              <div 
                className="text-gray-700 prose" 
                dangerouslySetInnerHTML={{ __html: event.description }} 
              />
            </div>
          )}

          {/* Event Details (listed in a single column) */}
          <div className="mb-4 space-y-2">
            {event.event_type && (
              <p>
                <span className="font-semibold">Event Type:</span> {event.event_type}
              </p>
            )}
            {event.event_mode && (
              <p>
                <span className="font-semibold">Event Mode:</span> {event.event_mode}
              </p>
            )}
            {event.event_theme && (
              <p>
                <span className="font-semibold">Event Theme:</span> {event.event_theme}
              </p>
            )}
            {event.start_date && (
              <p>
                <span className="font-semibold">Start Date:</span>{" "}
                {new Date(event.start_date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
            )}
            {event.end_date && (
              <p>
                <span className="font-semibold">End Date:</span>{" "}
                {new Date(event.end_date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
            )}
            {event.start_time && (
              <p>
                <span className="font-semibold">Start Time:</span> {event.start_time}
              </p>
            )}
            {event.end_time && (
              <p>
                <span className="font-semibold">End Time:</span> {event.end_time}
              </p>
            )}
            {event.registration_deadline && (
              <p>
                <span className="font-semibold">Registration Deadline:</span>{" "}
                {new Date(event.registration_deadline).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
            )}
            {event.registration_url && (
              <p>
                <span className="font-semibold">Registration:</span>
                <a
                  href={event.registration_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-500 underline"
                >
                  Register
                </a>
              </p>
            )}
            {event.contact_email && (
              <p>
                <span className="font-semibold">Contact Email:</span> {event.contact_email}
              </p>
            )}
            {event.venue && (
              <p>
                <span className="font-semibold">Venue:</span> {event.venue}
              </p>
            )}
            {event.city && (
              <p>
                <span className="font-semibold">City:</span> {event.city}
              </p>
            )}
            {event.country && (
              <p>
                <span className="font-semibold">Country:</span> {event.country}
              </p>
            )}
            {event.field_of_research && getResearchNames() && (
              <p>
                <span className="font-semibold">Field of Research:</span> {getResearchNames()}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 text-center py-4 mt-6">
        <p className="text-sm text-gray-700">NexScholar © {currentYear}. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
