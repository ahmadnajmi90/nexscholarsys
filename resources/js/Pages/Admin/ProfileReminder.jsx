import React, { useState, useEffect, useCallback, useRef } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, usePage, router } from '@inertiajs/react';
import axios from 'axios';
import { FaSearch, FaFilter } from 'react-icons/fa';
import AcademicianTable from './Components/AcademicianTable';
import PostgraduateTable from './Components/PostgraduateTable';
import UndergraduateTable from './Components/UndergraduateTable';

const ProfileReminder = ({
    academicians,
    postgraduates,
    undergraduates,
    activeTab: initialActiveTab,
    researchOptions,
    universities = [],
    faculties = [],
    statuses = []
}) => {
    const { url } = usePage();
    console.log(universities);
    
    // Use the active tab from server-side or URL parameter
    const getInitialActiveTab = () => {
        // First try to get from URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const urlTab = urlParams.get('tab');

        if (urlTab && ['academicians', 'postgraduates', 'undergraduates'].includes(urlTab)) {
            return urlTab;
        }

        // Fallback to server-provided active tab
        return initialActiveTab || 'academicians';
    };


    const [activeTab, setActiveTab] = useState(getInitialActiveTab);
    const [loading, setLoading] = useState(false);

    // Filter states
    const [search, setSearch] = useState('');
    const [selectedUniversity, setSelectedUniversity] = useState('');
    const [selectedFaculty, setSelectedFaculty] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    // Debounce ref for search
    const searchTimeoutRef = useRef(null);

    // Initialize filters from URL params
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        setSearch(urlParams.get('search') || '');
        setSelectedUniversity(urlParams.get('university') || '');
        setSelectedFaculty(urlParams.get('faculty') || '');
        setSelectedStatus(urlParams.get('status') || '');
    }, []);

    // Check and reset invalid filter selections when data changes
    useEffect(() => {
        let needsUrlUpdate = false;
        let newUniversity = selectedUniversity;
        let newFaculty = selectedFaculty;

        // Check if selected university is still valid
        if (selectedUniversity && universities.length > 0) {
            const universityExists = universities.some(uni => uni.id.toString() === selectedUniversity.toString());
            if (!universityExists) {
                newUniversity = '';
                newFaculty = ''; // Also reset faculty when university becomes invalid
                needsUrlUpdate = true;
            }
        }

        // Check if selected faculty is still valid
        if (selectedFaculty && faculties.length > 0) {
            const facultyExists = faculties.some(fac => fac.id.toString() === selectedFaculty.toString());
            if (!facultyExists) {
                newFaculty = '';
                needsUrlUpdate = true;
            }
        }

        // Update state if needed
        if (newUniversity !== selectedUniversity) {
            setSelectedUniversity(newUniversity);
        }
        if (newFaculty !== selectedFaculty) {
            setSelectedFaculty(newFaculty);
        }

        // Update URL if selections were reset
        if (needsUrlUpdate) {
            const params = {
                tab: activeTab,
                search: search || undefined,
                university: newUniversity || undefined,
                faculty: newFaculty || undefined,
                status: selectedStatus || undefined
            };

            // Remove empty params
            Object.keys(params).forEach(key => {
                if (!params[key]) delete params[key];
            });

            router.get(route('admin.profiles.index', params), {
                preserveState: true,
                replace: true
            });
        }
    }, [universities, faculties, selectedUniversity, selectedFaculty, activeTab, search, selectedStatus]);

    // Cleanup function for search timeout
    const clearSearchTimeout = useCallback(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = null;
        }
    }, []);


    // Loading state management with Inertia events
    useEffect(() => {
        const handleStart = () => setLoading(true);
        const handleFinish = () => setLoading(false);

        // Listen for Inertia events
        document.addEventListener('inertia:start', handleStart);
        document.addEventListener('inertia:finish', handleFinish);

        return () => {
            document.removeEventListener('inertia:start', handleStart);
            document.removeEventListener('inertia:finish', handleFinish);
        };
    }, []);

    
    // Update the tab state when URL changes
    useEffect(() => {
        setActiveTab(getInitialActiveTab());
    }, [url]);

    // Cleanup search timeout on unmount
    useEffect(() => {
        return () => {
            clearSearchTimeout();
        };
    }, [clearSearchTimeout]);

    
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
    
    const sendBatchReminder = async (userIds, role) => {
        try {
            const response = await axios.post(route('admin.profiles.batch-reminder'), {
                userIds: userIds,
                role: role
            });

            return response.data;
        } catch (error) {
            console.error('Error sending batch reminder:', error);
            throw error;
        }
    };

    // Debounced search handler
    const handleSearchChange = useCallback((value) => {
        setSearch(value);

        // Clear existing timeout
        clearSearchTimeout();

        // If the search is empty, apply filters immediately without debounce
        if (value === '') {
            applyFilters({
                search: '',
                university: selectedUniversity,
                faculty: selectedFaculty,
                status: selectedStatus
            });
        } else {
            // Set new timeout for debounced search
            searchTimeoutRef.current = setTimeout(() => {
                applyFilters({
                    search: value,
                    university: selectedUniversity,
                    faculty: selectedFaculty,
                    status: selectedStatus
                });
            }, 500);
        }
    }, [selectedUniversity, selectedFaculty, selectedStatus, clearSearchTimeout]);

    // Filter application function
    const applyFilters = (filters = {}) => {
        const params = {
            tab: activeTab,
            search: filters.hasOwnProperty('search') ? filters.search : search,
            university: filters.hasOwnProperty('university') ? filters.university : selectedUniversity,
            faculty: filters.hasOwnProperty('faculty') ? filters.faculty : selectedFaculty,
            status: filters.hasOwnProperty('status') ? filters.status : selectedStatus
        };

        // Remove empty params
        Object.keys(params).forEach(key => {
            if (!params[key]) delete params[key];
        });

        router.get(route('admin.profiles.index', params), {
            preserveState: true,
            replace: true
        });
    };

    // Handle filter button click
    const handleFilterClick = () => {
        applyFilters();
    };

    // Handle university change - reset faculty when university changes
    const handleUniversityChange = (value) => {
        setSelectedUniversity(value);
        setSelectedFaculty(''); // Reset faculty when university changes

        // Apply filters immediately when university changes
        applyFilters({
            search,
            university: value,
            faculty: '',
            status: selectedStatus
        });
    };

    // Handle faculty change
    const handleFacultyChange = (value) => {
        setSelectedFaculty(value);
        applyFilters({
            search,
            university: selectedUniversity,
            faculty: value,
            status: selectedStatus
        });
    };

    // Handle status change
    const handleStatusChange = (value) => {
        setSelectedStatus(value);
        applyFilters({
            search,
            university: selectedUniversity,
            faculty: selectedFaculty,
            status: value
        });
    };

    // Filter faculties based on selected university
    const filteredFaculties = faculties.filter(faculty => {
        if (!selectedUniversity) return true;
        // Note: This filtering should ideally be done server-side, but for now we'll show all
        // The server-side filtering is already handled in the controller
        return true;
    });


    const tabs = [
        { id: 'academicians', label: 'Academicians', count: academicians?.total || 0 },
        { id: 'postgraduates', label: 'Postgraduates', count: postgraduates?.total || 0 },
        { id: 'undergraduates', label: 'Undergraduates', count: undergraduates?.total || 0 },
    ];
    
    // Update URL query parameter when tab changes and reset all filters
    const handleTabChange = (tabId) => {
        // Reset all filter states
        setSearch('');
        setSelectedUniversity('');
        setSelectedFaculty('');
        setSelectedStatus('');

        // Clear any pending search timeout
        clearSearchTimeout();

        // Navigate with only the tab parameter (filters reset)
        router.get(route('admin.profiles.index', { tab: tabId }), {
            preserveState: true,
            replace: true
        });
    };

    
    return (
        <MainLayout title="User Profile Management">
            <Head title="User Profile Management" />
            
            <div className='mb-0 lg:mb-6 px-4 lg:px-0 py-6 md:py-8 lg:py-0'>
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200 mr-0">
                        {/* Search and Filter Section */}
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
                                {/* Search Input */}
                                <div className="flex-1 min-w-0">
                                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                                        Search by Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaSearch className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            id="search"
                                            value={search}
                                            onChange={(e) => handleSearchChange(e.target.value)}
                                            placeholder="Search users by name..."
                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                {/* University Filter */}
                                <div className="w-full lg:w-48">
                                    <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-1">
                                        University
                                    </label>
                                    <select
                                        id="university"
                                        value={selectedUniversity}
                                        onChange={(e) => handleUniversityChange(e.target.value)}
                                        className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    >
                                        <option value="">All Universities</option>
                                        {universities.map((university) => (
                                            <option key={university.id} value={university.id}>
                                                {university.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Faculty Filter */}
                                <div className="w-full lg:w-48">
                                    <label htmlFor="faculty" className="block text-sm font-medium text-gray-700 mb-1">
                                        Faculty
                                    </label>
                                    <select
                                        id="faculty"
                                        value={selectedFaculty}
                                        onChange={(e) => handleFacultyChange(e.target.value)}
                                        className={`block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                            !selectedUniversity ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'
                                        }`}
                                        disabled={!selectedUniversity}
                                    >
                                        <option value="">
                                            {selectedUniversity ? 'All Faculties' : 'Please select a university first'}
                                        </option>
                                        {filteredFaculties.map((faculty) => (
                                            <option key={faculty.id} value={faculty.id}>
                                                {faculty.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Status Filter */}
                                <div className="w-full lg:w-48">
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                        Profile Status
                                    </label>
                                    <select
                                        id="status"
                                        value={selectedStatus}
                                        onChange={(e) => handleStatusChange(e.target.value)}
                                        className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    >
                                        <option value="">All Statuses</option>
                                        {statuses.map((status) => (
                                            <option key={status} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Tab Navigation */}
                        <div className="border-b border-gray-200">
                            <nav className="flex -mb-px">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => handleTabChange(tab.id)}
                                        className={`py-4 px-6 text-center border-b-2 font-medium text-sm sm:text-base ${
                                            activeTab === tab.id
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        } whitespace-nowrap flex items-center space-x-2`}
                                    >
                                        <span>{tab.label}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                        
                        {/* Tab Content */}
                        <div className="p-6">
                            {activeTab === 'academicians' && (
                                <AcademicianTable
                                    key={`academicians-${activeTab}`}
                                    academics={academicians?.data || []}
                                    researchOptions={researchOptions}
                                    onSendReminder={sendReminder}
                                    onSendBatchReminder={sendBatchReminder}
                                    pagination={academicians || {}}
                                    currentTab={activeTab}
                                    loading={loading}
                                />
                            )}

                            {activeTab === 'postgraduates' && (
                                <PostgraduateTable
                                    key={`postgraduates-${activeTab}`}
                                    postgraduates={postgraduates?.data || []}
                                    researchOptions={researchOptions}
                                    onSendReminder={sendReminder}
                                    onSendBatchReminder={sendBatchReminder}
                                    pagination={postgraduates || {}}
                                    currentTab={activeTab}
                                    loading={loading}
                                />
                            )}

                            {activeTab === 'undergraduates' && (
                                <UndergraduateTable
                                    key={`undergraduates-${activeTab}`}
                                    undergraduates={undergraduates?.data || []}
                                    researchOptions={researchOptions}
                                    onSendReminder={sendReminder}
                                    onSendBatchReminder={sendBatchReminder}
                                    pagination={undergraduates || {}}
                                    currentTab={activeTab}
                                    loading={loading}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default ProfileReminder; 