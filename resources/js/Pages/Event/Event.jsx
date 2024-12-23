import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import PostingCard from '@/Components/PostingCard';

const Event = ( { events, isPostgraduate, isUndergraduate, users, isFacultyAdmin} ) => {
    console.log(events);
    return (
        <MainLayout title="Event" isPostgraduate={isPostgraduate} isUndergraduate={isUndergraduate} isFacultyAdmin={isFacultyAdmin}>
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
