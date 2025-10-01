# Supervision Feature Specification

## Purpose
This document captures the end-to-end requirements for the supervision relationship feature. It covers the student and academician experiences, underlying data structures, integrations, and communication rules so the implementation can proceed without ambiguity.

---

## Personas & Roles
- **Postgraduate Student** (primary initiator)
  - Builds a shortlist of potential supervisors from program recommendations.
  - Submits supervision requests (max 5 pending at a time).
  - Coordinates proposals, meetings, and documents until a supervisor accepts.
- **Academician (Supervisor)**
  - Reviews incoming requests, communicates with prospective students, and accepts or rejects proposals.
  - Manages active supervisees, schedules meetings, and tracks notes/documents.
- **Platform System**
  - Enforces request limits, auto-cancels competing requests upon acceptance, issues notifications/emails, and auto-creates ScholarLab boards.

---

## Data Model (Proposed)

| Table | Purpose | Key Fields |
| --- | --- | --- |
| `potential_supervisors` | Student shortlist separate from bookmarks | `id`, `student_id`, `academician_id`, `postgraduate_program_id`, `created_at`
| `supervision_requests` | Lifecycle of each proposal | `id`, `student_id`, `academician_id`, `status (pending/accepted/rejected/auto_cancelled)`, `proposal_title`, `motivation`, `attachments`, `submitted_at`, `decision_at`, `cancel_reason`
| `supervision_request_attachments` | Store uploaded files per request | `request_id`, `type (proposal/transcript/background/portfolio)`, `path`
| `supervision_relationships` | Active supervisor-student pairing | `id`, `student_id`, `academician_id`, `role (main/co)`, `start_date`, `meeting_cadence (text)`, `scholarlab_workspace_id`, `scholarlab_board_id`, `status`
| `supervision_meetings` | Meeting schedule records | `relationship_id`, `title`, `scheduled_for`, `location_link`, `agenda (text)`, `attachments`
| `supervision_notes` (optional) | Supervisor private notes/history | `relationship_id`, `author_id`, `note`, `created_at`
| `supervision_timeline` (optional) | Audit trail for UI timeline | `entity_type`, `entity_id`, `event_type`, `metadata`, `created_at`

**Constraints**
- Only one `main` supervisor per student. Up to two `co` supervisors if future requirements allow multiple acceptances.
- Maximum five `pending` requests per student. Acceptance triggers auto-cancel of the rest with proper notification.

---

## Student Experience

### 1. Potential Supervisors
- Accessible via `My Supervisor` page when no active supervisor exists.
- Cards mirror the supervisor list design from program recommendations.
- CTA: “Add to Potential Supervisors” saves into `potential_supervisors` (not bookmarks).
- Each card exposes `View Profile`, `Remove`, and `Request Supervisor` actions.

### 2. Request Supervisor Modal
- Captures proposal data:
  - Required: Proposal title, motivation, uploaded research proposal (PDF/DOC/DOCX).
  - Optional: Transcript, research background, thesis/portfolio.
  - Confirmation checkbox for originality acknowledgement.
- Upon submission:
  - Validate 5-request limit.
  - Create entry in `supervision_requests` (status `pending`).
  - Initialize or reuse messaging conversation (see Integration section).
  - Move card from “Potential supervisors” to “Proposal status”.

### 3. Proposal Status Tab
- Shows cards for each pending or rejected request with status chips (e.g., “Meeting Scheduled”, “Offer Available”).
- Card click opens the Supervision Modal (shared with supervisor view) containing:
  - **Overview**: Proposal summary, research focus, status timeline.
  - **Proposal**: Full details & attachments.
  - **Chat**: Embedded conversation.
  - **Meetings**: Read-only view (students cannot schedule) with details and external link.
  - **History**: Timeline events (submitted, under review, meeting scheduled, accepted, rejected).

### 4. Manage Supervisor Tab
- Becomes the sole tab once a request is accepted.
- Displays primary supervisor (and any additional co-supervisors, if supported later).
- Actions: open chat, view/upload documents, see upcoming meetings, view ScholarLab board link.

### 5. Auto-Cancellation Behavior
- When one supervisor accepts, the platform automatically marks other requests as `auto_cancelled` and issues notifications/emails to those supervisors.

---

## Academician Experience

