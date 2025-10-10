# Supervision Feature - Critical Fixes Checklist

## 🚨 CRITICAL - Must Fix Before Production

- [ ] **Create Authorization Policies**
  - [ ] Create `app/Policies/SupervisionPolicy.php`
  - [ ] Create `app/Policies/SupervisionRelationshipPolicy.php`
  - [ ] Implement methods: `viewRequest`, `cancelRequest`, `acceptRequest`, `rejectRequest`, `studentAccept`, `studentReject`
  - [ ] Implement methods: `initiateUnbind`, `approveUnbind`, `rejectUnbind`
  - [ ] Replace manual auth checks with `$this->authorize()` in all controllers
  - [ ] Register policies in `AuthServiceProvider`

- [ ] **Create Form Request Classes**
  - [ ] `AcceptSupervisionRequestRequest.php`
  - [ ] `RejectSupervisionRequestRequest.php`
  - [ ] `SubmitSupervisionRequestRequest.php`
  - [ ] `StudentAcceptOfferRequest.php`
  - [ ] `InitiateUnbindRequest.php`
  - [ ] `CoSupervisorInviteRequest.php`
  - [ ] `ScheduleMeetingRequest.php`

- [ ] **Fix Auto-Cancel Logic**
  - [ ] File: `SupervisionRelationshipService.php:165`
  - [ ] Include `STATUS_PENDING_STUDENT_ACCEPTANCE` in auto-cancel query
  - [ ] Same fix in line 65

- [ ] **Fix Request Count Validation**
  - [ ] File: `SupervisionRequestService.php:27`
  - [ ] Remove `STATUS_ACCEPTED` from count
  - [ ] Add `STATUS_PENDING_STUDENT_ACCEPTANCE` to count
  - [ ] Update error message

- [ ] **Fix Permission Checks in CoSupervisorController**
  - [ ] Line 35: Use `$user->postgraduate->postgraduate_id` instead of `$user->unique_id`
  - [ ] Line 38: Use `$user->academician->academician_id` instead of `$user->unique_id`
  - [ ] Lines 74, 120, 122, 167, 169, 199, 223-224, 255, 257, 313: Same fix
  - [ ] Add null checks before accessing relationships

- [ ] **Add Transaction Error Handling**
  - [ ] File: `SupervisionRelationshipService.php:180-183`
  - [ ] Move ScholarLab creation outside transaction or wrap in try-catch
  - [ ] Add logging for ScholarLab failures
  - [ ] Consider retry logic

---

## ⚠️ HIGH PRIORITY - Fix This Sprint

- [ ] **Fix Unbind Cooldown Configuration**
  - [ ] Create `config/supervision.php`
  - [ ] Move `unbind_cooldown_days` from hardcoded 30 to config (7 days)
  - [ ] Move `max_pending_requests` from 5 to config
  - [ ] Move `MAX_COSUPERVISORS` from 2 to config
  - [ ] Move `MAX_ATTEMPTS_BEFORE_FORCE` to config

- [ ] **Implement Timeline Event Creation**
  - [ ] Add timeline event when relationship created
  - [ ] Add timeline event when relationship terminated
  - [ ] Add timeline event when unbind initiated
  - [ ] Add timeline event when unbind approved/rejected
  - [ ] Add timeline event when meeting scheduled
  - [ ] Add timeline event when document uploaded

- [ ] **Fix Notification Issues**
  - [ ] Create `SupervisionRequestAutoCancelled` notification
  - [ ] Replace `SupervisionRequestRejected` with `SupervisionRequestAutoCancelled` in auto-cancel logic
  - [ ] File: `SupervisionRelationshipService.php:174`

- [ ] **Add Database Indexes**
  - [ ] `supervision_requests`: index on `student_id`
  - [ ] `supervision_requests`: index on `academician_id`
  - [ ] `supervision_requests`: composite index on `['student_id', 'status']`
  - [ ] `supervision_relationships`: composite index on `['academician_id', 'role', 'status']`
  - [ ] `supervision_relationship_unbind_requests`: index on `cooldown_until`

