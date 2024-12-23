import React from 'react';
import MainLayout from '../Layouts/MainLayout';
import DashboardInsights from '../Components/DashboardInsights';
import SuccessAlert4 from '@/Components/WelcomeMessage';
const Dashboard = ({
    totalUsers,
    onlineUsers,
    clicksByType,
    isAdmin,
    isPostgraduate,
    isUndergraduate,
    events,
    isFacultyAdmin,
    academicians,
    universities,
    faculties,
    users,
    researchOptions,
}) => {
    return (
            <MainLayout title="Dashboard" isPostgraduate={isPostgraduate} isUndergraduate={isUndergraduate} isFacultyAdmin={isFacultyAdmin}>
                <DashboardInsights 
                totalUsers={totalUsers} 
                onlineUsers={onlineUsers} 
                clicksByType={clicksByType} 
                isAdmin={isAdmin} 
                events={events} 
                isFacultyAdmin={isFacultyAdmin}
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
