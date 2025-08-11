import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import UniversitiesTab from './Tabs/UniversitiesTab';
import FacultiesTab from './Tabs/FacultiesTab';
import ResearchFieldsTab from './Tabs/ResearchFieldsTab';
import PhDProgramsTab from './Tabs/PhDProgramsTab';
import { Toaster, toast } from 'react-hot-toast';

export default function Index() {
    const { props } = usePage();
    const [activeTab, setActiveTab] = useState('universities');
    
    useEffect(() => {
        // Check for success messages
        if (props.flash?.success) {
            toast.success(props.flash.success);
        }
        
        // Check for error messages
        if (props.flash?.error) {
            toast.error(props.flash.error);
        }
    }, [props.flash]);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'universities':
                return <UniversitiesTab />;
            case 'faculties':
                return <FacultiesTab />;
            case 'research-fields':
                return <ResearchFieldsTab />;
            case 'phd-programs':
                return <PhDProgramsTab />;
            default:
                return <UniversitiesTab />;
        }
    };

    return (
        <MainLayout>
            <Head title="Data Management" />
            <Toaster 
                position="top-right" 
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    success: {
                        duration: 3000,
                        style: {
                            background: '#4CAF50',
                            color: '#fff',
                        },
                    },
                    error: {
                        duration: 5000,
                        style: {
                            background: '#F44336',
                            color: '#fff',
                        },
                    },
                }}
            />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-6">Data Management</h1>
                    
                    {/* Tab Navigation */}
                    <div className="border-b border-gray-200 mb-6">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                onClick={() => setActiveTab('universities')}
                                className={`${
                                    activeTab === 'universities'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                Universities
                            </button>
                            
                            <button
                                onClick={() => setActiveTab('faculties')}
                                className={`${
                                    activeTab === 'faculties'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                Faculties
                            </button>
                            
                            <button
                                onClick={() => setActiveTab('research-fields')}
                                className={`${
                                    activeTab === 'research-fields'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                Research Fields
                            </button>
                            
                            <button
                                onClick={() => setActiveTab('phd-programs')}
                                className={`${
                                    activeTab === 'phd-programs'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                PhD Programs
                            </button>
                        </nav>
                    </div>
                    
                    {/* Tab Content */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-0 bg-white border-b border-gray-200">
                            {renderTabContent()}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}