<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Messaging\Conversation;
use App\Mail\UnreadMessagesNotification;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class SendMessageEmailNotifications extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'messages:send-email-notifications 
                            {--days=7 : Number of days of inactivity before sending email}
                            {--dry-run : Show what would be sent without actually sending}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send email notifications to inactive users with unread messages';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔔 Starting message email notification job...');
        $this->newLine();
        
        $inactiveDays = (int) $this->option('days');
        $dryRun = $this->option('dry-run');
        $cutoffDate = Carbon::now()->subDays($inactiveDays);
        
        $this->info("⏱️  Looking for users inactive since: {$cutoffDate->format('Y-m-d H:i:s')}");
        $this->newLine();
        
        // Find inactive users with unread messages
        $usersToNotify = $this->findInactiveUsersWithUnreadMessages($cutoffDate);
        
        if ($usersToNotify->isEmpty()) {
            $this->info('✅ No users to notify. All caught up!');
            return 0;
        }
        
        $this->info("📧 Found {$usersToNotify->count()} user(s) to notify");
        $this->newLine();
        
        $emailsSent = 0;
        $emailsSkipped = 0;
        
        foreach ($usersToNotify as $userData) {
            $user = $userData['user'];
            $unreadCount = $userData['unread_count'];
            $senders = $userData['senders'];
            
            $this->line("👤 Processing: {$user->full_name} ({$user->email})");
            $this->line("   └─ {$unreadCount} unread message(s) from: " . implode(', ', $senders));
            
            if ($dryRun) {
                $this->warn('   └─ [DRY RUN] Would send email');
                $emailsSkipped++;
            } else {
                try {
                    Mail::to($user->email)->send(
                        new UnreadMessagesNotification($user, $unreadCount, $senders)
                    );
                    
                    $user->update(['last_message_email_sent_at' => now()]);
                    
                    $this->info('   └─ ✓ Email sent successfully');
                    $emailsSent++;
                    
                    Log::info("Message email notification sent to user {$user->id}", [
                        'user_id' => $user->id,
                        'email' => $user->email,
                        'unread_count' => $unreadCount,
                        'senders' => $senders,
                    ]);
                    
                } catch (\Exception $e) {
                    $this->error("   └─ ✗ Failed to send email: {$e->getMessage()}");
                    $emailsSkipped++;
                    
                    Log::error("Failed to send message email notification to user {$user->id}", [
                        'user_id' => $user->id,
                        'email' => $user->email,
                        'error' => $e->getMessage(),
                    ]);
                }
            }
            
            $this->newLine();
        }
        
        $this->newLine();
        $this->info('📊 Summary:');
        $this->table(
            ['Metric', 'Count'],
            [
                ['Users Found', $usersToNotify->count()],
                ['Emails Sent', $emailsSent],
                ['Skipped/Failed', $emailsSkipped],
            ]
        );
        
        $this->newLine();
        $this->info('✅ Job completed successfully!');
        
        return 0;
    }

    /**
     * Find inactive users who have unread messages and haven't been notified recently.
     */
    protected function findInactiveUsersWithUnreadMessages(Carbon $cutoffDate)
    {
        $users = User::where('last_seen_at', '<', $cutoffDate)
            ->where(function ($query) {
                $query->whereNull('last_message_email_sent_at')
                      ->orWhere('last_message_email_sent_at', '<', now()->subDay());
            })
            ->get();
        
        $usersToNotify = collect();
        
        foreach ($users as $user) {
            // Get all conversations for this user
            $conversations = Conversation::whereHas('participants', function ($query) use ($user) {
                $query->where('user_id', $user->id)->whereNull('left_at');
            })->with(['participants.user', 'messages'])->get();
            
            $totalUnread = 0;
            $senderIds = [];
            
            foreach ($conversations as $conversation) {
                $unreadCount = $conversation->getUnreadCountForUser($user->id);
                
                if ($unreadCount > 0) {
                    $totalUnread += $unreadCount;
                    
                    // Get senders of unread messages
                    $participant = $conversation->getParticipant($user->id);
                    $lastReadMessageId = $participant->last_read_message_id ?? 0;
                    
                    $unreadSenders = $conversation->messages()
                        ->where('id', '>', $lastReadMessageId)
                        ->where('user_id', '!=', $user->id)
                        ->distinct()
                        ->pluck('user_id')
                        ->toArray();
                    
                    $senderIds = array_merge($senderIds, $unreadSenders);
                }
            }
            
            if ($totalUnread > 0) {
                $senderIds = array_unique($senderIds);
                
                // Load full User models with their relationships to access full_name accessor
                $senders = User::whereIn('id', $senderIds)
                    ->with(['academician', 'postgraduate', 'undergraduate'])
                    ->get();
                    
                $senderNames = $senders->map(function ($sender) {
                    return $sender->full_name;
                })->toArray();
                
                $usersToNotify->push([
                    'user' => $user,
                    'unread_count' => $totalUnread,
                    'senders' => $senderNames,
                ]);
            }
        }
        
        return $usersToNotify;
    }
}
