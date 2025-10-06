import { motion, AnimatePresence } from 'framer-motion';
import { X, FolderKanban, FileText, Users, TrendingUp, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function LecturerDetailPanel({ researcher, onClose }) {
    if (!researcher) return null;

    // Mock data for demonstration
    const projects = [
        {
            title: 'AI-Driven Healthcare Diagnostics',
            status: 'active',
            funding: 'RM 650K',
            partners: ['University of Tokyo', 'Local Hospital'],
            startDate: '2024-01',
            endDate: '2025-12'
        },
        {
            title: 'Machine Learning for Climate Prediction',
            status: 'completed',
            funding: 'RM 350K',
            partners: ['National Weather Service'],
            startDate: '2023-01',
            endDate: '2024-06'
        }
    ];

    const publications = [
        {
            title: 'Deep Learning Approaches in Medical Imaging',
            journal: 'Nature Machine Intelligence',
            quartile: 'Q1',
            citations: 45
        },
        {
            title: 'Neural Networks for Weather Forecasting',
            journal: 'IEEE Transactions on AI',
            quartile: 'Q1',
            citations: 32
        }
    ];

    const statusColor = {
        active: 'bg-green-500/10 text-green-500 border-green-500/20',
        completed: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        proposal: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
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
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-600 to-green-700 text-white">
                    <div>
                        <h2 className="text-xl font-bold">{researcher.name || 'Researcher Name'}</h2>
                        <p className="text-green-100 text-sm">{researcher.university || 'University'}</p>
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
                        {/* Profile Summary */}
                        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Position:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">Associate Professor</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Department:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{researcher.department || 'Engineering'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Research Area:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">AI & Machine Learning</span>
                                </div>
                            </div>
                        </div>

                        {/* Key Metrics */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-center">
                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">2</div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">Active Projects</div>
                            </div>
                            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3 text-center">
                                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">12</div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">Publications</div>
                            </div>
                            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3 text-center">
                                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">287</div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">Citations</div>
                            </div>
                        </div>

                        {/* Projects Section */}
                        <div>
                            <h3 className="text-base font-semibold mb-3 flex items-center gap-2 text-gray-900 dark:text-white">
                                <FolderKanban className="w-4 h-4" />
                                Projects
                            </h3>
                            <div className="space-y-3">
                                {projects.map((project, index) => (
                                    <div key={index} className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                                        <div className="flex items-start justify-between mb-2">
                                            <h4 className="font-medium text-sm text-gray-900 dark:text-white">{project.title}</h4>
                                            <Badge className={statusColor[project.status]}>
                                                {project.status}
                                            </Badge>
                                        </div>
                                        <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                                            <div className="flex justify-between">
                                                <span>Funding:</span>
                                                <span className="font-medium">{project.funding}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Duration:</span>
                                                <span className="font-medium">{project.startDate} - {project.endDate}</span>
                                            </div>
                                            <div className="pt-1">
                                                <div className="flex items-center gap-1 mb-1">
                                                    <Users className="w-3 h-3" />
                                                    <span className="font-medium">Partners:</span>
                                                </div>
                                                <div className="flex flex-wrap gap-1">
                                                    {project.partners.map((partner, i) => (
                                                        <Badge key={i} variant="outline" className="text-xs">
                                                            {partner}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Publications Section */}
                        <div>
                            <h3 className="text-base font-semibold mb-3 flex items-center gap-2 text-gray-900 dark:text-white">
                                <FileText className="w-4 h-4" />
                                Recent Publications
                            </h3>
                            <div className="space-y-3">
                                {publications.map((pub, index) => (
                                    <div key={index} className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <h4 className="font-medium text-sm flex-1 text-gray-900 dark:text-white">{pub.title}</h4>
                                            <Badge className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                                                {pub.quartile}
                                            </Badge>
                                        </div>
                                        <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-gray-900 dark:text-white">{pub.journal}</span>
                                                <Button variant="ghost" size="sm" className="h-6 px-2">
                                                    <ExternalLink className="w-3 h-3" />
                                                </Button>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <TrendingUp className="w-3 h-3" />
                                                <span>{pub.citations} citations</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Button */}
                        <Button
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => alert('View Full Profile functionality coming soon!')}
                        >
                            View Full Profile
                        </Button>
                    </div>
                </ScrollArea>
            </motion.div>
        </AnimatePresence>
    );
}

