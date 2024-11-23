import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import ProfileCard from '@/Components/ProfileCard';

const Postgraduate = ( { postgraduates, isPostgraduate, universities, users } ) => {
    console.log(postgraduates);
    return (
        <MainLayout title="Postgraduate" isPostgraduate={isPostgraduate}>
            <ProfileCard 
            profilesData={postgraduates} 
            supervisorAvailabilityKey="supervisorAvailability" 
            universitiesList={universities} 
            isPostgraduateList={true}
            users={users}/>
        </MainLayout>
    );
};

export default Postgraduate;
