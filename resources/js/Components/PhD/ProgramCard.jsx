import React, { useState } from 'react';
import { GraduationCap, Building2, MapPin, Users, Clock, DollarSign, CheckCircle2, Link, ExternalLink, Heart, Sparkles } from 'lucide-react';
import InsightModal from '@/Components/PhD/InsightModal';

export default function ProgramCard({ rec, onViewSupervisors }) {
  const program = rec.phd_program;
  if (!program) return null;

  const name = program.name || 'PhD Program';
  const university = program.university?.name || program.university?.full_name || program.university?.short_name || 'Unknown University';
  const faculty = program.faculty?.name || '';
  const scoreNumber = typeof rec.match_score === 'number' ? Math.round(rec.match_score * 100) : null;
  const score = scoreNumber !== null ? `${scoreNumber}%` : '-';
  const [isInsightModalOpen, setIsInsightModalOpen] = useState(false);
  const justification = rec.justification || '';
  const duration = program.duration_years || '';
  const funding = program.funding_info || '';
  const country = program.country || '';

  return (
    <div className="border rounded-xl p-5 bg-white flex flex-col h-full shadow-sm transition-all duration-200 ease-in-out hover:shadow-xl hover:-translate-y-1">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-5 h-5 text-blue-600" />
          </div>
          <div className="min-w-0">
            <h3 className="text-[1.05rem] font-semibold text-gray-900 leading-snug truncate" title={name}>{name}</h3>
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <span className="truncate" title={faculty ? `${faculty}, ${university}` : university}>
                {faculty ? `${faculty}` : ''}
              </span>
            </div>
          </div>
        </div>
        <div className="ml-4">
          <div className="px-2.5 py-1 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-semibold text-right">
            {score} <span className="font-normal text-[11px] text-green-700">Match</span>
          </div>
        </div>
      </div>

      {/* Meta */}
      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700">
        {university && (
          <div className="col-span-2 flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
            <span>{university}, {country}</span>
          </div>
        )}
        {duration && (
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
            <span>{duration} years</span>
          </div>
        )}
        {typeof program.supervisors_count === 'number' && (
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
            <span>{program.supervisors_count} Supervisors</span>
          </div>
        )}
        {funding && (
          <div className="col-span-2 flex items-center text-green-600">
            <DollarSign className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
            <span className="text-green-700">{funding}</span>
          </div>
        )}
      </div>

      {/* Research Areas */}
      {Array.isArray(program?.research_areas) && program.research_areas.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-800 mb-2">Research Areas:</p>
          <div className="flex flex-wrap gap-2">
              {program.research_areas.slice(0, 3).map((tag, i) => (
                  <span key={i} className="px-2.5 py-1 text-xs rounded-full bg-gray-100 text-gray-700 font-medium border border-gray-200">{tag}</span>
              ))}
          </div>
      </div>
      )}

      {/* Why this match */}
      {justification && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-900">
          <div className="flex items-center gap-2 mb-1 text-blue-800 font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>AI Insight</span>
          </div>
          <div className="flex items-start gap-2">
            <p className="leading-relaxed line-clamp-3">{justification}</p>
          </div>
          {justification.length > 200 && (
            <button onClick={() => setIsInsightModalOpen(true)} className="mt-2 text-xs text-blue-700 hover:underline">Show More…</button>
          )}
          <InsightModal
            isOpen={isInsightModalOpen}
            onClose={() => setIsInsightModalOpen(false)}
            title="AI Insight"
            content={justification}
          />
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex items-center gap-2 pt-4 border-t">
        <button onClick={() => onViewSupervisors(program)} className="inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"><Users className="w-4 h-4 mr-2" /> View Supervisors</button>
        <button className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 flex items-center"><Heart className="w-4 h-4 mr-2" /> Save</button>
        {program.application_url && (
          <a href={program.application_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-3 py-2 border rounded text-sm hover:bg-gray-50"><ExternalLink className="w-4 h-4 mr-2" /> Program Details</a>
        )}
      </div>
    </div>
  );
}

