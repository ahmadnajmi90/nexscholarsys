import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Calendar, DollarSign, Users, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ProjectDetailPanel({ project, onClose }) {
    if (!project) return null;

    const getStatusColor = (status) => {
        const colors = {
            'Active': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
            'Planning': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
            'Completed': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
        };
        return colors[status] || colors['Active'];
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 h-full w-[500px] bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-2xl z-[11000]"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                    <div className="flex items-center gap-3">
                        <div className="text-4xl">📋</div>
                        <div>
                            <h2 className="text-xl font-bold">{project.name}</h2>
                            <p className="text-purple-100 text-sm">{project.type} Project</p>
                        </div>
                    </div>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={onClose}
                        className="text-white hover:bg-white/20"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <ScrollArea className="h-[calc(100vh-73px)]">
                    <div className="p-6 space-y-6">
                        {/* Status & Location */}
                        <div className="flex items-center justify-between flex-wrap gap-3">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-gray-500" />
                                <span className="text-gray-700 dark:text-gray-300 font-medium">
                                    {project.location}, Malaysia
                                </span>
                            </div>
                            <Badge className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(project.status)}`}>
                                {project.status}
                            </Badge>
                        </div>

                        {/* Description */}
                        {project.description && (
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {project.description}
                                </p>
                            </div>
                        )}

                        {/* Project Details Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                                <div className="flex items-start gap-3">
                                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1" />
                                    <div>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Timeline</p>
                                        <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                                            {project.startDate ? new Date(project.startDate).toLocaleDateString('en-MY', { month: 'short', year: 'numeric' }) : 'N/A'}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">to</p>
                                        <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                                            {project.endDate ? new Date(project.endDate).toLocaleDateString('en-MY', { month: 'short', year: 'numeric' }) : 'N/A'}
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
                                            {project.budget || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Lead Researcher */}
                        {project.leadResearcher && (
                            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                                <Users className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">Lead Researcher</p>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {project.leadResearcher}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* University Partner */}
                        {project.universityId && (
                            <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                                <Building className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                <div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">University Partner</p>
                                    <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                                        Partner University
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Collaboration Type */}
                        {project.collaborationType && (
                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Collaboration Type</span>
                                <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                                    {project.collaborationType}
                                </span>
                            </div>
                        )}

                        {/* Action Button */}
                        <Button
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                            onClick={() => alert('View Full Project Details functionality coming soon!')}
                        >
                            View Full Project Details
                        </Button>
                    </div>
                </ScrollArea>
            </motion.div>
        </AnimatePresence>
    );
}

