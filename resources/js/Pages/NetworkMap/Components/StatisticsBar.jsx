import { motion } from 'framer-motion';

export default function StatisticsBar({ statistics }) {
    const stats = [
        {
            label: 'Universities Tracked',
            value: statistics.totalUniversities,
            icon: '🎓',
            color: 'blue'
        },
        {
            label: 'Researchers in View',
            value: statistics.totalResearchers,
            icon: '👥',
            color: 'green'
        },
        {
            label: 'Projects in View',
            value: statistics.totalProjects,
            icon: '📋',
            color: 'purple'
        },
        {
            label: 'Top Research Area',
            value: statistics.topResearchArea,
            icon: '🔬',
            color: 'indigo'
        },
        {
            label: 'Most Active State',
            value: statistics.mostActiveState,
            icon: '📍',
            color: 'orange'
        }
    ];

    const getColorClasses = (color) => {
        const colors = {
            blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
            green: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
            purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
            indigo: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
            orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800'
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
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    className={`${getColorClasses(stat.color)} rounded-xl p-4 border shadow-sm`}
                >
                    <div className="flex items-center gap-3">
                        <div className="text-2xl">
                            {stat.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium opacity-80 mb-1">
                                {stat.label}
                            </p>
                            <p className="text-lg font-bold truncate">
                                {stat.value}
                            </p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}
