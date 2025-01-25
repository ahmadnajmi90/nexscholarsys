import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import useRoles from '@/Hooks/useRoles';
import EventCard from './Partials/EventCard';

const Event = ( { events, users} ) => {
    const { isAdmin, isPostgraduate, isUndergraduate, isFacultyAdmin, isAcademician } = useRoles();
    return (
        <MainLayout title="Event">
            <EventCard 
            events={events}/>
        </MainLayout>
    );
};

export default Event;
