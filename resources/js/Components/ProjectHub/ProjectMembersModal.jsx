import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import ConfirmationModal from '@/Components/ConfirmationModal';
import { toast } from 'react-hot-toast';
import { usePage } from '@inertiajs/react';
import axios from 'axios';

export default function ProjectMembersModal({ show, onClose, project, connections }) {
    const { auth } = usePage().props;
    const [confirmingRemoval, setConfirmingRemoval] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [availableConnections, setAvailableConnections] = useState([]);
    
    const form = useForm({
        user_id: '',
        role: 'member',
    });
    
    // Filter connections to exclude existing members whenever the modal is shown
    useEffect(() => {
        if (show && connections && project?.members) {
            const memberIds = project.members.map(member => member.id);
            const filteredConnections = connections.filter(connection => !memberIds.includes(connection.id));
            setAvailableConnections(filteredConnections);
        }
    }, [show, connections, project]);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        axios.post(`/api/v1/projects/${project.id}/members`, form.data)
            .then(response => {
                toast.success('Member added successfully');
                form.reset();
                // Refresh the page to update the members list
                window.location.reload();
            })
            .catch(error => {
                const message = error.response?.data?.message || 'Failed to add member';
                toast.error(message);
                if (error.response?.data?.errors) {
                    form.setError(error.response.data.errors);
                }
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };
    
    const confirmRemoveMember = (member) => {
        setConfirmingRemoval(member);
    };
    
    const removeMember = () => {
        if (!confirmingRemoval) return;
        
        setIsSubmitting(true);
        
        axios.delete(`/api/v1/projects/${project.id}/members/${confirmingRemoval.id}`)
            .then(response => {
                toast.success('Member removed successfully');
                setConfirmingRemoval(null);
                // Refresh the page to update the members list
                window.location.reload();
            })
            .catch(error => {
                const message = error.response?.data?.message || 'Failed to remove member';
                toast.error(message);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };
    
    // Helper function to get the full name from a user's profile
    const getFullName = (user) => {
        if (!user) return 'Unknown User';
        
        const profile = user.academician || user.postgraduate || user.undergraduate;
        return profile?.full_name || user.name;
    };
    
    return (
        <>
            <Modal show={show} onClose={onClose} maxWidth="md">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">Manage Project Members</h2>
                    
                    {/* Current Members List */}
                    <div className="mb-8">
                        <h3 className="text-md font-medium text-gray-700 mb-3">Current Collaborators</h3>
                        
                        {project?.members && project.members.length > 0 ? (
                            <div className="space-y-3">
                                {project.members.map(member => (
                                    <div key={member.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                                {member.profile_photo_url ? (
                                                    <img src={member.profile_photo_url} alt={getFullName(member)} className="h-full w-full object-cover" />
                                                ) : (
                                                    <span className="text-gray-500 text-sm">{getFullName(member).charAt(0)}</span>
                                                )}
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-900">{getFullName(member)}</p>
                                                <p className="text-xs text-gray-500">
                                                    {member.id === project.owner_id ? 'Owner' : member.pivot?.role || 'Member'}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {/* Show remove button for non-owners */}
                                        {auth.user.id === project.owner_id && member.id !== project.owner_id && (
                                            <SecondaryButton
                                                onClick={() => confirmRemoveMember(member)}
                                                disabled={isSubmitting}
                                                className="bg-red-50 text-red-600 hover:bg-red-100"
                                            >
                                                Remove
                                            </SecondaryButton>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">No members in this project yet.</p>
                        )}
                    </div>
                    
                    {/* Invite New Members Form */}
                    {auth.user.id === project?.owner_id && (
                        <div>
                            <h3 className="text-md font-medium text-gray-700 mb-3">Invite New Member</h3>
                            
                            {availableConnections.length > 0 ? (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <InputLabel htmlFor="user_id" value="Select Connection" />
                                        <select
                                            id="user_id"
                                            name="user_id"
                                            value={form.data.user_id}
                                            onChange={e => form.setData('user_id', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                            required
                                        >
                                            <option value="">Select a connection</option>
                                            {availableConnections.map(connection => (
                                                <option key={connection.id} value={connection.id}>
                                                    {getFullName(connection)}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={form.errors.user_id} className="mt-2" />
                                    </div>
                                    
                                    <div>
                                        <InputLabel htmlFor="role" value="Role" />
                                        <select
                                            id="role"
                                            name="role"
                                            value={form.data.role}
                                            onChange={e => form.setData('role', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        >
                                            <option value="member">Member</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                        <InputError message={form.errors.role} className="mt-2" />
                                    </div>
                                    
                                    <div className="flex justify-end">
                                        <PrimaryButton type="submit" disabled={isSubmitting || !form.data.user_id}>
                                            {isSubmitting ? 'Sending...' : 'Send Invitation'}
                                        </PrimaryButton>
                                    </div>
                                </form>
                            ) : (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                                    <p className="text-sm text-yellow-700">
                                        You have no available connections to invite. Connect with other users first.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                    
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={onClose}>
                            Close
                        </SecondaryButton>
                    </div>
                </div>
            </Modal>
            
            {/* Confirmation Modal for Member Removal */}
            <ConfirmationModal
                show={!!confirmingRemoval}
                onClose={() => setConfirmingRemoval(null)}
                onConfirm={removeMember}
                title="Remove Member"
                message={confirmingRemoval ? `Are you sure you want to remove ${getFullName(confirmingRemoval)} from this project?` : ''}
            />
        </>
    );
} 