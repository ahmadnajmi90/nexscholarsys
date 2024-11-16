import React, { useState } from 'react';
import Sidebar from '../Components/Sidebar';
import { Head } from '@inertiajs/react';

const MainLayout = ({ children, title }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar Component with isOpen and toggleSidebar props */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Main Content Area */}
            <div className={`flex-1 p-6 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
                <Head title={title} />
                <div className="p-4 bg-white rounded-lg shadow">
                    <h1 className="text-2xl font-semibold mb-4">{title}</h1>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
