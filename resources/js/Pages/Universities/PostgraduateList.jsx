import React, { useState, useEffect, useCallback } from "react";
import { router } from '@inertiajs/react';
import StudentProfileCard from '@/Pages/Networking/partials/StudentProfileCard';
import MainLayout from '@/Layouts/MainLayout';
import useRoles from '@/Hooks/useRoles';
import { Link, Head } from '@inertiajs/react';
import Breadcrumb from "@/Components/Breadcrumb";

const PostgraduateList = ({ postgraduates, faculties, researchOptions, universities, faculty, university, users, skills, searchQuery }) => {
  const { isAdmin, isPostgraduate, isUndergraduate, isFacultyAdmin, isAcademician } = useRoles();
  const [isLoading, setIsLoading] = useState(false);

  // Add useEffect to track Inertia's processing state
  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleFinish = () => setIsLoading(false);

    // router.on() returns a function that removes the listener.
    // We capture these remover functions.
    const removeStartListener = router.on('start', handleStart);
    const removeFinishListener = router.on('finish', handleFinish);

    // The cleanup function in the return statement will now call
    // the remover functions, which is the safe way to do this.
    return () => {
      removeStartListener();
      removeFinishListener();
    };
  }, []); // The empty dependency array is correct.

  // Define search handler function with useCallback
  const handleSearch = useCallback((searchTerm) => {
    router.get(route('faculties.postgraduates', { faculty: faculty.id }), 
      { search: searchTerm }, 
      { preserveState: true, replace: true }
    );
  }, [faculty.id]);
  
  const breadcrumbLinks = [
    { title: "Universities", url: route("universities.index") },
    { title: university.full_name, url: route("universities.faculties", { university: university.id }) },
    { title: faculty.name, url: null },
  ];

  return (
    <MainLayout title="">
      <Head title="Postgraduate List" />
      <div className="p-4 md:p-8">
        <Breadcrumb links={breadcrumbLinks} />
        {/* Faculty Banner and Details */}
        <div className="relative bg-gray-200 mt-4">
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
            <div className="flex space-x-6 md:ml-0 ml-4">
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

        <StudentProfileCard 
            profilesData={postgraduates} 
            supervisorAvailabilityKey="supervisorAvailability" 
            universitiesList={universities} 
            isFacultyAdminDashboard={true}
            faculties={faculties}
            isPostgraduateList={true}  // Set to true for postgraduates
            isUndergraduateList={false} 
            users={users}
            researchOptions={researchOptions}
            skills={skills}
            searchQuery={searchQuery || ""}
            isLoading={isLoading}
            onSearch={handleSearch} />
      </div>
    </MainLayout>
  );
};

export default PostgraduateList;
