import { motion } from 'framer-motion';
import { X, MapPin, Users, FolderOpen, BookOpen, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function UniversityPopup({ university, onClose }) {
    return (
        <>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/50 z-[9999]"
            />

            {/* Modal */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-[10000] max-h-[90vh] overflow-y-auto"
            >
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="text-4xl">🎓</div>
                        <div>
                            <h2 className="text-2xl font-bold">{university.shortName}</h2>
                            <p className="text-blue-100 text-sm">{university.name}</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Location */}
                    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                        <MapPin className="w-5 h-5 text-blue-500" />
                        <span className="font-medium">{university.state}, Malaysia</span>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
                            <div className="flex items-center gap-3">
                                <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                                <div>
                                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                                        {university.researchersCount}
                                    </p>
                                    <p className="text-xs text-green-600 dark:text-green-400">Researchers</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
                            <div className="flex items-center gap-3">
                                <FolderOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                <div>
                                    <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                                        {university.activeProjects}
                                    </p>
                                    <p className="text-xs text-purple-600 dark:text-purple-400">Active Projects</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center gap-3">
                                <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                <div>
                                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                                        {university.publications.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-blue-600 dark:text-blue-400">Publications</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-xl border border-orange-200 dark:border-orange-800">
                            <div className="flex items-center gap-3">
                                <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                <div>
                                    <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                                        {university.industryCitations.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-orange-600 dark:text-orange-400">Industry Citations</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Top Research Area */}
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-4 rounded-xl border border-indigo-200 dark:border-indigo-800">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Top Research Area
                        </p>
                        <p className="text-lg font-bold text-indigo-700 dark:text-indigo-300">
                            {university.topResearchArea}
                        </p>
                    </div>

                    {/* Departments */}
                    <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                            Departments
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {university.departments.map((dept) => (
                                <span
                                    key={dept}
                                    className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium"
                                >
                                    {dept}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Action Button */}
                    <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => alert('View Details functionality coming soon!')}
                    >
                        View Full Details
                    </Button>
                </div>
            </motion.div>
        </>
    );
}
