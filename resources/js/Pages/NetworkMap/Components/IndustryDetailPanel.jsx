import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Briefcase, Target, Building2, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function IndustryDetailPanel({ partner, onClose, partnerUniversities = [] }) {
    if (!partner) return null;

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
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-orange-600 to-orange-700 text-white">
                    <div className="flex items-center gap-3">
                        <div className="text-4xl">🏢</div>
                        <div>
                            <h2 className="text-xl font-bold">{partner.name}</h2>
                            <p className="text-orange-100 text-sm">{partner.type || partner.sector}</p>
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
                        {/* Location & Sector */}
                        <div className="flex items-center justify-between flex-wrap gap-3">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-gray-500" />
                                <span className="text-gray-700 dark:text-gray-300 font-medium">
                                    {partner.location}, Malaysia
                                </span>
                            </div>
                            <Badge className="px-3 py-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium border border-orange-200 dark:border-orange-800">
                                {partner.sector}
                            </Badge>
                        </div>

                        {/* Description */}
                        {partner.description && (
                            <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 p-4 rounded-xl border border-orange-200 dark:border-orange-800">
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {partner.description}
                                </p>
                            </div>
                        )}

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800 text-center">
                                <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                                    {partner.universityPartners?.length || 0}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Universities</p>
                            </div>

                            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800 text-center">
                                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                                    {partner.activeCollaborations || 0}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Active Projects</p>
                            </div>

                            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800 text-center">
                                <Target className="w-5 h-5 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                                <p className="text-lg font-bold text-purple-700 dark:text-purple-300">
                                    {partner.fundingProvided || 'N/A'}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Funding</p>
                            </div>
                        </div>

                        {/* Specialization */}
                        {partner.specialization && (
                            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                                <Briefcase className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                <div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">Specialization</p>
                                    <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                                        {partner.specialization}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Tags */}
                        {partner.tags && partner.tags.length > 0 && (
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                                    Partnership Tags
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {partner.tags.map((tag, index) => (
                                        <Badge
                                            key={index}
                                            className="px-3 py-1.5 bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800"
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Partner Universities */}
                        {partnerUniversities.length > 0 && (
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                                    University Partners ({partnerUniversities.length})
                                </p>
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {partnerUniversities.map((uni) => (
                                        <div
                                            key={uni.id}
                                            className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
                                        >
                                            <span className="text-lg">🎓</span>
                                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                                {uni.shortName} - {uni.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action Button */}
                        <Button
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                            onClick={() => alert('View Company Profile functionality coming soon!')}
                        >
                            View Company Profile
                        </Button>
                    </div>
                </ScrollArea>
            </motion.div>
        </AnimatePresence>
    );
}

