import React from 'react';
import { usePage } from '@inertiajs/react';

export default function ParticipantList({ participants }) {
    const { auth } = usePage().props;
    
    // Filter out current user and get other participants
    const otherParticipants = participants.filter(p => p.user.id !== auth.user.id);
    
    if (otherParticipants.length === 0) return null;
    
    // For direct messages, show the other person's name
    if (otherParticipants.length === 1) {
        return (
            <div className="text-sm text-gray-600">
                {otherParticipants[0].user.name}
            </div>
        );
    }
    
    // For group messages, show participant count
    const totalCount = participants.length;
    const onlineCount = participants.filter(p => p.online).length;
    
    return (
        <div className="text-sm text-gray-600">
            {totalCount} participants
            {onlineCount > 0 && (
                <span className="ml-2 text-xs text-green-600">
                    {onlineCount} online
                </span>
            )}
        </div>
    );
}