import React, { useState, useEffect } from 'react';
import { Link, useForm, router, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import ConfirmationModal from '@/Components/ConfirmationModal';
import ManageCollaboratorsModal from '@/Components/ProjectHub/ManageCollaboratorsModal';
import ManageBoardMembersModal from '@/Components/ProjectHub/ManageBoardMembersModal';
import InlineEdit from '@/Components/ProjectHub/InlineEdit';
import { ChevronLeft, Plus, LayoutGrid, Trash2, UserPlus, ChevronDown, ChevronUp, Users } from 'lucide-react';
import DOMPurify from 'dompurify';
import toast from 'react-hot-toast';

export default function Show({ project, connections }) {
    const { auth } = usePage().props;
    const [isCreatingBoard, setIsCreatingBoard] = useState(false);
    const [confirmingBoardDeletion, setConfirmingBoardDeletion] = useState(null);
    const [isCollaboratorsModalOpen, setIsCollaboratorsModalOpen] = useState(false);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [managingBoard, setManagingBoard] = useState(null);
    
    // Form for creating a new board
    const form = useForm({
        name: '',
    });

    // Handle board creation
    const handleCreateBoard = (e) => {
        e.preventDefault();
        
        // Make sure project data exists
        if (!project || !project.data || !project.data.id) {
            console.error("Project ID is missing, cannot create board.");
            return;
        }
        
        // Post to the boards endpoint for this project using the named route
        form.post(route('project-hub.projects.boards.store', project.data.id), {
            onSuccess: () => {
                toast.success(`Board "${form.data.name}" created successfully.`);
                // Close the form
                setIsCreatingBoard(false);
                // Reset the form
                form.reset();
            },
            onError: (errors) => {
                console.error('Error creating board:', errors);
                toast.error('Failed to create board. Please check the form for errors.');
            },
        });
    };
    
    // Handle delete board
    const handleDeleteBoard = (e, board) => {
        e.preventDefault();
        e.stopPropagation();
        setConfirmingBoardDeletion(board);
    };

    // Confirm delete board
    const confirmDeleteBoard = () => {
        if (!confirmingBoardDeletion) return;
        
        router.delete(route('project-hub.boards.destroy', confirmingBoardDeletion.id), {
            onSuccess: () => {
                toast.success(`Board "${confirmingBoardDeletion.name}" deleted successfully.`);
                setConfirmingBoardDeletion(null);
            },
            onError: (errors) => {
                console.error('Error deleting board:', errors);
                toast.error('Failed to delete board. Please try again.');
            },
        });
    };
    
    // Handle manage board access
    const handleManageBoardAccess = (e, board) => {
        e.preventDefault();
        e.stopPropagation();
        setManagingBoard(board);
    };

    // Check if the current user is the project owner
    const isProjectOwner = auth.user.id === project.data.owner_id;

    // Set up real-time listening for project updates
    useEffect(() => {
        if (!project.data.id) return;

        // Subscribe to the private channel for this project
        const channel = window.Echo.private(`projects.${project.data.id}`);

        // Listen for project.updated events
        channel.listen('.project.updated', (event) => {
            if (event.project.name !== project.data.name || 
                event.project.description !== project.data.description) {
                router.reload({ only: ['project'] });
            }
        });

        // Listen for project.member.added events
        channel.listen('.project.member.added', (event) => {
            router.reload({ only: ['project'] });
        });

        // Listen for project.member.removed events
        channel.listen('.project.member.removed', (event) => {
            router.reload({ only: ['project'] });
        });

        // Listen for board.created events
        channel.listen('.board.created', (event) => {
            router.reload({ only: ['project'] });
        });

        // Listen for board.deleted events
        channel.listen('.board.deleted', (event) => {
            router.reload({ only: ['project'] });
        });

        // Listen for board.updated events (for renames)
        channel.listen('.board.updated', (event) => {
            router.reload({ only: ['project'] });
        });

        // Listen for board.member.added events
        channel.listen('.board.member.added', (event) => {
            router.reload({ only: ['project'] });
        });

        // Listen for board.member.removed events
        channel.listen('.board.member.removed', (event) => {
            router.reload({ only: ['project'] });
        });

        // Clean up the listener when the component unmounts or the project changes
        return () => {
            channel.stopListening('.project.updated');
            channel.stopListening('.project.member.added');
            channel.stopListening('.project.member.removed');
            channel.stopListening('.board.created');
            channel.stopListening('.board.deleted');
            channel.stopListening('.board.updated');
            channel.stopListening('.board.member.added');
            channel.stopListening('.board.member.removed');
            window.Echo.leave(`projects.${project.data.id}`);
        };
    }, [project.data.id]);

    const handleProjectRename = (newName) => {
        router.put(route('project-hub.projects.update', project.data.id), {
            name: newName,
            description: project.data.description, // Keep existing description
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Project renamed successfully.');
            },
            onError: (errors) => {
                toast.error('Failed to rename project.');
                console.error(errors);
            }
        });
    };
    
    return (
        <div className="w-full md:max-w-8xl md:mx-auto px-4 md:px-4 lg:px-2 py-4 md:py-6 lg:mt-2 mt-6">
            {/* Project header */}
            <div className="mb-6">
                <Link href={route('project-hub.index')} className="flex items-center text-gray-500 hover:text-gray-700 mb-2">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    <span className="text-sm">Back to projects</span>
                </Link>
                <div className="flex justify-between items-center">
                    <InlineEdit
                        value={project.data.name}
                        onSave={handleProjectRename}
                        canEdit={project.data.can.update}
                        className="text-2xl font-bold text-gray-900 truncate max-w-3xl"
                        placeholder="Project name"
                    />
                    
                    {/* Manage Collaborators button - only visible to project owner */}
                    {isProjectOwner && (
                        <button
                            onClick={() => setIsCollaboratorsModalOpen(true)}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <UserPlus className="w-4 h-4 mr-2" />
                            Manage Members
                        </button>
                    )}
                </div>
                {project.data.description && (
                    <>
                        <div 
                            className={`mt-1 text-gray-500 max-w-3xl ${!isDescriptionExpanded ? 'line-clamp-2' : ''}`}
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(project.data.description) }}
                        />
                        <button
                            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                            className="mt-1 text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                        >
                            {isDescriptionExpanded ? (
                                <>
                                    <ChevronUp className="w-4 h-4 mr-1" />
                                    Show Less
                                </>
                            ) : (
                                <>
                                    <ChevronDown className="w-4 h-4 mr-1" />
                                    Show More
                                </>
                            )}
                        </button>
                    </>
                )}
            </div>
            
            {/* Boards section */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Boards</h2>
                </div>
                
                {/* Create board form */}
                {project.data.can.create_board && (
                    isCreatingBoard ? (
                        <div className="bg-white shadow rounded-lg p-4 mb-6">
                            <h3 className="text-md font-medium text-gray-900 mb-3">Create a new board</h3>
                            <form onSubmit={handleCreateBoard} className="space-y-3">
                                <div>
                                    <input
                                        type="text"
                                        value={form.data.name}
                                        onChange={e => form.setData('name', e.target.value)}
                                        className="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-sm"
                                        placeholder="Board name"
                                        disabled={form.processing}
                                        autoFocus
                                    />
                                    {form.errors.name && <div className="text-red-500 text-xs mt-1">{form.errors.name}</div>}
                                </div>
                                <div className="flex justify-between">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsCreatingBoard(false);
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
                                        {form.processing ? 'Creating...' : 'Create Board'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setIsCreatingBoard(true)}
                            className="inline-flex items-center px-4 py-2 mb-6 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Create new board
                        </button>
                    )
                )}
                
                {/* Boards grid */}
                {project.data.boards && project.data.boards.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {project.data.boards.map((board) => (
                            <div 
                                key={board.id}
                                className="relative bg-white shadow rounded-lg hover:shadow-md transition-shadow duration-200"
                            >
                                <Link
                                    href={route('project-hub.boards.show', board.id)}
                                    className="block p-5"
                                >
                                    <div className="flex items-center mb-2">
                                        <LayoutGrid className="w-5 h-5 text-indigo-500 mr-2" />
                                        <h3 className="text-lg font-semibold text-gray-900 truncate">{board.name}</h3>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500 mt-3">
                                        <span>Created {new Date(board.created_at).toLocaleDateString('en-GB')}</span>
                                    </div>
                                </Link>
                                <div className="absolute top-2 right-2 flex space-x-1">
                                    {/* Manage Access button - only visible to project owner */}
                                    {isProjectOwner && (
                                        <button
                                            onClick={(e) => handleManageBoardAccess(e, board)}
                                            className="p-1.5 text-gray-400 hover:text-indigo-500 hover:bg-gray-100 rounded-full"
                                            title="Manage board access"
                                        >
                                            <Users className="w-4 h-4" />
                                        </button>
                                    )}
                                    {/* Delete button - only visible to users with delete permission */}
                                    {board.can && board.can.delete && (
                                        <button
                                            onClick={(e) => handleDeleteBoard(e, board)}
                                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-full"
                                            title="Delete board"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white shadow rounded-lg p-6 text-center">
                        <p className="text-gray-500 mb-4">
                            No boards available. Create a board to get started.
                        </p>
                    </div>
                )}
            </div>
            
            {/* Confirmation Modal for Board Deletion */}
            <ConfirmationModal
                show={!!confirmingBoardDeletion}
                onClose={() => setConfirmingBoardDeletion(null)}
                onConfirm={confirmDeleteBoard}
                title="Delete Board"
                message={confirmingBoardDeletion ? `Are you sure you want to delete the board "${confirmingBoardDeletion.name}"? This action cannot be undone and will delete all lists and tasks within this board.` : ''}
            />
            
            {/* Manage Collaborators Modal */}
            <ManageCollaboratorsModal
                show={isCollaboratorsModalOpen}
                onClose={() => setIsCollaboratorsModalOpen(false)}
                context={project}
                contextType="project"
                connections={connections || []}
            />
            
            {/* Manage Board Members Modal */}
            {managingBoard && (
                <ManageBoardMembersModal
                    show={!!managingBoard}
                    onClose={() => setManagingBoard(null)}
                    board={managingBoard}
                    workspaceMembers={project.data.members || []}
                />
            )}
        </div>
    );
}

// Set the layout for this page
Show.layout = page => <MainLayout title="Project Boards" children={page} TopMenuOpen={false} />; 