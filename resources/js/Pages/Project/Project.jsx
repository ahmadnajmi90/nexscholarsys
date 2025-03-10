import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import useRoles from '@/Hooks/useRoles';
import ProjectCard from './Partials/ProjectCard';

const Project = ( { projects, users} ) => {
    const { isAdmin, isPostgraduate, isUndergraduate, isFacultyAdmin, isAcademician } = useRoles();
    return (
        <MainLayout title="Project">
            <ProjectCard 
            projects={projects}/>
        </MainLayout>
    );
};

export default Project;
