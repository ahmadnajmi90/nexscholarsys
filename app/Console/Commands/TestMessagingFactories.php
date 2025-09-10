<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Messaging\Conversation;
use App\Models\Messaging\ConversationParticipant;
use App\Models\Messaging\Message;
use App\Models\Messaging\MessageAttachment;
use App\Models\User;

class TestMessagingFactories extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'messaging:test-factories';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test messaging model factories';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Testing messaging factories...');

        try {
            // Get or create a user
            $user = User::first();
            if (!$user) {
                $this->info('No users found. Creating one...');
                $user = User::factory()->create();
            }
            $this->info("Using user: {$user->name}");

            // Test Conversation factory
            $conversation = Conversation::factory()->create(['created_by' => $user->id]);
            $this->info("✓ Conversation created: ID {$conversation->id}, Type: {$conversation->type}");

            // Test ConversationParticipant factory
            $participant = ConversationParticipant::factory()->create([
                'conversation_id' => $conversation->id,
                'user_id' => $user->id
            ]);
            $this->info("✓ Participant created: Role {$participant->role}");

            // Test Message factory
            $message = Message::factory()->create([
                'conversation_id' => $conversation->id,
                'user_id' => $user->id
            ]);
            $this->info("✓ Message created: ID {$message->id}, Type: {$message->type}");

            // Test MessageAttachment factory  
            $attachment = MessageAttachment::factory()->create(['message_id' => $message->id]);
            $this->info("✓ Attachment created: {$attachment->mime} ({$attachment->human_size})");

            $this->info('');
            $this->info('All factories working correctly! ✅');

            return Command::SUCCESS;

        } catch (\Exception $e) {
            $this->error("❌ Error: " . $e->getMessage());
            $this->error("Trace: " . $e->getTraceAsString());
            
            return Command::FAILURE;
        }
    }
}
