# Supervision Feature - Comprehensive Test Checklist

Complete manual testing checklist for the supervision relationship feature. Use this for thorough testing before deploying to production.

**Estimated Time:** 60-90 minutes for full checklist

---

## Test Accounts Setup

Before testing, ensure you have:
- [ ] 1 Student account (postgraduate)
- [ ] 2 Supervisor accounts (academicians)
- [ ] Student has supervisors in potential supervisor list

**Test Accounts:**
- Student: yitkhee0117@gmail.com / password
- Supervisor 1: ahmadnajmi.an@utm.my / password
- Supervisor 2: seahcs@utm.my / password

---

## 1. Supervision Request Submission

### 1.1 Valid Request Submission
- [ ] Login as student
- [ ] Navigate to "My Supervisor"
- [ ] Click "Request" button on a potential supervisor
- [ ] Fill in proposal title: "AI-Enhanced Educational Technology"
- [ ] Fill in motivation (min 100 characters)
- [ ] Upload proposal file (PDF/DOC)
- [ ] Check originality confirmation checkbox
- [ ] Click "Submit request"
- [ ] ✓ Verify success message appears
- [ ] ✓ Verify request appears in "Proposal Status" tab as "Pending"
- [ ] ✓ Verify request count increases (top of page)

### 1.2 Request Validation - Missing Fields
- [ ] Login as student
- [ ] Try to submit request without proposal title
- [ ] ✓ Verify error message shown
- [ ] Try to submit without motivation
- [ ] ✓ Verify error message shown
- [ ] Try to submit without proposal file
- [ ] ✓ Verify submit button disabled
- [ ] Try to submit without checking originality box
- [ ] ✓ Verify submit button disabled

### 1.3 Request Limit Enforcement (Max 5 Pending)
- [ ] Login as student
- [ ] Send requests to 5 different supervisors
- [ ] ✓ Verify all 5 are sent successfully
- [ ] Try to send 6th request
- [ ] ✓ Verify error: "Maximum 5 pending requests reached"
- [ ] ✓ Verify request button disabled for new supervisors

### 1.4 Duplicate Request Prevention
- [ ] Login as student
- [ ] Send request to Supervisor 1
- [ ] Try to send another request to Supervisor 1
- [ ] ✓ Verify error: "You already have a pending request with this supervisor"
- [ ] ✓ Verify request button disabled for that supervisor

### 1.5 Supervisor Receives Notification
- [ ] After student sends request
- [ ] Login as Supervisor 1
- [ ] ✓ Verify notification badge shows new notification
- [ ] Click notifications
- [ ] ✓ Verify "New supervision request from [Student Name]" notification
- [ ] Navigate to "Supervisor" page
- [ ] ✓ Verify request appears in requests tab

---

## 2. Supervisor Reviews & Responds to Request

### 2.1 View Request Details
- [ ] Login as Supervisor 1
- [ ] Navigate to "Supervisor" page → "Requests" tab
- [ ] Click on student's request
- [ ] ✓ Verify proposal title is displayed
- [ ] ✓ Verify motivation text is displayed
- [ ] ✓ Verify student profile information shown
- [ ] ✓ Verify "Download Proposal" button works
- [ ] ✓ Verify attachments are downloadable

### 2.2 Accept Request (Send Offer)
- [ ] Login as Supervisor 1
- [ ] View student's request
- [ ] Click "Accept Request" button
- [ ] Fill offer details:
  - Role: Main Supervisor
  - Start Date: [future date]
  - Cohort: Fall 2025
  - Meeting Cadence: Weekly
  - Message: "I'm pleased to accept..."
- [ ] Click "Send Offer"
- [ ] ✓ Verify success message appears
- [ ] ✓ Verify request status changes to "Awaiting Student Response"
- [ ] ✓ Verify offer details saved correctly

