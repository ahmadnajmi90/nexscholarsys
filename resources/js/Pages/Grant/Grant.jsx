import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import PostingCard from '@/Components/PostingCard';

const Grant = ( { grants, isPostgraduate, isUndergraduate, users, isFacultyAdmin} ) => {
    console.log(grants);
    return (
        <MainLayout title="Grant" isPostgraduate={isPostgraduate} isUndergraduate={isUndergraduate} isFacultyAdmin={isFacultyAdmin}>
            <PostingCard 
            data={grants} 
            title="title" 
            isProject={false}
            isEvent={false}
            isGrant={true}/>
        </MainLayout>
    );
};

export default Grant;
