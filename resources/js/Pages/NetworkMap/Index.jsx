import { useState, useMemo, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Map } from 'lucide-react';
import MapView from './Components/MapView';
import FilterSidebar from './Components/FilterSidebar';
import StatisticsBar from './Components/StatisticsBar';
import RankingsTable from './Components/RankingsTable';
import TopBar from './Components/TopBar';
import UniversityDetailPanel from './Components/UniversityDetailPanel';
import LecturerDetailPanel from './Components/LecturerDetailPanel';
import ProjectDetailPanel from './Components/ProjectDetailPanel';
import IndustryDetailPanel from './Components/IndustryDetailPanel';
import { universities, communityProjects, industryPartners, malaysianStates } from '@/Data/networkMapData';

// Mock researcher data with locations
const mockResearchers = [
    { id: '1', name: 'Dr. Ahmad Ibrahim', university: 'UTM', department: 'Computer Science', lat: 1.5583, lng: 103.6380 },
    { id: '2', name: 'Dr. Siti Nurhaliza', university: 'UM', department: 'Biotechnology', lat: 3.1210, lng: 101.6537 },
    { id: '3', name: 'Dr. Lee Wei Ming', university: 'UPM', department: 'Civil Engineering', lat: 3.0023, lng: 101.7121 },
    { id: '4', name: 'Dr. Rajesh Kumar', university: 'UTHM', department: 'Electrical Engineering', lat: 1.8645, lng: 103.0843 },
    { id: '5', name: 'Dr. Fatimah Hassan', university: 'UTeM', department: 'Mechanical Engineering', lat: 2.3108, lng: 102.3193 },
    { id: '6', name: 'Dr. Nurul Ain', university: 'UTM', department: 'Computer Science', lat: 1.5620, lng: 103.6420 },
    { id: '7', name: 'Dr. Wei Zhang', university: 'UPM', department: 'Biotechnology', lat: 3.0050, lng: 101.7080 },
    { id: '8', name: 'Dr. Priya Kumar', university: 'UM', department: 'Electrical Engineering', lat: 3.1250, lng: 101.6570 },
    { id: '9', name: 'Dr. Sokha Chea', university: 'UTHM', department: 'Materials Science', lat: 1.8670, lng: 103.0890 },
    { id: '10', name: 'Dr. Hassan Ali', university: 'UTM', department: 'Civil Engineering', lat: 1.5650, lng: 103.6360 },
];

// Mock network data
const paperNetworkData = {
    '1': [
        { id: '2', strength: 12 },
        { id: '3', strength: 8 },
        { id: '6', strength: 9 },
    ],
    '2': [
        { id: '1', strength: 12 },
        { id: '5', strength: 6 },
        { id: '8', strength: 7 },
    ],
};

const projectNetworkData = {
    '1': [
        { id: '6', strength: 3, projects: [
            { title: 'Smart Village IoT System', year: '2023' },
            { title: 'Urban Farming Initiative', year: '2024' },
        ]},
    ],
    '2': [
        { id: '8', strength: 4, projects: [
            { title: 'Urban Air Quality Monitoring', year: '2024' },
            { title: 'Community Health Monitoring', year: '2023' },
        ]},
    ],
};

// Convert to location format
const researcherLocations = mockResearchers.reduce((acc, r) => {
    acc[r.id] = r;
    return acc;
}, {});

