import React, { useState } from 'react';
import { format } from 'date-fns';
import { router } from '@inertiajs/react';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import axios from 'axios';
import PaperTaskBadge from './PaperTaskBadge';
import { isTaskCompleted } from '@/Utils/utils';

export default function ListView({ board, onTaskClick }) {
    const [showCompleted, setShowCompleted] = useState(false);
    const [completingTasks, setCompletingTasks] = useState(new Set());

    // Function to format the due date
    const formatDueDate = (dueDate) => {
        if (!dueDate) return null;
        return format(new Date(dueDate), "MMM d, yyyy 'at' h:mm a");
    };

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

    return (
        <div className="list-view-container bg-white rounded-lg shadow">
            {/* Show Completed Tasks Toggle */}
            <div className="px-4 py-3 border-b bg-gray-50">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="show-completed"
                        checked={showCompleted}
                        onChange={(e) => setShowCompleted(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                    />
                    <label htmlFor="show-completed" className="ml-2 text-sm font-medium text-gray-700">
                        Show Completed Tasks
                    </label>
                </div>
            </div>

            {board.lists.map(list => {
                // Filter tasks based on showCompleted state
                const filteredTasks = list.tasks.filter(task => {
                    return showCompleted ? true : !isTaskCompleted(task);
                });

                return (
                    <div key={list.id} className="mb-6">
                        <h3 className="px-4 py-3 text-md font-semibold text-gray-800 bg-gray-50 border-b">
                            {list.name} ({filteredTasks.length})
                        </h3>
                        
                        <div className="divide-y">
                            {filteredTasks.length === 0 ? (
                                <div className="px-4 py-3 text-sm text-gray-500 italic">
                                    {showCompleted || list.tasks.length === 0 ? 'No tasks in this list' : 'No active tasks in this list'}
                                </div>
                            ) : (
                                filteredTasks.map(task => (
                                    <div 
                                        key={task.id} 
                                        className={clsx(
                                            "px-4 py-3 hover:bg-gray-50 cursor-pointer",
                                            {
                                                "opacity-60": isTaskCompleted(task)
                                            }
                                        )}
                                        onClick={() => onTaskClick(task)}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-2 flex-grow">
                                                <input
                                                    type="checkbox"
                                                    checked={isTaskCompleted(task)}
                                                    disabled={completingTasks.has(task.id)}
                                                    onChange={(e) => handleToggleCompletion(task, e)}
                                                    className={clsx(
                                                        "w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2 mt-0.5",
                                                        {
                                                            "opacity-50 cursor-not-allowed": completingTasks.has(task.id)
                                                        }
                                                    )}
                                                />
                                                <div className="flex-grow">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className={clsx(
                                                            "text-sm font-medium",
                                                            {
                                                                "text-gray-500 line-through": isTaskCompleted(task),
                                                                "text-gray-900": !isTaskCompleted(task)
                                                            }
                                                        )}>
                                                            {task.title}
                                                        </h4>
                                                        {task.paper_writing_task && <PaperTaskBadge />}
                                                    </div>
                                                
                                                    {task.description && (
                                                        <p className="mt-1 text-xs text-gray-600 line-clamp-1">
                                                            {task.description}
                                                        </p>
                                                    )}
                                                </div>
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
                );
            })}
        </div>
    );
} 