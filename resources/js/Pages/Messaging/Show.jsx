import React, { useState, useEffect, useRef } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import MessageItem from '@/Components/Messaging/MessageItem';
import Composer from '@/Components/Messaging/Composer';
import TypingIndicator from '@/Components/Messaging/TypingIndicator';
import ParticipantList from '@/Components/Messaging/ParticipantList';
import { usePage, router } from '@inertiajs/react';

export default function Show() {
    const { auth, conversation } = usePage().props;
    console.log(conversation);
    const [messages, setMessages] = useState(conversation.messages?.data || []);
    const [participants, setParticipants] = useState(conversation.participants || []);
    const [typingUsers, setTypingUsers] = useState([]);
    const [replyingTo, setReplyingTo] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const echoRef = useRef(null);
    const presenceChannelRef = useRef(null);
    const readTimeoutRef = useRef(null);

    // Scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Handle scroll events for auto-mark-as-read
    const handleScroll = () => {
        if (!messagesContainerRef.current) return;

        const container = messagesContainerRef.current;
        const isNearBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 100;

        if (isNearBottom && messages.length > 0) {
            // Clear existing timeout
            if (readTimeoutRef.current) {
                clearTimeout(readTimeoutRef.current);
            }

            // Set timeout to mark messages as read (debounced)
            readTimeoutRef.current = setTimeout(() => {
                markMessagesAsRead();
            }, 500);
        }
    };

    // Mark messages as read
    const markMessagesAsRead = () => {
        if (messages.length === 0) return;

        const lastMessage = messages[messages.length - 1];
        if (lastMessage.id && lastMessage.id.toString().includes('temp_')) return; // Skip temp messages

        router.post(
            route('api.app.messaging.messages.mark-all-read', conversation?.id),
            {},
            {
                preserveScroll: true,
                onError: (errors) => {
                    console.error('Failed to mark messages as read:', errors);
                }
            }
        );
    };

    // Load more messages
    const loadMoreMessages = () => {
        if (messages.length > 0 && conversation.messages?.next_page_url) {
            const beforeId = messages[messages.length - 1].id;
            router.get(
                route('messages.show', conversation?.id),
                { before_id: beforeId },
                {
                    preserveState: true,
                    preserveScroll: true,
                    only: ['conversation'],
                    onSuccess: (page) => {
                        const newMessages = page.props.conversation.messages.data;
                        if (newMessages.length > 0) {
                            setMessages(prev => [...prev, ...newMessages]);
                        }
                    }
                }
            );
        }
    };

    // Subscribe to Echo channels
    useEffect(() => {
        if (!conversation?.id) return;
    
        const echo = window.Echo; // Use the already-configured Echo instance
    
        if (echo) {
            echoRef.current = echo;
    
            const privateChannel = echo.private(`conversation.${conversation.id}`);
    
            privateChannel.listen('MessageSent', (e) => {
                setMessages(prev => [...prev, e.message]);
            });
    
            privateChannel.listen('MessageUpdated', (e) => {
                if (e.action === 'deleted') {
                    setMessages(prev => prev.filter(msg => msg.id !== e.message.id));
                } else if (e.action === 'edited') {
                    setMessages(prev => prev.map(msg =>
                        msg.id === e.message.id ? e.message : msg
                    ));
                }
            });
    
            privateChannel.listen('ConversationRead', (e) => {
                setParticipants(prev =>
                    prev.map(p => p.id === e.participant.id ? e.participant : p)
                );
            });
    
            const presenceChannel = echo.join(`presence.conversation.${conversation.id}`)
                .here((users) => {
                    setOnlineUsers(users.map(u => ({ id: u.id, name: u.name })));
                })
                .joining((user) => {
                    setOnlineUsers(prev => [...prev.filter(u => u.id !== user.id), user]);
                })
                .leaving((user) => {
                    setOnlineUsers(prev => prev.filter(u => u.id !== user.id));
                    setTypingUsers(prev => prev.filter(u => u.id !== user.id));
                })
                .listenForWhisper('typing', (user) => {
                    setTypingUsers(prev => [...prev.filter(u => u.id !== user.id), user]);
                    setTimeout(() => {
                        setTypingUsers(prev => prev.filter(u => u.id !== user.id));
                    }, 3000);
                });

            // Store presence channel reference for use in Composer
            presenceChannelRef.current = presenceChannel;
        }
    
        scrollToBottom();
    
        const messagesContainer = messagesContainerRef.current;
        if (messagesContainer) {
            messagesContainer.addEventListener('scroll', handleScroll);
        }
    
        return () => {
            if (echoRef.current) {
                echoRef.current.leave(`conversation.${conversation.id}`);
                echoRef.current.leave(`presence.conversation.${conversation.id}`);
            }

            // Leave presence channel
            if (presenceChannelRef.current) {
                presenceChannelRef.current.leave();
            }

            if (messagesContainer) {
                messagesContainer.removeEventListener('scroll', handleScroll);
            }
            if (readTimeoutRef.current) {
                clearTimeout(readTimeoutRef.current);
            }
        };
    }, [conversation?.id]);    

    // Scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Handle sending a new message
    const handleSendMessage = (messageData) => {
        // Optimistic update - add temporary message
        const tempId = `temp_${Date.now()}`;
        const tempMessage = {
            id: tempId,
            conversation_id: conversation?.id,
            user_id: auth.user.id,
            type: messageData.type || 'text',
            body: messageData.body,
            reply_to_id: replyingTo?.id || null,
            sender: auth.user,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
        
        setMessages(prev => [...prev, tempMessage]);
        setReplyingTo(null);
        
        // Send message to server and return the Promise
        return router.post(
            route('api.app.messaging.messages.store', conversation?.id),
            messageData,
            {
                preserveScroll: true,
                onSuccess: (page) => {
                    // Replace temporary message with real one
                    const realMessage = page.props.flash?.message ||
                                      page.props.conversation?.last_message;
                    if (realMessage) {
                        setMessages(prev =>
                            prev.map(msg =>
                                msg.id === tempId ? realMessage : msg
                            )
                        );
                    }
                },
                onError: (errors) => {
                    // Remove temporary message on error
                    setMessages(prev => prev.filter(msg => msg.id !== tempId));
                }
            }
        );
    };

    return (
        <MainLayout title={conversation?.title || 'Conversation'}>
            <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col">
                {/* Conversation Header */}
                <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-semibold">
                            {conversation.title ||
                             (conversation.participants || [])
                                .filter(p => p.user?.id !== auth?.user?.id)
                                .map(p => p.user?.name || 'Unknown')
                                .join(', ') ||
                             'Loading...'}
                        </h1>
                        <ParticipantList participants={participants} onlineUsers={onlineUsers} />
                    </div>
                    <div className="flex space-x-2">
                        <button className="p-2 text-gray-500 hover:text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Messages Container */}
                <div
                    ref={messagesContainerRef}
                    className="flex-1 overflow-y-auto p-4 bg-gray-50"
                >
                    <div className="space-y-4">
                        {/* Load more button at top */}
                        {conversation.messages?.next_page_url && (
                            <div className="flex justify-center">
                                <button 
                                    onClick={loadMoreMessages}
                                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                                >
                                    Load more messages
                                </button>
                            </div>
                        )}
                        
                        {/* Messages List */}
                        {messages.map((message) => (
                            <MessageItem
                                key={message.id}
                                message={message}
                                currentUser={auth.user}
                                participants={participants}
                                onReply={(msg) => setReplyingTo(msg)}
                            />
                        ))}
                        
                        {/* Typing Indicator */}
                        <TypingIndicator typingUsers={typingUsers} />
                        
                        {/* Scroll anchor */}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Reply Preview */}
                {replyingTo && (
                    <div className="bg-blue-50 border-t border-b border-blue-200 p-3">
                        <div className="flex items-start">
                            <div className="flex-1">
                                <div className="text-xs text-gray-500">
                                    Replying to {replyingTo.sender?.name}
                                </div>
                                <div className="text-sm text-gray-700 mt-1 line-clamp-2">
                                    {replyingTo.body}
                                </div>
                            </div>
                            <button 
                                onClick={() => setReplyingTo(null)}
                                className="ml-2 text-gray-500 hover:text-gray-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                {/* Message Composer */}
                <div className="bg-white border-t border-gray-200 p-4">
                    <Composer 
                        onSend={handleSendMessage}
                        replyingTo={replyingTo}
                        conversationId={conversation?.id}
                        echoChannel={presenceChannelRef.current}
                    />
                </div>
            </div>
        </MainLayout>
    );
}