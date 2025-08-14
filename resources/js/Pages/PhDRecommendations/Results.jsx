import React, { useMemo, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import ProgramCard from '@/Components/PhD/ProgramCard';
import MainLayout from '@/Layouts/MainLayout';
import { CheckCircle2, Search, Filter, GraduationCap, ArrowLeft } from 'lucide-react';
import SupervisorCard from '@/Components/PhD/SupervisorCard';
import toast from 'react-hot-toast';

export default function Results({ recommendations = [], selectedProgram = null, supervisors = [] }) {
  const [query, setQuery] = useState('');
  const [supervisorQuery, setSupervisorQuery] = useState('');
  const [sortBy, setSortBy] = useState('match_score_desc');
  const pageTitle = !selectedProgram ? 'PhD Program Recommendations' : 'Available Supervisors';
  
  const handleViewSupervisors = (program) => {
    if (!program?.id) return toast.error('Program not found');
    router.get(route('phd-recommendations.supervisors', program.id));
  };
  const handleBackToPrograms = () => {
    router.get(route('phd-recommendations.results'));
  };

  const filtered = useMemo(() => {
    let list = Array.isArray(recommendations) ? recommendations.slice() : [];

    if (query) {
      const q = query.toLowerCase();
      list = list.filter(rec => {
        const program = rec.phd_program;
        if (!program) return false; // Safety check for nested data

        const nameMatch = (program.name || '').toLowerCase().includes(q);
        const universityMatch = (program.university?.name || '').toLowerCase().includes(q);
        const facultyMatch = (program.faculty?.name || '').toLowerCase().includes(q);
        const countryMatch = (program.country || '').toLowerCase().includes(q);
        // Optional: research area matching if available
        // const researchAreaMatch = program.research_areas?.some(area => area.toLowerCase().includes(q));

        return nameMatch || universityMatch || facultyMatch || countryMatch; // || researchAreaMatch
      });
    }

    if (sortBy === 'match_score_desc') {
      list.sort((a, b) => (b.match_score || 0) - (a.match_score || 0));
    }

    return list;
  }, [recommendations, query, sortBy]);

  // Removed axios fetching; supervisors now arrive via Inertia props
  const filteredSupervisors = useMemo(() => {
      if (!supervisorQuery) {
          return supervisors;
      }
      const query = supervisorQuery.toLowerCase();
      // The 'name' property is directly available on the supervisor object.
      return supervisors.filter(s => 
          (s.name || '').toLowerCase().includes(query)
      );
  }, [supervisors, supervisorQuery]);
  const isLoadingSupervisors = false;

  return (
    <MainLayout title={pageTitle}>
      <div className="max-w-6xl mx-auto p-6">
        <Head title={pageTitle} />
        {!selectedProgram ? (
          <>
            {/* Analysis Complete Banner */}
            <div className="flex items-start gap-3 bg-green-50 border border-green-200 text-green-900 px-4 py-3 rounded-md mb-5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <div className="flex flex-col ml-1 text-sm">
                  <p className="font-semibold">Analysis Complete!</p>
                  <p>We found {filtered.length} highly compatible PhD programs based on your profile and research interests.</p>
                </div>
              </div>
            </div>

            {/* Search + Filters + Sort */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
              <div className="flex items-center gap-2 w-full md:max-w-xl">
                <div className="flex items-center gap-2 flex-1 border border-gray-300 rounded-md px-3 bg-white">
                  <Search className="w-4 h-4 text-gray-500" />
                  <input
                    value={query}
                    onChange={(e)=>setQuery(e.target.value)}
                    placeholder="Search programs, universities, or research areas..."
                    className="border border-white w-full text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md bg-white text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {filtered.map((rec, idx) => (
                <ProgramCard key={idx} rec={rec} onViewSupervisors={() => handleViewSupervisors(rec.phd_program)} />
              ))}
            </div>

            <div className="text-center mt-12 py-8 border-t border-gray-200">
              <p className="text-gray-600 mb-4">
                  Not seeing the perfect program? Try refining your search or contact our academic advisors.
              </p>
              <Link
                  href={route('phd-recommendations.index')}
                  className="inline-flex items-center px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                  Refine Search Criteria
              </Link>
          </div>
          </>
        ) : (
          <div>
            <div className="mb-6">
              <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center" onClick={handleBackToPrograms}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to All Programs
              </button>
              <div className="mt-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                  <div className="flex flex-col ml-1">
                    <h2 className="text-m font-normal text-blue-900">{selectedProgram?.name}</h2>
                    <p className="text-sm text-blue-600">{selectedProgram?.faculty?.name}, {selectedProgram?.university?.full_name}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
              <div className="flex items-center gap-2 w-full md:max-w-xl">
                <div className="flex items-center gap-2 flex-1 border border-gray-300 rounded-md px-3 bg-white">
                  <Search className="w-4 h-4 text-gray-500" />
                  <input
                    value={supervisorQuery}
                    onChange={(e)=>setSupervisorQuery(e.target.value)}
                    placeholder="Search supervisors..."
                    className="border border-white w-full text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md bg-white text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {filteredSupervisors.map((s) => (
                <SupervisorCard key={s.id} supervisor={s} />
              ))}
              {supervisors.length === 0 && (
                <div className="text-center text-gray-600 py-10 col-span-2">No supervisors found for this program.</div>
              )}
            </div>
            {/* Conditionally rendered footer */}
            {!isLoadingSupervisors && supervisors.length > 0 && (
              <div className="text-center mt-12 py-8 border-t border-gray-200">
                <p className="text-gray-600 mb-4">
                  Want to explore other programs? Check out our other recommendations.
                </p>
                <Link
                  href={route('phd-recommendations.results')}
                  className="inline-flex items-center px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to All Programs
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

