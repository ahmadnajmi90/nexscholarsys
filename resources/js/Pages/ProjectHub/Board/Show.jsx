import React, { useState, useEffect, useMemo } from 'react';
import { Link, router, useForm } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import BoardColumn from '@/Components/ProjectHub/BoardColumn';
import CalendarView from '@/Components/ProjectHub/CalendarView';
import ListView from '@/Components/ProjectHub/ListView';
import TableView from '@/Components/ProjectHub/TableView';
import TimelineView from '@/Components/ProjectHub/TimelineView';
import { DndContext, DragOverlay, closestCorners, useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import TaskCard from '@/Components/ProjectHub/TaskCard';
import TaskDetailsModal from '@/Components/ProjectHub/TaskDetailsModal';
import PaperTaskCreateModal from '@/Components/ProjectHub/PaperTaskCreateModal';
import ChooseTaskTypeModal from '@/Components/ProjectHub/ChooseTaskTypeModal';
import ConfirmationModal from '@/Components/ConfirmationModal';
import { ChevronLeft, Plus, Kanban, Calendar, X, List, Table, BarChartHorizontal } from 'lucide-react';
import axios from 'axios';

export default function Show({ initialBoardData, parentEntity, parentType, researchOptions = [] }) {
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
    // State for choose task type modal
    const [choosingTaskType, setChoosingTaskType] = useState(false);
    // State for paper task modal
    const [creatingPaperTask, setCreatingPaperTask] = useState(false);
    // State to track the current list ID for task creation
    const [currentListId, setCurrentListId] = useState(null);
    
    // Form for creating a new list
    const form = useForm({
        name: '',
    });

    // Helper function to determine the correct back link details
    const getBackLinkDetails = () => {
        // Check if we have the parent data in the board state
        if (!boardState || !boardState.parent) {
            return { href: route('project-hub.index'), text: 'ScholarLab' };
        }

        // Use the parent information from the board state
        const parent = boardState.parent;
        const parentType = parent.type; // 'Workspace' or 'Project'

        if (!parent.id) {
            return { href: route('project-hub.index'), text: 'ScholarLab' };
        }

        if (parentType === 'Workspace') {
            return { 
                href: route('project-hub.workspaces.show', parent.id),
                text: parent.name || 'Workspace'
            };
        } else if (parentType === 'Project') {
            return { 
                href: route('project-hub.projects.show', parent.id),
                text: parent.name || 'Project'
            };
        }

        // Default fallback
        return { href: route('project-hub.index'), text: 'ScholarLab' };
    };

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

    // Set up sensors for both mouse and touch (important for mobile drag & drop)
    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 200,
                tolerance: 8,
            },
        })
    );

    // Handle drag start event
    const handleDragStart = (event) => {
        const { active } = event;
        
        // Extract ID from the active draggable item
        const activeId = active.id;
        
        // Check if it's a task or a list
        if (activeId && activeId.toString().startsWith('task-')) {
            const listId = active.data.current.task.list_id;
            const taskIdNumber = parseInt(activeId.replace('task-', ''));
            
            // Find the task in the board state
            const list = boardState.lists.find(list => list.id === listId);
            if (list) {
                const task = list.tasks.find(task => task.id === taskIdNumber);
                if (task) {
                    setActiveTask(task);
                }
            }
        }
        // No need to set active list, as we'll just show the overlay for tasks
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
        
        // Check if we're dealing with a task or a list
        if (activeId.toString().startsWith('task-')) {
            // This is a task being dragged
        
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
            axios.post(`/api/v1/tasks/${taskId}/move`, {
            new_list_id: destinationList.id,
            order: newOrder
        }, {
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            })
            .then(response => {
                if (response.data.success) {
                    // Successfully moved the task
                } else {
                    // Handle error
                    setBoardState(boardState);
                    alert('An error occurred while moving the task. Please try again.');
                }
            })
            .catch(error => {
                // Handle error
                setBoardState(boardState);
                alert('An error occurred while moving the task. Please try again.');
            });
        } else if (activeId.toString().startsWith('list-')) {
            // This is a list being reordered
            
            // Extract list IDs
            const activeListId = parseInt(activeId.replace('list-', ''));
            const overListId = parseInt(overId.replace('list-', ''));
            
            // Find the indices of the active and over lists
            const activeListIndex = boardState.lists.findIndex(list => list.id === activeListId);
            const overListIndex = boardState.lists.findIndex(list => list.id === overListId);
            
            // If either list is not found, do nothing
            if (activeListIndex === -1 || overListIndex === -1) {
                return;
            }
            
            // If the lists are the same, do nothing
            if (activeListIndex === overListIndex) {
                return;
            }
            
            // Create a new board state with the reordered lists
            const newBoardState = structuredClone(boardState);
            newBoardState.lists = arrayMove(newBoardState.lists, activeListIndex, overListIndex);
            
            // Update the local state immediately for a responsive UI
            setBoardState(newBoardState);
            
            // Prepare data for the API call
            const updatedLists = newBoardState.lists.map((list, index) => ({
                id: list.id,
                order: index + 1 // Order starts at 1
            }));
            
            // Use axios for this specific API call instead of Inertia
            axios.post('/api/v1/lists/update-order', {
                lists: updatedLists
            }, {
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            })
            .catch(error => {
                console.error('Error updating list order:', error);
                // Revert back to the original state on error
                setBoardState(boardState);
                alert('An error occurred while reordering the lists. Please try again.');
            });
        }
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
        
        axios.delete(route('lists.destroy', confirmingListDeletion.id), {
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            }
        })
        .then(response => {
            if (response.data.success) {
                setConfirmingListDeletion(null);
            } else {
                // Handle error
                alert('An error occurred while deleting the list. Please try again.');
            }
        })
        .catch(error => {
            // Handle error
            alert('An error occurred while deleting the list. Please try again.');
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
            preserveScroll: true,
            onSuccess: () => {
                setConfirmingTaskDeletion(null);
                // Refresh the board data to reflect the deletion
                router.reload({ only: ['initialBoardData'] });
            },
            onError: (errors) => {
                console.error('Error deleting task:', errors);
                alert('An error occurred while deleting the task. Please try again.');
            }
        });
    };

    // Handle task click - determine which modal to show
    const handleTaskClick = (task) => {
        // Check if it's a paper task
        if (task.paperWritingTask) {
            // Open the paper task modal in edit mode
            setViewingTask(task);
            setCreatingPaperTask(true);
        } else {
            // Open the normal task modal
            setViewingTask(task);
        }
    };

    // Handle add task button click
    const handleAddTask = (listId) => {
        console.log("handleAddTask called with listId:", listId);
        setCurrentListId(listId);
        setChoosingTaskType(true);
    };

    // Handle task type selection
    const handleTaskTypeSelect = (taskType) => {
        console.log("handleTaskTypeSelect called with taskType:", taskType);
        console.log("currentListId when selecting task type:", currentListId);
        setChoosingTaskType(false);
        
        if (taskType === 'paper') {
            // Open paper task creation modal
            setCreatingPaperTask(true);
        } else {
            // Open normal task creation modal
            setViewingTask(null); // Ensure we're creating a new task, not editing
            
            // Show the TaskDetailsModal for normal task creation
            // We need to create a temporary task object with the list_id to pass to the modal
            const tempTask = {
                board_list_id: currentListId,
                title: '',
                description: '',
                due_date: '',
                priority: 'Medium',
                assignees: [],
                task_type: 'normal', // Explicitly set task_type to 'normal'
            };
            console.log("Creating temporary task with board_list_id:", currentListId);
            setViewingTask(tempTask);
        }
    };

    // Handle closing the paper task modal
    const handleClosePaperTask = () => {
        setCreatingPaperTask(false);
        setViewingTask(null);
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
                onTaskClick={handleTaskClick}
                onAddTask={handleAddTask}
                className="board-column"
            />
        );
    };

    // Render the Board View
    const renderBoardView = () => {
        // Create an array of list IDs for the SortableContext
        const listIds = boardState.lists.map(list => `list-${list.id}`);
        
        return (
            <div className="board-container w-full overflow-hidden flex flex-col">
                {/* Mobile: Vertical scrolling container, Desktop: Horizontal scrolling */}
                <div className="board-scroll-container overflow-y-auto md:overflow-y-hidden md:overflow-x-auto">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCorners}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    >
                        {/* Mobile: Vertical stack, Desktop: Horizontal row */}
                        <div className="board-lists-container flex flex-col gap-4 md:flex-row md:flex-nowrap md:gap-4 pb-4 md:pr-4 lg:w-full w-[24.5rem]">
                            <SortableContext 
                                items={listIds} 
                                strategy={verticalListSortingStrategy} // Mobile: vertical strategy
                                // strategy will be overridden for desktop in CSS
                            >
                                {/* Render columns */}
                                {boardState.lists.map(list => (
                                    <EnhancedBoardColumn
                                        key={list.id}
                                        list={list}
                                        tasks={list.tasks || []}
                                    />
                                ))}
                            </SortableContext>
                            
                            {/* Add List button/form at the end */}
                            {isCreatingList ? (
                                <div className="w-full md:w-64 md:flex-shrink-0 bg-white shadow rounded-lg p-4">
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
                                    className="w-full md:w-64 md:flex-shrink-0 h-16 flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                                >
                                    <Plus className="w-5 h-5 mr-2" /> Add List
                                </button>
                            )}
                        </div>

                        {/* Drag overlay - shows the task being dragged */}
                        <DragOverlay>
                            {activeTask ? <TaskCard task={activeTask} /> : null}
                        </DragOverlay>
                    </DndContext>
                </div>
            </div>
        );
    };

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
    const renderTimelineView = () => {
        // Debug: Log all tasks passed as props to TimelineView
        console.log("1. All tasks passed as props to TimelineView:", allTasks);
        console.log("1b. Board state passed to TimelineView:", boardState);
        
        return <TimelineView board={boardState} onTaskClick={setViewingTask} />;
    };

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
        <div className="w-[26rem] lg:w-full md:max-w-full lg:mx-auto mx-1 px-1 md:px-4 py-4 md:py-6 overflow-x-hidden lg:mt-2 mt-6">
            {/* Board header */}
            <div className="mb-4 md:mb-6">
                {/* Back link */}
                {(() => {
                    const backLink = getBackLinkDetails();
                    return (
                        <Link 
                            href={backLink.href}
                            className="flex items-center text-gray-500 hover:text-gray-700 mb-2"
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            <span className="text-sm">Back to {backLink.text}</span>
                        </Link>
                    );
                })()}
                
                {/* Title and View Switcher */}
                <div className="flex flex-col space-y-3 md:flex-row md:justify-between md:items-center md:space-y-0">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900">{boardState.name}</h1>
                    
                    {/* Mobile-Responsive View Switcher */}
                    <div className="bg-gray-100 rounded-md p-1 overflow-x-auto">
                        <div className="flex space-x-1 min-w-max">
                            <button
                                type="button"
                                onClick={() => setCurrentView('board')}
                                className={`
                                    flex items-center px-2 md:px-3 py-1.5 rounded-md text-xs md:text-sm font-medium whitespace-nowrap
                                    ${currentView === 'board' 
                                        ? 'bg-white shadow text-indigo-600' 
                                        : 'text-gray-700 hover:text-gray-900'
                                    }
                                `}
                            >
                                <Kanban className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-1.5" />
                                Board
                            </button>
                            <button
                                type="button"
                                onClick={() => setCurrentView('list')}
                                className={`
                                    flex items-center px-2 md:px-3 py-1.5 rounded-md text-xs md:text-sm font-medium whitespace-nowrap
                                    ${currentView === 'list' 
                                        ? 'bg-white shadow text-indigo-600' 
                                        : 'text-gray-700 hover:text-gray-900'
                                    }
                                `}
                            >
                                <List className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-1.5" />
                                List
                            </button>
                            <button
                                type="button"
                                onClick={() => setCurrentView('table')}
                                className={`
                                    flex items-center px-2 md:px-3 py-1.5 rounded-md text-xs md:text-sm font-medium whitespace-nowrap
                                    ${currentView === 'table' 
                                        ? 'bg-white shadow text-indigo-600' 
                                        : 'text-gray-700 hover:text-gray-900'
                                    }
                                `}
                            >
                                <Table className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-1.5" />
                                Table
                            </button>
                            <button
                                type="button"
                                onClick={() => setCurrentView('calendar')}
                                className={`
                                    flex items-center px-2 md:px-3 py-1.5 rounded-md text-xs md:text-sm font-medium whitespace-nowrap
                                    ${currentView === 'calendar' 
                                        ? 'bg-white shadow text-indigo-600' 
                                        : 'text-gray-700 hover:text-gray-900'
                                    }
                                `}
                            >
                                <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-1.5" />
                                Calendar
                            </button>
                            <button
                                type="button"
                                onClick={() => setCurrentView('timeline')}
                                className={`
                                    flex items-center px-2 md:px-3 py-1.5 rounded-md text-xs md:text-sm font-medium whitespace-nowrap
                                    ${currentView === 'timeline' 
                                        ? 'bg-white shadow text-indigo-600' 
                                        : 'text-gray-700 hover:text-gray-900'
                                    }
                                `}
                            >
                                <BarChartHorizontal className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-1.5" />
                                Timeline
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Add List button (only show in Board view) - Mobile positioned above content */}
            {currentView === 'board' && !isCreatingList && (
                <div className="mb-4">
                    <button
                        type="button"
                        onClick={() => setIsCreatingList(true)}
                        className="inline-flex items-center px-3 md:px-4 py-2 bg-gray-100 border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                    >
                        <Plus className="w-4 h-4 mr-2" /> Add List
                    </button>
                </div>
            )}
            
            {/* Board content - Responsive height */}
            <div className="bg-gray-50 rounded-lg p-2 md:p-4 min-h-[calc(100vh-12rem)] md:h-[35.2rem] overflow-hidden">
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
            
            {/* Task Details Modal (for normal tasks) */}
            <TaskDetailsModal
                task={viewingTask}
                show={!!viewingTask && !creatingPaperTask}
                onClose={() => setViewingTask(null)}
                workspaceMembers={boardState.parent?.members || []}
                researchOptions={researchOptions}
            />
            
            {/* Paper Task Modal (for creating or editing paper tasks) */}
            <PaperTaskCreateModal
                task={viewingTask}
                show={creatingPaperTask}
                onClose={handleClosePaperTask}
                listId={currentListId}
                workspaceMembers={boardState.parent.members}
                researchOptions={researchOptions}
            />
            
            {/* Choose Task Type Modal */}
            <ChooseTaskTypeModal
                show={choosingTaskType}
                onClose={() => setChoosingTaskType(false)}
                onSelectTaskType={handleTaskTypeSelect}
            />
        </div>
    );
}

