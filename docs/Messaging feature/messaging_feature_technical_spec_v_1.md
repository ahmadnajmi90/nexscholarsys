# Messaging Feature – Technical Spec v1.0 (NexScholar)

> Purpose: A complete, implementation-ready blueprint for adding an internal WhatsApp/Messenger–style feature into the existing Laravel 11 + Inertia React stack **without sudo or cron** requirements. This document is written so an AI coding agent can follow it strictly, file-by-file.

---

## 0) TL;DR
- **Transport (Realtime):** Pusher (managed WebSocket) + Laravel Echo.
- **Persistence:** MySQL for conversations, participants, messages, attachments. Redis optional later for presence/typing.
- **Files:** Local storage (`public` disk) + `php artisan storage:link`. Thumbnails generated **synchronously** for MVP.
- **Queues:** Event-driven only (e.g., thumbnails/email). Use `QUEUE_CONNECTION=sync` (MVP) or manually run `queue:work` when needed. **No cron required.**
- **Core MVP:** Direct & group chats, list view with unread badges, thread view with infinite scroll, text + attachments, optimistic send, read receipts via `last_read_message_id`, typing indicator (Echo whisper), presence (basic), mute/pin, edit/delete window, in-app toasts.

---

## 1) Goals & Non-Goals
**Goals**
1. Deliver a reliable, real-time internal messaging feature for platform users.
2. Ship with hosting constraints: no sudo, no permanent daemons, no cron.
3. Keep a clear upgrade path to richer features (reactions, search, moderation).

**Non-Goals (MVP)**
- End-to-end encryption (future study).
- Push notifications via FCM/APNs.
- Massive-scale sharding or multi-region HA.

---

## 2) Constraints & Assumptions
- Hosting environment cannot run system services via sudo.
- Cron is **not available**; rely on event-driven jobs or `sync` queue.
- Realtime via **managed Pusher** to avoid running WebSocket servers.
- Current user base is modest; local disk storage is acceptable.

---

## 3) Technology Choices (with one-line annotations)
- **MySQL (ACID DB):** Source of truth for messages/participants; fast pagination with proper indexes.
- **Pusher (managed WebSocket):** Instant server→browser events; no daemon management.
- **Laravel Echo (JS client):** Subscribe to channels; receive events in React pages.
- **Inertia React:** SPA pages; no separate API-only frontend needed for MVP.
- **Local Storage (`public` disk):** Simple, cost-effective attachments; served via `/storage` symlink.
- **Queues (event-driven only):** Optional for thumbnails/emails; `sync` fallback is acceptable.
- **(Optional later) Meilisearch/Typesense:** Full-text fuzzy search on messages.

---

## 4) Data Model & Migrations
### Tables
1. **conversations**
   - `id` (bigint, pk)
   - `type` enum['direct','group']
   - `title` varchar(255) nullable (null for direct)
   - `icon_path` nullable
   - `created_by` fk users.id
   - `last_message_id` nullable fk messages.id
   - `is_archived` boolean default 0
   - timestamps
   - **Indexes:** (`type`), (`created_by`)

2. **conversation_participants**
   - `id` (bigint, pk)
   - `conversation_id` fk
   - `user_id` fk
   - `role` enum['owner','admin','member'] default 'member'
   - `last_read_message_id` nullable fk messages.id
   - `pinned` boolean default 0
   - `muted_until` datetime nullable
   - `joined_at` datetime
   - `left_at` datetime nullable
   - timestamps
   - **Unique:** (`conversation_id`,`user_id`)
   - **Indexes:** (`user_id`,`conversation_id`), (`last_read_message_id`)

3. **messages**
   - `id` (bigint, pk)
   - `conversation_id` fk
   - `user_id` fk (sender)
   - `type` enum['text','image','file','system'] default 'text'
   - `body` text nullable (required for text)
   - `reply_to_id` nullable fk messages.id
   - `delivered_at` datetime nullable (sender-local state)
   - `read_at` datetime nullable (sender-local ack; not per-user)
   - timestamps
   - softDeletes
   - **Indexes:** (`conversation_id`,`created_at`,`id`) // keyset pagination
   - **Indexes:** (`user_id`,`created_at`)

4. **message_attachments**
   - `id` (bigint, pk)
   - `message_id` fk
   - `disk` varchar(32) // 'public'
   - `path` varchar(1024)
   - `mime` varchar(191)
   - `bytes` bigint
   - `width` int nullable
   - `height` int nullable
   - `meta` json nullable (e.g., duration, thumbnails)
   - timestamps
   - **Indexes:** (`message_id`)

