# NexScholar Messaging Frontend Guide

This document provides an overview of the messaging frontend implementation in NexScholar.

## Overview

The messaging frontend allows users to communicate via direct and group conversations with real-time updates, file attachments, typing indicators, and read receipts.

## Pages

### Inbox Page (`/messaging`)

The Inbox page displays a list of the user's conversations and provides a way to create new conversations.

- **Features**:
  - Conversation list with search functionality
  - Unread message badges
  - "New conversation" button that opens a modal
  - Empty state illustration when no conversation is selected

### Chat Page (`/messaging/{conversation}`)

The Chat page displays a single conversation with its messages and provides a way to send new messages.

- **Features**:
  - Conversation header with participant info and menu
  - Message list with infinite scroll pagination
  - Typing indicators
  - Read receipts (✓✓)
  - Message composer with file attachment support
  - Real-time updates via Pusher/Echo

## Components

### Shared Components

- **ConversationItem**: Renders a single conversation in the list
- **ConversationList**: Renders the list of conversations with search
- **MessageItem**: Renders a single message bubble
- **MessageList**: Renders the list of messages with infinite scroll
- **MessageComposer**: Renders the message input and file picker
- **AttachmentPreview**: Renders previews for different attachment types
- **TypingIndicator**: Shows "X is typing..." indicator
- **ChatHeader**: Shows conversation title, participants, and menu
- **NewConversationModal**: Modal for creating new conversations

## Real-time Features

The messaging feature uses Laravel Echo and Pusher for real-time updates:

- **Channel**: `private-conversation.{id}`
- **Events**:
  - `MessageSent`: When a new message is sent
  - `MessageEdited`: When a message is edited
  - `MessageDeleted`: When a message is deleted
  - `ReadAdvanced`: When a user marks messages as read
  - `TypingChanged`: When a user starts/stops typing
  - `ConversationUpdated`: When conversation metadata changes

## API Integration

The frontend communicates with the backend via these endpoints:

- **Conversations**:
  - `GET /api/v1/app/messaging/conversations`: List conversations
  - `POST /api/v1/app/messaging/conversations`: Create conversation
  - `GET /api/v1/app/messaging/conversations/{id}`: Get conversation details
  - `POST /api/v1/app/messaging/conversations/{id}/archive`: Archive conversation

- **Messages**:
  - `GET /api/v1/app/messaging/conversations/{id}/messages`: List messages
  - `POST /api/v1/app/messaging/conversations/{id}/messages`: Send message
  - `PATCH /api/v1/app/messaging/messages/{id}`: Edit message
  - `DELETE /api/v1/app/messaging/messages/{id}`: Delete message

- **Read & Typing**:
  - `POST /api/v1/app/messaging/conversations/{id}/read`: Mark as read
  - `POST /api/v1/app/messaging/conversations/{id}/typing`: Update typing status

- **Attachments**:
  - `GET /api/v1/app/messaging/attachments/{id}`: View attachment
  - `GET /api/v1/app/messaging/attachments/{id}/download`: Download attachment

- **Presence**:
  - `POST /api/v1/app/me/heartbeat`: Update user's last_seen_at

## Environment Setup

Make sure these environment variables are set in your `.env` file:

```
BROADCAST_DRIVER=pusher
PUSHER_APP_ID=your_app_id
PUSHER_APP_KEY=your_app_key
PUSHER_APP_SECRET=your_app_secret
PUSHER_APP_CLUSTER=mt1

VITE_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
VITE_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"
```

## Smoke Test Guide

To verify the messaging feature is working correctly:

1. Open two browser tabs logged in as different users who are connected
2. Navigate to `/messaging` in both tabs
3. Create a new conversation between the two users in one tab
4. Send a message from one tab and verify it appears in real-time in the other
5. Type in one tab and verify the typing indicator appears in the other
6. Scroll through messages in one tab and verify read status updates in the other
7. Upload a file in one tab and verify it appears in the other
8. Edit a message in one tab and verify the change appears in the other
9. Delete a message in one tab and verify it shows as deleted in the other

## Troubleshooting

- **Messages not appearing in real-time**: Check Pusher configuration and Echo initialization
- **File uploads failing**: Check file size limits and allowed MIME types
- **Read receipts not updating**: Verify that the `last_read_message_id` is being updated correctly
- **Typing indicators not showing**: Check the debounce timing and event broadcasting
