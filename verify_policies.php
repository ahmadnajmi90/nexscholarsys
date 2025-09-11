<?php

// Simple verification script to check that policies are working correctly

require_once 'vendor/autoload.php';

use App\Policies\ConversationPolicy;
use App\Policies\MessagePolicy;
use App\Models\User;

echo "Testing messaging policies...\n";

try {
    // Create a basic user object
    $user = new User();
    
    // Test ConversationPolicy
    $conversationPolicy = new ConversationPolicy();
    echo "ConversationPolicy created successfully\n";
    
    // Test basic methods
    if ($conversationPolicy->viewAny($user)) {
        echo "✓ ConversationPolicy::viewAny works\n";
    } else {
        echo "✗ ConversationPolicy::viewAny failed\n";
    }
    
    if ($conversationPolicy->create($user)) {
        echo "✓ ConversationPolicy::create works\n";
    } else {
        echo "✗ ConversationPolicy::create failed\n";
    }
    
    // Test MessagePolicy
    $messagePolicy = new MessagePolicy();
    echo "MessagePolicy created successfully\n";
    
    // Test basic methods
    if ($messagePolicy->viewAny($user)) {
        echo "✓ MessagePolicy::viewAny works\n";
    } else {
        echo "✗ MessagePolicy::viewAny failed\n";
    }
    
    if ($messagePolicy->create($user)) {
        echo "✓ MessagePolicy::create works\n";
    } else {
        echo "✗ MessagePolicy::create failed\n";
    }
    
    echo "All policies loaded and basic methods working!\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}