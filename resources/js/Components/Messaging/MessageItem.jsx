import React from 'react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { usePage } from '@inertiajs/react';
import Avatar from '@/Components/Shared/Avatar';
import AttachmentPreview from './AttachmentPreview';

export default function MessageItem({
  message,
  isOwn,
  showAvatar = true,
  isRead = false,
  onMessageAppear,
  onAttachmentClick,
  previousMessage,
  nextMessage,
  shouldIndent = false,
  isGroupedWithPrev = false,
  isGroupedWithNext = false,
  isGroupHead = true,
  isGroupTail = true,
  conversationType = 'direct'
}) {
  const { id, body, type, sender, created_at, edited_at, attachments = [], deleted_at } = message;
  const { auth } = usePage().props;
  const currentUserId = auth.user.id;

  // Determine if this is a group conversation
  const isGroup = conversationType === 'group';

  // Determine if we should show the sender info (avatar, name) - only for groups
  const shouldShowAvatar = isGroup && !isOwn && isGroupHead;
  const shouldShowName = isGroup && !isOwn && isGroupHead;

  // Determine if we should show the timestamp
  const shouldShowTimestamp = isGroupTail;

  // Format timestamp in uppercase AM/PM format
  const formattedTime = created_at ? format(new Date(created_at), 'h:mm aa') : '';

  // Handle message appearing in viewport
  React.useEffect(() => {
    if (onMessageAppear && !isOwn && !isRead) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            onMessageAppear(message);
            observer.disconnect();
          }
        },
        { threshold: 0.5 }
      );

      const messageElement = document.getElementById(`message-${id}`);
      if (messageElement) {
        observer.observe(messageElement);
      }

      return () => observer.disconnect();
    }
  }, [id, isOwn, isRead, onMessageAppear]);

  // If message is deleted
  if (deleted_at) {
    return (
      <div id={`message-${id}`} className="py-1">
        <div className={cn(
          "flex items-end gap-2",
          isOwn ? "justify-end" : "justify-start"
        )}>
          <div className={cn(
            "px-4 py-2 rounded-lg text-muted-foreground text-sm italic",
            isOwn ? "bg-muted/30" : "bg-muted/30"
          )}>
            Message was deleted
          </div>
        </div>
        {/* Footer outside bubble */}
        <div className={cn(
          "flex mt-1",
          isOwn ? "justify-end" : "justify-start"
        )}>
          <div className={cn(
            "text-[11px] leading-4 text-gray-500 select-none",
            shouldIndent ? "ml-10" : ""
          )}>
            {formattedTime}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id={`message-${id}`} className="py-1">
      {/* Message container with two-column layout for group chats */}
      <div className={cn(
        "w-full",
        isOwn ? "justify-end flex" : "flex"
      )}>
        {/* Left column for avatar (only for non-own messages in group chats) */}
        {!isOwn && isGroup && (
          <div className="flex w-full">
            {/* Avatar column - fixed width */}
            <div className="mr-3 w-10 flex justify-center items-start">
              {shouldShowAvatar ? (
                <Avatar
                  src={sender?.avatar_url ?? sender?.profile_photo_url}
                  alt={sender?.full_name ?? sender?.name}
                  size={40}
                />
              ) : (
                <div className="h-10 w-10" />
              )}
            </div>

            {/* Right column for name + bubble */}
            <div className="flex-1 min-w-0">
              {shouldShowName && (
                <div className="text-xs font-medium text-muted-foreground mb-1">
                  {sender?.full_name ?? sender?.name ?? 'Unknown'}
                </div>
              )}

              {/* Bubble container */}
              <div className="flex">
                <div className={cn(
                  "max-w-[75%] sm:max-w-[70%] rounded-2xl px-3 py-2 text-sm break-words whitespace-pre-wrap",
                  "bg-gray-100 text-gray-900",
                  // Apply bubble corner rounding based on group position
                  isGroupedWithPrev && "rounded-tl-md",
                  isGroupedWithNext && "rounded-bl-md",
                  // Adjust top margin based on grouping
                  isGroupedWithPrev ? "mt-0" : "mt-1"
                )}>
                  {/* Text content */}
                  {body && <div className="whitespace-pre-wrap">{body}</div>}

                  {/* Attachments */}
                  {attachments && attachments.length > 0 && (
                    <div className={cn(
                      "flex flex-col gap-2 my-2",
                      body ? "border-t border-gray-200/30" : ""
                    )}>
                      {attachments.map((attachment) => (
                        <AttachmentPreview
                          key={attachment.id}
                          attachment={attachment}
                          isDark={false}
                          isGrouped={isGroupedWithPrev}
                          onClick={() => onAttachmentClick && onAttachmentClick(attachment)}
                        />
                      ))}
                    </div>
                  )}

                  {/* Edited indicator */}
                  {edited_at && (
                    <div className="text-xs opacity-70 mt-1">
                      (edited)
                    </div>
                  )}
                </div>
              </div>

              {/* Footer with timestamp and read ticks (OUTSIDE bubble) */}
              {shouldShowTimestamp && (
                <div className="flex mt-1">
                  <div className="text-[11px] leading-4 text-gray-700 select-none">
                    {formattedTime}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* For own messages or direct messages */}
        {(isOwn || !isGroup) && (
          <div className="flex-1">
            {/* Bubble container */}
            <div className={cn(
              "flex",
              isOwn ? "justify-end" : "justify-start"
            )}>
              <div className={cn(
                "max-w-[75%] sm:max-w-[70%] rounded-2xl px-3 py-2 text-sm break-words whitespace-pre-wrap",
                isOwn
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-900",
                // Apply bubble corner rounding based on group position
                !isOwn && isGroupedWithPrev && "rounded-tl-md",
                !isOwn && isGroupedWithNext && "rounded-bl-md",
                isOwn && isGroupedWithPrev && "rounded-tr-md",
                isOwn && isGroupedWithNext && "rounded-br-md",
                // Adjust top margin based on grouping
                isGroupedWithPrev ? "mt-0" : "mt-1"
              )}>
                {/* Text content */}
                {body && <div className="whitespace-pre-wrap">{body}</div>}

                {/* Attachments */}
                {attachments && attachments.length > 0 && (
                  <div className={cn(
                    "flex flex-col gap-2 my-2",
                    body ? "border-t border-white/10" : ""
                  )}>
                    {attachments.map((attachment) => (
                      <AttachmentPreview
                        key={attachment.id}
                        attachment={attachment}
                        isDark={isOwn}
                        isGrouped={!isOwn && isGroupedWithPrev}
                        onClick={() => onAttachmentClick && onAttachmentClick(attachment)}
                      />
                    ))}
                  </div>
                )}

                {/* Edited indicator */}
                {edited_at && (
                  <div className="text-xs opacity-70 mt-1">
                    (edited)
                  </div>
                )}
              </div>
            </div>

            {/* Footer with timestamp and read ticks (OUTSIDE bubble) */}
            {shouldShowTimestamp && (
              <div className={cn(
                "flex mt-1",
                isOwn ? "justify-end" : "justify-start"
              )}>
                <div className={cn(
                  "text-[11px] leading-4 select-none",
                  isOwn ? "text-gray-700" : "text-gray-700"
                )}>
                  {formattedTime}
                  {isOwn && (
                    <span className="ml-1">
                      {isRead ? '✓✓' : '✓'}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}