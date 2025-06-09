import React from 'react';
import { format } from 'date-fns';

export default function ListView({ board, onTaskClick }) {
    // Function to format the due date
    const formatDueDate = (dueDate) => {
        if (!dueDate) return null;
        return format(new Date(dueDate), "MMM d, yyyy 'at' h:mm a");
    };

    return (
        <div className="bg-white rounded-lg shadow">
            {board.lists.map(list => (
                <div key={list.id} className="mb-6">
                    <h3 className="px-4 py-3 text-md font-semibold text-gray-800 bg-gray-50 border-b">
                        {list.name} ({list.tasks.length})
                    </h3>
                    
                    <div className="divide-y">
                        {list.tasks.length === 0 ? (
                            <div className="px-4 py-3 text-sm text-gray-500 italic">
                                No tasks in this list
                            </div>
                        ) : (
                            list.tasks.map(task => (
                                <div 
                                    key={task.id} 
                                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                                    onClick={() => onTaskClick(task)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-grow">
                                            <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
                                            
                                            {task.description && (
                                                <p className="mt-1 text-xs text-gray-600 line-clamp-1">
                                                    {task.description}
                                                </p>
                                            )}
                                        </div>
                                        
                                        <div className="flex items-center space-x-2 ml-4">
                                            {task.priority && (
                                                <span className={`
                                                    px-2 py-1 text-xs font-medium rounded-full
                                                    ${task.priority === 'Low' ? 'bg-blue-100 text-blue-800' : ''}
                                                    ${task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : ''}
                                                    ${task.priority === 'High' ? 'bg-orange-100 text-orange-800' : ''}
                                                    ${task.priority === 'Urgent' ? 'bg-red-100 text-red-800' : ''}
                                                `}>
                                                    {task.priority}
                                                </span>
                                            )}
                                            
                                            {task.due_date && (
                                                <span className="text-xs text-gray-500">
                                                    {formatDueDate(task.due_date)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {task.assignees && task.assignees.length > 0 && (
                                        <div className="mt-2 flex items-center">
                                            <span className="text-xs text-gray-500 mr-2">Assignees:</span>
                                            <div className="flex -space-x-1">
                                                {task.assignees.map(assignee => (
                                                    <div 
                                                        key={assignee.id} 
                                                        className="h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center text-xs overflow-hidden border border-white"
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
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
} 