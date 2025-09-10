import React, { useState, useEffect, useCallback } from "react";
import { Link, router } from '@inertiajs/react';
import MainLayout from "@/Layouts/MainLayout";
import { FaEnvelope, FaGoogle, FaGlobe, FaLinkedin } from "react-icons/fa";
import SearchBar from "@/Components/SearchBar";
import Pagination from "@/Components/Pagination";
import FacultySkeletonCard from "./partials/FacultySkeletonCard";
import useRoles from "@/Hooks/useRoles";
import { Head } from "@inertiajs/react";

const FacultyList = ({ faculties, university }) => {
    const { isAdmin, isPostgraduate, isUndergraduate, isFacultyAdmin, isAcademician } = useRoles();
    const [isLoading, setIsLoading] = useState(false);

    // Add useEffect to track Inertia's processing state
    useEffect(() => {
        const handleStart = () => setIsLoading(true);
        const handleFinish = () => setIsLoading(false);

        // router.on() returns a function that removes the listener.
        // We capture these remover functions.
        const removeStartListener = router.on('start', handleStart);
        const removeFinishListener = router.on('finish', handleFinish);

        // The cleanup function in the return statement will now call
        // the remover functions, which is the safe way to do this.
        return () => {
            removeStartListener();
            removeFinishListener();
        };
    }, []); // The empty dependency array is correct.

    // Define search handler function with useCallback
    const handleSearch = useCallback((searchTerm) => {
        router.get(route('universities.faculties', { university: university.id }), 
            { search: searchTerm }, 
            { preserveState: true, replace: true }
        );
    }, [university.id]);

    return (
        <MainLayout>
            <Head title="Faculty List" />
            {/* University Banner and Details Section */}
            <div className="relative bg-gray-200">
                {/* Banner Image */}
                <div className="w-full h-64 overflow-hidden">
                    <img
                        src={
                            university.background_image
                                ? `/storage/${university.background_image}`
                                : '/storage/university_background_images/default.jpg'
                        }
                        alt="University Banner"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* University Logo and Details */}
                <div className="absolute top-40 left-1/2 transform -translate-x-1/2 w-full max-w-4xl text-center">
                    <div className="inline-block w-32 h-32 rounded-full overflow-hidden border-4 border-white">
                        <img
                            src={
                                university.profile_picture
                                    ? `/storage/${university.profile_picture}`
                                    : '/storage/university_profile_pictures/default.png'
                            }
                            alt="University Logo"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <h1 className="mt-8 md:text-3xl text-2xl sm:text-lg font-bold text-gray-800">
                        {university.full_name}
                    </h1>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="md:mt-40 mt-36 border-b border-gray-300 mb-10">
                <div className="flex md:space-x-16 space-x-6 ml-8">
                    <Link
                        href="#"
                        className="md:text-lg text-normal font-semibold text-blue-600 hover:text-blue-800 border-b-2 border-blue-600 pb-2"
                    >
                        Faculty
                    </Link>
                    {/* <Link
                        href="#"
                        className="text-lg font-semibold text-gray-600 hover:text-blue-600 pb-2"
                    >
                        Department
                    </Link>
                    <Link
                        href="#"
                        className="text-lg font-semibold text-gray-600 hover:text-blue-600 pb-2"
                    >
                        News
                    </Link>
                    <Link
                        href="#"
                        className="text-lg font-semibold text-gray-600 hover:text-blue-600 pb-2"
                    >
                        Study
                    </Link> */}
                </div>
            </div>

            {/* Mobile Header with Search */}
            <div className="fixed top-20 right-4 z-50 flex flex-col items-end space-y-2 lg:hidden">
                <SearchBar
                    placeholder="Search faculties..."
                    onSearch={handleSearch}
                    className=""
                />
            </div>

            {/* Main Content */}
            <div className="px-8 mt-10 mb-10">
                {/* Search Bar - Desktop */}
                <div className="mb-6 hidden lg:block">
                    <SearchBar
                        placeholder="Search faculties..."
                        onSearch={handleSearch}
                        className=""
                    />
                </div>

                {/* Faculty List Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
                    {isLoading ? (
                        // Show skeleton cards while loading
                        Array.from({ length: 9 }, (_, index) => (
                            <FacultySkeletonCard key={index} />
                        ))
                    ) : (
                        // Show actual faculty cards when not loading
                        faculties.map((faculty) => (
                        <div
                            key={faculty.id}
                            className="bg-white shadow-md rounded-lg overflow-hidden relative"
                        >
                            {/* Faculty Banner */}
                            <div className="h-32">
                                <img
                                    src={`/storage/${university.background_image}`
                                    }
                                    alt="Faculty Banner"
                                    className="object-cover w-full h-full"
                                />
                            </div>

                            {/* Faculty Logo */}
                            <div className="flex justify-center -mt-12">
                                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                    <img
                                        src={`/storage/${university.profile_picture}`
                                        }
                                        alt="Faculty Logo"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            {/* Faculty Info */}
                            <div className="text-center mt-4">
                                <h2 className="text-lg font-semibold px-4 mb-2 overflow-hidden truncate">
                                    {faculty.name}
                                </h2>

                                <p className="text-gray-500 text-sm mb-2">{university.full_name}</p>

                                {/* View Button */}
                                <button
                                    onClick={() => window.location.href = route('faculties.academicians', { faculty: faculty.id })}
                                    className="mt-2 bg-blue-500 text-white text-[10px] px-2 font-semibold py-1 rounded-full hover:bg-blue-600"
                                >
                                    View
                                </button>
                            </div>

                            {/* Social Links */}
                            <div className="flex justify-around items-center mt-6 py-4 border-t px-10">
                                <FaEnvelope className="text-gray-500 text-sm cursor-pointer hover:text-blue-700" title="Copy Email" />
                                <a
                                    href={faculty.google_scholar}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-500 text-sm hover:text-red-700"
                                    title="Google Scholar"
                                >
                                    <FaGoogle />
                                </a>
                                <a
                                    href={faculty.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-500 text-sm hover:text-green-700"
                                    title="Website"
                                >
                                    <FaGlobe />
                                </a>
                                <a
                                    href={faculty.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-500 text-sm hover:text-blue-800"
                                    title="LinkedIn"
                                >
                                    <FaLinkedin />
                                </a>
                            </div>
                        </div>
                    ))
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default FacultyList;
