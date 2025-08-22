import React, { useState, useEffect, useCallback } from 'react';
import { router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import ProfileCard from '@/Pages/Networking/partials/StudentProfileCard';
import useRoles from '@/Hooks/useRoles';

const Postgraduate = ( { postgraduates, universities, faculties, users, researchOptions, skills, searchQuery } ) => {
    const { isAdmin, isPostgraduate, isUndergraduate, isFacultyAdmin, isAcademician } = useRoles();
    const [isLoading, setIsLoading] = useState(false);

      // Add useEffect to track Inertia's processing state
  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleFinish = () => setIsLoading(false);

    // Capture the remover function returned by router.on()
    const removeStartListener = router.on('start', handleStart);
    const removeFinishListener = router.on('finish', handleFinish);

    // Use the remover functions in the cleanup phase
    return () => {
      removeStartListener();
      removeFinishListener();
    };
  }, []);

  // Define search handler function with useCallback
  const handleSearch = useCallback((searchTerm) => {
    router.get(route('postgraduates.index'), 
      { search: searchTerm }, 
      { preserveState: true, replace: true }
    );
  }, []);

    return (
        <MainLayout title="Postgraduate">
            <ProfileCard 
            profilesData={postgraduates} 
            supervisorAvailabilityKey="supervisorAvailability" 
            universitiesList={universities} 
            faculties={faculties}
            isPostgraduateList={true}
            isUndergraduateList={false}
            users={users}
            researchOptions={researchOptions}
            skills={skills}
            searchQuery={searchQuery || ""}
            isLoading={isLoading}
            onSearch={handleSearch} />
        </MainLayout>
    );
};

export default Postgraduate;
