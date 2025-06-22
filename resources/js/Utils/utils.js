// Utility functions for task management

/**
 * Determines if a task is completed based on task type and completion criteria
 * @param {Object} task - The task object to check
 * @returns {boolean} - True if the task is completed, false otherwise
 */
export function isTaskCompleted(task) {
    if (!task) return false;

    // A Paper Writing Task is complete if its progress is 'Completed' or 'Published'.
    if (task.paper_writing_task?.progress === 'Completed' || task.paper_writing_task?.progress === 'Published') {
        return true;
    }

    // A Normal Task is complete if its `completed_at` timestamp is not null.
    if (task.completed_at) {
        return true;
    }

    return false;
} 