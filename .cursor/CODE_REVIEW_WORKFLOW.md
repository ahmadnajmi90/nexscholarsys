# Code Review Workflow

How to use AI-assisted code review in your development workflow as a solo developer.

## When to Run Code Review

### 1. Before Every Commit (Recommended)
After you finish implementing a feature or fix:
```bash
# Stage your changes
git add .

# Run AI review before committing
# [Use code-review.md prompt with AI]

# After fixing issues, commit
git commit -m "feat: add supervision request validation"
```

### 2. After Completing a Feature
For larger features, review the entire feature:
```bash
# Show all changes since last commit
git diff HEAD

# Copy and send to AI with review prompt
# Fix any issues found
# Then commit
```

### 3. Before Merging to Master
Before merging your feature branch:
```bash
# Switch to feature branch
git checkout fea/supervision

# Get diff from master
git diff master...HEAD

# Review all changes with AI
# Fix critical issues
# Then merge
```

### 4. After Fixing a Bug
Even for small bug fixes, quick review can catch:
- If your fix introduces new bugs
- If there are better solutions
- If similar bugs exist elsewhere

## How to Use the Prompts

### Step 1: Choose the Right Prompt

**For General Changes:**
Use `.cursor/prompts/code-review.md`
- Controller updates
- New API endpoints
- Database migrations
- Service classes
- Middleware
- General bug fixes

**For Supervision Feature:**
Use both prompts together:
1. `.cursor/prompts/code-review.md` (general review)
2. `.cursor/prompts/supervision-review.md` (domain-specific)

### Step 2: Prepare Your Changes

**Option A: Send Files Directly**
```
# In Cursor/AI chat:
"Review these files:"
[Attach: app/Http/Controllers/SupervisionRequestController.php]
[Attach: app/Services/Supervision/SupervisionRequestService.php]

[Paste the code-review.md prompt]
```

**Option B: Send Diff**
```bash
# Get git diff
git diff > my-changes.diff

# In AI chat:
"Review my changes:"
[Paste the diff]
[Paste the code-review.md prompt]
```

**Option C: Describe Changes**
```
# In AI chat:
"I made these changes:
- Added request limit validation (max 5 pending)
- Added duplicate request detection
- Updated SupervisionRequestService
- Modified API endpoint

Files changed:
- app/Services/Supervision/SupervisionRequestService.php
- app/Http/Controllers/Api/V1/Supervision/SupervisionRequestController.php

[Show/attach the files]
[Paste the code-review.md prompt]
```

### Step 3: Review AI Feedback

AI will categorize issues into:

**1. Critical Issues (Must Fix Before Commit)**
Examples:
- SQL injection vulnerability found
- Missing authentication check
- Business logic error
- Data consistency issue

**Action:** Fix immediately before committing

**2. Recommendations (Should Fix Soon)**
Examples:
- N+1 query detected
- Missing validation for edge case
- Error handling could be better
- Permission check could be stricter

**Action:** Fix now or create issue to fix soon

**3. Nice-to-Have Improvements (Optional)**
Examples:
- Could extract method for better readability
- Consider adding index to this column
- This comment could be clearer
- Variable name could be more descriptive

**Action:** Fix if easy, otherwise note for future refactoring

### Step 4: Fix Issues

For each issue AI finds:
1. Understand the problem
2. Fix the code
3. Test the fix manually
4. Re-run code review if changes are significant

### Step 5: Commit

After AI gives you the green light:
```bash
git add .
git commit -m "your message"
git push
```

## Example Review Session

### Scenario: You just added supervision request validation

**You:**
```
Please review my code for creating supervision requests.

I added validation to:
1. Check student doesn't already have 5 pending requests
2. Prevent duplicate requests to same supervisor
3. Auto-cancel other requests when one is accepted

Files changed:
[Attach: app/Services/Supervision/SupervisionRequestService.php]
[Attach: app/Http/Controllers/Api/V1/Supervision/SupervisionRequestController.php]

[Paste code-review.md prompt]
[Paste supervision-review.md prompt]
```

**AI Finds:**
```
Critical Issues:
1. Missing database transaction in auto-cancel logic (lines 45-52)
   - If cancellation fails, relationship is still created
   - Wrap in DB::transaction()

2. No check if supervisor is accepting students
   - Should verify academician->availability_as_supervisor
   - Could create request to unavailable supervisor

Recommendations:
3. N+1 query when cancelling multiple requests
   - Use whereIn() instead of foreach with individual queries
   
4. Missing notification to student when requests auto-cancelled
   - Students should know their other requests were cancelled

Nice-to-Have:
5. Extract duplicate checking logic to separate method
   - Makes it reusable for co-supervisor invitations
```

