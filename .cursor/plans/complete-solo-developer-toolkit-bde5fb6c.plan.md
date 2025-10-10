<!-- bde5fb6c-1b16-48d9-9c7e-cb981de22211 17368266-98e4-4bda-acb5-e8ab87c63ad4 -->
# Complete Solo Developer Toolkit - Implementation Plan

## What This Toolkit Will Do

### 1. **Automated Browser Testing**

Replace your manual frontend testing with AI-powered browser automation that:

- Creates and manages multiple test user accounts automatically
- Simulates real user interactions (click, type, submit forms)
- Tests complete user journeys across different user types (students, academicians)
- Takes screenshots on failures for debugging
- Runs in minutes instead of hours of manual testing

### 2. **Multi-User Test Scenarios**

Handle complex features like your supervision system that requires:

- Multiple user accounts (students, academicians, admins)
- Complex workflows (request → accept → schedule meeting → unbind)
- Different user perspectives of the same data
- Real-time interactions and notifications

### 3. **AI-Powered Code Review**

Automated code quality checks that catch:

- Security vulnerabilities (SQL injection, XSS, CSRF)
- Logic bugs and edge cases
- Performance issues
- Best practice violations
- Missing error handling

### 4. **CI/CD Pipeline**

Automatic testing on every code change:

- Runs all tests automatically when you push code
- Blocks deployment if tests fail
- Provides detailed reports
- No manual intervention needed

### 5. **Test Data Management**

Automated test database setup:

- Creates fresh test users before each test
- Seeds realistic test data
- Cleans up after tests
- Resets database state

### 6. **Error Monitoring**

Production-ready monitoring:

- Catches errors in production
- Sends alerts when things break
- Provides detailed error context
- Helps fix issues quickly

---

## Supervision Feature Testing Strategy

### **Hybrid Approach: Manual Setup + Automated Testing**

The supervision feature has complex prerequisites (AI Matching, Program Recommendations) that are not part of the core feature being tested. We use a pragmatic approach:

#### **Phase A: Manual Data Setup (One-Time, 5-10 minutes)**

Developer manually ensures:
```
✅ Test student account exists with proper program
✅ Test academician accounts exist with complete profiles
✅ Academicians are in student's potential supervisor list
✅ Academicians have selected their programs (for recommendations)
✅ Basic data integrity verified

This is done ONCE and then reused for all tests.
```

**Accounts Used:**
- Student: `yitkhee0117@gmail.com` / `password`
- Academician 1: `ahmadnajmi.an@utm.my` / `password`
- Academician 2: `seahcs@utm.my` / `password`

**Why Manual Setup?**
- AI Matching requires Qdrant vector database setup
- Program Recommendations require complex academician-program relationships
- These are NOT the core supervision feature being tested
- Manual setup is faster and more reliable than automating complex prerequisites

#### **Phase B: Automated Testing (Repeatable, 5-10 minutes)**

Starting from "Potential Supervisor List," automated tests cover:

### **Current Manual Testing Process (What you do now):**

```
😫 Time: 30-45 minutes per test cycle

Starting from potential supervisor list:
1. Login as student manually
2. Navigate to potential supervisors
3. Select supervisor
4. Fill supervision request form
5. Upload documents
6. Submit request
7. Logout, login as academician
8. Check notifications
9. Review request
10. Accept/reject manually
11. Logout, login as student
12. Check offer notification
13. Accept/reject offer
14. Verify relationship created
15. Schedule meeting as supervisor
16. Verify student sees meeting
17. Test unbind workflow
... and so on

Problem: Need to repeat for EVERY scenario:
- Student accepts offer
- Student rejects offer
- Supervisor rejects request
- Student cancels request
- Meeting scheduling/updates
- Unbind requests (3 attempts with cooldown)
- Co-supervisor invitations
- Edge cases (5 request limit, etc.)
```

### **Automated Testing Process (What you'll have):**