### 1. Supervisor Dashboard
- Tabs: `Manage Requests`, `My Students`.

#### Manage Requests
- Cards show incoming proposals with status (Pending Review, Meeting Scheduled, etc.).
- Clicking card opens Supervision Modal with supervisor controls:
  - **Accept flow**: Form fields for
    - Supervision role (choices: Main Supervisor, Co-supervisor).
    - Start term (optional dropdown or date).
    - Meeting cadence (free text).
    - Optional welcome message.
    - Toggle to auto-create ScholarLab supervision board.
  - On confirmation:
    - Create `supervision_relationship` entry.
    - Auto-cancel other pending requests for the student.
    - Trigger ScholarLab integration.
    - Trigger notifications/emails to student and all affected supervisors.
  - **Reject flow**: Requires reason, optional feedback, ability to recommend alternative supervisors (list of suggestions + keywords). Sends message preview to student.

#### My Students
- Cards per active supervisee with key tags (status, start date, keywords).
- Modal tabs mirror student view but with editable sections:
  - **Overview**: Student summary (education, publications, skills) plus supervisor notes.
  - **Documents**: Upload/download shared files.
  - **Chat**: Same conversation component.
  - **Meetings**: Supervisor can schedule/edit/cancel meetings, attach agenda/attachments, store meeting link.
  - **Notes**: Private supervisor notes.
  - **History**: Timeline events.

---

## Integrations & Cross-Cutting Concerns

### Messaging
- Conversation is created (or reused) as soon as the student submits a request.
- No “must be connected” gate when conversation originates from a supervision request or relationship.
- Once a supervisor accepts, establish a standard connection between both users so connection-dependent features stay consistent.
- Conversation accessible both from the modal and the global `Messages` page.

### Notifications & Email
Trigger both in-app notifications and transactional emails for:
- Request submitted (notify supervisor).
- Request accepted (notify student; also notify other supervisors of auto-cancellation).
- Request rejected (notify student with provided feedback).
- Meeting scheduled/updated/cancelled.
- ScholarLab board created.
Email templates should live under `resources/views/emails/supervision/*` with translation keys for future localization.

### Meeting Scheduling
- Supervisors only. Required fields: `title`, `scheduled_for` (datetime w/ timezone), `location_link` (URL or physical location text).
- Optional: `agenda` (rich text), attachments.
- Future expansion: store `external_event_id` for Google Calendar integration.

### ScholarLab Integration
- Acceptance flow calls ProjectHub services to:
  - Create supervision workspace/board using the upcoming template system.
  - Add supervisor and student as members (Owner + Member).
  - Seed default lists/tasks (e.g., Onboarding, Meetings, Milestones) once template designs are finalized.
  - Persist workspace/board IDs on the `supervision_relationship` record.

### Access Control & Policies
- New policies to enforce:
  - Students can only view or modify their own potential supervisors, requests, and relationships.
  - Supervisors can only access requests where they are the target academician.
  - Meeting creation/edit limited to supervisors in the relationship.
  - ScholarLab board creation restricted to accepted supervisors.

---

## User Interface Notes
- Follow existing UI language: use tabbed navigation, right sidebar for Recent Activity, Upcoming Meetings, Quick Actions.
- Empty states:
  - Potential Supervisors: guidance on adding from program list.
  - Proposal Status: “No proposals sent yet.”
  - Manage Supervisor: “Once a supervisor accepts, their details will appear here.”
  - Supervisor Dashboard tabs: helpful info for no requests/students.
- Modals can appear as side drawer on desktop, full-screen modal on mobile.

---

## Outstanding Tasks for Implementation
1. Finalize DB schema and migrations per tables above.
2. Create Eloquent models, relationships, policies, and observers as needed.
3. Build student and supervisor controllers/resources with Inertia pages and components (cards, modals, forms).
4. Wire up messaging integration service to create/reuse conversations.
5. Implement notification + email flows for all key events.
6. Build meeting scheduler UI (supervisor only) and persistence layer.
7. Implement ScholarLab integration hook in acceptance workflow using template once available.
8. Update documentation and product tutorials as needed after feature ship.

---

## Change Log
- **2025-09-29**: Initial specification drafted based on product discussions (ChatGPT planning session).
- **2025-09-29**: Added supervision migrations, models, services, REST API, notifications, and ScholarLab integration scaffolding.
