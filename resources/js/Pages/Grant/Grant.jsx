import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import PostingCard from '@/Components/PostingCard';
import useRoles from '@/Hooks/useRoles';

const Grant = ( { grants, users } ) => {
    const { isAdmin, isPostgraduate, isUndergraduate, isFacultyAdmin, isAcademician } = useRoles();
    return (
        <MainLayout title="Grant">
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
