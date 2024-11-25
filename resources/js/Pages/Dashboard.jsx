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
        <>
            {!isAdmin ? (
                <MainLayout title="Dashboard" isPostgraduate={isPostgraduate}>
                    <DashboardInsights />
                    {/* <RadarChart />
                    <ProfileCard /> */}
                </MainLayout>
            ) : (
                <MainLayout title="Admin Dashboard" isPostgraduate={isPostgraduate}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white shadow rounded-lg p-6">
                            <h2 className="text-lg font-semibold">Total Registered Users</h2>
                            <p className="text-3xl font-bold">{totalUsers}</p>
                        </div>

                        <div className="bg-white shadow rounded-lg p-6">
                            <h2 className="text-lg font-semibold">Online Users</h2>
                            <p className="text-3xl font-bold">{onlineUsers}</p>
                        </div>

                        <div className="bg-white shadow rounded-lg p-6">
                            <h2 className="text-lg font-semibold mb-4">Clicks by Type</h2>

                            {/* Group by entity type */}
                            {["grant", "event", "project"].map((type) => {
                                const filteredClicks = clicksByType.filter((click) => click.entity_type === type);

                                if (filteredClicks.length === 0) return null; // Skip if no clicks for this type

                                return (
                                    <div key={type} className="mb-4">
                                        {/* Entity Type Title */}
                                        <h3 className="text-md font-bold text-gray-800 capitalize">
                                            {type === "grant" ? "Grant" : type === "event" ? "Event" : "Project"}
                                        </h3>
                                        <ul className="mt-2">
                                            {filteredClicks.map((click, index) => (
                                                <li key={index} className="text-gray-600">
                                                    <span className="font-semibold">{click.entity_name}</span> -{" "}
                                                    <span className="text-blue-500">{click.total_clicks} clicks</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <DashboardInsights />
                </MainLayout>
            )}
        </>
    );
};

export default Dashboard;
