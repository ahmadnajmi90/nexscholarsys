import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Select from 'react-select';

export default function CreateProjectModal({ show, onClose, linkableProjects = [] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        post_project_id: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        post(route('project-hub.projects.store'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <form onSubmit={handleSubmit} className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Create Workspace from Project</h2>
                
                <div className="mb-6">
                    <InputLabel htmlFor="post_project_id" value="Select a Project to Create a Workspace For" className="mb-2" />
                    {linkableProjects.length > 0 ? (
                        <>
                            <Select
                                id="post_project_id"
                                options={linkableProjects.map(project => ({
                                    value: project.id,
                                    label: project.title
                                }))}
                                onChange={(selected) => setData('post_project_id', selected ? selected.value : '')}
                                className="w-full"
                                classNamePrefix="select"
                                placeholder="Select a project..."
                                required
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                The workspace will inherit the title and description from the selected project.
                            </p>
                        </>
                    ) : (
                        <div className="text-amber-600 py-4 px-3 bg-amber-50 border border-amber-200 rounded-md">
                            <p className="mb-3">
                            You don't have any projects available for linking. Please create a project first.
                        </p>
                            <Link
                                href={route('post-projects.create')}
                                className="inline-flex items-center px-4 py-2 bg-amber-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-amber-700 focus:bg-amber-700 active:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition ease-in-out duration-150"
                            >
                                Create Project
                            </Link>
                        </div>
                    )}
                    <InputError message={errors.post_project_id} className="mt-2" />
                </div>
                
                <div className="flex justify-end mt-6">
                    <SecondaryButton onClick={onClose} className="mr-2">
                        Cancel
                    </SecondaryButton>
                    <PrimaryButton 
                        type="submit" 
                        disabled={processing || linkableProjects.length === 0}
                    >
                        Create Workspace
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
} 