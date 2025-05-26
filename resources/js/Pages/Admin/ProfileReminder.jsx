import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';
import AcademicianTable from './Components/AcademicianTable';
import PostgraduateTable from './Components/PostgraduateTable';
import UndergraduateTable from './Components/UndergraduateTable';

const ProfileReminder = ({ academicians, postgraduates, undergraduates, universities, faculties, researchOptions }) => {
    const { url } = usePage();
    
    // Use URL query parameter to determine the active tab
    const getInitialActiveTab = () => {
        // Parse the query string
        const urlParams = new URLSearchParams(window.location.search);
        
        // If there's an academicians_page parameter, set to academicians tab
        if (urlParams.has('academicians_page')) {
            return 'academicians';
        }
        
        // If there's a postgraduates_page parameter, set to postgraduates tab
        if (urlParams.has('postgraduates_page')) {
            return 'postgraduates';
        }
        
        // If there's an undergraduates_page parameter, set to undergraduates tab
        if (urlParams.has('undergraduates_page')) {
            return 'undergraduates';
        }
        
        // Default to academicians if no tab-specific pagination
        return 'academicians';
    };
    
    const [activeTab, setActiveTab] = useState(getInitialActiveTab);
    
    // Update the tab state when URL changes
    useEffect(() => {
        setActiveTab(getInitialActiveTab());
    }, [url]);
    
    const sendReminder = async (userId, role) => {
        try {
            const response = await axios.post(route('admin.profiles.reminder'), {
                userId: userId,
                role: role
            });
            
            return response.data;
        } catch (error) {
            console.error('Error sending reminder:', error);
            throw error;
        }
    };
    
    const sendBatchReminder = async (userIds, role) => {
        try {
            const response = await axios.post(route('admin.profiles.batch-reminder'), {
                userIds: userIds,
                role: role
            });
            
            return response.data;
        } catch (error) {
            console.error('Error sending batch reminder:', error);
            throw error;
        }
    };

    const tabs = [
        { id: 'academicians', label: 'Academicians', count: academicians.total },
        { id: 'postgraduates', label: 'Postgraduates', count: postgraduates.total },
        { id: 'undergraduates', label: 'Undergraduates', count: undergraduates.total },
    ];
    
    // Update URL query parameter when tab changes
    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        
        // Update URL to include the active tab
        const urlParams = new URLSearchParams(window.location.search);
        
        // Remove all pagination parameters first
        urlParams.delete('academicians_page');
        urlParams.delete('postgraduates_page');
        urlParams.delete('undergraduates_page');
        
        // Add tab parameter
        urlParams.set('tab', tabId);
        
        // Replace URL without triggering a page reload
        const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
        window.history.replaceState({}, '', newUrl);
    };
    
    return (
        <MainLayout title="">
            <Head title="Profile Management" />
            
            <div className='py-2'> 
                <div className="max-w-7xl mx-auto">
                    <div className="md:flex md:items-center md:justify-between">
                        <div className="flex-1 min-w-0">
                            <h1 className="text-xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                                User Profile Management
                            </h1>
                            <p className="mt-2 text-sm text-gray-600">
                                Send reminders to users to complete or update their profiles. Review users by role and take action individually or in batches.
                            </p>
                        </div>
                    </div>
                    
                    <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
                        {/* Tab Navigation */}
                        <div className="border-b border-gray-200">
                            <nav className="flex -mb-px">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => handleTabChange(tab.id)}
                                        className={`py-4 px-6 text-center border-b-2 font-medium text-sm sm:text-base ${
                                            activeTab === tab.id
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        } whitespace-nowrap flex items-center space-x-2`}
                                    >
                                        <span>{tab.label}</span>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            activeTab === tab.id ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {tab.count}
                                        </span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                        
                        {/* Tab Content */}
                        <div className="p-6">
                            {activeTab === 'academicians' && (
                                <AcademicianTable 
                                    academics={academicians.data} 
                                    universities={universities}
                                    faculties={faculties}
                                    researchOptions={researchOptions}
                                    onSendReminder={sendReminder}
                                    onSendBatchReminder={sendBatchReminder}
                                    pagination={academicians}
                                    currentTab={activeTab}
                                />
                            )}
                            
                            {activeTab === 'postgraduates' && (
                                <PostgraduateTable 
                                    postgraduates={postgraduates.data}
                                    universities={universities}
                                    faculties={faculties}
                                    researchOptions={researchOptions}
                                    onSendReminder={sendReminder}
                                    onSendBatchReminder={sendBatchReminder}
                                    pagination={postgraduates}
                                    currentTab={activeTab}
                                />
                            )}
                            
                            {activeTab === 'undergraduates' && (
                                <UndergraduateTable 
                                    undergraduates={undergraduates.data}
                                    universities={universities}
                                    faculties={faculties}
                                    researchOptions={researchOptions}
                                    onSendReminder={sendReminder}
                                    onSendBatchReminder={sendBatchReminder}
                                    pagination={undergraduates}
                                    currentTab={activeTab}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default ProfileReminder; 