```
✅ Time: 5-10 minutes total (all scenarios)

# Single command runs EVERYTHING:
npm run test:supervision

Running 25+ supervision test scenarios:
✅ Student can send supervision request (8s)
✅ Supervisor receives notification (3s)
✅ Supervisor can accept request (7s)
✅ Student receives offer notification (3s)
✅ Student can accept offer (6s)
✅ ScholarLab workspace auto-created (5s)
✅ Supervisor can schedule meeting (6s)
✅ Both parties receive meeting notifications (4s)
✅ Meeting reminders sent 24h and 1h before (3s)
✅ Student can reject offer (5s)
✅ Supervisor can reject request (6s)
✅ Request limit enforced (max 5) (5s)
✅ Auto-cancel other requests on acceptance (8s)
✅ Unbind request workflow - 3 attempts (12s)
✅ Unbind cooldown enforcement (4s)
✅ Force unbind on 3rd attempt (6s)
✅ Co-supervisor invitation flow (10s)
✅ ... 10+ more scenarios

Total: 25+ tests passed in ~150 seconds
Coverage: 87% of supervision feature code

Note: Tests use real accounts with pre-configured data.
No need to set up AI Matching or Program Recommendations.
```

---

## What Gets Created

### **Testing Infrastructure**

```
tests/
├── Browser/                          # Browser automation tests
│   ├── Supervision/
│   │   ├── StudentRequestFlow.test.js
│   │   ├── SupervisorAcceptanceFlow.test.js
│   │   ├── MeetingScheduling.test.js
│   │   ├── UnbindProcess.test.js
│   │   └── EdgeCases.test.js
│   ├── Auth/
│   │   └── RegistrationLogin.test.js
│   └── helpers/
│       ├── testUsers.js             # Creates test accounts
│       ├── browserActions.js        # Reusable browser actions
│       └── assertions.js            # Custom assertions
│
├── Integration/                      # API integration tests
│   └── Supervision/
│       ├── RequestApi.test.php
│       ├── RelationshipApi.test.php
│       └── MeetingApi.test.php
│
├── Unit/                             # Unit tests
│   └── Services/
│       ├── SupervisionRequestService.test.php
│       └── SupervisionRelationshipService.test.php
│
└── Fixtures/                         # Test data
    ├── users.json
    ├── supervision_requests.json
    └── meetings.json
```

### **CI/CD Configuration**

```
.github/workflows/
├── tests.yml                         # Runs on every push
├── code-quality.yml                  # Static analysis
└── deploy.yml                        # Automated deployment

.cursor/
├── prompts/
│   ├── code-review.md               # Code review checklist
│   ├── test-generation.md           # Test generation prompts
│   └── security-audit.md            # Security check prompts
└── rules.cursorrules                # Cursor AI configuration
```

### **Testing Scripts**

```
package.json scripts:
- npm run test              → Run all tests
- npm run test:supervision  → Test supervision feature only
- npm run test:browser      → Browser tests only
- npm run test:watch        → Auto-run tests on file changes
- npm run test:coverage     → Generate coverage report
- npm run test:visual       → Visual regression testing

composer.json scripts:
- composer test             → PHPUnit tests
- composer test:unit        → Unit tests only
- composer test:integration → Integration tests only
- composer analyse          → PHPStan static analysis
```

---

## Real Example: Testing Your Supervision Feature

### **Test 1: Complete Supervision Request Flow**

This single test will:

