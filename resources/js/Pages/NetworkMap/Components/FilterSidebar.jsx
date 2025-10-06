import { motion } from 'framer-motion';
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

export default function FilterSidebar({ filters, onFilterChange, onReset, activeTab, allUniversities, malaysianStates }) {
    const projectTypes = ['Environmental', 'Agriculture', 'Education', 'Energy', 'Cultural', 'Healthcare', 'Economic', 'Technology'];
    const industrySectors = ['Education', 'Technology', 'Healthcare', 'Agriculture', 'Energy', 'Environmental', 'Finance', 'Tourism', 'Manufacturing', 'Cultural'];
    const partnershipTypes = ['EdTech Platform', 'Green Energy', 'Medical Devices', 'Smart Farming', 'Oil & Gas', 'Cybersecurity', 'Non-Profit', 'IoT & Smart Systems', 'Pharmaceuticals', 'Hospitality Tech', 'Financial Technology', 'Artificial Intelligence', 'Water Treatment', 'Industrial Automation'];
    const collaborationTypes = ['Community Outreach', 'Public-Private Partnership', 'NGO Collaboration', 'Government Partnership', 'Museum Partnership', 'International Collaboration', 'Industry Partnership', 'Healthcare Partnership', 'Research Collaboration'];
    
    // Get unique departments from all universities
    const allDepartments = [...new Set(allUniversities.flatMap(u => u.departments))].sort();

    const handleCheckboxChange = (key, checked) => {
        onFilterChange({ [key]: checked });
    };

    if (activeTab === 'overview') {
        return (
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6 h-fit sticky top-6"
            >
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Map Layers
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="show-universities"
                                checked={filters.showUniversities}
                                onCheckedChange={(checked) => handleCheckboxChange('showUniversities', checked)}
                            />
                            <Label htmlFor="show-universities" className="text-sm cursor-pointer">
                                🎓 Universities
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="show-projects"
                                checked={filters.showProjects}
                                onCheckedChange={(checked) => handleCheckboxChange('showProjects', checked)}
                            />
                            <Label htmlFor="show-projects" className="text-sm cursor-pointer">
                                📋 Community Projects
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="show-industry"
                                checked={filters.showIndustry}
                                onCheckedChange={(checked) => handleCheckboxChange('showIndustry', checked)}
                            />
                            <Label htmlFor="show-industry" className="text-sm cursor-pointer">
                                🏢 Industry Partners
                            </Label>
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Filters
                    </h3>
                    
                    <div className="space-y-4">
                        {/* Search */}
                        <div>
                            <Label htmlFor="search" className="text-sm mb-2 block">
                                Search
                            </Label>
                            <Input
                                id="search"
                                type="text"
                                placeholder="University, project, or industry"
                                value={filters.search}
                                onChange={(e) => onFilterChange({ search: e.target.value })}
                                className="w-full"
                            />
                        </div>

                        {/* University */}
                        <div>
                            <Label htmlFor="university" className="text-sm mb-2 block">
                                University
                            </Label>
                            <Select
                                value={filters.university}
                                onValueChange={(value) => onFilterChange({ university: value })}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="All Universities" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value=" ">All Universities</SelectItem>
                                    {allUniversities.map(uni => (
                                        <SelectItem key={uni.id} value={uni.name}>
                                            {uni.shortName} - {uni.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* State */}
                        <div>
                            <Label htmlFor="state" className="text-sm mb-2 block">
                                State
                            </Label>
                            <Select
                                value={filters.state}
                                onValueChange={(value) => onFilterChange({ state: value })}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="All States" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value=" ">All States</SelectItem>
                                    {malaysianStates.map(state => (
                                        <SelectItem key={state} value={state}>
                                            {state}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Project Type */}
                        <div>
                            <Label htmlFor="type" className="text-sm mb-2 block">
                                Project Type
                            </Label>
                            <Select
                                value={filters.type}
                                onValueChange={(value) => onFilterChange({ type: value })}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="All Types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value=" ">All Types</SelectItem>
                                    {projectTypes.map(type => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Industry Sector */}
                        <div>
                            <Label htmlFor="industry-sector" className="text-sm mb-2 block">
                                Industry Sector
                            </Label>
                            <Select
                                value={filters.industrySector}
                                onValueChange={(value) => onFilterChange({ industrySector: value })}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="All Sectors" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value=" ">All Sectors</SelectItem>
                                    {industrySectors.map(sector => (
                                        <SelectItem key={sector} value={sector}>
                                            {sector}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Partnership Type */}
                        <div>
                            <Label htmlFor="partnership-type" className="text-sm mb-2 block">
                                Partnership Type
                            </Label>
                            <Select
                                value={filters.partnershipType}
                                onValueChange={(value) => onFilterChange({ partnershipType: value })}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="All Types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value=" ">All Types</SelectItem>
                                    {partnershipTypes.map(type => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Department */}
                        <div>
                            <Label htmlFor="department" className="text-sm mb-2 block">
                                Department
                            </Label>
                            <Select
                                value={filters.department}
                                onValueChange={(value) => onFilterChange({ department: value })}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="All Departments" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value=" ">All Departments</SelectItem>
                                    {allDepartments.map(dept => (
                                        <SelectItem key={dept} value={dept}>
                                            {dept}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Collaboration Type */}
                        <div>
                            <Label htmlFor="collaboration-type" className="text-sm mb-2 block">
                                Collaboration Type
                            </Label>
                            <Select
                                value={filters.collaborationType}
                                onValueChange={(value) => onFilterChange({ collaborationType: value })}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="All Types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value=" ">All Types</SelectItem>
                                    {collaborationTypes.map(type => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Reset Button */}
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={onReset}
                >
                    Reset Filters
                </Button>
            </motion.div>
        );
    }

    // Network Tab Filters
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6 h-fit sticky top-6"
        >
            <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Network Filters
                </h3>
                
                <div className="space-y-4">
                    {/* Select University */}
                    <div>
                        <Label htmlFor="selected-university" className="text-sm mb-2 block">
                            Select University
                        </Label>
                        <Select
                            value={filters.selectedUniversity}
                            onValueChange={(value) => onFilterChange({ selectedUniversity: value })}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Choose a university" />
                            </SelectTrigger>
                            <SelectContent>
                                {allUniversities.map(uni => (
                                    <SelectItem key={uni.id} value={uni.name}>
                                        {uni.shortName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Department (requires university) */}
                    <div>
                        <Label htmlFor="selected-department" className="text-sm mb-2 block">
                            Department
                        </Label>
                        <Select
                            value={filters.selectedDepartment}
                            onValueChange={(value) => onFilterChange({ selectedDepartment: value })}
                            disabled={!filters.selectedUniversity}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={
                                    filters.selectedUniversity 
                                        ? "Select department" 
                                        : "Select university first"
                                } />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value=" ">All Departments</SelectItem>
                                {filters.selectedUniversity && allDepartments.map(dept => (
                                    <SelectItem key={dept} value={dept}>
                                        {dept}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Search Researcher */}
                    <div>
                        <Label htmlFor="search-researcher" className="text-sm mb-2 block">
                            Search Researcher by Name
                        </Label>
                        <Input
                            id="search-researcher"
                            type="text"
                            placeholder="Enter researcher name"
                            value={filters.searchResearcher}
                            onChange={(e) => onFilterChange({ searchResearcher: e.target.value })}
                            className="w-full"
                        />
                    </div>

                    {/* Network Type */}
                    <div>
                        <Label className="text-sm mb-3 block">
                            Network Type
                        </Label>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="paper-collab"
                                    checked={filters.networkTypes.paperCollaboration}
                                    onCheckedChange={(checked) => onFilterChange({ 
                                        networkTypes: { 
                                            ...filters.networkTypes, 
                                            paperCollaboration: checked 
                                        } 
                                    })}
                                />
                                <Label htmlFor="paper-collab" className="text-sm cursor-pointer">
                                    Paper Collaboration
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="project-collab"
                                    checked={filters.networkTypes.projectCollaboration}
                                    onCheckedChange={(checked) => onFilterChange({ 
                                        networkTypes: { 
                                            ...filters.networkTypes, 
                                            projectCollaboration: checked 
                                        } 
                                    })}
                                />
                                <Label htmlFor="project-collab" className="text-sm cursor-pointer">
                                    Project Collaboration
                                </Label>
                            </div>
                        </div>
                    </div>

                    {/* Limit Collaborators */}
                    <div>
                        <Label htmlFor="collab-limit" className="text-sm mb-2 block">
                            Limit Collaborators: Top {filters.collaboratorLimit}
                        </Label>
                        <Input
                            id="collab-limit"
                            type="range"
                            min="5"
                            max="50"
                            step="5"
                            value={filters.collaboratorLimit}
                            onChange={(e) => onFilterChange({ collaboratorLimit: parseInt(e.target.value) })}
                            className="w-full"
                        />
                    </div>

                    {/* Malaysia Only */}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="malaysia-only"
                            checked={filters.malaysiaOnly}
                            onCheckedChange={(checked) => handleCheckboxChange('malaysiaOnly', checked)}
                        />
                        <Label htmlFor="malaysia-only" className="text-sm cursor-pointer">
                            Collaboration Scope: Malaysia only
                        </Label>
                    </div>

                    {/* Info Note */}
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                            💡 More filters coming in Phase 2
                        </p>
                    </div>
                </div>
            </div>

            {/* Reset Button */}
            <Button
                variant="outline"
                className="w-full"
                onClick={onReset}
            >
                Reset Filters
            </Button>
        </motion.div>
    );
}
