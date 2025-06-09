import React, { useState, useEffect, useMemo } from 'react';
import { Link, router, useForm } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import BoardColumn from '@/Components/ProjectHub/BoardColumn';
import CalendarView from '@/Components/ProjectHub/CalendarView';
import ListView from '@/Components/ProjectHub/ListView';
import TableView from '@/Components/ProjectHub/TableView';
import TimelineView from '@/Components/ProjectHub/TimelineView';
import { DndContext, DragOverlay, closestCorners, useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core';
import TaskCard from '@/Components/ProjectHub/TaskCard';
import TaskDetailsModal from '@/Components/ProjectHub/TaskDetailsModal';
import ConfirmationModal from '@/Components/ConfirmationModal';
import { ChevronLeft, Plus, Kanban, Calendar, X, List, Table, BarChartHorizontal } from 'lucide-react';

export default function Show({ initialBoardData, workspace }) {
    // Initialize board state from props
    const [boardState, setBoardState] = useState(initialBoardData);
    // Track the active dragging task
    const [activeTask, setActiveTask] = useState(null);
    // State to track real-time updates for animation purposes
    const [recentlyUpdatedTaskId, setRecentlyUpdatedTaskId] = useState(null);
    // State to track the current view (board or calendar)
    const [currentView, setCurrentView] = useState('board');
    // State to track loading state
    const [isLoading, setIsLoading] = useState(false);
    // State to track if we're creating a new list
    const [isCreatingList, setIsCreatingList] = useState(false);
    // State for deletion confirmation modals
    const [confirmingListDeletion, setConfirmingListDeletion] = useState(null);
    const [confirmingTaskDeletion, setConfirmingTaskDeletion] = useState(null);
    // State for task details modal
    const [viewingTask, setViewingTask] = useState(null);
    
    // Form for creating a new list
    const form = useForm({
        name: '',
    });

    // Load board data into state when props change
    useEffect(() => {
        if (initialBoardData) {
            setBoardState(initialBoardData);
        }
    }, [initialBoardData]);

    // Set up real-time listening for task moves
    useEffect(() => {
        // Only set up the listener if we have a board
        if (!boardState || !boardState.id) {
            return;
        }

        console.log(`Subscribing to board channel: boards.${boardState.id}`);
        
        // Subscribe to the private channel for this board
        const channel = window.Echo.private(`boards.${boardState.id}`);
        
        // Listen for task.moved events
        channel.listen('.task.moved', (event) => {
            console.log('Received task.moved event:', event);
            
            // Extract task data from the event
            const { task, user, timestamp } = event;
            
            // Set the recently updated task for animation purposes
            setRecentlyUpdatedTaskId(task.id);
            
            // Clear the animation highlight after 2 seconds
            setTimeout(() => {
                setRecentlyUpdatedTaskId(null);
            }, 2000);
            
            // Update our local board state to reflect the change
            updateBoardStateFromEvent(task);
        });
        
        // Clean up the listener when the component unmounts or the board changes
        return () => {
            console.log(`Unsubscribing from board channel: boards.${boardState.id}`);
            channel.stopListening('.task.moved');
            window.Echo.leave(`boards.${boardState.id}`);
        };
    }, [boardState?.id]); // Only re-run if the board ID changes

    // Get all tasks from all lists for the calendar view
    const allTasks = useMemo(() => {
        if (!boardState || !boardState.lists) return [];
        
        // Flatten all tasks from all lists into a single array
        return boardState.lists.flatMap(list => 
            list.tasks.map(task => ({
                ...task,
                list_id: list.id,
                list_name: list.name
            }))
        );
    }, [boardState]);

    // Function to update the board state when receiving a real-time update
    const updateBoardStateFromEvent = (updatedTask) => {
        // Clone the current board state
        const newBoardState = structuredClone(boardState);
        
        // Find the task in its old position
        let sourceListIndex = -1;
        let taskIndex = -1;
        
        // Search through all lists to find the task
        for (let i = 0; i < newBoardState.lists.length; i++) {
            const index = newBoardState.lists[i].tasks.findIndex(t => t.id === updatedTask.id);
            if (index !== -1) {
                sourceListIndex = i;
                taskIndex = index;
                break;
            }
        }
        
        // If we found the task, remove it from its current list
        if (sourceListIndex !== -1 && taskIndex !== -1) {
            // Remove the task from its current position
            newBoardState.lists[sourceListIndex].tasks.splice(taskIndex, 1);
            
            // Find the destination list
            const destListIndex = newBoardState.lists.findIndex(list => list.id === updatedTask.list_id);
            
            // If we found the destination list, add the task
            if (destListIndex !== -1) {
                // Create a copy of the task with all the updated properties
                const taskToAdd = {
                    ...updatedTask,
                    // Make sure the task has the proper list_id reference
                    list_id: updatedTask.list_id
                };
                
                // Insert the task at the correct position based on its order
                // If the list has tasks, find the right position
                if (newBoardState.lists[destListIndex].tasks.length > 0) {
                    let inserted = false;
                    for (let i = 0; i < newBoardState.lists[destListIndex].tasks.length; i++) {
                        if (newBoardState.lists[destListIndex].tasks[i].order > updatedTask.order) {
                            newBoardState.lists[destListIndex].tasks.splice(i, 0, taskToAdd);
                            inserted = true;
                            break;
                        }
                    }
                    
                    // If we didn't insert it yet, add it to the end
                    if (!inserted) {
                        newBoardState.lists[destListIndex].tasks.push(taskToAdd);
                    }
                } else {
                    // If the list is empty, just add the task
                    newBoardState.lists[destListIndex].tasks.push(taskToAdd);
                }
                
                // Update the board state
                setBoardState(newBoardState);
            }
        }
    };

    // Set up drag sensors for mouse and touch
    const sensors = useSensors(
        useSensor(MouseSensor, {
            // Require the mouse to move by 10px before activating
            activationConstraint: {
                distance: 10,
            },
        }),
        useSensor(TouchSensor, {
            // Press delay to differentiate from scroll
            activationConstraint: {
                delay: 250,
                tolerance: 5,
            },
        })
    );

    // Handle drag start event
    const handleDragStart = (event) => {
        const { active } = event;
        
        // Extract task ID from the active draggable item
        const taskId = active.id;
        
        // If it's a task, find and set the active task
        if (taskId && taskId.toString().startsWith('task-')) {
            const listId = active.data.current.task.list_id;
            const taskIdNumber = parseInt(taskId.replace('task-', ''));
            
            // Find the task in the board state
            const list = boardState.lists.find(list => list.id === listId);
            if (list) {
                const task = list.tasks.find(task => task.id === taskIdNumber);
                if (task) {
                    setActiveTask(task);
                }
            }
        }
    };

    // Handle drag end event
    const handleDragEnd = (event) => {
        const { active, over } = event;
        
        // Clear the active task
        setActiveTask(null);
        
        // If not dropped in a droppable area, do nothing
        if (!over) {
            return;
        }
        
        // Extract IDs from the event
        const activeId = active.id;
        const overId = over.id;
        
        // Only proceed if it's a task being dragged
        if (!activeId.toString().startsWith('task-')) {
            return;
        }
        
        // Get the list ID from over data (where the task was dropped)
        const overListId = parseInt(overId.replace('list-', ''));
        // Get the task ID
        const taskId = parseInt(activeId.replace('task-', ''));
        
        // Find the source list (where the task came from)
        const sourceList = boardState.lists.find(list => 
            list.tasks.some(task => task.id === taskId)
        );
        
        // Find the destination list
        const destinationList = boardState.lists.find(list => list.id === overListId);
        
        // If the source or destination list is not found, do nothing
        if (!sourceList || !destinationList) {
            return;
        }
        
        // Clone the current state to avoid direct mutation
        const newBoardState = structuredClone(boardState);
        
        // Find the task in the source list
        const sourceListIndex = newBoardState.lists.findIndex(list => list.id === sourceList.id);
        const taskIndex = newBoardState.lists[sourceListIndex].tasks.findIndex(task => task.id === taskId);
        const taskToMove = newBoardState.lists[sourceListIndex].tasks[taskIndex];
        
        // Remove the task from the source list
        newBoardState.lists[sourceListIndex].tasks.splice(taskIndex, 1);
        
        // Add the task to the destination list
        const destinationListIndex = newBoardState.lists.findIndex(list => list.id === destinationList.id);
        
        // Update the task's list_id property
        taskToMove.list_id = destinationList.id;
        
        // Add the task to the end of the destination list
        newBoardState.lists[destinationListIndex].tasks.push(taskToMove);
        
        // Calculate the new order (position) for the task
        const newOrder = newBoardState.lists[destinationListIndex].tasks.length - 1;
        
        // Update the local state immediately for a responsive UI
        setBoardState(newBoardState);
        
        // Set this task as recently updated for animation
        setRecentlyUpdatedTaskId(taskId);
        
        // Clear the animation highlight after 2 seconds
        setTimeout(() => {
            setRecentlyUpdatedTaskId(null);
        }, 2000);
        
        // Send the update to the server
        router.post(`/api/v1/tasks/${taskId}/move`, {
            new_list_id: destinationList.id,
            order: newOrder
        }, {
            preserveScroll: true,
            preserveState: true,
            // In case of error, revert back to the original state
            onError: () => {
                setBoardState(boardState);
                alert('An error occurred while moving the task. Please try again.');
            }
        });
    };

    // Handle list creation
    const handleCreateList = (e) => {
        e.preventDefault();
        
        if (!boardState || !boardState.id) {
            console.error("Board ID is missing, cannot create list.");
            return;
        }
        
        form.post(`/api/v1/boards/${boardState.id}/lists`, {
            onSuccess: () => {
                // Close the form and reset it
                setIsCreatingList(false);
                form.reset();
            },
            onError: (errors) => {
                console.error('Failed to create list:', errors);
            }
        });
    };
    
    // Handle delete list
    const handleDeleteList = (list) => {
        setConfirmingListDeletion(list);
    };
    
    // Confirm delete list
    const confirmDeleteList = () => {
        if (!confirmingListDeletion) return;
        
        router.delete(route('lists.destroy', confirmingListDeletion.id), {
            onSuccess: () => {
                setConfirmingListDeletion(null);
            },
        });
    };
    
    // Handle delete task
    const handleDeleteTask = (task) => {
        setConfirmingTaskDeletion(task);
    };
    
    // Confirm delete task
    const confirmDeleteTask = () => {
        if (!confirmingTaskDeletion) return;
        
        router.delete(route('tasks.destroy', confirmingTaskDeletion.id), {
            onSuccess: () => {
                setConfirmingTaskDeletion(null);
            },
        });
    };

    // Enhance the BoardColumn component with info about recently updated tasks and delete handlers
    const EnhancedBoardColumn = ({ list, tasks }) => {
        // Add a highlight property to recently updated tasks
        const enhancedTasks = tasks.map(task => ({
            ...task,
            isRecentlyUpdated: task.id === recentlyUpdatedTaskId
        }));
        
        return (
            <BoardColumn
                key={list.id}
                list={list}
                tasks={enhancedTasks}
                onDeleteList={() => handleDeleteList(list)}
                onDeleteTask={handleDeleteTask}
                onTaskClick={setViewingTask}
            />
        );
    };

    // Render the Board View
    const renderBoardView = () => (
        <div className="overflow-x-auto pb-4">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="flex min-h-[calc(100vh-200px)]">
                    {/* Render columns */}
                    {boardState.lists.map(list => (
                        <EnhancedBoardColumn
                            key={list.id}
                            list={list}
                            tasks={list.tasks || []}
                        />
                    ))}
                </div>

                {/* Drag overlay - shows the task being dragged */}
                <DragOverlay>
                    {activeTask ? <TaskCard task={activeTask} /> : null}
                </DragOverlay>
            </DndContext>
        </div>
    );

    // Render the Calendar View
    const renderCalendarView = () => (
        <CalendarView tasks={allTasks} />
    );
    
    // Render the List View
    const renderListView = () => (
        <ListView board={boardState} onTaskClick={setViewingTask} />
    );
    
    // Render the Table View
    const renderTableView = () => (
        <TableView board={boardState} onTaskClick={setViewingTask} />
    );
    
    // Render the Timeline View
    const renderTimelineView = () => (
        <TimelineView board={boardState} onTaskClick={setViewingTask} />
    );

    // If we're loading or don't have board data yet
    if (isLoading || !boardState) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading board...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-2 py-6">
            {/* Board header */}
            <div className="mb-6">
                <Link href={route('project-hub.workspaces.show', workspace.data.id)} className="flex items-center text-gray-500 hover:text-gray-700 mb-2">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    <span className="text-sm">Back to {workspace.data.name}</span>
                </Link>
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">{boardState.name}</h1>
                    
                    {/* View Switcher */}
                    <div className="flex bg-gray-100 rounded-md p-1">
                        <button
                            type="button"
                            onClick={() => setCurrentView('board')}
                            className={`
                                flex items-center px-3 py-1.5 rounded-md text-sm font-medium
                                ${currentView === 'board' 
                                    ? 'bg-white shadow text-indigo-600' 
                                    : 'text-gray-700 hover:text-gray-900'
                                }
                            `}
                        >
                            <Kanban className="w-4 h-4 mr-1.5" />
                            Board
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrentView('list')}
                            className={`
                                flex items-center px-3 py-1.5 rounded-md text-sm font-medium
                                ${currentView === 'list' 
                                    ? 'bg-white shadow text-indigo-600' 
                                    : 'text-gray-700 hover:text-gray-900'
                                }
                            `}
                        >
                            <List className="w-4 h-4 mr-1.5" />
                            List
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrentView('table')}
                            className={`
                                flex items-center px-3 py-1.5 rounded-md text-sm font-medium
                                ${currentView === 'table' 
                                    ? 'bg-white shadow text-indigo-600' 
                                    : 'text-gray-700 hover:text-gray-900'
                                }
                            `}
                        >
                            <Table className="w-4 h-4 mr-1.5" />
                            Table
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrentView('calendar')}
                            className={`
                                flex items-center px-3 py-1.5 rounded-md text-sm font-medium
                                ${currentView === 'calendar' 
                                    ? 'bg-white shadow text-indigo-600' 
                                    : 'text-gray-700 hover:text-gray-900'
                                }
                            `}
                        >
                            <Calendar className="w-4 h-4 mr-1.5" />
                            Calendar
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrentView('timeline')}
                            className={`
                                flex items-center px-3 py-1.5 rounded-md text-sm font-medium
                                ${currentView === 'timeline' 
                                    ? 'bg-white shadow text-indigo-600' 
                                    : 'text-gray-700 hover:text-gray-900'
                                }
                            `}
                        >
                            <BarChartHorizontal className="w-4 h-4 mr-1.5" />
                            Timeline
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Add List button (only show in Board view) */}
            {currentView === 'board' && (
                <div className="mb-6">
                    {isCreatingList ? (
                        <div className="bg-white shadow rounded-lg p-4">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-md font-medium text-gray-900">Create a new list</h3>
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setIsCreatingList(false);
                                        form.reset();
                                    }}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <form onSubmit={handleCreateList} className="space-y-3">
                                <div>
                                    <input
                                        type="text"
                                        value={form.data.name}
                                        onChange={e => form.setData('name', e.target.value)}
                                        className="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-sm"
                                        placeholder="List name"
                                        disabled={form.processing}
                                        autoFocus
                                    />
                                    {form.errors.name && <div className="text-red-500 text-xs mt-1">{form.errors.name}</div>}
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsCreatingList(false);
                                            form.reset();
                                        }}
                                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
                                        disabled={form.processing}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                                        disabled={form.processing || !form.data.name.trim()}
                                    >
                                        {form.processing ? 'Creating...' : 'Create List'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setIsCreatingList(true)}
                            className="inline-flex items-center px-4 py-2 bg-gray-100 border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                        >
                            <Plus className="w-4 h-4 mr-2" /> Add List
                        </button>
                    )}
                </div>
            )}
            
            {/* Board content */}
            <div className="bg-gray-50 rounded-lg p-4">
                {/* Conditional rendering based on the current view */}
                {currentView === 'board' && renderBoardView()}
                {currentView === 'list' && renderListView()}
                {currentView === 'table' && renderTableView()}
                {currentView === 'calendar' && renderCalendarView()}
                {currentView === 'timeline' && renderTimelineView()}
            </div>
            
            {/* Confirmation Modals */}
            <ConfirmationModal
                show={!!confirmingListDeletion}
                onClose={() => setConfirmingListDeletion(null)}
                onConfirm={confirmDeleteList}
                title="Delete List"
                message={confirmingListDeletion ? `Are you sure you want to delete the list "${confirmingListDeletion.name}"? This action cannot be undone and will delete all tasks within this list.` : ''}
            />
            
            <ConfirmationModal
                show={!!confirmingTaskDeletion}
                onClose={() => setConfirmingTaskDeletion(null)}
                onConfirm={confirmDeleteTask}
                title="Delete Task"
                message={confirmingTaskDeletion ? `Are you sure you want to delete the task "${confirmingTaskDeletion.title}"? This action cannot be undone.` : ''}
            />
            
            {/* Task Details Modal */}
            {viewingTask && (
                <TaskDetailsModal
                    task={viewingTask}
                    show={!!viewingTask}
                    onClose={() => setViewingTask(null)}
                    workspaceMembers={boardState.workspace.members}
                />
            )}
        </div>
    );
}

// Set the layout for this page
Show.layout = page => <MainLayout title="Board View" children={page} TopMenuOpen={false} />; 