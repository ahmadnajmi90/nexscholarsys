import React, { useState, useEffect } from 'react';
import { usePage, useForm, router } from '@inertiajs/react';
import MainLayout from "../../Layouts/MainLayout";
import useRoles from '@/Hooks/useRoles';

const AcademiciansList = () => {
    const { academicians, flash, universities, faculties, researchOptions } = usePage().props;
    const { isAdmin, isPostgraduate, isUndergraduate, isFacultyAdmin, isAcademician } = useRoles();
    const { post, processing } = useForm();
    const [expandedIds, setExpandedIds] = useState({});
    const [selectedIds, setSelectedIds] = useState({});
    const [selectAll, setSelectAll] = useState(false);
    const [batchProcessing, setBatchProcessing] = useState(false);

    // Update selection state whenever academicians list changes or selectAll changes
    useEffect(() => {
        const initialSelectionState = {};
        academicians.forEach(academician => {
            initialSelectionState[academician.id] = selectAll;
        });
        setSelectedIds(initialSelectionState);
    }, [academicians, selectAll]);

    // Handle single academician verification
    const handleVerify = (id) => {
        router.post(route('faculty-admin.verify-academician', id), {}, {
            onStart: () => {
                console.log(`Starting verification for academician ID: ${id}`);
            },
            onSuccess: (page) => {
                console.log(`Successfully verified academician ID: ${id}`);
                // Show success message
                if (page.props.flash && page.props.flash.success) {
                    alert(page.props.flash.success);
                } else {
                    alert('Academician verified successfully!');
                }
            },
            onError: (errors) => {
                console.error(`Failed to verify academician ID: ${id}`, errors);
                alert('Failed to verify academician.');
            }
        });
    };

    // Handle batch verification of selected academicians
    const handleBatchVerify = () => {
        // Get IDs of selected academicians as integers
        const selectedAcademicianIds = Object.keys(selectedIds)
            .filter(id => selectedIds[id])
            .map(id => parseInt(id, 10)); // Ensure IDs are integers
        
        if (selectedAcademicianIds.length === 0) {
            alert('Please select at least one academician to verify.');
            return;
        }

        setBatchProcessing(true);
        
        // Log the request data for debugging
        console.log('Sending verification request for IDs:', selectedAcademicianIds);
        
        // Use Inertia router.post for more reliable CSRF handling
        router.post(
            route('faculty-admin.verify-academicians-batch'),
            { 
                academician_ids: selectedAcademicianIds
            },
            {
                onStart: () => {
                    console.log("Starting batch verification request");
                    return true; // Continue with the request
                },
                onSuccess: (page) => {
                    console.log('Verification success response:', page);
                    // Show success message to the user
                    if (page.props.flash && page.props.flash.success) {
                        alert(page.props.flash.success);
                    } else {
                        alert("Academicians verified successfully!");
                    }
                    // Clear selections after successful verification
                    setSelectedIds({});
                    setSelectAll(false);
                    setBatchProcessing(false);
                },
                onError: (errors) => {
                    console.error('Verification error:', errors);
                    setBatchProcessing(false);
                    alert('Failed to verify academicians: ' + (Object.values(errors)[0] || 'Unknown error'));
                },
                onFinish: () => {
                    console.log('Verification request finished');
                    setBatchProcessing(false);
                }
            }
        );
    };
    
    // Handle individual checkbox change
    const handleCheckboxChange = (id) => {
        const newSelectedIds = { ...selectedIds };
        newSelectedIds[id] = !selectedIds[id];
        setSelectedIds(newSelectedIds);
        
        // Update selectAll state based on whether all checkboxes are selected
        const allSelected = academicians.every(
            academician => newSelectedIds[academician.id] === true
        );
        setSelectAll(allSelected);
    };
    
    // Handle "select all" checkbox change
    const handleSelectAllChange = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);
    };
    
    // Get the count of selected academicians
    const getSelectedCount = () => {
        return Object.values(selectedIds).filter(Boolean).length;
    };
    
    const getUniversityNameById = (id) => {
        const university = universities.find((u) => u.id === id);
        return university ? university.full_name : "Unknown University";
    };

    const getFacultyNameById = (id) => {
        const faculty = faculties.find((u) => u.id === id);
        return faculty ? faculty.name : "Unknown Faculty";
    };

    // Function to toggle expanded view for an academician
    const toggleExpand = (id) => {
        setExpandedIds(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const getVerificationStatusBadge = (verified) => {
        return verified ? (
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                Verified
            </span>
        ) : (
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                Not Verified
            </span>
        );
    };

    return (
        <MainLayout title="">
            <div className="max-w-7xl mx-auto py-2 px-4">
                <div className="sm:flex sm:items-center sm:justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Verify Academicians</h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Review and verify academicians in your faculty.
                        </p>
                    </div>
                    
                    {/* Batch verification button */}
                    {academicians.length > 0 && (
                        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
                            <span className="text-sm text-gray-600">
                                {getSelectedCount()} selected
                            </span>
                            <button
                                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                                    getSelectedCount() > 0 
                                        ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500' 
                                        : 'bg-gray-300 cursor-not-allowed'
                                }`}
                                onClick={handleBatchVerify}
                                disabled={getSelectedCount() === 0 || batchProcessing}
                            >
                                {batchProcessing ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Verifying...
                                    </>
                                ) : (
                                    'Verify Selected'
                                )}
                            </button>
                        </div>
                    )}
                </div>

                {flash?.success && (
                    <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6 rounded-md">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-green-700">{flash.success}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        {academicians.length === 0 ? (
                            <div className="py-12 text-center">
                                <p className="text-gray-500">No academicians pending verification in your faculty.</p>
                            </div>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                    checked={selectAll}
                                                    onChange={handleSelectAllChange}
                                                    disabled={batchProcessing}
                                                />
                                                <span className="ml-2">Select All</span>
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Academician
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            University & Faculty
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
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {academicians.map((academician) => {
                                        const isExpanded = expandedIds[academician.id] || false;
                                        const isSelected = selectedIds[academician.id] || false;
                                        
                                        return (
                                            <tr key={academician.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <input
                                                        type="checkbox"
                                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                        checked={isSelected || false}
                                                        onChange={() => handleCheckboxChange(academician.id)}
                                                        disabled={batchProcessing}
                                                    />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {academician.full_name || 'N/A'}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {academician.user?.email || 'N/A'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">
                                                        {getUniversityNameById(academician.university)}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {getFacultyNameById(academician.faculty)}
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
                                                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                                                >
                                                                    {isExpanded ? 'Hide details' : 'Show details'}
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
                                                    {getVerificationStatusBadge(academician.verified)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    {!academician.verified && (
                                                        <button
                                                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                            onClick={() => handleVerify(academician.id)}
                                                            disabled={processing || batchProcessing}
                                                        >
                                                            Verify
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default AcademiciansList;
