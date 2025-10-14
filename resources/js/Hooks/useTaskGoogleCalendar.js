import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { logError } from '@/Utils/logError';

export function useTaskGoogleCalendar() {
    const [isConnected, setIsConnected] = useState(false);
    const [isEnabled, setIsEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [tokenExpiresAt, setTokenExpiresAt] = useState(null);

    /**
     * Check if user has connected Google Calendar
     */
    const checkStatus = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(route('supervision.tasks.google-calendar.status'));
            const { connected, enabled, token_expires_at } = response.data;
            
            setIsConnected(connected);
            setIsEnabled(enabled);
            setTokenExpiresAt(token_expires_at);
        } catch (error) {
            logError(error, 'useTaskGoogleCalendar checkStatus');
            setIsConnected(false);
            setIsEnabled(false);
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Get Google OAuth URL and open in popup (reuse existing supervision flow)
     */
    const connect = useCallback(async () => {
        try {
            const response = await axios.get(route('supervision.google-calendar.auth-url'));
            const { auth_url, debug } = response.data;

            // Debug: Log redirect URI information
            if (debug) {
                console.log('🔍 Google Calendar Debug Info:');
                console.log('  Redirect URI:', debug.redirect_uri);
                console.log('  App URL:', debug.app_url);
                console.log('  Auth URL:', auth_url);
            }

            if (!auth_url) {
                throw new Error('No authorization URL received');
            }

            // Open in popup window
            const width = 600;
            const height = 700;
            const left = window.screen.width / 2 - width / 2;
            const top = window.screen.height / 2 - height / 2;

            const popup = window.open(
                auth_url,
                'Google Calendar Authorization',
                `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
            );

            if (!popup) {
                toast.error('Please allow popups to connect Google Calendar');
                return;
            }

            // Listen for message from popup
            const handleMessage = (event) => {
                // Verify the origin for security
                if (event.origin !== window.location.origin) {
                    return;
                }

                // Check if this is our OAuth callback message
                if (event.data && event.data.type === 'google-calendar-oauth-complete') {
                    // Remove the event listener
                    window.removeEventListener('message', handleMessage);

                    // Show toast based on status
                    if (event.data.status === 'success') {
                        toast.success(event.data.message || 'Google Calendar connected successfully!');
                    } else {
                        toast.error(event.data.message || 'Failed to connect Google Calendar');
                    }

                    // Refresh connection status
                    checkStatus();
                }
            };

            window.addEventListener('message', handleMessage);

            // Fallback: Poll for popup closure in case postMessage fails
            const checkPopup = setInterval(() => {
                if (popup.closed) {
                    clearInterval(checkPopup);
                    // Clean up message listener if popup closes without message
                    window.removeEventListener('message', handleMessage);
                    // Recheck status after popup closes
                    setTimeout(() => {
                        checkStatus();
                    }, 500);
                }
            }, 500);

            return popup;
        } catch (error) {
            logError(error, 'useTaskGoogleCalendar connect');
            toast.error('Failed to connect Google Calendar');
        }
    }, [checkStatus]);

    /**
     * Disconnect Google Calendar (reuse existing supervision flow)
     */
    const disconnect = useCallback(async () => {
        try {
            await axios.post(route('supervision.google-calendar.disconnect'));
            setIsConnected(false);
            setIsEnabled(false);
            setTokenExpiresAt(null);
            toast.success('Google Calendar disconnected');
        } catch (error) {
            logError(error, 'useTaskGoogleCalendar disconnect');
            toast.error('Failed to disconnect Google Calendar');
        }
    }, []);

    /**
     * Add a specific task to Google Calendar
     */
    const addTaskToCalendar = useCallback(async (taskId) => {
        try {
            const response = await axios.post(
                route('supervision.tasks.google-calendar.add', { task: taskId })
            );

            if (response.data.success) {
                toast.success('Task added to Google Calendar');
                return { success: true, task: response.data.task };
            }

            if (response.data.needs_connection) {
                toast.error('Please connect Google Calendar first');
                return { success: false };
            }

            throw new Error(response.data.message || 'Failed to add task');
        } catch (error) {
            if (error.response?.status === 403) {
                toast.error('You do not have permission to add this task');
            } else if (error.response?.data?.already_exists) {
                toast('This task is already in your Google Calendar', {
                    icon: 'ℹ️',
                    duration: 3000,
                });
                return { success: false, alreadyExists: true, task: error.response.data.task };
            } else if (error.response?.data?.needs_connection) {
                toast.error('Please connect Google Calendar first');
            } else {
                logError(error, 'useTaskGoogleCalendar addTaskToCalendar');
                toast.error('Failed to add task to Google Calendar');
            }
            return { success: false };
        }
    }, []);

    /**
     * Remove a specific task from Google Calendar
     */
    const removeTaskFromCalendar = useCallback(async (taskId) => {
        try {
            const response = await axios.delete(
                route('supervision.tasks.google-calendar.remove', { task: taskId })
            );

            if (response.data.success) {
                toast.success('Task removed from Google Calendar');
                return { success: true, task: response.data.task };
            }

            throw new Error(response.data.message || 'Failed to remove task');
        } catch (error) {
            if (error.response?.status === 403) {
                toast.error('You do not have permission to remove this task');
            } else {
                logError(error, 'useTaskGoogleCalendar removeTaskFromCalendar');
                toast.error('Failed to remove task from Google Calendar');
            }
            return { success: false };
        }
    }, []);

    // Check status on mount
    useEffect(() => {
        checkStatus();
    }, [checkStatus]);

    return {
        isConnected,
        isEnabled,
        isLoading,
        tokenExpiresAt,
        checkStatus,
        connect,
        disconnect,
        addTaskToCalendar,
        removeTaskFromCalendar,
    };
}
