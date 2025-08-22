import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import useRoles from '@/Hooks/useRoles';
import EventCard from './Partials/EventCard';

const Event = ( { events, users, researchOptions } ) => {
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

    return (
        <MainLayout title="Event">
            <EventCard 
            events={events}
            researchOptions={researchOptions}
            isLoading={isLoading} />
        </MainLayout>
    );
};

export default Event;
