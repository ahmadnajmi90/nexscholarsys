import React from 'react';
import MainLayout from '../Layouts/MainLayout';
import RadarChart from '../Components/RadarChart';

const Dashboard = ( {isPostgraduate} ) => {
    console.log(isPostgraduate);
    return (
        <MainLayout title="Dashboard" isPostgraduate={isPostgraduate}>
            <p>This is your dashboard content.</p>
            <RadarChart />
        </MainLayout>
    );
};

export default Dashboard;
