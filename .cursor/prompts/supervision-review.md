# Supervision Feature Code Review Prompt

Specialized code review checklist for supervision relationship feature changes.

## How to Use

When making changes to the supervision feature specifically, use this prompt in addition to the general code review prompt for deeper domain-specific validation.

---

## Prompt Template

```
Please review my supervision feature code changes for:

### State Transition Validation

**Request States:** pending → accepted/rejected/auto_cancelled/cancelled/pending_student_acceptance
- Can students cancel pending requests?
- Can supervisors reject pending requests?
- Are auto-cancellations triggered correctly?
- Can accepted offers be cancelled?

**Relationship States:** active → completed/terminated
- Who can initiate unbind? (both student and supervisor)
- Are cooldown periods enforced (7 days)?
- Is force unbind available after 3 rejected attempts?
- Does termination cleanup all related data?

**Co-Supervisor States:** invited → accepted/rejected → approved/rejected by student
- Can only main supervisor invite co-supervisors?
- Does student get approval rights?
- Are permissions correct for co-supervisors?

### Business Logic Rules

**Request Limits:**
- Maximum 5 pending requests per student
- No duplicate requests to same supervisor
- Auto-cancel other requests when one accepted?

**Relationship Rules:**
- Only 1 main supervisor per student
- Multiple co-supervisors allowed?
- Co-supervisor can't invite other co-supervisors
- Main supervisor can't be co-supervisor for same student

**Unbind Rules:**
- 7-day cooldown between attempts
- Maximum 3 attempts before force unbind
- Does counter reset after approval?
- Both parties can initiate unbind

**Meeting Rules:**
- Can schedule during request phase?
- Can schedule during active relationship?
- Who can create/update/cancel meetings?
- Required fields validated?

### Notification Triggers

Check if notifications are sent for:
- New request received (to supervisor)
- Request accepted/offer sent (to student)
- Request rejected (to student)
- Offer accepted (to supervisor)
- Offer rejected (to supervisor)
- Unbind request initiated (to other party)
- Unbind approved/rejected (to both parties)
- Co-supervisor invited (to invited supervisor)
- Co-supervisor accepted (to main supervisor)
- Co-supervisor approved by student (to all supervisors)
- Meeting scheduled/updated/cancelled (to both parties)
- Document uploaded (to both parties)
- Research milestone completed (to both parties)

### Relationship Integrity

**Main vs Co-Supervisor:**
- Are permissions different?
- Can co-supervisor terminate relationship?
- Can co-supervisor invite others?
- Do both see same student data?
- Are roles clearly indicated in UI?

**Data Consistency:**
- Does relationship have conversation?
- Are timeline events created for all actions?
- Do documents have proper ownership?
- Are meetings linked to correct relationship?

### Edge Cases

- What if supervisor deletes account during active relationship?
- What if student deletes account with pending requests?
- Concurrent unbind requests from both parties?
- Co-supervisor invitation while unbind pending?
- Request sent to supervisor who's already co-supervisor?
- Multiple tabs/windows editing same data?
- Network failure during state transition?

### Database Operations

- Are foreign key constraints enforced?
- Cascade deletes configured correctly?
- Indexes on relationship_id, student_id, academician_id?
- Are transactions used for multi-step operations?
- Soft deletes where appropriate?

### ScholarLab Integration

- Does supervision relationship auto-create ScholarLab workspace?
- Are supervisor permissions set correctly in ScholarLab?
- What happens to ScholarLab when relationship unbinds?
- Are co-supervisors added to ScholarLab?

### API & Frontend Consistency

- Does API return proper relationship data?
- Are all states handled in frontend?
- Do modals close properly after actions?
- Are loading states shown during async operations?
- Error messages user-friendly?
- Optimistic UI updates safe?

---

Please identify:
1. Business logic violations
2. Missing state validations
3. Notification gaps
4. Permission issues
5. Edge cases not handled
```

---

## Supervision Feature Checklist

### For Request Changes
- [ ] Request limit (5 pending) enforced
- [ ] Duplicate detection works
- [ ] Attachments uploaded/downloaded correctly
- [ ] Conversation created automatically
- [ ] Student can cancel before accepted
- [ ] Supervisor can view proposal/attachments
- [ ] Timeline events created

### For Acceptance/Offer Changes
- [ ] Only pending requests can be accepted
- [ ] Other pending requests auto-cancelled
- [ ] Student receives notification
- [ ] Offer expiry date set (7 days default)
- [ ] Can't have 2 main supervisors
- [ ] Conversation updated with offer
- [ ] ScholarLab workspace created

### For Unbind Changes
- [ ] Cooldown period enforced
- [ ] Attempt counter incremented
- [ ] Force unbind available after 3 attempts
- [ ] Both parties notified
- [ ] Relationship status updated
- [ ] Timeline event created
- [ ] ScholarLab permissions updated

### For Co-Supervisor Changes
- [ ] Only main supervisor can invite
- [ ] Student approval required
- [ ] Co-supervisor can't invite others
- [ ] Co-supervisor can't terminate relationship
- [ ] All supervisors see student data
- [ ] Notifications to all parties
- [ ] ScholarLab access granted

### For Meeting Changes
- [ ] Can schedule during request phase
- [ ] Can schedule during active relationship
- [ ] Both parties notified
- [ ] Can update/cancel own meetings
- [ ] Required fields validated
- [ ] Timeline event created

### For Document Changes
- [ ] File type/size validation
- [ ] Only relationship parties can upload
- [ ] Version control works
- [ ] Can revert to previous version
- [ ] Download permissions correct
- [ ] Timeline event created

## Common Supervision Bugs

1. **Forgetting to auto-cancel other requests** when one is accepted
2. **Not checking relationship exists** before allowing meeting/document actions
3. **Co-supervisor getting main supervisor permissions** 
4. **Cooldown period calculated incorrectly** (using created_at instead of updated_at)
5. **Force unbind counter not resetting** after approval
6. **Notifications not sent to all parties** (especially co-supervisors)
7. **ScholarLab workspace not created** or permissions wrong
8. **Timeline events missing** for important actions
9. **State transitions allowing invalid paths** (e.g., rejected → accepted)
10. **Concurrent request handling** causing duplicate relationships

