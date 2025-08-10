import React, { useState, useEffect, useMemo } from 'react';
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Calendar, MessageSquare, Paperclip, Clock, Trash2, Archive, MoreVertical } from 'lucide-react';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { format, isToday, isTomorrow, isPast, isAfter } from 'date-fns';
import { router } from '@inertiajs/react';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import axios from 'axios';
import PaperTaskBadge from './PaperTaskBadge';
import { isTaskCompleted } from '@/Utils/utils';

const TaskCard = ({ task, isRecentlyUpdated = false, onDelete, onClick }) => {
    const [showActionsMenu, setShowActionsMenu] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);
    console.log(task);
    
    // Set up drag-and-drop functionality with dnd-kit
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ 
        id: `task-${task.id}`,
        data: { 
            type: 'Task', 
            task 
        }
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
        opacity: isDragging ? 0.5 : 1,
    };

    // Function to get initials from a name
    const getInitials = (name) => {
        if (!name) return '??';
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Enhanced date formatting using date-fns
    const formattedDueDate = useMemo(() => {
        if (!task.due_date) return null;

        try {
            const date = new Date(task.due_date);
            const now = new Date();
            const overdue = isAfter(now, date);
            
            let dateString;
            if (isToday(date)) {
                dateString = `Today at ${format(date, 'p')}`; // e.g., "Today at 2:30 PM"
            } else if (isTomorrow(date)) {
                dateString = `Tomorrow at ${format(date, 'p')}`;
            } else if (overdue) {
                // For overdue tasks, show full date with time
                dateString = format(date, 'MMM d, p');
            } else {
                // For future dates, show month and day with time
                dateString = format(date, 'MMM d, p');
            }
            
            return {
                text: dateString,
                isOverdue: overdue
            };
        } catch (error) {
            console.error('Error formatting date:', error);
            return null;
        }
    }, [task.due_date]);
    
    // Handle delete button click
    const handleDeleteClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Stop the event from propagating to the sortable handler
        if (onDelete) {
            onDelete(task);
        }
    };
    
    const handleArchive = (e) => {
        e.preventDefault();
        e.stopPropagation();
        router.post(route('project-hub.tasks.archive', task.id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Task archived!');
                router.reload({ only: ['initialBoardData'] });
            },
            onError: () => toast.error('Failed to archive task.'),
        });
    };
    
    // Handle card click to open details modal
    const handleCardClick = (e) => {
        // Prevent click from triggering drag events
        if (onClick && !e.target.closest('button') && !e.target.closest('input[type="checkbox"]')) {
            e.preventDefault();
            e.stopPropagation();
            onClick(task);
        }
    };

    // Handle task completion toggle
    const handleToggleCompletion = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (isCompleting) {
            return;
        }

        setIsCompleting(true);

        try {
            await axios.post(route('project-hub.tasks.toggle-completion', task.id));
            
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
            setIsCompleting(false);
        }
    };
    
    // console.log(task);
    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={clsx(
                "relative bg-white rounded-md shadow-sm border border-gray-200 p-3 mb-2 cursor-pointer hover:shadow-md transition-all duration-200",
                {
                    "ring-2 ring-indigo-500 ring-opacity-50": isRecentlyUpdated,
                    "opacity-60": isTaskCompleted(task)
                }
            )}
            onMouseEnter={() => setShowActionsMenu(true)}
            onMouseLeave={() => setShowActionsMenu(false)}
            onClick={handleCardClick}
        >
            {/* Unified More Options Menu */}
            {showActionsMenu && (
                <div className="absolute top-1 right-1 z-10" onClick={(e) => e.stopPropagation()}>
                    <Menu as="div" className="relative">
                        <MenuButton className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full">
                            <MoreVertical className="w-4 h-4" />
                        </MenuButton>
                        <MenuItems anchor="bottom end" className="w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                                {isTaskCompleted(task) && !task.archived_at && (
                                    <MenuItem>
                                        <button onClick={handleArchive} className="group flex w-full items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            <Archive className="mr-2 h-4 w-4 text-gray-500" />
                                            Archive
                                        </button>
                                    </MenuItem>
                                )}
                                {onDelete && (
                                    <MenuItem>
                                        <button onClick={handleDeleteClick} className="group flex w-full items-center px-3 py-2 text-sm text-red-700 hover:bg-red-50">
                                            <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                                            Delete
                                        </button>
                                    </MenuItem>
                                )}
                            </div>
                        </MenuItems>
                    </Menu>
                </div>
            )}
            
            {/* Labels/Tags - render if available */}
            {task.labels && task.labels.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                    {task.labels.map((label, index) => (
                        <span 
                            key={index} 
                            className={`
                                text-xs px-2 py-0.5 rounded-full
                                ${label.color || 'bg-gray-200 text-gray-800'}
                            `}
                        >
                            {label.name}
                        </span>
                    ))}
                </div>
            )}
            
            {/* Task Title */}
            <div className="flex items-center gap-2 mb-1">
                <input
                    type="checkbox"
                    checked={isTaskCompleted(task)}
                    disabled={isCompleting}
                    onChange={handleToggleCompletion}
                    className={clsx(
                        "w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2",
                        {
                            "opacity-50 cursor-not-allowed": isCompleting
                        }
                    )}
                />
                <h3 className={clsx(
                    "font-medium line-clamp-2 pr-5 flex-1",
                    {
                        "text-gray-500 line-through": isTaskCompleted(task),
                        "text-gray-900": !isTaskCompleted(task)
                    }
                )}>
                    {task.title}
                </h3>
                {task.paper_writing_task && <PaperTaskBadge />}
            </div>
            
            {/* Task Description - truncated */}
            {task.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {task.description}
                </p>
            )}
            
            {/* Priority Badge */}
            {task.priority && (
                <div className="mb-2">
                    <span className={`
                        text-xs px-2 py-1 rounded-full font-medium
                        ${task.priority === 'Low' ? 'bg-blue-100 text-blue-800' : ''}
                        ${task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${task.priority === 'High' ? 'bg-orange-100 text-orange-800' : ''}
                        ${task.priority === 'Urgent' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                        {task.priority}
                    </span>
                </div>
            )}
            
            {/* Task Metadata */}
            <div className="flex items-center justify-between mt-2">
                {/* Left side - Meta information */}
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                    {/* Due date indicator with enhanced formatting */}
                    {formattedDueDate && (
                        <div className={`flex items-center ${formattedDueDate.isOverdue ? 'text-red-600 font-medium' : ''}`}>
                            <Calendar className={`w-3.5 h-3.5 mr-1 ${formattedDueDate.isOverdue ? 'text-red-600' : ''}`} />
                            <span>{formattedDueDate.text}</span>
                        </div>
                    )}
                    
                    {/* Comments counter */}
                    {task.comments_count > 0 && (
                        <div className="flex items-center">
                            <MessageSquare className="w-3.5 h-3.5 mr-1" />
                            <span>{task.comments_count}</span>
                        </div>
                    )}
                    
                    {/* Attachments counter */}
                    {task.attachments && task.attachments.length > 0 && (
                        <div className="flex items-center">
                            <Paperclip className="w-3.5 h-3.5 mr-1" />
                            <span>{task.attachments.length}</span>
                        </div>
                    )}
                </div>
                
                {/* Right side - Assignees */}
                {task.assignees && task.assignees.length > 0 && (
                    <div className="flex -space-x-2">
                        {task.assignees.slice(0, 3).map((assignee, index) => (
                            <div 
                                key={index} 
                                className="w-6 h-6 rounded-full ring-2 ring-white overflow-hidden bg-gray-200 flex items-center justify-center"
                                title={assignee.full_name || 'Unnamed user'}
                            >
                                {assignee.avatar_url ? (
                                    <img 
                                        src={assignee.avatar_url !== null ? `/storage/${assignee.avatar_url}` : "/storage/profile_pictures/default.jpg"}
                                        alt={assignee.full_name} 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-xs font-medium text-gray-600">
                                        {assignee.full_name ? getInitials(assignee.full_name) : '??'}
                                    </span>
                                )}
                            </div>
                        ))}
                        
                        {/* If more than 3 assignees, show count */}
                        {task.assignees.length > 3 && (
                            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs ring-2 ring-white text-gray-500">
                                +{task.assignees.length - 3}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskCard; 