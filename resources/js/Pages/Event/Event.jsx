import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import PostingCard from '@/Components/PostingCard';
import useRoles from '@/Hooks/useRoles';

const Event = ( { events, users} ) => {
    const { isAdmin, isPostgraduate, isUndergraduate, isFacultyAdmin, isAcademician } = useRoles();
    return (
        <MainLayout title="Event">
            <PostingCard 
            data={events} 
            title="event_name" 
            isProject={false}
            isEvent={true}
            isGrant={false}/>
        </MainLayout>
    );
};

export default Event;
