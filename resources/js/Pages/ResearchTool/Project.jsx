import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import PostingCard from '@/Components/PostingCard';
import useRoles from '@/Hooks/useRoles';

const Project = ( { projects, users} ) => {
    const { isAdmin, isPostgraduate, isUndergraduate, isFacultyAdmin, isAcademician } = useRoles();
    return (
        <MainLayout title="Project">
            <PostingCard 
            data={projects} 
            title="title" 
            isProject={true}
            isEvent={false}
            isGrant={false}/>
        </MainLayout>
    );
};

export default Project;
