import React, { useState, useRef, useEffect } from 'react';
import { usePage } from '@inertiajs/react';

export default function Composer({ onSend, replyingTo, conversationId, echoChannel }) {
    const { auth } = usePage().props;
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const textareaRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    // Focus textarea when component mounts
    useEffect(() => {
        textareaRef.current?.focus();
    }, []);

    // Handle typing events
    const handleTyping = () => {
        const value = textareaRef.current.value;
        setMessage(value);
        
        // Clear previous timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        
        // Send typing event
        if (echoChannel && value.trim()) {
            // Emit typing event
            echoChannel.whisper('typing', {
                id: Date.now(),
                name: auth.user.name
            });
        }
        
        // Set timeout to clear typing status
        typingTimeoutRef.current = setTimeout(() => {
            // Clear typing status if needed
        }, 1000);
    };

    // Handle sending message
    const handleSend = () => {
        const trimmedMessage = message.trim();
        if (!trimmedMessage || isSending) return;
        
        setIsSending(true);
        
        onSend({
            type: 'text',
            body: trimmedMessage,
            reply_to_id: replyingTo?.id || null
        }).finally(() => {
            setMessage('');
            setIsSending(false);
            textareaRef.current?.focus();
        });
    };

    // Handle key events
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex items-end space-x-2">
            <div className="flex-1 relative">
                <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={handleTyping}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                    rows="1"
                    disabled={isSending}
                />
            </div>
            <button
                onClick={handleSend}
                disabled={!message.trim() || isSending}
                className={`p-3 rounded-full ${message.trim() && !isSending ? 'bg-indigo-500 text-white hover:bg-indigo-600' : 'bg-gray-200 text-gray-400'} transition-colors`}
            >
                {isSending ? (
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                )}
            </button>
        </div>
    );
}