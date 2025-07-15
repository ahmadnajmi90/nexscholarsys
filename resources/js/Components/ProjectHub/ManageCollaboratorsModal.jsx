import React, { useState, useEffect, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import ConfirmationModal from '@/Components/ConfirmationModal';
import { toast } from 'react-hot-toast';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { Info } from 'lucide-react';
import ReactDOM from 'react-dom';

// Custom hook for tooltip positioning
const useTooltip = () => {
    const [isVisible, setIsVisible] = useState(false);
    const triggerRef = useRef(null);
    const tooltipRef = useRef(null);
    
    const updateTooltipPosition = () => {
        if (triggerRef.current && tooltipRef.current) {
            const triggerRect = triggerRef.current.getBoundingClientRect();
            const tooltipRect = tooltipRef.current.getBoundingClientRect();
            
            // Position the tooltip above the trigger
            tooltipRef.current.style.left = `${triggerRect.left - (tooltipRect.width / 2) + (triggerRect.width / 2)}px`;
            tooltipRef.current.style.top = `${triggerRect.top - tooltipRect.height - 10}px`;
        }
    };
    
    useEffect(() => {
        if (isVisible) {
            updateTooltipPosition();
            // Update position on scroll and resize
            window.addEventListener('scroll', updateTooltipPosition);
            window.addEventListener('resize', updateTooltipPosition);
            
            return () => {
                window.removeEventListener('scroll', updateTooltipPosition);
                window.removeEventListener('resize', updateTooltipPosition);
            };
        }
    }, [isVisible]);
    
    return {
        triggerProps: {
            ref: triggerRef,
            onMouseEnter: () => setIsVisible(true),
            onMouseLeave: () => setIsVisible(false),
        },
        tooltipProps: {
            ref: tooltipRef,
            style: { 
                position: 'fixed',
                zIndex: 9999,
                display: isVisible ? 'block' : 'none'
            }
        },
        isVisible
    };
};

// Tooltip Portal component
const TooltipPortal = ({ children, isVisible }) => {
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);
    
    return mounted ? ReactDOM.createPortal(
        children,
        document.body
    ) : null;
};

