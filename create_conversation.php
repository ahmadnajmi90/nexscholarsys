<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Messaging\Conversation;
use App\Models\Messaging\ConversationParticipant;
use Illuminate\Support\Facades\DB;

try {
    DB::transaction(function () {
        // Create direct conversation
        $conversation = Conversation::create([
            'type' => 'direct',
            'title' => null,
            'created_by' => 45,
        ]);

        // Add creator as owner
        ConversationParticipant::create([
            'conversation_id' => $conversation->id,
            'user_id' => 45,
            'role' => 'owner',
            'joined_at' => now(),
        ]);

        // Add participant
        ConversationParticipant::create([
            'conversation_id' => $conversation->id,
            'user_id' => 50,
            'role' => 'member',
            'joined_at' => now(),
        ]);

        echo '✅ Created direct conversation with ID: ' . $conversation->id . PHP_EOL;
        echo '👥 Participants: User 45 (owner) and User 50 (member)' . PHP_EOL;
    });
} catch (Exception $e) {
    echo '❌ Error creating conversation: ' . $e->getMessage() . PHP_EOL;
}