### 2.3 Student Receives Offer Notification
- [ ] After supervisor sends offer
- [ ] Login as student
- [ ] ✓ Verify notification: "Supervisor accepted your request"
- [ ] Navigate to "My Supervisor" → "Proposal Status"
- [ ] ✓ Verify request shows "Offer Received" status
- [ ] Click on request
- [ ] ✓ Verify offer details displayed
- [ ] ✓ Verify "Accept Offer" and "Reject Offer" buttons visible

### 2.4 Reject Request
- [ ] Login as supervisor
- [ ] View a different student's request
- [ ] Click "Reject Request"
- [ ] Enter rejection reason: "Research interests don't align"
- [ ] Click "Confirm Rejection"
- [ ] ✓ Verify request status changes to "Rejected"
- [ ] Login as student
- [ ] ✓ Verify notification: "Your request was declined"
- [ ] ✓ Verify request shows "Rejected" status with reason

---

## 3. Student Responds to Offer

### 3.1 Accept Offer (Establish Relationship)
- [ ] Login as student
- [ ] Navigate to request with offer
- [ ] Click "Accept Offer"
- [ ] Confirm acceptance
- [ ] ✓ Verify success message
- [ ] ✓ Verify redirected to "Manage Supervisor" tab
- [ ] ✓ Verify supervisor appears as "Active Supervisor"
- [ ] ✓ Verify relationship status is "Active"
- [ ] ✓ Verify "Proposal Status" tab shows "Accepted"

### 3.2 Other Pending Requests Auto-Cancelled
- [ ] After accepting one offer
- [ ] Check "Proposal Status" tab
- [ ] ✓ Verify all other pending requests show "Auto-cancelled"
- [ ] ✓ Verify only accepted relationship is active

### 3.3 Supervisor Notified of Acceptance
- [ ] Login as Supervisor 1
- [ ] ✓ Verify notification: "Student accepted your offer"
- [ ] Navigate to "Supervisor" → "Students" tab
- [ ] ✓ Verify student appears in active students list
- [ ] ✓ Verify relationship status is "Active"

### 3.4 ScholarLab Workspace Created
- [ ] After relationship established
- [ ] Login as student
- [ ] Navigate to "Scholar Lab"
- [ ] ✓ Verify workspace for supervision exists
- [ ] ✓ Verify supervisor has access to workspace
- [ ] Login as supervisor
- [ ] Navigate to "Scholar Lab"
- [ ] ✓ Verify student's workspace is visible
- [ ] ✓ Verify can access workspace

### 3.5 Reject Offer
- [ ] Setup: Send new request and get offer from Supervisor 2
- [ ] Login as student (with no active supervisor)
- [ ] View offer from Supervisor 2
- [ ] Click "Reject Offer"
- [ ] Enter reason: "Decided to pursue different research direction"
- [ ] Confirm rejection
- [ ] ✓ Verify request status changes to "Declined"
- [ ] Login as Supervisor 2
- [ ] ✓ Verify notification: "Student declined your offer"
- [ ] ✓ Verify request shows as declined with reason

---

## 4. Meeting Scheduling

### 4.1 Supervisor Schedules Meeting (During Request Phase)
- [ ] Login as supervisor
- [ ] View pending request (before sending offer)
- [ ] Click "Schedule Meeting"
- [ ] Fill meeting details:
  - Title: "Initial Discussion"
  - Date/Time: [future date]
  - Location: "Office 101" or Zoom link
  - Agenda: "Discuss research proposal"
- [ ] Click "Schedule"
- [ ] ✓ Verify meeting created
- [ ] ✓ Verify appears in upcoming meetings
- [ ] Login as student
- [ ] ✓ Verify notification: "Meeting scheduled"
- [ ] ✓ Verify meeting appears in calendar/meetings list

### 4.2 Schedule Meeting (During Active Relationship)
- [ ] Login as supervisor with active relationship
- [ ] Navigate to student's profile
- [ ] Click "Schedule Meeting"
- [ ] Fill meeting details
- [ ] Click "Schedule"
- [ ] ✓ Verify meeting created
- [ ] ✓ Verify both parties see meeting

