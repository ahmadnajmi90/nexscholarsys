import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaSave, FaSpinner, FaBell, FaEnvelope } from 'react-icons/fa';
import axios from 'axios';

export default function NotificationPreferences({ isOpen, onClose }) {
    const [preferences, setPreferences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Fetch preferences when modal opens
    useEffect(() => {
        if (isOpen) {
            fetchPreferences();
        }
    }, [isOpen]);

    const fetchPreferences = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('/api/v1/app/notification-preferences');
            setPreferences(response.data.preferences);
        } catch (err) {
            setError('Failed to load notification preferences');
            console.error('Error fetching preferences:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = (index, field) => {
        const newPreferences = [...preferences];
        newPreferences[index] = {
            ...newPreferences[index],
            [field]: !newPreferences[index][field],
        };
        setPreferences(newPreferences);
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        setSuccess(false);
        
        try {
            await axios.put('/api/v1/app/notification-preferences', {
                preferences: preferences,
            });
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                onClose();
            }, 1500);
        } catch (err) {
            setError('Failed to save preferences');
            console.error('Error saving preferences:', err);
        } finally {
            setSaving(false);
        }
    };

    // Group preferences by category for better UX
    const categorizedPreferences = {
        'Connections': ['connection_request', 'connection_accepted'],
        'Tasks & Projects': ['task_assigned', 'task_due_date_changed', 'workspace_invitation', 'project_invitation', 'workspace_deleted', 'board_deleted', 'role_changed'],
        'Supervision': ['request_submitted', 'request_accepted', 'request_rejected', 'offer_received', 'student_accepted_offer', 'student_rejected_offer', 'request_cancelled'],
        'Meetings': ['meeting_scheduled', 'meeting_reminder', 'meeting_updated', 'meeting_cancelled'],
        'Co-Supervision': ['cosupervisor_invitation_sent', 'cosupervisor_invitation_initiated', 'cosupervisor_accepted', 'cosupervisor_rejected', 'cosupervisor_approval_needed', 'cosupervisor_approved', 'cosupervisor_rejected_by_approver', 'cosupervisor_added', 'cosupervisor_invitation_cancelled'],
        'Unbind Requests': ['unbind_request_initiated', 'unbind_request_approved', 'unbind_request_rejected'],
        'Admin': ['faculty_admin_invitation'],
    };

    // Helper to get human-readable label
    const getLabel = (type) => {
        return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-2xl rounded-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
                                Notification Preferences
                            </h3>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                <FaTimes className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <FaSpinner className="w-8 h-8 animate-spin text-blue-500" />
                                </div>
                            ) : error ? (
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-800 dark:text-red-200">
                                    {error}
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Choose how you'd like to receive notifications. You can enable or disable notifications for each channel individually.
                                    </p>

                                    {Object.entries(categorizedPreferences).map(([category, types]) => {
                                        const categoryPrefs = preferences.filter(p => types.includes(p.notification_type));
                                        if (categoryPrefs.length === 0) return null;

                                        return (
                                            <div key={category} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                                <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-50">
                                                        {category}
                                                    </h4>
                                                </div>
                                                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                                    {categoryPrefs.map((pref, idx) => {
                                                        const globalIndex = preferences.findIndex(p => p.notification_type === pref.notification_type);
                                                        
                                                        return (
                                                            <div key={pref.notification_type} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                                                        {getLabel(pref.notification_type)}
                                                                    </span>
                                                                    <div className="flex items-center gap-4">
                                                                        {/* In-App Toggle */}
                                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                                            <FaBell className="w-3 h-3 text-gray-500" />
                                                                            <span className="text-xs text-gray-500 dark:text-gray-400">In-App</span>
                                                                            <button
                                                                                onClick={() => handleToggle(globalIndex, 'database_enabled')}
                                                                                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                                                                    pref.database_enabled
                                                                                        ? 'bg-blue-600'
                                                                                        : 'bg-gray-300 dark:bg-gray-600'
                                                                                }`}
                                                                            >
                                                                                <span
                                                                                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                                                                        pref.database_enabled ? 'translate-x-5' : 'translate-x-1'
                                                                                    }`}
                                                                                />
                                                                            </button>
                                                                        </label>

                                                                        {/* Email Toggle */}
                                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                                            <FaEnvelope className="w-3 h-3 text-gray-500" />
                                                                            <span className="text-xs text-gray-500 dark:text-gray-400">Email</span>
                                                                            <button
                                                                                onClick={() => handleToggle(globalIndex, 'email_enabled')}
                                                                                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                                                                    pref.email_enabled
                                                                                        ? 'bg-blue-600'
                                                                                        : 'bg-gray-300 dark:bg-gray-600'
                                                                                }`}
                                                                            >
                                                                                <span
                                                                                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                                                                        pref.email_enabled ? 'translate-x-5' : 'translate-x-1'
                                                                                    }`}
                                                                                />
                                                                            </button>
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-green-800 dark:text-green-200"
                                >
                                    Preferences saved successfully!
                                </motion.div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                disabled={saving}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving || loading}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {saving ? (
                                    <>
                                        <FaSpinner className="animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <FaSave />
                                        Save Preferences
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AnimatePresence>
    );
}

