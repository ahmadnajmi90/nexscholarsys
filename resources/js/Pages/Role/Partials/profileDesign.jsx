import React, { useState } from 'react';

export default function ProfilePage({ profileData, projectsData }) {
    const [activeTab, setActiveTab] = useState('profiles');

    return (
        <div className="bg-gray-50">
            {/* Header Section */}
            <div className="bg-white shadow-md py-8">
                <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6">
                    <div className="flex items-center space-x-4">
                        <img
                            src={profileData.profilePicture || '/storage/default.jpg'}
                            alt="Profile"
                            className="w-20 h-20 rounded-full object-cover"
                        />
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-800">{profileData.name}</h1>
                            <p className="text-gray-500">{profileData.companyType}</p>
                            <p className="text-gray-500">{profileData.location}</p>
                            <p className="text-blue-500">{profileData.email}</p>
                        </div>
                    </div>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                        Follow
                    </button>
                </div>
            </div>

            {/* Tabs Section */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-6xl mx-auto flex space-x-8 px-4 sm:px-6">
                    {['Profiles', 'Projects', 'Works', 'Teams', 'Network', 'Activity', 'More'].map((tab) => (
                        <button
                            key={tab}
                            className={`py-4 px-3 font-medium text-sm ${
                                activeTab.toLowerCase() === tab.toLowerCase()
                                    ? 'border-b-2 border-blue-500 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                            onClick={() => setActiveTab(tab.toLowerCase())}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content Section */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                {activeTab === 'profiles' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="text-center">
                            <h2 className="text-xl font-bold">{profileData.employees}</h2>
                            <p className="text-gray-500">Employees</p>
                        </div>
                        <div className="text-center">
                            <h2 className="text-xl font-bold">{profileData.users}</h2>
                            <p className="text-gray-500">Users</p>
                        </div>
                        <div className="text-center">
                            <h2 className="text-xl font-bold">{profileData.revenue}</h2>
                            <p className="text-gray-500">Revenue</p>
                        </div>
                        <div className="text-center">
                            <h2 className="text-xl font-bold">{profileData.rank}</h2>
                            <p className="text-gray-500">Company Rank</p>
                        </div>
                    </div>
                )}
                {activeTab === 'projects' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projectsData.map((project, index) => (
                            <div
                                key={index}
                                className="bg-white shadow rounded-lg p-6 text-center border hover:shadow-md"
                            >
                                <h3 className="text-lg font-semibold text-gray-800">{project.name}</h3>
                                <p className="text-gray-500 mt-2">{project.description}</p>
                                <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
