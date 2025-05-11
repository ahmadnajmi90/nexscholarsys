import React, { useState } from 'react';
import { FaSpinner, FaEnvelope, FaCheckCircle } from 'react-icons/fa';

const PostgraduateTable = ({ postgraduates, universities, faculties, onSendReminder, pagination }) => {
    const [sentStatus, setSentStatus] = useState({});
    
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
    
    // Function to render pagination controls
    const renderPagination = () => {
        return (
            <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-700">
                            Showing <span className="font-medium">{pagination.from || 0}</span> to <span className="font-medium">{pagination.to || 0}</span> of{' '}
                            <span className="font-medium">{pagination.total}</span> results
                        </p>
                    </div>
                    <div>
                        <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            {pagination.current_page > 1 && (
                                <a
                                    href={`?postgraduates_page=${pagination.current_page - 1}`}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                >
                                    Previous
                                </a>
                            )}
                            
                            {pagination.current_page < pagination.last_page && (
                                <a
                                    href={`?postgraduates_page=${pagination.current_page + 1}`}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                >
                                    Next
                                </a>
                            )}
                        </nav>
                    </div>
                </div>
            </div>
        );
    };
    
    return (
        <div className="mt-6">
            <h2 className="text-xl font-semibold mb-3">Postgraduates</h2>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">University</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Faculty</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Degree</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Research Field</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {postgraduates && postgraduates.length > 0 ? (
                            postgraduates.map((user) => {
                                const profile = user.postgraduate;
                                return (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {profile?.full_name || user.name || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.unique_id || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {profile?.university_id && universities[profile.university_id] 
                                            ? universities[profile.university_id].full_name 
                                            : profile?.universityDetails?.full_name || 'Not specified'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {profile?.faculty_id && faculties[profile.faculty_id] 
                                            ? faculties[profile.faculty_id].name 
                                            : profile?.faculty?.name || 'Not specified'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {profile?.master_type || profile?.previous_degree || 'Not specified'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {profile?.field_of_research 
                                            ? (typeof profile.field_of_research === 'string' 
                                                ? profile.field_of_research 
                                                : Array.isArray(profile.field_of_research) 
                                                    ? profile.field_of_research.join(', ')
                                                    : JSON.stringify(profile.field_of_research))
                                            : 'Not specified'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.is_profile_complete ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {user.is_profile_complete ? 'Complete' : 'Incomplete'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleSendReminder(user.id)}
                                            disabled={sentStatus[user.id] === 'sending' || sentStatus[user.id] === 'sent'}
                                            className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white ${
                                                sentStatus[user.id] === 'sending' || sentStatus[user.id] === 'sent' 
                                                    ? 'bg-gray-400 cursor-not-allowed' 
                                                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                                            }`}
                                        >
                                            {sentStatus[user.id] === 'sending' && (
                                                <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                            )}
                                            {sentStatus[user.id] === 'sent' && (
                                                <FaCheckCircle className="-ml-1 mr-2 h-4 w-4" />
                                            )}
                                            {sentStatus[user.id] !== 'sending' && sentStatus[user.id] !== 'sent' ? (
                                                <>
                                                    <FaEnvelope className="mr-2" />
                                                    Send Reminder
                                                </>
                                            ) : sentStatus[user.id] === 'sending' ? (
                                                'Sending...'
                                            ) : (
                                                'Sent!'
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            )})
                        ) : (
                            <tr>
                                <td colSpan="9" className="px-6 py-4 text-center text-sm text-gray-500">No postgraduates found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {renderPagination()}
            </div>
        </div>
    );
};

export default PostgraduateTable; 