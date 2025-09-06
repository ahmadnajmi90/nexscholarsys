import React, { useState, useEffect, useRef } from 'react';
import { Link, router } from '@inertiajs/react';
import { ChevronDown, ChevronRight, BookOpen, ArrowUp, Search, CheckCircle, FolderOpen, Users, Briefcase, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ResourceLayout from '../../Layouts/ResourceLayout';

// Import all sub-guide components statically
import FindingCollaborators from './SubGuides/FindingCollaborators';
import DecodingMatchInsights from './SubGuides/DecodingMatchInsights';
import AgileForAcademics from './SubGuides/AgileForAcademics';
import ChoosingYourView from './SubGuides/ChoosingYourView';
import CraftingAcademicCV from './SubGuides/CraftingAcademicCV';
import ProfileHealthChecklist from './SubGuides/ProfileHealthChecklist';
import WritingResearchStatement from './SubGuides/WritingResearchStatement';
import FindingSupervisorGuide from './SubGuides/FindingSupervisorGuide';
import PaperWritingTemplate from './SubGuides/PaperWritingTemplate';

const Show = ({ resources, currentCategory, currentSlug }) => {
    const [expandedCategories, setExpandedCategories] = useState({
        [currentCategory]: true
    });
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [visitedGuides, setVisitedGuides] = useState(new Set());
    const hasMountedRef = useRef(false);

    // Category icons mapping
    const categoryIcons = {
        'ai-matching': Users,
        'project-hub': FolderOpen,
        'profile-optimization': Briefcase
    };

    // Track visited guides
    useEffect(() => {
        if (currentCategory && currentSlug) {
            const guideKey = `${currentCategory}-${currentSlug}`;
            setVisitedGuides(prev => new Set([...prev, guideKey]));
        }
    }, [currentCategory, currentSlug]);

    // Filter guides based on search query
    const getFilteredGuides = (guides) => {
        if (!searchQuery.trim()) return guides;
        return guides.filter(guide =>
            guide.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    const toggleCategory = (category) => {
        setExpandedCategories(prev => {
            // Accordion logic: only one category expanded at a time
            const newState = {};
            newState[category] = !prev[category];
            return newState;
        });
    };

    // Scroll to top function
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Handle scroll event to show/hide back to top button
    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Auto scroll to top when category or slug changes
    useEffect(() => {
        // Skip the first render to avoid scrolling on initial load
        if (!hasMountedRef.current) {
            hasMountedRef.current = true;
            return;
        }

        const scrollToTop = () => {
            // Force immediate scroll to top
            window.scrollTo(0, 0);

            // Multiple fallback attempts with different timings
            setTimeout(() => window.scrollTo(0, 0), 50);
            setTimeout(() => window.scrollTo(0, 0), 100);
            setTimeout(() => window.scrollTo(0, 0), 200);
            setTimeout(() => window.scrollTo(0, 0), 300);

            // Also try smooth scroll after initial force scroll
            setTimeout(() => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }, 150);
        };

        // Execute scroll immediately
        scrollToTop();

        // Additional aggressive fallback
        const timeoutId = setTimeout(() => {
            window.scrollTo(0, 0);
            // Force scroll multiple times
            setTimeout(() => window.scrollTo(0, 0), 50);
            setTimeout(() => window.scrollTo(0, 0), 100);
        }, 250);

        return () => clearTimeout(timeoutId);
    }, [currentCategory, currentSlug]);

    // Additional listener for any DOM changes
    useEffect(() => {
        const scrollToTopOnLoad = () => {
            window.scrollTo(0, 0);
        };

        // Listen for when the page content might have loaded
        const handleLoad = () => {
            setTimeout(scrollToTopOnLoad, 50);
        };

        window.addEventListener('load', handleLoad);
        window.addEventListener('DOMContentLoaded', handleLoad);

        return () => {
            window.removeEventListener('load', handleLoad);
            window.removeEventListener('DOMContentLoaded', handleLoad);
        };
    }, []);

    const renderSubGuide = () => {
        if (!currentCategory || !currentSlug) {
            return (
                <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-gray-600 mb-2">Welcome to Resources</h2>
                    <p className="text-gray-500">Select a category from the sidebar to get started.</p>
                </div>
            );
        }

        // Map slug to component using static imports
        const componentMap = {
            'finding-collaborators': FindingCollaborators,
            'decoding-match-insights': DecodingMatchInsights,
            'agile-for-academics': AgileForAcademics,
            'choosing-your-view': ChoosingYourView,
            'crafting-academic-cv': CraftingAcademicCV,
            'profile-health-checklist': ProfileHealthChecklist,
            'writing-research-statement': WritingResearchStatement,
            // 'finding-supervisor-guide': FindingSupervisorGuide,
            'paper-writing-template': PaperWritingTemplate,
        };

        const Component = componentMap[currentSlug];
        if (!Component) {
            return (
                <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-gray-600 mb-2">Guide not found</h2>
                    <p className="text-gray-500">The requested guide could not be found.</p>
                </div>
            );
        }

        return <Component />;
    };

    return (
        <ResourceLayout>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar - Categories */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm border sticky top-20 max-h-[calc(100vh-6rem)] overflow-hidden">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center gap-2 mb-4">
                                <BookOpen className="w-5 h-5 text-blue-600" />
                                <h2 className="text-lg font-bold text-gray-900">Resources</h2>
                            </div>

                            {/* Search Bar */}
                            <div className="relative">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search guides..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                />
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="p-4 max-h-[calc(100vh-12rem)] overflow-y-auto">
                            <div className="space-y-3">
                                {Object.entries(resources).map(([categoryKey, categoryData]) => {
                                    const IconComponent = categoryIcons[categoryKey] || FileText;
                                    const filteredGuides = getFilteredGuides(categoryData.guides);
                                    const hasFilteredResults = filteredGuides.length > 0;

                                    return (
                                        <div key={categoryKey} className={searchQuery && !hasFilteredResults ? 'hidden' : ''}>
                                            {/* Category Header */}
                                            <button
                                                onClick={() => toggleCategory(categoryKey)}
                                                className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all duration-200 group ${
                                                    currentCategory === categoryKey
                                                        ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                                                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <IconComponent className={`w-5 h-5 transition-colors ${
                                                        currentCategory === categoryKey ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
                                                    }`} />
                                                    <span className="font-semibold text-sm leading-tight">{categoryData.title}</span>
                                                </div>
                                                <motion.div
                                                    animate={{ rotate: expandedCategories[categoryKey] ? 180 : 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <ChevronDown className={`w-4 h-4 transition-colors ${
                                                        currentCategory === categoryKey ? 'text-blue-600' : 'text-gray-400'
                                                    }`} />
                                                </motion.div>
                                            </button>

                                            {/* Sub-guides */}
                                            <AnimatePresence>
                                                {expandedCategories[categoryKey] && hasFilteredResults && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{
                                                            duration: 0.3,
                                                            ease: [0.4, 0.0, 0.2, 1],
                                                            opacity: { duration: 0.2 }
                                                        }}
                                                        className="ml-6 mt-3 space-y-1 overflow-hidden"
                                                    >
                                                        {filteredGuides.map((guide) => {
                                                            const isActive = currentCategory === categoryKey && currentSlug === guide.slug;
                                                            const isVisited = visitedGuides.has(`${categoryKey}-${guide.slug}`);
                                                            const isLongTitle = guide.title.length > 40;

                                                            return (
                                                                <motion.div
                                                                    key={guide.slug}
                                                                    initial={{ x: -10, opacity: 0 }}
                                                                    animate={{ x: 0, opacity: 1 }}
                                                                    transition={{ delay: 0.05 }}
                                                                >
                                                                    <Link
                                                                        href={`/resources/${categoryKey}/${guide.slug}`}
                                                                        className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-md text-xs transition-all duration-200 ${
                                                                            isActive
                                                                                ? 'bg-blue-100 text-blue-800 font-semibold border-l-4 border-blue-500 shadow-sm'
                                                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:border-l-4 hover:border-gray-300 hover:shadow-sm'
                                                                        }`}
                                                                        title={isLongTitle ? guide.title : undefined}
                                                                    >
                                                                        {isVisited && !isActive && (
                                                                            <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                                                                        )}
                                                                        <span className="leading-tight flex-1 truncate">
                                                                            {guide.title}
                                                                        </span>
                                                                        {isActive && (
                                                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                                                        )}
                                                                    </Link>
                                                                </motion.div>
                                                            );
                                                        })}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>
                        </nav>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-lg shadow-sm border min-h-[600px]">
                        <div className="p-4 sm:p-6 lg:p-8">
                            {renderSubGuide()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Back to Top Button */}
            {showBackToTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50"
                    aria-label="Back to top"
                >
                    <ArrowUp className="w-5 h-5" />
                </button>
            )}
        </ResourceLayout>
    );
};

export default Show;
