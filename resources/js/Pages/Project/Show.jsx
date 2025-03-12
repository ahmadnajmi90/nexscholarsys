import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { FaArrowLeft } from 'react-icons/fa';
import useRoles from '@/Hooks/useRoles';

export default function Show() {
  const { project, previous, next, academicians, researchOptions, universities } = usePage().props;
  const { isAcademician } = useRoles();

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
    <MainLayout>
      {/* Back arrow */}
      <div className="absolute top-[1.8rem] left-2 md:top-[5.5rem] md:left-[19.5rem] z-50">
        <Link 
          href={route('projects.index')}
          className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600"
        >
          <FaArrowLeft className="text-lg md:text-xl" />
        </Link>
      </div>

      <div className="px-10 md:px-16">
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
                <div className="text-gray-500">
                  {project.created_at ? new Date(project.created_at).toLocaleDateString() : ""}
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
                  {project.created_at ? new Date(project.created_at).toLocaleDateString() : ""}
                </div>
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

        {/* Navigation Buttons */}
        <div className="max-w-3xl mx-auto py-6 flex justify-between">
          {previous ? (
            <Link 
              href={route('projects.show', previous.url)} 
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Previous
            </Link>
          ) : (
            <span></span>
          )}
          {next ? (
            <Link 
              href={route('projects.show', next.url)} 
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
