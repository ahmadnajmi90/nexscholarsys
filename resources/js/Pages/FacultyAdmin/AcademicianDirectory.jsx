import React, { useState, useRef, useEffect } from "react";
import { Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import useRoles from '@/Hooks/useRoles';
import FilterDropdown from '@/Components/FilterDropdown';
import { FaFilter, FaUserShield, FaUser, FaChevronDown, FaChevronUp, FaPrint, FaFileExcel, FaDownload } from 'react-icons/fa';
import { useReactToPrint } from 'react-to-print';
import axios from 'axios';

const AcademicianDirectory = ({ academicians, faculties, researchOptions, universities, faculty, users }) => {
    const { isAdmin, isPostgraduate, isUndergraduate, isFacultyAdmin, isAcademician } = useRoles();
    const [showFilters, setShowFilters] = useState(false);
    const [expandedIds, setExpandedIds] = useState({});
    const [exportLoading, setExportLoading] = useState({ excel: false });
    const [showExportMenu, setShowExportMenu] = useState(false);
    
    // Filtering state variables
    const [selectedArea, setSelectedArea] = useState([]);
    const [selectedVerificationStatus, setSelectedVerificationStatus] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const filterContainerRef = useRef(null);
    const academiciansPerPage = 15;
    const printRef = useRef();
    const exportMenuRef = useRef(null);
    const [printLoading, setPrintLoading] = useState(false);
    const [isPrintMode, setIsPrintMode] = useState(false);
    
    // Close export menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
                setShowExportMenu(false);
            }
        }
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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
    
    // Handle printing functionality
    const handlePrint = useReactToPrint({
        content: () => printRef.current,
        documentTitle: `${faculty?.name || 'Faculty'} - Academicians Directory`,
        onBeforeGetContent: () => {
            // Set print loading state and print mode
            setPrintLoading(true);
            setIsPrintMode(true);
            
            // Expand all research areas for printing
            const allIdsExpanded = {};
            filteredAcademicians.forEach(academician => {
                allIdsExpanded[academician.id] = true;
            });
            setExpandedIds(allIdsExpanded);
            
            // Return a promise that resolves after we've set up everything for printing
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve();
                }, 2000);
            });
        },
        onPrintError: () => {
            setPrintLoading(false);
            setIsPrintMode(false);
            setExpandedIds({});
        },
        onAfterPrint: () => {
            // Reset expanded state and loading state after printing
            setPrintLoading(false);
            setIsPrintMode(false);
            setExpandedIds({});
        },
        removeAfterPrint: true,
        suppressErrors: true
    });
    
    // Handle export to Excel
    const handleExportExcel = async () => {
        setExportLoading({ ...exportLoading, excel: true });
        try {
            // Prepare filter data to send to the server
            const filterData = {
                researchAreas: selectedArea,
                verificationStatus: selectedVerificationStatus,
                facultyId: faculty?.id
            };
            
            // Request the Excel file from the server
            const response = await axios.post(route('faculty-admin.export.excel'), filterData, {
                responseType: 'blob',
            });
            
            // Create a download link and trigger download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${faculty?.name || 'Faculty'}_Academicians.xlsx`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error exporting to Excel:', error);
            alert('Failed to export to Excel. Please try again.');
        } finally {
            setExportLoading({ ...exportLoading, excel: false });
            setShowExportMenu(false);
        }
    };

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

                {/* Action Buttons */}
                <div className="mb-4 flex justify-end">
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handlePrint}
                            disabled={printLoading}
                            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md flex items-center"
                            title="Print Directory"
                        >
                            {printLoading ? (
                                <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <FaPrint className="mr-2" />
                            )}
                            Print All Academicians ({filteredAcademicians.length})
                        </button>
                        
                        <div className="relative" ref={exportMenuRef}>
                            <button
                                onClick={() => setShowExportMenu(!showExportMenu)}
                                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center"
                            >
                                <FaDownload className="mr-2" /> Export <FaChevronDown className="ml-2" />
                            </button>
                            
                            {showExportMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                                    <div className="py-1">
                                        <button
                                            onClick={handleExportExcel}
                                            disabled={exportLoading.excel}
                                            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center"
                                        >
                                            {exportLoading.excel ? (
                                                <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            ) : (
                                                <FaFileExcel className="mr-2 text-green-600" />
                                            )}
                                            Export to Excel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

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
                        <div className="bg-white shadow-md rounded-lg overflow-hidden" id="printRef" ref={printRef}>
                            {/* Print-only header */}
                            <div className="hidden print:block print:mb-4 print:px-6 print:pt-6">
                                <h1 className="text-xl font-bold">{faculty?.name} - Academicians Directory</h1>
                                <div className="text-sm text-gray-500 mt-1">
                                    <p>Generated on: {new Date().toLocaleDateString()}</p>
                                    {selectedVerificationStatus !== "all" && (
                                        <p>Filtered by status: {selectedVerificationStatus === "verified" ? "Verified" : "Unverified"}</p>
                                    )}
                                    {selectedArea.length > 0 && (
                                        <p>Filtered by research areas: {selectedArea.length} area(s) selected</p>
                                    )}
                                    <p>Total academicians: {filteredAcademicians.length}</p>
                                </div>
                            </div>
                            
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
                                        {/* For normal view, show paginated academicians; for print mode or print media query, show all filtered academicians */}
                                        {(isPrintMode || window.matchMedia('print').matches ? filteredAcademicians : displayedAcademicians).map((academician) => {
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
                                                                <span className="font-medium text-gray-900 print:text-black">
                                                                    {academician.full_name || 'N/A'}
                                                                </span>
                                                                <div className="text-sm text-gray-500 print:text-black">
                                                                    {academician.user?.email || 'N/A'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-900 print:text-black">
                                                            {academician.department || 'N/A'}
                                                        </div>
                                                        <div className="text-sm text-gray-500 print:text-black">
                                                            {academician.current_position || 'N/A'}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {academician.research_expertise && academician.research_expertise.length > 0 ? (
                                                            <div>
                                                                <div className="flex justify-between items-center">
                                                                    <div className="text-sm text-gray-900 font-medium print:text-black">
                                                                        {academician.research_expertise.length} area{academician.research_expertise.length !== 1 ? 's' : ''}
                                                                    </div>
                                                                    <button 
                                                                        onClick={() => toggleExpand(academician.id)}
                                                                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center print:hidden"
                                                                    >
                                                                        {isExpanded ? 
                                                                            <>Hide <FaChevronUp className="ml-1" /></> : 
                                                                            <>Show <FaChevronDown className="ml-1" /></>
                                                                        }
                                                                    </button>
                                                                </div>
                                                                
                                                                {(isExpanded || isPrintMode || window.matchMedia('print').matches) && (
                                                                    <div className="mt-2">
                                                                        <div className="space-y-2 max-h-40 overflow-y-auto print:max-h-none print:overflow-visible">
                                                                            {academician.research_expertise.map((id, index) => {
                                                                                const matchedOption = researchOptions.find(
                                                                                    (option) =>
                                                                                        `${option.field_of_research_id}-${option.research_area_id}-${option.niche_domain_id}` === id
                                                                                );
                                                                                
                                                                                if (matchedOption) {
                                                                                    return (
                                                                                        <p key={index} className="text-sm text-gray-700 print:text-black">
                                                                                            {index + 1}. {matchedOption.field_of_research_name} - {matchedOption.research_area_name} - {matchedOption.niche_domain_name}
                                                                                        </p>
                                                                                    );
                                                                                }
                                                                                return (
                                                                                    <p key={index} className="text-sm text-gray-700 print:text-black">
                                                                                        {index + 1}. Unknown expertise (ID: {id})
                                                                                    </p>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="text-sm text-gray-500 print:text-black">No research expertise specified</div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {academician.verified ? (
                                                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 print:bg-transparent print:border print:border-green-800">
                                                                <FaUserShield className="mr-1" /> Verified
                                                            </span>
                                                        ) : (
                                                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 print:bg-transparent print:border print:border-red-800">
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

                        {/* Pagination - hide when printing */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-6 print:hidden">
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
            
            {/* Print-only styles */}
            <style type="text/css" media="print">
                {`
                @page {
                    size: auto;
                    margin: 0.5cm;
                }
                @media print {
                    html, body {
                        height: auto !important;
                        overflow: auto !important;
                    }
                    body * {
                        visibility: hidden;
                    }
                    #printRef, #printRef * {
                        visibility: visible !important;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                    .print\\:block {
                        display: block !important;
                    }
                    .print\\:max-h-none {
                        max-height: none !important;
                    }
                    .print\\:overflow-visible {
                        overflow: visible !important;
                    }
                    .print\\:bg-transparent {
                        background-color: transparent !important;
                    }
                    .print\\:border {
                        border-width: 1px !important;
                    }
                    .print\\:border-green-800 {
                        border-color: #166534 !important;
                    }
                    .print\\:border-red-800 {
                        border-color: #991b1b !important;
                    }
                    .print\\:text-black {
                        color: #000 !important;
                    }
                    #printRef {
                        position: static !important;
                        left: 0;
                        top: 0;
                        width: 100% !important;
                        height: auto !important;
                        margin: 0;
                        padding: 0;
                        break-inside: auto;
                    }
                    .overflow-y-auto {
                        overflow: visible !important;
                        max-height: none !important;
                    }
                    table {
                        width: 100% !important;
                        page-break-inside: auto;
                        border-collapse: collapse !important;
                    }
                    tr {
                        page-break-inside: avoid;
                        page-break-after: auto;
                    }
                    td, th {
                        page-break-inside: avoid;
                    }
                    thead {
                        display: table-header-group;
                    }
                    tfoot {
                        display: table-footer-group;
                    }
                }
                `}
            </style>
        </MainLayout>
    );
};

export default AcademicianDirectory; 