import React, { useState, useEffect } from 'react';

export default function TypingIndicator({ typingUsers }) {
    const [visibleUsers, setVisibleUsers] = useState([]);

    // Update visible users when typingUsers changes
    useEffect(() => {
        setVisibleUsers(typingUsers);

        // Auto-clear users after 5 seconds if they're still in the list
        // This is a fallback in case the server-side timeout fails
        const timeout = setTimeout(() => {
            setVisibleUsers(prev => prev.filter(user => !typingUsers.includes(user)));
        }, 5000);

        return () => clearTimeout(timeout);
    }, [typingUsers]);

    if (visibleUsers.length === 0) return null;

    const typingText = visibleUsers.length === 1
        ? `${visibleUsers[0].name} is typing`
        : visibleUsers.length === 2
        ? `${visibleUsers[0].name} and ${visibleUsers[1].name} are typing`
        : `${visibleUsers.length} people are typing`;

    return (
        <div className="flex items-center p-2">
            <div className="flex space-x-1">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <span className="ml-2 text-sm text-gray-500 italic">{typingText}</span>
            <span className="ml-1 text-xs text-gray-400">...</span>
        </div>
    );
}