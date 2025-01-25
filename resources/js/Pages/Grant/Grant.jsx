import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import useRoles from '@/Hooks/useRoles';
import GrantCard from './Partials/GrantCard';

const Grant = ( { grants, users } ) => {
    const { isAdmin, isPostgraduate, isUndergraduate, isFacultyAdmin, isAcademician } = useRoles();
    return (
        <MainLayout title="Grant">
            <GrantCard 
            grants={grants}/>
        </MainLayout>
    );
};

export default Grant;