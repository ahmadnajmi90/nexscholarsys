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