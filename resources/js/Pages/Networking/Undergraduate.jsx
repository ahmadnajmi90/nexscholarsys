import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import ProfileCard from '@/Components/ProfileCard';

const Undergraduate = ( { undergraduates, isPostgraduate, isUndergraduate, universities, users, researchOptions } ) => {
    return (
        <MainLayout title="Undergraduate" isPostgraduate={isPostgraduate} isUndergraduate={isUndergraduate}>
            <ProfileCard 
            profilesData={undergraduates}
            universitiesList={universities} 
            isPostgraduateList={true}
            isUndergraduateList={true}
            users={users}
            researchOptions={researchOptions}/>
        </MainLayout>
    );
};

export default Undergraduate;
