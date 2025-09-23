import React from 'react';
import { cn } from '@/lib/utils';

export default function AttachmentPreview({ attachment, isDark = false, isGrouped = false, onClick }) {
  const { id, mime, filename, size, human_size, url, thumbnail_url, width, height } = attachment;
  
  const isImage = mime?.startsWith('image/');
  const isVideo = mime?.startsWith('video/');
  const isAudio = mime?.startsWith('audio/');
  
  // Handle attachment click
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) {
      onClick(attachment);
    } else {
      // Fallback to opening in new tab
      window.open(url, '_blank');
    }
  };
  
  // Render image preview
  if (isImage) {
    return (
      <div className="relative group">
        <img
          src={url}
          alt={filename}
          className="max-h-60 max-w-full rounded-md cursor-pointer object-contain"
          onClick={handleClick}
          loading="lazy"
        />
        {/* Download button removed - now handled by modal */}
      </div>
    );
  }
  
  // Render video preview
  if (isVideo) {
    return (
      <div className="relative group">
        <video
          src={url}
          controls
          className="max-h-60 max-w-full rounded-md cursor-pointer"
          onClick={handleClick}
          preload="metadata"
        />
        {/* Download button removed - now handled by modal */}
      </div>
    );
  }
  
  // Render audio preview
  if (isAudio) {
    return (
      <div className="w-full">
        <audio
          src={url}
          controls
          className="w-full cursor-pointer"
          onClick={handleClick}
          preload="metadata"
        />
        <div className="flex justify-between items-center mt-1 text-xs">
          <span className={isDark ? "text-white/70" : "text-gray-500"}>{filename}</span>
          <button
            onClick={handleClick}
            className={cn(
              "p-1 rounded-md",
              isDark ? "hover:bg-white/10" : "hover:bg-gray-100"
            )}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>
      </div>
    );
  }
  
  // Render file preview (default)
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-md cursor-pointer",
        isDark
          ? "bg-indigo-700/90 hover:bg-indigo-700 text-white"
          : "bg-gray-100 hover:bg-gray-200",
        // Remove left margin if grouped
        isGrouped ? "ml-0" : ""
      )}
      onClick={handleClick}
    >
      <div className={cn(
        "p-2 rounded-md",
        isDark ? "bg-indigo-600/80" : "bg-white"
      )}>
        <svg xmlns="http://www.w3.org/2000/svg" className={cn(
          "h-6 w-6",
          isDark ? "text-white" : "text-gray-600"
        )} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <div className={cn(
          "text-sm font-medium truncate",
          isDark ? "text-white" : "text-gray-900"
        )}>{filename}</div>
        <div className={cn(
          "text-xs",
          isDark ? "text-indigo-100" : "text-muted-foreground"
        )}>{human_size}</div>
      </div>
      {/* View button removed - entire container is now clickable */}
    </div>
  );
}
