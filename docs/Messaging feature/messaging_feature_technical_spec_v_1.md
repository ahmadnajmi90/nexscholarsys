# NexScholar Messaging Feature — Full‑Stack Implementation Spec (MVP v1)

**Owner:** sean (NexScholar)

**Stack:** Laravel 11 (Sanctum, Bouncer, Events/Broadcasting), Inertia React, Tailwind/Framer Motion, MySQL, Pusher (hosted WebSockets), DB Queue Driver, Local file storage (private disk).

**Goal:** Ship an internal, WhatsApp‑style messaging feature for connected users (DM + basic groups) with realtime updates, attachments, typing, and read receipts.

**Out of scope for MVP:** voice/video calls, voice recording, user block/mute, E2EE, reactions, threads, message search (semantic), delivery push notifications.

---

## Addendum v1.1 — Aligning Spec to Current Codebase

Your repo already contains messaging migrations/models using **auto-increment integer IDs**, **Reverb** configured, and these tables: `conversations`, `messages`, `conversation_participants`, `message_attachments`. This addendum adjusts the spec to match that base while keeping the planned feature set.

**Key alignments**

* **ID strategy:** Use **bigint auto-increment IDs** (not ULIDs) across all messaging tables. All references in this spec that say “ULID” should be interpreted as **integer IDs**. Cursor pagination remains `before=<id>` with `limit=50`.
* **Broadcasting:** Use **Pusher (hosted) for both local and production**. Remove or ignore any Reverb config. Set `BROADCAST_DRIVER=pusher`, supply Pusher keys, and initialize Echo with `pusher-js`. The Events/Channels listed later are unchanged.
* **Archive:** Add **per-user archive** via `conversation_participants.archived_at` (new column). The existing `conversations.is_archived` is optional and should **not** be used for the per-user archive UX.
* **Participant roles:** Support existing roles `owner|admin|member`. Policies will treat `owner` like `admin` for management actions.
* **Messages columns:** Your schema already has `delivered_at` and `read_at` (global). Keep them but **read receipts UI** will rely on `conversation_participants.last_read_message_id`. Add two small columns via patch migration: `messages.edited_at` and `messages.meta` (JSON) to support edits and extra client hints.
* **Attachments:** Keep `message_attachments.bytes` column name. Optional future: add `duration` for audio/video.
* **Presence:** Add `users.last_seen_at` (new column) for soft presence.

**Minimal patch migrations to add**

1. `add_archived_at_to_conversation_participants`
2. `add_edited_at_and_meta_to_messages`
3. `add_last_seen_at_to_users`

Everything else in the original spec stands (routes, events, policies, frontend flows), now interpreted with integer IDs.

---

## 1) Architecture & Decisions (ADR)

1. **Primary datastore: MySQL.** Chat is append‑only, paginated by time. Use ULIDs and narrow indexes. Avoid adding a new datastore.
2. **Realtime transport: Pusher (hosted).** No daemons or sudo. Client: `laravel-echo` + `pusher-js`.
3. **Auth boundary:** session‑auth under `/api/v1/app/*` for SPA actions.
4. **RBAC:** Bouncer policies for conversation/message operations. Only participants may access a conversation.
5. **Queues:** Database queue driver. If cron isn’t available, allow external cron ping; otherwise temporary `sync` for small jobs.
6. **File storage:** Local **private** disk for chat attachments. Serve via permission‑checked controllers (no public links). Public avatars/thumbnails may remain on `public` disk.
7. **Presence/online:** Soft presence via `users.last_seen_at` updates (no presence channels in MVP).
8. **Edit/Delete window:** Sender may edit/delete for everyone within 10 minutes (configurable). Always allow “delete for me”.
9. **Pagination model:** Cursor based: `before=<ULID>` with `limit=50` (descending by created\_at/id).

---

## 2) Environment & Config

**.env (sample)**

```
# Broadcasting — Pusher for local & prod
BROADCAST_DRIVER=pusher
PUSHER_APP_ID=xxxx
PUSHER_APP_KEY=xxxx
PUSHER_APP_SECRET=xxxx
PUSHER_APP_CLUSTER=ap1
PUSHER_SCHEME=https
PUSHER_PORT=443

# Vite-exposed keys for the browser (Echo)
VITE_PUSHER_APP_KEY=xxxx
VITE_PUSHER_APP_CLUSTER=ap1

# Queues
QUEUE_CONNECTION=database   # or 'sync' as fallback

# Files
FILESYSTEM_DISK=local
CHAT_PRIVATE_DISK=private
CHAT_MAX_UPLOAD_MB=20

# Messaging behavior
CHAT_EDIT_WINDOW_MIN=10
```

