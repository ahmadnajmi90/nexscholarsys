import React from 'react';

export default function MessageItem({ message, currentUser, onReply }) {
    const isCurrentUser = message.user_id === currentUser.id;
    const isText = message.type === 'text';
    const isSystem = message.type === 'system';
    
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

    // Render message content based on type
    const renderMessageContent = () => {
        if (isSystem) {
            return (
                <div className="text-center text-sm text-gray-500 py-2">
                    {message.body}
                </div>
            );
        }

        if (isText) {
            return (
                <div className="text-gray-800 whitespace-pre-wrap">
                    {message.body}
                </div>
            );
        }

        // For file/image messages
        return (
            <div className="text-gray-800">
                {message.type === 'image' ? (
                    <div>
                        <img 
                            src={message.body} 
                            alt="Attachment" 
                            className="max-w-xs rounded-lg"
                        />
                    </div>
                ) : (
                    <div className="flex items-center p-2 bg-gray-100 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm">File Attachment</span>
                    </div>
                )}
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
                
                {/* Reply button (only for text messages) */}
                {isText && (
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