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
    
    // Flatten all tasks from all lists with proper error handling
    const data = useMemo(() => {
        if (!board || !board.lists) return [];
        
        // Ensure lists is an array
        const lists = Array.isArray(board.lists) ? board.lists : [];
        
        return lists.flatMap(list => {
            // Ensure tasks is an array
            const tasks = Array.isArray(list.tasks) ? list.tasks : [];
            return tasks.map(task => ({
                ...task,
                list_name: list.name,
                list_id: list.id
            }));
        });
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
            await axios.post(route('tasks.toggle-completion', task.id));
            
            toast.success('Task status updated!');

            // Reload only the board data
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
    
    // Define table columns with responsive sizing
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
                        "w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2 touch-manipulation",
                        {
                            "opacity-50 cursor-not-allowed": completingTasks.has(info.row.original.id)
                        }
                    )}
                />
            ),
            enableSorting: false,
            size: 40,
            minSize: 40,
            maxSize: 40
        }),
        columnHelper.accessor('title', {
            header: 'Task',
            cell: info => (
                <div 
                    className={clsx(
                        "font-medium cursor-pointer flex items-center gap-2 py-1 touch-manipulation",
                        {
                            "text-gray-500 line-through": isTaskCompleted(info.row.original),
                            "text-indigo-600 hover:text-indigo-800": !isTaskCompleted(info.row.original)
                        }
                    )}
                    onClick={() => onTaskClick(info.row.original)}
                >
                    {info.row.original.paper_writing_task && (
                        <BookOpen className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    )}
                    <span className="truncate">{info.getValue()}</span>
                </div>
            ),
            sortingFn: 'alphanumeric',
            size: 200,
            minSize: 150
        }),
        columnHelper.accessor('paper_writing_task', {
            header: 'Type',
            cell: info => (
                <span className="text-sm whitespace-nowrap">
                    {info.getValue() ? 'Paper' : 'Normal'}
                </span>
            ),
            sortingFn: (rowA, rowB) => {
                const typeA = rowA.original.paper_writing_task ? 'Paper' : 'Normal';
                const typeB = rowB.original.paper_writing_task ? 'Paper' : 'Normal';
                return typeA.localeCompare(typeB);
            },
            size: 80,
            minSize: 70
        }),
        columnHelper.accessor('list_name', {
            header: 'List',
            cell: info => <span className="text-sm truncate">{info.getValue()}</span>,
            sortingFn: 'alphanumeric',
            size: 100,
            minSize: 80
        }),
        columnHelper.accessor('description', {
            header: 'Description',
            cell: info => info.getValue() 
                ? <span className="line-clamp-2 text-sm">{info.getValue()}</span> 
                : <span className="text-gray-400 italic text-sm">No description</span>,
            enableSorting: false,
            size: 150,
            minSize: 120
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
                    <span className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${colorClass}`}>
                        {priority}
                    </span>
                );
            },
            sortingFn: (rowA, rowB) => {
                const priorities = { Urgent: 4, High: 3, Medium: 2, Low: 1, null: 0, undefined: 0 };
                const priorityA = priorities[rowA.original.priority] || 0;
                const priorityB = priorities[rowB.original.priority] || 0;
                return priorityB - priorityA; // Sort higher priorities first
            },
            size: 90,
            minSize: 80
        }),
        columnHelper.accessor('due_date', {
            header: 'Due Date',
            cell: info => {
                const date = info.getValue();
                if (!date) return <span className="text-gray-400 italic text-sm">None</span>;
                return <span className="text-sm whitespace-nowrap">{format(new Date(date), "MMM d, yyyy")}</span>;
            },
            sortingFn: 'datetime',
            size: 110,
            minSize: 100
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
                                className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs overflow-hidden border border-white flex-shrink-0"
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
                            <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center text-xs border border-white">
                                +{assignees.length - 3}
                            </div>
                        )}
                    </div>
                );
            },
            enableSorting: false,
            size: 100,
            minSize: 80
        })
    ], [completingTasks, onTaskClick]);
    
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
    
    // If no board data is available
    if (!board) {
        return (
            <div className="table-view-container bg-white rounded-lg shadow p-4">
                <div className="text-center text-gray-500">
                    No board data available
                </div>
            </div>
        );
    }
    
    return (
        <div className="table-view-container bg-white rounded-lg shadow">
            {/* Mobile-responsive controls */}
            <div className="px-3 md:px-4 py-3 border-b bg-gray-50 space-y-3 md:space-y-0 md:flex md:items-center md:justify-between">
                {/* Search Input */}
                <div className="relative flex-1 max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="Search tasks..."
                        value={globalFilter ?? ''}
                        onChange={e => setGlobalFilter(String(e.target.value))}
                    />
                </div>
                
                {/* Show Completed Toggle */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="show-completed-table"
                        checked={showCompleted}
                        onChange={(e) => setShowCompleted(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                    />
                    <label htmlFor="show-completed-table" className="ml-2 text-sm font-medium text-gray-700">
                        Show Completed
                    </label>
                </div>
            </div>

            {/* Mobile-responsive table container with horizontal scroll */}
            <div className="overflow-x-auto">
                <table className="w-full divide-y divide-gray-200" style={{ minWidth: '800px' }}>
                    {/* Table Header */}
                    <thead className="bg-gray-50">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th
                                        key={header.id}
                                        scope="col"
                                        className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 touch-manipulation"
                                        style={{ 
                                            width: header.getSize(),
                                            minWidth: header.column.columnDef.minSize || header.getSize()
                                        }}
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        <div className="flex items-center space-x-1">
                                            <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                                            {header.column.getIsSorted() && (
                                                <span className="flex-shrink-0">
                                                    {header.column.getIsSorted() === 'desc' ? (
                                                        <ChevronDown className="w-4 h-4" />
                                                    ) : (
                                                        <ChevronUp className="w-4 h-4" />
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    
                    {/* Table Body */}
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
                                            className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm text-gray-900"
                                            style={{ 
                                                width: cell.column.getSize(),
                                                minWidth: cell.column.columnDef.minSize || cell.column.getSize()
                                            }}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td 
                                    colSpan={columns.length}
                                    className="px-4 py-8 text-center text-sm text-gray-500"
                                >
                                    {globalFilter 
                                        ? 'No tasks match your search criteria'
                                        : showCompleted || data.length === 0 
                                            ? 'No tasks found' 
                                            : 'No active tasks found'
                                    }
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {filteredTasks.length > itemsPerPage && (
                <div className="px-4 py-3 border-t">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}
        </div>
    );
}