**Broadcast client (resources/js/bootstrap.js or similar)**

```js
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

window.Echo = new Echo({
  broadcaster: 'pusher',
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
  forceTLS: true,
});
```

* Ensure `pusher-js` and `laravel-echo` are installed: `npm i pusher-js laravel-echo`.
* Remove any Reverb-specific Echo config.

**Queues on shared hosting**

* Preferred: External cron (cron-job.org / EasyCron / GitHub Actions) hits a signed URL (e.g., `/internal/cron/queue`) every minute; the endpoint runs `queue:work --stop-when-empty` safely.
* Fallback: `QUEUE_CONNECTION=sync` for small tasks.

**Security for external cron endpoint**

* Require a signed URL + shared secret header; throttle to \~1/min.

## 2A) Pusher Setup — Local & Production (Step‑by‑Step)

> This section is a concrete cookbook to get realtime working with Pusher quickly on Laravel 11 and Inertia.

### A. Install client & server dependencies

* **PHP (server):** Pusher driver is built‑in, but install the SDK for completeness:

  ```bash
  composer require pusher/pusher-php-server
  ```
* **JS (client):**

  ```bash
  npm i laravel-echo pusher-js
  ```

### B. Configure `.env`

Set the values from your Pusher dashboard (App Keys):

```
BROADCAST_DRIVER=pusher
PUSHER_APP_ID=your-app-id
PUSHER_APP_KEY=your-key
PUSHER_APP_SECRET=your-secret
PUSHER_APP_CLUSTER=ap1
PUSHER_SCHEME=https
PUSHER_PORT=443

VITE_PUSHER_APP_KEY=your-key
VITE_PUSHER_APP_CLUSTER=ap1
```

> **Note:** Do **not** set host/port for hosted Pusher; use `cluster + https`.

### C. Update `config/broadcasting.php`

Default `pusher` connection is fine. Ensure it reads from env keys above. No Reverb settings are needed.

### D. Initialize Echo (browser)

Add to `resources/js/bootstrap.js` (or similar) as shown in the **Environment & Config** section. Re‑build assets:

```bash
npm run dev   # or npm run build
```

### E. Define private channel authorization

In `routes/channels.php` add per‑conversation access check:

```php
use App\Models\Messaging\ConversationParticipant;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Auth;

Broadcast::channel('conversation.{id}', function ($user, $id) {
    return ConversationParticipant::where('conversation_id', $id)
        ->where('user_id', $user->id)
        ->exists();
});
```

> Channel name here is `private-conversation.{id}` on the client (Echo prefixes `private-`).

### F. Create a test event (server)

```php
// app/Events/TestPing.php
namespace App\Events;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TestPing implements ShouldBroadcastNow
{
    use Dispatchable, SerializesModels;

    public function __construct(public int $conversationId, public string $message) {}

    public function broadcastOn(): array
    {
        return [new PrivateChannel('conversation.' . $this->conversationId)];
    }

    public function broadcastAs(): string
    {
        return 'TestPing';
    }
}
```

### G. Trigger the event (server)

Create a temporary route to fire a ping for conversation `1`:

```php
// routes/web.php
use App\Events\TestPing;
use Illuminate\Support\Facades\Route;

Route::get('/dev/push', function () {
    event(new TestPing(1, 'hello from server'));
    return 'ok';
})->middleware('auth');
```

### H. Listen in the browser (client)

In your Chat page mount:

```js
useEffect(() => {
  const channel = window.Echo.private(`conversation.${conversationId}`);

  channel.listen('.TestPing', (e) => {
    console.log('[Echo] TestPing', e);
  });

  return () => channel.stopListening('.TestPing');
}, [conversationId]);
```

### I. Smoke test

1. Login in two tabs as users that are **participants** of conversation `1`.
2. Open DevTools console; ensure you see Pusher connect logs (in dev).
3. Hit `/dev/push` in one tab → both tabs should log `[Echo] TestPing`.

### J. Wire real events

Replace the test event with your real messaging events from the spec: `MessageSent`, `MessageEdited`, `MessageDeleted`, `ReadAdvanced`, `TypingChanged`, `ConversationUpdated`.

### K. Troubleshooting checklist

* **401 on channel auth**: confirm user is logged in and the channel gate in `routes/channels.php` returns `true`.
* **Nothing received**: verify event implements `ShouldBroadcastNow` (or queue is running if just `ShouldBroadcast`).
* **Cluster mismatch**: ensure both server and client use the same `PUSHER_APP_CLUSTER`.
* **Mixed content**: if your app runs on `http://127.0.0.1` ensure Pusher uses `https` (default) — that’s fine; avoid forcing non‑TLS.
* **Keys**: `VITE_PUSHER_APP_KEY` must match `PUSHER_APP_KEY`.