**You Fix:**
1. Add `DB::transaction()` around auto-cancel + relationship creation
2. Add `where('availability_as_supervisor', true)` check before allowing request
3. Optimize query to use `SupervisionRequest::whereIn('id', $requestIds)->update()`
4. Add notification: `$student->notify(new RequestAutoCancelled($request))`
5. Extract to method: `checkDuplicateRequest($studentId, $supervisorId)`

**You Re-Review:**
```
Fixed all issues, please review again.
[Show updated files]
```

**AI:**
```
✓ All critical issues resolved
✓ Recommendations implemented
✓ Code looks good to commit
```

**You Commit:**
```bash
git add .
git commit -m "feat: add supervision request validation with transaction safety"
git push origin fea/supervision
```

## Quick Tips

### 1. Review Early, Review Often
Don't wait until you've written 500 lines. Review every 100-200 lines.

### 2. Focus on Critical Issues First
If AI finds 10 things, fix the critical ones before worrying about nice-to-haves.

### 3. Ask Follow-Up Questions
If AI suggests something unclear:
```
"Can you show me how to fix the N+1 query issue?"
"Why is this a security risk?"
"What's a better way to handle this edge case?"
```

### 4. Learn from Patterns
If AI keeps finding the same issue (e.g., missing transactions), make a note to always check for it.

### 5. Don't Over-Optimize
Sometimes "good enough" is fine for a first version. You can refactor later.

## Common Questions

**Q: Do I need to review every single commit?**
A: For critical features (like supervision), yes. For minor UI tweaks, you can skip.

**Q: What if AI suggests something I disagree with?**
A: Trust your judgment. AI isn't perfect. But consider why it made that suggestion.

**Q: How long should a review take?**
A: 2-5 minutes for small changes, 10-15 minutes for a full feature.

**Q: Should I review before or after manual testing?**
A: Before. Fix obvious issues first, then test. Saves time.

**Q: Can I review multiple features at once?**
A: Better to review each feature separately. Easier to understand context.

## Integration with Git Workflow

### Daily Development Workflow

```bash
# Morning: Start new feature
git checkout master
git pull
git checkout -b fea/new-feature

# During development: Work on feature
# ... write code ...

# Before each commit: Review
# [Run AI code review]
# [Fix issues]
git add .
git commit -m "feat: implement X"

# Continue working
# ... write more code ...

# Before each commit: Review again
# [Run AI code review]
# [Fix issues]
git add .
git commit -m "feat: add Y validation"

# End of day: Push
git push origin fea/new-feature

# Next day or when feature complete: Final review before merge
git diff master...HEAD > feature-changes.diff
# [Run AI code review on entire feature]
# [Fix any issues]
git add .
git commit -m "fix: address code review findings"

# Merge to master
git checkout master
git merge fea/new-feature
git push origin master
```

### Hotfix Workflow

```bash
# Urgent bug in production
git checkout master
git checkout -b hotfix/urgent-bug

# Fix the bug
# ... write fix ...

# Quick review (even for hotfixes!)
# [Run AI code review - focus on "did I break anything else?"]
# [Fix issues]

git add .
git commit -m "fix: resolve urgent bug"
git push origin hotfix/urgent-bug

# Merge immediately
git checkout master
git merge hotfix/urgent-bug
git push origin master
```

## Success Metrics

After using code review for a month, you should see:

✓ **Fewer bugs in production**
- Catch issues before deployment
- Better input validation
- Proper error handling

✓ **Better code quality**
- More consistent patterns
- Cleaner architecture
- Less technical debt

✓ **Faster development**
- Fix issues early (cheaper than fixing later)
- Learn better patterns
- Less debugging time

✓ **More confidence**
- Know your code is solid
- Sleep better at night
- Deploy without anxiety

## Next Steps

1. **Start Small**: Review your next commit with `code-review.md`
2. **Build Habit**: Make it part of your commit routine
3. **Learn Patterns**: Notice common issues AI finds
4. **Refine**: Adjust prompts based on what works for you
5. **Expand**: Add more domain-specific review prompts as needed

