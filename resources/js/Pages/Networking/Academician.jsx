import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import ProfileCard from '@/Components/ProfileCard';

const Academician = ( {academicians, isPostgraduate, isUndergraduate, universities, faculties, users, researchOptions, isFacultyAdmin} ) => {
    console.log(academicians);
    return (
        <MainLayout title="Academician" isPostgraduate={isPostgraduate} isUndergraduate={isUndergraduate} isFacultyAdmin={isFacultyAdmin}>
            <ProfileCard 
            profilesData={academicians} 
            supervisorAvailabilityKey="availability_as_supervisor" 
            universitiesList={universities} 
            faculties={faculties}
            isPostgraduateList={false}
            users={users}
            researchOptions={researchOptions}/>
        </MainLayout>
    );
};

export default Academician;
