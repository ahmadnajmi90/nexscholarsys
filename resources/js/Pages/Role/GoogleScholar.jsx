import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, usePage } from '@inertiajs/react';
import AcademicianPublicationsCard from '@/Pages/Networking/partials/AcademicianPublicationsCard';
import MainLayout from '@/Layouts/MainLayout';

const GoogleScholar = ({ 
    auth, 
    academician, 
    university, 
    faculty, 
    user, 
    publications, 
    scholarProfile,
    researchOptions,
    isEditing = false 
}) => {
    const page = usePage().props;
    const flash = page.flash || {};

    return (
        <MainLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Profile</h2>}
        >
            <Head title="Edit Profile" />

            <div className="py-2">
                <div className="max-w-8xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {flash.message && (
                        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
                            <p>{flash.message}</p>
                        </div>
                    )}

                    {/* Profile header section - similar to AcademicianForm */}
                    <div className="w-full bg-white pb-12 shadow-md relative mb-4">
                        {/* Background Image */}
                        <div className="relative w-full h-48 overflow-hidden">
                            <img
                                src={`/storage/${academician.background_image || "default-background.jpg"}`}
                                alt="Background"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Profile Image Container */}
                        <div className="relative flex flex-col items-center -mt-16 z-10">
                            {/* Profile Image */}
                            <div className="relative">
                                <img
                                    src={`/storage/${academician.profile_picture || "default-profile.jpg"}`}
                                    alt="Profile"
                                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                                />
                            </div>

                            {/* Profile Details */}
                            <div className="text-center mt-4">
                                <h1 className="text-2xl font-semibold text-gray-800">{academician.full_name}</h1>
                                {academician.highest_degree && (
                                    <p className="text-gray-500">
                                        {academician.highest_degree} in {academician.field_of_study} 
                                    </p>
                                )}
                                <p className="text-gray-500">{academician.current_position}</p>
                            </div>
                        </div>
                    </div>

                    {/* Tabs Section */}
                    <div className="bg-white border-b border-gray-200">
                        <div className="max-w-8xl mx-auto flex md:space-x-12 space-x-4 px-4 sm:px-8">
                            <Link
                                href={route('role.edit')}
                                className="py-4 px-3 md:text-lg text-base font-semibold text-gray-500 hover:text-gray-700"
                            >
                                Profiles
                            </Link>
                            <Link
                                href={route('role.publications')}
                                className="py-4 px-3 md:text-lg text-base font-semibold border-b-2 border-blue-500 text-blue-600"
                            >
                                Publications
                            </Link>
                        </div>
                    </div>

                    {/* Alert for missing Google Scholar URL */}
                    {!academician.google_scholar && (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 shadow-md rounded-md">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 mt-0.5">
                                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-yellow-800">Google Scholar Link Missing</h3>
                                    <div className="mt-2 text-sm text-yellow-700">
                                        <p>You haven't added your Google Scholar profile URL yet. To use the "Import Google Scholar Data" feature:</p>
                                        <ol className="list-decimal ml-5 mt-2">
                                            <li>Go to the <Link href={route('role.edit')} className="text-blue-600 hover:underline">Profile tab</Link></li>
                                            <li>Add your Google Scholar URL in the appropriate field</li>
                                            <li>Save your profile</li>
                                            <li>Return to this tab to import your publications</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Publications Card - Main content */}
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <AcademicianPublicationsCard 
                            academician={academician}
                            university={university}
                            faculty={faculty}
                            user={user}
                            publications={publications}
                            scholarProfile={scholarProfile}
                            researchOptions={researchOptions}
                            isEditing={isEditing}
                            hideNavigation={true}
                            hideProfile={true}
                        />
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default GoogleScholar; 