---

## 3) Database Schema (Laravel migrations)

### 3.1 Tables

**conversations**

* `id` ULID PK
* `type` enum\[`direct`,`group`]
* `title` nullable (used for groups)
* `created_by` ULID (FK users)
* `last_message_id` ULID nullable (FK messages)
* timestamps

**conversation\_participants**

* `conversation_id` ULID (FK)
* `user_id` ULID (FK)
* `role` enum\[`member`,`admin`] default `member`
* `joined_at` datetime
* `last_read_message_id` ULID nullable (FK messages)
* `archived_at` datetime nullable
* `hidden_for_user` boolean default false (for "delete for me" thread level if needed)
* PK: composite (`conversation_id`,`user_id`)

**messages**

* `id` ULID PK
* `conversation_id` ULID (FK)
* `sender_id` ULID (FK users)
* `message_type` enum\[`text`,`image`,`video`,`audio`,`file`,`system`] default `text`
* `body` text nullable
* `meta` json nullable (e.g., dimensions, filename)
* `parent_message_id` ULID nullable (for replies – not used in MVP UI)
* `edited_at` datetime nullable
* softDeletes + timestamps

**message\_attachments**

* `id` ULID PK
* `message_id` ULID (FK messages)
* `disk` string
* `path` string
* `mime` string
* `size` int
* `width` int nullable
* `height` int nullable
* `duration` int nullable (seconds)
* `meta` json nullable
* timestamps

**users (existing)**

* Add `last_seen_at` nullable datetime (soft presence)

### 3.2 Indexes

* `messages (conversation_id, created_at)`
* `messages (sender_id, created_at)`
* `conversation_participants (user_id, conversation_id)` unique
* `message_attachments (message_id)`

### 3.3 Constraints/Rules

* A `direct` conversation has exactly 2 participants.
* Only `admin` in `group` can add/remove participants, change title.
* `last_message_id` must reference a non‑deleted message (update on delete for everyone → set to previous message).

---

## 4) Authorization (Bouncer policies)

**ConversationPolicy**

* `view(User, Conversation)`: participant only.
* `send(User, Conversation)`: participant only; deny if user soft‑hidden thread.
* `update(User, Conversation)`: `admin` or `created_by` for changing title, participants.
* `archive(User, Conversation)`: participant may set `archived_at`.

**MessagePolicy**

* `create(User, Conversation)`: alias to `send`.
* `edit(User, Message)`: user is sender AND within `CHAT_EDIT_WINDOW_MIN`.
* `deleteForEveryone(User, Message)`: user is sender AND within window.
* `deleteForMe(User, Message)`: participant always allowed.

---

## 5) REST API (session auth; prefix `/api/v1/app`)

### 5.1 Conversations

**GET `/conversations`**

* Query: `q` (search), `page`, `per_page`
* Returns: list with `id`, `type`, `title`, `participants` (id,name,avatar), `last_message` (snippet, type, ts, sender), `unread_count`.

**POST `/conversations`**

* Body (direct): `{ type:"direct", user_id: "ULID" }` (must be a Connection)
* Body (group): `{ type:"group", title:"...", user_ids:["ULID",...]} ` (must be Connections)
* Returns: conversation resource

**GET `/conversations/{id}`**

* Returns: conversation meta + participants (for header)

**POST `/conversations/{id}/archive`**

* Toggles `archived_at` for current user

### 5.2 Messages

**GET `/conversations/{id}/messages?before=<ULID>&limit=50`**

* Returns newest first until limit, with cursor keys: `next_before`.

**POST `/conversations/{id}/messages`**

* Multipart form

  * `body` (text, optional if attachments present)
  * `files[]` (0..N attachments; enforce size/type)
* Returns persisted message (with temporary clientId → server id map if provided)

**PATCH `/messages/{id}`**

* Body: `{ body: "..." }` (only text messages)

**DELETE `/messages/{id}`**

* Query: `scope=me|all` (delete for me vs everyone)

**POST `/conversations/{id}/read`**

* Body: `{ last_read_message_id: "ULID" }`

**POST `/conversations/{id}/typing`**

* Body: `{ is_typing: true|false }` (debounced on client; server broadcasts event)

### 5.3 Attachments (Private)

**GET `/attachments/{messageAttachmentId}`** — streams file if current user is a participant of the parent conversation.

Validation constants

