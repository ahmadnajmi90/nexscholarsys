import React from "react";
import ProfileCard from '@/Components/ProfileCard';
import MainLayout from '@/Layouts/MainLayout';
import useRoles from '@/Hooks/useRoles';

const AcademicianList = ({ academicians, faculties, researchOptions, universities }) => {
    const { isAdmin, isPostgraduate, isUndergraduate, isFacultyAdmin, isAcademician } = useRoles();
    return (
        <MainLayout title="Academician">
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
