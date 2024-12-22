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
    events
}) => {
    return (
            <MainLayout title="Dashboard" isPostgraduate={isPostgraduate} isUndergraduate={isUndergraduate}>
                <DashboardInsights totalUsers={totalUsers} onlineUsers={onlineUsers} clicksByType={clicksByType} isAdmin={isAdmin} events={events}/>
                {/* <RadarChart />
                <ProfileCard /> */}
            </MainLayout>
    );
};

export default Dashboard;
