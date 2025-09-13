import React from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function ConversationCard({ conversation, isSelected, onClick }) {
    const { auth } = usePage().props;
    
    // Get conversation title or participants names
    const getTitle = () => {
        if (conversation.title) return conversation.title;

        const participants = conversation.participants || [];
        const otherParticipants = participants
            .filter(p => p.user?.id !== auth.user?.id)
            .map(p => p.user?.name || 'Unknown');

        if (otherParticipants.length === 0) return 'Unknown';
        if (otherParticipants.length === 1) return otherParticipants[0];
        return otherParticipants.slice(0, 3).join(', ') + (otherParticipants.length > 3 ? ` +${otherParticipants.length - 3}` : '');
    };
    
    // Get subtitle (research area, department, etc)
    const getSubtitle = () => {
        // For now, use a placeholder. In a real implementation, this would come from user data
        const participants = conversation.participants || [];
        const otherParticipants = participants.filter(p => p.user?.id !== auth.user?.id);
        
        if (otherParticipants.length === 1) {
            // For direct messages, show field of research or department
            return otherParticipants[0].user?.role === 'Academician' ? 
                'AI in Healthcare Diagnostics' : 
                otherParticipants[0].user?.role === 'Postgraduate' ?
                'Natural Language Processing' :
                'Computer Vision Applications';
        }
        
        // For group chats, show number of participants
        return `${participants.length} participants`;
    };
    
    // Get last message preview
    const getLastMessagePreview = () => {
        if (!conversation.last_message) return 'No messages yet';
        
        const message = conversation.last_message;
        const sender = message.sender?.id === auth.user.id ? 'You' : message.sender?.name || 'Someone';
        
        if (message.type === 'text') {
            return `${message.body.substring(0, 50)}${message.body.length > 50 ? '...' : ''}`;
        }
        
        if (message.type === 'image') {
            return `${sender} sent an image`;
        }
        
        if (message.type === 'file') {
            return `${sender} sent a file`;
        }
        
        return message.body;
    };
    
    // Format time in relative format
    const formatRelativeTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);
        
        if (diffInSeconds < 60) {
            return 'just now';
        } else if (diffInMinutes < 60) {
            return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
        } else if (diffInHours < 24) {
            return `about ${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
        } else if (diffInDays < 7) {
            return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    };
    
    // Check if conversation has unread messages
    const hasUnreadMessages = () => {
        const participants = conversation.participants || [];
        const currentUserParticipant = participants.find(p => p.user?.id === auth.user?.id);
        if (!currentUserParticipant || !conversation.last_message) return false;

        const lastReadId = currentUserParticipant.last_read_message_id;
        const lastMessageId = conversation.last_message.id;

        return lastReadId === null || lastMessageId > lastReadId;
    };
    
    // Count unread messages
    const getUnreadCount = () => {
        // In a real implementation, you would calculate this based on the actual unread messages
        // For now, we'll just return a placeholder count
        return hasUnreadMessages() ? Math.floor(Math.random() * 5) + 1 : 0;
    };
    
    // Get user initials for avatar
    const getUserInitials = () => {
        const name = getTitle();
        const names = name.split(' ');
        
        if (names.length === 1) {
            return names[0].charAt(0).toUpperCase();
        }
        
        return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    };
    
    // Check if user is online (placeholder)
    const isUserOnline = () => {
        // This would be determined by presence channel in a real implementation
        // For now, just randomly determine if user is online
        const participants = conversation.participants || [];
        const otherParticipants = participants.filter(p => p.user?.id !== auth.user?.id);
        
        if (otherParticipants.length === 1) {
            // For demo purposes, make the first conversation's user online
            return conversation.id % 3 === 0;
        }
        
        return false;
    };

    return (
        <Link 
            href={route('messages.show', conversation.id)}
            className={`block p-4 hover:bg-gray-50 transition-colors ${isSelected ? 'bg-gray-100' : ''}`}
            onClick={onClick}
        >
            <div className="flex items-center">
                {/* Avatar with online indicator */}
                <div className="flex-shrink-0 relative">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-800 font-semibold">
                            {getUserInitials()}
                        </span>
                    </div>
                    {isUserOnline() && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                </div>
                
                {/* Conversation Info */}
                <div className="ml-4 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <h3 className={`text-sm font-medium ${hasUnreadMessages() ? 'text-gray-900' : 'text-gray-700'}`}>
                            {getTitle()}
                        </h3>
                        <span className="text-xs text-gray-500">
                            {conversation.last_message && formatRelativeTime(conversation.last_message.created_at)}
                        </span>
                    </div>
                    
                    {/* Subtitle line */}
                    <div className="text-xs text-gray-500 mt-0.5">
                        {getSubtitle()}
                    </div>
                    
                    <div className="flex items-center justify-between mt-1">
                        <p className={`text-sm truncate ${hasUnreadMessages() ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                            {getLastMessagePreview()}
                        </p>
                        {hasUnreadMessages() && (
                            <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                                {getUnreadCount()}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}