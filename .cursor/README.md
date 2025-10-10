# Solo Developer Toolkit

**AI-assisted code review and systematic manual testing for NexScholarSys**

---

## 📁 What's in this directory?

```
.cursor/
├── README.md                               ← You are here
├── CODE_REVIEW_WORKFLOW.md                 ← How to use AI code review
├── prompts/
│   ├── code-review.md                      ← General code review prompt
│   └── supervision-review.md               ← Supervision-specific review
├── testing/
│   ├── supervision-test-checklist.md       ← Comprehensive manual tests
│   ├── supervision-smoke-test.md           ← Quick 10-minute tests
│   └── test-data-setup.md                  ← Test data & SQL queries
├── plans/
│   └── complete-solo-developer-toolkit-*.plan.md
└── rules/                                  ← AI context rules
    ├── nexscholar-ai-rules.mdc
    ├── nexscholar-laravel-rules.mdc
    └── ...
```

---

## 🎯 Purpose

This toolkit helps you as a **solo developer** to:

1. **Code Review**: Catch bugs, security issues, and bad patterns before committing
2. **Manual Testing**: Test systematically with comprehensive checklists
3. **Save Time**: No more flaky automated tests to debug
4. **Ship Confidently**: Know your code works before deploying

---

## 🚀 Quick Start

### Code Review Workflow

**Before every commit:**

1. Stage your changes:
   ```bash
   git add .
   ```

2. Open AI chat (Cursor/Claude) and paste:
   - General changes: [`.cursor/prompts/code-review.md`](./prompts/code-review.md)
   - Supervision feature: Both [`code-review.md`](./prompts/code-review.md) + [`supervision-review.md`](./prompts/supervision-review.md)

3. Attach your changed files or show diff

4. Fix issues AI finds

5. Commit when clean:
   ```bash
   git commit -m "your message"
   ```

**Full workflow guide:** [`.cursor/CODE_REVIEW_WORKFLOW.md`](./CODE_REVIEW_WORKFLOW.md)

---

### Manual Testing Workflow

**Before deploying:**

1. **Quick smoke test** (10 minutes):
   - Use [`.cursor/testing/supervision-smoke-test.md`](./testing/supervision-smoke-test.md)
   - Tests 6 critical paths
   - Pass = ready to deploy
   - Fail = do not deploy

2. **Full regression test** (60-90 minutes):
   - Use [`.cursor/testing/supervision-test-checklist.md`](./testing/supervision-test-checklist.md)
   - For major releases
   - Before merging to master
   - After significant changes

3. **Setup test data**:
   - Use [`.cursor/testing/test-data-setup.md`](./testing/test-data-setup.md)
   - SQL queries to create test states
   - Reset scripts for clean testing

---

## 📚 Documentation Guide

### Code Review

| Document | Purpose | When to Use |
|----------|---------|-------------|
| [`CODE_REVIEW_WORKFLOW.md`](./CODE_REVIEW_WORKFLOW.md) | Complete workflow guide | **Read first!** |
| [`prompts/code-review.md`](./prompts/code-review.md) | General review prompt | Before every commit |
| [`prompts/supervision-review.md`](./prompts/supervision-review.md) | Supervision-specific | For supervision feature changes |

### Manual Testing

| Document | Purpose | Estimated Time |
|----------|---------|----------------|
| [`testing/supervision-smoke-test.md`](./testing/supervision-smoke-test.md) | Quick regression test | 10-15 minutes |
| [`testing/supervision-test-checklist.md`](./testing/supervision-test-checklist.md) | Comprehensive test | 60-90 minutes |
| [`testing/test-data-setup.md`](./testing/test-data-setup.md) | Setup & reset data | As needed |

---

## 🔑 Test Accounts

**Student:**
- Email: `yitkhee0117@gmail.com`
- Password: `password`
- Has 2 supervisors in potential list

**Supervisors:**
1. Email: `ahmadnajmi.an@utm.my` / Password: `password`
2. Email: `seahcs@utm.my` / Password: `password`

See [`.cursor/testing/test-data-setup.md`](./testing/test-data-setup.md) for creating more test users.

---

## 💡 How to Use This Toolkit

### Daily Development

```bash
# 1. Start new feature
git checkout -b fea/new-feature

# 2. Write code
# ... implement feature ...

# 3. Run code review (AI)
# [Paste code-review.md prompt with changed files]
# [Fix issues]

# 4. Commit
git add .
git commit -m "feat: implement new feature"

# 5. Test manually
# [Follow smoke test checklist]

# 6. Push when green
git push origin fea/new-feature
```

### Before Deploying to Production

```bash
# 1. Run smoke test (10 min)
# [Follow supervision-smoke-test.md]

# 2. If smoke test passes
# → Ready to deploy

# 3. If smoke test fails
# → Run full test checklist
# → Fix issues
# → Re-run smoke test
```

### For Major Releases

```bash
# 1. Code review entire feature
git diff master...HEAD > feature.diff
# [Send to AI with code-review.md]

# 2. Fix all issues

# 3. Run full test checklist (60-90 min)
# [Follow supervision-test-checklist.md]

# 4. Run smoke test for final verification

# 5. Deploy
```

---

## ✅ What This Toolkit Covers

### Code Review Checks

- ✅ Security (SQL injection, XSS, CSRF)
- ✅ Authentication & authorization
- ✅ Input validation
- ✅ Error handling
- ✅ Performance (N+1 queries, indexes)
- ✅ Code quality
- ✅ API consistency
- ✅ Database safety
- ✅ Laravel best practices
- ✅ Supervision business logic

### Testing Coverage