// Updated CSS for mobile-responsive behavior
const style = document.createElement('style');
style.textContent = `
    .board-container {
        height: 100%;
        min-height: 0;
    }
    
    /* Mobile: Vertical scrolling, Desktop: Horizontal scrolling */
    .board-scroll-container {
        flex: 1;
        min-height: 0;
    }
    
    /* Mobile: Full height for vertical scroll, Desktop: Horizontal scroll */
    @media (max-width: 768px) {
        .board-scroll-container {
            overflow-y: auto;
            overflow-x: hidden;
            max-height: calc(100vh - 16rem);
        }
        
        .board-lists-container {
            flex-direction: column !important;
        }
        
        /* Mobile board columns take full width */
        .board-column {
            width: 100% !important;
            flex-shrink: 0;
            margin: 0 !important;
        }
    }
    
    /* Desktop behavior */
    @media (min-width: 769px) {
        .board-scroll-container {
            overflow-y: hidden;
            overflow-x: auto;
            width: calc(70rem + 2rem);
            max-width: 100%;
        }
        
        .board-lists-container {
            min-height: 100%;
        }
        
        /* Desktop columns have fixed width */
        .board-column {
            width: 16rem;
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
            max-height: 32rem;
        }
    }
    
    /* Task list scrolling */
    .board-column-tasks {
        overflow-y: auto;
        flex-grow: 1;
        padding-right: 0.5rem;
        margin-right: -0.5rem;
    }
    
    /* Scrollbar styling */
    .board-column-tasks::-webkit-scrollbar,
    .list-view-container::-webkit-scrollbar,
    .table-view-container::-webkit-scrollbar {
        width: 6px;
    }
    
    .board-column-tasks::-webkit-scrollbar-track,
    .list-view-container::-webkit-scrollbar-track,
    .table-view-container::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 3px;
    }
    
    .board-column-tasks::-webkit-scrollbar-thumb,
    .list-view-container::-webkit-scrollbar-thumb,
    .table-view-container::-webkit-scrollbar-thumb {
        background: #d1d5db;
        border-radius: 3px;
    }
    
    .board-column-tasks::-webkit-scrollbar-thumb:hover,
    .list-view-container::-webkit-scrollbar-thumb:hover,
    .table-view-container::-webkit-scrollbar-thumb:hover {
        background: #9ca3af;
    }
    
    /* List View mobile optimization */
    .list-view-container {
        max-height: calc(100vh - 240px);
        overflow-y: auto;
    }
    
    /* Table View mobile optimization */
    .table-view-container {
        max-height: calc(100vh - 320px);
        overflow-y: auto;
    }
    
    /* Mobile responsive adjustments */
    @media (max-width: 1280px) {
        .board-scroll-container {
            width: calc(60rem + 1.5rem);
        }
    }
    
    @media (max-width: 1024px) {
        .board-scroll-container {
            width: calc(40rem + 1rem);
        }
    }
`;
document.head.appendChild(style);

// Set the layout for this page
Show.layout = page => <MainLayout title="Board View" children={page} TopMenuOpen={false} />; 