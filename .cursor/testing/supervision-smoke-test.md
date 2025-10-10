# Supervision Feature - Quick Smoke Test

Essential 10-minute checklist for quick regression testing. Use this before deploying to production or after making changes to ensure core functionality still works.

**Time Estimate:** 10-15 minutes

---

## Prerequisites

**Test Accounts:**
- Student: yitkhee0117@gmail.com / password
- Supervisor: ahmadnajmi.an@utm.my / password

---

## Critical Path Tests

### 1. Request Submission (2 min)
- [ ] Login as student
- [ ] Navigate to "My Supervisor"
- [ ] Click "Request" on a potential supervisor
- [ ] Fill form (title, motivation, upload file, check box)
- [ ] Submit
- [ ] ✓ Success message appears
- [ ] ✓ Request shows in "Proposal Status" as pending

### 2. Supervisor Accepts Request (2 min)
- [ ] Login as supervisor
- [ ] Go to "Supervisor" page
- [ ] ✓ See new request from student
- [ ] Click request, view details
- [ ] Click "Accept Request"
- [ ] Fill offer details (role, date, message)
- [ ] Send offer
- [ ] ✓ Request status changes to "Awaiting Student Response"

### 3. Student Accepts Offer (2 min)
- [ ] Login as student
- [ ] Go to "My Supervisor" → "Proposal Status"
- [ ] ✓ See offer from supervisor
- [ ] Click request, view offer details
- [ ] Click "Accept Offer"
- [ ] Confirm acceptance
- [ ] ✓ Redirected to "Manage Supervisor" tab
- [ ] ✓ Supervisor appears as "Active Supervisor"
- [ ] ✓ Relationship status is "Active"

### 4. Meeting Scheduling (1 min)
- [ ] Still logged in as student (or supervisor)
- [ ] Open active relationship
- [ ] Click "Schedule Meeting"
- [ ] Fill meeting details (title, date, location)
- [ ] Click "Schedule"
- [ ] ✓ Meeting created successfully
- [ ] ✓ Appears in upcoming meetings

### 5. Unbind Request (2 min)
- [ ] Login as student (with active relationship)
- [ ] Navigate to active supervisor
- [ ] Click "Request to Terminate Relationship"
- [ ] Select reason, add explanation
- [ ] Submit request
- [ ] ✓ Unbind request created
- [ ] ✓ Status shows "Pending Approval"
- [ ] Login as supervisor
- [ ] ✓ See unbind request notification
- [ ] View request, click "Approve"
- [ ] ✓ Relationship terminated
- [ ] ✓ No longer in active students

### 6. Co-Supervisor Invitation (3 min)
- [ ] Setup: Establish new relationship (or use existing)
- [ ] Login as main supervisor
- [ ] Navigate to student
- [ ] Click "Invite Co-Supervisor"
- [ ] Select another supervisor
- [ ] Send invitation
- [ ] ✓ Invitation sent
- [ ] Login as invited supervisor
- [ ] ✓ See invitation notification
- [ ] Accept invitation
- [ ] ✓ Status: "Awaiting Student Approval"
- [ ] Login as student
- [ ] Approve co-supervisor
- [ ] ✓ Both supervisors appear in "Manage Supervisor"
- [ ] ✓ Roles clearly labeled (Main/Co-Supervisor)

---

## Quick Validation Checks

### Notifications (30 sec)
- [ ] ✓ All parties received appropriate notifications
- [ ] ✓ Notification count badges update correctly
- [ ] ✓ Notifications have correct content

### Data Persistence (30 sec)
- [ ] Refresh page
- [ ] ✓ All data still displayed correctly
- [ ] Close browser, reopen
- [ ] ✓ Session maintained
- [ ] ✓ All changes persisted

### Permission Check (30 sec)
- [ ] Login as student
- [ ] Try accessing /supervisor URL directly
- [ ] ✓ Access denied or redirected
- [ ] Login as supervisor
- [ ] Try accessing student-specific pages
- [ ] ✓ Appropriate handling

---

## Pass/Fail Criteria

### ✅ PASS if:
- All 6 critical path tests complete successfully
- No errors or crashes encountered
- Notifications delivered correctly
- Data persists across page reloads
- Basic permissions working

### ❌ FAIL if:
- Any critical path test fails
- JavaScript errors in console
- Data loss after page reload
- Notifications not delivered
- Permission boundaries broken
- Any user-facing errors

---

## Quick Fixes for Common Issues

### If request submission fails:
1. Check file upload size/type
2. Check originality checkbox is checked
3. Check all required fields filled
4. Check console for JS errors

### If notifications don't appear:
1. Refresh page
2. Check notification settings
3. Check database for notification record
4. Check Laravel queue is running

### If relationship not created:
1. Check if other pending requests auto-cancelled
2. Check database for relationship record
3. Check console/network tab for errors
4. Check ScholarLab workspace creation

---

## After Smoke Test

### If All Tests Pass ✅
- [ ] Proceed with deployment
- [ ] Update test log with results
- [ ] Note any minor issues for later

### If Any Test Fails ❌
- [ ] Do NOT deploy
- [ ] Document the failure
- [ ] Debug the issue
- [ ] Fix and re-run smoke test
- [ ] Run full test checklist if needed

---

## Smoke Test Log

| Date | Tester | Result | Issues Found | Notes |
|------|--------|--------|--------------|-------|
| _____ | _____ | ⬜ Pass / ⬜ Fail | _____ | _____ |
| _____ | _____ | ⬜ Pass / ⬜ Fail | _____ | _____ |
| _____ | _____ | ⬜ Pass / ⬜ Fail | _____ | _____ |

---

## When to Run This Test

✅ **Always run before:**
- Deploying to production
- Merging feature branch to master
- After fixing critical bugs
- After making changes to supervision feature

✅ **Optionally run after:**
- Making changes to auth/permissions
- Updating dependencies
- Database migrations
- Major refactoring

---

## Next Steps

**If smoke test passes:**
- Ready to deploy ✅
- Update changelog
- Deploy to production
- Monitor for issues

**If smoke test reveals issues:**
- Run full test checklist to identify all problems
- Fix issues
- Re-run smoke test
- Only deploy when all clear

**For major releases:**
- Run smoke test first
- Then run full comprehensive test checklist
- Get stakeholder sign-off
- Then deploy

