import React from 'react';
import MainLayout from '../Layouts/MainLayout';
import DashboardInsights from '../Components/Dashboard/DashboardInsights';
import SuccessAlert4 from '@/Components/WelcomeMessage';
import useRoles from '@/Hooks/useRoles';
import Dashboard_m from "../Components/Dashboard/Dashboard_m"; // Import the mobile view component
import { useState, useEffect } from 'react';
import useIsDesktop from "@/Hooks/useIsDesktop";

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
    const isDesktop = useIsDesktop();

    return (
            <MainLayout title="Dashboard">
                {isDesktop ? (
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
                />):
                (
                    <Dashboard_m events={events}
                    users={users}/>
                )
                    }
                {/* <RadarChart />
                <ProfileCard /> */}
            </MainLayout>
    );
};

export default Dashboard;
