import React from "react";
import ProfileCard from '@/Components/ProfileCard';
import MainLayout from '@/Layouts/MainLayout';
import useRoles from '@/Hooks/useRoles';
import { Link } from '@inertiajs/react';

const AcademicianList = ({ academicians, faculties, researchOptions, universities, faculty, university, users }) => {
    const { isAdmin, isPostgraduate, isUndergraduate, isFacultyAdmin, isAcademician } = useRoles();
    
    return (
        <MainLayout title="">

             {/* faculty Banner and Details Section */}
             <div className="relative bg-gray-200">
                {/* Banner Image */}
                <div className="w-full h-64 overflow-hidden">
                    <img
                        src={ `/storage/${university.background_image}`
                        }
                        alt="Faculty Banner"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* faculty Logo and Details */}
                <div className="absolute top-40 left-1/2 transform -translate-x-1/2 w-full max-w-4xl text-center">
                    <div className="inline-block w-32 h-32 rounded-full overflow-hidden border-4 border-white">
                        <img
                            src={`/storage/${university.profile_picture}`
                            }
                            alt="Faculty Logo"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <h1 className="mt-8 text-3xl font-bold text-gray-800">
                        {faculty.name}
                    </h1>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="mt-40 border-b border-gray-300 mb-10">
                <div className="flex space-x-16 ml-8">
                    {/* <Link
                        href="#"
                        className="text-lg font-semibold text-gray-600 hover:text-blue-600 pb-2"
                    >
                        Top Management
                    </Link> */}
                    <Link
                        href={route('faculties.academicians', faculty.id)}
                        className="text-lg font-semibold text-blue-600 hover:text-blue-800 border-b-2 border-blue-600 pb-2"
                        >
                        Academician
                    </Link>
                    <Link
                        href={route('faculties.postgraduates', faculty.id)}
                        className="text-lg font-semibold text-gray-600 hover:text-blue-600 pb-2"
                        >
                        Postgraduate
                    </Link>
                    <Link
                        href={route('faculties.undergraduates', faculty.id)}
                        className="text-lg font-semibold text-gray-600 hover:text-blue-600 pb-2"
                        >
                        Undergraduate
                    </Link>
                </div>
            </div>

            <ProfileCard 
                profilesData={academicians} 
                supervisorAvailabilityKey="availability_as_supervisor" 
                universitiesList={universities} 
                isFacultyAdminDashboard={true}
                faculties={faculties}
                isPostgraduateList={false}
                users={users}
                researchOptions={researchOptions}/>
        </MainLayout>
    );
};

export default AcademicianList;
