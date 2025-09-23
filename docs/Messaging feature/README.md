# NexScholar Messaging Feature

This document provides an overview of the messaging feature implementation in NexScholar.

## Overview

The messaging feature allows connected users to communicate via direct and group conversations with real-time updates, file attachments, typing indicators, and read receipts.

## Architecture

- **Backend**: Laravel 11 with Eloquent models, Sanctum for authentication, and Bouncer for authorization
- **Real-time**: Pusher for WebSockets with Laravel Echo
- **Storage**: MySQL for messages and metadata, private disk for attachments
- **Frontend**: Inertia.js with React components

## Key Components

### Database Schema

- `conversations`: Stores conversation metadata (direct/group, title, creator)
- `conversation_participants`: Links users to conversations with roles and read status
- `messages`: Contains message content, type, and metadata
- `message_attachments`: Stores file attachments with metadata

### API Endpoints

All endpoints are under `/api/v1/app/messaging` and require authentication:

#### Conversations
- `GET /conversations`: List user's conversations with unread counts
- `POST /conversations`: Create a new conversation (direct or group)
- `GET /conversations/{id}`: Get conversation details
- `POST /conversations/{id}/archive`: Toggle archive status

#### Messages
- `GET /conversations/{id}/messages?before={id}&limit=50`: Get messages with cursor pagination
- `POST /conversations/{id}/messages`: Send a message (text and/or attachments)
- `PATCH /messages/{id}`: Edit a message (text only)
- `DELETE /messages/{id}?scope=all|me`: Delete a message (for everyone or just for me)

#### Read Receipts & Typing
- `POST /conversations/{id}/read`: Mark messages as read
- `POST /conversations/{id}/typing`: Update typing status

#### Attachments
- `GET /attachments/{id}`: View/stream an attachment
- `GET /attachments/{id}/download`: Download an attachment

### Broadcast Events

All events are broadcast on private channels (`private-conversation.{id}`):

- `MessageSent`: When a new message is sent
- `MessageEdited`: When a message is edited
- `MessageDeleted`: When a message is deleted
- `ReadAdvanced`: When a user marks messages as read
- `TypingChanged`: When a user starts/stops typing
- `ConversationUpdated`: When conversation metadata changes

### User Presence

- Updates `users.last_seen_at` via heartbeat endpoint
- Considers a user online if seen within the last 5 minutes

## Configuration

The messaging feature can be configured via environment variables:

```
# Pusher configuration for real-time updates
BROADCAST_DRIVER=pusher
PUSHER_APP_ID=your_app_id
PUSHER_APP_KEY=your_app_key
PUSHER_APP_SECRET=your_app_secret
PUSHER_APP_CLUSTER=mt1

# Vite-exposed keys for the browser
VITE_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
VITE_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"

# Messaging behavior
CHAT_EDIT_WINDOW_MIN=10
CHAT_DELETE_WINDOW_MIN=60
CHAT_MAX_UPLOAD_MB=20
CHAT_PRIVATE_DISK=private
```

## Usage

### Setting Up Pusher

1. Create a Pusher account and app at https://pusher.com/
2. Add your Pusher credentials to `.env`
3. Ensure the frontend has Echo configured in `resources/js/bootstrap.js`

### Smoke Test

To verify the messaging feature is working correctly:

1. Open two browser tabs logged in as different users who are connected
2. Navigate to the messaging UI in both tabs
3. Send a message from one tab and verify it appears in real-time in the other
4. Test read receipts by scrolling through messages in one tab and verifying read status updates in the other
5. Test typing indicators by typing in one tab and verifying the indicator appears in the other

## Security

- All conversation access is protected by policies that verify participant status
- Attachments are stored on a private disk and served only through permission-checked controllers
- Message edit/delete operations have time windows enforced by policies
- All API endpoints use session authentication and Bouncer authorization

## Future Enhancements

- Voice/video calls
- Message reactions
- Message search
- End-to-end encryption
- Push notifications for mobile devices
