import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { motion } from 'framer-motion';
import UserAvatar from '@/Components/Notifications/UserAvatar';
import { getRelativeTime } from '@/Utils/notificationHelpers';
import { getRejectionReasonLabel } from '@/Utils/supervisionConstants';
import { FaCheck, FaTrash, FaFilter, FaSpinner } from 'react-icons/fa';
import axios from 'axios';

export default function Index({ notifications, availableTypes, filters }) {
    const [activeTab, setActiveTab] = useState(filters.status || 'all');
    const [selectedType, setSelectedType] = useState(filters.type || '');
    const [processingIds, setProcessingIds] = useState([]);

    // Handle tab change
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        const newFilters = { ...filters };
        
        if (tab === 'all') {
            delete newFilters.status;
        } else {
            newFilters.status = tab;
        }
        
        router.get(route('notifications.index'), newFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Handle type filter change
    const handleTypeFilter = (type) => {
        setSelectedType(type);
        const newFilters = { ...filters, type: type || undefined };
        
        router.get(route('notifications.index'), newFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Mark as read
    const markAsRead = async (notificationId) => {
        setProcessingIds((prev) => [...prev, notificationId]);
        try {
            await axios.post('/api/v1/app/notifications/mark-as-read', {
                notification_id: notificationId,
            });
            
            router.reload({ only: ['notifications'] });
        } catch (error) {
            console.error('Error marking notification as read:', error);
        } finally {
            setProcessingIds((prev) => prev.filter((id) => id !== notificationId));
        }
    };

    // Delete notification
    const deleteNotification = async (notificationId) => {
        if (!confirm('Are you sure you want to delete this notification?')) {
            return;
        }
        
        setProcessingIds((prev) => [...prev, notificationId]);
        try {
            await axios.delete(`/api/v1/app/notifications/${notificationId}`);
            
            router.reload({ only: ['notifications'] });
        } catch (error) {
            console.error('Error deleting notification:', error);
        } finally {
            setProcessingIds((prev) => prev.filter((id) => id !== notificationId));
        }
    };

    // Get user data from notification (matches NotificationPanel logic)
    const getUserData = (notification) => {
        const data = notification.data;
        
        // Connection notifications
        if (data.requester_name) {
            return {
                name: data.requester_name,
                profilePicture: data.requester_profile_picture,
            };
        }
        if (data.recipient_name) {
            return {
                name: data.recipient_name,
                profilePicture: data.recipient_profile_picture,
            };
        }
        
        // Supervision request notifications
        if (data.student_name) {
            return {
                name: data.student_name,
                profilePicture: data.student_profile_picture,
            };
        }
        if (data.supervisor_name) {
            return {
                name: data.supervisor_name,
                profilePicture: data.supervisor_profile_picture,
            };
        }
        
        // Task & Workspace invitations
        if (data.inviter_name) {
            return {
                name: data.inviter_name,
                profilePicture: data.inviter_profile_picture,
            };
        }
        if (data.assigner_name) {
            return {
                name: data.assigner_name,
                profilePicture: data.assigner_profile_picture,
            };
        }
        
        // Meeting-related notifications
        if (data.meeting_creator_name) {
            return {
                name: data.meeting_creator_name,
                profilePicture: data.meeting_creator_profile_picture,
            };
        }
        if (data.canceller_name) {
            return {
                name: data.canceller_name,
                profilePicture: data.canceller_profile_picture,
            };
        }
        
        // Unbind notifications
        if (data.initiator_name) {
            return {
                name: data.initiator_name,
                profilePicture: data.initiator_profile_picture,
            };
        }
        
        // Role changed / Board deleted / Workspace deleted / Task due date changed
        if (data.changed_by_profile_picture || data.deleted_by_profile_picture) {
            return {
                name: data.changed_by || data.deleted_by || 'Administrator',
                profilePicture: data.changed_by_profile_picture || data.deleted_by_profile_picture,
            };
        }
        
        // Co-supervisor notifications
        if (data.cosupervisor_name) {
            return {
                name: data.cosupervisor_name,
                profilePicture: data.cosupervisor_profile_picture,
            };
        }
        if (data.initiator) {
            return {
                name: data.initiator,
                profilePicture: data.initiator_profile_picture,
            };
        }
        if (data.approver) {
            return {
                name: data.approver,
                profilePicture: data.approver_profile_picture,
            };
        }
        
        // Default fallback
        return {
            name: 'System',
            profilePicture: null,
        };
    };

    // Render notification content (matches NotificationPanel logic)
    const renderNotificationContent = (notification) => {
        const data = notification.data;
        const userData = getUserData(notification);
        
        switch (data.type) {
            // ========== CONNECTION NOTIFICATIONS ==========
            case 'connection_request':
                return (
                    <div>
                        <p className="text-sm text-gray-900 dark:text-gray-50">
                            <span className="font-semibold">{userData.name}</span>
                            {' '}sent you a connection request
                        </p>
                        <div className="mt-2">
                            <Link
                                href="/connections?tab=received"
                                className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-sm"
                            >
                                View
                            </Link>
                        </div>
                    </div>
                );
            
            case 'connection_accepted':
                return (
                    <div>
                        <p className="text-sm text-gray-900 dark:text-gray-50">
                            <span className="font-semibold">{userData.name}</span>
                            {' '}accepted your connection request
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">You are friends now!</p>
                        <div className="mt-2">
                            <Link
                                href="/connections?tab=connections"
                                className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-sm"
                            >
                                View
                            </Link>
                        </div>
                    </div>
                );
            
            // ========== TASK NOTIFICATIONS ==========
            case 'task_assigned':
                return (
                    <div>
                        <p className="text-sm text-gray-900 dark:text-gray-50">
                            <span className="font-semibold">{userData.name}</span>
                            {' '}assigned you to task "<span className="font-medium">{data.task_title}</span>"
                            {data.workspace_name && (
                                <span className="text-gray-500 dark:text-gray-400"> in {data.workspace_name}</span>
                            )}
                        </p>
                        {data.task_due_date && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                📅 Due: {new Date(data.task_due_date).toLocaleDateString('en-GB')}
                            </p>
                        )}
                    </div>
                );
            
            case 'task_due_date_changed':
                return (
                    <div>
                        <p className="text-sm text-gray-900 dark:text-gray-50">
                            Due date changed for task "<span className="font-medium">{data.task_title}</span>"
                        </p>
                        {data.old_due_date_formatted && data.new_due_date_formatted && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                {data.old_due_date_formatted} → {data.new_due_date_formatted}
                            </p>
                        )}
                        {data.changed_by && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                Changed by {data.changed_by}
                            </p>
                        )}
                    </div>
                );
            
            // ========== WORKSPACE & PROJECT NOTIFICATIONS ==========
            case 'workspace_invitation':
                return (
                    <div>
                        <p className="text-sm text-gray-900 dark:text-gray-50">
                            <span className="font-semibold">{userData.name}</span>
                            {' '}invited you to workspace "<span className="font-medium">{data.workspace_name}</span>"
                        </p>
                    </div>
                );
            
            case 'workspace_deleted':
                return (
                    <div>
                        <p className="text-sm text-gray-900 dark:text-gray-50">
                            Workspace "<span className="font-medium">{data.workspace_name}</span>" was deleted
                        </p>
                        {data.deleted_by && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                Deleted by {data.deleted_by}
                            </p>
                        )}
                    </div>
                );
            
            case 'board_deleted':
                return (
                    <div>
                        <p className="text-sm text-gray-900 dark:text-gray-50">
                            Board "<span className="font-medium">{data.board_name}</span>" in {data.parent_type} "<span className="font-medium">{data.parent_name}</span>" was deleted
                        </p>
                        {data.deleted_by && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                Deleted by {data.deleted_by}
                            </p>
                        )}
                    </div>
                );
            
            case 'role_changed':
                return (
                    <div>
                        <p className="text-sm text-gray-900 dark:text-gray-50">
                            Your role in {data.parent_type} "<span className="font-medium">{data.parent_name}</span>" changed to <span className="font-medium">{data.new_role}</span>
                        </p>
                        {data.changed_by && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                Changed by {data.changed_by}
                            </p>
                        )}
                    </div>
                );
            
            case 'project_invitation':
                return (
                    <div>
                        <p className="text-sm text-gray-900 dark:text-gray-50">
                            <span className="font-semibold">{userData.name}</span>
                            {' '}invited you to project "<span className="font-medium">{data.project_name}</span>"
                        </p>
                    </div>
                );
            
            // ========== SUPERVISION NOTIFICATIONS ==========
            case 'request_submitted':
                return (
                    <div>
                        <p className="text-sm text-gray-900 dark:text-gray-50">
                            <span className="font-semibold">{userData.name}</span>
                            {' '}submitted a new supervision request
                        </p>
                        {data.proposal_title && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{data.proposal_title}</p>
                        )}
                    </div>
                );
            
            case 'request_approved':
                return (
                    <div>
                        <p className="text-sm text-gray-900 dark:text-gray-50">
                            <span className="font-semibold">{userData.name}</span>
                            {' '}approved your supervision request
                        </p>
                        {data.proposal_title && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{data.proposal_title}</p>
                        )}
                    </div>
                );
            
            case 'request_rejected':
                return (
                    <div>
                        <p className="text-sm text-gray-900 dark:text-gray-50">
                            <span className="font-semibold">{userData.name}</span>
                            {' '}declined your supervision request
                        </p>
                        {data.rejection_reason && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                Reason: {getRejectionReasonLabel(data.rejection_reason)}
                            </p>
                        )}
                    </div>
                );
            
            case 'offer_sent':
                return (
                    <div>
                        <p className="text-sm text-gray-900 dark:text-gray-50">
                            <span className="font-semibold">{userData.name}</span>
                            {' '}sent you a supervision offer
                        </p>
                    </div>
                );
            
            case 'offer_accepted':
                return (
                    <div>
                        <p className="text-sm text-gray-900 dark:text-gray-50">
                            <span className="font-semibold">{userData.name}</span>
                            {' '}accepted your supervision offer
                        </p>
                    </div>
                );
            
            // ========== DEFAULT: Use message field or generic message ==========
            default:
                if (data.message) {
                    return <p className="text-sm text-gray-900 dark:text-gray-50">{data.message}</p>;
                }
                return <p className="text-sm text-gray-900 dark:text-gray-50">You have a new notification</p>;
        }
    };

    const unreadCount = notifications.data.filter(n => !n.read_at).length;

    return (
        <MainLayout>
            <Head title="Notifications" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-2 pb-8 pt-8 lg:pt-4">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
                        Notifications
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Stay updated with all your activities and interactions
                    </p>
                </motion.div>

                {/* Filters and Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6"
                >
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            {/* Tabs */}
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => handleTabChange('all')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        activeTab === 'all'
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => handleTabChange('unread')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        activeTab === 'unread'
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    Unread {unreadCount > 0 && `(${unreadCount})`}
                                </button>
                                <button
                                    onClick={() => handleTabChange('read')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        activeTab === 'read'
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    Read
                                </button>
                            </div>

                            {/* Type Filter */}
                            <div className="flex items-center gap-2">
                                <FaFilter className="text-gray-500" />
                                <select
                                    value={selectedType}
                                    onChange={(e) => handleTypeFilter(e.target.value)}
                                    className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-50 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">All Types</option>
                                    {availableTypes.map((type) => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {notifications.data.length > 0 ? (
                            notifications.data.map((notification, index) => {
                                const userData = getUserData(notification);
                                const isProcessing = processingIds.includes(notification.id);
                                
                                return (
                                    <motion.div
                                        key={notification.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        className={`px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                                            !notification.read_at ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''
                                        }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <UserAvatar
                                                src={userData.profilePicture}
                                                name={userData.name}
                                                size="md"
                                            />
                                            
                                            <div className="flex-1 min-w-0">
                                                {renderNotificationContent(notification)}
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    {getRelativeTime(notification.created_at)}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {!notification.read_at && !isProcessing && (
                                                    <button
                                                        onClick={() => markAsRead(notification.id)}
                                                        className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                                        title="Mark as read"
                                                    >
                                                        <FaCheck className="text-sm" />
                                                    </button>
                                                )}
                                                
                                                {!isProcessing && (
                                                    <button
                                                        onClick={() => deleteNotification(notification.id)}
                                                        className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                                        title="Delete notification"
                                                    >
                                                        <FaTrash className="text-sm" />
                                                    </button>
                                                )}
                                                
                                                {isProcessing && (
                                                    <FaSpinner className="animate-spin text-blue-500" />
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <div className="px-6 py-12 text-center">
                                <p className="text-gray-500 dark:text-gray-400">
                                    No notifications found
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {notifications.links.length > 3 && (
                        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Showing {notifications.from} to {notifications.to} of {notifications.total} notifications
                                </p>
                                
                                <div className="flex items-center gap-2">
                                    {notifications.links.map((link, index) => (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                if (link.url) {
                                                    router.get(link.url, filters, {
                                                        preserveState: true,
                                                        preserveScroll: false,
                                                    });
                                                }
                                            }}
                                            disabled={!link.url}
                                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                                link.active
                                                    ? 'bg-blue-600 text-white'
                                                    : link.url
                                                    ? 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                    : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </MainLayout>
    );
}

