import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { FaUserFriends, FaUserPlus, FaUserClock, FaSearch } from 'react-icons/fa';
import { MoreVertical } from 'lucide-react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import ConfirmationModal from '@/Components/ConfirmationModal';
import ConnectionButton from '@/Components/ConnectionButton';
import Dropdown from '@/Components/Dropdown';

const MyConnections = ({ acceptedConnections, receivedRequests, sentRequests }) => {
    const [activeTab, setActiveTab] = useState('connections');
    const [searchQuery, setSearchQuery] = useState('');
    const [processingIds, setProcessingIds] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [connectionToRemove, setConnectionToRemove] = useState(null);
    
    // Helper function to get the correct profile URL based on user's role
    const getProfileUrl = (user) => {
        if (user.academician) return route('academicians.show', user.academician.url);
        if (user.postgraduate) return route('postgraduates.show', user.postgraduate.url);
        if (user.undergraduate) return route('undergraduates.show', user.undergraduate.url);
        return '#'; // Fallback
    };
    
    // Function to prompt for connection removal
    const promptForRemoval = (connection) => {
        setConnectionToRemove(connection);
        setIsModalOpen(true);
    };
    
    // Function to handle connection removal after confirmation
    const handleRemoveConnection = () => {
        if (!connectionToRemove) return;
        
        const connectionId = connectionToRemove.connection_id;
        setProcessingIds(prev => [...prev, connectionId]);
        
        router.delete(route('connections.destroy', connectionId), {}, {
            onSuccess: () => {
                // Refresh the page to update the lists
                router.reload({ only: ['acceptedConnections', 'receivedRequests', 'sentRequests'] });
            },
            onFinish: () => {
                setProcessingIds(prev => prev.filter(id => id !== connectionId));
                setIsModalOpen(false);
                setConnectionToRemove(null);
            }
        });
    };
    
    // Filter connections based on search query
    const filterConnections = (connections) => {
        if (!searchQuery) return connections;
        
        return connections.filter(conn => 
            conn.user.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };
    
    const handleConnectionAction = (connectionId, action) => {
        // For non-destroy actions
        if (action !== 'destroy') {
        setProcessingIds(prev => [...prev, connectionId]);
        
        const url = route(`connections.${action}`, connectionId);
        const method = action === 'accept' ? 'patch' : 'delete';
        
        router[method](url, {}, {
            onSuccess: () => {
                // Refresh the page to update the lists
                router.reload({ only: ['acceptedConnections', 'receivedRequests', 'sentRequests'] });
            },
            onFinish: () => {
                setProcessingIds(prev => prev.filter(id => id !== connectionId));
            }
        });
        } else {
            // For destroy action, prompt for confirmation
            const connection = [...acceptedConnections, ...sentRequests, ...receivedRequests]
                .find(conn => conn.connection_id === connectionId);
            
            if (connection) {
                promptForRemoval({ connection_id: connectionId });
            }
        }
    };
    
    const renderTabs = () => {
        return (
            <div className="border-b border-gray-200">
                <nav className="flex overflow-x-auto scrollbar-hide" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('connections')}
                        className={`py-4 px-2 md:px-4 border-b-2 font-medium text-sm whitespace-nowrap flex-shrink-0 ${
                            activeTab === 'connections'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        <div className="flex items-center">
                            <FaUserFriends className="mr-1 md:mr-2" />
                            <span className="hidden sm:inline">Connections</span>
                            <span className="sm:hidden">Connect</span>
                            <span className="ml-1 md:ml-2 bg-gray-100 text-gray-700 py-0.5 px-1.5 md:px-2.5 rounded-full text-xs">
                                {acceptedConnections.length}
                            </span>
                        </div>
                    </button>
                    
                    <button
                        onClick={() => setActiveTab('received')}
                        className={`py-4 px-2 md:px-4 border-b-2 font-medium text-sm whitespace-nowrap flex-shrink-0 ${
                            activeTab === 'received'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        <div className="flex items-center">
                            <FaUserPlus className="mr-1 md:mr-2" />
                            <span className="hidden sm:inline">Received Requests</span>
                            <span className="sm:hidden">Received</span>
                            <span className="ml-1 md:ml-2 bg-gray-100 text-gray-700 py-0.5 px-1.5 md:px-2.5 rounded-full text-xs">
                                {receivedRequests.length}
                            </span>
                        </div>
                    </button>
                    
                    <button
                        onClick={() => setActiveTab('sent')}
                        className={`py-4 px-2 md:px-4 border-b-2 font-medium text-sm whitespace-nowrap flex-shrink-0 ${
                            activeTab === 'sent'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        <div className="flex items-center">
                            <FaUserClock className="mr-1 md:mr-2" />
                            <span className="hidden sm:inline">Sent Requests</span>
                            <span className="sm:hidden">Sent</span>
                            <span className="ml-1 md:ml-2 bg-gray-100 text-gray-700 py-0.5 px-1.5 md:px-2.5 rounded-full text-xs">
                                {sentRequests.length}
                            </span>
                        </div>
                    </button>
                </nav>
            </div>
        );
    };
    
    const renderSearchBar = () => {
        return (
            <div className="relative w-full md:w-96 w-[25rem] mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Search connections..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        );
    };

    const renderMobileActionMenu = (connection) => {
        const { user, connection_id } = connection;
        const isProcessing = processingIds.includes(connection_id);

        return (
            <div className="md:hidden">
                <Dropdown>
                    <Dropdown.Trigger>
                        <button
                            className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isProcessing}
                        >
                            <MoreVertical className="w-5 h-5 text-gray-500" />
                        </button>
                    </Dropdown.Trigger>

                    <Dropdown.Content align="right" width="48">
                        {/* View Profile - Always available */}
                        <Dropdown.Link href={getProfileUrl(user)}>
                            View Profile
                        </Dropdown.Link>

                        {/* Tab-specific actions */}
                        {activeTab === 'connections' && (
                            <button
                                onClick={() => promptForRemoval({ connection_id })}
                                disabled={isProcessing}
                                className="block w-full px-4 py-2 text-start text-sm text-red-600 hover:bg-red-50 focus:bg-red-50 focus:outline-none disabled:opacity-50"
                            >
                                {isProcessing ? 'Processing...' : 'Remove Connection'}
                            </button>
                        )}

                        {activeTab === 'received' && (
                            <>
                                <button
                                    onClick={() => handleConnectionAction(connection_id, 'accept')}
                                    disabled={isProcessing}
                                    className="block w-full px-4 py-2 text-start text-sm text-green-600 hover:bg-green-50 focus:bg-green-50 focus:outline-none disabled:opacity-50"
                                >
                                    {isProcessing ? 'Processing...' : 'Accept Request'}
                                </button>
                                <button
                                    onClick={() => handleConnectionAction(connection_id, 'reject')}
                                    disabled={isProcessing}
                                    className="block w-full px-4 py-2 text-start text-sm text-red-600 hover:bg-red-50 focus:bg-red-50 focus:outline-none disabled:opacity-50"
                                >
                                    {isProcessing ? 'Processing...' : 'Reject Request'}
                                </button>
                            </>
                        )}

                        {activeTab === 'sent' && (
                            <button
                                onClick={() => promptForRemoval({ connection_id })}
                                disabled={isProcessing}
                                className="block w-full px-4 py-2 text-start text-sm text-red-600 hover:bg-red-50 focus:bg-red-50 focus:outline-none disabled:opacity-50"
                            >
                                {isProcessing ? 'Processing...' : 'Cancel Request'}
                            </button>
                        )}
                    </Dropdown.Content>
                </Dropdown>
            </div>
        );
    };
    
    const renderConnectionCard = (connection) => {
        const { user, connection_id, status } = connection;
        const isProcessing = processingIds.includes(connection_id);
        
        return (
            <div key={connection_id} className="bg-white shadow rounded-lg p-4 mb-4">
                {/* Mobile Layout: Vertical Card */}
                <div className="md:hidden">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center flex-1 min-w-0">
                            <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                {user.profile_photo_url ? (
                                    <img 
                                        src={user.profile_photo_url} 
                                        alt={`${user.name}'s profile`}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-blue-100 text-blue-500">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            
                            <div className="ml-3 flex-1 min-w-0">
                                <h3 className="text-base font-medium text-gray-900 truncate">{user.name}</h3>
                                <p className="text-sm text-gray-500 truncate">{user.email}</p>
                                {user.role && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                                        {user.role}
                                    </span>
                                )}
                            </div>
                        </div>
                        
                        {/* Mobile Actions Menu */}
                        {renderMobileActionMenu(connection)}
                    </div>

                    {/* Mobile Primary Actions (for received requests) */}
                    {activeTab === 'received' && (
                        <div className="flex space-x-2 mt-3">
                            <button
                                onClick={() => handleConnectionAction(connection_id, 'accept')}
                                disabled={isProcessing}
                                className={`flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                    isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {isProcessing ? 'Processing...' : 'Accept'}
                            </button>
                            
                            <button
                                onClick={() => handleConnectionAction(connection_id, 'reject')}
                                disabled={isProcessing}
                                className={`flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                    isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {isProcessing ? 'Processing...' : 'Reject'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Desktop Layout: Horizontal Card */}
                <div className="hidden md:flex md:items-center md:justify-between">
                    <div className="flex items-center">
                        <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                            {user.profile_photo_url ? (
                                <img 
                                    src={user.profile_photo_url} 
                                    alt={`${user.name}'s profile`}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center bg-blue-100 text-blue-500">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            {user.role && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                                    {user.role}
                                </span>
                            )}
                        </div>
                    </div>
                    
                    {/* Desktop Action Buttons */}
                    <div className="flex space-x-2">
                        {activeTab === 'connections' && (
                            <button
                                onClick={() => promptForRemoval({ connection_id })}
                                disabled={isProcessing}
                                className={`inline-flex items-center px-3 py-2 border border-red-300 text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                                    isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {isProcessing ? 'Processing...' : 'Remove Connection'}
                            </button>
                        )}
                        
                        {activeTab === 'received' && (
                            <>
                                <button
                                    onClick={() => handleConnectionAction(connection_id, 'accept')}
                                    disabled={isProcessing}
                                    className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                        isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                >
                                    {isProcessing ? 'Processing...' : 'Accept'}
                                </button>
                                
                                <button
                                    onClick={() => handleConnectionAction(connection_id, 'reject')}
                                    disabled={isProcessing}
                                    className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                                        isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                >
                                    {isProcessing ? 'Processing...' : 'Reject'}
                                </button>
                            </>
                        )}
                        
                        {activeTab === 'sent' && (
                            <button
                                onClick={() => promptForRemoval({ connection_id })}
                                disabled={isProcessing}
                                className={`inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                    isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {isProcessing ? 'Processing...' : 'Cancel Request'}
                            </button>
                        )}
                        
                        <Link
                            href={getProfileUrl(user)}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            View Profile
                        </Link>
                    </div>
                </div>
            </div>
        );
    };
    
    const renderEmptyState = (message) => {
        return (
            <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 text-gray-400">
                    <FaUserFriends className="h-full w-full" />
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">{message}</h3>
            </div>
        );
    };
    
    const renderContent = () => {
        switch (activeTab) {
            case 'connections':
                const filteredConnections = filterConnections(acceptedConnections);
                return (
                    <div className="mt-6">
                        {filteredConnections.length > 0 ? (
                            filteredConnections.map(connection => renderConnectionCard(connection))
                        ) : (
                            renderEmptyState(searchQuery ? 'No connections match your search' : 'You have no connections yet')
                        )}
                    </div>
                );
                
            case 'received':
                const filteredReceived = filterConnections(receivedRequests);
                return (
                    <div className="mt-6">
                        {filteredReceived.length > 0 ? (
                            filteredReceived.map(connection => renderConnectionCard(connection))
                        ) : (
                            renderEmptyState(searchQuery ? 'No requests match your search' : 'You have no pending requests')
                        )}
                    </div>
                );
                
            case 'sent':
                const filteredSent = filterConnections(sentRequests);
                return (
                    <div className="mt-6">
                        {filteredSent.length > 0 ? (
                            filteredSent.map(connection => renderConnectionCard(connection))
                        ) : (
                            renderEmptyState(searchQuery ? 'No requests match your search' : 'You have no sent requests')
                        )}
                    </div>
                );
                
            default:
                return null;
        }
    };
    
    return (
        <MainLayout title="My Network">
            <Head title="My Network" />
            
            <div className="md:mt-6 px-2 md:px-0 mt-20 ml-1">
                {renderSearchBar()}
                {renderTabs()}
                {renderContent()}
            </div>
            
            <ConfirmationModal
                show={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleRemoveConnection}
                title="Remove Connection"
                message="Are you sure you want to remove this connection? This action cannot be undone."
                confirmButtonText="Remove"
            />
        </MainLayout>
    );
};

export default MyConnections; 