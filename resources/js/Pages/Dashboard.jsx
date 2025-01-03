import React from 'react';
import MainLayout from '../Layouts/MainLayout';
import DashboardInsights from '../Components/DashboardInsights';
import SuccessAlert4 from '@/Components/WelcomeMessage';
import useRoles from '@/Hooks/useRoles';

const Dashboard = ({
    totalUsers,
    onlineUsers,
    clicksByType,
    events,
    academicians,
    universities,
    faculties,
    users,
    researchOptions,
}) => {
    const { isAdmin, isPostgraduate, isUndergraduate, isFacultyAdmin, isAcademician } = useRoles();

    return (
            <MainLayout title="Dashboard">
                <DashboardInsights 
                totalUsers={totalUsers} 
                onlineUsers={onlineUsers} 
                clicksByType={clicksByType} 
                events={events} 
                academicians={academicians}
                universities={universities}
                faculties={faculties}
                users={users}
                researchOptions={researchOptions}
                />
                {/* <RadarChart />
                <ProfileCard /> */}
            </MainLayout>
    );
};

export default Dashboard;
