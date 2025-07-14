import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';
import { useForm } from '@inertiajs/react';
import { Plus, X, MoreVertical, Trash2, GripHorizontal } from 'lucide-react';
import clsx from 'clsx';

export default function BoardColumn({ 
    list, 
    tasks, 
    onDeleteList, 
    onDeleteTask, 
    onTaskClick, 
    onAddTask, 
    className = '',
    isDragging = false,
    isOverlay = false
}) {
    // Add useSortable hook for the column itself (but not for overlay)
    const {
        attributes,
        listeners,
        setNodeRef: setSortableRef,
        transform,
        transition,
        isDragging: isDraggingInternal
    } = useSortable({
        id: `list-${list.id}`,
        data: {
            type: 'List',
            list
        },
        disabled: isOverlay // Disable sortable behavior for the overlay
    });

    // Use useDroppable for task dropping functionality (but not for overlay)
    const { setNodeRef: setDroppableRef, isOver } = useDroppable({
        id: `list-${list.id}`,
        data: {
            type: 'list',
            list
        },
        disabled: isOverlay // Disable droppable behavior for the overlay
    });
    
    // Combine refs for both sortable and droppable functionality
    const setNodeRef = (node) => {
        if (!isOverlay) {
            setSortableRef(node);
            setDroppableRef(node);
        }
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
    const style = isOverlay ? {} : {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition,
    };

    // Determine column classes using clsx for better conditional class handling
    const columnClasses = clsx(
        'board-column',
        'flex flex-col',
        'lg:w-full w-20',
        'md:flex-shrink-0',
        'rounded-md',
        'md:mx-2',
        'mb-4 md:mb-0',
        'transition-transform duration-300 ease-in-out',
        'h-full min-h-[350px]', // Ensure consistent height
        className,
        {
            // Placeholder styles when being dragged
            'border-2 border-dashed border-blue-400 bg-blue-50/50': isDragging,
            // Normal styles when not being dragged
            'shadow bg-gray-100': !isDragging,
            // Overlay styles
            'z-50 shadow-xl scale-[1.02]': isOverlay
        }
    );

    // Content visibility class to hide content in placeholder but maintain structure
    const contentVisibilityClass = isDragging ? 'invisible' : 'visible';

    return (
        <div 
            ref={isOverlay ? undefined : setNodeRef}
            style={style}
            className={columnClasses}
            {...(isOverlay ? {} : attributes)}
        >
            {/* Column Header */}
            <div 
                className={clsx(
                    "p-3 md:p-3 border-b bg-white rounded-t-md flex justify-between items-center cursor-grab lg:w-full w-[24.5rem]",
                    contentVisibilityClass
                )}
                {...(isOverlay ? {} : listeners)}
            >
                <div className="flex items-center">
                    <GripHorizontal className="w-4 h-4 mr-2 text-gray-400" />
                    <h2 className="font-semibold text-gray-800 text-base md:text-base">{list.name}</h2>
                </div>
                {!isOverlay && (
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
                )}
            </div>
            
            {/* Tasks Container with consistent height */}
            <div 
                className={clsx(
                    "flex-1 p-2 min-h-[250px] lg:w-full w-[24.5rem] board-column-tasks",
                    contentVisibilityClass,
                    { "bg-blue-50": isOver && !isOverlay }
                )}
            >
                <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
                    {tasksWithListId.map(task => (
                        <TaskCard 
                            key={task.id} 
                            task={task} 
                            onDelete={isOverlay ? undefined : onDeleteTask}
                            onClick={isOverlay ? undefined : onTaskClick}
                        />
                    ))}
                </SortableContext>
                
                {/* Empty state when a column has no tasks - with consistent height */}
                {tasks.length === 0 && (
                    <div className="flex items-center justify-center h-[200px] text-gray-400 text-sm md:text-sm italic">
                        {isOver && !isOverlay
                            ? 'Drop task here' 
                            : 'No tasks yet'}
                    </div>
                )}
            </div>
            
            {/* Add Task Button - Mobile: larger touch target */}
            {!isOverlay && (
                <div className={clsx(
                    "p-2 border-t bg-gray-50 rounded-b-md lg:w-full w-[24.5rem]",
                    contentVisibilityClass
                )}>
                    <button
                        type="button"
                        onClick={() => onAddTask && onAddTask(list.id)}
                        className="lg:w-full w-[24.5rem] text-left text-gray-600 text-sm py-2 md:py-1 px-2 rounded hover:bg-gray-200 transition-colors flex items-center touch-manipulation"
                    >
                        <Plus className="h-4 w-4 mr-1" />
                        Add a task
                    </button>
                </div>
            )}
            
            {/* Placeholder label for dragged item */}
            {isDragging && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-blue-500 font-medium">Drop here</div>
                </div>
            )}
        </div>
    );
} 