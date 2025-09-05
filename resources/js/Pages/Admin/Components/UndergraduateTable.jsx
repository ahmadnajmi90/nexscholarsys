import React, { useState } from 'react';
import { FaSpinner, FaEnvelope, FaCheckCircle, FaChevronDown, FaChevronUp, FaExclamationCircle } from 'react-icons/fa';
import { Link, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';

const UndergraduateTable = ({
    undergraduates,
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


    
    const handleSendReminder = async (userId) => {
        setSentStatus(prev => ({ ...prev, [userId]: 'sending' }));
        
        try {
            await onSendReminder(userId, 'undergraduate');
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
            const allUserIds = undergraduates.map(user => user.id);
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
            await onSendBatchReminder(selectedUsers, 'undergraduate');
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
    
    // Function to toggle expanded view for research preferences
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
                            {selectedUsers.length} undergraduate{selectedUsers.length !== 1 ? 's' : ''} selected
                        </span>
                    ) : (
                        <span>No undergraduates selected</span>
                    )}
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={handleSendBatchReminder}
                        disabled={selectedUsers.length === 0 || batchSending || batchSent}
                        className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow-sm transition-colors ${
                            selectedUsers.length === 0 || batchSending || batchSent
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
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
                                <FaEnvelope className="mr-2 h-4 w-4" />
                                Send Reminders to Selected
                            </>
                        ) : batchSending ? (
                            'Sending Reminders...'
                        ) : (
                            'Reminders Sent!'
                        )}
                    </button>
                </div>
            </div>
            
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr className="bg-gray-50">
                                <th scope="col" className="relative w-12 px-4 sm:w-16 sm:px-6">
                                    <input
                                        type="checkbox"
                                        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 sm:left-6"
                                        checked={undergraduates && undergraduates.length > 0 && selectedUsers.length === undergraduates.length}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Undergraduate</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">University & Faculty</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Degree & Status</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Research Interest</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Profile Status</th>
                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {undergraduates && undergraduates.length > 0 ? (
                                undergraduates.map((user) => {
                                    const profile = user.undergraduate;
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
                                                    {profile?.bachelor || 'Degree not specified'}
                                                    {profile?.CGPA_bachelor && ` (CGPA: ${profile.CGPA_bachelor})`}
                                                </div>
                                                <div className="text-sm text-gray-500 mt-1">
                                                    {profile?.current_undergraduate_status || 'Status not specified'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-4">
                                            <div className="space-y-2">
                                                <div className="flex items-center">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        profile?.interested_do_research 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {profile?.interested_do_research ? 'Interested in Research' : 'Not Interested in Research'}
                                                    </span>
                                                </div>
                                                
                                                {profile?.research_preference ? (
                                                    <div>
                                                        <button 
                                                            onClick={() => toggleExpand(user.id)}
                                                            className="flex items-center justify-between w-full text-left text-sm font-medium text-blue-600 hover:text-blue-800"
                                                        >
                                                            <span>
                                                                {Array.isArray(profile.research_preference) 
                                                                    ? `${profile.research_preference.length} preference${profile.research_preference.length !== 1 ? 's' : ''}` 
                                                                    : 'Research preference'}
                                                            </span>
                                                            {isExpanded ? <FaChevronUp className="h-4 w-4 ml-1" /> : <FaChevronDown className="h-4 w-4 ml-1" />}
                                                        </button>
                                                        
                                                        {isExpanded && (
                                                            <div className="mt-2 bg-gray-50 p-2 rounded max-h-40 overflow-y-auto">
                                                                <div className="space-y-1 text-sm">
                                                                    {Array.isArray(profile.research_preference) 
                                                                        ? profile.research_preference.map((id, index) => {
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
                                                                                {typeof profile.research_preference === 'string' 
                                                                                    ? profile.research_preference 
                                                                                    : JSON.stringify(profile.research_preference)}
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
                                                        <span>No research preferences specified</span>
                                                    </div>
                                                )}
                                            </div>
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
                                            <p>No undergraduates found</p>
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
                            router.get(`${window.location.pathname}?undergraduates_page=${page}&tab=${currentTab}`, {
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

export default UndergraduateTable;