import React, { useState, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import Modal from '@/Components/Modal';
import { format } from 'date-fns';
import { BookOpen } from 'lucide-react';
import clsx from 'clsx';
import { isTaskCompleted } from '@/Utils/utils';

export default function CalendarView({ tasks }) {
    // State for managing the task detail modal
    const [selectedTask, setSelectedTask] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Transform tasks into FullCalendar events format
    // Only include tasks that have a due_date
    const events = useMemo(() => {
        return tasks
            .filter(task => task.due_date)
            .map(task => {
                const isCompleted = isTaskCompleted(task);
                const priorityColor = getPriorityColor(task.priority);
                
                return {
                    id: `task-${task.id}`,
                    title: `${task.paper_writing_task ? '📖 ' : ''}${task.title}`,
                    start: task.due_date,
                    end: task.due_date,
                    allDay: false,
                    display: 'list-item', // Force list-item display to prevent multi-day spanning
                    backgroundColor: isCompleted ? 'rgba(107, 114, 128, 0.6)' : priorityColor, // Gray and transparent if completed
                    borderColor: isCompleted ? 'rgba(107, 114, 128, 0.6)' : priorityColor,
                    textColor: '#fff',
                    className: isCompleted ? 'task-completed' : '',
                    extendedProps: {
                        taskObject: task,
                        isCompleted: isCompleted
                    }
                };
            });
    }, [tasks]);

    // Get color based on task priority
    function getPriorityColor(priority) {
        switch (priority) {
            case 'Urgent':
                return '#dc2626'; // red-600
            case 'High':
                return '#ea580c'; // orange-600
            case 'Medium':
                return '#f59e0b'; // amber-500
            case 'Low':
                return '#3b82f6'; // blue-500
            default:
                return '#6b7280'; // gray-500
        }
    }

    // Handle event click - show task details in modal
    const handleEventClick = (info) => {
        const task = info.event.extendedProps.taskObject;
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    // Handle modal close
    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="bg-white p-3 md:p-6 rounded-lg shadow">
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                eventClick={handleEventClick}
                displayEventTime={false}
                height="auto"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,dayGridWeek'
                }}
                buttonText={{
                    today: 'Today',
                    month: 'Month',
                    week: 'Week'
                }}
                // Mobile-responsive configuration
                aspectRatio={window.innerWidth < 768 ? 1.2 : 1.35}
                eventMaxStack={2}
                moreLinkClick="popover"
                dayMaxEvents={3}
                eventDisplay="block"
                eventClassNames="touch-manipulation"
            />

            {/* Task Detail Modal - Mobile-optimized */}
            <Modal show={isModalOpen} onClose={closeModal} maxWidth={window.innerWidth < 768 ? "sm" : "md"}>
                {selectedTask && (
                    <div className="p-4 md:p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-2 pr-4">
                                <h2 className={clsx(
                                    "text-lg md:text-xl font-bold break-words",
                                    {
                                        "text-gray-500 line-through": isTaskCompleted(selectedTask),
                                        "text-gray-900": !isTaskCompleted(selectedTask)
                                    }
                                )}>
                                    {selectedTask.title}
                                </h2>
                                {selectedTask.paper_writing_task && (
                                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full flex-shrink-0">
                                        <BookOpen className="w-3 h-3 mr-1" />
                                        Paper
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-500 p-1 touch-manipulation flex-shrink-0"
                            >
                                <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        {selectedTask.description && (
                            <div className="mb-4">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                                <p className="text-gray-600 text-sm md:text-base break-words">{selectedTask.description}</p>
                            </div>
                        )}
                        
                        {/* Mobile: Stack items vertically, Desktop: Use grid */}
                        <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-4 mb-4">
                            {selectedTask.due_date && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-1">Due Date</h3>
                                    <p className="text-gray-600 text-sm">
                                        {format(new Date(selectedTask.due_date), "MMM d, yyyy 'at' h:mm a")}
                                    </p>
                                </div>
                            )}
                            
                            {selectedTask.priority && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-1">Priority</h3>
                                    <span className={`
                                        px-2 py-1 text-xs font-medium rounded-full
                                        ${selectedTask.priority === 'Urgent' ? 'bg-red-100 text-red-800' : ''}
                                        ${selectedTask.priority === 'High' ? 'bg-orange-100 text-orange-800' : ''}
                                        ${selectedTask.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : ''}
                                        ${selectedTask.priority === 'Low' ? 'bg-blue-100 text-blue-800' : ''}
                                        ${!selectedTask.priority ? 'bg-gray-100 text-gray-800' : ''}
                                    `}>
                                        {selectedTask.priority || 'None'}
                                    </span>
                                </div>
                            )}
                            
                            {selectedTask.list_name && (
                                <div className="md:col-span-2">
                                    <h3 className="text-sm font-medium text-gray-700 mb-1">List</h3>
                                    <p className="text-gray-600 text-sm">{selectedTask.list_name}</p>
                                </div>
                            )}
                        </div>

                        {/* Assignees section */}
                        {selectedTask.assignees && selectedTask.assignees.length > 0 && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Assignees</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedTask.assignees.map(assignee => (
                                        <div key={assignee.id} className="flex items-center gap-2 bg-gray-50 rounded-md px-2 py-1">
                                            <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs overflow-hidden">
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
                                            <span className="text-sm text-gray-700">{assignee.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
} 