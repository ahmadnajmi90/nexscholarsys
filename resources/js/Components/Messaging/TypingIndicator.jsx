import React from 'react';
import { cn } from '@/lib/utils';

export default function TypingIndicator({ users = [] }) {
  if (users.length === 0) return null;
  
  // Format the user names for display
  const formatTypingText = () => {
    if (users.length === 1) {
      return `${users[0].name} is typing...`;
    } else if (users.length === 2) {
      return `${users[0].name} and ${users[1].name} are typing...`;
    } else {
      return `${users[0].name} and ${users.length - 1} others are typing...`;
    }
  };
  
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <div className="flex space-x-1">
        <div className="w-2 h-2 rounded-full bg-muted-foreground/70 animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 rounded-full bg-muted-foreground/70 animate-bounce" style={{ animationDelay: '300ms' }} />
        <div className="w-2 h-2 rounded-full bg-muted-foreground/70 animate-bounce" style={{ animationDelay: '600ms' }} />
      </div>
      <span>{formatTypingText()}</span>
    </div>
  );
}
