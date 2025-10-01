# Supervision Feature Implementation Plan

This roadmap translates the specification into actionable steps. Follow the phases in order; each phase builds on the previous one and should include code, tests, and documentation updates before moving forward.

---

## Phase 0 – Preparation
- [x] Create feature branch `feat/supervision-mvp` (backend + frontend combined).
- [x] Enable feature flag/config if needed (e.g., `.env` toggle) to guard unfinished UI.
- [x] Confirm product copy for key CTAs ("Add to Potential Supervisors", etc.).

## Phase 1 – Database Foundation
1. **Migrations**
   - [ ] `potential_supervisors`
     - `id`, `student_id` (`users.id`), `academician_id` (`users.id`), `postgraduate_program_id`, timestamps, unique constraint per student/academician.
   - [ ] `supervision_requests`
     - Fields per spec (`proposal_title`, `motivation`, status enum, `submitted_at`, `decision_at`, `cancel_reason`, etc.).
   - [ ] `supervision_request_attachments`
     - Attachments keyed by type.
   - [ ] `supervision_relationships`
     - Supervisor role enum (`main`, `co`), cadence text, ScholarLab identifiers, status.
   - [ ] `supervision_meetings`
     - Supervisor-only scheduling data (required + optional fields).
   - [ ] Optional tables (`supervision_notes`, `supervision_timeline`) if included in MVP.
   - [ ] Add indexes/foreign keys with cascading deletes as appropriate.
2. **Seeders/Factories**
   - [ ] Add factories for requests/relationships/meetings to support testing.

## Phase 2 – Eloquent Models & Policies
- [ ] Implement models with relationships:
  - `PotentialSupervisor`, `SupervisionRequest`, `SupervisionRequestAttachment`, `SupervisionRelationship`, `SupervisionMeeting`, optional `SupervisionNote`, `SupervisionTimeline`.
- [ ] Define casts/enums (use PHP enums where helpful) and helper scopes (e.g., `pending()`).
- [ ] Create policies to enforce access rules for students vs supervisors.
- [ ] Register policies in `AuthServiceProvider` (Laravel 11 boot method).

## Phase 3 – Domain Services
- [ ] `SupervisionShortlistService`
  - Add/remove potential supervisors, enforce duplicates, limit per program.
- [ ] `SupervisionRequestService`
  - Handle request creation, validation of 5-request cap, auto-create/reuse conversation via `ConversationService`, send notifications/emails.
  - Manage status transitions, auto-cancellation logic, reason handling.
- [ ] `SupervisionRelationshipService`
  - Accept/reject flows, creation of relationships, auto-create connection (reuse existing `ConnectionService` or build helper), trigger ScholarLab integration.
- [ ] `SupervisionMeetingService`
  - Supervisor-only scheduling with validation; future-ready for calendar sync.
- [ ] `ScholarLabSupervisionSetupService`
  - Wrap calls to ProjectHub services to create workspace/board, seed template lists/tasks, add members.

## Phase 4 – Messaging Integration Adjustments
- [ ] Update `ConversationService` & messaging policies to allow conversations initiated via supervision even if users aren’t connected.
- [ ] Introduce helper linking `supervision_requests` / `supervision_relationships` to `conversations` (e.g., pivot or foreign key on request/relationship).
- [ ] Ensure acceptance flow auto-creates a connection using existing `connections` table when status becomes `accepted`.

## Phase 5 – Notifications & Email
- [ ] Create notification classes (e.g., `SupervisionRequestSubmitted`, `SupervisionRequestAccepted`, `SupervisionRequestRejected`, `SupervisionRequestCancelled`, `SupervisionMeetingScheduled`).
- [ ] Build matching Mailable classes & Blade templates under `resources/views/emails/supervision/`.
- [ ] Register notifications in relevant services and ensure events broadcast to correct channels.

## Phase 6 – API & Controllers
### Student-Facing
- [ ] `SupervisionController` (web routes for Inertia pages) for tabs data.
- [ ] API endpoints (`/api/v1/app/supervision/*`) for shortlist CRUD, request submit/cancel, fetch status, upload attachments.
### Supervisor-Facing
- [ ] `SupervisorDashboardController` (Inertia) + API endpoints for requests, accept/reject, meetings, notes.
- [ ] Apply existing middleware (`auth`, `verified`, roles via Bouncer).

## Phase 7 – Frontend (Inertia/React)
### Shared UI Elements
- [ ] Reusable card component for supervisors/students with status chips.
- [ ] Supervision Modal (side drawer on desktop, modal on mobile) with tabs: Overview, Proposal, Chat, Meetings, Notes, History.
- [ ] Upload components leveraging existing Shadcn/Tailwind utilities.
### Student Pages
- [ ] Update Postgraduate Recommendations supervisor list button text/action.
- [ ] `Pages/MySupervisor/Index.jsx` with tabs (Potential Supervisors, Proposal Status, Manage Supervisor).
- [ ] Maximum request limit indicator + empty states.
### Supervisor Pages
- [ ] `Pages/SupervisorDashboard/Index.jsx` with tabs (Manage Requests, My Students).
- [ ] Accept/Reject modals with additional forms.
- [ ] Meeting scheduler UI for supervisors (agenda + attachments).
- [ ] Link to ScholarLab board once available.

## Phase 8 – ScholarLab Integration
- [ ] Extend ProjectHub services to support templated board creation (if template feature not yet present, implement minimal scaffolding inside this feature).
- [ ] Auto-create board during acceptance when toggle selected; add default lists (Onboarding, Meetings, Milestones) and link tasks.

## Phase 9 – Testing
- [ ] **Pest tests**
  - Model factories & relationships.
  - Services (shortlist, requests, relationships, meetings) covering happy paths, limits, auto-cancel.
  - Policy tests ensuring proper authorization.
  - Controller/route tests for key endpoints.
- [ ] **Jest/RTL**
  - Component rendering tests for new React components (cards, modals, meeting scheduler) with props variations.

## Phase 10 – Documentation & Ops
- [ ] Update `docs/supervision/README.md` change log with implementation milestones.
- [ ] Add user-facing docs/tutorial updates (if required) in `/docs` or `/resources/js/Pages/Tutorial`.
- [ ] Ensure translation strings added to `lang` files if applicable.
- [ ] Confirm queues, broadcasting, and notifications configurations (Reverb/Pusher) support new events; update `.env.example` if new keys are needed.

## Phase 11 – Deployment Checklist
- [ ] Run migrations & seeders on staging.
- [ ] Test messaging edge cases (non-connected chat) on staging.
- [ ] Verify ScholarLab board auto-creation and member invites.
- [ ] Configure email templates in production mail provider.
- [ ] Monitor logs for new notification types.

---

## References for Reuse
- Messaging stack: `app/Services/Messaging/*`, `resources/js/Pages/Messaging/`.
- Connections: migration `2025_06_10_141835_create_connections_table.php`, related models/services.
- ProjectHub integration: `app/Services/ProjectHub/*`, `app/Http/Controllers/ProjectHub/*`.
- Notifications: existing implementations under `app/Notifications` for pattern reference.

Keep this document synchronized during implementation (tick completed steps, append decisions).
