import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import ProfileCard from '@/Components/ProfileCard';

const Undergraduate = ( { undergraduates, isPostgraduate, isUndergraduate, universities, faculties, users, researchOptions, isFacultyAdmin } ) => {
    return (
        <MainLayout title="Undergraduate" isPostgraduate={isPostgraduate} isUndergraduate={isUndergraduate} isFacultyAdmin={isFacultyAdmin}>
            <ProfileCard 
            profilesData={undergraduates}
            universitiesList={universities} 
            faculties={faculties}
            isPostgraduateList={true}
            isUndergraduateList={true}
            users={users}
            researchOptions={researchOptions}/>
        </MainLayout>
    );
};

export default Undergraduate;
