import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { FaArrowLeft } from 'react-icons/fa';

export default function WelcomeProjectShow() {
  const { project, previous, next, academicians, researchOptions, universities, auth } = usePage().props;
  const currentYear = new Date().getFullYear();

  // Determine the author from academicians only.
  const author =
    academicians && academicians.find(a => a.academician_id === project.author_id) || null;

  // Helper to get the field of research names from researchOptions.
  const getResearchNames = () => {
    if (!project.field_of_research) return null;
    const ids = Array.isArray(project.field_of_research)
      ? project.field_of_research
      : [project.field_of_research];
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

  // Helper to get the university name.
  const getUniversityName = () => {
    if (!project.university) return null;
    const uni = universities.find(u => String(u.id) === String(project.university));
    return uni ? uni.full_name : null;
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
          {project.title && (
            <h1 className="text-2xl md:text-3xl font-bold mb-4 text-left">{project.title}</h1>
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
                {project.created_at && (
                  <div className="text-gray-500">
                    {new Date(project.created_at).toLocaleDateString()}
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
                {project.created_at && (
                  <div className="text-gray-500">
                    {new Date(project.created_at).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Banner */}
          {project.image && (
            <img 
              src={`/storage/${project.image}`} 
              alt="Banner" 
              className="w-full h-auto md:h-64 object-cover mb-4"
            />
          )}

          {/* Description with heading */}
          {project.description && (
            <div className="mb-4">
              <h2 className="text-xl font-bold mb-2">Description</h2>
              <div 
                className="mb-4 text-gray-700 prose w-full text-justify max-w-none" 
                dangerouslySetInnerHTML={{ __html: project.description }} 
              />
            </div>
          )}

          {/* Project Details (listed in a single column) */}
          <div className="mb-4 space-y-2">
            {project.project_theme && (
              <p>
                <span className="font-semibold">Project Theme:</span> {project.project_theme}
              </p>
            )}
            {project.purpose && (
              <p>
                <span className="font-semibold">Purpose:</span> {Array.isArray(project.purpose) ? project.purpose.join(", ") : project.purpose}
              </p>
            )}
            {project.start_date && (
              <p>
                <span className="font-semibold">Start Date:</span>{" "}
                {new Date(project.start_date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
            )}
            {project.end_date && (
              <p>
                <span className="font-semibold">End Date:</span>{" "}
                {new Date(project.end_date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
            )}
            {project.application_deadline && (
              <p>
                <span className="font-semibold">Application Deadline:</span>{" "}
                {new Date(project.application_deadline).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
            )}
            {project.duration && (
              <p>
                <span className="font-semibold">Duration:</span> {project.duration} <span>(months)</span>
              </p>
            )}
            {project.sponsored_by && (
              <p>
                <span className="font-semibold">Sponsored By:</span> {project.sponsored_by}
              </p>
            )}
            {project.category && (
              <p>
                <span className="font-semibold">Category:</span> {project.category}
              </p>
            )}
            {project.field_of_research && getResearchNames() && (
              <p>
                <span className="font-semibold">Field of Research:</span> {getResearchNames()}
              </p>
            )}
            {project.supervisor_category && (
              <p>
                <span className="font-semibold">Supervisor Category:</span> {project.supervisor_category}
              </p>
            )}
            {project.supervisor_name && (
              <p>
                <span className="font-semibold">Supervisor Name:</span> {project.supervisor_name}
              </p>
            )}
            {project.university && getUniversityName() && (
              <p>
                <span className="font-semibold">University:</span> {getUniversityName()}
              </p>
            )}
            {project.email && (
              <p>
                <span className="font-semibold">Email:</span> {project.email}
              </p>
            )}
            {project.origin_country && (
              <p>
                <span className="font-semibold">Origin Country:</span> {project.origin_country}
              </p>
            )}
            {project.student_nationality && (
              <p>
                <span className="font-semibold">Student Nationality:</span> {project.student_nationality}
              </p>
            )}
            {project.student_level && (
              <p>
                <span className="font-semibold">Student Level:</span> {project.student_level}
              </p>
            )}
            {project.appointment_type && (
              <p>
                <span className="font-semibold">Appointment Type:</span> {project.appointment_type}
              </p>
            )}
            {project.purpose_of_collaboration && (
              <p>
                <span className="font-semibold">Purpose of Collaboration:</span> {project.purpose_of_collaboration}
              </p>
            )}
            {project.amount && (
              <p>
                <span className="font-semibold">Amount:</span> {project.amount}
              </p>
            )}
            {project.application_url && (
              <p>
                <span className="font-semibold">Application:</span>
                <a
                  href={project.application_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-500 underline"
                >
                  Apply
                </a>
              </p>
            )}
          </div>

          {/* Attachment */}
          {project.attachment && (
            <div className="mb-2">
              <p>
                <span className="font-semibold">Attachment:</span>{" "}
                <a
                  href={`/storage/${project.attachment}`}
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
