import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import CreateWorkspaceModal from '@/Components/ProjectHub/CreateWorkspaceModal';
import CreateProjectModal from '@/Components/ProjectHub/CreateProjectModal';
import ManageCollaboratorsModal from '@/Components/ProjectHub/ManageCollaboratorsModal';
import ConfirmationModal from '@/Components/ConfirmationModal';
import PrimaryButton from '@/Components/PrimaryButton';
import { Plus, Users, Calendar, Clock, Trash2, Briefcase, UserPlus } from 'lucide-react';
import DOMPurify from 'dompurify';

export default function Index({ workspaces, projects, linkableProjects, connections }) {
    console.log(workspaces);
    console.log(projects);
    const { auth } = usePage().props;
    const [isCreateWorkspaceModalOpen, setIsCreateWorkspaceModalOpen] = useState(false);
    const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
    const [confirmingDeletion, setConfirmingDeletion] = useState(null);
    const [confirmingProjectDeletion, setConfirmingProjectDeletion] = useState(null);
    const [isCollaboratorsModalOpen, setIsCollaboratorsModalOpen] = useState(false);
    const [managingContext, setManagingContext] = useState(null);
    const [managingContextType, setManagingContextType] = useState(null);
    
    // Check if the user is an academician (can create projects)
    const canCreateProject = auth.user.academician !== null;

    const handleDeleteWorkspace = (e, workspace) => {
        e.preventDefault();
        e.stopPropagation();
        setConfirmingDeletion(workspace);
    };

    const confirmDeleteWorkspace = () => {
        if (!confirmingDeletion) return;
        
        router.delete(route('workspaces.destroy', confirmingDeletion.id), {
            onSuccess: () => {
                setConfirmingDeletion(null);
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
                setConfirmingProjectDeletion(null);
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

    return (
        <div className="space-y-8">
            {/* Workspaces Section */}
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900 pl-2">Your Workspaces</h2>
                    <div className="space-x-2">
                        {/* {canCreateProject && (
                            <PrimaryButton onClick={() => setIsCreateProjectModalOpen(true)}>
                                <Briefcase className="w-4 h-4 mr-2" /> New Project
                            </PrimaryButton>
                        )} */}
                        <PrimaryButton onClick={() => setIsCreateWorkspaceModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" /> New Workspace
                </PrimaryButton>
                    </div>
            </div>

            {workspaces.length === 0 ? (
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
                        <div className="space-x-2">
                            {canCreateProject && (
                                <PrimaryButton onClick={() => setIsCreateProjectModalOpen(true)}>
                                    <Briefcase className="w-4 h-4 mr-2" /> Create Project
                                </PrimaryButton>
                            )}
                            <PrimaryButton onClick={() => setIsCreateWorkspaceModalOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" /> Create Workspace
                    </PrimaryButton>
                        </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {workspaces.map((workspace) => {
                            // Find the owner's specific profile
                            const ownerProfile = workspace.owner.academician || workspace.owner.postgraduate || workspace.owner.undergraduate;
                            // Use the profile's full_name if it exists, otherwise fall back to the base name
                            const ownerName = ownerProfile?.full_name || workspace.owner.name;
                            
                            return (
                        <div 
                            key={workspace.id}
                            className="relative bg-white shadow rounded-lg hover:shadow-md transition-shadow duration-200"
                        >
                            <Link 
                                href={route('project-hub.workspaces.show', workspace.id)}
                                className="block p-5"
                            >
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">{workspace.name}</h3>
                                {workspace.description && (
                                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">{workspace.description}</p>
                                )}
                                <div className="flex items-center text-sm text-gray-500 mt-3">
                                    <div className="flex items-center mr-4">
                                        <Users className="w-4 h-4 mr-1" />
                                                <span>Owner: {ownerName}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="w-4 h-4 mr-1" />
                                        <span>{new Date(workspace.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </Link>
                                    
                                    {/* Action buttons */}
                                    <div className="absolute top-2 right-2 flex space-x-1">
                                        {/* Manage Members button (only for workspace owner) */}
                                        {/* {auth.user.id === workspace.owner_id && (
                                            <button
                                                onClick={(e) => handleManageCollaborators(e, workspace, 'workspace')}
                                                className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-gray-100 rounded-full"
                                                title="Manage members"
                                            >
                                                <UserPlus className="w-4 h-4" />
                                            </button>
                                        )} */}
                                        
                            {/* Delete button */}
                            {auth.user.id === workspace.owner_id && 
                            <button
                                onClick={(e) => handleDeleteWorkspace(e, workspace)}
                                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-full"
                                title="Delete workspace"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            }
                        </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Projects Section */}
            <div className="space-y-6">
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

                {projects.length === 0 ? (
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {projects.map((project) => {
                            // Find the owner's specific profile
                            const ownerProfile = project.owner.academician || project.owner.postgraduate || project.owner.undergraduate;
                            // Use the profile's full_name if it exists, otherwise fall back to the base name
                            const ownerName = ownerProfile?.full_name || project.owner.name;
                            
                            return (
                                <div 
                                    key={project.id}
                                    className="relative bg-blue-50 shadow rounded-lg hover:shadow-md transition-shadow duration-200"
                                >
                                    <Link 
                                        href={route('project-hub.projects.show', project.id)}
                                        className="block p-5"
                                    >
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{project.name}</h3>
                                        {project.description && (
                                            <p 
                                                className="text-gray-500 text-sm mb-3 line-clamp-2"
                                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(project.description) }}
                                            />
                                        )}
                                        <div className="flex items-center text-sm text-gray-500 mt-3">
                                            <div className="flex items-center mr-4">
                                                <Users className="w-4 h-4 mr-1" />
                                                <span>Owner: {ownerName}</span>
                                            </div>
                                            {project.post_project_id && (
                                                <div className="flex items-center mr-4">
                                                    <Briefcase className="w-4 h-4 mr-1" />
                                                    <span>Linked Project</span>
                                                </div>
                                            )}
                                            <div className="flex items-center">
                                                <Clock className="w-4 h-4 mr-1" />
                                                <span>{new Date(project.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </Link>
                                    
                                    {/* Action buttons */}
                                    <div className="absolute top-2 right-2 flex space-x-1">
                                        {/* Manage Members button (only for project owner) */}
                                        {auth.user.id === project.owner_id && (
                                            <button
                                                onClick={(e) => handleManageCollaborators(e, project, 'project')}
                                                className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-100 rounded-full"
                                                title="Manage members"
                                            >
                                                <UserPlus className="w-4 h-4" />
                                            </button>
                                        )}
                                        
                                        {/* Delete button */}
                                        {auth.user.id === project.owner_id && (
                                        <button
                                            onClick={(e) => handleDeleteProject(e, project)}
                                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-blue-100 rounded-full"
                                            title="Delete project"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        )}
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
        </div>
    );
}

// Set the layout for this page
Index.layout = page => <MainLayout title="Scholar Lab" children={page} TopMenuOpen={false} />; 