1. Create a student account
2. Create an academician account
3. Student logs in and sends supervision request
4. Verify request appears in database
5. Verify supervisor receives notification
6. Supervisor logs in and accepts request
7. Verify student receives offer notification
8. Student accepts offer
9. Verify relationship created in database
10. Verify ScholarLab workspace auto-created
11. Verify both users have access to workspace
```javascript
// tests/Browser/Supervision/CompleteFlow.test.js
test('Complete supervision request to acceptance flow', async () => {
  // AI-generated test that handles EVERYTHING
  const student = await createTestStudent();
  const supervisor = await createTestAcademician();
  
  // Student sends request
  await loginAs(student);
  await navigateTo('/my-supervisor');
  await fillSupervisionRequest({
    supervisor: supervisor.id,
    title: 'AI-Enhanced Education Research',
    motivation: 'I want to research...',
    proposal: './fixtures/test-proposal.pdf'
  });
  await submitRequest();
  
  // Verify request created
  await expect(page).toHaveText('Request sent successfully');
  
  // Switch to supervisor
  await loginAs(supervisor);
  await expect(notificationBadge).toHaveCount(1);
  await navigateTo('/supervisor/requests');
  
  // Supervisor accepts
  await clickRequestCard(student.name);
  await clickAcceptButton();
  await fillAcceptanceForm({
    role: 'main',
    startTerm: 'Fall 2025',
    meetingCadence: 'Weekly'
  });
  await confirmAcceptance();
  
  // Verify ScholarLab workspace created
  const workspace = await getWorkspaceForRelationship(student, supervisor);
  expect(workspace).toBeTruthy();
  expect(workspace.members).toContain(student.id);
  expect(workspace.members).toContain(supervisor.id);
  
  // Switch back to student
  await loginAs(student);
  await expect(notificationBadge).toHaveCount(1);
  await expect(page).toHaveText('Supervision offer received');
  
  // Student accepts offer
  await clickOfferNotification();
  await clickAcceptOffer();
  
  // Verify relationship active
  await navigateTo('/my-supervisor');
  await expect(page).toHaveText(supervisor.name);
  await expect(page).toHaveText('Active');
});
```


### **Test 2: Meeting Scheduling & Notifications**

```javascript
test('Supervisor schedules meeting, both parties receive notifications', async () => {
  // Setup: Create active supervision relationship
  const { student, supervisor, relationship } = 
    await createActiveSupervisionRelationship();
  
  await loginAs(supervisor);
  await navigateTo('/supervisor/students');
  await clickStudentCard(student);
  await clickMeetingsTab();
  await clickScheduleMeeting();
  
  await fillMeetingForm({
    title: 'Research Progress Review',
    dateTime: '2025-10-15 14:00',
    location: 'https://meet.google.com/test',
    agenda: 'Discuss chapter 1 progress'
  });
  await submitMeeting();
  
  // Verify supervisor sees success
  await expect(page).toHaveText('Meeting scheduled successfully');
  
  // Verify student receives notification
  await loginAs(student);
  await expect(notificationBadge).toHaveCount(1);
  await openNotificationPanel();
  await expect(notificationPanel).toHaveText('Meeting scheduled');
  await expect(notificationPanel).toHaveText('Research Progress Review');
  await expect(notificationPanel).toHaveText('Oct 15, 2025 14:00');
  
  // Verify meeting appears in student's calendar
  await navigateTo('/my-supervisor');
  await clickMeetingsTab();
  await expect(meetingsList).toContainText('Research Progress Review');
});
```

### **Test 3: Edge Cases & Security**

```javascript
test('Enforces 5 pending requests limit', async () => {
  const student = await createTestStudent();
  const supervisors = await createMultipleAcademicians(6);
  
  await loginAs(student);
  
  // Send 5 requests (should succeed)
  for (let i = 0; i < 5; i++) {
    await sendSupervisionRequest(supervisors[i]);
    await expect(page).toHaveText('Request sent');
  }
  
  // Try to send 6th request (should fail)
  await sendSupervisionRequest(supervisors[5]);
  await expect(page).toHaveText('Maximum pending requests reached');
  await expect(requestButton).toBeDisabled();
});

test('Auto-cancels other requests when one accepted', async () => {
  const student = await createTestStudent();
  const supervisors = await createMultipleAcademicians(3);
  
  // Student sends 3 requests
  await loginAs(student);
  const request1 = await sendSupervisionRequest(supervisors[0]);
  const request2 = await sendSupervisionRequest(supervisors[1]);
  const request3 = await sendSupervisionRequest(supervisors[2]);
  
  // Supervisor 1 accepts
  await loginAs(supervisors[0]);
  await acceptRequest(request1);
  
  // Verify other requests auto-cancelled
  const req2Status = await getRequestStatus(request2);
  const req3Status = await getRequestStatus(request3);
  expect(req2Status).toBe('auto_cancelled');
  expect(req3Status).toBe('auto_cancelled');
  
  // Verify other supervisors notified
  await loginAs(supervisors[1]);
  await expect(notificationPanel).toHaveText('Request cancelled');
  await loginAs(supervisors[2]);
  await expect(notificationPanel).toHaveText('Request cancelled');
});
```

