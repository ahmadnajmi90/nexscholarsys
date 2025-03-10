import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { FaArrowLeft } from 'react-icons/fa';
import useRoles from '@/Hooks/useRoles';

export default function Show() {
  const { event, previous, next, academicians, researchOptions } = usePage().props;
  const { isAcademician } = useRoles();

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
    <MainLayout>
      {/* Back arrow */}
      <div className="absolute top-[1.8rem] left-2 md:top-[5.5rem] md:left-[19.5rem] z-50">
        <Link 
          href={route('events.index')}
          className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600"
        >
          <FaArrowLeft className="text-lg md:text-xl" />
        </Link>
      </div>

      <div className="px-10 md:px-16">
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
                <div className="text-gray-500">
                  {event.created_at ? new Date(event.created_at).toLocaleDateString() : ""}
                </div>
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
                <div className="text-gray-500">
                  {event.created_at ? new Date(event.created_at).toLocaleDateString() : ""}
                </div>
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
                className="text-gray-700 text-justify" 
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

          {/* Navigation Buttons */}
          <div className="max-w-3xl mx-auto py-6 flex justify-between">
            {previous ? (
              <Link 
                href={route('events.show', previous.url)} 
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Previous
              </Link>
            ) : (
              <span></span>
            )}
            {next ? (
              <Link 
                href={route('events.show', next.url)} 
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Next
              </Link>
            ) : (
              <span></span>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
