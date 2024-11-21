import React from 'react';
import MainLayout from '../Layouts/MainLayout';
import RadarChart from '../Components/RadarChart';
import ProfileCard from '../Components/ProfileCard';
import DashboardInsights from '../Components/DashboardInsights';


const Dashboard = ( {isPostgraduate} ) => {
    console.log(isPostgraduate);
    return (
        <MainLayout title="Dashboard" isPostgraduate={isPostgraduate}>
            <DashboardInsights />
            {/* <RadarChart />
            <ProfileCard /> */}
        </MainLayout>
    );
};

export default Dashboard;