* Allowed mime: `image/*`, `video/mp4,video/webm`, `audio/mpeg,audio/webm`, `application/pdf` + office docs as needed.
* Max size: `CHAT_MAX_UPLOAD_MB`.

---

## 6) Broadcast Channels & Events

**Private channel:** `private-conversation.{conversationId}`

* Channel authorization: current user is a participant.

**Events (payload → client)**

* `MessageSent` `{ conversation_id, message: MessageResource }`
* `MessageEdited` `{ conversation_id, id, body, edited_at }`
* `MessageDeleted` `{ conversation_id, id, scope: 'all'|'me' }`
* `ReadAdvanced` `{ conversation_id, user_id, last_read_message_id }`
* `TypingChanged` `{ conversation_id, user_id, is_typing }`
* `ConversationUpdated` `{ conversation: ConversationResource }` (title/member changes)

Client reconciliation rules

* If a message with `clientId` exists, merge by `id` once acked.
* Ignore duplicate `MessageSent` if `id` already in state.
* On `MessageDeleted(scope='all')`, replace bubble with "Message removed" placeholder.

---

## 7) Backend Implementation Notes

* **Controllers** use FormRequests for validation; Resources map entities to JSON (hide sensitive fields).
* **Services**: `SendMessageService`, `AttachmentService`, `ConversationService` to keep controllers thin.
* **Jobs**: `ProcessAttachment` (extract mime, size, image dims, generate preview if desired), `SendConversationEmails` (optional, queued).
* **Heartbeats**: set `users.last_seen_at=now()` on chat page load and every 30s lightweight ping (`POST /me/heartbeat`).
* **Read receipts**: update `conversation_participants.last_read_message_id` on viewport entry or explicit mark-as-read; broadcast `ReadAdvanced`.
* **Edit/Delete window** enforced at policy + validation levels.
* **Rate limiting**: throttle send endpoint (e.g., 20/min per user per conversation) and uploads (e.g., 5/min).
* **Error model**: standard Problem+JSON style or Laravel default; map policy denials to 403 with reason code.

---

## 8) Frontend (Inertia React) — Structure & UX

**Pages**

* `resources/js/Pages/Messaging/Inbox.jsx`

  * Left rail: search input (debounced), list of conversations (virtualized if large), FAB `+` menu (New Chat, Create Group, Add Contact).
  * Empty state in main area (illustration) when no conversation selected.

* `resources/js/Pages/Messaging/Chat.jsx`

  * Header: avatar(s), name/title, online dot (based on `last_seen_at`), ⋮ menu (View profile, Add to archive, Delete conversation for me).
  * Thread: virtualized list, infinite scroll up using `before` cursor.
  * Message bubble variants: text, image (lightbox), file card (filename, size, Download/Preview), video thumb/player, audio tag.
  * Status ticks: ✓ sent (persisted), ✓✓ read (compare to `last_read_message_id`).
  * Composer: text area (auto-grow), emoji button (optional), attach button (opens file picker), send.
  * Typing indicator above composer; disappears after 5s idle.

**State & data flow**

* Subscribe to `private-conversation.{id}` on mount; unsubscribe on unmount.
* Local optimistic send: push a `pending` bubble with `clientId`, then replace on server ack.
* Scrolling logic: if user near bottom, auto-scroll on incoming messages; else show "New messages" toast.
* Error UX: toast + retry for failed sends; show attachment progress bar; disable send while uploading.

**Styling**

* Tailwind utility classes; cards with soft shadows, rounded‑2xl, spacing consistent with app design; dark‑mode aware if app supports it.

---

## 9) Validation Rules (server‑side)

* Text body: max 5,000 chars; trimmed; empty allowed only if there’s at least one attachment.
* Files: max `CHAT_MAX_UPLOAD_MB`; mime whitelist; reject archive executables; virus scan job optional (future).
* Edit window: validate `now() - message.created_at <= CHAT_EDIT_WINDOW_MIN`.

---

## 10) Edge Cases & Behaviors

* **Duplicate DM creation**: enforce unique direct conversation per (user A, user B); return existing.
* **Deleted for everyone**: if last message is deleted, recompute `conversations.last_message_id` to previous visible message.
* **User leaves group**: remove from participants; prevent future access; history remains.
* **Attachment not ready**: show placeholder; allow retry.
* **Offline reconnect**: buffer outgoing messages with `clientId`; retry when online.

---

## 11) Minimal Test Plan

**Feature tests**

* Create direct conversation (must be Connections) and group conversation (admin role).
* List conversations with unread counts (fixtures with last\_read markers).
* Send text + file message; policy denies non‑participants.
* Edit/delete within window; deny after window.
* Mark read advances and broadcasts event.

