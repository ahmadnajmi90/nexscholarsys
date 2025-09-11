import React, { useState, useRef, useEffect } from 'react';
import { usePage } from '@inertiajs/react';

export default function Composer({ onSend, replyingTo, conversationId, echoChannel }) {
    const { auth } = usePage().props;
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [attachments, setAttachments] = useState([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const typingDebounceRef = useRef(null);

    // Focus textarea when component mounts
    useEffect(() => {
        textareaRef.current?.focus();
    }, []);

    // Cleanup timeouts on unmount
    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            if (typingDebounceRef.current) {
                clearTimeout(typingDebounceRef.current);
            }
        };
    }, []);

    // Handle typing events with debounce
    const handleTyping = () => {
        const value = textareaRef.current.value;
        setMessage(value);

        // Clear previous timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Clear previous debounce
        if (typingDebounceRef.current) {
            clearTimeout(typingDebounceRef.current);
        }

        // Send typing event with debounce (only if there's content)
        if (echoChannel && value.trim()) {
            typingDebounceRef.current = setTimeout(() => {
                echoChannel.whisper('typing', {
                    id: Date.now(),
                    name: auth.user.name,
                    timestamp: Date.now()
                });

                // Clear debounce after sending
                typingDebounceRef.current = null;
            }, 300); // 300ms debounce
        }

        // Set timeout to clear typing status after user stops typing
        typingTimeoutRef.current = setTimeout(() => {
            // Typing stopped, clear any pending debounce
            if (typingDebounceRef.current) {
                clearTimeout(typingDebounceRef.current);
                typingDebounceRef.current = null;
            }
        }, 1500); // Clear typing after 1.5s of inactivity
    };

    // Handle file selection
    const handleFileSelect = (files) => {
        const newAttachments = Array.from(files).map(file => ({
            file,
            preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
            name: file.name,
            size: file.size,
            type: file.type
        }));

        setAttachments(prev => [...prev, ...newAttachments]);
    };

    // Handle file input change
    const handleFileInputChange = (e) => {
        handleFileSelect(e.target.files);
        // Reset input
        e.target.value = '';
    };

    // Handle drag and drop
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        handleFileSelect(e.dataTransfer.files);
    };

    // Remove attachment
    const removeAttachment = (index) => {
        setAttachments(prev => {
            const newAttachments = [...prev];
            if (newAttachments[index].preview) {
                URL.revokeObjectURL(newAttachments[index].preview);
            }
            newAttachments.splice(index, 1);
            return newAttachments;
        });
    };

    // Format file size
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Handle sending message
    const handleSend = () => {
        const trimmedMessage = message.trim();
        console.log('[Messaging Debug] Composer handleSend called with raw message:', message);
        console.log('[Messaging Debug] Composer trimmed message:', trimmedMessage);

        const hasContent = trimmedMessage || attachments.length > 0;

        if (!hasContent || isSending) return;

        setIsSending(true);

        // Determine message type
        let messageType = 'text';
        if (attachments.length > 0) {
            const firstAttachment = attachments[0];
            if (firstAttachment.type.startsWith('image/')) {
                messageType = 'image';
            } else {
                messageType = 'file';
            }
        }

        console.log('[Messaging Debug] Composer determined message type:', messageType);

        // Prepare FormData for file uploads
        const formData = new FormData();

        formData.append('type', messageType);
        if (trimmedMessage) {
            formData.append('body', trimmedMessage);
        }
        if (replyingTo?.id) {
            formData.append('reply_to_id', replyingTo.id);
        }

        // Add attachments
        attachments.forEach((attachment, index) => {
            formData.append(`attachments[${index}]`, attachment.file);
        });

        // Log all FormData entries
        console.log('[Messaging Debug] Composer FormData entries:');
        for (let [key, value] of formData.entries()) {
            console.log(`[Messaging Debug]   ${key}:`, value);
        }

        console.log('[Messaging Debug] Composer calling onSend with:', { formData, body: trimmedMessage });
        onSend({ formData, body: trimmedMessage }).finally(() => {
            setMessage('');
            setAttachments([]);
            setIsSending(false);
            textareaRef.current?.focus();

            // Clean up object URLs
            attachments.forEach(attachment => {
                if (attachment.preview) {
                    URL.revokeObjectURL(attachment.preview);
                }
            });
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
        <div className="space-y-3">
            {/* Attachments Preview */}
            {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {attachments.map((attachment, index) => (
                        <div key={index} className="relative bg-gray-100 rounded-lg p-2 flex items-center space-x-2 max-w-xs">
                            {attachment.preview ? (
                                <img
                                    src={attachment.preview}
                                    alt={attachment.name}
                                    className="w-10 h-10 object-cover rounded"
                                />
                            ) : (
                                <div className="w-10 h-10 bg-gray-300 rounded flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-900 truncate">
                                    {attachment.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {formatFileSize(attachment.size)}
                                </div>
                            </div>
                            <button
                                onClick={() => removeAttachment(index)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Drag and Drop Area */}
            <div
                className={`relative border-2 border-dashed rounded-lg transition-colors ${
                    isDragOver
                        ? 'border-indigo-400 bg-indigo-50'
                        : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="flex items-end space-x-2 p-3">
                    <div className="flex-1 relative">
                        <textarea
                            ref={textareaRef}
                            value={message}
                            onChange={handleTyping}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a message..."
                            className="w-full px-4 py-3 border-0 focus:ring-0 resize-none"
                            rows="1"
                            disabled={isSending}
                        />
                    </div>

                    {/* File Upload Button */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                        onChange={handleFileInputChange}
                        className="hidden"
                    />

                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                        title="Attach files"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a3 3 0 01-3 3H8a1 1 0 010-2h3a1 1 0 010-2H8a1 1 0 010-2h3a3 3 0 003-3V7a5 5 0 00-5-5z" clipRule="evenodd" />
                        </svg>
                    </button>

                    <button
                        onClick={handleSend}
                        disabled={(!message.trim() && attachments.length === 0) || isSending}
                        className={`p-3 rounded-full transition-colors ${
                            (message.trim() || attachments.length > 0) && !isSending
                                ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                                : 'bg-gray-200 text-gray-400'
                        }`}
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

                {/* Drag and drop overlay */}
                {isDragOver && (
                    <div className="absolute inset-0 bg-indigo-500 bg-opacity-10 border-2 border-indigo-500 border-dashed rounded-lg flex items-center justify-center">
                        <div className="text-indigo-600 font-medium">
                            Drop files here to attach
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}