---

## Setup Process

### **Phase 1: Cursor Browser Automation (COMPLETED ✅)**

**Status**: Ready to use immediately
**Time**: 1 hour setup, ready for daily use
**Deliverables**:
- 9 test prompt templates in `.cursor/prompts/`
- Test user seeder (TestUserSeeder.php)
- Complete documentation (4 guides)
- Real account configuration documented

**How to Use**:
1. Open any test prompt from `.cursor/prompts/`
2. Copy entire content
3. Paste in Cursor chat
4. Cursor performs test automatically
5. Review results and fix issues

**Test Accounts**:
- Real student: yitkhee0117@gmail.com / password
- Real academician 1: ahmadnajmi.an@utm.my / password
- Real academician 2: seahcs@utm.my / password

**Prerequisites** (Manual, One-Time):
- Ensure student has potential supervisors configured
- Ensure academicians have complete profiles
- Verify basic data setup is correct

### **Phase 2: Playwright Automation (NEXT)**

**Purpose**: Convert Cursor tests to automated regression testing
**Time**: 2-3 hours
**When**: After core features are stable and working

1. Install Playwright for browser automation
2. Create test helper utilities
3. Set up test user factory (use real accounts)
4. Convert Cursor tests to Playwright:
   - Student request flow
   - Supervisor acceptance flow
   - Meeting scheduling
   - Unbind process (3 attempts with cooldown)
   - Co-supervisor invitations
5. Add edge case tests (limits, validations)
6. Add security tests (unauthorized access)

**Key Difference from Phase 1**:
- Phase 1 (Cursor): Quick manual testing for development
- Phase 2 (Playwright): Automated regression testing for CI/CD

### **Phase 3: CI/CD Pipeline (1-2 hours)**

1. Create GitHub Actions workflow
2. Configure test database
3. Set up automated test runs
4. Add code coverage reporting
5. Configure deployment automation

### **Phase 4: Code Quality Tools (1 hour)**

1. Set up PHPStan for PHP static analysis
2. Configure ESLint for JavaScript
3. Create Cursor prompt templates
4. Set up pre-commit hooks

### **Phase 5: Monitoring & Alerts (1 hour)**

1. Install error tracking (Sentry/Bugsnag)
2. Configure email alerts
3. Set up logging
4. Create monitoring dashboard

**Total Setup Time: 6-9 hours** (one-time investment)

---

## Benefits for Your Situation

### **Time Savings**

- Manual testing: 30-45 min per feature
- Automated testing: 5-10 min for ALL features
- **Savings: 80-90% of testing time**

### **Confidence**

- No more "did I break something else?"
- Tests run automatically on every change
- Catch bugs before they reach users

### **Code Quality**

- AI reviews every change
- Static analysis catches issues early
- Maintains coding standards

### **Documentation**

- Tests serve as feature documentation
- New developers can see how features work
- Clear examples of expected behavior

### **Scalability**

- Easy to add new tests
- Reusable test utilities
- Grows with your application

---

## Answers to Your Specific Questions

### **Q1: Can it handle complex multi-user testing?**

✅ **YES!** The toolkit specifically handles:

- Creating multiple test users (students, academicians)
- Switching between users in tests
- Testing interactions between users
- Verifying data consistency across user views
- Testing real-time notifications between users

### **Q2: Can it test the supervision feature?**

✅ **YES!** We'll create comprehensive tests for:

- ✅ Student sending supervision requests
- ✅ Supervisor accepting/rejecting requests
- ✅ Student accepting/rejecting offers
- ✅ Meeting scheduling and updates
- ✅ Unbind request workflows
- ✅ Notification delivery to all parties
- ✅ ScholarLab workspace creation
- ✅ Request limits and validations
- ✅ Auto-cancellation logic
- ✅ Security and access control

### **Q3: How does setup work?**

The setup is step-by-step with:

1. **Install dependencies** (npm/composer commands)
2. **Generate test utilities** (AI helps create these)
3. **Create test accounts** (automated factories)
4. **Write first test** (AI-assisted)
5. **Configure CI/CD** (copy-paste configuration)
6. **Run tests** (single command)

