import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { usePage } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import toast from 'react-hot-toast';
import { FaCheck } from 'react-icons/fa';

const ManageTagsModal = ({ show, onClose, connectionIds }) => {
    const { auth } = usePage().props;
    const [availableTags, setAvailableTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [currentTags, setCurrentTags] = useState([]);
    const isAcademician = !!auth.user.academician;

    // Fetch available tags when modal opens
    useEffect(() => {
        if (show) {
            fetchAvailableTags();
            
            // If we're editing a single connection, fetch its current tags
            if (connectionIds.length === 1) {
                fetchConnectionTags(connectionIds[0]);
            } else {
                // Reset selected tags for bulk operations
                setSelectedTags([]);
                setCurrentTags([]);
            }
        }
    }, [show, connectionIds]);

    const fetchAvailableTags = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/connection-tags');
            setAvailableTags(response.data);
        } catch (error) {
            console.error('Error fetching tags:', error);
            toast.error('Failed to load tags');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchConnectionTags = async (connectionId) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`/connections/${connectionId}/tags`);
            setCurrentTags(response.data);
            setSelectedTags(response.data.map(tag => tag.id));
        } catch (error) {
            console.error('Error fetching connection tags:', error);
            toast.error('Failed to load connection tags');
        } finally {
            setIsLoading(false);
        }
    };

    const handleTagToggle = (tagId) => {
        setSelectedTags(prevSelectedTags => {
            if (prevSelectedTags.includes(tagId)) {
                return prevSelectedTags.filter(id => id !== tagId);
            } else {
                return [...prevSelectedTags, tagId];
            }
        });
    };

    const handleSubmit = async () => {
        setIsSaving(true);
        try {
            // Log the request for debugging
            console.log('Sending request to assign tags:', {
                connection_ids: connectionIds,
                tag_ids: selectedTags
            });
            
            // Use axios with full URL to avoid any routing issues
            await axios.post('/connections/tags', {
                connection_ids: connectionIds,
                tag_ids: selectedTags
            }, {
                withCredentials: true,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            
            toast.success(connectionIds.length > 1 
                ? 'Tags updated for selected connections' 
                : 'Tags updated for connection');
            onClose();
        } catch (error) {
            console.error('Error saving tags:', error);
            console.log('Request details:', {
                url: '/connections/tags',
                data: {
                    connection_ids: connectionIds,
                    tag_ids: selectedTags
                }
            });
            toast.error('Failed to update tags');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal
            show={show}
            onClose={onClose}
            maxWidth="md"
        >
            <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                    {connectionIds.length > 1 ? 'Manage Tags for Selected Connections' : 'Manage Connection Tags'}
                </h2>
                
                {isLoading ? (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <>
                        <p className="text-sm text-gray-600 mb-4">
                            {connectionIds.length > 1 
                                ? `Select tags to apply to ${connectionIds.length} connections.` 
                                : 'Select tags to categorize this connection.'}
                        </p>
                        
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                            {availableTags.map(tag => {
                                // Hide Student tag if user is not an academician
                                if (tag.name === 'Student' && !isAcademician) {
                                    return null;
                                }
                                
                                return (
                                    <div key={tag.id} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={`tag-${tag.id}`}
                                            checked={selectedTags.includes(tag.id)}
                                            onChange={() => handleTagToggle(tag.id)}
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label htmlFor={`tag-${tag.id}`} className="ml-2 block text-sm text-gray-900">
                                            {tag.name}
                                            {tag.is_default && (
                                                <span className="ml-2 text-xs text-gray-500">(Default)</span>
                                            )}
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
                        
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isSaving}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSaving ? (
                                    <>
                                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <FaCheck className="mr-2" />
                                        Save Tags
                                    </>
                                )}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
};

export default ManageTagsModal;