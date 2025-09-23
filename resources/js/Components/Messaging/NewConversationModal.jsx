import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/Components/ui/button';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/Components/ui/avatar';
import axios from 'axios';
import { debounce } from 'lodash';

export default function NewConversationModal({ isOpen, onClose, onCreateConversation }) {
  const [activeTab, setActiveTab] = useState('direct'); // 'direct' or 'group'
  const [searchTerm, setSearchTerm] = useState('');
  const [connections, setConnections] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupTitle, setGroupTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch accepted connections from the API
  const fetchConnections = async (query = '') => {
    setIsLoading(true);
    try {
      // Fetch connections using the new index endpoint
      const response = await axios.get('/api/v1/app/connections', {
        params: { q: query, per_page: 50 }
      });
      setConnections(response.data.data || []);
    } catch (error) {
      console.error('Error fetching connections:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search function
  const debouncedSearch = useMemo(
    () => debounce((query) => {
      if (query.trim()) {
        fetchConnections(query);
      }
    }, 300),
    []
  );

  // Fetch connections when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchConnections('');
    }
  }, [isOpen]);

  // Handle search term changes with debouncing
  useEffect(() => {
    if (isOpen && searchTerm.trim()) {
      debouncedSearch(searchTerm);
    }
  }, [searchTerm, debouncedSearch, isOpen]);
  
  // Connections are now filtered on the backend
  const filteredConnections = connections;
  
  // Handle user selection
  const toggleUserSelection = (user) => {
    if (activeTab === 'direct') {
      // For direct messages, only select one user
      setSelectedUsers([user]);
    } else {
      // For group chats, toggle selection
      const isSelected = selectedUsers.some(u => u.id === user.id);
      if (isSelected) {
        setSelectedUsers(selectedUsers.filter(u => u.id !== user.id));
      } else {
        setSelectedUsers([...selectedUsers, user]);
      }
    }
  };
  
  // Check if a user is selected
  const isUserSelected = (userId) => {
    return selectedUsers.some(user => user.id === userId);
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    if (
      (activeTab === 'direct' && selectedUsers.length !== 1) ||
      (activeTab === 'group' && (selectedUsers.length < 1 || !groupTitle.trim()))
    ) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const payload = activeTab === 'direct'
        ? {
            type: 'direct',
            user_id: selectedUsers[0].id
          }
        : {
            type: 'group',
            title: groupTitle.trim(),
            user_ids: selectedUsers.map(user => user.id)
          };
      
      if (onCreateConversation) {
        await onCreateConversation(payload);
      }
      
      // Reset form and close modal
      handleClose();
    } catch (error) {
      console.error('Error creating conversation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Reset form and close modal
  const handleClose = () => {
    setActiveTab('direct');
    setSearchTerm('');
    setSelectedUsers([]);
    setGroupTitle('');
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-medium">New Conversation</h2>
          <button
            onClick={handleClose}
            className="p-1 rounded-full hover:bg-muted"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b">
          <button
            className={cn(
              "flex-1 py-3 text-center font-medium",
              activeTab === 'direct'
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setActiveTab('direct')}
          >
            Direct Message
          </button>
          <button
            className={cn(
              "flex-1 py-3 text-center font-medium",
              activeTab === 'group'
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setActiveTab('group')}
          >
            Group Chat
          </button>
        </div>
        
        {/* Group title input (for group chats) */}
        {activeTab === 'group' && (
          <div className="p-4 border-b">
            <label htmlFor="group-title" className="block text-sm font-medium text-gray-700 mb-1">
              Group Name
            </label>
            <input
              type="text"
              id="group-title"
              value={groupTitle}
              onChange={(e) => setGroupTitle(e.target.value)}
              placeholder="Enter group name"
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
        )}
        
        {/* Search input */}
        <div className="p-4 border-b">
          <div className="relative">
            <input
              type="text"
              placeholder={`Search ${activeTab === 'direct' ? 'connections' : 'participants'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-8 border rounded-md"
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
        
        {/* Connection list */}
        <div className="flex-1 overflow-y-auto p-1">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredConnections.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No connections found
            </div>
          ) : (
            <div className="space-y-1">
              {filteredConnections.map(connection => {
                const user = connection.user;
                const isSelected = isUserSelected(user.id);
                
                return (
                  <div
                    key={user.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                      isSelected
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted/50"
                    )}
                    onClick={() => toggleUserSelection(user)}
                  >
                    <div className="relative">
                      {user.avatar_url ? (
                        <Avatar src={user.avatar_url} alt={user.full_name || user.name} />
                      ) : (
                        <Avatar>
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {(user.full_name || user.name || 'U').charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      {user.is_online === true && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-medium">{user.full_name || user.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {user.role || 'Connection'}
                      </p>
                    </div>
                    
                    {isSelected && (
                      <div className="text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              (activeTab === 'direct' && selectedUsers.length !== 1) ||
              (activeTab === 'group' && (selectedUsers.length < 1 || !groupTitle.trim()))
            }
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Creating...</span>
              </div>
            ) : (
              'Create'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
