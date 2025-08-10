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
import { ChevronUp, ChevronDown, Search, BookOpen, ClipboardList } from 'lucide-react';
import { router } from '@inertiajs/react';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import axios from 'axios';
import Pagination from '@/Components/Pagination';
import { isTaskCompleted } from '@/Utils/utils';
import Tooltip from '@/Components/Tooltip';
import { Calendar } from 'lucide-react';

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
            await axios.post(route('project-hub.tasks.toggle-completion', task.id));
            
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
        // Column 1: COMPLETION CHECKBOX (Largely Unchanged)
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
                        { "opacity-50 cursor-not-allowed": completingTasks.has(info.row.original.id) }
                    )}
                />
            ),
            enableSorting: false,
            size: 40,
        }),
    
        // Column 2: TASK (New Consolidated Column)
        // This combines Title, List Name, and Type Icon
        columnHelper.accessor('title', {
            header: 'Task',
            cell: info => {
                const task = info.row.original;
                return (
                    <div 
                        className={clsx("font-medium cursor-pointer group touch-manipulation", { "text-gray-500 line-through": isTaskCompleted(task) })}
                        onClick={() => onTaskClick(task)}
                    >
                        <div className="flex items-center gap-2">
                            {/* --- CHANGE 1 START: Add default icon for Normal Tasks --- */}
                            {task.paper_writing_task ? (
                                <Tooltip content="Paper Writing Task">
                                    <BookOpen className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                </Tooltip>
                            ) : (
                                <Tooltip content="Normal Task">
                                    <ClipboardList className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                </Tooltip>
                            )}
                            {/* --- CHANGE 1 END --- */}
                            <span className={clsx("line-clamp-2", { "group-hover:text-indigo-800 text-indigo-600": !isTaskCompleted(task) })}>
                                {info.getValue()}
                            </span>
                        </div>
                        <div className={clsx("text-xs pl-6", { "text-gray-400": isTaskCompleted(task), "text-gray-500": !isTaskCompleted(task) })}>
                            In list: <span className="font-semibold">{task.list_name}</span>
                        </div>
                    </div>
                );
            },
            size: 200, // <-- CHANGE 3: Reduced width from 250
        }),
    
        // Column 3: ASSIGNEES (Unchanged)
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
                                title={assignee.full_name}
                            >
                                {assignee.avatar_url ? (
                                    <img 
                                        // src={assignee.avatar} 
                                        src={assignee.avatar_url !== null ? `/storage/${assignee.avatar_url}` : "/storage/profile_pictures/default.jpg"}
                                        alt={assignee.full_name} 
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    assignee.full_name.charAt(0)
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
            size: 120,
        }),
    
        // Column 4: DETAILS (New Consolidated Column)
        // This combines Priority and Due Date
        columnHelper.accessor('priority', {
            header: 'Details',
            cell: info => {
                const { priority, due_date } = info.row.original;
                const priorityColorClass = {
                    Urgent: 'bg-red-100 text-red-800',
                    High: 'bg-orange-100 text-orange-800',
                    Medium: 'bg-yellow-100 text-yellow-800',
                    Low: 'bg-blue-100 text-blue-800'
                }[priority] || 'bg-gray-100 text-gray-800';
    
                return (
                    <div className="flex flex-col gap-2">
                        {priority && (
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full whitespace-nowrap text-center w-fit ${priorityColorClass}`}>
                                {priority}
                            </span>
                        )}
                        {/* --- CHANGE 2 START: Add icon and flex container to Due Date --- */}
                        {due_date && (
                            <div className="flex items-center text-xs text-gray-600 whitespace-nowrap">
                                <Calendar className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                                <span>{format(new Date(due_date), "MMM d, yyyy")}</span>
                            </div>
                        )}
                        {/* --- CHANGE 2 END --- */}
                    </div>
                );
            },
            size: 120,
        }),
        
        // Column 5: DESCRIPTION (Unchanged logic, now fits better)
        columnHelper.accessor('description', {
            header: 'Description',
            cell: info => info.getValue() 
                ? <span className="line-clamp-3 text-sm break-words">{info.getValue()}</span> 
                : <span className="text-gray-400 italic text-sm">No description</span>,
            enableSorting: false,
            size: 250,
        }),
    
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
        <div className="table-view-container bg-white rounded-lg shadow flex flex-col h-full">
            {/* Mobile-responsive controls */}
            <div className="px-3 md:px-4 py-3 border-b bg-gray-50 space-y-3 md:space-y-0 md:flex md:items-center md:justify-between flex-shrink-0">
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

            {/* Mobile-responsive table container with horizontal scroll inside a vertically scrollable wrapper */}
            <div className="flex-1 overflow-y-auto min-h-0">
                <div className="overflow-x-auto">
                    <table className="w-full divide-y divide-gray-200 table-fixed" style={{ minWidth: '800px' }}>
                        {/* Table Header */}
                        <thead className="bg-gray-50 sticky top-0 z-10">
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
                                                className="px-3 md:px-6 py-3 md:py-4 whitespace-normal text-sm text-gray-900"
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
            </div>

            {/* Pagination */}
            {filteredTasks.length > itemsPerPage && (
                <div className="px-4 py-3 border-t flex-shrink-0">
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