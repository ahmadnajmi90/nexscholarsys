import React from 'react';
import { format } from 'date-fns';
import { 
  User2, 
  GraduationCap, 
  Mail, 
  Phone,
  Briefcase,
  Globe,
  CalendarClock
} from 'lucide-react';

/**
 * UnifiedOverviewTab - Shows person information (supervisor or student)
 * Replaces: StudentOverviewTab + SupervisorOverviewTab
 * 
 * @param {Object} relationship - The supervision relationship
 * @param {Object} person - The person to display (academician for student view, student for supervisor view)
 * @param {string} userRole - 'student' or 'supervisor' (who is viewing)
 * @param {Object} activeUnbindRequest - Active unbind request if any
 */
export default function UnifiedOverviewTab({ relationship, person, userRole, activeUnbindRequest }) {
  const acceptedAt = relationship?.accepted_at ? format(new Date(relationship.accepted_at), 'dd/MM/yyyy') : '—';
  const meetings = relationship?.meetings ?? [];
  const hasMeetings = meetings.length > 0;

  // Get person type label
  const personTypeLabel = userRole === 'student' ? 'Supervisor' : 'Student';

  return (
    <div className="p-6 space-y-6">
      {/* Person Summary Card */}
      <section className="border border-slate-200 rounded-lg p-6 bg-white shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">{personTypeLabel} Summary</h3>

        <div className="space-y-4">
          {userRole === 'student' ? (
            // Student viewing supervisor (academician)
            <>
              <div className="grid grid-cols-2 gap-4">
                <InfoItem icon={User2} label="Full Name" value={person.full_name || '—'} />
                <InfoItem icon={Briefcase} label="Position" value={person.current_position || '—'} />
                <InfoItem icon={Mail} label="Email" value={person.user?.email || '—'} />
                <InfoItem icon={Phone} label="Phone" value={person.user?.academician?.phone_number || person.phone_number || '—'} />
              </div>

              {(person.university || person.faculty || person.department) && (
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-slate-500" />
                    Institution
                  </h4>
                  <div className="space-y-2">
                    {person.university && (
                      <div className="text-sm">
                        <span className="font-medium text-slate-700">University: </span>
                        <span className="text-slate-600">
                          {person.university?.full_name || person.university_details?.full_name || '—'}
                        </span>
                      </div>
                    )}
                    {person.faculty && (
                      <div className="text-sm">
                        <span className="font-medium text-slate-700">Faculty: </span>
                        <span className="text-slate-600">{person.faculty.name || '—'}</span>
                      </div>
                    )}
                    {person.department && (
                      <div className="text-sm">
                        <span className="font-medium text-slate-700">Department: </span>
                        <span className="text-slate-600">{person.department}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {person.research_areas && Array.isArray(person.research_areas) && person.research_areas.length > 0 && (
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-semibold text-slate-700 mb-3">Research Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {person.research_areas.slice(0, 3).map((area, index) => (
                      <span key={index} className="px-2.5 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {area}
                      </span>
                    ))}
                    {person.research_areas.length > 3 && (
                      <span className="px-2.5 py-1 text-xs rounded-full bg-slate-100 text-slate-600">
                        +{person.research_areas.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {person.bio && (
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">Bio</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{person.bio}</p>
                </div>
              )}
            </>
          ) : (
            // Supervisor viewing student
            <>
              <div className="grid grid-cols-2 gap-4">
                <InfoItem icon={User2} label="Full Name" value={person.full_name || '—'} />
                <InfoItem icon={Mail} label="Email" value={person.email || person.user?.email || '—'} />
                <InfoItem icon={Phone} label="Phone" value={person.phone_number || '—'} />
                <InfoItem icon={Globe} label="Nationality" value={person.nationality || '—'} />
              </div>

              {person.university_details && (
                <div className="pt-4 border-t">
                  <div className="grid grid-cols-2 gap-4">
                    <InfoItem icon={GraduationCap} label="University" value={person.university_details.full_name || '—'} />
                    {person.faculty && (
                      <InfoItem icon={GraduationCap} label="Faculty" value={person.faculty.name || '—'} />
                    )}
                  </div>
                </div>
              )}

              {person.bio && (
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">Bio</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{person.bio}</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Supervision Summary Card - IDENTICAL for both views */}
      <section className="border border-slate-200 rounded-lg p-6 bg-white shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          {userRole === 'student' ? 'Supervision Details' : 'Supervision Summary'}
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InfoItem 
              label="Role" 
              value={relationship.role === 'main' ? 'Main Supervisor' : 'Co-Supervisor'} 
            />
            <InfoItem 
              label="Status" 
              value={activeUnbindRequest 
                ? 'Pending Unbind' 
                : (relationship.status.charAt(0).toUpperCase() + relationship.status.slice(1))
              } 
            />
            <InfoItem 
              label="Cohort" 
              value={relationship.cohort || '—'} 
            />
            <InfoItem 
              label="Meeting Cadence" 
              value={relationship.meeting_cadence 
                ? (relationship.meeting_cadence.charAt(0).toUpperCase() + relationship.meeting_cadence.slice(1)) 
                : 'Not set'
              } 
            />
            <InfoItem 
              label="Started" 
              value={acceptedAt} 
            />
            <InfoItem 
              label="NexLab" 
              value={relationship.scholarlab_board_id 
                ? (userRole === 'student' ? 'Active Workspace' : 'Active')
                : 'Not provisioned'
              } 
            />
          </div>
        </div>
      </section>

      {/* Meeting Details Card - IDENTICAL for both views - Only show if meetings exist */}
      {hasMeetings && (
        <section className="border border-slate-200 rounded-lg p-6 bg-white shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <CalendarClock className="h-5 w-5 text-slate-900" />
            <h3 className="text-lg font-semibold text-slate-900">Next Meeting</h3>
          </div>

          <div className="space-y-4">
            {meetings.slice(0, 1).map((meeting, index) => (
              <div key={meeting.id || index} className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-slate-500 mb-1">Date:</div>
                  <div className="font-medium text-slate-900">
                    {meeting.scheduled_for ? format(new Date(meeting.scheduled_for), 'dd/MM/yyyy HH:mm') : '—'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-500 mb-1">Type:</div>
                  <div className="font-medium text-slate-900">
                    {meeting.type || 'Online'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

/**
 * InfoItem component - displays a label-value pair with optional icon
 */
function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2">
      {Icon && <Icon className="mt-0.5 h-4 w-4 text-slate-400 flex-shrink-0" />}
      <div className="min-w-0 flex-1">
        <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
        <div className="text-sm text-slate-700 break-words">{value || '—'}</div>
      </div>
    </div>
  );
}