**Unit tests**

* Services: `SendMessageService` (creates, updates last\_message\_id, dispatches events/jobs).
* AttachmentService (mime/size validation, storage path).

---

## 12) Analytics (optional)

* `msg_sent`, `msg_read`, `file_uploaded`, `conv_created`, `conv_opened`, `typing_started` (sample event names, no PII).

---

## 13) Deployment Checklist

* [ ] Add env keys for Pusher; set `BROADCAST_DRIVER=pusher`.
* [ ] `php artisan migrate` (adds tables + last\_seen\_at on users).
* [ ] Queue driver: `QUEUE_CONNECTION=database` (or `sync`).
* [ ] If using external cron: create signed route and configure external service every minute.
* [ ] Verify private disk exists and is writable (`storage/app/private`).
* [ ] Build frontend: `npm run build`.

---

## 14) Definition of Done (DoD)

* MVP flows work: create/open conversation, send text & files, realtime updates, typing, read receipts, edit/delete window, archive, search.
* Policies enforced; non‑participants cannot access data.
* Attachments served only via permission‑checked controller.
* DB indexes present; pagination < 200ms for 50 items on realistic data.
* No console errors; Lighthouse a11y score ≥ 90 for chat pages.
* Basic tests passing; README updated with env & setup.

---

## 15) Vibe‑Coding Agent Prompts (paste into your code agent)

### 15.1 Create DB migrations & models

```
Goal: Create messaging tables and models per spec.

Tasks:
- Migrations for conversations, conversation_participants, messages, message_attachments; add users.last_seen_at.
- Eloquent models with relations, casts, fillable, ULIDs.
- Policies for Conversation and Message as described.
- Seed a small dataset for local testing (2 conversations, 10 messages each).
Deliver: migrations, models, policies, seeders.
```

### 15.2 REST endpoints + services

```
Goal: Implement /api/v1/app messaging endpoints with validation and resources.

Tasks:
- Controllers: ConversationController, MessageController, AttachmentController, TypingController, ReadController.
- FormRequests for each action.
- Resources: ConversationResource, ParticipantResource, MessageResource, AttachmentResource.
- Services: SendMessageService, AttachmentService, ConversationService.
- Respect policies; return pagination cursors.
Deliver: routes, controllers, requests, resources, services.
```

### 15.3 Broadcasting

```
Goal: Private channels and events for realtime updates using Pusher.

Tasks:
- Broadcast channel: private-conversation.{id}; channel auth ensures participant.
- Events: MessageSent, MessageEdited, MessageDeleted, ReadAdvanced, TypingChanged, ConversationUpdated.
- Configure Echo in bootstrap; subscribe in Chat page.
Deliver: event classes, channel definitions, Echo bootstrap.
```

### 15.4 Frontend pages & components

```
Goal: Build Inbox.jsx and Chat.jsx with realtime wiring.

Tasks:
- Inbox.jsx: left rail with search, list, unread badges, + menu.
- Chat.jsx: header, virtualized message list with infinite scroll, composer with file picker, typing/read receipts, optimistic sends.
- Components: ConversationList, MessageItem (variants), Composer, AttachmentPreview, TypingIndicator.
- Axios calls to API; Toasts for errors; loading placeholders.
Deliver: React pages/components with Tailwind classes and Inertia wiring.
```

### 15.5 Private attachments

```
Goal: Store attachments on private disk and stream with auth.

Tasks:
- Controller that checks participant membership and streams via Storage::response().
- AttachmentService to persist metadata; optional thumbnail job.
- Validation of mime/size; env-driven max size.
Deliver: routes + controller, service, tests.
```

---

## 16) Appendix — Example JSON Shapes

**Conversation (list item)**

```
{
  "id": "01J7X...",
  "type": "direct",
  "title": null,
  "participants": [{"id":"01...","name":"A","avatar":"/..."},{"id":"02...","name":"B"}],
  "last_message": {"id":"01J...","type":"text","snippet":"Sounds good","ts":"2025-09-13T05:23:00Z","sender_id":"01..."},
  "unread_count": 3
}
```

**Message**

```
{
  "id":"01J...",
  "conversation_id":"01J...",
  "sender": {"id":"01...","name":"A"},
  "type":"image",
  "body": "caption...",
  "attachments": [
    {"id":"01K...","mime":"image/png","url":"/attachments/01K...","width":1280,"height":720}
  ],
  "edited_at": null,
  "created_at":"2025-09-13T05:23:00Z"
}
```

---

**End of Spec**
