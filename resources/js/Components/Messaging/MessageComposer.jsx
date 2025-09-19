import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/Components/ui/button';
import { cn } from '@/lib/utils';
import { debounce } from 'lodash';

export default function MessageComposer({
  conversationId,
  onSendMessage,
  onTypingChange,
  onAfterSend,
  isSubmitting = false
}) {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  
  // Create a debounced typing indicator function
  const debouncedTypingChange = useRef(
    debounce((isTyping) => {
      if (onTypingChange) {
        onTypingChange(isTyping);
      }
    }, 500)
  ).current;
  
  // Handle text input changes
  const handleMessageChange = (e) => {
    const value = e.target.value;
    setMessage(value);
    
    // Trigger typing indicator
    if (value.length > 0) {
      debouncedTypingChange(true);
    } else {
      debouncedTypingChange(false);
    }
    
    // Auto-resize textarea
    adjustTextareaHeight();
  };
  
  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Remove a selected file
  const handleRemoveFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };
  
  // Adjust textarea height based on content
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if ((message.trim() === '' && files.length === 0) || isSubmitting) {
      return;
    }
    
    // Create form data for submission
    const formData = new FormData();
    formData.append('body', message);
    
    // Add files if any
    files.forEach(file => {
      formData.append('files[]', file);
    });
    
    // Add client ID for optimistic updates
    const clientId = `temp-${Date.now()}`;
    formData.append('client_id', clientId);
    
    // Call the onSendMessage callback
    let sentMessage = null;
    if (onSendMessage) {
      try {
        sentMessage = await onSendMessage(formData, {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(prev => ({
              ...prev,
              [clientId]: percentCompleted
            }));
          }
        });
      } catch (err) {
        console.error('Error sending message:', err);
        // Show toast error if available, otherwise just log
        if (window.toast) {
          window.toast.error('Failed to send message. Please try again.');
        }
      }
    }
    
    // Reset form
    setMessage('');
    setFiles([]);
    setUploadProgress({});

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // Stop typing indicator
    debouncedTypingChange(false);

    // Call onAfterSend callback
    if (onAfterSend && sentMessage) {
      onAfterSend(conversationId, sentMessage);
    }
  };
  
  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    // Send message on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      debouncedTypingChange.cancel();
    };
  }, [debouncedTypingChange]);
  
  return (
    <form onSubmit={handleSubmit} className="p-3 border-t">
      {/* File previews */}
      {files.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="relative group bg-muted p-2 rounded-md flex items-center gap-2"
            >
              {file.type.startsWith('image/') ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="h-10 w-10 object-cover rounded"
                />
              ) : (
                <div className="h-10 w-10 flex items-center justify-center bg-muted-foreground/10 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm truncate max-w-[150px]">{file.name}</div>
                <div className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveFile(index)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Composer input area */}
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleMessageChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className={cn(
              "w-full p-3 pr-10 text-sm bg-muted/50 rounded-lg resize-none",
              "focus:ring-1 focus:ring-primary focus:outline-none",
              "min-h-[40px] max-h-[150px]"
            )}
            rows={1}
            disabled={isSubmitting}
          />
          
          {/* File attachment button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute right-3 bottom-3 text-muted-foreground hover:text-foreground"
            disabled={isSubmitting}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            disabled={isSubmitting}
          />
        </div>
        
        {/* Send button */}
        <Button
          type="submit"
          disabled={isSubmitting || (message.trim() === '' && files.length === 0)}
          className={cn(
            "px-3 py-2 h-10 mb-2",
            isSubmitting && "opacity-50 cursor-not-allowed"
          )}
        >
          {isSubmitting ? (
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </Button>
      </div>
    </form>
  );
}
