# Quick Start Guide

**Get started with code review and manual testing in 5 minutes**

---

## ⚡ TL;DR

1. **Before commit:** Review code with AI using `.cursor/prompts/code-review.md`
2. **Before deploy:** Run 10-min smoke test using `.cursor/testing/supervision-smoke-test.md`
3. **Before major release:** Run full test using `.cursor/testing/supervision-test-checklist.md`

---

## 🚀 Right Now: Your First Code Review

### Step 1: Make Some Changes
```bash
# You probably already have uncommitted changes
git status
```

### Step 2: Open the Code Review Prompt
- Open `.cursor/prompts/code-review.md`
- Copy the prompt template (the big code block)

### Step 3: Ask AI to Review
In your AI chat (Cursor/Claude):
```
[Paste the code-review.md prompt]

Review these files:
[Attach or show your changed files]
```

### Step 4: Fix Issues
AI will categorize issues:
- **Critical** - Fix now
- **Recommendations** - Fix soon
- **Nice-to-have** - Optional

### Step 5: Commit
```bash
git add .
git commit -m "your message"
```

**Done!** You just caught bugs before they reached production. 🎉

---

## 🧪 Right Now: Your First Smoke Test

### Step 1: Open the Smoke Test
Open `.cursor/testing/supervision-smoke-test.md`

### Step 2: Run the 6 Tests (10 minutes)
1. ☐ Request submission
2. ☐ Supervisor accepts
3. ☐ Student accepts offer
4. ☐ Meeting scheduling
5. ☐ Unbind request
6. ☐ Co-supervisor invitation

### Step 3: Check Results
- **All pass?** ✅ Ready to deploy!
- **Any fail?** ❌ Fix issues first

**Done!** You verified your app works. 🎉

---

## 📚 Learn More

**Full Workflow:**
- `.cursor/CODE_REVIEW_WORKFLOW.md` - Complete code review guide

**Testing:**
- `.cursor/testing/supervision-smoke-test.md` - 10-min quick test
- `.cursor/testing/supervision-test-checklist.md` - 60-min full test
- `.cursor/testing/test-data-setup.md` - Setup & reset

**Overview:**
- `.cursor/README.md` - Complete documentation

---

## 🎯 Daily Routine

### Morning
```bash
git checkout master
git pull
git checkout -b fea/new-feature
```

### During Development
1. Write code
2. **Code review with AI** ← `.cursor/prompts/code-review.md`
3. Fix issues
4. Commit
5. Repeat

### Before Leaving
1. **Run smoke test** ← `.cursor/testing/supervision-smoke-test.md`
2. Push if green

### Before Deploying
1. **Smoke test** (10 min)
2. Deploy if pass
3. Full test if major release

---

## ✅ That's It!

You're ready to:
- ✅ Catch bugs before commit
- ✅ Deploy with confidence
- ✅ Ship quality code

**Start with your next commit!** 🚀

