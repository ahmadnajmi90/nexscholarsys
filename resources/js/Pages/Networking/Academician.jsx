import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import ProfileCard from '@/Components/ProfileCard';

const Academician = ( {academicians, isPostgraduate, universities} ) => {
    console.log(academicians);
    return (
        <MainLayout title="Academician" isPostgraduate={isPostgraduate}>
            <ProfileCard profilesData={academicians} supervisorAvailabilityKey="availability_as_supervisor" universitiesList={universities}/>
        </MainLayout>
    );
};

export default Academician;
