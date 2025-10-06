import React, { useState } from 'react';
import { FaSpinner, FaEnvelope, FaCheckCircle, FaChevronDown, FaChevronUp, FaExclamationCircle, FaUserSlash, FaExclamationTriangle } from 'react-icons/fa';
import { Link, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import axios from 'axios';

const PostgraduateTable = ({
    postgraduates,
    researchOptions,
    onSendReminder,
    onSendBatchReminder,
    pagination,
    currentTab,
    loading
}) => {
    const [sentStatus, setSentStatus] = useState({});
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [batchSending, setBatchSending] = useState(false);
    const [batchSent, setBatchSent] = useState(false);
    const [expandedIds, setExpandedIds] = useState({});
    const [deactivateStatus, setDeactivateStatus] = useState({});
    const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(null);
    const [selectedBulkAction, setSelectedBulkAction] = useState('send_reminder');
    const [showBulkDeactivateConfirm, setShowBulkDeactivateConfirm] = useState(false);


    
    const handleSendReminder = async (userId) => {
        setSentStatus(prev => ({ ...prev, [userId]: 'sending' }));
        
        try {
            await onSendReminder(userId, 'postgraduate');
            setSentStatus(prev => ({ ...prev, [userId]: 'sent' }));
            
            // Reset status after 3 seconds
            setTimeout(() => {
                setSentStatus(prev => {
                    const newStatus = { ...prev };
                    delete newStatus[userId];
                    return newStatus;
                });
            }, 3000);
        } catch (error) {
            setSentStatus(prev => ({ ...prev, [userId]: 'error' }));
            
            // Reset status after 3 seconds
            setTimeout(() => {
                setSentStatus(prev => {
                    const newStatus = { ...prev };
                    delete newStatus[userId];
                    return newStatus;
                });
            }, 3000);
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allUserIds = postgraduates.map(user => user.id);
            setSelectedUsers(allUserIds);
        } else {
            setSelectedUsers([]);
        }
    };

    const handleSelectUser = (userId) => {
        setSelectedUsers(prev => {
            if (prev.includes(userId)) {
                return prev.filter(id => id !== userId);
            } else {
                return [...prev, userId];
            }
        });
    };

    const handleSendBatchReminder = async () => {
        if (selectedUsers.length === 0) return;
        
        setBatchSending(true);
        
        try {
            await onSendBatchReminder(selectedUsers, 'postgraduate');
            setBatchSending(false);
            setBatchSent(true);
            
            // Reset selected users and batch sent status after 3 seconds
            setTimeout(() => {
                setSelectedUsers([]);
                setBatchSent(false);
            }, 3000);
        } catch (error) {
            setBatchSending(false);
            // Handle error state if needed
        }
    };
    
    const handleBatchDeactivate = async () => {
        if (selectedUsers.length === 0) return;
        
        setShowBulkDeactivateConfirm(false);
        setBatchSending(true);
        
        try {
            await axios.post(route('admin.profiles.batch-deactivate'), {
                userIds: selectedUsers,
                role: 'postgraduate'
            });
            
            setBatchSending(false);
            setBatchSent(true);
            
            // Reload the page after 2 seconds
            setTimeout(() => {
                router.reload({ only: ['postgraduates'] });
                setSelectedUsers([]);
                setBatchSent(false);
            }, 2000);
        } catch (error) {
            console.error('Error batch deactivating users:', error);
            setBatchSending(false);
        }
    };
    
    const handleBulkAction = () => {
        if (selectedBulkAction === 'send_reminder') {
            handleSendBatchReminder();
        } else if (selectedBulkAction === 'deactivate') {
            setShowBulkDeactivateConfirm(true);
        }
    };
    
    const handleDeactivateUser = async (userId) => {
        setDeactivateStatus(prev => ({ ...prev, [userId]: 'deactivating' }));
        setShowDeactivateConfirm(null);
        
        try {
            await axios.post(route('admin.profiles.deactivate'), {
                userId: userId
            });
            
            setDeactivateStatus(prev => ({ ...prev, [userId]: 'deactivated' }));
            
            // Reload the page after 2 seconds
            setTimeout(() => {
                router.reload({ only: ['postgraduates'] });
            }, 2000);
        } catch (error) {
            console.error('Error deactivating user:', error);
            setDeactivateStatus(prev => ({ ...prev, [userId]: 'error' }));
            
            setTimeout(() => {
                setDeactivateStatus(prev => {
                    const newStatus = { ...prev };
                    delete newStatus[userId];
                    return newStatus;
                });
            }, 3000);
        }
    };
    
    // Function to toggle expanded view for research fields
    const toggleExpand = (id) => {
        setExpandedIds(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };
    

        
        return (
        <div className="relative">
    
            <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-sm font-medium text-gray-500">
                    {selectedUsers.length > 0 ? (
                        <span className="inline-flex items-center px-3 py-1.5 rounded-md bg-blue-50 text-blue-700">
                            {selectedUsers.length} postgraduate{selectedUsers.length !== 1 ? 's' : ''} selected
                        </span>
                    ) : (
                        <span>No postgraduates selected</span>
                    )}
                </div>
                <div className="flex items-center space-x-2">
                    {/* Bulk Action Dropdown */}
                    <select
                        value={selectedBulkAction}
                        onChange={(e) => setSelectedBulkAction(e.target.value)}
                        className="block py-2 pl-3 pr-10 text-sm border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        disabled={selectedUsers.length === 0}
                    >
                        <option value="send_reminder">Send Reminder</option>
                        <option value="deactivate">Deactivate Accounts</option>
                    </select>
                    
                    {/* Execute Bulk Action Button */}
                    <button
                        onClick={handleBulkAction}
                        disabled={selectedUsers.length === 0 || batchSending || batchSent}
                        className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow-sm transition-colors ${
                            selectedUsers.length === 0 || batchSending || batchSent
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                : selectedBulkAction === 'deactivate'
                                ? 'bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                                : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                        }`}
                    >
                        {batchSending && (
                            <FaSpinner className="animate-spin -ml-0.5 mr-2 h-4 w-4" />
                        )}
                        {batchSent && (
                            <FaCheckCircle className="-ml-0.5 mr-2 h-4 w-4" />
                        )}
                        {!batchSending && !batchSent ? (
                            <>
                                {selectedBulkAction === 'send_reminder' ? (
                                    <>
                                        <FaEnvelope className="mr-2 h-4 w-4" />
                                        Send to Selected
                                    </>
                                ) : (
                                    <>
                                        <FaUserSlash className="mr-2 h-4 w-4" />
                                        Deactivate Selected
                                    </>
                                )}
                            </>
                        ) : batchSending ? (
                            selectedBulkAction === 'send_reminder' ? 'Sending...' : 'Deactivating...'
                        ) : (
                            selectedBulkAction === 'send_reminder' ? 'Sent!' : 'Deactivated!'
                        )}
                    </button>
                </div>
            </div>
            
            {/* Bulk Deactivate Confirmation Modal */}
            {showBulkDeactivateConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <div className="flex items-center mb-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                <FaExclamationTriangle className="h-6 w-6 text-red-600" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Confirm Batch Deactivation
                                </h3>
                            </div>
                        </div>
                        <div className="mb-6">
                            <p className="text-sm text-gray-600 mb-3">
                                You are about to deactivate <span className="font-bold text-red-600">{selectedUsers.length}</span> postgraduate account{selectedUsers.length !== 1 ? 's' : ''}.
                            </p>
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-3">
                                <p className="text-sm text-yellow-800">
                                    <strong>Warning:</strong> This action will:
                                </p>
                                <ul className="list-disc list-inside text-sm text-yellow-700 mt-2 space-y-1">
                                    <li>Delete all role profiles</li>
                                    <li>Remove embeddings from Qdrant</li>
                                    <li>Reset unique IDs to null</li>
                                    <li>Mark profiles as incomplete</li>
                                </ul>
                            </div>
                            <p className="text-sm text-gray-600">
                                This is a <strong>destructive action</strong>. Are you sure you want to continue?
                            </p>
                        </div>
                        <div className="flex items-center justify-end space-x-3">
                            <button
                                onClick={() => setShowBulkDeactivateConfirm(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleBatchDeactivate}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                Yes, Deactivate {selectedUsers.length} Account{selectedUsers.length !== 1 ? 's' : ''}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr className="bg-gray-50">
                                <th scope="col" className="relative w-12 px-4 sm:w-16 sm:px-6">
                                    <input
                                        type="checkbox"
                                        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 sm:left-6"
                                        checked={postgraduates && postgraduates.length > 0 && selectedUsers.length === postgraduates.length}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Postgraduate</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">University & Faculty</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Degree & Status</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Research Field</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Profile Status</th>
                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {postgraduates && postgraduates.length > 0 ? (
                                postgraduates.map((user) => {
                                    const profile = user.postgraduate;
                                    const isExpanded = expandedIds[user.id] || false;
                                    return (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="relative w-12 px-4 sm:w-16 sm:px-6">
                                            <input
                                                type="checkbox"
                                                className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 sm:left-6"
                                                checked={selectedUsers.includes(user.id)}
                                                onChange={() => handleSelectUser(user.id)}
                                            />
                                        </td>
                                        <td className="whitespace-nowrap py-4 pl-3 pr-3 text-sm">
                                            <div className="flex items-start space-x-3">
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium text-gray-900">{profile?.full_name || user.name || 'N/A'}</div>
                                                    <div className="text-gray-500 mt-1">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-4">
                                            <div className="flex flex-col">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {profile?.university_details?.full_name || 'Not specified'}
                                                </div>
                                                <div className="text-sm text-gray-500 mt-1">
                                                    {profile?.faculty?.name || 'Faculty not specified'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-4">
                                            <div className="flex flex-col">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {profile?.master_type
                                                        ? Array.isArray(profile.master_type)
                                                            ? `${profile.master_type.join(', ')} Master`
                                                            : `${profile.master_type} Master`
                                                        : profile?.previous_degree
                                                            ? Array.isArray(profile.previous_degree)
                                                                ? profile.previous_degree.join(', ')
                                                                : profile.previous_degree
                                                            : 'Degree not specified'
                                                    }
                                                </div>
                                                <div className="text-sm text-gray-500 mt-1">
                                                    {profile?.current_postgraduate_status || 'Status not specified'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-4">
                                            {profile?.field_of_research ? (
                                                <div>
                                                    <button 
                                                        onClick={() => toggleExpand(user.id)}
                                                        className="flex items-center justify-between w-full text-left text-sm font-medium text-blue-600 hover:text-blue-800"
                                                    >
                                                        <span>
                                                            {Array.isArray(profile.field_of_research) 
                                                                ? `${profile.field_of_research.length} field${profile.field_of_research.length !== 1 ? 's' : ''}` 
                                                                : 'Research field'}
                                                        </span>
                                                        {isExpanded ? <FaChevronUp className="h-4 w-4 ml-1" /> : <FaChevronDown className="h-4 w-4 ml-1" />}
                                                    </button>
                                                    
                                                    {isExpanded && (
                                                        <div className="mt-2 bg-gray-50 p-2 rounded max-h-40 overflow-y-auto">
                                                            <div className="space-y-1 text-sm">
                                                                {Array.isArray(profile.field_of_research) 
                                                                    ? profile.field_of_research.map((id, index) => {
                                                                        const matchedOption = researchOptions.find(
                                                                            (option) =>
                                                                                `${option.field_of_research_id}-${option.research_area_id}-${option.niche_domain_id}` === id
                                                                        );
                                                                        
                                                                        if (matchedOption) {
                                                                            return (
                                                                                <div key={index} className="text-gray-700 flex">
                                                                                    <span className="text-gray-400 mr-1.5">{index + 1}.</span>
                                                                                    <span>{matchedOption.field_of_research_name} - {matchedOption.research_area_name} - {matchedOption.niche_domain_name}</span>
                                                                                </div>
                                                                            );
                                                                        }
                                                                        return (
                                                                            <div key={index} className="text-gray-700 flex">
                                                                                <span className="text-gray-400 mr-1.5">{index + 1}.</span>
                                                                                <span>{typeof id === 'string' ? id : JSON.stringify(id)}</span>
                                                                            </div>
                                                                        );
                                                                    })
                                                                    : (
                                                                        <div className="text-gray-700">
                                                                            {typeof profile.field_of_research === 'string' 
                                                                                ? profile.field_of_research 
                                                                                : JSON.stringify(profile.field_of_research)}
                                                                        </div>
                                                                    )
                                                                }
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="flex items-center text-gray-500 italic">
                                                    <FaExclamationCircle className="text-yellow-500 mr-1.5 h-4 w-4" />
                                                    <span>Not specified</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-3 py-4">
                                            <div className="flex items-center">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    profile?.profile_status === 'Complete' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-orange-100 text-orange-800'
                                                }`}>
                                                    {profile?.profile_status || 'Needs Update'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                            <button
                                                onClick={() => handleSendReminder(user.id)}
                                                disabled={sentStatus[user.id] === 'sending' || sentStatus[user.id] === 'sent'}
                                                className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-medium shadow-sm ${
                                                    sentStatus[user.id] === 'sending' || sentStatus[user.id] === 'sent' 
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                        : 'bg-white text-blue-600 hover:bg-blue-50 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                                                }`}
                                            >
                                                {sentStatus[user.id] === 'sending' ? (
                                                    <>
                                                        <FaSpinner className="animate-spin mr-1.5 -ml-0.5 h-4 w-4" />
                                                        Sending...
                                                    </>
                                                ) : sentStatus[user.id] === 'sent' ? (
                                                    <>
                                                        <FaCheckCircle className="mr-1.5 -ml-0.5 h-4 w-4 text-green-500" />
                                                        Sent
                                                    </>
                                                ) : sentStatus[user.id] === 'error' ? (
                                                    <>
                                                        <FaExclamationCircle className="mr-1.5 -ml-0.5 h-4 w-4 text-red-500" />
                                                        Error
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaEnvelope className="mr-1.5 -ml-0.5 h-4 w-4" />
                                                        Send
                                                    </>
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="6" className="py-8 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-500">
                                            <FaExclamationCircle className="h-8 w-8 text-gray-400 mb-2" />
                                            <p>No postgraduates found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {/* Loading overlay */}
            {loading && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <FaSpinner className="animate-spin text-blue-500" />
                        <span className="text-gray-600">Loading...</span>
                    </div>
                </div>
            )}

            {/* Pagination controls */}
            {pagination && pagination.last_page > 1 && (
                <div className="mt-6">
                    <Pagination
                        currentPage={pagination.current_page || 1}
                        totalPages={pagination.last_page || 1}
                        onPageChange={(page) => {
                            router.get(`${window.location.pathname}?postgraduates_page=${page}&tab=${currentTab}`, {
                                preserveState: true,
                                replace: true
                            });
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default PostgraduateTable;