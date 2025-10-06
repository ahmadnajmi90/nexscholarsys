import { motion } from 'framer-motion';
import { X, MapPin, Calendar, DollarSign, Users, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { universities } from '@/Data/networkMapData';

export default function ProjectPopup({ project, onClose }) {
    const university = universities.find(u => u.id === project.universityId);
    
    const getStatusColor = (status) => {
        const colors = {
            'Active': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
            'Planning': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
            'Completed': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
        };
        return colors[status] || colors['Active'];
    };

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
                <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-t-2xl">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="text-4xl">📋</div>
                        <div>
                            <h2 className="text-2xl font-bold">{project.name}</h2>
                            <p className="text-purple-100 text-sm">{project.type} Project</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Status & Location */}
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-gray-500" />
                            <span className="text-gray-700 dark:text-gray-300 font-medium">
                                {project.location}, Malaysia
                            </span>
                        </div>
                        <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(project.status)}`}>
                            {project.status}
                        </span>
                    </div>

                    {/* Description */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {project.description}
                        </p>
                    </div>

                    {/* Project Details Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                            <div className="flex items-start gap-3">
                                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1" />
                                <div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Timeline</p>
                                    <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                                        {new Date(project.startDate).toLocaleDateString('en-MY', { month: 'short', year: 'numeric' })}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">to</p>
                                    <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                                        {new Date(project.endDate).toLocaleDateString('en-MY', { month: 'short', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
                            <div className="flex items-start gap-3">
                                <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400 mt-1" />
                                <div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Budget</p>
                                    <p className="text-lg font-bold text-green-700 dark:text-green-300">
                                        {project.budget}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lead Researcher */}
                    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <Users className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Lead Researcher</p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {project.leadResearcher}
                            </p>
                        </div>
                    </div>

                    {/* University Partner */}
                    {university && (
                        <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                            <Building className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <div>
                                <p className="text-xs text-gray-600 dark:text-gray-400">University Partner</p>
                                <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                                    {university.shortName} - {university.name}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Collaboration Type */}
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Collaboration Type</span>
                        <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                            {project.collaborationType}
                        </span>
                    </div>

                    {/* Action Button */}
                    <Button
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                        onClick={() => alert('View Project functionality coming soon!')}
                    >
                        View Full Project Details
                    </Button>
                </div>
            </motion.div>
        </>
    );
}
