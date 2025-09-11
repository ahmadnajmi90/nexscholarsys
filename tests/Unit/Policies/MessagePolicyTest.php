<?php

namespace Tests\Unit\Policies;

use App\Models\User;
use App\Models\Messaging\Conversation;
use App\Models\Messaging\Message;
use App\Models\Messaging\ConversationParticipant;
use App\Policies\MessagePolicy;
use Tests\TestCase;
use Carbon\Carbon;
use Mockery;

class MessagePolicyTest extends TestCase
{
    private MessagePolicy $policy;
    private User $user;
    private User $otherUser;
    private User $admin;
    private Conversation $conversation;
    private Message $message;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->policy = new MessagePolicy();
        $this->user = Mockery::mock(User::class);
        $this->user->id = 1;
        
        $this->otherUser = Mockery::mock(User::class);
        $this->otherUser->id = 2;
        
        $this->admin = Mockery::mock(User::class);
        $this->admin->id = 3;
        $this->admin->shouldReceive('isAn')->with('Admin')->andReturn(true);
        
        $this->conversation = Mockery::mock(Conversation::class);
        $this->conversation->id = 1;
        
        $this->message = Mockery::mock(Message::class);
        $this->message->id = 1;
        $this->message->user_id = 1;
        $this->message->conversation = $this->conversation;
    }

    public function test_view_any_allows_all_users(): void
    {
        $this->assertTrue($this->policy->viewAny($this->user));
        $this->assertTrue($this->policy->viewAny($this->otherUser));
    }

    public function test_view_allows_conversation_participants_only(): void
    {
        $this->conversation->shouldReceive('hasParticipant')
            ->with(1)->andReturn(true);
        $this->conversation->shouldReceive('hasParticipant')
            ->with(2)->andReturn(false);

        $this->assertTrue($this->policy->view($this->user, $this->message));
        $this->assertFalse($this->policy->view($this->otherUser, $this->message));
    }

    public function test_create_allows_all_users(): void
    {
        $this->assertTrue($this->policy->create($this->user));
        $this->assertTrue($this->policy->create($this->otherUser));
    }

    public function test_send_allows_active_participants_only(): void
    {
        $activeParticipant = Mockery::mock(ConversationParticipant::class);
        $activeParticipant->shouldReceive('isActive')->andReturn(true);
        
        $inactiveParticipant = Mockery::mock(ConversationParticipant::class);
        $inactiveParticipant->shouldReceive('isActive')->andReturn(false);

        $this->conversation->shouldReceive('getParticipant')
            ->with(1)->andReturn($activeParticipant);
        $this->conversation->shouldReceive('getParticipant')
            ->with(2)->andReturn($inactiveParticipant);

        $this->assertTrue($this->policy->send($this->user, $this->conversation));
        $this->assertFalse($this->policy->send($this->otherUser, $this->conversation));
    }

    public function test_update_allows_sender_within_edit_window(): void
    {
        // Recent message (within edit window)
        $recentMessage = Mockery::mock(Message::class);
        $recentMessage->user_id = 1;
        $recentMessage->shouldReceive('canBeEditedBy')->with(1)->andReturn(true);
        
        // Old message (outside edit window)
        $oldMessage = Mockery::mock(Message::class);
        $oldMessage->user_id = 1;
        $oldMessage->shouldReceive('canBeEditedBy')->with(1)->andReturn(false);
        
        // Message from other user
        $otherMessage = Mockery::mock(Message::class);
        $otherMessage->user_id = 2;

        $this->assertTrue($this->policy->update($this->user, $recentMessage));
        $this->assertFalse($this->policy->update($this->user, $oldMessage));
        $this->assertFalse($this->policy->update($this->user, $otherMessage));
    }

    public function test_delete_allows_system_admins(): void
    {
        $this->assertTrue($this->policy->delete($this->admin, $this->message));
    }

    public function test_delete_allows_conversation_admins(): void
    {
        $this->admin->shouldReceive('isAn')->with('Admin')->andReturn(false);
        
        $adminParticipant = Mockery::mock(ConversationParticipant::class);
        $adminParticipant->shouldReceive('hasAdminPrivileges')->andReturn(true);
        
        $this->conversation->shouldReceive('getParticipant')
            ->with(3)->andReturn($adminParticipant);

        $this->assertTrue($this->policy->delete($this->admin, $this->message));
    }

    public function test_delete_allows_sender_within_delete_window(): void
    {
        $this->user->shouldReceive('isAn')->with('Admin')->andReturn(false);
        
        // Recent message (within delete window)
        $recentMessage = Mockery::mock(Message::class);
        $recentMessage->user_id = 1;
        $recentMessage->conversation = $this->conversation;
        $recentMessage->shouldReceive('canBeDeletedBy')->with(1)->andReturn(true);
        
        // Old message (outside delete window)
        $oldMessage = Mockery::mock(Message::class);
        $oldMessage->user_id = 1;
        $oldMessage->conversation = $this->conversation;
        $oldMessage->shouldReceive('canBeDeletedBy')->with(1)->andReturn(false);
        
        $this->conversation->shouldReceive('getParticipant')
            ->with(1)->andReturn(null); // No admin privileges

        $this->assertTrue($this->policy->delete($this->user, $recentMessage));
        $this->assertFalse($this->policy->delete($this->user, $oldMessage));
    }

    public function test_reply_allows_conversation_participants(): void
    {
        $this->conversation->shouldReceive('hasParticipant')
            ->with(1)->andReturn(true);
        $this->conversation->shouldReceive('hasParticipant')
            ->with(2)->andReturn(false);

        $this->assertTrue($this->policy->reply($this->user, $this->message));
        $this->assertFalse($this->policy->reply($this->otherUser, $this->message));
    }

    public function test_react_allows_conversation_participants(): void
    {
        $this->conversation->shouldReceive('hasParticipant')
            ->with(1)->andReturn(true);
        $this->conversation->shouldReceive('hasParticipant')
            ->with(2)->andReturn(false);

        $this->assertTrue($this->policy->react($this->user, $this->message));
        $this->assertFalse($this->policy->react($this->otherUser, $this->message));
    }

    public function test_moderate_allows_system_admins(): void
    {
        $this->user->shouldReceive('isAn')->with('Admin')->andReturn(false);
        
        $this->assertTrue($this->policy->moderate($this->admin, $this->message));
        $this->assertFalse($this->policy->moderate($this->user, $this->message));
    }

    public function test_moderate_allows_conversation_admins(): void
    {
        $this->user->shouldReceive('isAn')->with('Admin')->andReturn(false);
        
        $adminParticipant = Mockery::mock(ConversationParticipant::class);
        $adminParticipant->shouldReceive('hasAdminPrivileges')->andReturn(true);
        
        $this->conversation->shouldReceive('getParticipant')
            ->with(1)->andReturn($adminParticipant);

        $this->assertTrue($this->policy->moderate($this->user, $this->message));
    }

    public function test_force_delete_allows_system_admins_only(): void
    {
        $this->user->shouldReceive('isAn')->with('Admin')->andReturn(false);
        
        $this->assertTrue($this->policy->forceDelete($this->admin, $this->message));
        $this->assertFalse($this->policy->forceDelete($this->user, $this->message));
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }
}