import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';
import { useForm } from '@inertiajs/react';
import { Plus, X, MoreVertical, Trash2 } from 'lucide-react';

export default function BoardColumn({ list, tasks, onDeleteList, onDeleteTask, onTaskClick }) {
    const { setNodeRef, isOver } = useDroppable({
        id: `list-${list.id}`,
        data: {
            type: 'list',
            list
        }
    });
    
    // Add state for task creation form visibility
    const [isCreatingTask, setIsCreatingTask] = useState(false);
    // Add state for column menu
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    // Initialize form for task creation
    const form = useForm({
        title: '',
        description: '',
    });

    // Create an array of task IDs for SortableContext
    const taskIds = tasks.map(task => `task-${task.id}`);

    // Ensure each task has the list_id property set
    const tasksWithListId = tasks.map(task => ({
        ...task,
        list_id: list.id
    }));
    
    // Handle task creation form submission
    const handleCreateTask = (e) => {
        e.preventDefault();
        
        form.post(`/api/v1/lists/${list.id}/tasks`, {
            onSuccess: () => {
                // Reset form and hide it
                setIsCreatingTask(false);
                form.reset();
            },
            onError: (errors) => {
                console.error('Failed to create task:', errors);
            }
        });
    };

    return (
        <div className="flex flex-col w-72 flex-shrink-0 bg-gray-100 rounded-md mx-2 shadow">
            {/* Column Header */}
            <div className="p-3 border-b bg-white rounded-t-md">
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-gray-800">{list.name}</h2>
                    <div className="relative">
                        <button 
                            type="button"
                            className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <MoreVertical className="w-4 h-4" />
                        </button>
                        
                        {/* Column actions menu */}
                        {isMenuOpen && (
                            <div className="absolute right-0 z-10 mt-1 w-36 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <button
                                    type="button"
                                    className="flex w-full items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        onDeleteList && onDeleteList();
                                    }}
                                >
                                    <Trash2 className="w-4 h-4 mr-2 text-gray-500" />
                                    Delete List
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                    {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
                </div>
            </div>
            
            {/* Tasks Container - droppable area */}
            <div 
                ref={setNodeRef}
                className={`flex-1 p-2 min-h-[200px] overflow-y-auto ${isOver ? 'bg-blue-50' : ''}`}
            >
                <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
                    {tasksWithListId.map(task => (
                        <TaskCard 
                            key={task.id} 
                            task={task} 
                            onDelete={onDeleteTask}
                            onClick={onTaskClick}
                        />
                    ))}
                </SortableContext>
                
                {/* Empty state when a column has no tasks */}
                {tasks.length === 0 && !isCreatingTask && (
                    <div className="flex items-center justify-center h-20 text-gray-400 text-sm italic">
                        {isOver 
                            ? 'Drop task here' 
                            : 'No tasks yet'}
                    </div>
                )}
                
                {/* Task Creation Form */}
                {isCreatingTask && (
                    <div className="bg-white rounded shadow p-2 mb-2">
                        <form onSubmit={handleCreateTask}>
                            <textarea
                                value={form.data.title}
                                onChange={e => form.setData('title', e.target.value)}
                                placeholder="Enter a title for this task..."
                                className="w-full text-sm border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm resize-none"
                                rows={3}
                                autoFocus
                                disabled={form.processing}
                            />
                            {form.errors.title && (
                                <div className="text-red-500 text-xs mt-1">{form.errors.title}</div>
                            )}
                            <div className="flex justify-between mt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsCreatingTask(false);
                                        form.reset();
                                    }}
                                    className="inline-flex items-center text-gray-500 hover:text-gray-700"
                                    disabled={form.processing}
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex items-center px-3 py-1 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    disabled={form.processing || !form.data.title.trim()}
                                >
                                    {form.processing ? 'Saving...' : 'Save Card'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
            
            {/* Add Task Button */}
            <div className="p-2 border-t bg-gray-50 rounded-b-md">
                {!isCreatingTask ? (
                    <button
                        type="button"
                        onClick={() => setIsCreatingTask(true)}
                        className="w-full text-left text-gray-600 text-sm py-1 px-2 rounded hover:bg-gray-200 transition-colors flex items-center"
                    >
                        <Plus className="h-4 w-4 mr-1" />
                        Add a task
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={() => {
                            setIsCreatingTask(false);
                            form.reset();
                        }}
                        className="w-full text-left text-gray-600 text-sm py-1 px-2 rounded hover:bg-gray-200 transition-colors flex items-center"
                    >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                    </button>
                )}
            </div>
        </div>
    );
} 