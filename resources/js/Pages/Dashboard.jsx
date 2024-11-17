import React from 'react';
import MainLayout from '../Layouts/MainLayout';
import RadarChart from '../Components/RadarChart';
import ProfileCard from '@/Components/ProfileCard';



const Dashboard = () => {
    return (
        <MainLayout title="Dashboard">
            <p>This is your dashboard content.</p>
            <RadarChart />
            <ProfileCard />
        </MainLayout>
    );
};

export default Dashboard;
