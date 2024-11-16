import React from 'react';
import MainLayout from '../Layouts/MainLayout';
import RadarChart from '../Components/RadarChart';


const Dashboard = () => {
    return (
        <MainLayout title="Dashboard">
            <p>This is your dashboard content.</p>
            <RadarChart />
        </MainLayout>
    );
};

export default Dashboard;
