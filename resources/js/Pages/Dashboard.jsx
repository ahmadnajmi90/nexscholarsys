import React from 'react';
import MainLayout from '../Layouts/MainLayout';
import DashboardInsights from '../Components/DashboardInsights';
import SuccessAlert4 from '@/Components/WelcomeMessage';
import useRoles from '@/Hooks/useRoles';
import Dashboard_m from "../Components/Dashboard_m"; // Import the mobile view component
import { useState, useEffect } from 'react';

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
    const [isDesktop, setIsDesktop] = useState(false); // Detect if it's desktop view

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsDesktop(true); // lg breakpoint (desktop)
            } else {
                setIsDesktop(false); // Mobile view
            }
        };

        // Run on initial render and on resize
        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
