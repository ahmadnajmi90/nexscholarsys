import React from 'react';
import { usePage } from '@inertiajs/react';

export default function ParticipantList({ participants, onlineUsers = [] }) {
    const { auth } = usePage().props;

    // Filter out current user and get other participants
    const otherParticipants = participants.filter(p => p.user.id !== auth.user.id);

    if (otherParticipants.length === 0) return null;

    // For direct messages, show the other person's name with online status
    if (otherParticipants.length === 1) {
        const otherUser = otherParticipants[0].user;
        const isOnline = onlineUsers.some(user => user.id === otherUser.id);

        return (
            <div className="text-sm text-gray-600 flex items-center">
                {otherUser.name}
                {isOnline && (
                    <span className="ml-2 inline-flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </span>
                )}
            </div>
        );
    }

    // For group messages, show participant count and online count
    const totalCount = participants.length;
    const onlineCount = onlineUsers.length;

    return (
        <div className="text-sm text-gray-600 flex items-center">
            {totalCount} participants
            {onlineCount > 0 && (
                <span className="ml-2 text-xs text-green-600 flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                    {onlineCount} online
                </span>
            )}
        </div>
    );
}