import React from 'react';
import { useForm } from '@inertiajs/react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function InviteCollaboratorModal({ show, onClose, connections, workspace }) {
    const form = useForm({
        user_id: '',
        role: 'member',
    });

    if (!show) {
        return null;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Make sure workspace data exists and has an id
        if (!workspace || !workspace.data || !workspace.data.id) {
            console.error("Workspace ID is missing, cannot add member.");
            toast.error("Workspace ID is missing, cannot add member.");
            return;
        }
        
        // Use the correct workspace ID from the data property
        form.post(route('workspaces.members.add', workspace.data.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Invitation sent successfully!');
                onClose();
                form.reset();
            },
            onError: (errors) => {
                console.error("Error adding member:", errors);
                toast.error('Failed to send invitation.');
            }
        });
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Modal backdrop */}
            <div 
                className="fixed inset-0 bg-black bg-opacity-40 transition-opacity"
                onClick={onClose}
            ></div>
            
            {/* Modal panel */}
            <div className="flex items-center justify-center min-h-screen p-4">
                <div 
                    className="bg-white rounded-lg shadow-xl max-w-md w-full mx-auto z-10"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Modal header */}
                    <div className="flex items-start justify-between p-4 border-b">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Invite Collaborator
                        </h3>
                        <button 
                            type="button" 
                            className="text-gray-400 hover:text-gray-500"
                            onClick={onClose}
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    
                    {/* Modal content */}
                    <form onSubmit={handleSubmit}>
                        <div className="p-4 space-y-4">
                            <div>
                                <label htmlFor="user_id" className="block text-sm font-medium text-gray-700 mb-1">
                                    Select Connection
                                </label>
                                <select
                                    id="user_id"
                                    name="user_id"
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                    value={form.data.user_id}
                                    onChange={e => form.setData('user_id', e.target.value)}
                                    disabled={form.processing}
                                    required
                                >
                                    <option value="">-- Select a connection --</option>
                                    {connections.map(user => {
                                        // Find the specific profile within the user object
                                        const profile = user.academician || user.postgraduate || user.undergraduate;
                                        // Use the profile's full_name if it exists, otherwise fall back to the base name
                                        const displayName = profile?.full_name || user.name;
                                        
                                        return (
                                            <option key={user.id} value={user.id}>
                                                {displayName}
                                            </option>
                                        );
                                    })}
                                </select>
                                {form.errors.user_id && (
                                    <p className="mt-1 text-sm text-red-600">{form.errors.user_id}</p>
                                )}
                            </div>
                            
                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                                    Assign Role
                                </label>
                                <select
                                    id="role"
                                    name="role"
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                    value={form.data.role}
                                    onChange={e => form.setData('role', e.target.value)}
                                    disabled={form.processing}
                                    required
                                >
                                    <option value="member">Member</option>
                                    <option value="admin">Admin</option>
                                </select>
                                {form.errors.role && (
                                    <p className="mt-1 text-sm text-red-600">{form.errors.role}</p>
                                )}
                            </div>
                        </div>
                        
                        {/* Modal footer */}
                        <div className="px-4 py-3 flex justify-end space-x-3 border-t bg-gray-50 rounded-b-lg">
                            <button
                                type="button"
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                onClick={onClose}
                                disabled={form.processing}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                disabled={form.processing || !form.data.user_id}
                            >
                                {form.processing ? 'Sending...' : 'Send Invitation'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 