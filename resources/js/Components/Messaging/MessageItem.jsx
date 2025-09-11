import React from 'react';

export default function MessageItem({ message, currentUser, onReply }) {
    const isCurrentUser = message.user_id === currentUser.id;
    const isText = message.type === 'text';
    const isSystem = message.type === 'system';
    const hasAttachments = message.attachments && message.attachments.length > 0;
    
    // Format timestamp
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Handle reply action
    const handleReply = () => {
        if (onReply) {
            onReply(message);
        }
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
                                    {attachment.mime.startsWith('video/') ? (
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
                <div className="text-center text-sm text-gray-500 py-2">
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
            <div className="flex justify-center">
                {renderMessageContent()}
            </div>
        );
    }

    return (
        <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md lg:max-w-lg ${isCurrentUser ? 'bg-indigo-500 text-white' : 'bg-white border border-gray-200'} rounded-lg p-3 shadow-sm`}>
                {/* Sender name for group chats (non-current user) */}
                {!isCurrentUser && (
                    <div className="text-xs font-semibold mb-1 text-gray-600">
                        {message.sender?.name}
                    </div>
                )}
                
                {/* Message content */}
                {renderMessageContent()}
                
                {/* Message metadata */}
                <div className={`text-xs mt-1 ${isCurrentUser ? 'text-indigo-100' : 'text-gray-500'} flex justify-between items-center`}>
                    <span>{formatTime(message.created_at)}</span>
                    {isCurrentUser && message.read_at && (
                        <span className="text-indigo-200">✓✓</span>
                    )}
                </div>
                
                {/* Reply button (only for text messages without attachments) */}
                {isText && !hasAttachments && (
                    <div className="mt-1">
                        <button
                            onClick={handleReply}
                            className={`text-xs ${isCurrentUser ? 'text-indigo-200 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Reply
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}