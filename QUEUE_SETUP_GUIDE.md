# Queue Setup Guide for Nexscholar

## Overview

The profile update system now uses **asynchronous queue processing** to improve performance and user experience. This guide will help you set up and run the queue worker.

## What Changed

### Before (Synchronous):
- ❌ Profile update took 30-60 seconds
- ❌ User saw loading screen forever
- ❌ No success alert appeared
- ✅ Data was saved (but user didn't know)

### After (Asynchronous):
- ✅ Profile update completes in 1-2 seconds
- ✅ User sees immediate success message
- ✅ AI processing happens in background
- ✅ Much better user experience

## Components Updated

1. **Backend Listeners** (Now Queued):
   - `app/Listeners/RegenerateUserEmbedding.php` - Generates AI embeddings
   - `app/Listeners/InvalidateUserInsights.php` - Clears cached insights

2. **Frontend Feedback**:
   - `resources/js/Pages/Role/Partials/AcademicianForm.jsx` - Better success message

## Setup Instructions

### Step 1: Verify Database Queue Table

Check if the `jobs` table exists in your database:

```sql
SHOW TABLES LIKE 'jobs';
```

If it doesn't exist, run migrations:

```bash
php artisan migrate
```

### Step 2: Configure Environment

Your `.env` file should have:

```env
QUEUE_CONNECTION=database
```

This is already set by default in `config/queue.php`.

### Step 3: Start the Queue Worker

You have three options:

#### Option A: Manual (Development)

Open a **new terminal/command prompt** and run:

```bash
php artisan queue:work --tries=3 --timeout=120
```

Keep this terminal open while developing. Press `Ctrl+C` to stop.

#### Option B: Using the Helper Script (Windows - Recommended for Development)

Double-click the `start-queue-worker.bat` file in the project root.

Or run from command prompt:

```bash
start-queue-worker.bat
```

#### Option C: Production with Supervisor (Linux Production Server)

Install Supervisor:

```bash
sudo apt-get install supervisor
```

Create configuration file at `/etc/supervisor/conf.d/nexscholar-worker.conf`:

```ini
[program:nexscholar-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /path/to/nexscholarsys/artisan queue:work database --sleep=3 --tries=3 --max-time=3600 --timeout=120
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/path/to/nexscholarsys/storage/logs/worker.log
stopwaitsecs=3600
```

Then:

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start nexscholar-worker:*
```

### Step 4: Verify It's Working

1. **Check Queue Worker is Running**:
   - You should see output like:
     ```
     [2025-10-02 15:30:01][1] Processing: App\Listeners\RegenerateUserEmbedding
     ```

2. **Test Profile Update**:
   - Update a user profile
   - You should see success alert immediately (1-2 seconds)
   - Check `storage/logs/laravel.log` for background job processing

3. **Check Jobs Table**:
   ```sql
   SELECT * FROM jobs ORDER BY id DESC LIMIT 10;
   ```
   - Should show pending jobs
   - Jobs will disappear once processed

4. **Check Failed Jobs** (if any):
   ```sql
   SELECT * FROM failed_jobs ORDER BY id DESC LIMIT 10;
   ```

## Monitoring

### View Logs

```bash
# Watch Laravel logs
tail -f storage/logs/laravel.log

# Watch worker output (if using supervisor)
tail -f storage/logs/worker.log
```

### Check Queue Status

```bash
# See failed jobs
php artisan queue:failed

# Retry failed jobs
php artisan queue:retry all

# Clear failed jobs
php artisan queue:flush
```

## Troubleshooting

### Issue: Queue Worker Stops Automatically

**Solution**: Use `--daemon` flag or Supervisor for production:

```bash
php artisan queue:work --daemon --tries=3 --timeout=120
```

### Issue: Jobs Not Processing

**Checklist**:
1. ✅ Queue worker is running?
2. ✅ `QUEUE_CONNECTION=database` in `.env`?
3. ✅ `jobs` table exists in database?
4. ✅ Check `storage/logs/laravel.log` for errors

### Issue: Embeddings Not Generated

**Check**:
1. Look for errors in `storage/logs/laravel.log`
2. Check failed jobs table:
   ```bash
   php artisan queue:failed
   ```
3. Check OpenAI API key is configured
4. Verify Qdrant service is running

### Issue: "Class not found" Error

**Solution**: Clear and rebuild cache:

```bash
composer dump-autoload
php artisan config:clear
php artisan cache:clear
php artisan queue:restart
```

## Performance Tuning

### For Heavy Load (Production)

Run multiple workers:

```bash
# Terminal 1
php artisan queue:work --queue=high --tries=3

# Terminal 2
php artisan queue:work --queue=default --tries=3

# Terminal 3
php artisan queue:work --queue=low --tries=3
```

### Priority Queues

Update listeners to use priority queues:

```php
class RegenerateUserEmbedding implements ShouldQueue
{
    public $queue = 'high'; // Process faster
}
```

## Development vs Production

| Aspect | Development | Production |
|--------|-------------|------------|
| **Queue Connection** | database | redis (recommended) |
| **Worker Management** | Manual `queue:work` | Supervisor |
| **Number of Workers** | 1 | 2-4 (based on load) |
| **Monitoring** | Terminal output | Log files + Horizon |
| **Restarts** | Manual | Automatic |

## Upgrading to Redis (Recommended for Production)

1. **Install Redis**:
   ```bash
   sudo apt-get install redis-server
   ```

2. **Update `.env`**:
   ```env
   QUEUE_CONNECTION=redis
   REDIS_HOST=127.0.0.1
   REDIS_PASSWORD=null
   REDIS_PORT=6379
   ```

3. **Install Laravel Horizon** (optional, for monitoring):
   ```bash
   composer require laravel/horizon
   php artisan horizon:install
   php artisan horizon
   ```

## Success Indicators

✅ Profile updates complete in 1-2 seconds
✅ Success alert appears immediately
✅ AI embeddings generate in background
✅ No timeout errors
✅ Better user experience

## Support

If you encounter issues:
1. Check logs: `storage/logs/laravel.log`
2. Check failed jobs: `php artisan queue:failed`
3. Restart queue worker: `Ctrl+C` then restart
4. Clear cache: `php artisan cache:clear`

---

**Last Updated**: October 2, 2025
**Nexscholar Version**: 1.0

