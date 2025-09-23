import React, { useState, useEffect, useRef, useMemo } from 'react';
import { usePage } from '@inertiajs/react';
import ChatHeader from '@/Components/Messaging/ChatHeader';
import MessageList from '@/Components/Messaging/MessageList';
import MessageComposer from '@/Components/Messaging/MessageComposer';
import AttachmentPreviewModal from '@/Components/ProjectHub/AttachmentPreviewModal';
import axios from 'axios';
import { debounce } from 'lodash';
import { toast } from 'react-hot-toast';
import { format, isSameDay } from 'date-fns';

export default function ThreadPane({
  conversationId,
  auth,
  onConversationRead,
  onConversationIncrementUnread,
  onAfterSend
}) {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [oldestMessageId, setOldestMessageId] = useState(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [previewFile, setPreviewFile] = useState(null);

  // Echo channel reference
  const channelRef = useRef(null);

  // Current user ID
  const currentUserId = auth.user.id;

  // Adapter function to convert messaging attachment to preview modal format
  const toPreviewFile = (attachment) => {
    const url = attachment.url || attachment.download_url;
    const name = attachment.filename || attachment.original_name || (attachment.path ? attachment.path.split('/').pop() : 'file');

    return {
      url,
      original_name: name,
      mime_type: attachment.mime,
      size_formatted: attachment.human_size || (attachment.bytes ? `${(attachment.bytes / 1024).toFixed(1)} KB` : undefined),
      created_at: attachment.created_at,
    };
  };

  // Handle attachment preview
  const handleAttachmentClick = (attachment) => {
    setPreviewFile(toPreviewFile(attachment));
  };

  // Chronological ordering with date separators and grouping
  const messagesWithSeparators = useMemo(() => {
    if (!messages || messages.length === 0) return [];

    // Sort messages chronologically (oldest first)
    const sortedMessages = [...messages].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      if (dateA !== dateB) return dateA - dateB;
      return (a.id ?? 0) - (b.id ?? 0);
    });

    // Add date separators and group consecutive messages
    const withSeparators = [];
    let lastDate = null;

    sortedMessages.forEach((message, index) => {
      const messageDate = new Date(message.created_at);
      const messageDay = format(messageDate, 'yyyy-MM-dd');

      // Add date separator if needed
      if (lastDate !== messageDay) {
        const separatorLabel = isSameDay(messageDate, new Date())
          ? 'Today'
          : isSameDay(messageDate, new Date(Date.now() - 24 * 60 * 60 * 1000))
          ? 'Yesterday'
          : format(messageDate, 'dd/MM/yyyy');

        withSeparators.push({
          id: `separator-${messageDay}`,
          type: 'separator',
          label: separatorLabel,
          date: messageDate
        });
        lastDate = messageDay;
      }

      // Determine grouping flags for better layout
      const isOwn = message.user_id === currentUserId;
      const prevMessage = index > 0 ? sortedMessages[index - 1] : null;
      const nextMessage = index < sortedMessages.length - 1 ? sortedMessages[index + 1] : null;

      let shouldIndent = false;
      let isGroupedWithPrev = false;
      let isGroupedWithNext = false;
      let isGroupHead = true;
      let isGroupTail = true;

      if (prevMessage) {
        const isSameSender = prevMessage.user_id === message.user_id;
        const timeDiff = new Date(message.created_at) - new Date(prevMessage.created_at);
        const withinTimeWindow = timeDiff < 5 * 60 * 1000; // 5 minutes

        if (isSameSender && withinTimeWindow) {
          isGroupedWithPrev = true;
          isGroupHead = false;
        }
      }

      if (nextMessage) {
        const isSameSender = nextMessage.user_id === message.user_id;
        const timeDiff = new Date(nextMessage.created_at) - new Date(message.created_at);
        const withinTimeWindow = timeDiff < 5 * 60 * 1000; // 5 minutes

        if (isSameSender && withinTimeWindow) {
          isGroupedWithNext = true;
          isGroupTail = false;
        }
      }

      // Legacy shouldIndent for backward compatibility
      shouldIndent = !isOwn && isGroupedWithPrev;

      // Add the message with comprehensive grouping info
      withSeparators.push({
        ...message,
        shouldIndent,
        isOwn,
        isGroupedWithPrev,
        isGroupedWithNext,
        isGroupHead,
        isGroupTail
      });
    });

    return withSeparators;
  }, [messages, currentUserId]);

  // Typing indicator with debounced timeout
  const typingTimeouts = useRef(new Map());

  const addTypingUser = (user) => {
    setTypingUsers(prev => {
      if (!prev.some(u => u.id === user.id)) {
        return [...prev, user];
      }
      return prev;
    });

    // Clear any existing timeout for this user
    if (typingTimeouts.current.has(user.id)) {
      clearTimeout(typingTimeouts.current.get(user.id));
    }

    // Set a timeout to remove the user after 3 seconds of inactivity
    const timeout = setTimeout(() => {
      setTypingUsers(prev => prev.filter(u => u.id !== user.id));
      typingTimeouts.current.delete(user.id);
    }, 3000);

    typingTimeouts.current.set(user.id, timeout);
  };

  const removeTypingUser = (userId) => {
    if (typingTimeouts.current.has(userId)) {
      clearTimeout(typingTimeouts.current.get(userId));
      typingTimeouts.current.delete(userId);
    }
    setTypingUsers(prev => prev.filter(u => u.id !== userId));
  };
  
  // Initialize on component mount or when conversationId changes
  useEffect(() => {
    // Reset state when conversation changes
    setConversation(null);
    setMessages([]);
    setIsLoading(true);
    setError(null);
    setTypingUsers([]);
    setOldestMessageId(null);
    
    // Clean up previous subscription
    if (channelRef.current) {
      channelRef.current.stopListening('.MessageSent');
      channelRef.current.stopListening('.MessageEdited');
      channelRef.current.stopListening('.MessageDeleted');
      channelRef.current.stopListening('.ReadAdvanced');
      channelRef.current.stopListening('.TypingChanged');
      channelRef.current.stopListening('.ConversationUpdated');
      channelRef.current.unsubscribe();
      channelRef.current = null;
    }
    
    // Fetch conversation details and initial messages
    fetchConversation();
    fetchMessages();
    
    // Clean up on unmount
    return () => {
      if (channelRef.current) {
        channelRef.current.stopListening('.MessageSent');
        channelRef.current.stopListening('.MessageEdited');
        channelRef.current.stopListening('.MessageDeleted');
        channelRef.current.stopListening('.ReadAdvanced');
        channelRef.current.stopListening('.TypingChanged');
        channelRef.current.stopListening('.ConversationUpdated');
        channelRef.current.unsubscribe();
      }
    };
  }, [conversationId]);
  
  // Set up Echo listeners when conversation is loaded
  useEffect(() => {
    if (!conversation) return;
    
    // Subscribe to the conversation channel
    const channel = window.Echo.private(`conversation.${conversationId}`);
    channelRef.current = channel;
    
    // Listen for new messages
    channel.listen('.MessageSent', (e) => {
      const newMessage = e.message;

      // Use functional state update to check for duplicates and add message
      setMessages(prev => {
        // Check if we already have this message (to avoid duplicates)
        const messageExists = prev.some(m => m.id === newMessage.id);

        if (!messageExists) {
          // If this is a message from someone else and we're at the bottom, auto-mark as read
          if (newMessage.user_id !== currentUserId && isAtBottom) {
            handleMessageRead(newMessage.id);
          }

          // Return new state with message added
          return [...prev, newMessage];
        }

        // Return unchanged state if message already exists
        return prev;
      });
    });
    
    // Listen for edited messages
    channel.listen('.MessageEdited', (e) => {
      setMessages(prev => prev.map(message => 
        message.id === e.id
          ? { ...message, body: e.body, edited_at: e.edited_at }
          : message
      ));
    });
    
    // Listen for deleted messages
    channel.listen('.MessageDeleted', (e) => {
      if (e.scope === 'all') {
        setMessages(prev => prev.map(message => 
          message.id === e.id
            ? { ...message, deleted_at: new Date().toISOString() }
            : message
        ));
      }
    });
    
    // Listen for read receipts
    channel.listen('.ReadAdvanced', (e) => {
      // Update the conversation participants with the new read status
      if (e.user_id !== currentUserId) {
        setConversation(prev => {
          if (!prev) return prev;
          
          const updatedParticipants = prev.participants.map(participant => 
            participant.user_id === e.user_id
              ? { ...participant, last_read_message_id: e.last_read_message_id }
              : participant
          );
          
          return { ...prev, participants: updatedParticipants };
        });
      }
    });
    
    // Listen for typing indicators
    channel.listen('.TypingChanged', (e) => {
      if (e.user_id === currentUserId) return;

      if (e.is_typing) {
        // Find the user in the conversation participants
        const typingUser = conversation.participants.find(p => p.user_id === e.user_id)?.user;
        if (typingUser) {
          addTypingUser(typingUser);
        }
      } else {
        removeTypingUser(e.user_id);
      }
    });
    
    // Listen for conversation updates
    channel.listen('.ConversationUpdated', (e) => {
      setConversation(e.conversation);
    });
    
  }, [conversation, conversationId]);
  
  // Fetch conversation details
  const fetchConversation = async () => {
    try {
      const response = await axios.get(`/api/v1/app/messaging/conversations/${conversationId}`);
      setConversation(response.data.data);
    } catch (err) {
      console.error('Error fetching conversation:', err);
      
      // If we get a 403 error, show error message
      if (err.response && err.response.status === 403) {
        toast.error('You do not have access to this conversation.');
        setError('You do not have access to this conversation.');
        return;
      }
      
      setError('Failed to load conversation details.');
    }
  };
  
  // Fetch messages
  const fetchMessages = async (before = null) => {
    if (before) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }
    
    try {
      const response = await axios.get(`/api/v1/app/messaging/conversations/${conversationId}/messages`, {
        params: { 
          before,
          limit: 50
        }
      });
      
      const newMessages = response.data.data || [];
      
      if (before) {
        // Prepend older messages
        setMessages(prev => [...newMessages, ...prev]);
      } else {
        // Initial load
        setMessages(newMessages);
      }
      
      // Update pagination state
      setHasMore(response.data.meta?.has_more || false);
      if (newMessages.length > 0) {
        setOldestMessageId(response.data.meta?.next_before);
      }
      
    } catch (err) {
      console.error('Error fetching messages:', err);
      
      // If we get a 403 error, show error message
      if (err.response && err.response.status === 403) {
        toast.error('You do not have access to this conversation.');
        setError('You do not have access to this conversation.');
        return;
      }
      
      setError('Failed to load messages.');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };
  
  // Load more messages when scrolling up
  const handleLoadMore = () => {
    if (hasMore && !isLoadingMore && oldestMessageId) {
      fetchMessages(oldestMessageId);
    }
  };
  
  // Send a new message
  const handleSendMessage = async (formData, config = {}) => {
    setIsSubmitting(true);
    
    try {
      const response = await axios.post(
        `/api/v1/app/messaging/conversations/${conversationId}/messages`, 
        formData,
        config
      );
      
      // The message will be added via the Echo listener
      return response.data.data;
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Mark messages as read
  const handleMessageRead = async (messageId) => {
    try {
      await axios.post(`/api/v1/app/messaging/conversations/${conversationId}/read`, {
        last_read_message_id: messageId
      });

      // Notify parent to clear unread badge
      if (onConversationRead) {
        onConversationRead(conversationId);
      }
    } catch (err) {
      console.error('Error marking message as read:', err);
    }
  };
  
  // Update typing status
  const handleTypingChange = debounce(async (isTyping) => {
    try {
      await axios.post(`/api/v1/app/messaging/conversations/${conversationId}/typing`, {
        is_typing: isTyping
      });
    } catch (err) {
      console.error('Error updating typing status:', err);
    }
  }, 300);
  
  // Toggle archive status
  const handleArchive = async () => {
    try {
      const response = await axios.post(`/api/v1/app/messaging/conversations/${conversationId}/archive`);
      
      // Update conversation with new archive status
      setConversation(prev => ({
        ...prev,
        archived_at: response.data.archived ? new Date().toISOString() : null
      }));
    } catch (err) {
      console.error('Error toggling archive status:', err);
    }
  };
  
  return (
    <div className="flex flex-col h-full w-full">
      {/* Chat header */}
      {conversation ? (
        <ChatHeader 
          conversation={conversation} 
          onArchive={handleArchive}
        />
      ) : (
        <div className="p-3 border-b flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-muted animate-pulse"></div>
          <div className="flex-1">
            <div className="h-5 w-32 bg-muted animate-pulse rounded"></div>
            <div className="h-4 w-24 bg-muted animate-pulse rounded mt-1"></div>
          </div>
        </div>
      )}
      
      {/* Message list */}
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-center p-4">
            <div>
              <p className="text-red-500 mb-2">{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  fetchConversation();
                  fetchMessages();
                }}
                className="text-primary hover:underline"
              >
                Try again
              </button>
            </div>
          </div>
        ) : (
          <MessageList
            messages={messagesWithSeparators}
            conversationId={conversationId}
            conversationType={conversation?.type ?? 'direct'}
            participants={conversation?.participants || []}
            isLoadingMore={isLoadingMore}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            onMessageRead={handleMessageRead}
            onAttachmentClick={handleAttachmentClick}
            onScrollPositionChange={(isNearBottom) => setIsAtBottom(isNearBottom)}
            typingUsers={typingUsers}
          />
        )}
      </div>
      
      {/* Message composer */}
      <MessageComposer
        conversationId={conversationId}
        onSendMessage={handleSendMessage}
        onTypingChange={handleTypingChange}
        onAfterSend={onAfterSend}
        isSubmitting={isSubmitting}
      />

      {/* Attachment Preview Modal */}
      <AttachmentPreviewModal
        file={previewFile}
        onClose={() => setPreviewFile(null)}
      />
    </div>
  );
}
