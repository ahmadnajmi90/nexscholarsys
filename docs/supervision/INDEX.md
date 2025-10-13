# Supervision System Documentation Index

Welcome to the comprehensive documentation for Nexscholar's Supervision Management System. This index provides quick access to all supervision-related documentation, organized by topic and purpose.

---

## Quick Links

| Resource | Purpose | Audience |
|----------|---------|----------|
| [Platform README](../../README.md#features) | High-level overview of Nexscholar capabilities and setup | Product, Engineering |
| [Features Guide](../FEATURES.md#supervision-management) | Detailed breakdown of supervision functionality within the platform context | Engineering, QA |
| [Configuration](../../config/supervision.php) | Runtime limits, automation toggles, and system defaults for supervision | Engineering, DevOps |
| [API Routes](../../routes/api.php) | Source of REST endpoints powering supervision flows | Engineering |

---

## Feature Overview

The Supervision Management System is a comprehensive platform feature that streamlines the entire postgraduate supervision lifecycle, from initial supervisor discovery through to ongoing research collaboration.

### Key Capabilities

- **Request Management**: Students submit proposals with attachments; supervisors review and decide
- **Relationship Management**: Active supervision with main and co-supervisor support
- **Meeting Coordination**: Supervisor-scheduled meetings with automated reminders
- **Document Collaboration**: Shared repository for proposals, reports, and research materials
- **Activity Tracking**: Complete audit trail of all supervision events
- **Automated Workflows**: Smart automation for request limits, auto-cancellations, and notifications
- **Integration**: Seamless connection with Messaging, ScholarLab, and AI Matching features

---

## System Architecture

### Backend Structure

```
app/
├── Http/
│   ├── Controllers/Api/V1/Supervision/
│   │   ├── AbstractController.php          # Base controller with shared logic
│   │   ├── ActivityFeedController.php      # Timeline and activity feed
│   │   ├── CoSupervisorController.php      # Co-supervisor management
│   │   ├── DecisionController.php          # Accept/reject workflows
│   │   ├── MeetingController.php           # Meeting CRUD operations
│   │   ├── NoteController.php              # Private supervisor notes
│   │   ├── RelationshipController.php      # Active supervision management
│   │   ├── RequestController.php           # Request submission and viewing
│   │   └── UnbindController.php            # Relationship termination
│   ├── Resources/Supervision/              # API response transformers
│   └── Requests/Supervision/               # Form validation requests
├── Services/Supervision/
│   ├── SupervisionRequestService.php       # Request business logic
│   ├── SupervisionRelationshipService.php  # Relationship lifecycle
│   ├── SupervisionMeetingService.php       # Meeting scheduling logic
│   ├── CoSupervisorService.php             # Co-supervisor workflows
│   └── UnbindRequestService.php            # Unbind process handling
├── Models/
│   ├── SupervisionRequest.php
│   ├── SupervisionRelationship.php
│   ├── SupervisionRequestNote.php
│   ├── SupervisionMeeting.php
│   ├── CoSupervisorInvitation.php
│   └── SupervisionRequestAttachment.php
├── Notifications/Supervision/              # 15+ notification classes
└── Policies/
    └── SupervisionPolicy.php               # Authorization rules
```

### Frontend Structure

```
resources/js/Pages/Supervision/
├── MySupervisor.jsx                        # Student dashboard
├── SupervisorDashboard.jsx                 # Supervisor dashboard
└── Partials/
    ├── UnifiedRequestDetailCard.jsx        # Shared detail modal
    ├── RequestFormModal.jsx                # Request submission form
    ├── AcceptRequestModal.jsx              # Acceptance workflow
    ├── RejectRequestModal.jsx              # Rejection workflow
    ├── MeetingModal.jsx                    # Meeting scheduling
    ├── UnbindModal.jsx                     # Unbind workflow
    ├── CoSupervisorInviteModal.jsx         # Co-supervisor invitations
    ├── ActivityFeedPanel.jsx               # Timeline display
    └── [12+ additional components]
```

### Database Schema

See [README.md](README.md#data-model-proposed) for complete data model specifications.

Key tables:
- `supervision_requests` - Request lifecycle and proposal data
- `supervision_relationships` - Active supervision pairings
- `supervision_request_notes` - Supervisor notes on requests
- `supervision_meetings` - Meeting schedule and details
- `co_supervisor_invitations` - Co-supervisor invitation workflow
- `supervision_request_attachments` - File uploads per request

---

## Feature Workflows

### 1. Student Journey

**Discovery → Request → Acceptance → Active Supervision**

1. **Find Supervisors**: Use AI Matching to discover suitable supervisors
2. **Submit Request**: Create proposal with title, motivation, abstract, and attachments (max 5 pending)
3. **Communication**: Auto-created messaging conversation with supervisor
4. **Meeting**: Supervisor schedules pre-acceptance meeting (optional)
5. **Decision**: Wait for supervisor to accept or reject
6. **Activation**: Upon acceptance:
   - Active supervision relationship created
   - ScholarLab workspace auto-created
   - All other pending requests auto-cancelled
   - Connection established with supervisor
7. **Collaboration**: Ongoing meetings, document sharing, and research management

### 2. Supervisor Journey

**Review → Evaluate → Decide → Manage**

1. **Incoming Requests**: View all requests with status indicators
2. **Detailed Review**: Access proposal, attachments, student profile, and chat
3. **Pre-Decision Actions**:
   - Schedule exploratory meetings
   - Add private notes
   - Communicate via integrated chat
4. **Decision Making**:
   - **Accept**: Define role (main/co), meeting cadence, start term, optional ScholarLab workspace
   - **Reject**: Provide feedback, optional alternative supervisor recommendations
5. **Active Management**:
   - Schedule regular meetings with reminders
   - Upload/download shared documents
   - Invite co-supervisors (max 2)
   - Add progress notes
   - View complete activity timeline
6. **Unbind** (if needed): Structured termination process with reason and archival

### 3. Co-Supervisor Workflow

1. Main supervisor invites co-supervisor from active relationship
2. Co-supervisor receives notification and reviews invitation
3. Accept or decline with optional message
4. Upon acceptance, gains access to student relationship (limited permissions)

---

## Key Integrations

### Messaging System
- **Trigger**: Automatic conversation creation on request submission
- **Bypass**: No "must be connected" gate for supervision-originated conversations
- **Persistence**: Conversation accessible from modal and global Messages page

### ScholarLab (ProjectHub)
- **Trigger**: Supervisor acceptance (if opted-in)
- **Action**: Creates dedicated supervision workspace with pre-configured board
- **Members**: Supervisor (Owner) + Student (Member) + Co-supervisors (if any)
- **Template**: Standard supervision board with lists for Onboarding, Meetings, Milestones, Research Tasks

### AI Matching
- **Integration Point**: Students use semantic search to find supervisors
- **Flow**: AI match results → Add to shortlist → Submit request
- **Personalization**: AI-generated insights explain why matches are relevant

### Notification System
Comprehensive coverage including:
- Request submitted/accepted/rejected/auto-cancelled
- Meeting scheduled/updated/cancelled/reminder
- Co-supervisor invited/accepted/declined
- Relationship unbind initiated/completed
- Notes and documents added

### Access Control
`SupervisionPolicy` enforces:
- Students access only their own requests/relationships
- Supervisors access only requests where they are the target
- Meeting/note creation restricted to supervisors
- View permissions based on relationship status

---

## Configuration

Supervision system settings are defined in `config/supervision.php`:

```php
return [
    'max_pending_requests' => 5,
    'max_co_supervisors' => 2,
    'meeting_reminder_hours' => 24,
    'auto_cancel_other_requests_on_accept' => true,
    'auto_create_scholarlab_workspace' => true,
    'allowed_attachment_types' => ['pdf', 'doc', 'docx', 'txt'],
    'max_attachment_size' => 10240, // KB
];
```

---

## Scheduled Tasks

### Meeting Reminders
**Command**: `php artisan supervision:send-meeting-reminders`  
**Schedule**: Hourly (defined in `app/Console/Kernel.php`)  
**Purpose**: Sends notifications to supervisors and students 24 hours before scheduled meetings

---

## API Endpoints

All supervision endpoints are RESTful and located under `/api/v1/supervision`:

### Requests
- `POST /supervision/requests` - Submit new request
- `GET /supervision/requests` - List user's requests (student) or incoming requests (supervisor)
- `GET /supervision/requests/{id}` - View request details
- `PUT /supervision/requests/{id}` - Update request (limited fields)
- `DELETE /supervision/requests/{id}` - Withdraw request (student only)

### Decisions
- `POST /supervision/requests/{id}/accept` - Accept request
- `POST /supervision/requests/{id}/reject` - Reject request

### Relationships
- `GET /supervision/relationships` - List active relationships
- `GET /supervision/relationships/{id}` - View relationship details
- `PUT /supervision/relationships/{id}` - Update relationship settings
- `POST /supervision/relationships/{id}/unbind` - Initiate unbind

### Meetings
- `GET /supervision/relationships/{id}/meetings` - List meetings
- `POST /supervision/relationships/{id}/meetings` - Create meeting
- `PUT /supervision/meetings/{id}` - Update meeting
- `DELETE /supervision/meetings/{id}` - Cancel meeting

### Notes
- `GET /supervision/requests/{id}/notes` - List request notes
- `POST /supervision/requests/{id}/notes` - Add note
- `DELETE /supervision/notes/{id}` - Delete note

### Co-Supervisors
- `POST /supervision/relationships/{id}/co-supervisors` - Invite co-supervisor
- `POST /supervision/co-supervisor-invitations/{id}/accept` - Accept invitation
- `POST /supervision/co-supervisor-invitations/{id}/decline` - Decline invitation

### Activity Feed
- `GET /supervision/requests/{id}/activity` - Request activity timeline
- `GET /supervision/relationships/{id}/activity` - Relationship activity timeline

---

## Testing

### End-to-End Tests
Playwright tests covering supervision workflows located in test suite.

Key test scenarios:
- Request submission with validation
- Supervisor decision workflows (accept/reject)
- Meeting scheduling and reminders
- Co-supervisor invitation flow
- Unbind process completion
- Permission and access control

### Manual Testing Checklist
See individual workflow docs for comprehensive testing scenarios.

---

## Future Enhancements

Potential improvements documented in refactoring recommendations:

1. **Google Calendar Integration**: Sync meetings with external calendars
2. **Progress Milestones**: Define and track student research milestones
3. **Document Versioning**: Track revisions of shared documents
4. **Automated Progress Reports**: AI-generated supervision summaries
5. **Multi-Language Support**: Internationalization for global deployment
6. **Mobile App**: Native mobile interface for on-the-go supervision management
7. **Analytics Dashboard**: Supervisor performance and student progress metrics

---

## Support & Contribution

For questions, issues, or contributions related to the supervision system:

1. Check existing documentation in this directory
2. Review code comments and inline documentation
3. Consult with the development team
4. Submit issues or PRs following project contribution guidelines

---

## Change Log

- **2025-09-29**: Initial specification and implementation
- **2025-09-30**: Meeting system and co-supervisor support added
- **2025-10-01 - 2025-10-05**: Comprehensive refactoring phases 1-3 completed
- **2025-10-13**: Documentation index created and root docs updated

---

**Last Updated**: October 13, 2025  
**Maintained By**: Nexscholar Development Team  
**Version**: 1.0 (Post-Refactoring)