- [ ] **Implement Race Condition Protection**
  - [ ] File: `UnbindRequestService.php:22`
  - [ ] Use `lockForUpdate()` when checking for existing unbind requests
  - [ ] Prevent concurrent unbind requests from both parties

- [ ] **Complete Relationship Termination Cleanup**
  - [ ] File: `UnbindRequestService.php:243`
  - [ ] Archive ScholarLab workspace
  - [ ] Cancel pending meetings
  - [ ] Create timeline event
  - [ ] Update conversation status

- [ ] **Add Co-Supervisor Duplicate Check**
  - [ ] File: `CoSupervisorService.php:50`
  - [ ] Check if academician is already any type of supervisor for this student
  - [ ] Not just main supervisor check

- [ ] **Fix N+1 Query Issues**
  - [ ] Review `SupervisionRequestResource` for missing eager loads
  - [ ] Review `SupervisionRelationshipResource` for missing eager loads
  - [ ] Add `meetings.creator` to eager load
  - [ ] Add `notes.author.user` to eager load

- [ ] **Verify API Route Protection**
  - [ ] Ensure `auth:sanctum` middleware on all supervision routes
  - [ ] File: `routes/api.php:297`

---

## 📋 MEDIUM PRIORITY - Next Sprint

- [ ] **Add Pagination**
  - [ ] `RequestController::index` - paginate(20)
  - [ ] `RelationshipController::index` - paginate(20)
  - [ ] `UnbindRequestController::index` - paginate(20)

- [ ] **Enhance File Upload Validation**
  - [ ] Add file content validation (not just mime type)
  - [ ] Consider virus scanning
  - [ ] Store file hashes
  - [ ] Add max file size to config

- [ ] **Add Rate Limiting**
  - [ ] Request submission: 5 per hour
  - [ ] Unbind initiation: 3 per day
  - [ ] Meeting scheduling: 10 per hour

- [ ] **Queue Notifications**
  - [ ] Add `->onQueue('notifications')` to all notification sends
  - [ ] Ensure queue worker is running

- [ ] **Add Comprehensive Logging**
  - [ ] Log relationship creation
  - [ ] Log relationship termination
  - [ ] Log all unbind actions
  - [ ] Log co-supervisor invitations
  - [ ] Include user_id, relationship_id in all logs

- [ ] **Localize Error Messages**
  - [ ] Replace all plain Exception messages with `__()` translations
  - [ ] File: `CoSupervisorService.php` - multiple locations
  - [ ] File: `UnbindRequestService.php` - multiple locations

- [ ] **Add Soft Deletes**
  - [ ] `supervision_requests` table
  - [ ] `supervision_relationships` table
  - [ ] `supervision_documents` table
  - [ ] Update queries to handle soft deletes

- [ ] **Improve Meeting Validation**
  - [ ] Ensure `scheduled_for` is in future
  - [ ] Prevent overlapping meetings
  - [ ] Validate time zone

---

## 💡 NICE TO HAVE - Backlog

- [ ] Implement caching for recommendations
- [ ] Add repository pattern for better testability
- [ ] Implement event sourcing for timeline
- [ ] Add GraphQL support for complex queries
- [ ] Create admin dashboard for supervision analytics
- [ ] Add email templates customization
- [ ] Implement webhook support for external integrations

---

## ✅ Progress Tracking

**Critical Issues:** 0/6 fixed  
**High Priority:** 0/9 fixed  
**Medium Priority:** 0/8 fixed

**Total Progress:** 0/23 (0%)

**Target Dates:**
- Critical issues: Complete by [DATE]
- High priority: Complete by [DATE]
- Medium priority: Complete by [DATE]

---

## 📝 Notes

- Test each fix individually
- Update tests after each change
- Document breaking changes
- Update API documentation
- Notify team of changes

---

**Last Updated:** October 10, 2025

