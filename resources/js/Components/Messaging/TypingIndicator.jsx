import React from 'react';

export default function TypingIndicator({ typingUsers }) {
    if (typingUsers.length === 0) return null;

    const typingText = typingUsers.length === 1 
        ? `${typingUsers[0].name} is typing` 
        : typingUsers.length === 2
        ? `${typingUsers[0].name} and ${typingUsers[1].name} are typing`
        : `${typingUsers.length} people are typing`;

    return (
        <div className="flex items-center p-2">
            <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <span className="ml-2 text-sm text-gray-500">{typingText}</span>
        </div>
    );
}