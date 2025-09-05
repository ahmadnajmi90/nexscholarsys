import React, { useState, useEffect, useCallback, useRef } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, usePage, router } from '@inertiajs/react';
import axios from 'axios';
import AcademicianTable from './Components/AcademicianTable';
import PostgraduateTable from './Components/PostgraduateTable';
import UndergraduateTable from './Components/UndergraduateTable';

const ProfileReminder = ({
    academicians,
    postgraduates,
    undergraduates,
    activeTab: initialActiveTab,
    filterOptions,
    researchOptions,
    filters: initialFilters
}) => {
    const { url } = usePage();
    
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

    // Initialize filter states from controller data
    const getInitialFilters = () => {
        return {
            academicians: {
                search: initialFilters?.academicians_search || '',
                university: initialFilters?.academicians_university || '',
                faculty: initialFilters?.academicians_faculty || '',
                status: initialFilters?.academicians_status || ''
            },
            postgraduates: {
                search: initialFilters?.postgraduates_search || '',
                university: initialFilters?.postgraduates_university || '',
                faculty: initialFilters?.postgraduates_faculty || '',
                status: initialFilters?.postgraduates_status || ''
            },
            undergraduates: {
                search: initialFilters?.undergraduates_search || '',
                university: initialFilters?.undergraduates_university || '',
                faculty: initialFilters?.undergraduates_faculty || '',
                status: initialFilters?.undergraduates_status || ''
            }
        };
    };
    
    const [activeTab, setActiveTab] = useState(getInitialActiveTab);
    const [filters, setFilters] = useState(getInitialFilters);
    const [loading, setLoading] = useState(false);

    // Local search state for debounced search
    const [localSearch, setLocalSearch] = useState({
        academicians: initialFilters?.academicians_search || '',
        postgraduates: initialFilters?.postgraduates_search || '',
        undergraduates: initialFilters?.undergraduates_search || ''
    });

    // Track if user is currently typing (for visual feedback)
    const [isTyping, setIsTyping] = useState({
        academicians: false,
        postgraduates: false,
        undergraduates: false
    });

    // Dynamic faculty state for each user type
    const [dynamicFaculties, setDynamicFaculties] = useState({
        academicians: [],
        postgraduates: [],
        undergraduates: []
    });

    // Debounced search functionality - centralized in main component
    const searchTimeoutRef = useRef(null);

    const debouncedSearch = useCallback((userType, value) => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // Set typing indicator
        setIsTyping(prev => ({ ...prev, [userType]: true }));

        searchTimeoutRef.current = setTimeout(() => {
            // Clear typing indicator
            setIsTyping(prev => ({ ...prev, [userType]: false }));

            // Update URL with the new search value
            const urlParams = new URLSearchParams(window.location.search);
            const paramKey = `${userType}_search`;

            if (value && value.trim().length > 0) {
                urlParams.set(paramKey, value.trim());
            } else {
                urlParams.delete(paramKey);
            }

            // Reset page when search changes
            const pageParam = `${userType}_page`;
            urlParams.delete(pageParam);

            // Use router.get with preserveState for smooth UX
            router.get(`${window.location.pathname}?${urlParams.toString()}`, {
                preserveState: true,
                replace: true
            });
        }, 800); // Increased delay to 800ms for better UX
    }, []);

    // Watch for local search changes and trigger debounced search
    useEffect(() => {
        Object.keys(localSearch).forEach(userType => {
            const currentSearch = localSearch[userType];
            const lastSearch = filters[userType]?.search || '';
            
            // Only trigger search if the value has actually changed and is different from the last search
            if (currentSearch !== lastSearch) {
                // For clearing search, trigger immediately
                if (currentSearch === '') {
                    debouncedSearch(userType, currentSearch);
                } 
                // For typing, only search if at least 2 characters or if it's a clear operation
                else if (currentSearch.length >= 2) {
                    debouncedSearch(userType, currentSearch);
                }
            }
        });
    }, [localSearch, debouncedSearch]);

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

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);
    
    // Update the tab state when URL changes
    useEffect(() => {
        setActiveTab(getInitialActiveTab());
    }, [url]);

    
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

    // Handle filter changes
    const handleFilterChange = (userType, filterType, value) => {
        // Update URL with the new filter value
        const urlParams = new URLSearchParams(window.location.search);
        const paramKey = `${userType}_${filterType}`;

        if (value) {
            urlParams.set(paramKey, value);
        } else {
            urlParams.delete(paramKey);
        }

        // Reset faculty when university changes
        if (filterType === 'university' && value) {
            const facultyParam = `${userType}_faculty`;
            urlParams.delete(facultyParam);
        }

        // Reset page when filter changes
        const pageParam = `${userType}_page`;
        urlParams.delete(pageParam);

        // Use router.get with preserveState for smooth UX (no UI flicker)
        router.get(`${window.location.pathname}?${urlParams.toString()}`, {
            preserveState: true,
            replace: true
        });
    };

    // Handle search changes - update local state, debounced search is handled by useEffect
    const handleSearchChange = (userType, value) => {
        // Update local search state immediately for UI responsiveness
        setLocalSearch(prev => ({
            ...prev,
            [userType]: value
        }));
    };

    const tabs = [
        { id: 'academicians', label: 'Academicians', count: academicians?.total || 0 },
        { id: 'postgraduates', label: 'Postgraduates', count: postgraduates?.total || 0 },
        { id: 'undergraduates', label: 'Undergraduates', count: undergraduates?.total || 0 },
    ];
    
    // Update URL query parameter when tab changes - use router.get for on-demand loading
    const handleTabChange = (tabId) => {
        // Use router.get to load data for the new tab on-demand with smooth UX
        router.get(route('admin.profiles.index', {
            tab: tabId,
            // Reset pagination for the new tab
            [`${tabId}_page`]: 1
        }), {
            preserveState: true,
            replace: true
        });
    };

    // Handle dynamic faculty loading when university changes
    const handleUniversityChange = async (userType, universityId) => {
        try {
            // First update the filter state
            setFilters(prev => ({
                ...prev,
                [userType]: {
                    ...prev[userType],
                    university: universityId,
                    faculty: '' // Reset faculty when university changes
                }
            }));

            if (universityId) {
                // Fetch faculties for the selected university
                const response = await axios.get(route('admin.profiles.faculties-by-university'), {
                    params: {
                        university_id: universityId,
                        user_type: userType
                    }
                });

                if (response.data.faculties) {
                    // Update the dynamic faculties state - ensure it's always an array
                    const facultiesArray = Array.isArray(response.data.faculties)
                        ? response.data.faculties
                        : [];
                    setDynamicFaculties(prev => ({
                        ...prev,
                        [userType]: facultiesArray
                    }));
                }
            } else {
                // Reset to empty faculties when no university is selected
                setDynamicFaculties(prev => ({
                    ...prev,
                    [userType]: []
                }));
            }

            // Update URL with the new university filter
            const urlParams = new URLSearchParams(window.location.search);
            urlParams.set(`${userType}_university`, universityId);
            urlParams.delete(`${userType}_faculty`); // Reset faculty
            urlParams.delete(`${userType}_page`); // Reset page

            router.get(`${window.location.pathname}?${urlParams.toString()}`, {
                preserveState: true,
                replace: true
            });
        } catch (error) {
            console.error('Error fetching faculties:', error);
        }
    };
    
    return (
        <MainLayout title="User Profile Management">
            <Head title="User Profile Management" />
            
            <div className='mb-0 lg:mb-6 px-4 lg:px-0 py-6 md:py-8 lg:py-0'> 
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200 mr-0">
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
                                    universities={filterOptions?.academicians?.universities || {}}
                                    faculties={dynamicFaculties.academicians.length > 0 ? dynamicFaculties.academicians : (filterOptions?.academicians?.faculties || [])}
                                    researchOptions={researchOptions}
                                    onSendReminder={sendReminder}
                                    onSendBatchReminder={sendBatchReminder}
                                    pagination={academicians || {}}
                                    currentTab={activeTab}
                                    filters={filters.academicians}
                                                                        onFilterChange={handleFilterChange}
                                    onSearchChange={handleSearchChange}
                                    onUniversityChange={handleUniversityChange}
                                    loading={loading}
                                    isTyping={isTyping.academicians}
                                    localSearch={localSearch.academicians}
                                />
                            )}

                            {activeTab === 'postgraduates' && (
                                <PostgraduateTable 
                                    key={`postgraduates-${activeTab}`}
                                    postgraduates={postgraduates?.data || []}
                                    universities={filterOptions?.postgraduates?.universities || {}}
                                    faculties={dynamicFaculties.postgraduates.length > 0 ? dynamicFaculties.postgraduates : (filterOptions?.postgraduates?.faculties || [])}
                                    researchOptions={researchOptions}
                                    onSendReminder={sendReminder}
                                    onSendBatchReminder={sendBatchReminder}
                                    pagination={postgraduates || {}}
                                    currentTab={activeTab}
                                    filters={filters.postgraduates}
                                                                        onFilterChange={handleFilterChange}
                                    onSearchChange={handleSearchChange}
                                    onUniversityChange={handleUniversityChange}
                                    loading={loading}
                                    isTyping={isTyping.postgraduates}
                                    localSearch={localSearch.postgraduates}
                                />
                            )}

                            {activeTab === 'undergraduates' && (
                                <UndergraduateTable
                                    key={`undergraduates-${activeTab}`}
                                    undergraduates={undergraduates?.data || []}
                                    universities={filterOptions?.undergraduates?.universities || {}}
                                    faculties={dynamicFaculties.undergraduates.length > 0 ? dynamicFaculties.undergraduates : (filterOptions?.undergraduates?.faculties || [])}
                                    researchOptions={researchOptions}
                                    onSendReminder={sendReminder}
                                    onSendBatchReminder={sendBatchReminder}
                                    pagination={undergraduates || {}}
                                    currentTab={activeTab}
                                    filters={filters.undergraduates}
                                    onFilterChange={handleFilterChange}
                                    onSearchChange={handleSearchChange}
                                    onUniversityChange={handleUniversityChange}
                                    loading={loading}
                                    isTyping={isTyping.undergraduates}
                                    localSearch={localSearch.undergraduates}
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