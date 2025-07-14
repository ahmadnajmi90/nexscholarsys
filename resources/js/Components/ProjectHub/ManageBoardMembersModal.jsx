import React, { useState, useEffect } from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { UserCheck, UserX } from 'lucide-react';

export default function ManageBoardMembersModal({ show, onClose, board, workspaceMembers }) {
    const [selectedMemberIds, setSelectedMemberIds] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Initialize selected members when the modal opens or board changes
    useEffect(() => {
        if (show && board && board.members) {
            setSelectedMemberIds(board.members.map(member => member.id));
        }
    }, [show, board]);
    
    // Handle checkbox change
    const handleMemberToggle = (memberId) => {
        setSelectedMemberIds(prevIds => {
            if (prevIds.includes(memberId)) {
                return prevIds.filter(id => id !== memberId);
            } else {
                return [...prevIds, memberId];
            }
        });
    };
    
    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        axios.post(route('api.boards.syncMembers', board.id), {
            user_ids: selectedMemberIds
        })
        .then(response => {
            toast.success('Board access updated successfully');
            onClose();
        })
        .catch(error => {
            const message = error.response?.data?.message || 'Failed to update board access';
            toast.error(message);
        })
        .finally(() => {
            setIsSubmitting(false);
        });
    };
    
    // Helper function to get full name from user profile
    const getFullName = (user) => {
        if (!user) return 'Unknown User';
        
        const profile = user.academician || user.postgraduate || user.undergraduate;
        return profile?.full_name || user.name;
    };
    
    // Helper function to get avatar URL from user profile
    const getAvatarUrl = (user) => {
        if (!user) return null;
        
        const profilePicPath = user.academician?.profile_picture || 
                              user.postgraduate?.profile_picture || 
                              user.undergraduate?.profile_picture;
        
        if (profilePicPath) {
            return `/storage/${profilePicPath}`;
        }
        
        return null;
    };
    
    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6">Manage Board Access</h2>
                
                <p className="text-sm text-gray-600 mb-4">
                    Select which workspace members should have access to the <strong>{board?.name}</strong> board.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-2 max-h-80 overflow-y-auto">
                        {workspaceMembers && workspaceMembers.length > 0 ? (
                            <div className="space-y-2">
                                {workspaceMembers.map(member => (
                                    <div 
                                        key={member.id} 
                                        className={`flex items-center justify-between p-3 rounded-lg ${
                                            selectedMemberIds.includes(member.id) 
                                                ? 'bg-indigo-50 border border-indigo-100' 
                                                : 'bg-white border border-gray-100'
                                        }`}
                                    >
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                                {getAvatarUrl(member) ? (
                                                    <img 
                                                        src={getAvatarUrl(member)} 
                                                        alt={getFullName(member)} 
                                                        className="h-full w-full object-cover" 
                                                    />
                                                ) : (
                                                    <span className="text-gray-500 text-sm">
                                                        {getFullName(member).charAt(0)}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-900">{getFullName(member)}</p>
                                                <p className="text-xs text-gray-500">
                                                    {member.pivot?.role || 'Member'}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center">
                                            <label className="inline-flex items-center cursor-pointer">
                                                <input 
                                                    type="checkbox"
                                                    className="sr-only"
                                                    checked={selectedMemberIds.includes(member.id)}
                                                    onChange={() => handleMemberToggle(member.id)}
                                                    disabled={isSubmitting}
                                                />
                                                {selectedMemberIds.includes(member.id) ? (
                                                    <span className="p-1.5 text-indigo-600 bg-indigo-100 rounded-md">
                                                        <UserCheck className="w-5 h-5" />
                                                    </span>
                                                ) : (
                                                    <span className="p-1.5 text-gray-400 bg-gray-100 hover:bg-gray-200 rounded-md">
                                                        <UserX className="w-5 h-5" />
                                                    </span>
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center p-4">
                                <p className="text-gray-500">No workspace members available.</p>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                        <SecondaryButton onClick={onClose} disabled={isSubmitting}>
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
} 