**Student Workflows:**
- ✅ Send supervision request (valid, invalid, edge cases)
- ✅ Respond to offer (accept/reject)
- ✅ Manage active relationship
- ✅ Schedule meetings
- ✅ Upload documents
- ✅ Request unbind (attempt 1, 2, 3)
- ✅ Approve co-supervisors

**Supervisor Workflows:**
- ✅ Review incoming requests
- ✅ Accept/reject requests
- ✅ Manage active students
- ✅ Schedule meetings
- ✅ Invite co-supervisors
- ✅ Initiate unbind
- ✅ Respond to unbind requests

**Edge Cases:**
- ✅ Request limits (max 5 pending)
- ✅ Duplicate requests
- ✅ Auto-cancel requests
- ✅ Permission boundaries
- ✅ Concurrent actions
- ✅ Network interruptions
- ✅ Large file uploads

---

## 🎓 Learning from Patterns

As you use code review, you'll notice patterns:

### Common Issues AI Finds

1. **Missing transactions** - Multi-step DB operations without transactions
2. **N+1 queries** - Forgetting to eager load relationships
3. **Missing validation** - Not checking edge cases
4. **Permission gaps** - Forgetting authorization checks
5. **State transitions** - Allowing invalid state changes
6. **Notification gaps** - Forgetting to notify relevant parties

**Pro Tip:** Keep a note of issues AI frequently finds in your code. Check for them proactively before running review.

---

## 📊 Expected Benefits

After using this toolkit for 1 month:

**Code Quality:**
- ✅ Fewer bugs in production
- ✅ Better security
- ✅ More consistent code
- ✅ Less technical debt

**Development Speed:**
- ✅ Catch issues early (cheaper to fix)
- ✅ Less debugging time
- ✅ More confidence
- ✅ Faster deployments

**Personal Growth:**
- ✅ Learn best practices
- ✅ Recognize patterns
- ✅ Improve coding skills
- ✅ Build better habits

---

## 🔧 Troubleshooting

### Code Review

**Q: AI suggests something I disagree with?**
A: Trust your judgment. AI isn't perfect. But consider why it made that suggestion.

**Q: Code review takes too long?**
A: Review smaller chunks (100-200 lines at a time). Don't wait until you've written 500 lines.

**Q: Should I review every commit?**
A: For critical features (supervision), yes. For minor UI tweaks, you can skip.

### Manual Testing

**Q: Test checklist is too long?**
A: Use smoke test (10 min) for quick checks. Full checklist only for major releases.

**Q: How to track what I've tested?**
A: Check off items in the markdown file as you go. Copy results to test log.

**Q: Test data keeps getting messed up?**
A: Use test-data-setup.md to reset between sessions. Keep dedicated test accounts.

---

## 🚀 Next Steps

### 1. Start with Code Review
- Read [`CODE_REVIEW_WORKFLOW.md`](./CODE_REVIEW_WORKFLOW.md)
- Try reviewing your next commit
- Build the habit

### 2. Add Manual Testing
- Run [`supervision-smoke-test.md`](./testing/supervision-smoke-test.md) before next deploy
- Use full checklist for next major release

### 3. Refine Your Process
- Adjust prompts based on what works
- Add project-specific checks
- Create more checklists for other features

---

## 📖 Additional Resources

### Supervision Feature Docs
- [`docs/supervision/README.md`](../docs/supervision/README.md) - Feature specification
- [`SUPERVISION_NOTIFICATIONS_IMPLEMENTATION_SUMMARY.md`](../SUPERVISION_NOTIFICATIONS_IMPLEMENTATION_SUMMARY.md) - Notification details

### Laravel Testing
- [`tests/Feature/`](../tests/Feature/) - PHPUnit tests (still useful for API testing)
- [`phpunit.xml`](../phpunit.xml) - PHPUnit configuration

---

## 🤝 Workflow Integration

### Git Workflow

```bash
# Feature development
git checkout master
git pull
git checkout -b fea/new-feature

# Develop + review + commit
# [Write code]
# [Run AI code review]
# [Fix issues]
git add .
git commit -m "feat: implement X"

# Before merging
# [Run smoke test]
# [Fix any issues]
git checkout master
git merge fea/new-feature
git push origin master
```

### Daily Routine

**Morning:**
1. Pull latest master
2. Create feature branch
3. Plan what to build

**During development:**
1. Write code
2. Review with AI
3. Fix issues
4. Commit
5. Repeat

**Before leaving:**
1. Run smoke test
2. Push if green
3. Document any issues

**Before deployment:**
1. Full code review of feature
2. Run appropriate test checklist
3. Deploy when all green

---

## 📝 Changelog

### 2025-10-10: Toolkit Created
- ✅ Removed Playwright automation (too complex for this project)
- ✅ Added AI-assisted code review prompts
- ✅ Created comprehensive manual test checklists
- ✅ Added test data setup guides
- ✅ Documented complete workflows

**Rationale:** For complex frontend features, manual testing is faster and more reliable than debugging automated tests. AI-assisted code review catches bugs before they reach testing.

---

## 💬 Need Help?

1. **Code Review Issues**: Check [`CODE_REVIEW_WORKFLOW.md`](./CODE_REVIEW_WORKFLOW.md) examples
2. **Testing Questions**: Review test checklist notes and tips
3. **Test Data Problems**: See [`testing/test-data-setup.md`](./testing/test-data-setup.md) troubleshooting section

---

## 🎯 Success Metrics

Track your progress over time:

| Metric | Target |
|--------|--------|
| Code review before commit | 100% for critical features |
| Smoke test before deploy | 100% |
| Full test before major release | 100% |
| Production bugs per month | Decreasing trend |
| Time to fix bugs | Decreasing trend |
| Confidence in deploys | Increasing! |

---

**Happy coding! 🚀**
