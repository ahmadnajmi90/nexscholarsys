<?php

namespace Tests\Unit\Policies;

use App\Models\User;
use App\Models\Messaging\Conversation;
use App\Models\Messaging\ConversationParticipant;
use App\Policies\ConversationPolicy;
use Tests\TestCase;
use Mockery;

class ConversationPolicyTest extends TestCase
{
    private ConversationPolicy $policy;
    private User $user;
    private User $otherUser;
    private User $admin;
    private Conversation $conversation;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->policy = new ConversationPolicy();
        
        $this->user = Mockery::mock(User::class);
        $this->user->shouldReceive('getAttribute')->with('id')->andReturn(1);
        $this->user->shouldReceive('__get')->with('id')->andReturn(1);
        
        $this->otherUser = Mockery::mock(User::class);
        $this->otherUser->shouldReceive('getAttribute')->with('id')->andReturn(2);
        $this->otherUser->shouldReceive('__get')->with('id')->andReturn(2);
        
        $this->admin = Mockery::mock(User::class);
        $this->admin->shouldReceive('getAttribute')->with('id')->andReturn(3);
        $this->admin->shouldReceive('__get')->with('id')->andReturn(3);
        $this->admin->shouldReceive('isAn')->with('Admin')->andReturn(true);
        
        $this->conversation = Mockery::mock(Conversation::class);
        $this->conversation->shouldReceive('getAttribute')->with('id')->andReturn(1);
        $this->conversation->shouldReceive('__get')->with('id')->andReturn(1);
        $this->conversation->shouldReceive('getAttribute')->with('type')->andReturn('group');
        $this->conversation->shouldReceive('__get')->with('type')->andReturn('group');
    }

    public function test_view_any_allows_all_users(): void
    {
        $this->assertTrue($this->policy->viewAny($this->user));
        $this->assertTrue($this->policy->viewAny($this->otherUser));
    }

    public function test_view_allows_participants_only(): void
    {
        // Mock hasParticipant method
        $this->conversation->shouldReceive('hasParticipant')
            ->with(1)->andReturn(true);
        $this->conversation->shouldReceive('hasParticipant')
            ->with(2)->andReturn(false);

        $this->assertTrue($this->policy->view($this->user, $this->conversation));
        $this->assertFalse($this->policy->view($this->otherUser, $this->conversation));
    }

    public function test_create_allows_all_users(): void
    {
        $this->assertTrue($this->policy->create($this->user));
        $this->assertTrue($this->policy->create($this->otherUser));
    }

    public function test_update_allows_admins_only(): void
    {
        // Mock participant with admin privileges
        $adminParticipant = Mockery::mock(ConversationParticipant::class);
        $adminParticipant->shouldReceive('isActive')->andReturn(true);
        $adminParticipant->shouldReceive('hasAdminPrivileges')->andReturn(true);
        
        // Mock participant without admin privileges
        $memberParticipant = Mockery::mock(ConversationParticipant::class);
        $memberParticipant->shouldReceive('isActive')->andReturn(true);
        $memberParticipant->shouldReceive('hasAdminPrivileges')->andReturn(false);

        $this->conversation->shouldReceive('getParticipant')
            ->with(1)->andReturn($adminParticipant);
        $this->conversation->shouldReceive('getParticipant')
            ->with(2)->andReturn($memberParticipant);

        $this->assertTrue($this->policy->update($this->user, $this->conversation));
        $this->assertFalse($this->policy->update($this->otherUser, $this->conversation));
    }

    public function test_delete_allows_owners_only(): void
    {
        // Mock owner participant
        $ownerParticipant = Mockery::mock(ConversationParticipant::class);
        $ownerParticipant->shouldReceive('isActive')->andReturn(true);
        $ownerParticipant->role = 'owner';
        
        // Mock admin participant (not owner)
        $adminParticipant = Mockery::mock(ConversationParticipant::class);
        $adminParticipant->shouldReceive('isActive')->andReturn(true);
        $adminParticipant->role = 'admin';

        $this->conversation->shouldReceive('getParticipant')
            ->with(1)->andReturn($ownerParticipant);
        $this->conversation->shouldReceive('getParticipant')
            ->with(2)->andReturn($adminParticipant);

        $this->assertTrue($this->policy->delete($this->user, $this->conversation));
        $this->assertFalse($this->policy->delete($this->otherUser, $this->conversation));
    }

    public function test_add_participant_denied_for_direct_conversations(): void
    {
        $directConversation = Mockery::mock(Conversation::class);
        $directConversation->type = 'direct';

        $this->assertFalse($this->policy->addParticipant($this->user, $directConversation));
    }

    public function test_add_participant_allows_admins_for_group_conversations(): void
    {
        $adminParticipant = Mockery::mock(ConversationParticipant::class);
        $adminParticipant->shouldReceive('isActive')->andReturn(true);
        $adminParticipant->shouldReceive('hasAdminPrivileges')->andReturn(true);
        
        $memberParticipant = Mockery::mock(ConversationParticipant::class);
        $memberParticipant->shouldReceive('isActive')->andReturn(true);
        $memberParticipant->shouldReceive('hasAdminPrivileges')->andReturn(false);

        $this->conversation->shouldReceive('getParticipant')
            ->with(1)->andReturn($adminParticipant);
        $this->conversation->shouldReceive('getParticipant')
            ->with(2)->andReturn($memberParticipant);

        $this->assertTrue($this->policy->addParticipant($this->user, $this->conversation));
        $this->assertFalse($this->policy->addParticipant($this->otherUser, $this->conversation));
    }

    public function test_leave_allows_active_participants(): void
    {
        $activeParticipant = Mockery::mock(ConversationParticipant::class);
        $activeParticipant->shouldReceive('isActive')->andReturn(true);

        $this->conversation->shouldReceive('getParticipant')
            ->with(1)->andReturn($activeParticipant);
        $this->conversation->shouldReceive('getParticipant')
            ->with(2)->andReturn(null);

        $this->assertTrue($this->policy->leave($this->user, $this->conversation));
        $this->assertFalse($this->policy->leave($this->otherUser, $this->conversation));
    }

    public function test_moderate_allows_system_admins_only(): void
    {
        $this->user->shouldReceive('isAn')->with('Admin')->andReturn(false);
        
        $this->assertFalse($this->policy->moderate($this->user, $this->conversation));
        $this->assertTrue($this->policy->moderate($this->admin, $this->conversation));
    }

    public function test_force_delete_allows_system_admins_only(): void
    {
        $this->user->shouldReceive('isAn')->with('Admin')->andReturn(false);
        
        $this->assertFalse($this->policy->forceDelete($this->user, $this->conversation));
        $this->assertTrue($this->policy->forceDelete($this->admin, $this->conversation));
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }
}