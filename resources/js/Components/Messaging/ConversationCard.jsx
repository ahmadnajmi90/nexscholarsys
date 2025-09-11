import React from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function ConversationCard({ conversation }) {
    const { auth } = usePage().props;
    
    // Get conversation title or participants names
    const getTitle = () => {
        if (conversation.title) return conversation.title;
        
        const otherParticipants = conversation.participants
            .filter(p => p.user.id !== auth.user.id)
            .map(p => p.user.name);
            
        if (otherParticipants.length === 0) return 'Unknown';
        if (otherParticipants.length === 1) return otherParticipants[0];
        return otherParticipants.slice(0, 3).join(', ') + (otherParticipants.length > 3 ? ` +${otherParticipants.length - 3}` : '');
    };
    
    // Get last message preview
    const getLastMessagePreview = () => {
        if (!conversation.last_message) return 'No messages yet';
        
        const message = conversation.last_message;
        const sender = message.sender?.id === auth.user.id ? 'You' : message.sender?.name || 'Someone';
        
        if (message.type === 'text') {
            return `${sender}: ${message.body.substring(0, 50)}${message.body.length > 50 ? '...' : ''}`;
        }
        
        if (message.type === 'image') {
            return `${sender}: sent an image`;
        }
        
        if (message.type === 'file') {
            return `${sender}: sent a file`;
        }
        
        return `${sender}: ${message.body}`;
    };
    
    // Format time
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        
        if (diffInDays === 0) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (diffInDays === 1) {
            return 'Yesterday';
        } else if (diffInDays < 7) {
            return date.toLocaleDateString([], { weekday: 'short' });
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    };
    
    // Check if conversation has unread messages
    const hasUnreadMessages = () => {
        const currentUserParticipant = conversation.participants.find(p => p.user.id === auth.user.id);
        if (!currentUserParticipant || !conversation.last_message) return false;
        
        const lastReadId = currentUserParticipant.last_read_message_id;
        const lastMessageId = conversation.last_message.id;
        
        return lastReadId === null || lastMessageId > lastReadId;
    };
    
    // Count unread messages
    const getUnreadCount = () => {
        // In a real implementation, you would calculate this based on the actual unread messages
        // For now, we'll just return 1 if there are unread messages
        return hasUnreadMessages() ? 1 : 0;
    };

    return (
        <Link 
            href={route('messages.show', conversation.id)}
            className="block p-4 hover:bg-gray-50 transition-colors"
        >
            <div className="flex items-center">
                {/* Avatar */}
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-800 font-semibold">
                        {getTitle().charAt(0).toUpperCase()}
                    </span>
                </div>
                
                {/* Conversation Info */}
                <div className="ml-4 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <h3 className={`text-sm font-medium ${hasUnreadMessages() ? 'text-gray-900' : 'text-gray-700'}`}>
                            {getTitle()}
                        </h3>
                        <div className="flex items-center space-x-2">
                            {conversation.pinned && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z" clipRule="evenodd" />
                                </svg>
                            )}
                            {conversation.muted_until && new Date(conversation.muted_until) > new Date() && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM13.757 14.505a.5.5 0 01-.707 0 13.524 13.524 0 01-1.545-1.845.5.5 0 11.757-.663c.458.55.97.994 1.507 1.334a.5.5 0 010 .774zm1.697-1.343a.5.5 0 01-.707 0C13.45 11.7 12.5 9.85 12.5 8s.95-3.7 2.247-5.162a.5.5 0 11.757.663C14.45 4.3 13.5 6.15 13.5 8s.95 3.7 2.004 5.162a.5.5 0 010 .774z" clipRule="evenodd" />
                                </svg>
                            )}
                            <span className="text-xs text-gray-500">
                                {conversation.last_message && formatTime(conversation.last_message.created_at)}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                        <p className={`text-sm truncate ${hasUnreadMessages() ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                            {getLastMessagePreview()}
                        </p>
                        {hasUnreadMessages() && (
                            <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-indigo-500 rounded-full">
                                {getUnreadCount()}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}