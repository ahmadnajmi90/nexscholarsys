import React from "react";
import { Link } from '@inertiajs/react';
import MainLayout from "@/Layouts/MainLayout";
import { useState } from "react";
import { FaEnvelope, FaGoogle, FaGlobe, FaLinkedin } from "react-icons/fa";

const FacultyList = ({ faculties, universityName, isFacultyAdmin, isPostgraduate, isUndergraduate }) => {
    // const [selectedCountries, setSelectedCountries] = useState([]);
    // const [selectedUniversity, setSelectedUniversity] = useState([]);
    // const [selectedSupervisorAvailability, setSelectedSupervisorAvailability] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const profilesPerPage = 9;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState(null);

    // const handleQuickInfoClick = (profile) => {
    //     setSelectedProfile(profile);
    //     setIsModalOpen(true);
    // };

    // Extract unique research areas dynamically from the array data
    //    const uniqueCountries = [
    //     ...new Set(universities.map((uni) => uni.country))
    //     ].map((country) => ({
    //         value: country,
    //         label: country,
    //     }));
    
    //     // Extract unique universities dynamically
    //     const uniqueUniversities = universitiesList.map((university) => ({
    //         value: university.id.toString(),
    //         label: university.short_name,
    //     }));
    
        // Filter profiles based on selected research area, university, and supervisor availability
        // const filteredUniversities = universities.filter((uni) =>
        //     selectedCountries.length === 0 || selectedCountries.includes(uni.country)
        // );
    
        // Pagination logic
        // const totalPages = Math.ceil(filteredUniversities.length / profilesPerPage);
        // const displayedUniversities = filteredUniversities.slice(
        //     (currentPage - 1) * profilesPerPage,
        //     currentPage * profilesPerPage
        // );
    
        // const handlePageChange = (page) => {
        //     setCurrentPage(page);
        // };
    
        // const getUniversityNameById = (id) => {
        //     const university = universitiesList.find((u) => u.id === id); // Find the university by ID
        //     return university ? university.full_name : "Unknown University"; // Return the full_name or a default string
        // };
    
        // const getFacultyNameById = (id) => {
        //     const faculty = faculties.find((u) => u.id === id); // Find the university by ID
        //     return faculty ? faculty.name : "Unknown University"; // Return the full_name or a default string
        // };
    
        return (
            <MainLayout title={"List of Faculties"} isPostgraduate={isPostgraduate} isUndergraduate={isUndergraduate} isFacultyAdmin={isFacultyAdmin}>
            <div className="min-h-screen flex">
                {/* Sidebar for Filters */}
                
                {/* Main Content */}
                <div className="flex-1 px-8">
                    {/* Profile Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
                        {faculties.map((profile) => (
                            <div
                                key={profile.id}
                                className="bg-white shadow-md rounded-lg overflow-hidden relative"
                            >
                                
                                {/* Profile Banner */}
                                <div className="h-32">
                                    <img
                                        src={
                                            // profile.background_image !== null
                                            //     ? `/storage/${profile.background_image}`
                                            //     : '/storage/faculty_background_images/utm.jpg'
                                            '/storage/faculty_background_images/utm.jpg'
                                        }
                                        alt="Banner"
                                        className="object-cover w-full h-full"
                                    />
                                </div>
    
                                {/* Profile Image */}
                                <div className="flex justify-center -mt-12">
                                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                        <img
                                            src={
                                                // profile.profile_picture !== null
                                                //     ? `/storage/${profile.profile_picture}`
                                                //     : '/storage/faculty_profile_pictures/utm.png'
                                                '/storage/faculty_profile_pictures/utm.png'
                                            }
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
    
                                {/* Profile Info */}
                                <div className="text-center mt-4">
                                    <h2 className="text-lg font-semibold">{profile.name}</h2>
    
                                    <p className="text-gray-500 text-sm">{universityName}</p>
    
                                    {/* Quick Info Button */}
                                    <button
                                        onClick={() => window.location.href = route('faculties.academicians', { faculty: profile.id })}
                                        className="mt-2 bg-blue-500 text-white text-[10px] px-2 font-semibold py-1 rounded-full hover:bg-blue-600"
                                    >
                                        View
                                    </button>
                                </div>
    
                                {/* Social Links */}
                                <div className="flex justify-around items-center mt-6 py-4 border-t px-10">
                                    {/* Email Icon */}
                                    <FaEnvelope
                                        className="text-gray-500 text-sm cursor-pointer hover:text-blue-700"
                                        title="Copy Email"
                                        onClick={() => handleCopyEmail(profile.email)}
                                    />
                                    {/* Google Scholar Icon */}
                                    <a
                                        href={profile.google_scholar}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-500 text-sm hover:text-red-700"
                                        title="Google Scholar"
                                    >
                                        <FaGoogle />
                                    </a>
                                    {/* Website Icon */}
                                    <a
                                        href={profile.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-500 text-sm hover:text-green-700"
                                        title="Website"
                                    >
                                        <FaGlobe />
                                    </a>
                                    {/* LinkedIn Icon */}
                                    <a
                                        href={profile.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-500 text-sm hover:text-blue-800"
                                        title="LinkedIn"
                                    >
                                        <FaLinkedin />
                                    </a>
                                </div>
                                            
                                
                            </div>
                        ))}
                    </div>
    
                    {/* Pagination */}
                    {/* <div className="flex justify-center mt-6 space-x-2">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index}
                                onClick={() => handlePageChange(index + 1)}
                                className={`px-4 py-2 border rounded ${
                                    currentPage === index + 1
                                        ? "bg-blue-500 text-white"
                                        : "bg-white text-gray-700"
                                }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div> */}
                </div>
            </div>
            </MainLayout>
        );
};

export default FacultyList;
