import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import CreateWorkspaceModal from '@/Components/ProjectHub/CreateWorkspaceModal';
import ConfirmationModal from '@/Components/ConfirmationModal';
import PrimaryButton from '@/Components/PrimaryButton';
import { Plus, Users, Calendar, Clock, Trash2 } from 'lucide-react';

export default function Index({ workspaces }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [confirmingDeletion, setConfirmingDeletion] = useState(null);

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

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900 pl-2">Your Workspaces</h2>
                <PrimaryButton onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" /> New Workspace
                </PrimaryButton>
            </div>

            {workspaces.data.length === 0 ? (
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
                    <PrimaryButton onClick={() => setIsCreateModalOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" /> Create Workspace
                    </PrimaryButton>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {workspaces.data.map((workspace) => (
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
                                        <span>Owner: {workspace.owner.name}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="w-4 h-4 mr-1" />
                                        <span>{new Date(workspace.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </Link>
                            {/* Delete button */}
                            <button
                                onClick={(e) => handleDeleteWorkspace(e, workspace)}
                                className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-full"
                                title="Delete workspace"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <CreateWorkspaceModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
            />
            
            <ConfirmationModal
                show={!!confirmingDeletion}
                onClose={() => setConfirmingDeletion(null)}
                onConfirm={confirmDeleteWorkspace}
                title="Delete Workspace"
                message={confirmingDeletion ? `Are you sure you want to delete the workspace "${confirmingDeletion.name}"? This action cannot be undone and will delete all boards and tasks within this workspace.` : ''}
            />
        </div>
    );
}

// Set the layout for this page
Index.layout = page => <MainLayout title="Project Hub" children={page} TopMenuOpen={false} />; 