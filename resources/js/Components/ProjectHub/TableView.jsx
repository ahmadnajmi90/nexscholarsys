import React, { useState, useMemo } from 'react';
import { 
    useReactTable, 
    getCoreRowModel, 
    getSortedRowModel, 
    getFilteredRowModel, 
    flexRender, 
    createColumnHelper 
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { ChevronUp, ChevronDown, Search, BookOpen } from 'lucide-react';
import { router } from '@inertiajs/react';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import axios from 'axios';
import Pagination from '@/Components/Pagination';
import { isTaskCompleted } from '@/Utils/utils';

export default function TableView({ board, onTaskClick }) {
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(15);
    const [showCompleted, setShowCompleted] = useState(false);
    const [completingTasks, setCompletingTasks] = useState(new Set());
    
    // Flatten all tasks from all lists
    const data = useMemo(() => {
        return board.lists.flatMap(list => 
            list.tasks.map(task => ({
                ...task,
                list_name: list.name,
                list_id: list.id
            }))
        );
    }, [board]);
    
    const columnHelper = createColumnHelper();

    // Handle task completion toggle
    const handleToggleCompletion = async (task, e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Prevent multiple simultaneous requests for the same task
        if (completingTasks.has(task.id)) {
            return;
        }

        setCompletingTasks(prev => new Set(prev).add(task.id));

        try {
            await axios.post(route('api.tasks.toggleCompletion', task.id));
            
            toast.success('Task status updated!');

            // THE CRITICAL FIX:
            // This tells Inertia to refetch only the 'initialBoardData' prop 
            // from the server. It's a highly efficient partial reload, 
            // not a full page refresh.
            router.reload({ only: ['initialBoardData'] });
        } catch (error) {
            console.error('Error toggling task completion:', error);
            toast.error('Failed to update task status.');
        } finally {
            setCompletingTasks(prev => {
                const newSet = new Set(prev);
                newSet.delete(task.id);
                return newSet;
            });
        }
    };
    
    // Define table columns
    const columns = useMemo(() => [
        columnHelper.accessor('completed_at', {
            header: '',
            cell: info => (
                <input
                    type="checkbox"
                    checked={isTaskCompleted(info.row.original)}
                    disabled={completingTasks.has(info.row.original.id)}
                    onChange={(e) => handleToggleCompletion(info.row.original, e)}
                    className={clsx(
                        "w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2",
                        {
                            "opacity-50 cursor-not-allowed": completingTasks.has(info.row.original.id)
                        }
                    )}
                />
            ),
            enableSorting: false,
            size: 50
        }),
        columnHelper.accessor('title', {
            header: 'Task',
            cell: info => (
                <div 
                    className={clsx(
                        "font-medium cursor-pointer flex items-center gap-2",
                        {
                            "text-gray-500 line-through": isTaskCompleted(info.row.original),
                            "text-indigo-600 hover:text-indigo-800": !isTaskCompleted(info.row.original)
                        }
                    )}
                    onClick={() => onTaskClick(info.row.original)}
                >
                    {info.row.original.paper_writing_task && (
                        <BookOpen className="w-4 h-4 text-blue-600" />
                    )}
                    {info.getValue()}
                </div>
            ),
            sortingFn: 'alphanumeric'
        }),
        columnHelper.accessor('paper_writing_task', {
            header: 'Type',
            cell: info => (
                <span className="text-sm">
                    {info.getValue() ? 'Paper' : 'Normal'}
                </span>
            ),
            sortingFn: (rowA, rowB) => {
                const typeA = rowA.original.paper_writing_task ? 'Paper' : 'Normal';
                const typeB = rowB.original.paper_writing_task ? 'Paper' : 'Normal';
                return typeA.localeCompare(typeB);
            }
        }),
        columnHelper.accessor('list_name', {
            header: 'List',
            cell: info => info.getValue(),
            sortingFn: 'alphanumeric'
        }),
        columnHelper.accessor('description', {
            header: 'Description',
            cell: info => info.getValue() 
                ? <span className="line-clamp-2 text-sm">{info.getValue()}</span> 
                : <span className="text-gray-400 italic text-sm">No description</span>,
            enableSorting: false
        }),
        columnHelper.accessor('priority', {
            header: 'Priority',
            cell: info => {
                const priority = info.getValue();
                if (!priority) return <span className="text-gray-400 italic text-sm">None</span>;
                
                const colorClass = {
                    Urgent: 'bg-red-100 text-red-800',
                    High: 'bg-orange-100 text-orange-800',
                    Medium: 'bg-yellow-100 text-yellow-800',
                    Low: 'bg-blue-100 text-blue-800'
                }[priority] || 'bg-gray-100 text-gray-800';
                
                return (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClass}`}>
                        {priority}
                    </span>
                );
            },
            sortingFn: (rowA, rowB) => {
                const priorities = { Urgent: 4, High: 3, Medium: 2, Low: 1, null: 0, undefined: 0 };
                const priorityA = priorities[rowA.original.priority] || 0;
                const priorityB = priorities[rowB.original.priority] || 0;
                return priorityB - priorityA; // Sort higher priorities first
            }
        }),
        columnHelper.accessor('due_date', {
            header: 'Due Date',
            cell: info => {
                const date = info.getValue();
                if (!date) return <span className="text-gray-400 italic text-sm">None</span>;
                return <span className="text-sm">{format(new Date(date), "MMM d, yyyy 'at' h:mm a")}</span>;
            },
            sortingFn: 'datetime'
        }),
        columnHelper.accessor('assignees', {
            header: 'Assignees',
            cell: info => {
                const assignees = info.getValue() || [];
                if (assignees.length === 0) {
                    return <span className="text-gray-400 italic text-sm">Unassigned</span>;
                }
                
                return (
                    <div className="flex -space-x-1 overflow-hidden">
                        {assignees.slice(0, 3).map(assignee => (
                            <div 
                                key={assignee.id} 
                                className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs overflow-hidden border border-white"
                                title={assignee.name}
                            >
                                {assignee.avatar ? (
                                    <img 
                                        src={assignee.avatar} 
                                        alt={assignee.name} 
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    assignee.name.charAt(0)
                                )}
                            </div>
                        ))}
                        {assignees.length > 3 && (
                            <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs border border-white">
                                +{assignees.length - 3}
                            </div>
                        )}
                    </div>
                );
            },
            enableSorting: false
        })
    ], [columnHelper, onTaskClick, handleToggleCompletion, completingTasks]);
    
    // Create table instance
    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            globalFilter
        },
        onSortingChange: (sorting) => {
            setSorting(sorting);
            setCurrentPage(1); // Reset to first page when sorting
        },
        onGlobalFilterChange: (value) => {
            setGlobalFilter(value);
            setCurrentPage(1); // Reset to first page when filtering
        },
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getCoreRowModel: getCoreRowModel()
    });

    // Apply completion filter first, then pagination
    const filteredRows = table.getFilteredRowModel().rows;
    
    // Filter tasks based on showCompleted state
    const filteredTasks = filteredRows.filter(row => {
        return showCompleted ? true : !isTaskCompleted(row.original);
    });
    
    const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
    
    // Get current page rows from filtered tasks
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPageRows = filteredTasks.slice(startIndex, endIndex);
    
    return (
        <div className="bg-white rounded-lg shadow p-4">
            {/* Controls Row */}
            <div className="mb-4 flex flex-col sm:flex-row gap-4 justify-between">
                {/* Search input */}
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={globalFilter || ''}
                        onChange={e => setGlobalFilter(e.target.value)}
                        placeholder="Search tasks..."
                        className="pl-10 pr-3 py-2 w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-sm"
                    />
                </div>

                {/* Show Completed Tasks Toggle */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="show-completed-table"
                        checked={showCompleted}
                        onChange={(e) => {
                            setShowCompleted(e.target.checked);
                            setCurrentPage(1); // Reset to first page when toggling
                        }}
                        className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                    />
                    <label htmlFor="show-completed-table" className="ml-2 text-sm font-medium text-gray-700 whitespace-nowrap">
                        Show Completed Tasks
                    </label>
                </div>
            </div>
            
            {/* Table */}
            <div className="table-view-container overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th 
                                        key={header.id}
                                        scope="col" 
                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        {header.isPlaceholder ? null : (
                                            <div
                                                className={`flex items-center ${header.column.getCanSort() ? 'cursor-pointer select-none' : ''}`}
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                                
                                                {{
                                                    asc: <ChevronUp className="ml-1 h-4 w-4" />,
                                                    desc: <ChevronDown className="ml-1 h-4 w-4" />
                                                }[header.column.getIsSorted()] ?? null}
                                            </div>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentPageRows.length > 0 ? (
                            currentPageRows.map(row => (
                                <tr 
                                    key={row.id}
                                    className={clsx(
                                        "hover:bg-gray-50",
                                        {
                                            "opacity-60": isTaskCompleted(row.original)
                                        }
                                    )}
                                >
                                    {row.getVisibleCells().map(cell => (
                                        <td 
                                            key={cell.id}
                                            className="px-4 py-3 whitespace-nowrap"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td 
                                    colSpan={columns.length}
                                    className="px-4 py-3 text-center text-sm text-gray-500"
                                >
                                    {showCompleted || data.length === 0 ? 'No tasks found' : 'No active tasks found'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Table footer with stats */}
            <div className="mt-3 text-sm text-gray-500">
                Showing {Math.min(startIndex + 1, filteredTasks.length)}-{Math.min(endIndex, filteredTasks.length)} of {filteredTasks.length} tasks
                {globalFilter && ` (filtered from ${data.length} total)`}
                {!showCompleted && ` • Completed tasks hidden`}
            </div>

            {/* Pagination Controls */}
            <div className="mt-4">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </div>
        </div>
    );
} 