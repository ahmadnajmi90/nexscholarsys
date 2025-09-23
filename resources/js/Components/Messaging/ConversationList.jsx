import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/Components/ui/scroll-area';
import ConversationListItem from './ConversationListItem';
import { debounce } from 'lodash';
import { usePage } from '@inertiajs/react';

export default function ConversationList({ 
  conversations = [], 
  activeConversationId = null, 
  onSearchChange,
  onSelectConversation
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const { url } = usePage();
  
  // Create a debounced search function
  const debouncedSearch = debounce((value) => {
    if (onSearchChange) {
      onSearchChange(value);
    }
  }, 300);
  
  // Handle search input changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };
  
  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, []);
  
  return (
    <div className="h-full flex flex-col min-w-0 overflow-hidden">
      <div className="p-3 shrink-0">
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full p-2 pl-8 text-sm bg-muted/50 border-0 rounded-lg focus:ring-1 focus:ring-primary min-w-0"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
      
      <div className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden">
        <div className="p-3 space-y-1 min-w-0 overflow-hidden">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No conversations found
            </div>
          ) : (
            conversations.map((conversation) => (
              <ConversationListItem
                key={conversation.id}
                conversation={conversation}
                isActive={activeConversationId === conversation.id}
                onSelect={onSelectConversation}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
