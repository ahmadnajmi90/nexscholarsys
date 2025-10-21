# Nexscholar Custom Artisan Commands

This document provides a comprehensive reference for all custom Artisan commands in the Nexscholar platform.

---

## Table of Contents

1. [Embedding Generation Commands](#embedding-generation-commands)
2. [Qdrant Vector Database Commands](#qdrant-vector-database-commands)
3. [Google Scholar Integration Commands](#google-scholar-integration-commands)
4. [Data Maintenance Commands](#data-maintenance-commands)
5. [Messaging & Communication Commands](#messaging--communication-commands)
6. [Testing & Debugging Commands](#testing--debugging-commands)

---

## Embedding Generation Commands

These commands generate AI embeddings for semantic search functionality using OpenAI's text-embedding-3-small model.

### `embeddings:generate-academician`

Generate or regenerate embeddings for academicians for semantic search.

**Signature:**
```bash
php artisan embeddings:generate-academician {academician_id?} {--force} {--batch-size=20} {--complete-only}
```

**Arguments:**
- `academician_id` (optional): The ID of a specific academician to process

**Options:**
- `--force`: Force regeneration even if already embedded
- `--batch-size=20`: Number of academicians to process per batch
- `--complete-only`: Only process academicians with complete profiles

**Usage Examples:**
```bash
# Generate embeddings for all academicians needing them
php artisan embeddings:generate-academician

# Generate embedding for specific academician (ID: 123)
php artisan embeddings:generate-academician 123

# Force regenerate all embeddings with custom batch size
php artisan embeddings:generate-academician --force --batch-size=50

# Only process complete profiles
php artisan embeddings:generate-academician --complete-only
```

**When to Use:**
- After new academicians register
- When academician profiles are updated with research expertise
- During initial system setup
- After changes to embedding generation logic

---

### `embeddings:generate-student`

Generate embeddings for students (postgraduates and undergraduates) for semantic search.

**Signature:**
```bash
php artisan embeddings:generate-student {student_id?} {--type=both} {--force} {--batch-size=20} {--complete-only}
```

**Arguments:**
- `student_id` (optional): The ID of a specific student to process

**Options:**
- `--type=both`: Type of student (postgraduate, undergraduate, or both)
- `--force`: Force regeneration even if already embedded
- `--batch-size=20`: Number of students to process per batch
- `--complete-only`: Only process students with complete research profiles

**Usage Examples:**
```bash
# Generate embeddings for all students
php artisan embeddings:generate-student

# Generate for postgraduates only
php artisan embeddings:generate-student --type=postgraduate

# Generate for specific student (ID: 456)
php artisan embeddings:generate-student 456 --type=both

# Force regenerate with complete profiles only
php artisan embeddings:generate-student --force --complete-only
```

**When to Use:**
- After students complete their research interest profiles
- When student field_of_research data is updated
- During initial system setup
- After changes to student matching algorithms

---

### `embeddings:generate-postgraduate-programs`

Generate and store embeddings for all postgraduate programs.

**Signature:**
```bash
php artisan embeddings:generate-postgraduate-programs {--batch-size=100}
```

**Options:**
- `--batch-size=100`: Number of programs to process per chunk

**Usage Examples:**
```bash
# Generate embeddings for all programs
php artisan embeddings:generate-postgraduate-programs

# Process with custom batch size
php artisan embeddings:generate-postgraduate-programs --batch-size=50
```

**When to Use:**
- After importing postgraduate programs
- When program descriptions are updated
- During initial system setup
- To enable program recommendation features

---

### `embeddings:migrate-to-qdrant`

Migrate existing embeddings from MySQL to Qdrant vector database.

**Signature:**
```bash
php artisan embeddings:migrate-to-qdrant {--type=all} {--batch-size=50} {--retry-failed}
```

**Options:**
- `--type=all`: The type of embeddings to migrate (all, academicians, postgraduates, undergraduates)
- `--batch-size=50`: Number of embeddings to process per batch
- `--retry-failed`: Retry previously failed migrations

**Usage Examples:**
```bash
# Migrate all embeddings to Qdrant
php artisan embeddings:migrate-to-qdrant

# Migrate only academicians
php artisan embeddings:migrate-to-qdrant --type=academicians

# Retry failed migrations with custom batch size
php artisan embeddings:migrate-to-qdrant --retry-failed --batch-size=25
```

**When to Use:**
- During transition from MySQL-based to Qdrant-based vector search
- After recovering from Qdrant service interruptions
- When consolidating data after system upgrades

---

## Qdrant Vector Database Commands

Commands for managing the Qdrant vector database used for semantic search.

### `qdrant:setup`

Set up Qdrant collections for vector search.

**Signature:**
```bash
php artisan qdrant:setup
```

**Usage Example:**
```bash
# Initialize Qdrant collections
php artisan qdrant:setup
```

**When to Use:**
- During initial system deployment
- After Qdrant server reset
- When setting up new environments (staging, production)

**What It Does:**
- Tests connection to Qdrant server
- Creates academicians collection
- Creates students collection
- Creates postgraduate programs collection
- Verifies all collections are ready

---

### `qdrant:setup-indexes`

Create the necessary payload indexes in Qdrant collections.

**Signature:**
```bash
php artisan qdrant:setup-indexes
```

**Usage Example:**
```bash
# Create payload indexes for faster filtering
php artisan qdrant:setup-indexes
```

**When to Use:**
- After running `qdrant:setup`
- After data has been inserted into collections
- To optimize query performance

**Indexes Created:**
- **Academicians**: `unique_id`, `user_id`, `mysql_id`
- **Students**: `unique_id`, `user_id`, `mysql_id`
- **Programs**: `postgraduate_program_id`, `program_type`

---

### `qdrant:toggle`

Toggle Qdrant vector database usage for semantic search.

**Signature:**
```bash
php artisan qdrant:toggle {action=status} {--percentage=100}
```

**Arguments:**
- `action`: Action to perform (enable, disable, status, rollout)

**Options:**
- `--percentage=100`: Percentage of traffic to route to Qdrant (for rollout action)

**Usage Examples:**
```bash
# Check current status
php artisan qdrant:toggle status

# Enable Qdrant for all users
php artisan qdrant:toggle enable

# Disable Qdrant
php artisan qdrant:toggle disable

# Gradual rollout to 25% of users
php artisan qdrant:toggle rollout --percentage=25

# Full rollout
php artisan qdrant:toggle rollout --percentage=100
```

**When to Use:**
- During gradual feature rollout
- For A/B testing vector search
- Emergency rollback scenarios
- Monitoring system health during deployment

---

### `qdrant:clear`

Clear/empty Qdrant collections (delete all vectors but keep collection structure).

**Signature:**
```bash
php artisan qdrant:clear {collection?} {--force} {--dry-run}
```

**Arguments:**
- `collection` (optional): Specific collection to clear (academicians, students, programs, or all)

**Options:**
- `--force`: Force execution without confirmation
- `--dry-run`: Show what would be done without actually doing it

**Usage Examples:**
```bash
# Dry run to see what would be cleared
php artisan qdrant:clear all --dry-run

# Clear all collections with confirmation
php artisan qdrant:clear all

# Clear only academicians collection
php artisan qdrant:clear academicians --force

# Clear students collection
php artisan qdrant:clear students
```

**When to Use:**
- Before regenerating all embeddings
- When changing embedding models or dimensions
- After significant data schema changes
- During testing or development

**⚠️ Warning:** This deletes all vectors! You must regenerate embeddings afterward.

---

### `qdrant:cleanup`

Cleanup MySQL embedding data after Qdrant migration is complete.

**Signature:**
```bash
php artisan qdrant:cleanup {--force} {--dry-run} {--data-only}
```

**Options:**
- `--force`: Force execution without confirmation
- `--dry-run`: Show what would be done without actually doing it
- `--data-only`: Remove only embedding data, keep columns

**Usage Examples:**
```bash
# Dry run to preview changes
php artisan qdrant:cleanup --dry-run

# Clear embedding data but keep columns
php artisan qdrant:cleanup --data-only

# Completely remove embedding columns
php artisan qdrant:cleanup --force
```

**When to Use:**
- After successful full migration to Qdrant
- To reclaim MySQL storage space
- When certain Qdrant is working correctly
- Only when `QDRANT_ROLLOUT_PERCENTAGE=100`

**⚠️ Warning:** This is irreversible! Ensure Qdrant is fully operational first.

---

### `qdrant:rebuild-collections`

Delete and rebuild Qdrant collections with new standardized schema.

**Signature:**
```bash
php artisan qdrant:rebuild-collections {--force}
```

**Options:**
- `--force`: Force rebuild without confirmation

**Usage Example:**
```bash
# Rebuild all collections (requires confirmation)
php artisan qdrant:rebuild-collections

# Force rebuild without confirmation
php artisan qdrant:rebuild-collections --force
```

**When to Use:**
- After major schema changes
- When consolidating multiple fixes
- During major version upgrades
- To reset and regenerate all embeddings

**What It Does:**
1. Deletes existing collections
2. Sets up new indexes with standardized schema
3. Regenerates all academician embeddings
4. Regenerates all student embeddings
5. Regenerates all program embeddings

---

### `qdrant:test`

Test Qdrant vector operations with UUID format.

**Signature:**
```bash
php artisan qdrant:test
```

**Usage Example:**
```bash
# Test Qdrant connectivity and operations
php artisan qdrant:test
```

**When to Use:**
- Verifying Qdrant setup
- Debugging connection issues
- Testing after configuration changes
- Validating UUID conversion logic

---

## Google Scholar Integration Commands

Commands for synchronizing academician data with Google Scholar profiles.

### `scholar:sync-batch`

Sync a batch of Google Scholar profiles.

**Signature:**
```bash
php artisan scholar:sync-batch {--limit=10} {--force}
```

**Options:**
- `--limit=10`: Number of profiles to process
- `--force`: Force sync even if recently updated

**Usage Examples:**
```bash
# Sync 10 oldest profiles
php artisan scholar:sync-batch

# Sync 50 profiles
php artisan scholar:sync-batch --limit=50

# Force sync regardless of last update
php artisan scholar:sync-batch --limit=20 --force
```

**When to Use:**
- Regular scheduled updates (daily/weekly)
- Processing small batches to avoid rate limits
- Testing Google Scholar integration

**Note:** Jobs are queued with 1-second delays to avoid rate limiting.

---

### `scholar:sync-full`

Synchronize ALL academicians with Google Scholar profiles.

**Signature:**
```bash
php artisan scholar:sync-full {--chunk=25} {--delay=10}
```

**Options:**
- `--chunk=25`: Number of academicians to process per batch
- `--delay=10`: Seconds to delay between batches

**Usage Examples:**
```bash
# Full sync with default settings
php artisan scholar:sync-full

# Faster sync with larger chunks
php artisan scholar:sync-full --chunk=50 --delay=5

# Slow, conservative sync
php artisan scholar:sync-full --chunk=10 --delay=30
```

**When to Use:**
- Initial data import
- Annual full refresh
- After long periods without updates
- System-wide data reconciliation

**⚠️ Warning:** This processes ALL profiles and may take hours to complete.

---

### `scholar:sync-scheduled`

Scheduled sync of Google Scholar profiles based on last update time.

**Signature:**
```bash
php artisan scholar:sync-scheduled {--days=7} {--batch=20}
```

**Options:**
- `--days=7`: Days since last update to consider for resync
- `--batch=20`: Maximum number of profiles to update per run

**Usage Examples:**
```bash
# Sync profiles not updated in past 7 days
php artisan scholar:sync-scheduled

# Sync profiles older than 30 days
php artisan scholar:sync-scheduled --days=30

# Sync 50 oldest profiles
php artisan scholar:sync-scheduled --batch=50 --days=14
```

**When to Use:**
- Daily automated scheduler runs
- Keeping data fresh with minimal overhead
- Prioritizing outdated profiles

**Recommended Cron Schedule:**
```bash
# Run daily at 2 AM
0 2 * * * cd /path/to/project && php artisan scholar:sync-scheduled
```

---

## Data Maintenance Commands

Commands for maintaining and cleaning up data in the system.

### `phone:normalize`

Normalize stored Malaysian phone numbers to E.164 format using libphonenumber.

**Signature:**
```bash
php artisan phone:normalize {table?} {--dry-run} {--chunk=500} {--log=}
```

**Arguments:**
- `table` (optional): Specific table to normalize (academicians, postgraduates, undergraduates)

**Options:**
- `--dry-run`: Only display what would change
- `--chunk=500`: Number of rows to process per batch
- `--log=`: Optional path to log file for failures

**Usage Examples:**
```bash
# Dry run to preview changes
php artisan phone:normalize --dry-run

# Normalize all tables
php artisan phone:normalize

# Normalize only academicians
php artisan phone:normalize academicians

# Normalize with logging
php artisan phone:normalize --log=storage/logs/phone-normalize.log
```

**When to Use:**
- After bulk imports with inconsistent phone formats
- Data cleanup initiatives
- Before enabling SMS notifications
- Ensuring consistent international format (+60...)

---

### `app:generate-profile-urls`

Generate SEO-friendly URL slugs for user profiles.

**Signature:**
```bash
php artisan app:generate-profile-urls
```

**Usage Example:**
```bash
# Generate URLs for all profiles without them
php artisan app:generate-profile-urls
```

**When to Use:**
- After new user registrations
- Enabling SEO-friendly URLs for the first time
- Fixing missing URL slugs
- After bulk data imports

**What It Does:**
- Generates URL slugs from full names
- Ensures uniqueness by appending numbers if needed
- Processes academicians, postgraduates, and undergraduates

---

### `app:sync-academician-views`

Synchronize total_views for academicians based on view counts in academician_views table.

**Signature:**
```bash
php artisan app:sync-academician-views
```

**Usage Example:**
```bash
# Synchronize view counts
php artisan app:sync-academician-views
```

**When to Use:**
- After database recovery
- Fixing view count discrepancies
- Regular data integrity checks
- After migrating view tracking systems

---

### `app:update-post-views-count`

Update content total_views based on view tracking tables.

**Signature:**
```bash
php artisan app:update-post-views-count
```

**Usage Example:**
```bash
# Update all content view counts
php artisan app:update-post-views-count
```

**When to Use:**
- Regular scheduled maintenance
- After view tracking table cleanup
- Fixing content popularity metrics
- Data integrity verification

**Updates:**
- Posts view counts
- Events view counts
- Projects view counts
- Grants view counts

---

## Testing & Debugging Commands

Commands for testing various system components.

### `test:embeddings`

Test the embeddings service with OpenAI API.

**Signature:**
```bash
php artisan test:embeddings {text?}
```

**Arguments:**
- `text` (optional): The text to generate an embedding for

**Usage Examples:**
```bash
# Test with default text
php artisan test:embeddings

# Test with custom text
php artisan test:embeddings "Machine learning and artificial intelligence research"
```

**When to Use:**
- Verifying OpenAI API key configuration
- Testing embedding generation
- Debugging embedding service issues
- Validating API connectivity

---

### `messaging:test-factories`

Test messaging model factories.

**Signature:**
```bash
php artisan messaging:test-factories
```

**Usage Example:**
```bash
# Test all messaging factories
php artisan messaging:test-factories
```

**When to Use:**
- Verifying messaging system setup
- Testing database relationships
- Development environment validation
- Before running messaging feature tests

**Tests:**
- Conversation creation
- Participant assignment
- Message sending
- Attachment handling

---

## Messaging & Communication Commands

### `messages:send-email-notifications`

Send email notifications to inactive users with unread messages.

**Signature:**
```bash
php artisan messages:send-email-notifications {--days=7} {--dry-run}
```

**Options:**
- `--days=7`: Number of days of inactivity before sending email (default: 7)
- `--dry-run`: Show what would be sent without actually sending emails

**Usage Examples:**
```bash
# Test mode (no emails sent)
php artisan messages:send-email-notifications --dry-run

# Send actual emails to users inactive for 7 days
php artisan messages:send-email-notifications

# Custom inactivity period (3 days)
php artisan messages:send-email-notifications --days=3
```

**When to Use:**
- Scheduled daily execution (recommended: 9:00 AM)
- Re-engaging inactive users with pending messages
- Improving platform communication and response rates
- Testing email notification system

**What It Does:**
1. Finds users who haven't logged in for X days (default: 7)
2. Checks if they have unread messages in any conversation
3. Ensures they haven't been emailed in the last 24 hours
4. Sends personalized email with:
   - Total unread message count
   - Names of people who sent messages
   - Direct link to messaging page
5. Updates `last_message_email_sent_at` timestamp
6. Queues emails for background processing

**Console Output:**
- Detailed processing log for each user
- Summary table showing:
  - Users found with unread messages
  - Emails successfully sent
  - Emails skipped or failed
- Real-time progress indicator

**Scheduled Execution:**
This command runs automatically daily at 9:00 AM (Asia/Kuala_Lumpur timezone) via Laravel scheduler. See `routes/console.php` for configuration.

**Configuration Requirements:**
- Proper email settings in `.env` (SMTP configuration)
- Laravel scheduler running via cron job
- Queue worker active for email processing
- `last_message_email_sent_at` column in users table

**Error Handling:**
- Failed emails are logged but don't stop processing
- Individual user errors don't affect other users
- Comprehensive logging in `storage/logs/laravel.log`

**Rate Limiting:**
- Maximum 1 email per 24 hours per user
- Configurable inactivity threshold (--days option)
- Smart detection prevents spam

**Email Content:**
Recipients receive an email with:
- Personalized greeting with full name
- Total unread message count
- List of sender names (formatted: "John, Jane, and 2 others")
- Call-to-action button linking to /messaging
- Professional signature from Nexscholar Team

---

## Common Workflows

### Initial System Setup

```bash
# 1. Setup Qdrant collections
php artisan qdrant:setup

# 2. Create indexes
php artisan qdrant:setup-indexes

# 3. Generate profile URLs
php artisan app:generate-profile-urls

# 4. Normalize phone numbers
php artisan phone:normalize

# 5. Generate embeddings for all users
php artisan embeddings:generate-academician --complete-only
php artisan embeddings:generate-student --type=both --complete-only
php artisan embeddings:generate-postgraduate-programs

# 6. Enable Qdrant gradually
php artisan qdrant:toggle rollout --percentage=10
```

---

### Embedding Regeneration After Changes

```bash
# 1. Clear existing embeddings
php artisan qdrant:clear all --force

# 2. Regenerate all embeddings
php artisan embeddings:generate-academician --force --batch-size=50
php artisan embeddings:generate-student --force --batch-size=50
php artisan embeddings:generate-postgraduate-programs --batch-size=100

# 3. Verify Qdrant setup
php artisan qdrant:test
```

---

### Regular Maintenance Schedule

**Daily (2:00 AM):**
```bash
# Sync Google Scholar profiles not updated in 7 days
0 2 * * * php artisan scholar:sync-scheduled --days=7 --batch=20
```

**Daily (9:00 AM):**
```bash
# Send message email notifications to inactive users
0 9 * * * php artisan messages:send-email-notifications
```

**Weekly (Sunday 3:00 AM):**
```bash
# Sync view counts
0 3 * * 0 php artisan app:sync-academician-views
0 3 * * 0 php artisan app:update-post-views-count

# Generate new embeddings for updated profiles
0 4 * * 0 php artisan embeddings:generate-academician --batch-size=50
0 5 * * 0 php artisan embeddings:generate-student --batch-size=50
```

**Monthly (1st day, 1:00 AM):**
```bash
# Full Google Scholar sync
0 1 1 * * php artisan scholar:sync-full --chunk=25 --delay=10
```

---

## Troubleshooting

### Qdrant Connection Issues

```bash
# Check Qdrant status
php artisan qdrant:toggle status

# Test connectivity
php artisan qdrant:test

# Verify collections
php artisan qdrant:setup
```

### Embedding Generation Failures

```bash
# Test OpenAI API
php artisan test:embeddings "Test research interests"

# Check logs
tail -f storage/logs/laravel.log

# Regenerate with verbose output
php artisan embeddings:generate-academician 123 --force
```

### Performance Issues

```bash
# Reduce batch sizes
php artisan embeddings:generate-academician --batch-size=10

# Process in smaller chunks
php artisan scholar:sync-full --chunk=10 --delay=20
```

---

## Environment Variables

Important environment variables used by these commands:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Qdrant Configuration
QDRANT_URL=your_qdrant_cloud_cluster_url
QDRANT_API_KEY=your_qdrant_cloud_api_key
QDRANT_ENABLED=true
QDRANT_ROLLOUT_PERCENTAGE=100
QDRANT_VECTOR_SIZE=1536

# Collection Names
QDRANT_ACADEMICIANS_COLLECTION=nexscholar_academicians
QDRANT_STUDENTS_COLLECTION=nexscholar_students
QDRANT_POSTGRADUATE_PROGRAMS_COLLECTION=nexscholar_postgraduate_programs
```

---

## Best Practices

1. **Always use `--dry-run` first** for destructive operations
2. **Monitor logs** during long-running operations
3. **Use batch sizes appropriate** for your server resources
4. **Schedule maintenance** during low-traffic periods
5. **Test in staging** before production deployment
6. **Keep backups** before major data operations
7. **Gradual rollouts** for new features (use `qdrant:toggle rollout`)
8. **Clear cache** after configuration changes

---

## Getting Help

For any command, use the `--help` flag:
```bash
php artisan embeddings:generate-academician --help
```

For system-wide command list:
```bash
php artisan list
```

---

**Last Updated:** October 2025  
**Version:** 1.0  
**Platform:** Nexscholar Academic Research Platform
