import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import ProfileCard from '@/Components/ProfileCard';
import useRoles from '@/Hooks/useRoles';

const Undergraduate = ( { undergraduates, universities, faculties, users, researchOptions } ) => {
    const { isAdmin, isPostgraduate, isUndergraduate, isFacultyAdmin, isAcademician } = useRoles();
    return (
        <MainLayout title="Undergraduate">
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
