import React, { useState, useEffect, useMemo } from 'react';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import GoogleCalendarTaskToast from '@/Components/GoogleCalendarTaskToast';
import { useTaskGoogleCalendar } from '@/Hooks/useTaskGoogleCalendar';
import axios from 'axios';
import BoardColumn from '@/Components/ProjectHub/BoardColumn';
import CalendarView from '@/Components/ProjectHub/CalendarView';
import ListView from '@/Components/ProjectHub/ListView';
import TableView from '@/Components/ProjectHub/TableView';
import TimelineView from '@/Components/ProjectHub/TimelineView';
import { DndContext, DragOverlay, closestCenter, useSensor, useSensors, MouseSensor, TouchSensor, PointerSensor } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import TaskCard from '@/Components/ProjectHub/TaskCard';
import TaskDetailsModal from '@/Components/ProjectHub/TaskDetailsModal';
import PaperTaskCreateModal from '@/Components/ProjectHub/PaperTaskCreateModal';
import ChooseTaskTypeModal from '@/Components/ProjectHub/ChooseTaskTypeModal';
import ConfirmationModal from '@/Components/ConfirmationModal';
import InlineEdit from '@/Components/ProjectHub/InlineEdit';
import { ChevronLeft, Plus, Kanban, Calendar, X, List, Table, BarChartHorizontal, Archive as ArchiveIcon } from 'lucide-react';
import ArchivedTasksModal from '@/Components/ProjectHub/ArchivedTasksModal';
import toast from 'react-hot-toast';

