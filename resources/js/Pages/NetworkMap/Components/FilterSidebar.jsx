import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Building2, MapPin, User, Users, ArrowLeft } from 'lucide-react';
import { router } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function FilterSidebar({ 
    activeTab, 
    filters, 
    onFilterChange, 
    onReset, 
    allUniversities, 
    malaysianStates,
    mockResearchers = [],
    onResearcherSelect,
    onTabChange,
    networkTypes,
    setNetworkTypes,
    onClearMapData
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUniversity, setSelectedUniversity] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');

    const handleCheckboxChange = (key, checked) => {
        onFilterChange({ [key]: checked });
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        setSelectedUniversity('');
        setSelectedDepartment('');
        onClearMapData?.();
    };

    // Get unique departments for selected university
    const availableDepartments = selectedUniversity
        ? Array.from(new Set(mockResearchers
            .filter(r => r.university === selectedUniversity)
            .map(r => r.department)))
        : [];

    // Filter researchers based on selections
    const filteredResearchers = mockResearchers.filter(r => {
        if (selectedUniversity && r.university !== selectedUniversity) return false;
        if (selectedDepartment && r.department !== selectedDepartment) return false;
        if (searchQuery && !r.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    const projectTypes = ['Environmental', 'Agriculture', 'Education', 'Energy', 'Cultural', 'Healthcare', 'Economic', 'Technology'];
    const industrySectors = ['Education', 'Technology', 'Healthcare', 'Agriculture', 'Energy', 'Environmental', 'Finance', 'Tourism', 'Manufacturing', 'Cultural'];

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col overflow-hidden"
        >
            {/* Back Button */}
            <div className="p-4 pb-0">
                <Button
                    variant="ghost"
                    onClick={() => router.visit('/dashboard')}
                    className="w-full justify-start gap-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Button>
            </div>

            {/* Tabs */}
            <div className="p-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                <Tabs value={activeTab} onValueChange={(v) => onTabChange(v)} className="w-full">
                    <TabsList className="w-full h-auto grid grid-cols-2 bg-gray-100 dark:bg-gray-900 p-1">
                        <TabsTrigger 
                            value="overview" 
                            className="text-xs py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm"
                        >
                            📍 Overview
                        </TabsTrigger>
                        <TabsTrigger 
                            value="network" 
                            className="text-xs py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm"
                        >
                            🔗 Network
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {activeTab === 'overview' ? (
                    <>
                        {/* Overview Tab Content */}
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            <h2 className="font-semibold text-gray-900 dark:text-white">Map Layers</h2>
                        </div>

                        {/* Layer Filters */}
                        <div className="space-y-3 pb-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id="show-universities" 
                                    checked={filters.showUniversities}
                                    onCheckedChange={(checked) => handleCheckboxChange('showUniversities', checked)}
                                />
                                <Label htmlFor="show-universities" className="flex items-center gap-2 cursor-pointer text-sm">
                                    <Building2 className="w-4 h-4 text-blue-500" />
                                    <span>Universities</span>
                                </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id="show-projects" 
                                    checked={filters.showProjects}
                                    onCheckedChange={(checked) => handleCheckboxChange('showProjects', checked)}
                                />
                                <Label htmlFor="show-projects" className="flex items-center gap-2 cursor-pointer text-sm">
                                    <MapPin className="w-4 h-4 text-amber-500" />
                                    <span>Community Projects</span>
                                </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id="show-industry" 
                                    checked={filters.showIndustry}
                                    onCheckedChange={(checked) => handleCheckboxChange('showIndustry', checked)}
                                />
                                <Label htmlFor="show-industry" className="flex items-center gap-2 cursor-pointer text-sm">
                                    <Building2 className="w-4 h-4 text-purple-600" />
                                    <span>Industry Partners</span>
                                </Label>
                            </div>
                        </div>

                        {/* Search */}
                        <div className="space-y-2">
                            <Label htmlFor="search" className="text-sm">Search</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                <Input 
                                    id="search"
                                    placeholder="University, project, or industry..." 
                                    value={filters.search}
                                    onChange={(e) => onFilterChange({ search: e.target.value })}
                                    className="pl-9" 
                                />
                            </div>
                        </div>

                        {/* State Filter */}
                        <div className="space-y-2">
                            <Label htmlFor="state" className="text-sm">State</Label>
                            <Select
                                value={filters.state || ""}
                                onValueChange={(value) => onFilterChange({ state: value === "all" ? "" : value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All States" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All States</SelectItem>
                                    {malaysianStates.map(state => (
                                        <SelectItem key={state} value={state}>
                                            {state}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Project Type */}
                        <div className="space-y-2">
                            <Label htmlFor="type" className="text-sm">Project Type</Label>
                            <Select
                                value={filters.type || ""}
                                onValueChange={(value) => onFilterChange({ type: value === "all" ? "" : value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All Types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    {projectTypes.map(type => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Industry Sector */}
                        <div className="space-y-2">
                            <Label htmlFor="industry-sector" className="text-sm">Industry Sector</Label>
                            <Select
                                value={filters.industrySector || ""}
                                onValueChange={(value) => onFilterChange({ industrySector: value === "all" ? "" : value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All Sectors" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Sectors</SelectItem>
                                    {industrySectors.map(sector => (
                                        <SelectItem key={sector} value={sector}>
                                            {sector}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Partnership Type */}
                        <div className="space-y-2">
                            <Label htmlFor="partnership-type" className="text-sm">Partnership Type</Label>
                            <Select
                                value={filters.partnershipType || ""}
                                onValueChange={(value) => onFilterChange({ partnershipType: value === "all" ? "" : value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All Types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="funding">Funding</SelectItem>
                                    <SelectItem value="joint-lab">Joint Lab</SelectItem>
                                    <SelectItem value="internship">Internship/Training</SelectItem>
                                    <SelectItem value="community">Community Projects</SelectItem>
                                    <SelectItem value="research-grants">Research Grants</SelectItem>
                                    <SelectItem value="pilot">Pilot Projects</SelectItem>
                                    <SelectItem value="tech-transfer">Technology Transfer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Department Filter */}
                        <div className="space-y-2">
                            <Label htmlFor="department" className="text-sm">Department</Label>
                            <Select
                                value={filters.department || ""}
                                onValueChange={(value) => onFilterChange({ department: value === "all" ? "" : value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All Departments" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Departments</SelectItem>
                                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                                    <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                                    <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                                    <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                                    <SelectItem value="Biotechnology">Biotechnology</SelectItem>
                                    <SelectItem value="Environmental Science">Environmental Science</SelectItem>
                                    <SelectItem value="Marine Science">Marine Science</SelectItem>
                                    <SelectItem value="Information Technology">Information Technology</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Collaboration Type */}
                        <div className="space-y-2">
                            <Label htmlFor="collaboration-type" className="text-sm">Collaboration Type</Label>
                            <Select
                                value={filters.collaborationType || ""}
                                onValueChange={(value) => onFilterChange({ collaborationType: value === "all" ? "" : value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All Types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="intra">Intra-University</SelectItem>
                                    <SelectItem value="inter">Inter-University</SelectItem>
                                    <SelectItem value="international">International</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Project Category */}
                        <div className="space-y-2">
                            <Label htmlFor="project-category" className="text-sm">Project Category</Label>
                            <Select
                                value={filters.projectCategory || ""}
                                onValueChange={(value) => onFilterChange({ projectCategory: value === "all" ? "" : value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    <SelectItem value="community">Community</SelectItem>
                                    <SelectItem value="lab">Lab Extension</SelectItem>
                                    <SelectItem value="pilot">Pilot Site</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Project Status */}
                        <div className="space-y-2">
                            <Label htmlFor="project-status" className="text-sm">Project Status</Label>
                            <Select
                                value={filters.projectStatus || ""}
                                onValueChange={(value) => onFilterChange({ projectStatus: value === "all" ? "" : value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                    <SelectItem value="Planning">Planning</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* SDG Tags */}
                        <div className="space-y-2">
                            <Label htmlFor="sdg-tags" className="text-sm">SDG Tags</Label>
                            <Select
                                value={filters.sdgTags || ""}
                                onValueChange={(value) => onFilterChange({ sdgTags: value === "all" ? "" : value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All SDGs" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All SDGs</SelectItem>
                                    <SelectItem value="SDG 3">SDG 3: Health</SelectItem>
                                    <SelectItem value="SDG 4">SDG 4: Quality Education</SelectItem>
                                    <SelectItem value="SDG 7">SDG 7: Clean Energy</SelectItem>
                                    <SelectItem value="SDG 9">SDG 9: Innovation</SelectItem>
                                    <SelectItem value="SDG 11">SDG 11: Sustainable Cities</SelectItem>
                                    <SelectItem value="SDG 13">SDG 13: Climate Action</SelectItem>
                                    <SelectItem value="SDG 15">SDG 15: Life on Land</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Funding Type */}
                        <div className="space-y-2">
                            <Label htmlFor="funding-type" className="text-sm">Funding Type</Label>
                            <Select
                                value={filters.fundingType || ""}
                                onValueChange={(value) => onFilterChange({ fundingType: value === "all" ? "" : value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All Types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="internal">Internal</SelectItem>
                                    <SelectItem value="government">Government</SelectItem>
                                    <SelectItem value="industry">Industry</SelectItem>
                                    <SelectItem value="international">International</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Reset Button */}
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={onReset}
                        >
                            Reset Filters
                        </Button>
                    </>
                ) : (
                    <>
                        {/* Network Tab Content */}
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            <h2 className="font-semibold text-gray-900 dark:text-white">Researcher Search</h2>
                        </div>

                        {/* University Filter */}
                        <div className="space-y-2">
                            <Label htmlFor="selected-university" className="text-sm">University</Label>
                            <Select 
                                value={selectedUniversity} 
                                onValueChange={(value) => {
                                    if (value === 'all' || value === '') {
                                        setSelectedUniversity('');
                                        setSelectedDepartment('');
                                        onClearMapData?.();
                                    } else {
                                        setSelectedUniversity(value);
                                        setSelectedDepartment('');
                                    }
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select University" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Universities</SelectItem>
                                    {allUniversities.map((uni) => (
                                        <SelectItem key={uni.id} value={uni.shortName}>
                                            {uni.shortName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Department Filter */}
                        <div className="space-y-2">
                            <Label htmlFor="selected-department" className="text-sm">Department</Label>
                            <Select 
                                value={selectedDepartment} 
                                onValueChange={(value) => {
                                    if (value === 'all' || value === '') {
                                        setSelectedDepartment('');
                                    } else {
                                        setSelectedDepartment(value);
                                    }
                                }}
                                disabled={!selectedUniversity}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={selectedUniversity ? "Select Department" : "Select university first"} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Departments</SelectItem>
                                    {availableDepartments.map((dept) => (
                                        <SelectItem key={dept} value={dept}>
                                            {dept}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Search researcher by name */}
                        <div className="space-y-2">
                            <Label htmlFor="search-researcher" className="text-sm">Search Researcher</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                <Input 
                                    id="search-researcher"
                                    placeholder="Search by name..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        {/* Researchers List - Only show when user types in search */}
                        {searchQuery && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                                        Researchers ({filteredResearchers.length})
                                    </div>
                                    <button
                                        onClick={handleClearFilters}
                                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                        Clear filters
                                    </button>
                                </div>
                                
                                <div className="space-y-1 max-h-[400px] overflow-y-auto">
                                    {filteredResearchers.length > 0 ? (
                                        filteredResearchers.map((researcher) => (
                                            <button
                                                key={researcher.id}
                                                onClick={() => {
                                                    onResearcherSelect(researcher.id);
                                                }}
                                                className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                <div className="font-medium text-sm text-gray-900 dark:text-white">{researcher.name}</div>
                                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                                    {researcher.department} • {researcher.university}
                                                </div>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="text-xs text-gray-600 dark:text-gray-400 text-center py-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                                            No researchers found with current filters
                                        </div>
                                    )}
                                </div>

                                <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-3">
                                    Select a researcher to view their network
                                </p>
                            </div>
                        )}

                        {/* Network Type Filters */}
                        <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Network Type</h3>
                            
                            <div className="space-y-3">
                                <div className="flex items-center space-x-2">
                                    <Checkbox 
                                        id="paper-network" 
                                        checked={networkTypes.papers}
                                        onCheckedChange={() => setNetworkTypes(prev => ({ ...prev, papers: !prev.papers }))}
                                    />
                                    <Label htmlFor="paper-network" className="flex items-center gap-2 cursor-pointer text-sm">
                                        <div className="w-6 h-0.5 bg-blue-500"></div>
                                        <span>Paper Collaboration</span>
                                    </Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox 
                                        id="project-network" 
                                        checked={networkTypes.projects}
                                        onCheckedChange={() => setNetworkTypes(prev => ({ ...prev, projects: !prev.projects }))}
                                    />
                                    <Label htmlFor="project-network" className="flex items-center gap-2 cursor-pointer text-sm">
                                        <div className="w-6 h-0.5 bg-green-500"></div>
                                        <span>Project Collaboration</span>
                                    </Label>
                                </div>
                            </div>

                            <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-4">
                                💡 More filters coming in Phase 2
                            </p>
                        </div>
                    </>
                )}
            </div>
        </motion.div>
    );
}