5. **message_reactions** (NEXT)
   - `id` (bigint, pk)
   - `message_id` fk
   - `user_id` fk
   - `emoji` varchar(32)
   - timestamps
   - **Unique:** (`message_id`,`user_id`,`emoji`)

> **Migration Notes:** Use unsigned big integers, foreign keys with `onDelete('cascade')`. Keep enums as check constraints or standard ENUMs.

### Eloquent Models & Relations
- `Conversation` hasMany `Message`; hasMany `ConversationParticipant`.
- `ConversationParticipant` belongsTo `Conversation`, `User`.
- `Message` belongsTo `Conversation`, `User`; hasMany `MessageAttachment`; belongsTo `Message` (replyTo).
- Scopes: `Message::forConversation($id)`, `Conversation::forUser($userId)`.

---

## 5) Authorization (Bouncer) & Policies
- Only participants can view/send/read a conversation.
- Owners/Admins can rename group, pin messages, add/remove members.
- Sender can edit/delete their own message within **N minutes** (configurable).
- Admins can hard-delete messages.

**Policies to implement:**
- `ConversationPolicy`: view, createDirect, createGroup, manageMembers, update, leave.
- `MessagePolicy`: create (must be participant), update (sender + window), delete (sender window or admin), react (participant).

---

## 6) Realtime & Broadcasting
### Provider
- **Pusher**: set `.env` keys and `BROADCAST_CONNECTION=pusher`.

### Channels
- Private: `private.conversation.{conversationId}` – message events.
- Presence: `presence.conversation.{conversationId}` – online list in thread.
- Optional global presence: `presence.users` – aggregate online users.

### Authorization Callbacks
- Authorize if `auth()->user()` is participant of `conversationId`.

### Broadcast Events (Server → Client)
1. `MessageSent`
   - Payload: `{ message, conversation_id, sender: {id,name,avatar}, temp_id? }`
2. `MessageUpdated`
   - Payload: `{ message_id, conversation_id, body?, deleted_at? }`
3. `ConversationRead`
   - Payload: `{ conversation_id, reader_id, last_read_message_id }`
4. `Typing`
   - Payload: `{ conversation_id, user_id, is_typing }` (via Echo whisper or server event)

> **Delivery Semantics:** Client uses optimistic send with `temp_id`. Server echoes back real `id` via `MessageSent` so client swaps.

---

## 7) HTTP Routes & Contracts
### Inertia (web.php)
- `GET /messages` → `Messaging/Index.jsx` (list conversations)
- `GET /messages/{conversation}` → `Messaging/Show.jsx` (thread)

### JSON (api.php, session-auth)
- `POST /messages` → Start direct or group: `{ type:'direct'|'group', user_id? (direct), title?, members?:[] }` → `{ conversation }`
- `POST /messages/{conversation}` → Send: `{ type, body?, attachments?:[{name,size,mime,path}] , temp_id? , reply_to_id? }` → `{ message }` + broadcast `MessageSent`
- `GET /messages/{conversation}` → Paginate: `?before_id=...&limit=50` → `{ messages:[], next_before_id }`
- `POST /messages/{conversation}/read` → `{ last_read_message_id }` → broadcast `ConversationRead`
- `PATCH /conversations/{id}` → rename, icon, settings (mute until, pin toggle)
- `POST /conversations/{id}/members` → add members
- `DELETE /conversations/{id}/members/{user}` → remove member
- `DELETE /messages/{id}` → soft delete (respect policy/edit window)
- (NEXT) `POST /messages/{id}/reactions` & `DELETE` reaction

### Validation Rules (examples)
- `SendMessageRequest`:
  - `type` in: text,image,file,system
  - `body` required if `type=text`, max 4000 chars
  - `attachments.*.mime` in allowlist; size limits per mime
- `CreateConversationRequest`:
  - `type` in: direct,group; direct requires `user_id`, group requires `title` and `members` array

---

## 8) Frontend UX Spec (Inertia React)
### Pages & Components
- `Pages/Messaging/Index.jsx`
  - List of conversations: avatar/title, last message snippet, unread badge, mute/pin indicators
  - Search by title/member (client-side first; server fallback later)

- `Pages/Messaging/Show.jsx`
  - Header: title, participants’ avatars, presence count, mute/pin toggles
  - Virtualized message list (infinite scroll up; keyset pagination via `before_id`)
  - Message item types: text, image/file, system; show reply preview if `reply_to_id`
  - Composer: textarea (Enter=send, Shift+Enter=newline), file picker, emoji (later)
  - Typing indicator; read receipt line (“Seen by X, Y” simplified from `last_read_message_id`)
  - Optimistic send: render pending bubble with `temp_id`; swap on ack, handle failure with retry UI

