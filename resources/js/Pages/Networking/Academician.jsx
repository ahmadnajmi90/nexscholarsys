import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import AcademicianProfileCard from '@/Pages/Networking/partials/AcademicianProfileCard';
import useRoles from '@/Hooks/useRoles';


const Academician = ( {academicians, universities, faculties, users, researchOptions, searchQuery} ) => {
    const { isAdmin, isPostgraduate, isUndergraduate, isFacultyAdmin, isAcademician } = useRoles();
    return (
        <MainLayout title="Academician" isPostgraduate={isPostgraduate} isUndergraduate={isUndergraduate} isFacultyAdmin={isFacultyAdmin}>
            <AcademicianProfileCard 
            profilesData={academicians} 
            universitiesList={universities} 
            faculties={faculties}
            users={users}
            researchOptions={researchOptions}
            searchQuery={searchQuery || ""}/>
        </MainLayout>
    );
};

export default Academician;
