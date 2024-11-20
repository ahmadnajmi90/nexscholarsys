import React from 'react';
import MainLayout from '../Layouts/MainLayout';
import RadarChart from '../Components/RadarChart';

const Dashboard = ( {isPostgraduate} ) => {
    console.log(isPostgraduate);
    return (
        <MainLayout title="Dashboard">
            <DashboardInsights />
            {/* <RadarChart />
            <ProfileCard /> */}
        </MainLayout>
    );
};

export default Dashboard;
