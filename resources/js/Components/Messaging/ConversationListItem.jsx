import React from 'react';
import { usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import Avatar from '@/Components/Shared/Avatar';
import { formatConversationTimestamp } from '@/lib/datetime';

export default function ConversationListItem({ conversation, isActive, onSelect }) {
  const { id, title, type, participants, last_message, unread_count } = conversation;
  const { auth } = usePage().props;
  const meId = auth.user.id;

  // Get the other participant(s) for display
  const otherParticipants = participants.filter(
    p => p.user_id !== meId
  );

  // Get the other user for DMs
  const otherUser = type === 'direct' && otherParticipants.length > 0
    ? otherParticipants[0]?.user
    : null;

  // For direct conversations, use the other person's full_name
  const displayName = otherUser?.full_name ?? otherUser?.name ?? title;
    
  // Get avatar for the conversation
  const getAvatar = () => {
    if (type === 'direct' && otherParticipants.length > 0) {
      const otherUser = otherParticipants[0]?.user;
      const avatarUrl = otherUser?.avatar_url ?? otherUser?.profile_photo_url;

      return (
        <Avatar
          src={avatarUrl}
          alt={otherUser?.full_name || otherUser?.name || 'User'}
          size={40}
        />
      );
    }

    // Group conversation
    return (
      <Avatar
        src={null}
        alt={title}
        size={40}
      />
    );
  };
  
  // Format the timestamp
  const formattedTime = formatConversationTimestamp(last_message?.created_at ?? conversation.updated_at);
  
  // Get the message snippet
  const getMessageSnippet = () => {
    if (!last_message) return 'No messages yet';
    
    if (last_message.type === 'text') {
      const body = last_message.body ?? '';
      return body.trim().replace(/\s+/g, ' ');
    } else if (last_message.type === 'image') {
      return '📷 Image';
    } else if (last_message.type === 'file') {
      return '📎 File';
    } else if (last_message.type === 'system') {
      const body = last_message.body ?? '';
      return body.trim().replace(/\s+/g, ' ');
    }
    
    return '';
  };

  const handleClick = () => {
    if (onSelect) {
      onSelect(id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer min-w-0 w-full overflow-hidden',
        isActive 
          ? 'bg-primary/10 text-primary' 
          : 'hover:bg-muted/50'
      )}
    >
      <div className="relative shrink-0">
        {getAvatar()}
        {otherParticipants.length > 0 && otherParticipants[0]?.user?.is_online && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
        )}
      </div>
      
      <div className="flex-1 min-w-0 overflow-hidden">
        <div className="flex items-center justify-between min-w-0">
          <h3 
            className="font-medium truncate pr-2 min-w-0 flex-1 overflow-hidden"
            title={displayName}
          >
            {displayName}
          </h3>

          <span className="text-xs text-muted-foreground shrink-0 whitespace-nowrap">
            {formattedTime}
          </span>
        </div>
        
        <div className="mt-0.5 flex items-center justify-between min-w-0">
          <p
            className="text-sm text-muted-foreground truncate pr-1 min-w-0 flex-1 break-words overflow-hidden"
            title={last_message?.sender?.id === meId
              ? `You: ${getMessageSnippet()}`
              : getMessageSnippet()}
          >
            {last_message?.sender?.id === meId
              ? `You: ${getMessageSnippet()}`
              : getMessageSnippet()}
          </p>

          {unread_count > 0 && (
            <span className="shrink-0 ml-1 flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-primary rounded-full">
              {unread_count}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