### State & Flows
- **Optimistic send** → pending → ack → success or error→retry
- **Read**: on view/scroll-bottom POST read; update badge counts and broadcast
- **Typing**: on input change, whisper `isTyping:true`; debounce & stop after idle
- **Presence**: join `presence.conversation.{id}`; show online count
- **Drafts**: save composer text to localStorage key `draft:conversation:{id}`

### Error Handling
- Show inline retry for failed sends; disable composer when offline; enqueue offline sends and retry on reconnect

### Accessibility
- Use semantic roles for list and messages; focus management after send; sufficient color contrast

---

## 9) Files & Media
- `.env` → `FILESYSTEM_DISK=public`
- One-time: `php artisan storage:link`
- Store under `storage/app/public/chat/{conversationId}/{messageId}/...`
- Return URLs via `Storage::disk('public')->url($path)`
- **Thumbnails (MVP):** generate synchronously on upload using Intervention Image; store under same folder with `-thumb` suffix in `meta`
- **Validation:** mime allowlist (images: jpg/png/webp/gif; docs: pdf/docx/xlsx; videos optional), max size per type

---

## 10) Queues & Workers (No Cron)
- **MVP:** Set `QUEUE_CONNECTION=sync` to avoid background infra.
- **Optional:** When convenient, run `php artisan queue:work` in a shell while doing heavy imports/thumbnailing.
- **Event-driven only:** All jobs triggered by user actions; no time-based jobs.

Jobs to define:
- `ProcessAttachmentThumbnailsJob` (optional if not doing sync)
- `NotifyParticipantsByEmailJob` (optional; only if you choose to email immediately on event)

---

## 11) Notifications (No Cron)
- **In-app toasts:** On `MessageSent` (for conversations not currently open) update unread + show toast.
- **Browser Notifications API:** If page hidden and permission granted, show native notification with sender + snippet. Link back to `Show.jsx` route.
- **Email digests:** Deferred to later (needs time-based schedule) – **skip on MVP**.

---

## 12) Rate Limits & Abuse Controls
- Per-user send limit: 20 msgs/10s (429 on exceed); surface gentle UI error.
- Attachment size caps; reject dangerous mimes; strip HTML/script in text.
- Soft delete; admins can hard-delete; audit log for moderation (later).

---

## 13) Analytics & Metrics
- `msg_send` (payload: conversation_id, type)
- `msg_read` (count read, conversation_id)
- `msg_attach` (mime/bytes bucket)
- `conv_create` (type: direct/group)
- Delivery latency (client timestamp vs received timestamp; sampled)

---

## 14) Performance & Scaling Notes
- Use **keyset pagination**: `WHERE conversation_id=? AND (created_at < :ts OR (created_at=:ts AND id<:id)) ORDER BY created_at DESC, id DESC LIMIT 50`
- Indexes: `messages (conversation_id, created_at, id)` covering query, `conversation_participants (conversation_id,user_id)` unique
- Avoid N+1: eager load `sender` for message pages; preload `last_message` for conversation list
- Archive strategy (Later): move old rows to `messages_archive` table; same schema

---

## 15) Acceptance Criteria (MVP)
1. Two users in same conversation see new messages **instantly** via Pusher/Echo.
2. Sending a message shows an optimistic bubble; resolves to server id within 1s.
3. Conversation list shows **correct unread counts** based on `last_read_message_id`.
4. Attachments upload, validate, and render; URLs served from `/storage/...`.
5. Typing indicator appears within ~500ms and disappears after ~2s idle.
6. Users can edit/delete their own message within the configured window; deletions remove content for all participants.
7. Non-participants cannot subscribe to private channels or load conversation endpoints.

---

## 16) Developer Setup
### .env (Pusher + Files + Queue)
```
BROADCAST_CONNECTION=pusher
PUSHER_APP_ID=xxxx
PUSHER_APP_KEY=xxxx
PUSHER_APP_SECRET=xxxx
PUSHER_HOST=
PUSHER_PORT=443
PUSHER_SCHEME=https

FILESYSTEM_DISK=public
QUEUE_CONNECTION=sync
```

### NPM
```
npm i laravel-echo pusher-js
```

### Echo Bootstrap (client)
```js
// resources/js/bootstrap.js (or similar)
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;
window.Echo = new Echo({
  broadcaster: 'pusher',
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER ?? 'mt1',
  wsHost: 'ws-pusher.your-provider.com', // or default
  wsPort: 443,
  wssPort: 443,
  forceTLS: true,
  enabledTransports: ['ws', 'wss'],
});
```

