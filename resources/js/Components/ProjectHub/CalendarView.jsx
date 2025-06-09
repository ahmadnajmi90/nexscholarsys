import React, { useState, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import Modal from '@/Components/Modal';
import { format } from 'date-fns';

export default function CalendarView({ tasks }) {
    // State for managing the task detail modal
    const [selectedTask, setSelectedTask] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Transform tasks into FullCalendar events format
    // Only include tasks that have a due_date
    const events = useMemo(() => {
        return tasks
            .filter(task => task.due_date)
            .map(task => ({
                id: `task-${task.id}`,
                title: task.title,
                start: task.due_date,
                end: task.due_date,
                allDay: false,
                display: 'list-item', // Force list-item display to prevent multi-day spanning
                backgroundColor: getPriorityColor(task.priority),
                borderColor: getPriorityColor(task.priority),
                textColor: '#fff',
                extendedProps: {
                    taskObject: task
                }
            }));
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
        <div className="bg-white p-6 rounded-lg shadow">
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
            />

            {/* Task Detail Modal */}
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="md">
                {selectedTask && (
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-xl font-bold text-gray-900">{selectedTask.title}</h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        {selectedTask.description && (
                            <div className="mb-4">
                                <h3 className="text-sm font-medium text-gray-700 mb-1">Description</h3>
                                <p className="text-gray-600">{selectedTask.description}</p>
                            </div>
                        )}
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            {selectedTask.due_date && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-1">Due Date</h3>
                                    <p className="text-gray-600">
                                        {format(new Date(selectedTask.due_date), "MMM d, yyyy 'at' h:mm a")}
                                    </p>
                                </div>
                            )}
                            
                            {selectedTask.priority && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-1">Priority</h3>
                                    <span className={`
                                        px-2 py-1 text-xs font-medium rounded-full
                                        ${selectedTask.priority === 'high' ? 'bg-red-100 text-red-800' : ''}
                                        ${selectedTask.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : ''}
                                        ${selectedTask.priority === 'low' ? 'bg-blue-100 text-blue-800' : ''}
                                        ${!selectedTask.priority ? 'bg-gray-100 text-gray-800' : ''}
                                    `}>
                                        {selectedTask.priority ? selectedTask.priority.charAt(0).toUpperCase() + selectedTask.priority.slice(1) : 'None'}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
} 