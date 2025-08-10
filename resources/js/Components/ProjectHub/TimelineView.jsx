import React, { useState, useEffect } from 'react';
import { Gantt, ViewMode } from 'gantt-task-react';
import { isTaskCompleted } from '@/Utils/utils';
import { addDays, isValid, parseISO } from 'date-fns';

// CRITICAL: Import the library's CSS for styling
import "gantt-task-react/dist/index.css";

// Helper to get a color based on priority
const getPriorityStyles = (priority) => {
    // Tailwind CSS color palette
    const colors = {
        Urgent: { progressColor: '#ef4444', backgroundColor: '#fee2e2' }, // red-500 / red-100
        High:   { progressColor: '#f97316', backgroundColor: '#ffedd5' }, // orange-500 / orange-100
        Medium: { progressColor: '#eab308', backgroundColor: '#fef3c7' }, // yellow-500 / yellow-100
        Low:    { progressColor: '#3b82f6', backgroundColor: '#dbeafe' }, // blue-500 / blue-100
        default:{ progressColor: '#6b7280', backgroundColor: '#f3f4f6' }  // gray-500 / gray-100
    };
    return colors[priority] || colors.default;
};

export default function TimelineView({ board, onTaskClick }) {
    const [tasks, setTasks] = useState([]);
    const [view, setView] = useState(ViewMode.Week);
    
    useEffect(() => {
        // --- DATA TRANSFORMATION ---
        // Converts your board data into the format gantt-task-react requires.
        if (!board || !Array.isArray(board.lists)) {
            setTasks([]);
            return;
        }

        const transformedTasks = [];
        board.lists.forEach(list => {
            if (!list || !Array.isArray(list.tasks)) return;

            list.tasks.forEach(task => {
                if (!task || !task.id || !task.title || !task.created_at) return;

                const startDate = parseISO(task.created_at);
                let endDate = task.due_date ? parseISO(task.due_date) : null;

                if (!isValid(startDate)) return;
                if (!endDate || !isValid(endDate) || endDate <= startDate) {
                    endDate = addDays(startDate, 1);
                }
                
                transformedTasks.push({
                    start: startDate,
                    end: endDate,
                    name: task.title,
                    id: `task-${task.id}`, // Must be a unique string
                    type: 'task',
                    progress: isTaskCompleted(task) ? 100 : 0,
                    isDisabled: true, // Makes the bars read-only
                    styles: getPriorityStyles(task.priority),
                    original_task: task, // Store original task for the click handler
                });
            });
        });
        
        setTasks(transformedTasks);
    }, [board]);

    // Dynamic column width for compact Day view
    const columnWidth = view === ViewMode.Day ? 50 : 65;

        return (
        // 1. ADD the new className "timeline-view-container" here
        <div className="bg-white rounded-lg shadow p-4 timeline-view-container">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
                <h3 className="text-base font-medium text-gray-900">Timeline View</h3>
                <div className="flex space-x-2">
                    <button onClick={() => setView(ViewMode.Day)} className={`btn-secondary-sm ${view === ViewMode.Day && 'bg-indigo-100'}`}>Day</button>
                    <button onClick={() => setView(ViewMode.Week)} className={`btn-secondary-sm ${view === ViewMode.Week && 'bg-indigo-100'}`}>Week</button>
                    <button onClick={() => setView(ViewMode.Month)} className={`btn-secondary-sm ${view === ViewMode.Month && 'bg-indigo-100'}`}>Month</button>
                </div>
            </div>

            {/* Horizontal scrollbar wrapper for wide content */}
            <div className="w-full border rounded-md overflow-x-auto">
                {/* Ensure a minimum width for the chart area */}
                <div className="min-w-[800px]">
                    {tasks.length > 0 ? (
                        <Gantt
                            tasks={tasks}
                            viewMode={view}
                            onClick={(task) => onTaskClick(task.original_task)}
                            listCellWidth="" // Hides the side list
                            ganttHeight={400}
                            columnWidth={columnWidth} // Use the dynamic column width
                            // 2. UPDATE the headerHeight to make space for two lines
                            headerHeight={65}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-[400px] text-gray-500">
                            No tasks with valid dates to display in timeline.
                </div>
                    )}
                </div>
            </div>
        </div>
    );
}