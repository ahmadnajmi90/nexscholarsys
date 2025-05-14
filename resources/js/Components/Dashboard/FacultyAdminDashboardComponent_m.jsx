import React from 'react';
import { FaUsers, FaGraduationCap, FaProjectDiagram, FaEye, FaChartLine } from 'react-icons/fa';
import { Link } from '@inertiajs/react';

const FacultyAdminDashboardComponent_m = ({ dashboardData }) => {
    // Early return with error message if data is not available
    if (!dashboardData) {
        return (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-xs">
                <p>Unable to load faculty dashboard data. Please contact support.</p>
            </div>
        );
    }

    const { 
        faculty,
        academiciansCount, 
        studentsCount, 
        studentsBreakdown,
        projectsCount, 
        topViewedAcademicians 
    } = dashboardData;

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
                <h1 className="text-xl font-bold">
                    {faculty?.name || 'Faculty'} Dashboard
                </h1>
            </div>
            <p className="text-xs text-gray-500 mb-4">{faculty?.university?.full_name || 'University'}</p>

            {/* Faculty Personnel Snapshot */}
            <div className="bg-white shadow rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-base font-semibold">Faculty Personnel</h2>
                    <FaUsers className="text-blue-500" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {/* Academicians Card */}
                    <div className="bg-blue-50 rounded-lg p-3 flex flex-col">
                        <div className="flex items-center mb-2">
                            <div className="bg-blue-100 p-2 rounded-full mr-2">
                                <FaGraduationCap className="text-blue-700 text-sm" />
                            </div>
                            <h3 className="text-xs font-semibold text-gray-600">ACADEMICIANS</h3>
                        </div>
                        <p className="text-xl font-bold text-blue-700">{academiciansCount}</p>
                    </div>

                    {/* Students Card */}
                    <div className="bg-green-50 rounded-lg p-3 flex flex-col">
                        <div className="flex items-center mb-2">
                            <div className="bg-green-100 p-2 rounded-full mr-2">
                                <FaUsers className="text-green-700 text-sm" />
                            </div>
                            <h3 className="text-xs font-semibold text-gray-600">STUDENTS</h3>
                        </div>
                        <p className="text-xl font-bold text-green-700">{studentsCount}</p>
                        <div className="text-[10px] text-gray-500 mt-1">
                            <div>PG: {studentsBreakdown.postgraduates}</div>
                            <div>UG: {studentsBreakdown.undergraduates}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Faculty Research Output */}
            <div className="bg-white shadow rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-base font-semibold">Research Output</h2>
                    <FaProjectDiagram className="text-purple-500" />
                </div>
                <div className="bg-purple-50 rounded-lg p-3 flex items-center">
                    <div className="bg-purple-100 p-2 rounded-full mr-3">
                        <FaProjectDiagram className="text-purple-700 text-sm" />
                    </div>
                    <div>
                        <h3 className="text-xs font-semibold text-gray-600">PUBLISHED PROJECTS</h3>
                        <p className="text-xl font-bold text-purple-700">{projectsCount}</p>
                    </div>
                </div>
            </div>

            {/* Top Viewed Academicians */}
            <div className="bg-white shadow rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-base font-semibold">Top Viewed Academicians</h2>
                    <FaChartLine className="text-indigo-500" />
                </div>
                
                {topViewedAcademicians && topViewedAcademicians.length > 0 ? (
                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                        {topViewedAcademicians.map((academician) => (
                            <div key={academician.id} className="flex items-center p-2 border-b">
                                <div className="w-8 h-8 rounded-full overflow-hidden mr-2 border border-gray-200">
                                    <img 
                                        src={`/storage/${academician.profile_picture || 'profile_pictures/default.jpg'}`} 
                                        alt="Profile" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <Link 
                                        href={route('academicians.show', academician)}
                                        className="font-medium text-sm text-gray-900 hover:text-blue-600"
                                    >
                                        {academician.full_name}
                                    </Link>
                                    <p className="text-xs text-gray-500">{academician.current_position || 'Position N/A'}</p>
                                </div>
                                <div className="flex items-center text-xs text-gray-500">
                                    <FaEye className="text-gray-400 mr-1 text-xs" />
                                    <span>{academician.total_views || 0}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-4 text-center text-xs text-gray-500">
                        <p>No profile view data available yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FacultyAdminDashboardComponent_m; 