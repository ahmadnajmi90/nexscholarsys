import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import ProfileCard from '@/Components/ProfileCard';

const Postgraduate = ( { postgraduates, isPostgraduate, isUndergraduate, universities, faculties, users, researchOptions, isFacultyAdmin } ) => {
    console.log(postgraduates);
    return (
        <MainLayout title="Postgraduate" isPostgraduate={isPostgraduate} isUndergraduate={isUndergraduate} isFacultyAdmin={isFacultyAdmin}>
            <ProfileCard 
            profilesData={postgraduates} 
            supervisorAvailabilityKey="supervisorAvailability" 
            universitiesList={universities} 
            faculties={faculties}
            isPostgraduateList={true}
            users={users}
            researchOptions={researchOptions}/>
        </MainLayout>
    );
};

export default Postgraduate;
