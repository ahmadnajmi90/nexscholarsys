import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';
import { useForm } from '@inertiajs/react';
import { Plus, X, MoreVertical, Trash2, GripHorizontal } from 'lucide-react';

export default function BoardColumn({ list, tasks, onDeleteList, onDeleteTask, onTaskClick, onAddTask, className = '' }) {
    // Add useSortable hook for the column itself
    const {
        attributes,
        listeners,
        setNodeRef: setSortableRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: `list-${list.id}`,
        data: {
            type: 'List',
            list
        }
    });

    // Use useDroppable for task dropping functionality
    const { setNodeRef: setDroppableRef, isOver } = useDroppable({
        id: `list-${list.id}`,
        data: {
            type: 'list',
            list
        }
    });
    
    // Combine refs for both sortable and droppable functionality
    const setNodeRef = (node) => {
        setSortableRef(node);
        setDroppableRef(node);
    };
    
    // Add state for column menu
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Create an array of task IDs for SortableContext
    const taskIds = tasks.map(task => `task-${task.id}`);

    // Ensure each task has the list_id property set
    const tasksWithListId = tasks.map(task => ({
        ...task,
        list_id: list.id
    }));
    
    // Apply transform styles for dragging
    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div 
            ref={setNodeRef}
            style={style}
            className={`board-column flex flex-col lg:w-full w-20 md:flex-shrink-0 bg-gray-100 rounded-md md:mx-2 mb-4 md:mb-0 shadow ${className}`}
        >
            {/* Column Header - Mobile: larger touch targets, Desktop: same as before */}
            <div 
                className="p-3 md:p-3 border-b bg-white rounded-t-md flex justify-between items-center cursor-grab lg:w-full w-[24.5rem]"
                {...attributes}
                {...listeners}
            >
                <div className="flex items-center">
                    <GripHorizontal className="w-4 h-4 mr-2 text-gray-400" />
                    <h2 className="font-semibold text-gray-800 text-base md:text-base">{list.name}</h2>
                </div>
                <div className="relative flex items-center">
                    <div className="text-xs text-gray-500 mr-2">
                        {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
                    </div>
                    <button 
                        type="button"
                        className="p-2 md:p-1 text-gray-400 hover:text-gray-600 rounded-full touch-manipulation"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <MoreVertical className="w-4 h-4" />
                    </button>
                    
                    {/* Column actions menu */}
                    {isMenuOpen && (
                        <div className="absolute right-0 top-full z-10 mt-1 w-36 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <button
                                type="button"
                                className="flex w-full items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 touch-manipulation"
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
            
            {/* Tasks Container - Mobile: larger min-height, Desktop: same as before */}
            <div 
                className={`flex-1 p-2 min-h-[200px] md:min-h-[200px] lg:w-full w-[24.5rem] board-column-tasks ${isOver ? 'bg-blue-50' : ''}`}
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
                
                {/* Empty state when a column has no tasks - Mobile: larger text */}
                {tasks.length === 0 && (
                    <div className="flex items-center justify-center h-20 text-gray-400 text-sm md:text-sm italic">
                        {isOver 
                            ? 'Drop task here' 
                            : 'No tasks yet'}
                    </div>
                )}
            </div>
            
            {/* Add Task Button - Mobile: larger touch target */}
            <div className="p-2 border-t bg-gray-50 rounded-b-md lg:w-full w-[24.5rem]">
                <button
                    type="button"
                    onClick={() => onAddTask && onAddTask(list.id)}
                    className="lg:w-full w-[24.5rem] text-left text-gray-600 text-sm py-2 md:py-1 px-2 rounded hover:bg-gray-200 transition-colors flex items-center touch-manipulation"
                >
                    <Plus className="h-4 w-4 mr-1" />
                    Add a task
                </button>
            </div>
        </div>
    );
} 