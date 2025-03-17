import React from "react";
import ProfileCard from '@/Components/ProfileCard';
import MainLayout from '@/Layouts/MainLayout';
import useRoles from '@/Hooks/useRoles';
import { Link } from '@inertiajs/react';

const PostgraduateList = ({ postgraduates, faculties, researchOptions, universities, faculty, university, users, skills }) => {
  const { isAdmin, isPostgraduate, isUndergraduate, isFacultyAdmin, isAcademician } = useRoles();
  
  return (
    <MainLayout title="Postgraduate List">
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
          <h1 className="mt-8 text-2xl md:text-3xl sm:text-lg font-bold text-gray-800">
            {faculty.name}
          </h1>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="md:mt-40 mt-36 border-b border-gray-300 mb-10">
          <div className="flex md:space-x-16 space-x-6 md:ml-0 ml-4">
          <Link
            href={route('faculties.academicians', faculty.id)}
            className="md:text-lg text-normal font-semibold text-gray-600 hover:text-blue-600 pb-2"
          >
            Academician
          </Link>
          <Link
            href={route('faculties.postgraduates', faculty.id)}
            className="md:text-lg text-normal font-semibold text-blue-600 hover:text-blue-800 border-b-2 border-blue-600 pb-2"
          >
            Postgraduate
          </Link>
          <Link
            href={route('faculties.undergraduates', faculty.id)}
            className="md:text-lg text-normal font-semibold text-gray-600 hover:text-blue-600 pb-2"
          >
            Undergraduate
          </Link>
        </div>
      </div>

      <ProfileCard 
          profilesData={postgraduates} 
          supervisorAvailabilityKey="supervisorAvailability" 
          universitiesList={universities} 
          isFacultyAdminDashboard={true}
          faculties={faculties}
          isPostgraduateList={true}  // Set to true for postgraduates
          isUndergraduateList={true} 
          users={users}
          researchOptions={researchOptions}
          skills={skills}/>
    </MainLayout>
  );
};

export default PostgraduateList;
