import { motion } from 'framer-motion';
import { Building2, Users, MapPin, TrendingUp, MapPinned } from 'lucide-react';

export default function StatisticsBar({ statistics }) {
    const stats = [
        {
            label: 'Universities Tracked',
            value: statistics.totalUniversities,
            icon: Building2,
            color: 'blue'
        },
        {
            label: 'Researchers in View',
            value: statistics.totalResearchers,
            icon: Users,
            color: 'green'
        },
        {
            label: 'Projects in View',
            value: statistics.totalProjects,
            icon: MapPin,
            color: 'purple'
        },
        {
            label: 'Top Research Area',
            value: statistics.topResearchArea,
            icon: TrendingUp,
            color: 'indigo'
        },
        {
            label: 'Most Active State',
            value: statistics.mostActiveState,
            icon: MapPinned,
            color: 'orange'
        }
    ];

    const getColorClasses = (color) => {
        const colors = {
            blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
            green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
            purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
            indigo: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800',
            orange: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
        };
        return colors[color] || colors.blue;
    };

    const getIconColor = (color) => {
        const colors = {
            blue: 'text-blue-600 dark:text-blue-400',
            green: 'text-green-600 dark:text-green-400',
            purple: 'text-purple-600 dark:text-purple-400',
            indigo: 'text-indigo-600 dark:text-indigo-400',
            orange: 'text-orange-600 dark:text-orange-400'
        };
        return colors[color] || colors.blue;
    };

    const getTextColor = (color) => {
        const colors = {
            blue: 'text-blue-700 dark:text-blue-300',
            green: 'text-green-700 dark:text-green-300',
            purple: 'text-purple-700 dark:text-purple-300',
            indigo: 'text-indigo-700 dark:text-indigo-300',
            orange: 'text-orange-700 dark:text-orange-300'
        };
        return colors[color] || colors.blue;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
        >
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 + index * 0.05 }}
                        className={`${getColorClasses(stat.color)} rounded-xl p-4 border shadow-sm`}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <Icon className={`w-4 h-4 ${getIconColor(stat.color)}`} />
                            <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                                {stat.label}
                            </span>
                        </div>
                        <div className={`text-2xl font-semibold ${getTextColor(stat.color)}`}>
                            {stat.value}
                        </div>
                    </motion.div>
                );
            })}
        </motion.div>
    );
}
