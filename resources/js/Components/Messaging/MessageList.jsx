import React, { useEffect, useRef, useState } from 'react';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { usePage } from '@inertiajs/react';
import MessageItem from './MessageItem';
import TypingIndicator from './TypingIndicator';

export default function MessageList({
  messages = [],
  conversationId,
  conversationType = 'direct',
  participants = [],
  isLoadingMore = false,
  hasMore = false,
  onLoadMore,
  onMessageRead,
  onAttachmentClick,
  onScrollPositionChange,
  typingUsers = []
}) {
  const scrollAreaRef = useRef(null);
  const bottomRef = useRef(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [showNewMessagesBanner, setShowNewMessagesBanner] = useState(false);
  const { auth } = usePage().props;

  // Get the current user ID
  const currentUserId = auth.user.id;
  
  // Find the last read message ID for each participant
  const participantReadStatus = participants.reduce((acc, participant) => {
    acc[participant.user_id] = participant.last_read_message_id;
    return acc;
  }, {});
  
  // Check if a message is read by all participants
  const isMessageRead = (message) => {
    if (message.user_id === currentUserId) {
      // Check if all other participants have read this message
      return participants
        .filter(p => p.user_id !== currentUserId)
        .every(p => p.last_read_message_id >= message.id);
    }
    return false;
  };
  
  // Handle scroll events to detect if user is near bottom
  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;

    // Check if we're near the bottom (within 100px)
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShouldAutoScroll(isNearBottom);

    // Notify parent about scroll position
    if (onScrollPositionChange) {
      onScrollPositionChange(isNearBottom);
    }

    // If we're showing the new messages banner and user scrolls to bottom, hide it
    if (isNearBottom && showNewMessagesBanner) {
      setShowNewMessagesBanner(false);
    }

    // Check if we're near the top to load more messages
    if (scrollTop < 50 && hasMore && !isLoadingMore && onLoadMore) {
      onLoadMore();
    }
  };
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (shouldAutoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (!shouldAutoScroll && messages.length > 0) {
      // If we receive a new message and we're not at the bottom, show the banner
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.user_id !== currentUserId) {
        setShowNewMessagesBanner(true);
      }
    }
  }, [messages, shouldAutoScroll]);
  
  // Handle message appearing in viewport
  const handleMessageAppear = (message) => {
    if (onMessageRead) {
      onMessageRead(message.id);
    }
  };
  
  // Scroll to bottom when clicking the new messages banner
  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
      setShowNewMessagesBanner(false);
      setShouldAutoScroll(true);
    }
  };
  
  return (
    <div className="relative flex flex-col h-full">
      <ScrollArea 
        ref={scrollAreaRef} 
        className="flex-1 p-4" 
        onScroll={handleScroll}
      >
        {/* Loading indicator */}
        {isLoadingMore && (
          <div className="flex justify-center py-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
          </div>
        )}
        
        {/* Empty state */}
        {messages.length === 0 && !isLoadingMore && (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className="text-4xl mb-2">👋</div>
            <h3 className="text-xl font-medium">No messages yet</h3>
            <p className="text-muted-foreground mt-1">Send a message to start the conversation</p>
          </div>
        )}
        
        {/* Messages with separators */}
        <div className="space-y-1">
          {messages.map((item, index) => {
            if (item.type === 'separator') {
              return (
                <div key={item.id} className="flex justify-center py-2">
                  <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
                    {item.label}
                  </div>
                </div>
              );
            }

            const message = item;
            return (
              <MessageItem
                key={message.id}
                message={message}
                isOwn={message.isOwn !== undefined ? message.isOwn : message.user_id === currentUserId}
                isRead={isMessageRead(message)}
                onMessageAppear={handleMessageAppear}
                onAttachmentClick={onAttachmentClick}
                previousMessage={index > 0 ? messages[index - 1] : null}
                nextMessage={index < messages.length - 1 ? messages[index + 1] : null}
                shouldIndent={message.shouldIndent || false}
                isGroupedWithPrev={message.isGroupedWithPrev || false}
                isGroupedWithNext={message.isGroupedWithNext || false}
                isGroupHead={message.isGroupHead !== undefined ? message.isGroupHead : true}
                isGroupTail={message.isGroupTail !== undefined ? message.isGroupTail : true}
                conversationType={conversationType}
              />
            );
          })}
        </div>
        
        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <div className="mt-2">
            <TypingIndicator users={typingUsers} />
          </div>
        )}
        
        {/* Auto-scroll anchor */}
        <div ref={bottomRef} />
      </ScrollArea>
      
      {/* New messages banner */}
      {showNewMessagesBanner && (
        <button
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg text-sm font-medium"
          onClick={scrollToBottom}
        >
          New messages ↓
        </button>
      )}
    </div>
  );
}
