import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown, ArrowUpDown, TrendingUp, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function RankingsTable({ data }) {
    const [sortField, setSortField] = useState('researchersCount');
    const [sortDirection, setSortDirection] = useState('desc');
    const [rankingMode, setRankingMode] = useState('overall');

    const handleSort = (field) => {
        if (field !== 'name' && field !== 'shortName') {
            setRankingMode(field);
        }
        
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
    };

    const getRankedData = () => {
        // Create a copy with ranks
        let dataWithRanks = [...data];
        
        if (rankingMode === 'overall') {
            // Use original rank or assign based on publications
            dataWithRanks = dataWithRanks.map((uni, index) => ({ 
                ...uni, 
                currentRank: uni.rank || index + 1 
            }));
        } else {
            // Sort by the selected metric and assign new ranks
            const sorted = [...data].sort((a, b) => b[rankingMode] - a[rankingMode]);
            dataWithRanks = sorted.map((uni, index) => ({ ...uni, currentRank: index + 1 }));
        }
        
        // Then apply user sorting
        return dataWithRanks.sort((a, b) => {
            const aValue = a[sortField];
            const bValue = b[sortField];
            
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortDirection === 'asc' 
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }
            
            return sortDirection === 'asc' 
                ? (aValue || 0) - (bValue || 0)
                : (bValue || 0) - (aValue || 0);
        });
    };

    const sortedData = getRankedData();

    const SortIcon = ({ field }) => {
        if (sortField !== field) return <ArrowUpDown className="w-4 h-4 ml-1" />;
        return sortDirection === 'asc' 
            ? <ChevronUp className="w-4 h-4 ml-1" />
            : <ChevronDown className="w-4 h-4 ml-1" />;
    };

    const getRankBadge = (rank) => {
        if (rank === 1) {
            return (
                <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white border-0">
                    <Award className="w-3 h-3 mr-1" />1st
                </Badge>
            );
        }
        if (rank === 2) {
            return (
                <Badge className="bg-gray-400 hover:bg-gray-500 text-white border-0">
                    <Award className="w-3 h-3 mr-1" />2nd
                </Badge>
            );
        }
        if (rank === 3) {
            return (
                <Badge className="bg-amber-600 hover:bg-amber-700 text-white border-0">
                    <Award className="w-3 h-3 mr-1" />3rd
                </Badge>
            );
        }
        return <Badge variant="outline">{rank}</Badge>;
    };

    const columns = [
        { key: 'rank', label: 'Rank', sortable: false },
        { key: 'shortName', label: 'University', sortable: true },
        { key: 'state', label: 'State', sortable: true },
        { key: 'researchersCount', label: 'Researchers', sortable: true },
        { key: 'activeProjects', label: 'Projects', sortable: true },
        { key: 'publications', label: 'Publications', sortable: true },
        { key: 'industryCitations', label: 'Citations', sortable: true }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
        >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                University Rankings
                            </h2>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {rankingMode === 'overall' 
                                ? 'Ranked by overall research performance metrics'
                                : `Ranked by ${rankingMode === 'activeProjects' ? 'active projects' : rankingMode === 'industryCitations' ? 'industry citations' : rankingMode.replace('Count', '')}`
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Rank
                            </th>
                            {columns.slice(1).map((column) => (
                                <th
                                    key={column.key}
                                    onClick={() => column.sortable && handleSort(column.key)}
                                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${
                                        column.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 select-none' : ''
                                    } ${
                                        rankingMode === column.key ? 'text-blue-600 dark:text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]' : ''
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        {column.label}
                                        {column.sortable && <SortIcon field={column.key} />}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {sortedData.map((row, index) => (
                            <motion.tr
                                key={row.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.02 }}
                                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {getRankBadge(row.currentRank)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                        {row.shortName}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {row.name}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Badge variant="secondary" className="text-xs">
                                        {row.state}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                                    {row.researchersCount?.toLocaleString() || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                                    {row.activeProjects?.toLocaleString() || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                                        {row.publications?.toLocaleString() || 'N/A'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                                    {row.industryCitations?.toLocaleString() || 'N/A'}
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}
