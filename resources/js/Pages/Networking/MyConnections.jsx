import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { FaUserFriends, FaUserPlus, FaUserClock, FaSearch, FaTags } from 'react-icons/fa';
import { MoreVertical, CheckSquare, Tags, Trash2, Eye, X, Plus, Info, GraduationCap, Users } from 'lucide-react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import ConfirmationModal from '@/Components/ConfirmationModal';
import ConnectionButton from '@/Components/ConnectionButton';
import Dropdown from '@/Components/Dropdown';
import ManageTagsModal from '@/Components/Networking/ManageTagsModal';
import CreateTagModal from '@/Components/Networking/CreateTagModal';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const MyConnections = ({ acceptedConnections, receivedRequests, sentRequests, tags = [], activeTagId = null }) => {
    const [activeTab, setActiveTab] = useState('connections');
    const [searchQuery, setSearchQuery] = useState('');
    const [processingIds, setProcessingIds] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [connectionToRemove, setConnectionToRemove] = useState(null);
    const [selectedConnections, setSelectedConnections] = useState([]);
    const [isTagModalOpen, setIsTagModalOpen] = useState(false);
    const [isCreateTagModalOpen, setIsCreateTagModalOpen] = useState(false);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedConnectionForTags, setSelectedConnectionForTags] = useState(null);
    const [availableTags, setAvailableTags] = useState(tags);
    
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
    const handleRemoveConnection = async () => {
        if (!connectionToRemove) return;
        
        const connectionId = connectionToRemove.connection_id;
        setProcessingIds(prev => [...prev, connectionId]);
        
        try {
            // Step 1: Make the API call with axios
            await axios.delete(route('api.app.connections.destroy', connectionId));
            
            // Step 2: On success, show a direct success toast
            toast.success('Connection removed successfully.');
            
            // Step 3: Manually reload the connection data
            router.reload({ only: ['acceptedConnections', 'receivedRequests', 'sentRequests'] });
            
        } catch (error) {
            // Step 4: Handle errors directly from the axios response
            if (error.response) {
                if (error.response.status === 404) {
                    toast.error('Connection not found. It may have been already removed.');
                    // Refresh the list to update the UI
                    router.reload({ only: ['acceptedConnections', 'receivedRequests', 'sentRequests'] });
                } else if (error.response.status === 403) {
                    toast.error('You do not have permission to remove this connection.');
                } else if (error.response.data?.error) {
                    toast.error(error.response.data.error);
                } else if (error.response.data?.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error(`Error (${error.response.status}): Unable to remove connection.`);
                }
            } else {
                toast.error('Network error or server not responding.');
            }
            console.error('Error removing connection:', error);
        } finally {
            // Step 5: Always close the confirmation modal and clean up state
            setIsModalOpen(false);
            setConnectionToRemove(null);
            setSelectedConnections([]);
            setProcessingIds(prev => prev.filter(id => id !== connectionId));
        }
    };
    
    // Function to handle checkbox selection for a connection
    const handleConnectionSelect = (connectionId) => {
        setSelectedConnections(prev => {
            if (prev.includes(connectionId)) {
                return prev.filter(id => id !== connectionId);
            } else {
                return [...prev, connectionId];
            }
        });
    };
    
    // Function to handle select all checkbox
    const handleSelectAll = () => {
        if (selectAll) {
            // If already all selected, deselect all
            setSelectedConnections([]);
        } else {
            // Otherwise, select all filtered connections
            const filteredConnections = filterConnections(acceptedConnections);
            setSelectedConnections(filteredConnections.map(conn => conn.connection_id));
        }
        setSelectAll(!selectAll);
    };
    
    // Function to open tag management modal for a single connection
    const handleManageTags = (connectionId) => {
        setSelectedConnections([connectionId]);
        setSelectedConnectionForTags(connectionId);
        setIsTagModalOpen(true);
    };
    
    // Function to open tag management modal for bulk selected connections
    const handleBulkManageTags = () => {
        setSelectedConnectionForTags(null);
        setIsTagModalOpen(true);
    };
    
    // Reset selections when changing tabs
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSelectedConnections([]);
        setSelectAll(false);
    };
    
    // Filter connections based on search query
    const filterConnections = (connections) => {
        if (!searchQuery) return connections.data || connections;
        
        const dataToFilter = connections.data || connections;
        
        return dataToFilter.filter(conn => 
            (conn.user.full_name || conn.user.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (conn.user.email || '').toLowerCase().includes(searchQuery.toLowerCase())
        );
    };
    
    // Function to handle tag selection
    const handleTagSelect = (tagId) => {
        // If clicking the active tag, clear the filter
        if (tagId === activeTagId) {
            router.get(route('connections.index'));
        } else {
            router.get(route('connections.index', { tag_id: tagId }));
        }
    };
    
    // Function to handle tag creation
    const handleTagCreated = (newTag) => {
        setAvailableTags(prevTags => [...prevTags, newTag]);
    };
    
    // Function to get the appropriate icon for a tag
    const getTagIcon = (tag) => {
        // Default tags (no user_id) get specific icons
        if (!tag.user_id) {
            switch (tag.name.toLowerCase()) {
                case 'collaborator':
                    return <Users size={14} className="text-blue-600" />;
                case 'student':
                    return <GraduationCap size={14} className="text-green-600" />;
                default:
                    return <Tags size={14} className="text-blue-500" />;
            }
        }
        // Custom tags get a generic tag icon
        return <Tags size={14} className="text-gray-500" />;
    };

    // Function to render the tag filtering sidebar
    const renderTagSidebar = () => {
        if (activeTab !== 'connections') return null;
        
        return (
            <div className="w-64 bg-white shadow-sm rounded-lg p-4 mr-4 h-fit">
                <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center">
                        <h3 className="font-medium text-gray-900 mr-2">Organize with Tags</h3>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Info size={16} className="text-gray-400 hover:text-gray-600 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                                Use tags to manually organize your connections. Tags are not assigned automatically based on a user's role. For example, you can tag someone as a 'Collaborator' to easily add them to your NexLab projects later.
                            </TooltipContent>
                        </Tooltip>
                    </div>
                    {/* <Tooltip content="Create New Tag">
                        <button
                            onClick={() => setIsCreateTagModalOpen(true)}
                            className="p-1 rounded-full text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <Plus size={18} />
                        </button>
                    </Tooltip> */}
                </div>
                
                <div className="space-y-2">
                    <button
                        onClick={() => handleTagSelect(null)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                            activeTagId === null 
                                ? 'bg-blue-100 text-blue-800 font-medium' 
                                : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        All Connections
                    </button>
                    
                    {availableTags.length > 0 ? (
                        availableTags.map(tag => (
                            <button
                                key={tag.id}
                                onClick={() => handleTagSelect(tag.id)}
                                className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center group ${
                                    activeTagId === tag.id
                                        ? 'bg-blue-100 text-blue-800 font-medium'
                                        : tag.user_id
                                            ? 'text-gray-700 hover:bg-gray-100'
                                            : 'text-gray-800 hover:bg-blue-50 border border-blue-200 bg-blue-50/30'
                                }`}
                            >
                                <div className="flex items-center mr-3">
                                    {getTagIcon(tag)}
                                </div>
                                <span className="flex-1">{tag.name}</span>
                                {tag.user_id ? (
                                    <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">(Custom)</span>
                                ) : (
                                    <span className="text-xs text-blue-600 font-medium">Suggested</span>
                                )}
                            </button>
                        ))
                    ) : (
                        <div className="text-sm text-gray-500 py-2 text-center">
                            No tags available
                        </div>
                    )}
                </div>
            </div>
        );
    };
    
    const handleConnectionAction = async (connectionId, action) => {
        // For non-destroy actions
        if (action !== 'destroy') {
            setProcessingIds(prev => [...prev, connectionId]);
            
            try {
                // Step 1: Make the API call with axios
                const url = route(`api.app.connections.${action}`, connectionId);
                const method = action === 'accept' ? 'patch' : 'delete';
                
                await axios[method](url);
                
                // Step 2: On success, show a specific success toast
                if (action === 'accept') {
                    toast.success('Connection request accepted.');
                } else if (action === 'reject') {
                    toast.success('Connection request rejected.');
                }
                
                // Step 3: Manually reload the connection data
                router.reload({ only: ['acceptedConnections', 'receivedRequests', 'sentRequests'] });
                
            } catch (error) {
                // Step 4: Handle errors directly from the axios response
                if (error.response) {
                    if (error.response.status === 404) {
                        toast.error('Connection request not found. It may have been already processed.');
                        // Refresh the list to update the UI
                        router.reload({ only: ['acceptedConnections', 'receivedRequests', 'sentRequests'] });
                    } else if (error.response.status === 403) {
                        toast.error('You do not have permission to perform this action.');
                    } else if (error.response.data?.error) {
                        toast.error(error.response.data.error);
                    } else if (error.response.data?.message) {
                        toast.error(error.response.data.message);
                    } else {
                        toast.error(`Error (${error.response.status}): Unable to ${action} connection request.`);
                    }
                } else {
                    toast.error('Network error or server not responding.');
                }
                console.error(`Error ${action}ing connection:`, error);
            } finally {
                // Step 5: Always clean up the processingIds state
                setProcessingIds(prev => prev.filter(id => id !== connectionId));
            }
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
                        onClick={() => handleTabChange('connections')}
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
                        onClick={() => handleTabChange('received')}
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
                        onClick={() => handleTabChange('sent')}
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
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                        {activeTab === 'connections' && (
                            <div className="flex items-center mr-4">
                                <input
                                    type="checkbox"
                                    id="select-all"
                                    checked={selectAll}
                                    onChange={handleSelectAll}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="select-all" className="ml-2 text-sm text-gray-700">
                                    Select All
                                </label>
                            </div>
                        )}
                    </div>
                    
                    {/* Bulk Actions - Only show when connections are selected */}
                    {activeTab === 'connections' && selectedConnections.length > 0 && (
                        <div className="flex space-x-2">
                            <button
                                onClick={handleBulkManageTags}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <FaTags className="mr-1" />
                                Manage Tags
                            </button>
                        </div>
                    )}
                </div>
                
                <div className="relative">
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
            </div>
        );
    };

    const renderMobileActionMenu = (connection) => {
        const { user, connection_id } = connection;
        const isProcessing = processingIds.includes(connection_id);

        return (
            <div className="flex space-x-2">
                {/* Manage Tags button (only for connections tab) */}
                {activeTab === 'connections' && (
                    <Tooltip content="Manage Tags" position="left">
                        <button
                            onClick={() => handleManageTags(connection_id)}
                            className="p-1 rounded-full text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <span className="sr-only">Manage Tags</span>
                            <Tags className="h-5 w-5" />
                        </button>
                    </Tooltip>
                )}
                
                {/* View Profile button */}
                <Tooltip content="View Profile" position="left">
                    <Link
                        href={getProfileUrl(user)}
                        className="p-1 rounded-full text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <span className="sr-only">View Profile</span>
                        <Eye className="h-5 w-5" />
                    </Link>
                </Tooltip>
                
                {/* Action buttons based on tab */}
                {activeTab === 'connections' && (
                    <Tooltip content="Remove Connection" position="left">
                        <button
                            onClick={() => promptForRemoval({ connection_id })}
                            disabled={isProcessing}
                            className={`p-1 rounded-full text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                                isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            <span className="sr-only">Remove Connection</span>
                            {isProcessing ? (
                                <div className="animate-spin h-5 w-5 border-2 border-red-600 rounded-full border-t-transparent"></div>
                            ) : (
                                <Trash2 className="h-5 w-5" />
                            )}
                        </button>
                    </Tooltip>
                )}
                
                {activeTab === 'received' && (
                    <>
                        <Tooltip content="Accept Request" position="left">
                            <button
                                onClick={() => handleConnectionAction(connection_id, 'accept')}
                                disabled={isProcessing}
                                className={`p-1 rounded-full text-green-600 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                                    isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                <span className="sr-only">Accept Request</span>
                                {isProcessing ? (
                                    <div className="animate-spin h-5 w-5 border-2 border-green-600 rounded-full border-t-transparent"></div>
                                ) : (
                                    <CheckSquare className="h-5 w-5" />
                                )}
                            </button>
                        </Tooltip>
                        
                        <Tooltip content="Reject Request" position="left">
                            <button
                                onClick={() => handleConnectionAction(connection_id, 'reject')}
                                disabled={isProcessing}
                                className={`p-1 rounded-full text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                                    isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                <span className="sr-only">Reject Request</span>
                                {isProcessing ? (
                                    <div className="animate-spin h-5 w-5 border-2 border-red-600 rounded-full border-t-transparent"></div>
                                ) : (
                                    <X className="h-5 w-5" />
                                )}
                            </button>
                        </Tooltip>
                    </>
                )}
                
                {activeTab === 'sent' && (
                    <Tooltip content="Cancel Request" position="left">
                        <button
                            onClick={() => promptForRemoval({ connection_id })}
                            disabled={isProcessing}
                            className={`p-1 rounded-full text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                                isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            <span className="sr-only">Cancel Request</span>
                            {isProcessing ? (
                                <div className="animate-spin h-5 w-5 border-2 border-red-600 rounded-full border-t-transparent"></div>
                            ) : (
                                <X className="h-5 w-5" />
                            )}
                        </button>
                    </Tooltip>
                )}
            </div>
        );
    };
    
    const renderConnectionCard = (connection) => {
        const { user, connection_id, status } = connection;
        const isProcessing = processingIds.includes(connection_id);
        const isSelected = selectedConnections.includes(connection_id);

        // Determine the role badge color based on user role
        const getRoleBadgeColor = () => {
            if (!user.role) return {};
            
            switch(user.role) {
                case 'Academician':
                    return { bg: 'bg-blue-100', text: 'text-blue-800' };
                case 'Postgraduate':
                    return { bg: 'bg-green-100', text: 'text-green-800' };
                case 'Undergraduate':
                    return { bg: 'bg-purple-100', text: 'text-purple-800' };
                case 'Industry':
                    return { bg: 'bg-orange-100', text: 'text-orange-800' };
                default:
                    return { bg: 'bg-gray-100', text: 'text-gray-800' };
            }
        };
        
        return (
            <div key={connection_id} className="bg-white shadow rounded-lg p-4 mb-4">
                {/* Mobile Layout: Vertical Card */}
                <div className="md:hidden">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center flex-1 min-w-0">
                            {activeTab === 'connections' && (
                                <div className="flex-shrink-0 mr-2">
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => handleConnectionSelect(connection_id)}
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                </div>
                            )}
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
                                <h3 className="text-base font-medium text-gray-900 truncate">{user.full_name || user.name}</h3>
                                <p className="text-sm text-gray-500 truncate">{user.email}</p>
                                {user.role && (
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor().bg} ${getRoleBadgeColor().text} mt-1`}>
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
                        {activeTab === 'connections' && (
                            <div className="flex-shrink-0 mr-3">
                                <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => handleConnectionSelect(connection_id)}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                            </div>
                        )}
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
                            <h3 className="text-lg font-medium text-gray-900">{user.full_name || user.name}</h3>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            {user.role && (
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor().bg} ${getRoleBadgeColor().text} mt-1`}>
                                    {user.role}
                                </span>
                            )}
                        </div>
                    </div>
                    
                    {/* Desktop Action Buttons */}
                    <div className="flex space-x-2">
                        {/* --- Logic for 'connections' tab --- */}
                        {activeTab === 'connections' && (
                            <>
                                <Tooltip content="Manage Tags">
                                    <button
                                        onClick={() => handleManageTags(connection_id)}
                                        className="inline-flex items-center justify-center w-9 h-9 border border-blue-300 text-sm rounded-full text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        <Tags size={18} />
                                    </button>
                                </Tooltip>
                                <Tooltip content="View Profile">
                                    <Link
                                        href={getProfileUrl(user)}
                                        className="inline-flex items-center justify-center w-9 h-9 border border-gray-300 text-sm rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        <Eye size={18} />
                                    </Link>
                                </Tooltip>
                                <Tooltip content="Remove Connection">
                                    <button
                                        onClick={() => promptForRemoval({ connection_id })}
                                        disabled={isProcessing}
                                        className={`inline-flex items-center justify-center w-9 h-9 border border-red-300 text-sm rounded-full text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                                            isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                    >
                                        {isProcessing ? (
                                            <div className="animate-spin h-4 w-4 border-2 border-red-700 rounded-full border-t-transparent"></div>
                                        ) : (
                                            <Trash2 size={18} />
                                        )}
                                    </button>
                                </Tooltip>
                            </>
                        )}
                        
                        {/* --- Logic for 'received' tab --- */}
                        {activeTab === 'received' && (
                            <>
                                <Tooltip content="Accept Request">
                                    <button
                                        onClick={() => handleConnectionAction(connection_id, 'accept')}
                                        disabled={isProcessing}
                                        className={`inline-flex items-center justify-center w-9 h-9 border border-green-300 text-sm rounded-full text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                                            isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                    >
                                        {isProcessing ? (
                                            <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                                        ) : (
                                            <CheckSquare size={18} />
                                        )}
                                    </button>
                                </Tooltip>
                                <Tooltip content="View Profile">
                                    <Link
                                        href={getProfileUrl(user)}
                                        className="inline-flex items-center justify-center w-9 h-9 border border-gray-300 text-sm rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        <Eye size={18} />
                                    </Link>
                                </Tooltip>
                                <Tooltip content="Reject Request">
                                    <button
                                        onClick={() => handleConnectionAction(connection_id, 'reject')}
                                        disabled={isProcessing}
                                        className={`inline-flex items-center justify-center w-9 h-9 border border-red-300 text-sm rounded-full text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                                            isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                    >
                                        {isProcessing ? (
                                            <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                                        ) : (
                                            <X size={18} />
                                        )}
                                    </button>
                                </Tooltip>
                            </>
                        )}
                        
                        {/* --- Logic for 'sent' tab --- */}
                        {activeTab === 'sent' && (
                            <>
                                <Tooltip content="View Profile">
                                    <Link
                                        href={getProfileUrl(user)}
                                        className="inline-flex items-center justify-center w-9 h-9 border border-gray-300 text-sm rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        <Eye size={18} />
                                    </Link>
                                </Tooltip>
                                <Tooltip content="Cancel Request">
                                    <button
                                        onClick={() => promptForRemoval({ connection_id })}
                                        disabled={isProcessing}
                                        className={`inline-flex items-center justify-center w-9 h-9 border border-gray-300 text-sm rounded-full text-red-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                                            isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                    >
                                        {isProcessing ? (
                                            <div className="animate-spin h-4 w-4 border-2 border-red-700 rounded-full border-t-transparent"></div>
                                        ) : (
                                            <X size={18} />
                                        )}
                                    </button>
                                </Tooltip>
                            </>
                        )}
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
    
    // Function to render pagination
    const renderPagination = (paginationData) => {
        if (!paginationData || !paginationData.meta || paginationData.meta.total <= paginationData.meta.per_page) {
            return null;
        }

        console.log(paginationData)
        
        return (
            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-4">
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-700">
                            Showing <span className="font-medium">{paginationData.meta.from || 0}</span> to{' '}
                            <span className="font-medium">{paginationData.meta.to || 0}</span> of{' '}
                            <span className="font-medium">{paginationData.meta.total}</span> results
                        </p>
                    </div>
                    <div>
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                            {paginationData.meta.links.map((link, index) => {
                                // Skip the "prev" and "next" links as we'll create custom ones
                                if (link.label === '&laquo; Previous' || link.label === 'Next &raquo;') {
                                    return null;
                                }
                                
                                return (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            if (!link.url || link.active) return;
                                            router.get(link.url);
                                        }}
                                        disabled={!link.url || link.active}
                                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                            link.active
                                                ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                                                : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                                        } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                );
                            })}
                        </nav>
                    </div>
                </div>
            </div>
        );
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'connections':
                const filteredConnections = filterConnections(acceptedConnections);
                const hasConnections = Array.isArray(filteredConnections) && filteredConnections.length > 0;
                
                return (
                    <div className="mt-6">
                        <div className="flex flex-col md:flex-row">
                            {renderTagSidebar()}
                            
                            <div className="flex-1">
                                {hasConnections ? (
                                    <>
                                        <div className="space-y-4">
                                            {filteredConnections.map(connection => renderConnectionCard(connection))}
                                        </div>
                                        {renderPagination(acceptedConnections)}
                                    </>
                                ) : (
                                    renderEmptyState(searchQuery ? 'No connections match your search' : 'You have no connections yet')
                                )}
                            </div>
                        </div>
                    </div>
                );
                
            case 'received':
                const filteredReceived = filterConnections(receivedRequests);
                const hasReceivedRequests = Array.isArray(filteredReceived) && filteredReceived.length > 0;
                
                return (
                    <div className="mt-6">
                        {hasReceivedRequests ? (
                            <>
                                <div className="space-y-4">
                                    {filteredReceived.map(connection => renderConnectionCard(connection))}
                                </div>
                                {renderPagination(receivedRequests)}
                            </>
                        ) : (
                            renderEmptyState(searchQuery ? 'No requests match your search' : 'You have no pending requests')
                        )}
                    </div>
                );
                
            case 'sent':
                const filteredSent = filterConnections(sentRequests);
                const hasSentRequests = Array.isArray(filteredSent) && filteredSent.length > 0;
                
                return (
                    <div className="mt-6">
                        {hasSentRequests ? (
                            <>
                                <div className="space-y-4">
                                    {filteredSent.map(connection => renderConnectionCard(connection))}
                                </div>
                                {renderPagination(sentRequests)}
                            </>
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
        <TooltipProvider delayDuration={0}>
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

                {/* Manage Tags Modal */}
                <ManageTagsModal
                    show={isTagModalOpen}
                    onClose={() => {
                        setIsTagModalOpen(false);
                        setSelectedConnectionForTags(null);
                    }}
                    connectionIds={selectedConnectionForTags ? [selectedConnectionForTags] : selectedConnections}
                />

                {/* Create Tag Modal */}
                <CreateTagModal
                    show={isCreateTagModalOpen}
                    onClose={() => setIsCreateTagModalOpen(false)}
                    onTagCreated={handleTagCreated}
                />
            </MainLayout>
        </TooltipProvider>
    );
};

export default MyConnections;