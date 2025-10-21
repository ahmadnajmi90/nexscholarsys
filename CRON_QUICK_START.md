# ⚡ Quick Start: Cron-Job.org Setup (5 Minutes)

## Step 1: Add to .env (30 seconds)

Open your `.env` file and add:

```env
CRON_SECRET=k8Jx2vN9qR4wL7mP3yH6sT1fB5gD0cA8zE9uI4oX2Y
```

👆 **IMPORTANT**: Change this to your own random string!

**Quick generate:**
```bash
php artisan tinker
>>> Str::random(40)
```

Then run:
```bash
php artisan config:clear
```

---

## Step 2: Test It Works (1 minute)

Open this URL in your browser (replace YOUR_TOKEN):

```
https://nexscholar.com/admin/trigger-message-notifications?token=YOUR_TOKEN
```

✅ **Success looks like:**
```json
{
  "success": true,
  "message": "Email notification job triggered successfully"
}
```

❌ **Error looks like:**
```json
{
  "success": false,
  "error": "Invalid or missing token"
}
```

---

## Step 3: Cron-Job.org Setup (3 minutes)

1. **Go to:** https://cron-job.org/en/members/jobs/

2. **Click:** "Create Cronjob" (blue button)

3. **Fill in form:**

   | Field | Value |
   |-------|-------|
   | **Title** | `Nexscholar - Message Notifications` |
   | **URL** | `https://nexscholar.com/admin/trigger-message-notifications?token=YOUR_TOKEN` |
   | **Schedule** | Every day at 9:00 AM |
   | **Timezone** | Asia/Kuala_Lumpur (GMT+8) |
   | **Timeout** | 300 seconds |

4. **Advanced Settings (scroll down):**
   - ✅ Enable: "Notify me on failure"
   - ✅ Enter your email address

5. **Click:** "Create Cronjob"

---

## Step 4: Test Run (30 seconds)

1. Find your new cron job in the dashboard
2. Click the **▶ Play button** ("Execute now")
3. Wait 5 seconds
4. Check for green checkmark ✅

---

## Done! 🎉

Your system will now:
- Run automatically every day at 9:00 AM
- Find inactive users with unread messages
- Send them email notifications
- Log all activity

---

## Quick Troubleshooting

| Problem | Fix |
|---------|-----|
| "Invalid token" | Check `.env` has `CRON_SECRET`, run `php artisan config:clear` |
| "Not configured" | Add `CRON_SECRET` to `.env` file |
| Timeout | Increase timeout to 300 seconds in Cron-Job.org |
| No emails sent | Check queue workers running, verify email config |

---

## View Full Guide

For detailed setup and troubleshooting: [CRON_JOB_ORG_SETUP_GUIDE.md](./CRON_JOB_ORG_SETUP_GUIDE.md)

---

**Status:** Ready to use ✅  
**Time Required:** 5 minutes  
**Difficulty:** Easy 🟢

