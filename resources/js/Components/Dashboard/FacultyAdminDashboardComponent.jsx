import React from 'react';
import { FaUsers, FaGraduationCap, FaProjectDiagram, FaEye, FaChartLine } from 'react-icons/fa';
import { Link } from '@inertiajs/react';

const FacultyAdminDashboardComponent = ({ dashboardData }) => {
    // Early return with error message if data is not available
    if (!dashboardData) {
        return (
            <div className="bg-red-50 text-red-500 p-4 rounded-lg">
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

    // Personnel Snapshot Component
    const PersonnelSnapshot = () => (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Faculty Personnel Snapshot</h2>
                <FaUsers className="text-blue-500 text-xl" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Academicians Card */}
                <div className="bg-blue-50 rounded-lg p-4 flex items-center">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                        <FaGraduationCap className="text-blue-700 text-xl" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-600">ACADEMICIANS</h3>
                        <p className="text-3xl font-bold text-blue-700">{academiciansCount}</p>
                    </div>
                </div>

                {/* Students Card */}
                <div className="bg-green-50 rounded-lg p-4 flex items-center">
                    <div className="bg-green-100 p-3 rounded-full mr-4">
                        <FaUsers className="text-green-700 text-xl" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-600">STUDENTS</h3>
                        <p className="text-3xl font-bold text-green-700">{studentsCount}</p>
                        <div className="text-xs text-gray-500 mt-1">
                            <span className="mr-2">Postgraduates: {studentsBreakdown.postgraduates}</span>
                            <span>Undergraduates: {studentsBreakdown.undergraduates}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Research Output Component
    const ResearchOutput = () => (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Faculty Research Output</h2>
                <FaProjectDiagram className="text-purple-500 text-xl" />
            </div>
            <div className="bg-purple-50 rounded-lg p-4 flex items-center">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                    <FaProjectDiagram className="text-purple-700 text-xl" />
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-gray-600">PUBLISHED PROJECTS</h3>
                    <p className="text-3xl font-bold text-purple-700">{projectsCount}</p>
                </div>
            </div>
        </div>
    );

    // Top Viewed Academicians Component
    const TopViewedAcademicians = () => (
        <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Top Viewed Academicians</h2>
                <FaChartLine className="text-indigo-500 text-xl" />
            </div>
            
            {topViewedAcademicians && topViewedAcademicians.length > 0 ? (
                <div className="space-y-4">
                    {topViewedAcademicians.map((academician) => (
                        <div key={academician.id} className="flex items-center p-3 border-b">
                            <div className="w-10 h-10 rounded-full overflow-hidden mr-3 border border-gray-200">
                                <img 
                                    src={`/storage/${academician.profile_picture || 'profile_pictures/default.jpg'}`} 
                                    alt="Profile" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <Link 
                                    href={route('academicians.show', academician)}
                                    className="font-medium text-gray-900 hover:text-blue-600"
                                >
                                    {academician.full_name}
                                </Link>
                                <p className="text-xs text-gray-500">{academician.current_position || 'Position not specified'}</p>
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                                <FaEye className="text-gray-400 mr-1" />
                                <span>{academician.total_views || 0}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-6 text-center text-gray-500">
                    <p>No profile view data available yet</p>
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">
                    {faculty?.name || 'Faculty'} Dashboard
                </h1>
                <div className="text-sm text-gray-500">
                    {faculty?.university?.full_name || 'University'}
                </div>
            </div>

            {/* Grid Layout for Dashboard Components */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="space-y-6">
                        <PersonnelSnapshot />
                        <ResearchOutput />
                    </div>
                </div>
                <div className="lg:col-span-1">
                    <TopViewedAcademicians />
                </div>
            </div>
        </div>
    );
};

export default FacultyAdminDashboardComponent; 