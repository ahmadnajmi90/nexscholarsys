import React from 'react';
import MainLayout from '../Layouts/MainLayout';
import DashboardInsights from '../Components/Dashboard/DashboardInsights';
import SuccessAlert4 from '@/Components/WelcomeMessage';
import useRoles from '@/Hooks/useRoles';
import Dashboard_m from "../Components/Dashboard/Dashboard_m"; // Import the mobile view component
import { useState, useEffect } from 'react';
import useIsDesktop from "@/Hooks/useIsDesktop";
import { Link } from '@inertiajs/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';

const Dashboard = ({
    totalUsers,
    onlineUsers,
    clicksByType,
    events,
    posts,
    projects,
    grants,
    academicians,
    universities,
    faculties,
    users,
    researchOptions,
    profileIncompleteAlert,
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
                posts={posts}
                projects={projects}
                grants={grants}
                academicians={academicians}
                universities={universities}
                faculties={faculties}
                users={users}
                researchOptions={researchOptions}
                profileIncompleteAlert={profileIncompleteAlert}
                />):
                (
                    <Dashboard_m 
                    events={events}
                    users={users}
                    grants={grants}
                    profileIncompleteAlert={profileIncompleteAlert}
                    posts={posts}/>
                )
                    }
                {/* <RadarChart />
                <ProfileCard /> */}
            </MainLayout>
    );
};

export default Dashboard;
