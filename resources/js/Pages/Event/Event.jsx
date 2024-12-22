import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import PostingCard from '@/Components/PostingCard';

const Event = ( { events, isPostgraduate, users} ) => {
    console.log(events);
    return (
        <MainLayout title="Event" isPostgraduate={isPostgraduate}>
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
