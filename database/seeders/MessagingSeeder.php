<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Messaging\Conversation;
use App\Models\Messaging\ConversationParticipant;
use App\Models\Messaging\Message;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class MessagingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Creating demo users for messaging...');

        // Create demo users
        $users = $this->createDemoUsers();

        $this->command->info('Creating conversations...');

        // Create direct conversation between first two users
        $directConversation = $this->createDirectConversation($users[0], $users[1]);

        // Create group conversation with all users
        $groupConversation = $this->createGroupConversation($users);

        $this->command->info('Generating messages for pagination testing...');

        // Generate ~500 messages for direct conversation
        $this->generateMessages($directConversation, $users, 500);

        // Generate ~500 messages for group conversation
        $this->generateMessages($groupConversation, $users, 500);

        $this->command->info('Messaging seeder completed!');
        $this->command->info("Created: {$users->count()} users, 2 conversations, ~1000 messages");
        $this->command->info("Direct conversation: {$users[0]->name} ↔ {$users[1]->name}");
        $this->command->info("Group conversation: {$groupConversation->title}");
    }

    /**
     * Create demo users for messaging
     */
    private function createDemoUsers()
    {
        $demoUsers = [
            [
                'name' => 'Alice Johnson',
                'email' => 'alice@example.com',
                'role' => 'Academician',
            ],
            [
                'name' => 'Bob Smith',
                'email' => 'bob@example.com',
                'role' => 'Postgraduate',
            ],
            [
                'name' => 'Carol Williams',
                'email' => 'carol@example.com',
                'role' => 'Undergraduate',
            ],
            [
                'name' => 'David Brown',
                'email' => 'david@example.com',
                'role' => 'Academician',
            ],
            [
                'name' => 'Eva Davis',
                'email' => 'eva@example.com',
                'role' => 'Industry',
            ],
        ];

        $users = collect();

        foreach ($demoUsers as $userData) {
            $user = User::create([
                'name' => $userData['name'],
                'email' => $userData['email'],
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $users->push($user);
        }

        return $users;
    }

    /**
     * Create a direct conversation between two users
     */
    private function createDirectConversation(User $user1, User $user2)
    {
        $conversation = Conversation::create([
            'type' => 'direct',
            'title' => null,
            'created_by' => $user1->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Add participants
        ConversationParticipant::create([
            'conversation_id' => $conversation->id,
            'user_id' => $user1->id,
            'role' => 'member',
            'joined_at' => now(),
        ]);

        ConversationParticipant::create([
            'conversation_id' => $conversation->id,
            'user_id' => $user2->id,
            'role' => 'member',
            'joined_at' => now(),
        ]);

        return $conversation;
    }

    /**
     * Create a group conversation with multiple users
     */
    private function createGroupConversation($users)
    {
        $conversation = Conversation::create([
            'type' => 'group',
            'title' => 'Research Team Discussion',
            'created_by' => $users->first()->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Add all users as participants
        foreach ($users as $user) {
            ConversationParticipant::create([
                'conversation_id' => $conversation->id,
                'user_id' => $user->id,
                'role' => $user === $users->first() ? 'owner' : 'member',
                'joined_at' => now(),
            ]);
        }

        return $conversation;
    }

    /**
     * Generate messages for a conversation
     */
    private function generateMessages(Conversation $conversation, $users, int $count = 500)
    {
        $sampleMessages = [
            "Hey everyone, how's the research going?",
            "I found an interesting paper on machine learning applications in healthcare.",
            "The conference deadline is approaching, we should start preparing our abstract.",
            "Does anyone have experience with statistical analysis tools?",
            "I think we should collaborate on the literature review section.",
            "The methodology looks solid, but we might need more data points.",
            "Let's schedule a meeting to discuss the results.",
            "I can help with the data visualization if needed.",
            "The peer review process is taking longer than expected.",
            "Great work on the introduction section!",
            "I have some questions about the experimental setup.",
            "The results are very promising, well done team!",
            "We should consider publishing in a higher impact journal.",
            "The funding application is due next month.",
            "Let's review the budget allocation for next quarter.",
            "The collaboration with the other university is going well.",
            "I found a potential research gap we could explore.",
            "The data collection phase is almost complete.",
            "We need to update our research objectives.",
            "Excellent presentation at the last meeting!",
        ];

        $messages = [];

        // Generate messages over the last 30 days
        $startDate = Carbon::now()->subDays(30);
        $endDate = Carbon::now();

        for ($i = 0; $i < $count; $i++) {
            $randomUser = $users->random();
            $randomMessage = $sampleMessages[array_rand($sampleMessages)];
            $createdAt = $startDate->copy()->addMinutes($i * 60); // One message per hour

            // Ensure we don't go beyond end date
            if ($createdAt->isAfter($endDate)) {
                $createdAt = $endDate->copy()->subMinutes(rand(0, 1440)); // Random time in last 24 hours
            }

            $message = Message::create([
                'conversation_id' => $conversation->id,
                'user_id' => $randomUser->id,
                'type' => 'text',
                'body' => $randomMessage . " (Message #" . ($i + 1) . ")",
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ]);

            $messages[] = $message;
        }

        // Update conversation's last_message_id
        if (!empty($messages)) {
            $conversation->update([
                'last_message_id' => collect($messages)->last()->id
            ]);

            // Mark some messages as read by participants (simulate real usage)
            $this->simulateReadReceipts($conversation, $messages, $users);
        }

        return $messages;
    }

    /**
     * Simulate read receipts for realistic testing
     */
    private function simulateReadReceipts(Conversation $conversation, array $messages, $users)
    {
        $participants = $conversation->participants;

        foreach ($participants as $participant) {
            // Simulate that users have read up to a random point (80-100% of messages)
            $readUpTo = rand((int)(count($messages) * 0.8), count($messages) - 1);
            if ($readUpTo >= 0 && isset($messages[$readUpTo])) {
                $participant->markAsRead($messages[$readUpTo]->id);
            }
        }
    }
}
