import React, { useState, useEffect, useRef } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import MessageItem from '@/Components/Messaging/MessageItem';
import Composer from '@/Components/Messaging/Composer';
import TypingIndicator from '@/Components/Messaging/TypingIndicator';
import ParticipantList from '@/Components/Messaging/ParticipantList';
import ConversationCard from '@/Components/Messaging/ConversationCard';
import { usePage, router, Link } from '@inertiajs/react';
import axios from 'axios';
import { Phone, Video, MoreVertical, X, Search, MessageSquare } from 'lucide-react';

export default function Show() {
    const { auth, conversation, conversations } = usePage().props;
    console.log('[Messaging Debug] Component mounted with props:', { auth, conversation });
    console.log('[Messaging Debug] Initial conversation.messages:', conversation.messages);
    const [messages, setMessages] = useState(conversation.messages || []);
    console.log('[Messaging Debug] Initial messages state:', conversation.messages?.data || []);
    const [participants, setParticipants] = useState(conversation.participants || []);
    const [typingUsers, setTypingUsers] = useState([]);
    const [replyingTo, setReplyingTo] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
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
        if (messages.length > 0 && usePage().props.next_before_id) {
            const beforeId = usePage().props.next_before_id;
            
            axios.get(
                route('api.app.messaging.messages.index', conversation?.id),
                { params: { before_id: beforeId, limit: 50 } }
            ).then(response => {
                const olderMessages = response.data.data || [];
                
                if (olderMessages.length > 0) {
                    // Add older messages to the beginning of the array
                    setMessages(prev => [...olderMessages, ...prev]);
                    
                    // Update the next_before_id in the page props
                    if (response.data.meta && response.data.meta.next_before_id) {
                        router.reload({
                            only: ['next_before_id'],
                            data: { next_before_id: response.data.meta.next_before_id },
                            preserveState: true,
                            preserveScroll: true
                        });
                    } else {
                        router.reload({
                            only: ['next_before_id'],
                            data: { next_before_id: null },
                            preserveState: true,
                            preserveScroll: true
                        });
                    }
                }
            }).catch(error => {
                console.error('Error loading more messages:', error);
            });
        }
    };

    // Subscribe to Echo channels
    useEffect(() => {
        if (!conversation?.id) return;
    
        const echo = window.Echo; // Use the already-configured Echo instance
    
        if (echo) {
            echoRef.current = echo;
    
            const privateChannel = echo.private(`conversation.${conversation.id}`);
    
            privateChannel.listen('.message.sent', (e) => {
                // Check if this is a message we sent (with temp_id)
                if (e.temp_id) {
                    setMessages(prev => prev.map(msg => 
                        msg.id === e.temp_id ? { ...e, id: e.id } : msg
                    ));
                } else {
                    // Message from another user
                    setMessages(prev => [...prev, e]);
                }
            });
    
            privateChannel.listen('.message.updated', (e) => {
                if (e.update_type === 'deleted') {
                    setMessages(prev => prev.filter(msg => msg.id !== e.id));
                } else if (e.update_type === 'edited') {
                    setMessages(prev => prev.map(msg =>
                        msg.id === e.id ? e : msg
                    ));
                }
            });
    
            privateChannel.listen('.conversation.read', (e) => {
                setParticipants(prev =>
                    prev.map(p => p.user_id === e.user_id ? 
                        { ...p, last_read_message_id: e.last_read_message_id } : p
                    )
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
            // Leave Echo channels using the Echo instance
            if (window.Echo && conversation?.id) {
                window.Echo.leave(`conversation.${conversation.id}`);
                window.Echo.leave(`presence.conversation.${conversation.id}`);
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
    const handleSendMessage = ({ formData, body }) => {
        console.log('[Messaging Debug] handleSendMessage called with:', { formData, body });

        // Log FormData entries
        console.log('[Messaging Debug] FormData entries:');
        for (let [key, value] of formData.entries()) {
            console.log(`[Messaging Debug]   ${key}:`, value);
        }

        // Get temp_id from formData
        const tempId = formData.get('temp_id');
        
        // Optimistic update - add temporary message
        const tempMessage = {
            id: tempId,
            conversation_id: conversation?.id,
            user_id: auth.user.id,
            type: formData.get('type') || 'text',
            body: body,
            reply_to_id: formData.get('reply_to_id') || null,
            sender: auth.user,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        console.log('[Messaging Debug] Adding optimistic message:', tempMessage);
        setMessages(prev => {
            const newMessages = [...prev, tempMessage];
            console.log('[Messaging Debug] Messages after optimistic update:', newMessages);
            return newMessages;
        });
        setReplyingTo(null);

        // Send message to server and return a Promise that supports .finally()
        return axios.post(
            route('api.app.messaging.messages.store', conversation?.id),
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        ).then(response => {
            console.log('[Messaging Debug] Server response:', response);
            console.log('[Messaging Debug] Real message from server:', response.data.data);

            // Replace temporary message with real one
            const realMessage = response.data.data;
            setMessages(prev => {
                const newMessages = prev.map(msg =>
                    msg.id === tempId ? realMessage : msg
                );
                console.log('[Messaging Debug] Messages after replacing temp with real:', newMessages);
                return newMessages;
            });
            return response;
        }).catch(error => {
            console.log('[Messaging Debug] Error sending message:', error);
            // Remove temporary message on error
            setMessages(prev => {
                const newMessages = prev.filter(msg => msg.id !== tempId);
                console.log('[Messaging Debug] Messages after removing temp on error:', newMessages);
                return newMessages;
            });
            throw error;
        });
    };

    // Get conversation title or participants names
    const getTitle = () => {
        if (conversation?.title) return conversation.title;

        const participantsList = conversation?.participants || [];
        const otherParticipants = participantsList
            .filter(p => p.user?.id !== auth?.user?.id)
            .map(p => p.user?.name || 'Unknown');

        if (otherParticipants.length === 0) return 'Unknown';
        if (otherParticipants.length === 1) return otherParticipants[0];
        return otherParticipants.slice(0, 3).join(', ') + (otherParticipants.length > 3 ? ` +${otherParticipants.length - 3}` : '');
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
    
    // Filter conversations based on search term
    const filteredConversations = (conversations || []).filter(conv => {
        const title = conv.title ||
            (conv.participants || [])
                .filter(p => p.user?.id !== auth?.user?.id)
                .map(p => p.user?.name || 'Unknown')
                .join(', ');
        return title.toLowerCase().includes(searchTerm.toLowerCase());
    });

    // Check if conversation is direct message (1-on-1)
    const isDirectMessage = () => {
        const participantsList = conversation?.participants || [];
        const otherParticipants = participantsList.filter(p => p.user?.id !== auth?.user?.id);
        return otherParticipants.length === 1;
    };

    // Check if other user is online (for direct messages)
    const isOtherUserOnline = () => {
        if (!isDirectMessage()) return false;
        
        const participantsList = conversation?.participants || [];
        const otherParticipant = participantsList.find(p => p.user?.id !== auth?.user?.id);
        
        if (!otherParticipant) return false;
        
        return onlineUsers.some(u => u.id === otherParticipant.user?.id);
    };

    return (
        <MainLayout title={getTitle() || 'Conversation'}>
            <div className="flex h-[calc(100vh-64px)]">
                {/* Left Sidebar - Conversations List */}
                <div className="w-80 flex-shrink-0 border-r border-gray-200 bg-white flex flex-col h-full">
                    {/* Messages Header */}
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                        <h1 className="text-xl font-semibold">Messages</h1>
                        <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                            <MoreVertical className="h-5 w-5" />
                        </button>
                    </div>
                    
                    {/* Search Box */}
                    <div className="p-4 border-b border-gray-200">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Conversations List */}
                    <div className="flex-1 overflow-y-auto">
                        {filteredConversations.length > 0 ? (
                            filteredConversations.map(conv => (
                                <ConversationCard 
                                    key={conv.id} 
                                    conversation={conv}
                                    isSelected={conversation?.id === conv.id}
                                />
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                {searchTerm ? 'No conversations found.' : 'No conversations yet.'}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Content - Conversation */}
                <div className="flex-1 flex flex-col h-full">
                    {/* Conversation Header */}
                    <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                        <div className="flex items-center">
                            {/* Avatar with online indicator */}
                            <div className="flex-shrink-0 relative mr-3">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                    <span className="text-indigo-800 font-semibold">
                                        {getUserInitials()}
                                    </span>
                                </div>
                                {isOtherUserOnline() && (
                                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                                )}
                            </div>
                            
                            <div>
                                <h1 className="text-lg font-semibold">
                                    {getTitle() || 'Loading...'}
                                </h1>
                                <ParticipantList participants={participants} onlineUsers={onlineUsers} />
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                                <Phone className="h-5 w-5" />
                            </button>
                            <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                                <Video className="h-5 w-5" />
                            </button>
                            <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                                <MoreVertical className="h-5 w-5" />
                            </button>
                            <Link href={route('messages.index')} className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                                <X className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Messages Container */}
                    <div
                        ref={messagesContainerRef}
                        className="flex-1 overflow-y-auto p-4 bg-gray-50"
                    >
                        <div className="space-y-4 max-w-3xl mx-auto">
                            {/* Load more button at top */}
                            {conversation?.messages?.next_page_url && (
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
                                    isGroupChat={!isDirectMessage()}
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
                            <div className="flex items-start max-w-3xl mx-auto">
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
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Message Composer */}
                    <div className="bg-white border-t border-gray-200 p-4">
                        <div className="max-w-3xl mx-auto">
                            <Composer 
                                onSend={handleSendMessage}
                                replyingTo={replyingTo}
                                conversationId={conversation?.id}
                                echoChannel={presenceChannelRef.current}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}