import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import AcademicianTable from './Components/AcademicianTable';
import PostgraduateTable from './Components/PostgraduateTable';
import UndergraduateTable from './Components/UndergraduateTable';

const ProfileReminder = ({ academicians, postgraduates, undergraduates, universities, faculties }) => {
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
    
    return (
        <MainLayout title="Profile Management">
            <Head title="Profile Management" />
            
            <div className="py-4">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h1 className="text-2xl font-semibold mb-4">User Profile Management</h1>
                            <p className="mb-6 text-gray-600">
                                Send reminders to users to complete or update their profiles. Each table shows users by role.
                            </p>
                            
                            <AcademicianTable 
                                academics={academicians.data} 
                                universities={universities}
                                faculties={faculties}
                                onSendReminder={sendReminder}
                                pagination={academicians}
                            />
                            
                            <PostgraduateTable 
                                postgraduates={postgraduates.data}
                                universities={universities}
                                faculties={faculties}
                                onSendReminder={sendReminder}
                                pagination={postgraduates}
                            />
                            
                            <UndergraduateTable 
                                undergraduates={undergraduates.data}
                                universities={universities}
                                faculties={faculties}
                                onSendReminder={sendReminder}
                                pagination={undergraduates}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default ProfileReminder; 