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
import { ChevronUp, ChevronDown, Search } from 'lucide-react';

export default function TableView({ board, onTaskClick }) {
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    
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
    
    // Define table columns
    const columns = useMemo(() => [
        columnHelper.accessor('title', {
            header: 'Task',
            cell: info => (
                <div 
                    className="font-medium text-indigo-600 hover:text-indigo-800 cursor-pointer"
                    onClick={() => onTaskClick(info.row.original)}
                >
                    {info.getValue()}
                </div>
            ),
            sortingFn: 'alphanumeric'
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
    ], [columnHelper, onTaskClick]);
    
    // Create table instance
    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            globalFilter
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getCoreRowModel: getCoreRowModel()
    });
    
    return (
        <div className="bg-white rounded-lg shadow p-4">
            {/* Search input */}
            <div className="mb-4 relative">
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
            
            {/* Table */}
            <div className="overflow-x-auto">
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
                        {table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map(row => (
                                <tr 
                                    key={row.id}
                                    className="hover:bg-gray-50"
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
                                    No tasks found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Table footer with stats */}
            <div className="mt-3 text-sm text-gray-500">
                Showing {table.getRowModel().rows.length} of {data.length} tasks
            </div>
        </div>
    );
} 