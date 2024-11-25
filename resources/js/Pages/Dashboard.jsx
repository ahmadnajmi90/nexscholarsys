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
}) => {
    return (
            <MainLayout title="Dashboard" isPostgraduate={isPostgraduate}>
                <DashboardInsights totalUsers={totalUsers} onlineUsers={onlineUsers} clicksByType={clicksByType} isAdmin={isAdmin}/>
                {/* <RadarChart />
                <ProfileCard /> */}
            </MainLayout>
    );
};

export default Dashboard;
