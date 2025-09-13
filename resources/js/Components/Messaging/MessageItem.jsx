import React from 'react';

export default function MessageItem({ message, currentUser, participants = [], onReply, isGroupChat = false }) {
    const isCurrentUser = message.user_id === currentUser.id;
    const isText = message.type === 'text';
    const isSystem = message.type === 'system';
    const hasAttachments = message.attachments && message.attachments.length > 0;

    // Check if message has been seen by other participants
    const getSeenByOthers = () => {
        if (!isCurrentUser || !participants.length) return [];

        return participants
            .filter(p => p.user.id !== currentUser.id) // Exclude current user
            .filter(p => p.last_read_message_id && p.last_read_message_id >= message.id) // Seen this message
            .map(p => p.user.name);
    };

    const seenByOthers = getSeenByOthers();
    const hasBeenSeen = seenByOthers.length > 0;
    
    // Format timestamp
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    
    // Format date for message groups
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // Handle reply action
    const handleReply = () => {
        if (onReply) {
            onReply(message);
        }
    };
    
    // Get user initials for avatar
    const getUserInitials = () => {
        const name = message.sender?.name || 'Unknown';
        const names = name.split(' ');
        
        if (names.length === 1) {
            return names[0].charAt(0).toUpperCase();
        }
        
        return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    };

    // Render attachments
    const renderAttachments = () => {
        if (!hasAttachments) return null;

        return (
            <div className="space-y-2 mt-2">
                {message.attachments.map((attachment, index) => (
                    <div key={index}>
                        {attachment.is_image ? (
                            <div className="max-w-xs">
                                <img
                                    src={attachment.url}
                                    alt={attachment.filename}
                                    className="w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                    onClick={() => window.open(attachment.url, '_blank')}
                                />
                                <div className="text-xs text-gray-500 mt-1">
                                    {attachment.filename} ({attachment.human_size})
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center p-3 bg-gray-100 rounded-lg max-w-xs">
                                <div className="flex-shrink-0 mr-3">
                                    {attachment.mime?.startsWith('video/') ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                        </svg>
                                    ) : attachment.mime === 'application/pdf' ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-gray-900 truncate">
                                        {attachment.filename}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {attachment.human_size}
                                    </div>
                                </div>
                                <div className="flex-shrink-0 ml-3">
                                    <a
                                        href={attachment.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                    >
                                        Download
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    // Render message content based on type
    const renderMessageContent = () => {
        if (isSystem) {
            return (
                <div className="text-center text-sm text-gray-500 py-2 bg-gray-100 rounded-full px-4">
                    {message.body}
                </div>
            );
        }

        return (
            <div className={`${isCurrentUser ? 'text-white' : 'text-gray-800'}`}>
                {/* Message text */}
                {message.body && (
                    <div className="whitespace-pre-wrap">
                        {message.body}
                    </div>
                )}

                {/* Attachments */}
                {renderAttachments()}
            </div>
        );
    };

    if (isSystem) {
        return (
            <div className="flex justify-center my-2">
                {renderMessageContent()}
            </div>
        );
    }

    return (
        <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
            {/* Avatar for other users in group chats */}
            {!isCurrentUser && isGroupChat && (
                <div className="flex-shrink-0 mr-2 self-end mb-1">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-800 font-semibold text-xs">
                            {getUserInitials()}
                        </span>
                    </div>
                </div>
            )}
            
            <div className="flex flex-col max-w-xs md:max-w-md">
                {/* Sender name for group chats or when not current user */}
                {!isCurrentUser && (
                    <div className="text-xs font-medium text-gray-600 mb-1 ml-1">
                        {message.sender?.name}
                    </div>
                )}
                
                {/* Message bubble */}
                <div 
                    className={`rounded-2xl px-4 py-2 shadow-sm ${
                        isCurrentUser 
                            ? 'bg-indigo-600 text-white rounded-br-none' 
                            : 'bg-white border border-gray-200 rounded-bl-none'
                    }`}
                >
                    {/* Message content */}
                    {renderMessageContent()}
                </div>
                
                {/* Message metadata */}
                <div className={`text-xs mt-1 flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-gray-500">{formatTime(message.created_at)}</span>
                    {isCurrentUser && hasBeenSeen && (
                        <span className="ml-1 text-gray-500" title={`Seen by ${seenByOthers.join(', ')}`}>
                            • Seen
                        </span>
                    )}
                </div>
            </div>
            
            {/* Avatar for current user */}
            {isCurrentUser && isGroupChat && (
                <div className="flex-shrink-0 ml-2 self-end mb-1">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-800 font-semibold text-xs">
                            {getUserInitials()}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}