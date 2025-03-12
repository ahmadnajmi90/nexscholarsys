import React from "react";
import ProfileCard from '@/Components/ProfileCard';
import MainLayout from '@/Layouts/MainLayout';
import useRoles from '@/Hooks/useRoles';
import { Link } from '@inertiajs/react';

const UndergraduateList = ({ undergraduates, faculties, researchOptions, universities, faculty, university, users, skills }) => {
  const { isAdmin, isPostgraduate, isUndergraduate, isFacultyAdmin, isAcademician } = useRoles();
  
  return (
    <MainLayout title="Undergraduate List">
      {/* Faculty Banner and Details */}
      <div className="relative bg-gray-200">
        <div className="w-full h-64 overflow-hidden">
          <img
            src={`/storage/${university.background_image}`}
            alt="Faculty Banner"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute top-40 left-1/2 transform -translate-x-1/2 w-full max-w-4xl text-center">
          <div className="inline-block w-32 h-32 rounded-full overflow-hidden border-4 border-white">
            <img
              src={`/storage/${university.profile_picture}`}
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
          <Link
            href={route('faculties.academicians', faculty.id)}
            className="text-lg font-semibold text-gray-600 hover:text-blue-600 pb-2"
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
            className="text-lg font-semibold text-blue-600 hover:text-blue-800 border-b-2 border-blue-600 pb-2"
          >
            Undergraduate
          </Link>
        </div>
      </div>

      <ProfileCard 
          profilesData={undergraduates} 
          supervisorAvailabilityKey="supervisorAvailability" 
          universitiesList={universities} 
          isFacultyAdminDashboard={true}
          faculties={faculties}
          isPostgraduateList={true}  // Set to false for undergraduates
          isUndergraduateList={true}  // Set to true for undergraduates
          users={users}
          researchOptions={researchOptions}
          skills={skills}/>
    </MainLayout>
  );
};

export default UndergraduateList;