export default function Show({ initialBoardData, researchOptions = [] }) {
    // Initialize board state from props
    const [boardState, setBoardState] = useState(null);
    // Track the active dragging task
    const [activeTask, setActiveTask] = useState(null);
    // Track the active dragging list
    const [activeList, setActiveList] = useState(null);
    // State to track real-time updates for animation purposes
    const [recentlyUpdatedTaskId, setRecentlyUpdatedTaskId] = useState(null);
    // State to track the current view (board or calendar)
    const [currentView, setCurrentView] = useState('board');
    // State to track loading state
    const [isLoading, setIsLoading] = useState(true);
    // State to track if we're creating a new list
    const [isCreatingList, setIsCreatingList] = useState(false);
    // State for deletion confirmation modals
    const [confirmingListDeletion, setConfirmingListDeletion] = useState(null);
    const [confirmingTaskDeletion, setConfirmingTaskDeletion] = useState(null);
    // State for task details modal
    const [viewingTask, setViewingTask] = useState(null);
    // State for choose task type modal
    const [choosingTaskType, setChoosingTaskType] = useState(false);
    const [showArchiveModal, setShowArchiveModal] = useState(false);
    // State for paper task modal
    const [creatingPaperTask, setCreatingPaperTask] = useState(false);
    // State to track the current list ID for task creation
    const [currentListId, setCurrentListId] = useState(null);
    
    // Google Calendar integration
    const { props } = usePage();
    const { addTaskToCalendar } = useTaskGoogleCalendar();
    const [showGoogleCalendarToast, setShowGoogleCalendarToast] = useState(false);
    const [calendarPromptData, setCalendarPromptData] = useState(null);
    const [currentTaskForCalendar, setCurrentTaskForCalendar] = useState(null);

    // Handle board title renaming
    const handleBoardRename = async (newName) => {
        try {
            await router.put(route('project-hub.boards.update', boardState.id), {
                name: newName,
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Board renamed successfully.');
                },
                onError: (errors) => {
                    console.error('Error renaming board:', errors);
                    toast.error('Failed to rename board. Please try again.');
                }
            });
        } catch (error) {
            console.error('Error renaming board:', error);
            toast.error('Failed to rename board. Please try again.');
        }
    };

    // Form for creating a new list
    const form = useForm({
        name: '',
    });

    // Initialize board state from props
    useEffect(() => {
        // This effect runs when the component mounts or when initialBoardData changes
        if (initialBoardData) {
            // Ensure required properties exist with defaults
            const boardData = {
                ...initialBoardData,
                lists: initialBoardData.lists?.data || [],
                parent: initialBoardData.parent || {
                    id: null,
                    name: 'Unknown',
                    type: 'unknown',
                    members: []
                }
            };
            
            // Initialize the board state with the complete data
            setBoardState(boardData);
            
            // Turn off loading state since we have valid data
            setIsLoading(false);
        } else {
            // If no board data is provided, ensure loading state is true
            setIsLoading(true);
        }
    }, [initialBoardData]);
    
    // Check for Google Calendar prompt from flash data
    useEffect(() => {
        console.log('Flash data:', props?.flash);
        const flashPrompt = props?.flash?.google_calendar_prompt;
        const taskData = props?.flash?.task_for_calendar;
        
        console.log('Calendar prompt data:', flashPrompt);
        console.log('Task data:', taskData);
        
        if (flashPrompt?.show_prompt && taskData) {
            setCurrentTaskForCalendar(taskData);
            setCalendarPromptData(flashPrompt);
            setShowGoogleCalendarToast(true);
            console.log('Showing Google Calendar toast');
        }
    }, [props?.flash]);

    // console.log(initialBoardData);

    // Helper function to determine the correct back link details
    const getBackLinkDetails = () => {
        // Check if we have the parent data in the board state
        if (!boardState || !boardState.parent) {
            return { href: route('project-hub.index'), text: 'NexLab' };
        }

        // console.log(boardState);

        // Use the parent information from the board state
        const parent = boardState.parent;
        const parentType = parent.type; // 'Workspace' or 'Project'

        if (!parent.id) {
            return { href: route('project-hub.index'), text: 'NexLab' };
        }

        if (parentType.toLowerCase() === 'workspace') {
            return { 
                href: route('project-hub.workspaces.show', parent.id),
                text: parent.name || 'Workspace'
            };
        } else if (parentType.toLowerCase() === 'project') {
            return { 
                href: route('project-hub.projects.show', parent.id),
                text: parent.name || 'Project'
            };
        }

        // Default fallback
        return { href: route('project-hub.index'), text: 'NexLab' };
    };

    // Set up real-time listening for task moves and board updates
    useEffect(() => {
        // Only set up the listener if we have a board
        if (!boardState || !boardState.id) {
            return;
        }

        console.log(`Subscribing to board channel: boards.${boardState.id}`);

        // Subscribe to the private channel for this board
        const channel = window.Echo.private(`boards.${boardState.id}`);

        // TASK EVENTS
        channel.listen('.task.created', (event) => {
            console.log('task.created:', event);
            setBoardState(prev => {
                const newLists = prev.lists.map(list => 
                    list.id === event.task.list_id
                        ? { ...list, tasks: [...list.tasks, event.task] }
                        : list
                );
                return { ...prev, lists: newLists };
            });
        });

        channel.listen('.task.updated', (event) => {
            console.log('task.updated:', event);
            setBoardState(prev => {
                const newLists = prev.lists.map(list => ({
                    ...list,
                    tasks: list.tasks.map(task =>
                        task.id === event.task.id ? { ...task, ...event.task } : task
                    )
                }));
                return { ...prev, lists: newLists };
            });
        });

        channel.listen('.task.deleted', (event) => {
            console.log('task.deleted:', event);
            setBoardState(prev => {
                const newLists = prev.lists.map(list => 
                    list.id === event.list_id
                        ? { ...list, tasks: list.tasks.filter(task => task.id !== event.task_id) }
                        : list
                );
                return { ...prev, lists: newLists };
            });
        });

        channel.listen('.task.moved', (event) => {
            console.log('task.moved:', event);
            setRecentlyUpdatedTaskId(event.task.id);
            setTimeout(() => setRecentlyUpdatedTaskId(null), 2000);
            updateBoardStateFromEvent(event.task);
        });

        channel.listen('.task.assignees.changed', (event) => {
            console.log('task.assignees.changed:', event);
            setBoardState(prev => {
                const newLists = prev.lists.map(list => ({
                    ...list,
                    tasks: list.tasks.map(task =>
                        task.id === event.task_id
                            ? { ...task, assignees: event.assignees }
                            : task
                    )
                }));
                return { ...prev, lists: newLists };
            });
        });

        channel.listen('.task.completion.toggled', (event) => {
            console.log('task.completion.toggled:', event);
            setBoardState(prev => {
                const newLists = prev.lists.map(list => ({
                    ...list,
                    tasks: list.tasks.map(task =>
                        task.id === event.task_id
                            ? { ...task, is_completed: event.is_completed }
                            : task
                    )
                }));
                return { ...prev, lists: newLists };
            });
        });

        channel.listen('.task.archive.toggled', (event) => {
            console.log('task.archive.toggled:', event);
            setBoardState(prev => {
                const newLists = prev.lists.map(list => ({
                    ...list,
                    tasks: event.is_archived
                        ? list.tasks.filter(task => task.id !== event.task_id)
                        : list.tasks
                }));
                return { ...prev, lists: newLists };
            });
        });

        // BOARD LIST EVENTS
        channel.listen('.board-list.created', (event) => {
            console.log('board-list.created:', event);
            setBoardState(prev => ({
                ...prev,
                lists: [...prev.lists, { ...event.board_list, tasks: [] }]
            }));
        });

        channel.listen('.board-list.updated', (event) => {
            console.log('board-list.updated:', event);
            setBoardState(prev => {
                const newLists = prev.lists.map(list =>
                    list.id === event.board_list.id
                        ? { ...list, name: event.board_list.name }
                        : list
                );
                return { ...prev, lists: newLists };
            });
        });

        channel.listen('.board-list.deleted', (event) => {
            console.log('board-list.deleted:', event);
            setBoardState(prev => ({
                ...prev,
                lists: prev.lists.filter(list => list.id !== event.list_id)
            }));
        });

        channel.listen('.board-list.reordered', (event) => {
            console.log('board-list.reordered:', event);
            setBoardState(prev => {
                const newLists = [...prev.lists].sort((a, b) => {
                    const aOrder = event.lists.find(l => l.id === a.id)?.order || 0;
                    const bOrder = event.lists.find(l => l.id === b.id)?.order || 0;
                    return aOrder - bOrder;
                });
                return { ...prev, lists: newLists };
            });
        });

        // BOARD EVENTS
        channel.listen('.board.updated', (event) => {
            console.log('board.updated:', event);
            if (event.board.name !== boardState.name) {
                setBoardState(prev => ({ ...prev, name: event.board.name }));
            }
        });

        // Clean up the listener when the component unmounts or the board changes
        return () => {
            console.log(`Unsubscribing from board channel: boards.${boardState.id}`);
            channel.stopListening('.task.created');
            channel.stopListening('.task.updated');
            channel.stopListening('.task.deleted');
            channel.stopListening('.task.moved');
            channel.stopListening('.task.assignees.changed');
            channel.stopListening('.task.completion.toggled');
            channel.stopListening('.task.archive.toggled');
            channel.stopListening('.board.updated');
            channel.stopListening('.board-list.created');
            channel.stopListening('.board-list.updated');
            channel.stopListening('.board-list.deleted');
            channel.stopListening('.board-list.reordered');
            window.Echo.leave(`boards.${boardState.id}`);
        };
    }, [boardState?.id]); // Only re-run if the board ID changes

    // Get all tasks from all lists for the calendar view
    const allTasks = useMemo(() => {
        if (!boardState || !boardState.lists) return [];
        
        // Ensure lists is an array
        const lists = Array.isArray(boardState.lists) ? boardState.lists : [];
        
        // Flatten all tasks from all lists into a single array
        return lists.flatMap(list => {
            // Ensure tasks is an array
            const tasks = Array.isArray(list.tasks) ? list.tasks : [];
            return tasks.map(task => ({
                ...task,
                list_id: list.id,
                list_name: list.name
            }));
        });
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

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
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
        } else if (activeId && activeId.toString().startsWith('list-')) {
            // This is a list being dragged
            const listIdNumber = parseInt(activeId.replace('list-', ''));
            
            // Find the list in the board state
            const list = boardState.lists.find(list => list.id === listIdNumber);
            if (list) {
                // Set the active list with its tasks
                setActiveList({
                    ...list,
                    tasks: list.tasks || []
                });
            }
        }
    };

    // Handle drag end event (unified)
    const handleDragEnd = (event) => {
        const { active, over } = event;
        
        setActiveTask(null);
        setActiveList(null);
        
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;
        if (activeId === overId) return;

        const isActiveAList = active.data.current?.type === 'List' || activeId.toString().startsWith('list-');
        const isActiveATask = active.data.current?.type === 'Task' || activeId.toString().startsWith('task-');

        // Scenario 1: Reordering lists
        if (isActiveAList && (over.data.current?.type === 'List' || overId.toString().startsWith('list-'))) {
            setBoardState((prev) => {
                const oldIndex = prev.lists.findIndex((list) => `list-${list.id}` === activeId.toString());
                const newIndex = prev.lists.findIndex((list) => `list-${list.id}` === overId.toString());
                if (oldIndex === -1 || newIndex === -1) return prev;

                const reorderedLists = arrayMove(prev.lists, oldIndex, newIndex);

                const updatedListsForBackend = reorderedLists.map((list, index) => ({
                    id: list.id,
                    order: index,
                }));

                router.post(route('project-hub.lists.reorder'), { lists: updatedListsForBackend }, {
                    preserveScroll: true,
                    preserveState: true,
                });

                return { ...prev, lists: reorderedLists };
            });
            return;
        }

        // Scenario 2: Dragging a task
        if (isActiveATask) {
            const sourceListId = active.data.current?.task?.list_id;
            const destinationListId = (over.data.current?.type === 'List')
                ? over.data.current.list.id
                : (over.data.current?.type === 'Task' ? over.data.current.task.list_id : undefined);

            if (!sourceListId || !destinationListId) return;

            // 2A: Reorder tasks in the same list
            if (sourceListId === destinationListId) {
                const currentLists = boardState.lists;
                const listIndex = currentLists.findIndex(list => list.id === sourceListId);
                if (listIndex === -1) return;
                const oldTaskIndex = currentLists[listIndex].tasks.findIndex(task => `task-${task.id}` === activeId.toString());
                const newTaskIndex = currentLists[listIndex].tasks.findIndex(task => `task-${task.id}` === overId.toString());
                if (oldTaskIndex === -1 || newTaskIndex === -1) return;

                const reorderedTasks = arrayMove(currentLists[listIndex].tasks, oldTaskIndex, newTaskIndex);
                const newLists = [...currentLists];
                newLists[listIndex] = { ...newLists[listIndex], tasks: reorderedTasks };
                setBoardState(prev => ({ ...prev, lists: newLists }));

                const reorderedTaskIds = reorderedTasks.map(t => t.id);
                router.post(route('project-hub.tasks.reorder'), {
                    list_id: sourceListId,
                    task_ids: reorderedTaskIds,
                }, { preserveScroll: true, preserveState: true });
                return;
            }

            // 2B: Move tasks between lists
            if (sourceListId !== destinationListId) {
                const currentLists = boardState.lists;
                const sourceListIndex = currentLists.findIndex(list => list.id === sourceListId);
                const destinationListIndex = currentLists.findIndex(list => list.id === destinationListId);
                if (sourceListIndex === -1 || destinationListIndex === -1) return;

                const sourceTaskIndex = currentLists[sourceListIndex].tasks.findIndex(task => `task-${task.id}` === activeId.toString());
                if (sourceTaskIndex === -1) return;

                const newSourceTasks = [...currentLists[sourceListIndex].tasks];
                const [movedTask] = newSourceTasks.splice(sourceTaskIndex, 1);

                const newDestinationTasks = [...currentLists[destinationListIndex].tasks];
                const overTaskIndex = (over.data.current?.type === 'Task')
                    ? newDestinationTasks.findIndex(task => `task-${task.id}` === overId.toString())
                    : newDestinationTasks.length;
                const insertIndex = overTaskIndex === -1 ? newDestinationTasks.length : overTaskIndex;
                newDestinationTasks.splice(insertIndex, 0, movedTask);

                const finalDestinationTasks = newDestinationTasks;
                const newLists = [...currentLists];
                newLists[sourceListIndex] = { ...newLists[sourceListIndex], tasks: newSourceTasks };
                newLists[destinationListIndex] = { ...newLists[destinationListIndex], tasks: finalDestinationTasks };
                setBoardState(prev => ({ ...prev, lists: newLists }));

                const movedTaskId = parseInt(activeId.toString().replace('task-', ''));
                const newOrderInDestination = finalDestinationTasks.map(t => t.id);
                router.post(route('project-hub.tasks.move', movedTaskId), {
                    new_list_id: destinationListId,
                    order_in_new_list: newOrderInDestination,
                }, { preserveScroll: true, preserveState: true });
                return;
            }
        }
    };

    // Handle list creation
    const handleCreateList = (e) => {
        e.preventDefault();
        
        // Add debug logging
        // console.log('Current boardState:', boardState);
        
        // Check if we have valid board data
        if (!boardState) {
            console.error("Board state is missing");
            return;
        }
        
        // Get the board ID, ensuring it's a number
        const boardId = parseInt(boardState.id);
        if (!boardId || isNaN(boardId)) {
            console.error("Invalid board ID:", boardState.id);
            return;
        }
        
        // Create the list
        form.post(route('project-hub.boards.lists.store', boardId), {
            onSuccess: () => {
                // Close the form and reset it
                setIsCreatingList(false);
                form.reset();
                
                // Reload the board data to show the new list
                router.reload({ only: ['initialBoardData'] });
            },
            onError: (errors) => {
                console.error('Failed to create list:', errors);
                alert('Failed to create list. Please try again.');
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
        
        router.delete(route('project-hub.lists.destroy', confirmingListDeletion.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`List "${confirmingListDeletion.name}" deleted successfully.`);
                setConfirmingListDeletion(null);
                // Refresh the board data to reflect the deletion
                router.reload({ only: ['initialBoardData'] });
            },
            onError: (errors) => {
                console.error('Error deleting list:', errors);
                toast.error('Failed to delete list. Please try again.');
            }
        });
    };
    
    // Handle delete task
    const handleDeleteTask = (task) => {
        setConfirmingTaskDeletion(task);
    };
    
    // Confirm delete task
    const confirmDeleteTask = () => {
        if (!confirmingTaskDeletion) return;
        
        router.delete(route('project-hub.tasks.destroy', confirmingTaskDeletion.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`Task "${confirmingTaskDeletion.title}" deleted successfully.`);
                setConfirmingTaskDeletion(null);
                // Refresh the board data to reflect the deletion
                router.reload({ only: ['initialBoardData'] });
            },
            onError: (errors) => {
                console.error('Error deleting task:', errors);
                toast.error('Failed to delete task. Please try again.');
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
        
        // Check if this list is currently being dragged
        const isDragging = activeList?.id === list.id;
        
        return (
            <BoardColumn
                key={list.id}
                list={list}
                tasks={list.tasks || []}
                onDeleteList={() => handleDeleteList(list)}
                onDeleteTask={handleDeleteTask}
                onTaskClick={handleTaskClick}
                onAddTask={handleAddTask}
                className="board-column"
                isDragging={isDragging}
            />
        );
    };

    // Render the Board View
    const renderBoardView = () => {
        // Check if boardState exists
        if (!boardState) {
            return (
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Loading board data...</p>
                    </div>
                </div>
            );
        }

        // Ensure lists is an array
        const lists = Array.isArray(boardState.lists) ? boardState.lists : [];

        // Create an array of list IDs for the SortableContext
        const listIds = lists.map(list => `list-${list.id}`);
        
        return (
            <div className="board-container w-full overflow-hidden flex flex-col">
                {/* Mobile: Vertical scrolling container, Desktop: Horizontal scrolling */}
                <div className="board-scroll-container overflow-y-auto md:overflow-y-hidden md:overflow-x-auto">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
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
                                {lists.map(list => (
                                    <EnhancedBoardColumn
                                        key={list.id}
                                        list={list}
                                        tasks={Array.isArray(list.tasks?.data) ? list.tasks.data : []}
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

                        {/* Drag overlay - shows the task or list being dragged */}
                        <DragOverlay>
                            {activeTask ? (
                                <TaskCard task={activeTask} />
                            ) : activeList ? (
                                <BoardColumn
                                    list={activeList}
                                    tasks={Array.isArray(activeList.tasks?.data) ? activeList.tasks.data : []}
                                    className="opacity-90 shadow-xl scale-[1.02] board-column"
                                    isOverlay={true}
                                />
                            ) : null}
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
                    <InlineEdit
                        value={boardState.name}
                        onSave={handleBoardRename}
                        canEdit={boardState.can && boardState.can.update}
                        className="text-xl md:text-2xl font-bold text-gray-900"
                        placeholder="Board name"
                    />
                    
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
                            {/* <button
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
                            </button> */}
                        </div>
                    </div>
                    <button type="button" onClick={() => setShowArchiveModal(true)} className="ml-0 md:ml-3 inline-flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-md text-xs md:text-sm text-gray-700 hover:bg-gray-50">
                        <ArchiveIcon className="w-4 h-4 mr-2" /> Archived Items
                    </button>
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
            
            {/* Board content - Responsive height with flexible container for inner scrollables */}
            <div className="bg-gray-50 rounded-lg p-2 md:p-4 h-[calc(100vh-12rem)] md:h-auto md:min-h-[35rem] flex flex-col">
                {/* Conditional rendering based on the current view */}
                {currentView === 'board' && renderBoardView()}
                {currentView === 'list' && renderListView()}
                {currentView === 'table' && renderTableView()}
                {currentView === 'calendar' && renderCalendarView()}
                {/* {currentView === 'timeline' && renderTimelineView()} */}
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
                workspaceMembers={boardState?.parent?.members || []}
                researchOptions={researchOptions}
            />
            
            {/* Paper Task Modal (for creating or editing paper tasks) */}
            <PaperTaskCreateModal
                task={viewingTask}
                show={creatingPaperTask}
                onClose={handleClosePaperTask}
                listId={currentListId}
                workspaceMembers={boardState?.parent?.members || []}
                researchOptions={researchOptions}
            />
            
            {/* Choose Task Type Modal */}
            <ChooseTaskTypeModal
                show={choosingTaskType}
                onClose={() => setChoosingTaskType(false)}
                onSelectTaskType={handleTaskTypeSelect}
            />

            {/* Archived Tasks Modal */}
            <ArchivedTasksModal
                show={showArchiveModal}
                onClose={() => setShowArchiveModal(false)}
                boardId={boardState.id}
            />
            
            {/* Google Calendar Toast */}
            {showGoogleCalendarToast && currentTaskForCalendar && calendarPromptData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <GoogleCalendarTaskToast
                        task={currentTaskForCalendar}
                        promptData={calendarPromptData}
                        onYes={async () => {
                            const result = await addTaskToCalendar(currentTaskForCalendar.id);
                            if (result.success) {
                                setCurrentTaskForCalendar(result.task);
                            }
                            setShowGoogleCalendarToast(false);
                        }}
                        onNo={() => {
                            setShowGoogleCalendarToast(false);
                        }}
                        visible={showGoogleCalendarToast}
                    />
                </div>
            )}
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
            width: calc(68rem);
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
    
    /* --- ADD THESE NEW RULES --- */
    /* This rule controls the TimelineView container layout */
    .timeline-view-container {
        height: 100%;
        display: flex;
        flex-direction: column;
        width: 50%;
    }

    /* This rule formats the Gantt chart date labels into two lines */
    .gantt-task-react__header-text {
        white-space: normal !important;
        line-height: 1.2 !important;
        text-align: center !important;
        font-size: 11px !important;
    }
    
    /* List View mobile optimization */
    .list-view-container {
        max-height: calc(100vh - 200px);
        overflow-y: auto;
    }
    
    /* Table View mobile optimization */
    .table-view-container {
        md:max-height: calc(100vh - 160px);
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