### **Q4: Will this work for future features?**

✅ **YES!** Once set up:

- Add new tests in minutes (AI helps generate)
- Reuse existing test utilities
- Same patterns for all features
- Copy test templates and modify

---

## Next Steps

If you want to proceed:

1. **I'll set up the complete toolkit** with your supervision feature as the first comprehensive test
2. **You'll see exactly how it works** with real examples on your actual code
3. **You'll learn how to create new tests** for future features
4. **You'll stop manual testing** and let automation do the work

**Ready to proceed?** Let me know and I'll start with Phase 1: Browser Testing Foundation, creating the first automated test for your supervision feature.

---

## Cost Analysis

**Time Investment:**

- Initial setup: 6-9 hours (one-time)
- Maintenance: 10-15 min per new feature

**Time Saved:**

- Manual testing: 30-45 min × 10 features/month = 5-7.5 hours/month
- Bug fixes: 2-3 hours/month (catch bugs earlier)
- **Total savings: 7-10.5 hours/month**

**ROI: Setup pays for itself in the first month**

**Tools Cost:**

- Playwright: Free (open source)
- GitHub Actions: Free tier sufficient
- PHPStan/ESLint: Free
- Cursor: Already have it
- **Total additional cost: $0**

### Testing Strategy Summary

```
┌─────────────────────────────────────────────────────────────┐
│ PHASE 1: Cursor Browser Automation (COMPLETED ✅)          │
├─────────────────────────────────────────────────────────────┤
│ Purpose: Daily development testing                          │
│ Speed: 5-10 minutes per feature                            │
│ When: During development, before committing                 │
│ Who: Developer (you)                                        │
│ How: Copy prompt → Paste in Cursor → Watch test            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ PHASE 2: Playwright Automation (NEXT)                      │
├─────────────────────────────────────────────────────────────┤
│ Purpose: Automated regression testing                       │
│ Speed: 8-12 minutes for full test suite                    │
│ When: On every git push, before merge                       │
│ Who: CI/CD pipeline (automatic)                             │
│ How: npm run test:supervision                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ PHASE 3: CI/CD Pipeline (FUTURE)                           │
├─────────────────────────────────────────────────────────────┤
│ Purpose: Continuous integration and deployment              │
│ Speed: Automatic on every push                              │
│ When: Always running                                         │
│ Who: GitHub Actions                                          │
│ How: Automatic triggers                                      │
└─────────────────────────────────────────────────────────────┘
```

### To-dos

#### Phase 1: Cursor Browser Automation ✅ COMPLETE
- [x] Create test prompt templates (9 files)
- [x] Create test user seeder
- [x] Write comprehensive documentation
- [x] Document real account usage strategy
- [x] Create code review and security audit prompts

#### Phase 2: Playwright Automation (Next Step)
- [ ] Install Playwright
- [ ] Create test utilities using real accounts
- [ ] Convert supervision request tests to Playwright
- [ ] Convert acceptance flow tests to Playwright
- [ ] Convert meeting tests to Playwright
- [ ] Convert unbind workflow tests to Playwright
- [ ] Add co-supervisor tests
- [ ] Add edge case and security tests
- [ ] Set up test data management

#### Phase 3: CI/CD Pipeline
- [ ] Create GitHub Actions workflow
- [ ] Configure test database
- [ ] Set up automated test runs on push
- [ ] Add code coverage reporting
- [ ] Configure deployment automation

#### Phase 4: Code Quality Tools
- [ ] Set up PHPStan for PHP static analysis
- [ ] Configure ESLint for JavaScript
- [ ] Create pre-commit hooks
- [ ] Integrate with CI/CD

#### Phase 5: Monitoring & Alerts
- [ ] Install error tracking (Sentry/Bugsnag)
- [ ] Configure email alerts
- [ ] Set up logging
- [ ] Create monitoring dashboard

### Current Status

**✅ Phase 1 Complete**: Cursor browser automation ready for immediate use
**⏭️ Next**: Use Cursor tests daily, then convert to Playwright when stable
**📚 Documentation**: Complete guides in `.cursor/` directory
**🧪 Test Accounts**: Real accounts documented and ready