import React, { useState, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import CreateWorkspaceModal from '@/Components/ProjectHub/CreateWorkspaceModal';
import CreateProjectModal from '@/Components/ProjectHub/CreateProjectModal';
import ManageCollaboratorsModal from '@/Components/ProjectHub/ManageCollaboratorsModal';
import ConfirmationModal from '@/Components/ConfirmationModal';
import PrimaryButton from '@/Components/PrimaryButton';
import { Plus, Users, Calendar, Clock, Trash2, Briefcase, UserPlus, FolderPlus, LayoutDashboard } from 'lucide-react';
import DOMPurify from 'dompurify';
import toast from 'react-hot-toast';
import WorkspaceGroupSection from '@/Components/ProjectHub/WorkspaceGroupSection';
import CreateGroupModal from '@/Components/ProjectHub/CreateGroupModal';
import EditGroupModal from '@/Components/ProjectHub/EditGroupModal';
import DeleteGroupDialog from '@/Components/ProjectHub/DeleteGroupDialog';
import { Button } from '@/components/ui/button';
import { DndContext, DragOverlay, closestCenter } from '@dnd-kit/core';

export default function Index({ workspaceGroups = [], ungroupedWorkspaces = [], workspaces, projects, linkableProjects, connections }) {
    // Ensure workspaces and projects are arrays
    const workspacesArray = Array.isArray(workspaces) ? workspaces : workspaces?.data || [];
    const projectsArray = Array.isArray(projects) ? projects : projects?.data || [];
    
    const { auth } = usePage().props;
    const [isCreateWorkspaceModalOpen, setIsCreateWorkspaceModalOpen] = useState(false);
    const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
    const [confirmingDeletion, setConfirmingDeletion] = useState(null);
    const [confirmingProjectDeletion, setConfirmingProjectDeletion] = useState(null);
    const [isCollaboratorsModalOpen, setIsCollaboratorsModalOpen] = useState(false);
    const [managingContext, setManagingContext] = useState(null);
    const [managingContextType, setManagingContextType] = useState(null);
    
    // Group management states
    const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
    const [isEditGroupModalOpen, setIsEditGroupModalOpen] = useState(false);
    const [isDeleteGroupDialogOpen, setIsDeleteGroupDialogOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    
    // Ensure arrays
    const workspaceGroupsArray = Array.isArray(workspaceGroups) ? workspaceGroups : [];
    const ungroupedWorkspacesArray = Array.isArray(ungroupedWorkspaces) ? ungroupedWorkspaces : ungroupedWorkspaces?.data || [];
    
    // Check if the user is an academician (can create projects)
    const canCreateProject = auth.user.academician !== null;

    // Set up real-time listeners for all user's workspaces
    useEffect(() => {
        if (!window.Echo) return;

        const channels = [];

        // Subscribe to all workspace channels in groups
        workspaceGroupsArray.forEach(group => {
            const groupWorkspaces = Array.isArray(group.workspaces) ? group.workspaces : group.workspaces?.data || [];
            groupWorkspaces.forEach(workspace => {
                const channel = window.Echo.private(`workspaces.${workspace.id}`);
                channels.push({ id: workspace.id, type: 'workspace', channel });

                channel.listen('.workspace.updated', () => {
                    console.log('Workspace updated, reloading...');
                    router.reload({ only: ['workspaceGroups', 'ungroupedWorkspaces', 'workspaces'] });
                });

                channel.listen('.workspace.deleted', () => {
                    console.log('Workspace deleted, reloading...');
                    router.reload({ only: ['workspaceGroups', 'ungroupedWorkspaces', 'workspaces'] });
                });

                channel.listen('.workspace.member.added', () => {
                    router.reload({ only: ['workspaceGroups', 'ungroupedWorkspaces', 'workspaces'] });
                });

                channel.listen('.workspace.member.removed', () => {
                    router.reload({ only: ['workspaceGroups', 'ungroupedWorkspaces', 'workspaces'] });
                });

                channel.listen('.board.created', () => {
                    router.reload({ only: ['workspaceGroups', 'ungroupedWorkspaces', 'workspaces'] });
                });

                channel.listen('.board.deleted', () => {
                    router.reload({ only: ['workspaceGroups', 'ungroupedWorkspaces', 'workspaces'] });
                });
            });
        });

        // Subscribe to ungrouped workspace channels
        ungroupedWorkspacesArray.forEach(workspace => {
            const channel = window.Echo.private(`workspaces.${workspace.id}`);
            channels.push({ id: workspace.id, type: 'workspace', channel });

            channel.listen('.workspace.updated', () => {
                router.reload({ only: ['workspaceGroups', 'ungroupedWorkspaces', 'workspaces'] });
            });

            channel.listen('.workspace.deleted', () => {
                router.reload({ only: ['workspaceGroups', 'ungroupedWorkspaces', 'workspaces'] });
            });

            channel.listen('.workspace.member.added', () => {
                router.reload({ only: ['workspaceGroups', 'ungroupedWorkspaces', 'workspaces'] });
            });

            channel.listen('.workspace.member.removed', () => {
                router.reload({ only: ['workspaceGroups', 'ungroupedWorkspaces', 'workspaces'] });
            });

            channel.listen('.board.created', () => {
                router.reload({ only: ['workspaceGroups', 'ungroupedWorkspaces', 'workspaces'] });
            });

            channel.listen('.board.deleted', () => {
                router.reload({ only: ['workspaceGroups', 'ungroupedWorkspaces', 'workspaces'] });
            });
        });

        // Subscribe to all project channels
        projectsArray.forEach(project => {
            const channel = window.Echo.private(`projects.${project.id}`);
            channels.push({ id: project.id, type: 'project', channel });

            channel.listen('.project.updated', () => {
                router.reload({ only: ['projects'] });
            });

            channel.listen('.project.deleted', () => {
                router.reload({ only: ['projects'] });
            });

            channel.listen('.project.member.added', () => {
                router.reload({ only: ['projects'] });
            });

            channel.listen('.project.member.removed', () => {
                router.reload({ only: ['projects'] });
            });

            channel.listen('.board.created', () => {
                router.reload({ only: ['projects'] });
            });

            channel.listen('.board.deleted', () => {
                router.reload({ only: ['projects'] });
            });
        });

        // Cleanup function
        return () => {
            channels.forEach(({ id, type }) => {
                window.Echo.leave(`${type}s.${id}`);
            });
        };
    }, [workspaceGroupsArray.length, ungroupedWorkspacesArray.length, projectsArray.length]);

    // Set up personal channel listener for invitations
    useEffect(() => {
        if (!window.Echo || !auth.user.id) return;

        const channel = window.Echo.private(`App.Models.User.${auth.user.id}`);

        // Listen for workspace/project/board invitations
        channel.listen('.workspace.member.added', (event) => {
            const workspaceName = event.workspace?.name || 'a workspace';
            toast.success(`You were added to ${workspaceName}`);
            router.reload({ only: ['workspaceGroups', 'ungroupedWorkspaces', 'workspaces'] });
        });

        channel.listen('.project.member.added', (event) => {
            const projectName = event.project?.name || 'a project';
            toast.success(`You were added to ${projectName}`);
            router.reload({ only: ['projects'] });
        });

        channel.listen('.board.member.added', (event) => {
            const boardName = event.board?.name || 'a board';
            const parentName = event.parent?.name || '';
            toast.success(`You were added to board "${boardName}"${parentName ? ` in ${parentName}` : ''}`);
            router.reload({ only: ['workspaceGroups', 'ungroupedWorkspaces', 'workspaces', 'projects'] });
        });

        return () => {
            channel.stopListening('.workspace.member.added');
            channel.stopListening('.project.member.added');
            channel.stopListening('.board.member.added');
            window.Echo.leave(`App.Models.User.${auth.user.id}`);
        };
    }, [auth.user.id]);

    const handleDeleteWorkspace = (e, workspace) => {
        e.preventDefault();
        e.stopPropagation();
        setConfirmingDeletion(workspace);
    };

    const confirmDeleteWorkspace = () => {
        if (!confirmingDeletion) return;
        
        router.delete(route('project-hub.workspaces.destroy', confirmingDeletion.id), {
            onSuccess: () => {
                toast.success(`Workspace "${confirmingDeletion.name}" deleted successfully.`);
                setConfirmingDeletion(null);
            },
            onError: (errors) => {
                console.error('Error deleting workspace:', errors);
                toast.error('Failed to delete workspace. Please try again.');
            },
        });
    };
    
    const handleDeleteProject = (e, project) => {
        e.preventDefault();
        e.stopPropagation();
        setConfirmingProjectDeletion(project);
    };

    const confirmDeleteProject = () => {
        if (!confirmingProjectDeletion) return;
        
        router.delete(route('project-hub.projects.destroy', confirmingProjectDeletion.id), {
            onSuccess: () => {
                toast.success(`Project "${confirmingProjectDeletion.name}" deleted successfully.`);
                setConfirmingProjectDeletion(null);
            },
            onError: (errors) => {
                console.error('Error deleting project:', errors);
                toast.error('Failed to delete project. Please try again.');
            },
        });
    };
    
    const handleManageCollaborators = (e, context, contextType) => {
        e.preventDefault();
        e.stopPropagation();
        setManagingContext(context);
        setManagingContextType(contextType);
        setIsCollaboratorsModalOpen(true);
    };
    
    // Group management handlers
    const handleEditGroup = (group) => {
        setSelectedGroup(group);
        setIsEditGroupModalOpen(true);
    };
    
    const handleDeleteGroup = (group) => {
        setSelectedGroup(group);
        setIsDeleteGroupDialogOpen(true);
    };
    
    // Drag and drop handlers
    const [activeWorkspace, setActiveWorkspace] = useState(null);
    
    const handleDragStart = (event) => {
        const { active } = event;
        if (active.data.current?.type === 'workspace') {
            setActiveWorkspace(active.data.current.workspace);
        }
    };
    
    const handleDragEnd = (event) => {
        const { active, over } = event;
        
        if (!over) {
            setActiveWorkspace(null);
            return;
        }
        
        // If dropped over a group
        if (over.data.current?.type === 'group') {
            const workspaceId = active.data.current.workspace.id;
            const targetGroupId = over.data.current.groupId;
            
            if (targetGroupId === null) {
                // Unassign from group (move to ungrouped)
                router.post(route('project-hub.workspaces.unassign', workspaceId), {}, {
                    preserveScroll: true,
                    onSuccess: () => toast.success('Workspace moved to ungrouped'),
                    onError: () => toast.error('Failed to move workspace')
                });
            } else {
                // Assign to group
                router.post(route('project-hub.workspace-groups.assign', {
                    workspaceGroup: targetGroupId,
                    workspace: workspaceId
                }), {}, {
                    preserveScroll: true,
                    onSuccess: () => toast.success('Workspace moved to group'),
                    onError: () => toast.error('Failed to move workspace')
                });
            }
        }
        
        setActiveWorkspace(null);
    };

    return (
        <div className="space-y-8 lg:mt-2 mt-20 mb-8">
            {/* Workspaces Section */}
        <div className="space-y-6 lg:mx-0 mx-4">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 pl-2">Your Workspaces</h2>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => setIsCreateGroupModalOpen(true)}>
                        <FolderPlus className="w-4 h-4 mr-2" /> New Group
                    </Button>
                    <PrimaryButton onClick={() => setIsCreateWorkspaceModalOpen(true)}>
                        <LayoutDashboard className="w-4 h-4 mr-2" /> New Workspace
                    </PrimaryButton>
                </div>
            </div>

            {/* Show empty state only if no groups and no ungrouped workspaces */}
            {workspaceGroupsArray.length === 0 && ungroupedWorkspacesArray.length === 0 ? (
                <div className="bg-white shadow rounded-lg p-6 text-center">
                    <div className="mb-4">
                        <div className="mx-auto bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center">
                            <Users className="w-8 h-8 text-gray-500" />
                        </div>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No workspaces yet</h3>
                    <p className="text-gray-500 mb-4">
                        Create your first workspace to start organizing your projects.
                    </p>
                    <PrimaryButton onClick={() => setIsCreateWorkspaceModalOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" /> Create Workspace
                    </PrimaryButton>
                </div>
            ) : (
                <DndContext 
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <div className="space-y-4">
                        {/* Workspace Groups */}
                        {workspaceGroupsArray.map(group => (
                            <WorkspaceGroupSection
                                key={group.id}
                                group={group}
                                workspaces={group.workspaces}
                                allGroups={workspaceGroupsArray}
                                onEdit={handleEditGroup}
                                onDelete={handleDeleteGroup}
                            />
                        ))}
                        
                        {/* Ungrouped Section (always at bottom) */}
                        {ungroupedWorkspacesArray.length > 0 && (
                            <WorkspaceGroupSection
                                isUngrouped
                                workspaces={ungroupedWorkspacesArray}
                                allGroups={workspaceGroupsArray}
                            />
                        )}
                    </div>
                    
                    {/* Drag Overlay - Shows the workspace being dragged */}
                    <DragOverlay>
                        {activeWorkspace ? (
                            <div className="p-4 border rounded-lg bg-white shadow-xl opacity-90">
                                <h3 className="font-semibold text-gray-900">
                                    {activeWorkspace.name}
                                </h3>
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            )}
            </div>

            {/* Projects Section */}
            <div className="space-y-6 lg:mx-0 mx-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900 pl-2">Your Projects</h2>
                    <div className="space-x-2">
                        {canCreateProject && (
                            <PrimaryButton onClick={() => setIsCreateProjectModalOpen(true)}>
                                <Briefcase className="w-4 h-4 mr-2" /> New Project
                            </PrimaryButton>
                        )}
                    </div>
                </div>

                {projectsArray.length === 0 ? (
                    <div className="bg-white shadow rounded-lg p-6 text-center">
                        <div className="mb-4">
                            <div className="mx-auto bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center">
                                <Briefcase className="w-8 h-8 text-gray-500" />
                            </div>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                        <p className="text-gray-500 mb-4">
                            Create your first project to start organizing your research.
                        </p>
                        <div className="space-x-2">
                            {canCreateProject && (
                                <PrimaryButton onClick={() => setIsCreateProjectModalOpen(true)}>
                                    <Briefcase className="w-4 h-4 mr-2" /> Create Project
                                </PrimaryButton>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {projectsArray.map((project) => {
                            // Find the owner's specific profile
                            const ownerProfile = project.owner.academician || project.owner.postgraduate || project.owner.undergraduate;
                            // Use the profile's full_name if it exists, otherwise fall back to the base name
                            const ownerName = ownerProfile?.full_name || project.owner.name;
                            const ownerDisplay = auth.user.id === project.owner_id ? 'You' : ownerName;
                            
                            // Check if current user is the owner
                            const isOwner = auth.user.id === project.owner_id;
                            
                            return (
                                <div 
                                    key={project.id}
                                    className="relative border rounded-lg bg-white dark:bg-gray-800 hover:shadow-md transition-shadow flex flex-col min-h-[140px]"
                                >
                                    {/* Delete Button (Owner Only) */}
                                    {isOwner && (
                                        <button
                                            onClick={(e) => handleDeleteProject(e, project)}
                                            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors z-10"
                                            title="Delete project"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                    
                                    {/* Main Card Content */}
                                    <Link 
                                        href={route('project-hub.projects.show', project.id)}
                                        className="block pt-2 px-4 flex-grow"
                                    >
                                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mt-1 pr-8">
                                            {project.name}
                                        </h3>
                                    </Link>
                                    
                                    {/* Owner and Members Count - At Bottom */}
                                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 px-4 pb-4 border-t pt-3 mt-auto">
                                        <span>Owner: {ownerDisplay}</span>
                                        <span>{project.members_count || 0} members</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <CreateWorkspaceModal 
                isOpen={isCreateWorkspaceModalOpen} 
                onClose={() => setIsCreateWorkspaceModalOpen(false)} 
            />
            
            <CreateProjectModal
                show={isCreateProjectModalOpen}
                onClose={() => setIsCreateProjectModalOpen(false)}
                linkableProjects={linkableProjects || []}
            />
            
            <ManageCollaboratorsModal
                show={isCollaboratorsModalOpen}
                onClose={() => {
                    setIsCollaboratorsModalOpen(false);
                    setManagingContext(null);
                    setManagingContextType(null);
                }}
                context={managingContext}
                contextType={managingContextType}
                connections={connections || []}
            />
            
            <ConfirmationModal
                show={!!confirmingDeletion}
                onClose={() => setConfirmingDeletion(null)}
                onConfirm={confirmDeleteWorkspace}
                title="Delete Workspace"
                message={confirmingDeletion ? `Are you sure you want to delete the workspace "${confirmingDeletion.name}"? This action cannot be undone and will delete all boards and tasks within this workspace.` : ''}
            />
            
            <ConfirmationModal
                show={!!confirmingProjectDeletion}
                onClose={() => setConfirmingProjectDeletion(null)}
                onConfirm={confirmDeleteProject}
                title="Delete Project"
                message={confirmingProjectDeletion ? `Are you sure you want to delete the project "${confirmingProjectDeletion.name}"? This action cannot be undone and will delete all boards and tasks within this project.` : ''}
            />
            
            {/* Group Management Modals */}
            <CreateGroupModal
                isOpen={isCreateGroupModalOpen}
                onClose={() => setIsCreateGroupModalOpen(false)}
            />
            
            <EditGroupModal
                isOpen={isEditGroupModalOpen}
                onClose={() => {
                    setIsEditGroupModalOpen(false);
                    setSelectedGroup(null);
                }}
                group={selectedGroup}
            />
            
            <DeleteGroupDialog
                isOpen={isDeleteGroupDialogOpen}
                onClose={() => {
                    setIsDeleteGroupDialogOpen(false);
                    setSelectedGroup(null);
                }}
                group={selectedGroup}
            />
        </div>
    );
}

// Set the layout for this page
Index.layout = page => <MainLayout title="NexLab" children={page} TopMenuOpen={false} />;