### 4.3 Update Meeting
- [ ] Login as meeting creator (supervisor)
- [ ] Click on scheduled meeting
- [ ] Click "Edit"
- [ ] Change time/location
- [ ] Click "Update"
- [ ] ✓ Verify changes saved
- [ ] Login as other party (student)
- [ ] ✓ Verify notification: "Meeting updated"
- [ ] ✓ Verify new details displayed

### 4.4 Cancel Meeting
- [ ] Login as meeting creator
- [ ] Click on scheduled meeting
- [ ] Click "Cancel Meeting"
- [ ] Confirm cancellation
- [ ] ✓ Verify meeting marked as cancelled
- [ ] Login as other party
- [ ] ✓ Verify notification: "Meeting cancelled"
- [ ] ✓ Verify meeting shows as cancelled

---

## 5. Active Relationship Management

### 5.1 View Relationship Details
- [ ] Login as student with active supervisor
- [ ] Navigate to "Manage Supervisor" tab
- [ ] Click on supervisor card
- [ ] ✓ Verify relationship details modal opens
- [ ] ✓ Verify supervisor information displayed
- [ ] ✓ Verify timeline of events shown
- [ ] ✓ Verify tabs: Overview, Meetings, Documents, Research

### 5.2 Messaging Between Parties
- [ ] Login as student
- [ ] Open relationship details
- [ ] Click "Message Supervisor" or similar
- [ ] Send a message
- [ ] ✓ Verify message sent
- [ ] Login as supervisor
- [ ] ✓ Verify notification received
- [ ] ✓ Verify can reply to message
- [ ] ✓ Verify conversation thread works

### 5.3 Upload Document
- [ ] Login as student
- [ ] Navigate to relationship → "Documents" tab
- [ ] Click "Upload Document"
- [ ] Select file (PDF)
- [ ] Add document title and description
- [ ] Click "Upload"
- [ ] ✓ Verify document uploaded
- [ ] ✓ Verify appears in documents list
- [ ] Login as supervisor
- [ ] ✓ Verify notification: "New document uploaded"
- [ ] ✓ Verify can download document

### 5.4 Update Research Progress
- [ ] Login as student
- [ ] Navigate to relationship → "Research" tab
- [ ] Click "Update Progress"
- [ ] Add milestone/progress note
- [ ] Click "Save"
- [ ] ✓ Verify progress saved
- [ ] Login as supervisor
- [ ] ✓ Verify notification: "Research progress updated"
- [ ] ✓ Verify can view progress

---

## 6. Unbind Workflow (Relationship Termination)

### 6.1 Student Initiates Unbind - Attempt 1 (Rejected)
- [ ] Login as student with active relationship
- [ ] Click "Request to Terminate Relationship"
- [ ] Select reason: "Research interests changed"
- [ ] Add detailed explanation
- [ ] Click "Submit Request"
- [ ] ✓ Verify unbind request created
- [ ] ✓ Verify status shows "Pending Supervisor Approval"
- [ ] Login as supervisor
- [ ] ✓ Verify notification: "Student requested to unbind"
- [ ] View unbind request details
- [ ] Click "Reject"
- [ ] Enter reason: "Let's discuss this first"
- [ ] Click "Confirm Rejection"
- [ ] ✓ Verify unbind request rejected
- [ ] ✓ Verify relationship remains "Active"
- [ ] Login as student
- [ ] ✓ Verify notification: "Unbind request rejected"
- [ ] ✓ Verify cooldown message: "Must wait 7 days before next attempt"

### 6.2 Cooldown Enforcement
- [ ] Immediately after rejection
- [ ] Login as student
- [ ] Try to initiate unbind again
- [ ] ✓ Verify error: "Must wait until [date] before requesting again"
- [ ] ✓ Verify button disabled or hidden

