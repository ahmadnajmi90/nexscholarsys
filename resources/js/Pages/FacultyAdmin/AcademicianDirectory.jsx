import React, { useState, useRef, useEffect } from "react";
import { Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import useRoles from '@/Hooks/useRoles';
import FilterDropdown from '@/Components/FilterDropdown';
import { FaFilter, FaUserShield, FaUser, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const AcademicianDirectory = ({ academicians, faculties, researchOptions, universities, faculty, users }) => {
    const { isAdmin, isPostgraduate, isUndergraduate, isFacultyAdmin, isAcademician } = useRoles();
    const [showFilters, setShowFilters] = useState(false);
    const [expandedIds, setExpandedIds] = useState({});
    
    // Filtering state variables
    const [selectedArea, setSelectedArea] = useState([]);
    const [selectedVerificationStatus, setSelectedVerificationStatus] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const filterContainerRef = useRef(null);
    const academiciansPerPage = 15;

    // Function to handle clicks outside the filter container
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                filterContainerRef.current &&
                !filterContainerRef.current.contains(event.target) &&
                window.innerWidth < 1024
            ) {
                setShowFilters(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Extract unique research areas from academicians
    const uniqueResearchIds = new Set();
    academicians.forEach((academician) => {
        if (Array.isArray(academician.research_expertise)) {
            academician.research_expertise.forEach((expertiseId) => {
                uniqueResearchIds.add(expertiseId);
            });
        }
    });

    // Convert research areas to format expected by FilterDropdown
    const uniqueResearchAreas = Array.from(uniqueResearchIds).map((id) => {
        const matchedOption = researchOptions.find(
            (option) => `${option.field_of_research_id}-${option.research_area_id}-${option.niche_domain_id}` === id
        );

        return {
            value: id,
            label: matchedOption
                ? `${matchedOption.field_of_research_name} - ${matchedOption.research_area_name} - ${matchedOption.niche_domain_name}`
                : `Unknown (${id})`,
        };
    });

    // Function to toggle expanded view for research details
    const toggleExpand = (id) => {
        setExpandedIds(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // Filter academicians based on selected criteria
    const filteredAcademicians = academicians.filter((academician) => {
        if (!academician) return false;
        
        // Check if the academician's research expertise matches any selected area
        let hasSelectedArea = true;
        if (selectedArea.length > 0) {
            hasSelectedArea = Array.isArray(academician.research_expertise) && 
                academician.research_expertise.some(area => selectedArea.includes(area));
        }
        
        // Check verification status
        const matchesVerificationStatus = 
            selectedVerificationStatus === "all" ||
            (selectedVerificationStatus === "verified" && academician.verified) ||
            (selectedVerificationStatus === "unverified" && !academician.verified);
        
        // Return true if all filters match
        return hasSelectedArea && matchesVerificationStatus;
    });

    // Pagination
    const totalPages = Math.ceil(filteredAcademicians.length / academiciansPerPage);
    const displayedAcademicians = filteredAcademicians.slice(
        (currentPage - 1) * academiciansPerPage,
        currentPage * academiciansPerPage
    );

    // Calculate pagination numbers
    const paginationNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        paginationNumbers.push(i);
    }

    return (
        <MainLayout title="">
            {/* Faculty Banner and Details Section */}
            <div className="relative bg-gray-200">
                {/* Banner Image */}
                <div className="w-full h-48 overflow-hidden">
                    <img
                        src={
                            faculty?.university?.background_image
                                ? `/storage/${faculty.university.background_image}`
                                : '/storage/university_background_images/default.jpg'
                        }
                        alt="Faculty Banner"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Faculty Logo and Details */}
                <div className="absolute top-28 left-1/2 transform -translate-x-1/2 w-full max-w-4xl text-center">
                    <div className="inline-block w-24 h-24 rounded-full overflow-hidden border-4 border-white">
                        <img
                            src={faculty?.university?.profile_picture
                                ? `/storage/${faculty.university.profile_picture}`
                                : '/storage/university_profile_pictures/default.jpg'
                            }
                            alt="University Logo"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <h1 className="mt-6 text-xl md:text-2xl font-bold text-gray-800">
                        {faculty?.name} - Academicians Directory
                    </h1>
                </div>
            </div>

            <div className="mt-28 px-4 lg:px-8 pb-12">
                {/* Mobile Filter Button */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="fixed top-20 right-4 z-50 bg-blue-600 text-white p-2 rounded-full shadow-lg lg:hidden"
                >
                    <FaFilter className="text-xl" />
                </button>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar for Filters */}
                    <div
                        ref={filterContainerRef}
                        className={`fixed lg:relative top-0 left-0 lg:block lg:w-1/4 w-3/4 h-full bg-white shadow-md border-r p-5 transition-transform duration-300 z-50 overflow-y-auto ${
                            showFilters ? "translate-x-0" : "-translate-x-full"
                        } lg:translate-x-0 rounded-lg`}
                    >
                        <h2 className="text-lg font-semibold mb-4 flex justify-between items-center">
                            Filters
                            <button onClick={() => setShowFilters(false)} className="text-gray-600 lg:hidden">
                                ✕
                            </button>
                        </h2>
                        
                        <div className="space-y-5">
                            <FilterDropdown
                                label="Research Expertise"
                                options={uniqueResearchAreas}
                                selectedValues={selectedArea}
                                setSelectedValues={setSelectedArea}
                            />
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Verification Status
                                </label>
                                <select
                                    className="p-2 border border-gray-300 rounded w-full"
                                    value={selectedVerificationStatus}
                                    onChange={(e) => {
                                        setSelectedVerificationStatus(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                >
                                    <option value="all">All</option>
                                    <option value="verified">Verified</option>
                                    <option value="unverified">Unverified</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:w-3/4">
                        <div className="bg-white shadow-md rounded-lg overflow-hidden">
                            {displayedAcademicians.length === 0 ? (
                                <div className="p-8 text-center">
                                    <p className="text-gray-500">No academicians match your filter criteria.</p>
                                </div>
                            ) : (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Academician
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Department & Position
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Research Expertise
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {displayedAcademicians.map((academician) => {
                                            const isExpanded = expandedIds[academician.id] || false;
                                            
                                            return (
                                                <tr key={academician.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden border border-gray-200">
                                                                <img 
                                                                    src={`/storage/${academician.profile_picture || 'profile_pictures/default.jpg'}`} 
                                                                    alt={academician.full_name}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            </div>
                                                            <div className="ml-4">
                                                                <Link 
                                                                    href={route('academicians.show', academician)}
                                                                    className="font-medium text-gray-900 hover:text-blue-600"
                                                                >
                                                                    {academician.full_name || 'N/A'}
                                                                </Link>
                                                                <div className="text-sm text-gray-500">
                                                                    {academician.user?.email || 'N/A'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-900">
                                                            {academician.department || 'N/A'}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {academician.current_position || 'N/A'}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {academician.research_expertise && academician.research_expertise.length > 0 ? (
                                                            <div>
                                                                <div className="flex justify-between items-center">
                                                                    <div className="text-sm text-gray-900 font-medium">
                                                                        {academician.research_expertise.length} area{academician.research_expertise.length !== 1 ? 's' : ''}
                                                                    </div>
                                                                    <button 
                                                                        onClick={() => toggleExpand(academician.id)}
                                                                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                                                                    >
                                                                        {isExpanded ? 
                                                                            <>Hide <FaChevronUp className="ml-1" /></> : 
                                                                            <>Show <FaChevronDown className="ml-1" /></>
                                                                        }
                                                                    </button>
                                                                </div>
                                                                
                                                                {isExpanded && (
                                                                    <div className="mt-2">
                                                                        <div className="space-y-2 max-h-40 overflow-y-auto">
                                                                            {academician.research_expertise.map((id, index) => {
                                                                                const matchedOption = researchOptions.find(
                                                                                    (option) =>
                                                                                        `${option.field_of_research_id}-${option.research_area_id}-${option.niche_domain_id}` === id
                                                                                );
                                                                                
                                                                                if (matchedOption) {
                                                                                    return (
                                                                                        <p key={index} className="text-sm text-gray-700">
                                                                                            {index + 1}. {matchedOption.field_of_research_name} - {matchedOption.research_area_name} - {matchedOption.niche_domain_name}
                                                                                        </p>
                                                                                    );
                                                                                }
                                                                                return (
                                                                                    <p key={index} className="text-sm text-gray-700">
                                                                                        {index + 1}. Unknown expertise (ID: {id})
                                                                                    </p>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="text-sm text-gray-500">No research expertise specified</div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {academician.verified ? (
                                                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                                <FaUserShield className="mr-1" /> Verified
                                                            </span>
                                                        ) : (
                                                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                                <FaUser className="mr-1" /> Unverified
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-6">
                                <nav className="inline-flex rounded-md shadow">
                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
                                            currentPage === 1 
                                                ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                                        }`}
                                    >
                                        <span className="sr-only">Previous</span>
                                        &laquo;
                                    </button>
                                    {paginationNumbers.map((number) => (
                                        <button
                                            key={number}
                                            onClick={() => setCurrentPage(number)}
                                            className={`relative inline-flex items-center px-4 py-2 border ${
                                                currentPage === number
                                                    ? 'bg-blue-600 text-white border-blue-600'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            {number}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
                                            currentPage === totalPages 
                                                ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                                        }`}
                                    >
                                        <span className="sr-only">Next</span>
                                        &raquo;
                                    </button>
                                </nav>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default AcademicianDirectory; 