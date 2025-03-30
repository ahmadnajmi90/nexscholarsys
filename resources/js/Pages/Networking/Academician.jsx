import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import ProfileCard from '@/Components/ProfileCard';
import useRoles from '@/Hooks/useRoles';


const Academician = ( {academicians, universities, faculties, users, researchOptions} ) => {
    const { isAdmin, isPostgraduate, isUndergraduate, isFacultyAdmin, isAcademician } = useRoles();
    return (
        <MainLayout title="Academician" isPostgraduate={isPostgraduate} isUndergraduate={isUndergraduate} isFacultyAdmin={isFacultyAdmin}>
            <ProfileCard 
            profilesData={academicians} 
            supervisorAvailabilityKey="availability_as_supervisor"
            universitiesList={universities} 
            faculties={faculties}
            isPostgraduateList={false}
            isUndergraduateList={false}
            users={users}
            researchOptions={researchOptions}/>
        </MainLayout>
    );
};

export default Academician;
