import { useState, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import MapView from './Components/MapView';
import FilterSidebar from './Components/FilterSidebar';
import StatisticsBar from './Components/StatisticsBar';
import RankingsTable from './Components/RankingsTable';
import { universities, communityProjects, industryPartners, malaysianStates } from '@/Data/networkMapData';

export default function NetworkMap({ auth }) {
    const [activeTab, setActiveTab] = useState('overview'); // 'overview' or 'network'
    
    // Filter states
    const [filters, setFilters] = useState({
        search: '',
        university: '',
        state: '',
        type: '',
        industrySector: '',
        partnershipType: '',
        department: '',
        collaborationType: '',
        showUniversities: true,
        showProjects: true,
        showIndustry: true,
        // Network tab filters
        selectedUniversity: '',
        selectedDepartment: '',
        searchResearcher: '',
        networkTypes: {
            paperCollaboration: true,
            projectCollaboration: true
        },
        collaboratorLimit: 25,
        malaysiaOnly: true
    });

    // Filtered data based on current filters
    const filteredData = useMemo(() => {
        let filteredUniversities = universities;
        let filteredProjects = communityProjects;
        let filteredIndustry = industryPartners;

        // Apply search filter
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filteredUniversities = filteredUniversities.filter(u => 
                u.name.toLowerCase().includes(searchLower) ||
                u.shortName.toLowerCase().includes(searchLower)
            );
            filteredProjects = filteredProjects.filter(p => 
                p.name.toLowerCase().includes(searchLower)
            );
            filteredIndustry = filteredIndustry.filter(i => 
                i.name.toLowerCase().includes(searchLower)
            );
        }

        // Apply state filter
        if (filters.state) {
            filteredUniversities = filteredUniversities.filter(u => u.state === filters.state);
            filteredProjects = filteredProjects.filter(p => p.location === filters.state);
            filteredIndustry = filteredIndustry.filter(i => i.location === filters.state);
        }

        // Apply university filter
        if (filters.university) {
            const selectedUni = universities.find(u => u.name === filters.university);
            if (selectedUni) {
                filteredUniversities = filteredUniversities.filter(u => u.id === selectedUni.id);
                filteredProjects = filteredProjects.filter(p => p.universityId === selectedUni.id);
                filteredIndustry = filteredIndustry.filter(i => 
                    i.universityPartners.includes(selectedUni.id)
                );
            }
        }

        // Apply department filter
        if (filters.department) {
            filteredUniversities = filteredUniversities.filter(u => 
                u.departments.includes(filters.department)
            );
        }

        // Apply type filter (for projects)
        if (filters.type) {
            filteredProjects = filteredProjects.filter(p => p.type === filters.type);
        }

        // Apply industry sector filter
        if (filters.industrySector) {
            filteredIndustry = filteredIndustry.filter(i => i.sector === filters.industrySector);
        }

        // Apply partnership type filter
        if (filters.partnershipType) {
            filteredIndustry = filteredIndustry.filter(i => i.type === filters.partnershipType);
        }

        // Apply collaboration type filter (for projects)
        if (filters.collaborationType) {
            filteredProjects = filteredProjects.filter(p => 
                p.collaborationType === filters.collaborationType
            );
        }

        return {
            universities: filters.showUniversities ? filteredUniversities : [],
            projects: filters.showProjects ? filteredProjects : [],
            industry: filters.showIndustry ? filteredIndustry : []
        };
    }, [filters]);

    // Calculate statistics
    const statistics = useMemo(() => {
        const totalUniversities = filteredData.universities.length;
        const totalResearchers = filteredData.universities.reduce((sum, u) => sum + u.researchersCount, 0);
        const totalProjects = filteredData.projects.length;
        
        // Find top research area
        const researchAreaCounts = {};
        filteredData.universities.forEach(u => {
            researchAreaCounts[u.topResearchArea] = (researchAreaCounts[u.topResearchArea] || 0) + 1;
        });
        const topResearchArea = Object.keys(researchAreaCounts).length > 0
            ? Object.keys(researchAreaCounts).reduce((a, b) => 
                researchAreaCounts[a] > researchAreaCounts[b] ? a : b
            )
            : 'N/A';
        
        // Find most active state
        const stateCounts = {};
        filteredData.universities.forEach(u => {
            stateCounts[u.state] = (stateCounts[u.state] || 0) + u.researchersCount;
        });
        const mostActiveState = Object.keys(stateCounts).length > 0
            ? Object.keys(stateCounts).reduce((a, b) => 
                stateCounts[a] > stateCounts[b] ? a : b
            )
            : 'N/A';

        return {
            totalUniversities,
            totalResearchers,
            totalProjects,
            topResearchArea,
            mostActiveState
        };
    }, [filteredData]);

    // Prepare rankings data (universities sorted by publications)
    const rankingsData = useMemo(() => {
        return [...filteredData.universities]
            .sort((a, b) => b.publications - a.publications)
            .map((uni, index) => ({
                rank: index + 1,
                ...uni
            }));
    }, [filteredData.universities]);

    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    const resetFilters = () => {
        setFilters({
            search: '',
            university: '',
            state: '',
            type: '',
            industrySector: '',
            partnershipType: '',
            department: '',
            collaborationType: '',
            showUniversities: true,
            showProjects: true,
            showIndustry: true,
            selectedUniversity: '',
            selectedDepartment: '',
            searchResearcher: '',
            networkTypes: {
                paperCollaboration: true,
                projectCollaboration: true
            },
            collaboratorLimit: 25,
            malaysiaOnly: true
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Network Map - NexScholar Malaysia" />

            <div className="min-h-screen max-w-7xl mx-auto">
                <div className="py-6 px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6"
                    >
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            NexScholar Malaysia Network Map
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Explore the research ecosystem across Malaysian universities
                        </p>
                    </motion.div>

                    {/* Tabs */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="mb-6"
                    >
                        <div className="border-b border-gray-200 dark:border-gray-700">
                            <nav className="-mb-px flex space-x-8">
                                <button
                                    onClick={() => setActiveTab('overview')}
                                    className={`${
                                        activeTab === 'overview'
                                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                                >
                                    📍 Overview: Universities, Researchers & Community Projects
                                </button>
                                <button
                                    onClick={() => setActiveTab('network')}
                                    className={`${
                                        activeTab === 'network'
                                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                                >
                                    🔗 Network: Researcher Collaboration Network
                                </button>
                            </nav>
                        </div>
                    </motion.div>

                    {/* Statistics Bar */}
                    <StatisticsBar statistics={statistics} />

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
                        {/* Filter Sidebar */}
                        <div className="lg:col-span-1">
                            <FilterSidebar
                                filters={filters}
                                onFilterChange={handleFilterChange}
                                onReset={resetFilters}
                                activeTab={activeTab}
                                allUniversities={universities}
                                malaysianStates={malaysianStates}
                            />
                        </div>

                        {/* Map and Table */}
                        <div className="lg:col-span-3">
                            <div className="space-y-6">
                                {/* Map */}
                                <MapView
                                    universities={filteredData.universities}
                                    projects={filteredData.projects}
                                    industry={filteredData.industry}
                                    activeTab={activeTab}
                                />

                                {/* Rankings Table (only on overview tab) */}
                                {activeTab === 'overview' && (
                                    <RankingsTable data={rankingsData} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
