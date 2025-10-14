import React from 'react';
import { Calendar, X, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/Components/ui/button';

export default function GoogleCalendarToast({ 
    meeting, 
    promptData, 
    onYes, 
    onNo, 
    visible = true 
}) {
    if (!visible) return null;

    const { supervisor_connected, student_connected } = promptData || {};
    const currentUserConnected = supervisor_connected || student_connected;
    const bothConnected = supervisor_connected && student_connected;

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
                        Add to Google Calendar?
                    </h3>
                    
                    <div className="text-sm text-gray-600 mb-3 space-y-1">
                        <p className="font-medium text-gray-900">{meeting.title}</p>
                        <p className="text-xs text-gray-500">
                            {meeting.scheduled_for 
                                ? format(new Date(meeting.scheduled_for), 'PPp')
                                : 'No date set'
                            }
                        </p>
                    </div>

                    {/* Connection Status */}
                    {!currentUserConnected ? (
                        <div className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
                            <p className="font-medium mb-1">Google Calendar not connected</p>
                            <p>Connect your Google Calendar in Profile Settings to enable sync.</p>
                        </div>
                    ) : bothConnected ? (
                        <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700">
                            <p>✓ Both participants have Google Calendar connected</p>
                        </div>
                    ) : (
                        <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                            <p>You have Google Calendar connected. The other participant can add this meeting from their side.</p>
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

