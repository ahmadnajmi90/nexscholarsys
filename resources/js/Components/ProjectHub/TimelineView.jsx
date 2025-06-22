import React, { useEffect, useRef, useState } from 'react';
import Gantt from 'frappe-gantt';
import { format, addDays, isValid } from 'date-fns';
import { isTaskCompleted } from '@/Utils/utils';

export default function TimelineView({ board, onTaskClick }) {
    console.log("2. Board data received as props by TimelineView:", board);
    
    const ganttContainer = useRef(null);
    const [ganttChart, setGanttChart] = useState(null);
    
    useEffect(() => {
        // Transform tasks into the format frappe-gantt expects
        const tasks = transformTasksForGantt(board);
        
        console.log("4. Transformed tasks for Gantt chart:", tasks);
        console.log("4a. Gantt container exists:", !!ganttContainer.current);
        console.log("4b. Tasks length:", tasks.length);
        
        if (ganttContainer.current && tasks.length > 0) {
            console.log("4c. Initializing Gantt chart with tasks:", tasks);
            try {
                // Initialize the Gantt chart
                const gantt = new Gantt(ganttContainer.current, tasks, {
                    header_height: 50,
                    column_width: 30,
                    step: 24,
                    view_modes: ['Day', 'Week', 'Month'],
                    bar_height: 20,
                    bar_corner_radius: 3,
                    arrow_curve: 5,
                    padding: 18,
                    view_mode: 'Week',
                    date_format: 'MMM d, yyyy',
                    custom_popup_html: task => {
                        try {
                            // Format dates for display
                            const startDate = format(new Date(task._start), "MMM d, yyyy 'at' h:mm a");
                            const endDate = format(new Date(task._end), "MMM d, yyyy 'at' h:mm a");
                            
                            // Use the stored list name if available
                            const listName = task.list_name || '';
                            
                            return `
                                <div class="gantt-tooltip p-3 bg-white shadow-lg rounded-md border border-gray-200">
                                    <h4 class="text-sm font-semibold text-gray-900 mb-1">${task.name || 'Unnamed Task'}</h4>
                                    <div class="text-xs text-gray-600 mb-2">
                                        ${listName ? `List: ${listName}` : ''}
                                    </div>
                                    <div class="text-xs text-gray-500">
                                        <div>Created: ${startDate}</div>
                                        <div>Due: ${endDate}</div>
                                    </div>
                                    <div class="mt-2 text-xs text-indigo-600">Click to view details</div>
                                </div>
                            `;
                        } catch (error) {
                            console.error('Error generating tooltip:', error);
                            return `<div class="gantt-tooltip p-3 bg-white shadow-lg rounded-md border border-gray-200">
                                Task details unavailable
                            </div>`;
                        }
                    },
                    on_click: task => {
                        try {
                            if (task.original_task) {
                                onTaskClick(task.original_task);
                            } else {
                                const taskId = parseInt(task.id.replace('task-', ''));
                                const originalTask = findTaskById(board, taskId);
                                if (originalTask) {
                                    onTaskClick(originalTask);
                                }
                            }
                        } catch (error) {
                            console.error('Error handling task click:', error);
                        }
                    },
                    on_date_change: () => {}, // Prevent default behavior
                    on_progress_change: () => {}, // Prevent default behavior
                    on_view_change: () => {} // Prevent default behavior
                });
                
                // Store the gantt instance
                setGanttChart(gantt);
                
                // Clean up on unmount
                return () => {
                    setGanttChart(null);
                };
            } catch (error) {
                console.error('Error initializing Gantt chart:', error);
            }
        } else {
            console.log("4d. Gantt chart NOT initialized - Container exists:", !!ganttContainer.current, "Tasks length:", tasks.length);
        }
    }, [board, onTaskClick]);
    
    // Find a task by ID in the board data
    const findTaskById = (board, taskId) => {
        for (const list of board.lists) {
            const task = list.tasks.find(t => t.id === taskId);
            if (task) return task;
        }
        return null;
    };
    
    // Transform tasks into the format required by frappe-gantt
    const transformTasksForGantt = (board) => {
        const ganttTasks = [];
        
        console.log("3. Starting task transformation. Board lists:", board.lists);
        
        board.lists.forEach(list => {
            console.log(`3a. Processing list "${list.name}" with ${list.tasks.length} tasks:`, list.tasks);
            
            list.tasks.forEach(task => {
                // Skip tasks without necessary data
                if (!task || !task.id || !task.title) {
                    console.warn('Skipping invalid task:', task);
                    return;
                }
                
                // Use created_at as start date
                let startDate;
                try {
                    startDate = task.created_at ? new Date(task.created_at) : new Date();
                    if (!isValid(startDate)) startDate = new Date();
                } catch (e) {
                    console.warn('Invalid start date for task:', task.id);
                    startDate = new Date();
                }
                
                // Use due_date as end date, or created_at + 1 day if no due date
                let endDate;
                try {
                    if (task.due_date && isValid(new Date(task.due_date))) {
                        endDate = new Date(task.due_date);
                    } else {
                        endDate = addDays(startDate, 1);
                    }
                    
                    // Ensure end date is not before start date
                    if (endDate < startDate) {
                        endDate = addDays(startDate, 1);
                    }
                } catch (e) {
                    console.warn('Invalid end date for task:', task.id);
                    endDate = addDays(startDate, 1);
                }
                
                // Generate a color based on task priority
                const color = getPriorityColor(task.priority);
                const isCompleted = isTaskCompleted(task);
                
                const ganttTask = {
                    id: `task-${task.id}`,
                    name: task.title,
                    start: startDate,
                    end: endDate,
                    progress: 0, // We don't track progress yet
                    dependencies: '', // We don't have dependencies yet
                    custom_class: isCompleted ? 'task-completed' : (task.priority || 'default'),
                    color: color,
                    original_task: task, // Store reference to original task
                    list_id: list.id,
                    list_name: list.name
                };
                
                console.log(`3b. Adding task "${task.title}" to gantt:`, ganttTask);
                ganttTasks.push(ganttTask);
            });
        });
        
        console.log("3c. Final gantt tasks array:", ganttTasks);
        return ganttTasks;
    };
    
    // Get a color based on priority
    const getPriorityColor = (priority) => {
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
    };
    
    // Render toolbar with view mode buttons
    const renderToolbar = () => {
        if (!ganttChart) return null;
        
        return (
            <div className="flex space-x-2 mb-4">
                <button
                    type="button"
                    onClick={() => ganttChart.change_view_mode('Day')}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200"
                >
                    Day
                </button>
                <button
                    type="button"
                    onClick={() => ganttChart.change_view_mode('Week')}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200"
                >
                    Week
                </button>
                <button
                    type="button"
                    onClick={() => ganttChart.change_view_mode('Month')}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200"
                >
                    Month
                </button>
            </div>
        );
    };
    
    return (
        <div className="bg-white rounded-lg shadow p-4">
            {/* Toolbar for view modes */}
            {renderToolbar()}
            
            {/* Container for the Gantt chart */}
            <div className="overflow-x-auto">
                <div ref={ganttContainer} className="gantt-container"></div>
            </div>
            
            {/* Legend */}
            <div className="mt-4 pt-3 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Priority Legend:</h4>
                <div className="flex space-x-4">
                    <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-red-600 mr-1"></div>
                        <span className="text-xs text-gray-600">Urgent</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-orange-600 mr-1"></div>
                        <span className="text-xs text-gray-600">High</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-amber-500 mr-1"></div>
                        <span className="text-xs text-gray-600">Medium</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                        <span className="text-xs text-gray-600">Low</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-gray-500 mr-1"></div>
                        <span className="text-xs text-gray-600">No Priority</span>
                    </div>
                </div>
            </div>
        </div>
    );
} 