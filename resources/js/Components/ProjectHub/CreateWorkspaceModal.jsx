import React from 'react';
import { useForm } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import toast from 'react-hot-toast';

export default function CreateWorkspaceModal({ isOpen, onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        post(route('project-hub.workspaces.store'), {
            onSuccess: () => {
                toast.success(`Workspace "${data.name}" created successfully.`);
                reset();
                onClose();
                // The page will automatically be refreshed by Inertia
            },
            onError: (errors) => {
                console.error('Error creating workspace:', errors);
                toast.error('Failed to create workspace. Please check the form for errors.');
            },
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
            
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative z-10">
                <h2 className="text-xl font-semibold mb-4">Create New Workspace</h2>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <InputLabel htmlFor="name" value="Workspace Name" />
                        <TextInput
                            id="name"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>
                    
                    <div className="mb-4">
                        <InputLabel htmlFor="description" value="Description (Optional)" />
                        <textarea
                            id="description"
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows="3"
                        />
                        <InputError message={errors.description} className="mt-2" />
                    </div>
                    
                    <div className="flex justify-end gap-2">
                        <SecondaryButton onClick={onClose} disabled={processing}>
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create Workspace'}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </div>
    );
} 