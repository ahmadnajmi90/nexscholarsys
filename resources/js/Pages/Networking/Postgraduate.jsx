import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import ProfileCard from '@/Components/ProfileCard';

const Postgraduate = ( { postgraduates, isPostgraduate, isUndergraduate, universities, users, researchOptions } ) => {
    console.log(postgraduates);
    return (
        <MainLayout title="Postgraduate" isPostgraduate={isPostgraduate} isUndergraduate={isUndergraduate}>
            <ProfileCard 
            profilesData={postgraduates} 
            supervisorAvailabilityKey="supervisorAvailability" 
            universitiesList={universities} 
            isPostgraduateList={true}
            users={users}
            researchOptions={researchOptions}/>
        </MainLayout>
    );
};

export default Postgraduate;