### 6.3 Student Initiates Unbind - Attempt 2 (Rejected)
- [ ] Wait for cooldown period to expire (or manually update database)
- [ ] Login as student
- [ ] Click "Request to Terminate Relationship" again
- [ ] Fill reason
- [ ] Click "Submit"
- [ ] ✓ Verify second attempt allowed
- [ ] Login as supervisor
- [ ] Reject again
- [ ] ✓ Verify relationship still active
- [ ] ✓ Verify attempt counter = 2

### 6.4 Student Initiates Unbind - Attempt 3 (Force Unbind)
- [ ] Wait for cooldown to expire
- [ ] Login as student
- [ ] Click "Request to Terminate Relationship" (3rd time)
- [ ] Fill reason
- [ ] Click "Submit"
- [ ] ✓ Verify message: "This is your final attempt. If rejected, relationship will automatically terminate."
- [ ] Login as supervisor
- [ ] Reject again
- [ ] ✓ Verify relationship automatically terminated (Force Unbind)
- [ ] ✓ Verify relationship status: "Terminated"
- [ ] Login as student
- [ ] ✓ Verify notification: "Relationship terminated after 3 attempts"
- [ ] ✓ Verify no longer appears in active supervisors
- [ ] ✓ Verify appears in history with "Terminated" status

### 6.5 Supervisor Initiates Unbind (Approved by Student)
- [ ] Setup: Establish new relationship
- [ ] Login as supervisor
- [ ] Navigate to student's profile
- [ ] Click "Terminate Relationship"
- [ ] Select reason: "Student not responsive"
- [ ] Add explanation
- [ ] Click "Submit Request"
- [ ] ✓ Verify unbind request created
- [ ] Login as student
- [ ] ✓ Verify notification: "Supervisor requested to unbind"
- [ ] View unbind request
- [ ] Click "Approve"
- [ ] Confirm approval
- [ ] ✓ Verify relationship terminated immediately
- [ ] ✓ Verify relationship status: "Terminated"
- [ ] Login as supervisor
- [ ] ✓ Verify notification: "Student approved unbind request"
- [ ] ✓ Verify relationship no longer in active students

### 6.6 Post-Unbind State
- [ ] After relationship terminated
- [ ] Login as student
- [ ] ✓ Verify can send new supervision requests
- [ ] ✓ Verify request counter reset to 0
- [ ] Navigate to ScholarLab
- [ ] ✓ Verify workspace access status (depending on business rules)
- [ ] Login as supervisor
- [ ] ✓ Verify student no longer in active students
- [ ] ✓ Verify student appears in history/past relationships

---

## 7. Co-Supervisor Workflow

### 7.1 Main Supervisor Invites Co-Supervisor
- [ ] Login as Main Supervisor (Supervisor 1)
- [ ] Navigate to active student
- [ ] Click "Invite Co-Supervisor"
- [ ] Search and select Supervisor 2
- [ ] Add message: "Would you like to co-supervise this student?"
- [ ] Click "Send Invitation"
- [ ] ✓ Verify invitation sent
- [ ] ✓ Verify pending invitation shown
- [ ] Login as Supervisor 2
- [ ] ✓ Verify notification: "Co-supervisor invitation received"

### 7.2 Co-Supervisor Accepts Invitation
- [ ] Login as Supervisor 2
- [ ] View co-supervisor invitation
- [ ] Click "Accept"
- [ ] ✓ Verify invitation accepted
- [ ] ✓ Verify status: "Awaiting Student Approval"
- [ ] Login as student
- [ ] ✓ Verify notification: "Supervisor 2 accepted co-supervisor role"
- [ ] ✓ Verify pending co-supervisor approval shown

