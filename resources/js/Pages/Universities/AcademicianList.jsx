import React from "react";
import ProfileCard from '@/Components/ProfileCard';
import MainLayout from '@/Layouts/MainLayout';

const AcademicianList = ({ academicians, faculties, researchOptions, universities, isFacultyAdmin, isPostgraduate, isUndergraduate }) => {
    return (
        <MainLayout title="Academician" isPostgraduate={isPostgraduate} isUndergraduate={isUndergraduate} isFacultyAdmin={isFacultyAdmin}>
            <ProfileCard 
                profilesData={academicians} 
                supervisorAvailabilityKey="availability_as_supervisor" 
                universitiesList={universities} 
                isFacultyAdminDashboard={true}
                faculties={faculties}
                isPostgraduateList={false}
                researchOptions={researchOptions}/>
        </MainLayout>
    );
};

export default AcademicianList;
