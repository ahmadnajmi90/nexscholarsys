import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';
import Avatar from '@/Components/Shared/Avatar';

export default function ChatHeader({ conversation, onArchive }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { auth } = usePage().props;

  // Get the current user ID
  const currentUserId = auth.user.id;
  
  // Get conversation details
  const { id, title, type, participants = [] } = conversation;
  
  // Get the other participants (excluding current user)
  const otherParticipants = participants.filter(
    p => p.user_id !== currentUserId
  );
  
  // Get the other participant for DMs
  const otherUser = type === 'direct' && otherParticipants.length > 0
    ? otherParticipants[0]?.user
    : null;

  // For direct conversations, use the other person's full_name + avatar_url
  const displayName = otherUser?.full_name ?? otherUser?.name ?? title;
  
  // Check if the other user is online (for direct conversations)
  const isOnline = type === 'direct' && otherParticipants.length > 0 && 
    otherParticipants[0]?.user?.is_online;
  
  // Get the last seen time for direct conversations
  const lastSeen = type === 'direct' && otherParticipants.length > 0 && 
    otherParticipants[0]?.user?.last_seen_at;
  
  // Format last seen time
  const formatLastSeen = () => {
    if (!lastSeen) return 'Offline';
    
    const lastSeenDate = new Date(lastSeen);
    const now = new Date();
    const diffMinutes = Math.floor((now - lastSeenDate) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };
  
  // Get avatar for the conversation
  const getAvatar = () => {
    if (type === 'direct' && otherUser) {
      const avatarUrl = otherUser.avatar_url ?? otherUser.profile_photo_url;
      return (
        <Avatar
          src={avatarUrl}
          alt={otherUser.full_name ?? otherUser.name}
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
  
  // Toggle the dropdown menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  // Close the menu when clicking outside
  const handleClickOutside = (e) => {
    if (e.target.closest('.menu-container')) return;
    setIsMenuOpen(false);
  };
  
  // Add event listener when menu is open
  React.useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen]);
  
  // Handle archive action
  const handleArchive = () => {
    if (onArchive) {
      onArchive();
    }
    setIsMenuOpen(false);
  };
  
  return (
    <div className="flex items-center justify-between p-3 border-b">
      <div className="flex items-center gap-3">
        <div className="relative">
          {getAvatar()}
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          )}
        </div>
        
        <div>
          <h2 className="font-medium">{displayName}</h2>
          {type === 'direct' && (
            <p className="text-xs text-muted-foreground">
              {isOnline ? 'Online' :
               lastSeen ? `Last seen ${formatLastSeen()}` :
               'Offline'}
            </p>
          )}
          {type === 'group' && (
            <p className="text-xs text-muted-foreground">
              {participants.length} participants
            </p>
          )}
        </div>
      </div>
      
      <div className="relative menu-container">
        <button
          onClick={toggleMenu}
          className="p-2 rounded-full hover:bg-muted"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
        
        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              {type === 'direct' && (
                <Link
                  href={`/networking/${otherParticipants[0]?.user?.role?.toLowerCase()}/${otherParticipants[0]?.user?.url || otherParticipants[0]?.user_id}`}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  View Profile
                </Link>
              )}
              <button
                onClick={handleArchive}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                {conversation.archived_at ? 'Unarchive' : 'Archive'} Chat
              </button>
              <Link
                href={route('messaging.inbox')}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                Back to Inbox
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