### 7.3 Student Approves Co-Supervisor
- [ ] Login as student
- [ ] View pending co-supervisor approval
- [ ] Review Supervisor 2's profile
- [ ] Click "Approve Co-Supervisor"
- [ ] Confirm approval
- [ ] ✓ Verify co-supervisor relationship created
- [ ] ✓ Verify both supervisors shown in "Manage Supervisor"
- [ ] ✓ Verify Supervisor 1 labeled as "Main Supervisor"
- [ ] ✓ Verify Supervisor 2 labeled as "Co-Supervisor"
- [ ] Login as Supervisor 2
- [ ] ✓ Verify notification: "Student approved your co-supervisor role"
- [ ] Navigate to "Supervisor" → "Students"
- [ ] ✓ Verify student appears in active students
- [ ] ✓ Verify role shown as "Co-Supervisor"

### 7.4 Co-Supervisor Permissions
- [ ] Login as Supervisor 2 (co-supervisor)
- [ ] Navigate to student's profile
- [ ] ✓ Verify can view student details
- [ ] ✓ Verify can schedule meetings
- [ ] ✓ Verify can view documents
- [ ] ✓ Verify can view research progress
- [ ] ✓ Verify can send messages
- [ ] Try to invite another co-supervisor
- [ ] ✓ Verify "Invite Co-Supervisor" button NOT visible
- [ ] Try to terminate relationship
- [ ] ✓ Verify "Terminate Relationship" button NOT visible or disabled

### 7.5 Student Rejects Co-Supervisor
- [ ] Setup: Main supervisor invites new co-supervisor
- [ ] Co-supervisor accepts invitation
- [ ] Login as student
- [ ] View pending co-supervisor approval
- [ ] Click "Reject"
- [ ] Enter reason: "Prefer to work with single supervisor"
- [ ] Confirm rejection
- [ ] ✓ Verify co-supervisor invitation rejected
- [ ] ✓ Verify invited supervisor notified
- [ ] ✓ Verify co-supervisor relationship NOT created
- [ ] Login as invited supervisor
- [ ] ✓ Verify notification: "Student declined co-supervisor role"

### 7.6 Co-Supervisor Rejects Invitation
- [ ] Setup: Main supervisor sends co-supervisor invitation
- [ ] Login as invited supervisor
- [ ] View invitation
- [ ] Click "Reject"
- [ ] Enter reason: "Too many students already"
- [ ] Confirm rejection
- [ ] ✓ Verify invitation rejected
- [ ] Login as main supervisor
- [ ] ✓ Verify notification: "Supervisor declined co-supervisor invitation"
- [ ] ✓ Verify invitation shown as "Declined"

---

## 8. Edge Cases & Error Handling

### 8.1 Concurrent Actions
- [ ] Open two browser tabs
- [ ] Login as student in Tab 1
- [ ] Login as supervisor in Tab 2
- [ ] Student sends request (Tab 1)
- [ ] Supervisor immediately rejects (Tab 2)
- [ ] ✓ Verify no errors occur
- [ ] ✓ Verify state is consistent across tabs

### 8.2 Network Interruption
- [ ] Start submitting a request
- [ ] Disconnect internet during submission
- [ ] ✓ Verify appropriate error message
- [ ] Reconnect internet
- [ ] Retry submission
- [ ] ✓ Verify works correctly
- [ ] ✓ Verify no duplicate requests created

### 8.3 Permission Boundaries
- [ ] Login as student
- [ ] Try to access `/supervisor` URL directly
- [ ] ✓ Verify redirected or access denied
- [ ] Login as academician (no active students)
- [ ] Try to access `/my-supervisor` URL
- [ ] ✓ Verify appropriate message or redirect

### 8.4 Large File Upload
- [ ] Try to upload file > 10MB
- [ ] ✓ Verify error: "File too large"
- [ ] Try to upload unsupported file type (e.g., .exe)
- [ ] ✓ Verify error: "File type not allowed"

