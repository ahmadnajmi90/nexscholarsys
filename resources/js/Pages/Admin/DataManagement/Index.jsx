import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import UniversitiesTab from './Tabs/UniversitiesTab';
import FacultiesTab from './Tabs/FacultiesTab';
import ResearchFieldsTab from './Tabs/ResearchFieldsTab';
import PostgraduateProgramsTab from './Tabs/PostgraduateProgramsTab';
import { Toaster, toast } from 'react-hot-toast';

export default function Index() {
    const { props } = usePage();
    const [activeTab, setActiveTab] = useState('universities');
    
    // Flash messages are now handled by individual tab components
    // to avoid duplicate toasts

    const renderTabContent = () => {
        switch (activeTab) {
            case 'universities':
                return <UniversitiesTab />;
            case 'faculties':
                return <FacultiesTab />;
            case 'research-fields':
                return <ResearchFieldsTab />;
            case 'postgraduate-programs':
                return <PostgraduateProgramsTab />;
            default:
                return <UniversitiesTab />;
        }
    };

    return (
        <MainLayout title="Data Management">
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
            
            <div className="mb-0 lg:mb-6 px-4 lg:px-0 py-6 md:py-8 lg:py-0">
                <div className="max-w-7xl mx-auto">                    
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
                                onClick={() => setActiveTab('postgraduate-programs')}
                                className={`${
                                    activeTab === 'postgraduate-programs'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                Postgraduate Programs
                            </button>
                        </nav>
                    </div>
                    
                    {/* Tab Content */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200 mr-2">
                        <div className="p-6 md:p-8 lg:p-4 bg-white border-b border-gray-200">
                            {renderTabContent()}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}