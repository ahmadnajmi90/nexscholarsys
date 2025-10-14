import React from 'react';
import { Calendar, X, ExternalLink, Clock, Users, Flag } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/Components/ui/button';

export default function GoogleCalendarTaskToast({ 
    task, 
    promptData, 
    onYes, 
    onNo, 
    visible = true 
}) {
    if (!visible) return null;

    const { user_connected, assignees_connected, total_assignees, connected_assignees } = promptData || {};
    const currentUserConnected = user_connected;
    const someAssigneesConnected = assignees_connected;

    // Build task summary for display
    const taskSummary = () => {
        let summary = task.title;
        if (task.priority && task.priority !== 'Medium') {
            summary += ` (${task.priority})`;
        }
        return summary;
    };

    // Build assignee info text
    const getAssigneeInfo = () => {
        if (total_assignees === 0) {
            return 'No assignees';
        }
        if (connected_assignees === 0) {
            return `${total_assignees} assignee${total_assignees > 1 ? 's' : ''} (none connected to calendar)`;
        }
        if (connected_assignees === total_assignees) {
            return `${total_assignees} assignee${total_assignees > 1 ? 's' : ''} (all connected)`;
        }
        return `${total_assignees} assignee${total_assignees > 1 ? 's' : ''} (${connected_assignees} connected)`;
    };

    return (
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-md w-full">
            <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">
                        Add task to Google Calendar?
                    </h3>
                    
                    <div className="text-sm text-gray-600 mb-3 space-y-1">
                        <p className="font-medium text-gray-900 line-clamp-2">{taskSummary()}</p>
                        
                        {/* Due date */}
                        <div className="flex items-center text-xs text-gray-500">
                            <Clock className="w-3 h-3 mr-1" />
                            <span>
                                Due: {task.due_date 
                                    ? format(new Date(task.due_date), 'PPp')
                                    : 'No due date'
                                }
                            </span>
                        </div>

                        {/* Assignees info */}
                        {total_assignees > 0 && (
                            <div className="flex items-center text-xs text-gray-500">
                                <Users className="w-3 h-3 mr-1" />
                                <span>{getAssigneeInfo()}</span>
                            </div>
                        )}

                        {/* Priority */}
                        {task.priority && task.priority !== 'Medium' && (
                            <div className="flex items-center text-xs text-gray-500">
                                <Flag className="w-3 h-3 mr-1" />
                                <span>Priority: {task.priority}</span>
                            </div>
                        )}
                    </div>

                    {/* Connection Status */}
                    {!currentUserConnected ? (
                        <div className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
                            <p className="font-medium mb-1">Google Calendar not connected</p>
                            <p>Connect your Google Calendar in Profile Settings to enable sync.</p>
                        </div>
                    ) : someAssigneesConnected ? (
                        <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700">
                            <p>✓ You and some assignees have Google Calendar connected</p>
                        </div>
                    ) : total_assignees > 0 ? (
                        <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                            <p>You have Google Calendar connected. Assignees can add this task from their side if they connect their calendar.</p>
                        </div>
                    ) : (
                        <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                            <p>✓ Your Google Calendar is connected</p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                        {currentUserConnected ? (
                            <>
                                <Button
                                    size="sm"
                                    onClick={onYes}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    <Calendar className="w-3.5 h-3.5 mr-1.5" />
                                    Add to Calendar
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={onNo}
                                    className="flex-1"
                                >
                                    Not Now
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    size="sm"
                                    asChild
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    <a href="/profile#calendar" onClick={(e) => { onNo(); }}>
                                        <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                                        Connect Calendar
                                    </a>
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={onNo}
                                >
                                    <X className="w-3.5 h-3.5" />
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {/* Close button */}
                <button
                    onClick={onNo}
                    className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
