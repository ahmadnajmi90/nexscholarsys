import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import PostingCard from '@/Components/PostingCard';

const Project = ( { projects, isPostgraduate, users} ) => {
    console.log(projects);
    return (
        <MainLayout title="Project" isPostgraduate={isPostgraduate}>
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