export default function ManageCollaboratorsModal({ show, onClose, context, contextType, connections = [] }) {
    const { auth } = usePage().props;
    const [confirmingRemoval, setConfirmingRemoval] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [availableConnections, setAvailableConnections] = useState([]);
    const { triggerProps, tooltipProps, isVisible } = useTooltip();
    
    const form = useForm({
        user_id: '',
        role: 'member',
    });
    
    // Get the context ID based on the context type
    const contextId = contextType === 'workspace' 
        ? (context?.id || context?.data?.id) 
        : (context?.data?.id || context?.id);
    
    // Determine if the current user is the owner
    const isOwner = auth.user.id === (
        contextType === 'workspace' 
            ? (context?.data?.owner_id || context?.owner_id) 
            : (context?.data?.owner_id || context?.owner_id)
    );
    
    // Get the members array based on context type
    const members = contextType === 'workspace' ? context?.data?.members : context?.data?.members;
    
    // Filter connections to exclude existing members whenever the modal is shown
    useEffect(() => {
        if (show && Array.isArray(connections) && Array.isArray(members)) {
            const memberIds = members.map(member => member.id);
            const filteredConnections = connections.filter(connection => !memberIds.includes(connection.id));
            setAvailableConnections(filteredConnections);
        } else {
            setAvailableConnections([]);
        }
    }, [show, connections, context, members]);
    
    // Debug logging
    console.log('Context:', context);
    console.log('Context Type:', contextType);
    console.log('Context ID:', contextId);
    console.log('Members:', members);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Determine the correct route name based on context type
        const routeName = contextType === 'workspace' ? 'workspaces.members.add' : 'projects.members.store';
        
        axios.post(route(routeName, contextId), form.data)
            .then(response => {
                // First show the success message
                toast.success('Member added successfully');
                form.reset();
                
                // Then trigger Inertia reload and close modal after it's done
                router.reload({
                    preserveScroll: true,
                    onSuccess: () => {
                        onClose();
                    },
                    onError: () => {
                        // If reload fails, still close the modal but show an error
                        onClose();
                        toast.error('Member added but page refresh failed. Please reload the page.');
                    }
                });
            })
            .catch(error => {
                const message = error.response?.data?.message || 'Failed to add member';
                toast.error(message);
                setIsSubmitting(false);
            });
    };
    
    const confirmRemoveMember = (member) => {
        setConfirmingRemoval(member);
    };
    
    const handleRoleChange = (member, newRole) => {
        setIsSubmitting(true);
        
        // Determine the correct route name based on context type
        const routeName = contextType === 'workspace' ? 'workspaces.members.update-role' : 'projects.members.update-role';
        
        // Create the correct route parameters based on context type
        let routeParams;
        
        if (contextType === 'workspace') {
            routeParams = { 
                workspace: contextId, 
                member: member.id 
            };
        } else {
            // For projects
            routeParams = { 
                project: contextId, 
                member: member.id 
            };
        }
        
        axios.put(route(routeName, routeParams), { role: newRole })
            .then(response => {
                // Show success message
                toast.success('Member role updated successfully');
                
                // Reload the page to reflect changes
                router.reload({
                    preserveScroll: true,
                    onSuccess: () => {
                        // No need to close modal after role change
                    },
                    onError: () => {
                        toast.error('Role updated but page refresh failed. Please reload the page.');
                    }
                });
            })
            .catch(error => {
                const message = error.response?.data?.message || 'Failed to update member role';
                toast.error(message);
                console.error('Error updating member role:', error);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };
    
    const removeMember = () => {
        if (!confirmingRemoval) return;
        
        setIsSubmitting(true);
        
        // Determine the correct route name based on context type
        const routeName = contextType === 'workspace' ? 'workspaces.members.remove' : 'projects.members.destroy';
        
        // Create the correct route parameters based on context type
        let routeParams;
        
        if (contextType === 'workspace') {
            routeParams = { 
                workspace: contextId, 
                member: confirmingRemoval.id 
            };
        } else {
            // For projects, ensure we're using the correct ID
            routeParams = { 
                project: contextId, 
                member: confirmingRemoval.id 
            };
            
            // Debug the project ID
            console.log('Project ID for removal:', contextId);
            console.log('Route params:', routeParams);
        }
        
        axios.delete(route(routeName, routeParams))
            .then(response => {
                // First show the success message
                toast.success('Member removed successfully');
                setConfirmingRemoval(null);
                
                // Then trigger Inertia reload and close modal after it's done
                router.reload({
                    preserveScroll: true,
                    onSuccess: () => {
                        onClose();
                    },
                    onError: () => {
                        // If reload fails, still close the modal but show an error
                        onClose();
                        toast.error('Member removed but page refresh failed. Please reload the page.');
                    }
                });
            })
            .catch(error => {
                const message = error.response?.data?.message || 'Failed to remove member';
                toast.error(message);
                console.error('Error removing member:', error);
                setIsSubmitting(false);
            });
    };
    
    // Helper function to get the full name from a user's profile
    const getFullName = (user) => {
        if (!user) return 'Unknown User';
        
        const profile = user.academician || user.postgraduate || user.undergraduate;
        return profile?.full_name || user.name;
    };
    
    // Helper function to get the avatar URL from a user's profile
    const getAvatarUrl = (user) => {
        if (!user) return null;
        
        const profilePicPath = user.academician?.profile_picture || 
                              user.postgraduate?.profile_picture || 
                              user.undergraduate?.profile_picture;
        
        if (profilePicPath) {
            // Return the full path to the profile picture
            return `/storage/${profilePicPath}`;
        }
        
        return null;
    };
    
    // Get the title based on context type
    const title = contextType === 'workspace' ? 'Manage Workspace Members' : 'Manage Project Members';
    
    return (
        <>
            <Modal show={show} onClose={onClose} maxWidth="md">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">{title}</h2>
                    
                    {/* Current Members List */}
                    <div className="mb-8">
                        <h3 className="text-md font-medium text-gray-700 mb-3">Current Collaborators</h3>
                        
                        {members && members.length > 0 ? (
                            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                                {members
                                    .filter(member => {
                                        const ownerId = contextType === 'workspace' 
                                            ? (context?.data?.owner_id || context?.owner_id) 
                                            : (context?.data?.owner_id || context?.owner_id);
                                        return member.id !== ownerId;
                                    })
                                    .map(member => {
                                    // Determine if the member is the owner
                                    const isContextOwner = member.id === (
                                        contextType === 'workspace' 
                                            ? (context?.data?.owner_id || context?.owner_id) 
                                            : (context?.data?.owner_id || context?.owner_id)
                                    );
                                    // Get the avatar URL using the helper function
                                    const avatarUrl = getAvatarUrl(member);
                                    
                                    return (
                                        <div key={member.id} className="flex items-center justify-between bg-gray-50 py-3 px-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                                            {/* LEFT SIDE: User Identity */}
                                            <div className="flex items-center min-w-0">
                                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                                                    {avatarUrl ? (
                                                        <img src={avatarUrl} alt={getFullName(member)} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <span className="text-gray-500 text-sm">{getFullName(member).charAt(0)}</span>
                                                    )}
                                                </div>
                                                <div className="ml-3 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">{getFullName(member)}</p>
                                                    <p className="text-xs text-gray-500 capitalize">
                                                        {isContextOwner ? 'Owner' : member.pivot?.role || 'Member'}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            {/* RIGHT SIDE: Actions */}
                                            <div className="flex items-center space-x-3 flex-shrink-0 ml-4">
                                                {/* Role dropdown for non-owners */}
                                                {isOwner && !isContextOwner && (
                                                    <select
                                                        value={member.pivot?.role || 'member'}
                                                        onChange={(e) => handleRoleChange(member, e.target.value)}
                                                        className="text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                        disabled={isSubmitting}
                                                    >
                                                        <option value="member">Member</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                )}
                                            
                                                {/* Show remove button for non-owners */}
                                                {isOwner && !isContextOwner && (
                                                    <SecondaryButton
                                                        onClick={() => confirmRemoveMember(member)}
                                                        disabled={isSubmitting}
                                                        className="bg-red-50 text-red-600 hover:bg-red-100"
                                                    >
                                                        Remove
                                                    </SecondaryButton>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">No members yet.</p>
                        )}
                    </div>
                    
                    {/* Invite New Members Form */}
                    {isOwner && (
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
                                        <div className="flex items-center">
                                            <InputLabel htmlFor="role" value="Role" />
                                            <div className="relative ml-2 group">
                                                <Info 
                                                    className="w-4 h-4 text-gray-400 cursor-help" 
                                                    ref={triggerProps.ref}
                                                    onMouseEnter={triggerProps.onMouseEnter}
                                                    onMouseLeave={triggerProps.onMouseLeave}
                                                />
                                                <TooltipPortal isVisible={isVisible}>
                                                    <div className="bg-gray-800 text-white text-xs rounded py-2 px-3 w-64" {...tooltipProps}>
                                                        <p className="font-semibold mb-1">Admin:</p>
                                                        <p className="mb-2">Can manage members, boards, and workspace/project settings.</p>
                                                        <p className="font-semibold mb-1">Member:</p>
                                                        <p>Can create and edit content on boards they have access to.</p>
                                                        <div className="absolute bottom-0 right-0 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
                                                    </div>
                                                </TooltipPortal>
                                            </div>
                                        </div>
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
                message={confirmingRemoval ? `Are you sure you want to remove ${getFullName(confirmingRemoval)} from this ${contextType}?` : ''}
            />
        </>
    );
} 