export default function NetworkMap({ auth }) {
    const [activeTab, setActiveTab] = useState('overview'); // 'overview' or 'network'
    
    // Filter states
    const [filters, setFilters] = useState({
        search: '',
        state: '',
        type: '',
        industrySector: '',
        partnershipType: '',
        department: '',
        collaborationType: '',
        projectCategory: '',
        projectStatus: '',
        sdgTags: '',
        fundingType: '',
        showUniversities: true,
        showProjects: true,
        showIndustry: true,
    });

    // Network mode states
    const [focusedResearcher, setFocusedResearcher] = useState(null);
    const [showNetwork, setShowNetwork] = useState(false);
    const [networkTypes, setNetworkTypes] = useState({
        papers: true,
        projects: true
    });

    // Detail panel states
    const [selectedUniversity, setSelectedUniversity] = useState(null);
    const [selectedResearcher, setSelectedResearcher] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedIndustry, setSelectedIndustry] = useState(null);

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
            filteredIndustry = filteredIndustry.filter(i => 
                i.type && i.type.toLowerCase() === filters.partnershipType.toLowerCase()
            );
        }

        // Apply department filter
        if (filters.department) {
            filteredUniversities = filteredUniversities.filter(u => 
                u.departments && u.departments.includes(filters.department)
            );
        }

        // Apply collaboration type filter
        if (filters.collaborationType) {
            filteredProjects = filteredProjects.filter(p => 
                p.collaborationType === filters.collaborationType
            );
        }

        // Apply project category filter
        if (filters.projectCategory) {
            filteredProjects = filteredProjects.filter(p => 
                p.category === filters.projectCategory
            );
        }

        // Apply project status filter
        if (filters.projectStatus) {
            filteredProjects = filteredProjects.filter(p => 
                p.status === filters.projectStatus
            );
        }

        // Apply SDG tags filter
        if (filters.sdgTags) {
            filteredProjects = filteredProjects.filter(p => 
                p.sdgTags && p.sdgTags.includes(filters.sdgTags)
            );
        }

        // Apply funding type filter
        if (filters.fundingType) {
            filteredProjects = filteredProjects.filter(p => 
                p.fundingType === filters.fundingType
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

    // Prepare rankings data
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
            state: '',
            type: '',
            industrySector: '',
            partnershipType: '',
            department: '',
            collaborationType: '',
            projectCategory: '',
            projectStatus: '',
            sdgTags: '',
            fundingType: '',
            showUniversities: true,
            showProjects: true,
            showIndustry: true,
        });
    };

    const handleResearcherSelect = (researcherId) => {
        setFocusedResearcher(researcherId);
        setShowNetwork(false);
    };

    const handleClearMapData = () => {
        setFocusedResearcher(null);
        setShowNetwork(false);
    };

    const handleUniversityClick = (name) => {
        const uni = universities.find(u => u.name === name || u.shortName === name);
        setSelectedUniversity(uni);
    };

    const handleResearcherClick = (name) => {
        const researcher = mockResearchers.find(r => r.name === name);
        setSelectedResearcher(researcher);
    };

    const handleProjectClick = (name) => {
        const project = communityProjects.find(p => p.name === name);
        setSelectedProject(project);
    };

    const handleIndustryClick = (name) => {
        const industry = industryPartners.find(i => i.name === name);
        setSelectedIndustry(industry);
    };

    const getPartnerUniversities = (partner) => {
        if (!partner || !partner.universityPartners) return [];
        return universities.filter(u => partner.universityPartners.includes(u.id));
    };

    return (
        <div user={auth.user}>
            <Head title="Network Map - NexScholar Malaysia" />

            <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-900">
                {/* Filter Sidebar */}
                <FilterSidebar
                    activeTab={activeTab}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onReset={resetFilters}
                    allUniversities={universities}
                    malaysianStates={malaysianStates}
                    mockResearchers={mockResearchers}
                    onResearcherSelect={handleResearcherSelect}
                    onTabChange={setActiveTab}
                    networkTypes={networkTypes}
                    setNetworkTypes={setNetworkTypes}
                    onClearMapData={handleClearMapData}
                />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* AI Search TopBar - Sticky at top */}
                    <div className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm">
                        <TopBar />
                    </div>
                    
                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto">
                        {/* Header */}
                        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                                            <Map className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">NexScholar Malaysia Network Map</span>
                                    </div>
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {activeTab === 'overview' 
                                            ? 'Universities, Researchers & Community Projects'
                                            : 'Researcher Collaboration Network'
                                        }
                                    </h1>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Statistics Bar - only show in overview */}
                            {activeTab === 'overview' && <StatisticsBar statistics={statistics} />}

                            {/* Map */}
                            <MapView
                                mode={activeTab}
                                focusedResearcher={focusedResearcher}
                                showNetwork={showNetwork}
                                onUniversityClick={handleUniversityClick}
                                onResearcherClick={handleResearcherClick}
                                onProjectClick={handleProjectClick}
                                onIndustryClick={handleIndustryClick}
                                onShowNetwork={() => setShowNetwork(true)}
                                layers={{
                                    universities: filters.showUniversities,
                                    projects: filters.showProjects,
                                    industry: filters.showIndustry
                                }}
                                networkTypes={networkTypes}
                                universities={filteredData.universities}
                                researchers={mockResearchers}
                                projects={filteredData.projects}
                                industries={filteredData.industry}
                                paperNetworkData={paperNetworkData}
                                projectNetworkData={projectNetworkData}
                                researcherLocations={researcherLocations}
                            />

                            {/* University Rankings - only show in overview */}
                            {activeTab === 'overview' && <RankingsTable data={rankingsData} />}
                        </div>
                    </div>
                </div>
            </div>

            {/* Detail Panels (slide from right) */}
            {selectedUniversity && (
                <UniversityDetailPanel 
                    university={selectedUniversity} 
                    onClose={() => setSelectedUniversity(null)} 
                />
            )}

            {selectedResearcher && (
                <LecturerDetailPanel 
                    researcher={selectedResearcher} 
                    onClose={() => setSelectedResearcher(null)} 
                />
            )}

            {selectedProject && (
                <ProjectDetailPanel 
                    project={selectedProject} 
                    onClose={() => setSelectedProject(null)} 
                />
            )}

            {selectedIndustry && (
                <IndustryDetailPanel 
                    partner={selectedIndustry} 
                    partnerUniversities={getPartnerUniversities(selectedIndustry)}
                    onClose={() => setSelectedIndustry(null)}
                />
            )}
        </div>
    );
}