---

## 17) Vibe-Coding Task Breakdown (AI Agent Contracts)
> The agent must output **exact file paths** and **full file contents or patch diffs**. All new files must include imports, namespaces, and correct Laravel wiring. Use Eloquent resource/DTO transformers where appropriate.

### Task A — Migrations & Models
**Deliver:**
- `database/migrations/*_create_conversations_table.php`
- `database/migrations/*_create_conversation_participants_table.php`
- `database/migrations/*_create_messages_table.php`
- `database/migrations/*_create_message_attachments_table.php`
- (Next) `*_create_message_reactions_table.php`
- `app/Models/Conversation.php`
- `app/Models/ConversationParticipant.php`
- `app/Models/Message.php`
- `app/Models/MessageAttachment.php`

**Acceptance:** Migrate successfully; factories generate realistic data.

### Task B — Policies & Gates
**Deliver:**
- `app/Policies/ConversationPolicy.php`
- `app/Policies/MessagePolicy.php`
- Register in `AuthServiceProvider`.

**Acceptance:** Only participants can access; tests for unauthorized access.

### Task C — Broadcasting
**Deliver:**
- `routes/channels.php` with private & presence channel auth
- Events: `app/Events/MessageSent.php`, `ConversationRead.php`, `MessageUpdated.php`
- `config/broadcasting.php` verified for pusher

**Acceptance:** Broadcasting works; client receives `MessageSent` on send.

### Task D — Controllers & Routes
**Deliver:**
- `routes/web.php` pages: index/show
- `routes/api.php` endpoints listed in §7
- Controllers under `app/Http/Controllers/Messaging/*`
- Form Requests for validation
- API Resources for message serialization

**Acceptance:** Endpoints pass validation; return documented JSON shapes.

### Task E — Frontend Pages & Echo Wiring
**Deliver:**
- `resources/js/Pages/Messaging/Index.jsx`
- `resources/js/Pages/Messaging/Show.jsx`
- Components: `MessageItem.jsx`, `Composer.jsx`, `TypingIndicator.jsx`
- Echo listeners joining `presence.conversation.{id}` and `private.conversation.{id}`

**Acceptance:** Realtime updates render correctly; optimistic send swaps IDs.

### Task F — Attachments (Local Disk)
**Deliver:**
- `AttachmentsController` with store logic
- Validation + synchronous thumbnailing using Intervention Image (if installed) or skip thumbnails for MVP
- Message renders attachments with link/preview

**Acceptance:** Files upload, persist, and display via `/storage/...`.

### Task G — Read Receipts / Unread Counts
**Deliver:**
- Endpoint to mark read; logic to update `last_read_message_id`
- Broadcast `ConversationRead`
- UI badges update

**Acceptance:** Unread counts correct across devices.

### Task H — Edit/Delete Window
**Deliver:**
- Config value `messaging.edit_window_minutes`
- Controller methods + policy checks
- `MessageUpdated` broadcast

**Acceptance:** Sender can edit/delete within window; others see update.

---

## 18) Roadmap (Next / Later)
**Next:** reactions, mentions, link unfurl, basic search (LIKE), voice notes, bookmarks, pinned messages, offline send queue.

**Later:** admin moderation, archives, cold media cleanup (cron), compliance exports, Meilisearch/Typesense, email digests, push notifications.

---

## 19) JSON Payload Examples
### MessageSent (broadcast)
```json
{
  "conversation_id": 42,
  "message": {
    "id": 12345,
    "type": "text",
    "body": "Hello there",
    "user": {"id": 7, "name": "Aisha", "avatar": "/img/u7.png"},
    "reply_to_id": null,
    "created_at": "2025-09-09T06:20:00Z"
  },
  "temp_id": "c0ffee-uuid-1"
}
```

### GET /messages/{conversation}
```json
{
  "messages": [/* newest→older page */],
  "next_before_id": 12222
}
```

---

## 20) Security Notes
- Sanitize text; strip scripts; escape markdown if added later.
- Validate mime/size on server; never trust client-side.
- Private/presence channels must enforce participant membership.
- Log moderation actions (later); IP rate limits.

---

## 21) FAQ (for the AI agent & devs)
- **Why MySQL?** Strong consistency, joins, simple ops; enough for current scale.
- **No cron?** Correct; MVP avoids time-based jobs; all tasks are event-driven.
- **What if websockets fail?** Provide a light long-poll fallback endpoint returning new messages since `after_id`.
- **Can we migrate to Reverb later?** Yes—swap broadcaster; keep event contracts.

---

**End of Spec v1.0**

