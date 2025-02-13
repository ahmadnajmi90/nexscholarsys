import React from "react";
import { Link } from '@inertiajs/react';
import MainLayout from "@/Layouts/MainLayout";
import { useState, useEffect, useRef } from "react";
import { FaEnvelope, FaGoogle, FaGlobe, FaLinkedin } from "react-icons/fa";
import useRoles from '@/Hooks/useRoles';

const FilterDropdown = ({ label, options, selectedValues, setSelectedValues }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const containerRef = useRef(null);

    const handleCheckboxChange = (value) => {
        const updatedValues = selectedValues.includes(value)
            ? selectedValues.filter((item) => item !== value)
            : [...selectedValues, value];
        setSelectedValues(updatedValues);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
          if (containerRef.current && !containerRef.current.contains(event.target)) {
            setDropdownOpen(false);
          }
        };
    
        if (dropdownOpen) {
          document.addEventListener("mousedown", handleClickOutside);
        } else {
          document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, [dropdownOpen]);

    return (
        <div ref={containerRef} className="relative">
            <label className="block text-gray-700 font-medium mt-4">{label}</label>
            <div
                className={`relative mt-1 w-full rounded-lg border border-gray-200 p-4 text-sm cursor-pointer bg-white ${
                    dropdownOpen ? "shadow-lg" : ""
                }`}
                onClick={() => setDropdownOpen(!dropdownOpen)}
            >
                {selectedValues && selectedValues.length > 0
                    ? options
                          .filter((option) => selectedValues.includes(option.value))
                          .map((option) => option.label)
                          .join(", ")
                    : `Select ${label}`}
            </div>
            {dropdownOpen && (
                <div className="absolute z-10 mt-2 bg-white border border-gray-200 rounded shadow-lg">
                    <div className="p-2 space-y-2">
                        {options.map((option, index) => (
                            <label key={index} className="flex items-center">
                                <input
                                    type="checkbox"
                                    value={option.value}
                                    checked={selectedValues.includes(option.value)}
                                    onChange={(e) => handleCheckboxChange(e.target.value)}
                                    className="mr-2"
                                />
                                {option.label}
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const UniversityList = ({ universities }) => {
    const { isAdmin, isPostgraduate, isUndergraduate, isFacultyAdmin, isAcademician } = useRoles();
    const [selectedCountries, setSelectedCountries] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const profilesPerPage = 9;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState(null);
    console.log(universities);

    // const handleQuickInfoClick = (profile) => {
    //     setSelectedProfile(profile);
    //     setIsModalOpen(true);
    // };

    // Extract unique research areas dynamically from the array data
    const uniqueCountries = [
    ...new Set(universities.map((uni) => uni.country))
    ].map((country) => ({
        value: country,
        label: country,
    }));

    const uniqueTypes = [
        ...new Set(universities.map((uni) => uni.university_type))
    ].map((university_type) => ({
        value: university_type,
        label: university_type,
    }));

    const uniqueCategories = [...new Set(universities.map((uni) => uni.university_category))].map(
        (university_category) => ({
            value: university_category,
            label: university_category,
        })
    );
    
    //     // Extract unique universities dynamically
    //     const uniqueUniversities = universitiesList.map((university) => ({
    //         value: university.id.toString(),
    //         label: university.short_name,
    //     }));
    
        // Filter profiles based on selected research area, university, and supervisor availability
        const filteredUniversities = universities.filter(
            (uni) =>
                (selectedCountries.length === 0 || selectedCountries.includes(uni.country)) &&
                (selectedTypes.length === 0 || selectedTypes.includes(uni.university_type)) &&
                (selectedCategories.length === 0 || selectedCategories.includes(uni.university_category))
        );
    
        // Pagination logic
        const totalPages = Math.ceil(filteredUniversities.length / profilesPerPage);
        const displayedUniversities = filteredUniversities.slice(
            (currentPage - 1) * profilesPerPage,
            currentPage * profilesPerPage
        );
    
        const handlePageChange = (page) => {
            setCurrentPage(page);
        };
    
        // const getUniversityNameById = (id) => {
        //     const university = universitiesList.find((u) => u.id === id); // Find the university by ID
        //     return university ? university.full_name : "Unknown University"; // Return the full_name or a default string
        // };
    
        // const getFacultyNameById = (id) => {
        //     const faculty = faculties.find((u) => u.id === id); // Find the university by ID
        //     return faculty ? faculty.name : "Unknown University"; // Return the full_name or a default string
        // };
    
        return (
            <MainLayout title={"List of Universities"} >
            <div className="min-h-screen flex">
                {/* Sidebar for Filters */}
                <div className="w-1/4 p-4 bg-gray-100 border-r">
                    <h2 className="text-lg font-semibold mb-4">Filters</h2>
                    <FilterDropdown
                        label="Country"
                        options={uniqueCountries}
                        selectedValues={selectedCountries}
                        setSelectedValues={setSelectedCountries}
                    />
                    <FilterDropdown
                        label="University Type"
                        options={uniqueTypes}
                        selectedValues={selectedTypes}
                        setSelectedValues={setSelectedTypes}
                    />
                    <FilterDropdown
                        label="University Category"
                        options={uniqueCategories}
                        selectedValues={selectedCategories}
                        setSelectedValues={setSelectedCategories}
                    />
                </div>
                
                {/* Main Content */}
                <div className="flex-1 px-8">
                    {/* Profile Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
                        {displayedUniversities.map((profile) => (
                            <div
                                key={profile.id}
                                className="bg-white shadow-md rounded-lg overflow-hidden relative"
                            >
                                
                                {/* Profile Banner */}
                                <div className="h-32">
                                    <img
                                        src={
                                            profile.background_image !== null
                                                && `/storage/${profile.background_image}`
                                                // : '/storage/university_background_images/utm.jpg'
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
                                                profile.profile_picture !== null
                                                    && `/storage/${profile.profile_picture}`
                                                    // : '/storage/university_profile_pictures/utm.png'
                                            }
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
    
                                {/* Profile Info */}
                                <div className="text-center mt-4">
                                    <h2 className="text-lg font-semibold px-4 h-16 overflow-hidden">{profile.full_name}</h2>
    
                                    <p className="text-gray-500 text-sm">{profile.country}</p>
    
                                    {/* Quick Info Button */}
                                    <button
                                        onClick={() => window.location.href = route('universities.faculties', { university: profile.id })}
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
                    <div className="flex justify-center mt-6 space-x-2">
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
                    </div>
                </div>
            </div>
            </MainLayout>
        );
};

export default UniversityList;
