# Cron-Job.org Setup Guide for Message Notifications

## ✅ Step 1: Add Secret Token to .env

Add this line to your `.env` file (use a strong random string):

```env
CRON_SECRET=your-random-secret-key-12345-change-this-to-something-secure
```

**How to generate a secure token:**

**Option A: Using Laravel Tinker**
```bash
php artisan tinker
>>> Str::random(40)
```

**Option B: Using OpenSSL (if available)**
```bash
openssl rand -base64 32
```

**Option C: Random.org**
Visit: https://www.random.org/strings/

**Example secure token:**
```
CRON_SECRET=k8Jx2vN9qR4wL7mP3yH6sT1fB5gD0cA8zE9uI4oX2Y
```

---

## ✅ Step 2: Test Your Endpoint Locally

Test that the route works:

```bash
# Replace YOUR_TOKEN with the CRON_SECRET from your .env
curl "https://nexscholar.com/admin/trigger-message-notifications?token=YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Email notification job triggered successfully",
  "output": "...",
  "timestamp": "2025-10-21 16:00:00"
}
```

**If you get an error:**
- ✅ Make sure `.env` has `CRON_SECRET` defined
- ✅ Run `php artisan config:clear` to clear cached config
- ✅ Check that your token matches exactly (no extra spaces)

---

## 📋 Step 3: Set Up Cron-Job.org

### **3.1 Create New Cron Job**

1. **Login to Cron-Job.org**
   - Go to: https://cron-job.org
   - Login with your account

2. **Click "Create Cronjob"**
   - Usually a big blue button on the dashboard

### **3.2 Configure Basic Settings**

Fill in the form with these details:

**Title:**
```
Nexscholar - Message Notifications
```

**Address (URL):**
```
https://nexscholar.com/admin/trigger-message-notifications?token=YOUR_CRON_SECRET
```
⚠️ **IMPORTANT**: Replace `YOUR_CRON_SECRET` with your actual token from `.env`

**Example URL:**
```
https://nexscholar.com/admin/trigger-message-notifications?token=k8Jx2vN9qR4wL7mP3yH6sT1fB5gD0cA8zE9uI4oX2Y
```

---

### **3.3 Set Schedule**

**Schedule Type:** Choose "Every day"

**Execution Time:** 
- Select: **9:00** (9:00 AM)
- Timezone: **Asia/Kuala_Lumpur** (GMT+8)

**Alternative: Custom Schedule**
If you want more control, use custom schedule:
- Pattern: `0 9 * * *`
- This means: "At 9:00 AM every day"

---

### **3.4 Advanced Settings (Optional but Recommended)**

Scroll down to "Advanced" section:

**Request Method:**
- Select: **GET** (default)

**Request Timeout:**
- Set to: **300 seconds** (5 minutes)
- This gives enough time for the job to complete

**Follow Redirects:**
- Leave: **Enabled** (default)

**Response Content:**
- Leave: **Enabled**
- This lets you see the response in logs

---

### **3.5 Notification Settings**

**Enable Notifications:**
- Toggle ON: "Notify me on failure"

**Notification Email:**
- Enter your email address
- You'll get alerts if the job fails

**Failure Detection:**
- Select: "When HTTP status code is not 2xx"
- This will alert you if the endpoint returns an error

---

### **3.6 Save and Enable**

1. Click **"Create Cronjob"** button at the bottom
2. You'll see your new cron job in the dashboard
3. **Make sure it's ENABLED** (toggle should be green/on)

---

## ✅ Step 4: Test the Cron Job

### **Test Execution**

1. **In Cron-Job.org dashboard:**
   - Find your "Nexscholar - Message Notifications" job
   - Click the **▶ Play button** (Execute now)
   - Wait a few seconds

2. **Check the result:**
   - Click on the job to view details
   - Look at "Last Execution"
   - Status should show: **Success** (green checkmark)
   - Response should show JSON with `"success": true`

### **Expected Success Response:**

```json
{
  "success": true,
  "message": "Email notification job triggered successfully",
  "output": "🔔 Starting message email notification job...\n...",
  "timestamp": "2025-10-21 16:00:00"
}
```

---

## 🔍 Verify It's Working

### **Check Laravel Logs**

```bash
tail -f storage/logs/laravel.log
```

Look for entries like:
```
[2025-10-21 09:00:00] local.INFO: Message notifications triggered via cron
```

### **Check Execution History**

In Cron-Job.org:
1. Click on your cron job
2. View "Execution History" tab
3. You should see successful executions at 9:00 AM daily

---

## 📅 What Happens Next?

- **Every day at 9:00 AM**:
  1. Cron-Job.org calls your URL
  2. Your Laravel app runs the notification command
  3. System finds inactive users with unread messages
  4. Sends personalized emails to eligible users
  5. Updates timestamps to prevent duplicate emails

---

## 🛠️ Troubleshooting

### ❌ "Invalid or missing token" error

**Problem:** Token mismatch

**Solution:**
1. Check your `.env` file for `CRON_SECRET`
2. Make sure the token in Cron-Job.org URL matches exactly
3. Run `php artisan config:clear`
4. No spaces or quotes around the token

---

### ❌ "Cron secret not configured" error

**Problem:** `.env` missing `CRON_SECRET`

**Solution:**
1. Add `CRON_SECRET=...` to `.env`
2. Run `php artisan config:clear`
3. Restart queue workers if running

---

### ❌ Timeout Error

**Problem:** Job takes too long

**Solution:**
1. In Cron-Job.org, increase timeout to 300 seconds
2. Check Laravel logs for specific errors
3. Ensure queue workers are running for email sending

---

### ❌ No emails being sent

**Problem:** Command runs but no emails sent

**Solution:**
1. Test manually: `php artisan messages:send-email-notifications --dry-run`
2. Check email configuration in `.env`
3. Ensure queue workers are running
4. Check `storage/logs/laravel.log` for errors

---

## 🔒 Security Notes

- ✅ **Never commit `.env` to git** - Token is secret
- ✅ Use a strong random token (32+ characters)
- ✅ Change token if exposed
- ✅ Monitor logs for unauthorized access attempts
- ✅ Only use HTTPS (not HTTP)

---

## 📊 Monitoring Success

### **Daily Checklist (First Week)**

- [ ] Check Cron-Job.org execution history
- [ ] Verify emails were sent (check Laravel logs)
- [ ] Confirm no errors in execution
- [ ] Monitor email delivery success rate

### **Weekly Maintenance**

- [ ] Review execution logs
- [ ] Check for any failed executions
- [ ] Verify email deliverability
- [ ] Adjust schedule if needed

---

## ✨ Alternative: EasyCron Setup

If you prefer EasyCron instead:

1. **Sign up**: https://www.easycron.com/user/register
2. **Create Cron Job**:
   - URL: `https://nexscholar.com/admin/trigger-message-notifications?token=YOUR_TOKEN`
   - Cron Expression: `0 9 * * *`
   - Timezone: Asia/Kuala_Lumpur
3. **Save and Enable**

Same configuration principles apply!

---

## 📞 Need Help?

If something isn't working:

1. Check Laravel logs: `storage/logs/laravel.log`
2. Test endpoint manually with curl/browser
3. Verify `.env` configuration
4. Check Cron-Job.org execution logs
5. Review this guide step-by-step

---

**Last Updated:** October 21, 2025  
**Status:** Production Ready ✅