### 8.5 Special Characters in Text Fields
- [ ] Enter special characters in motivation: `<script>alert('test')</script>`
- [ ] Submit request
- [ ] ✓ Verify text is properly escaped (no XSS)
- [ ] ✓ Verify displayed safely

---

## 9. Notifications Testing

### 9.1 All Notification Types Delivered
- [ ] Request submitted → Supervisor notified
- [ ] Request accepted → Student notified
- [ ] Request rejected → Student notified
- [ ] Offer accepted → Supervisor notified
- [ ] Offer rejected → Supervisor notified
- [ ] Meeting scheduled → Both parties notified
- [ ] Meeting updated → Both parties notified
- [ ] Meeting cancelled → Both parties notified
- [ ] Document uploaded → Other party notified
- [ ] Research updated → Supervisor notified
- [ ] Unbind requested → Other party notified
- [ ] Unbind approved/rejected → Both parties notified
- [ ] Co-supervisor invited → Invited supervisor notified
- [ ] Co-supervisor accepted → Student & main supervisor notified
- [ ] Student approved co-supervisor → All parties notified

### 9.2 Email Notifications (If Enabled)
- [ ] Check email inbox after each major action
- [ ] ✓ Verify email sent
- [ ] ✓ Verify email content correct
- [ ] ✓ Verify links in email work

---

## 10. UI/UX Testing

### 10.1 Responsive Design
- [ ] Test on desktop (1920x1080)
- [ ] ✓ Verify layout looks good
- [ ] Test on tablet (768px)
- [ ] ✓ Verify layout adapts correctly
- [ ] Test on mobile (375px)
- [ ] ✓ Verify all functions accessible

### 10.2 Loading States
- [ ] Submit request
- [ ] ✓ Verify loading spinner shown during submission
- [ ] ✓ Verify button disabled during loading
- [ ] Upload large file
- [ ] ✓ Verify progress indicator shown

### 10.3 Error Messages
- [ ] Trigger various validation errors
- [ ] ✓ Verify error messages are clear and helpful
- [ ] ✓ Verify errors appear near relevant fields
- [ ] ✓ Verify can dismiss errors

### 10.4 Success Messages
- [ ] Complete successful actions
- [ ] ✓ Verify success messages shown
- [ ] ✓ Verify auto-dismiss after few seconds
- [ ] ✓ Verify appropriate feedback for each action

---

## 11. Data Integrity

### 11.1 Timeline Events
- [ ] Perform various actions (request, accept, unbind, etc.)
- [ ] Check relationship timeline
- [ ] ✓ Verify all major events recorded
- [ ] ✓ Verify timestamps correct
- [ ] ✓ Verify event descriptions clear

### 11.2 Database Consistency
After testing, check database:
```sql
-- Check relationships match requests
SELECT sr.id, sr.status, rel.id as rel_id, rel.status as rel_status
FROM supervision_requests sr
LEFT JOIN supervision_relationships rel ON sr.id = rel.request_id;

-- Check co-supervisor relationships
SELECT * FROM supervision_relationships 
WHERE student_id = [test_student_id];

-- Check unbind attempts
SELECT * FROM supervision_relationship_unbind_requests
WHERE relationship_id = [test_relationship_id]
ORDER BY created_at DESC;
```

- [ ] ✓ Verify data is consistent
- [ ] ✓ Verify no orphaned records
- [ ] ✓ Verify foreign keys intact

---

## Test Results Summary

**Date:** _______________
**Tester:** _______________
**Version/Branch:** _______________

### Statistics
- Total Tests: _____ 
- Passed: _____ ✓
- Failed: _____ ✗
- Skipped: _____

### Critical Issues Found
1. _____________________
2. _____________________
3. _____________________

### Recommendations
1. _____________________
2. _____________________
3. _____________________

### Sign-off
- [ ] All critical issues resolved
- [ ] Ready for deployment
- [ ] Requires additional testing

**Approved by:** _______________
**Date:** _______________

