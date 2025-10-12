<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use App\Models\Workspace;
use App\Policies\WorkspacePolicy;
use App\Models\Board;
use App\Policies\BoardPolicy;
use App\Models\BoardList;
use App\Policies\BoardListPolicy;
use App\Models\Task;
use App\Policies\TaskPolicy;
use App\Models\Connection;
use App\Policies\ConnectionPolicy;
use App\Models\Project;
use App\Policies\ProjectPolicy;
use App\Models\Messaging\Conversation;
use App\Policies\Messaging\ConversationPolicy;
use App\Models\Messaging\Message;
use App\Policies\Messaging\MessagePolicy;
use App\Models\SupervisionRequest;
use App\Policies\SupervisionPolicy;
use App\Models\SupervisionRelationship;
use App\Policies\SupervisionRelationshipPolicy;
use App\Models\SupervisionMeeting;
use App\Policies\SupervisionMeetingPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // ... existing policies ...
        Workspace::class => WorkspacePolicy::class,
        Board::class => BoardPolicy::class,
        BoardList::class => BoardListPolicy::class,
        Task::class => TaskPolicy::class,
        Connection::class => ConnectionPolicy::class,
        Project::class => ProjectPolicy::class,
        Conversation::class => ConversationPolicy::class,
        Message::class => MessagePolicy::class,
        SupervisionRequest::class => SupervisionPolicy::class,
        SupervisionRelationship::class => SupervisionRelationshipPolicy::class,
        SupervisionMeeting::class => SupervisionMeetingPolicy::class,
    ];

    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        // ✅ Belt-and-suspenders explicit mapping
        Gate::policy(Conversation::class, ConversationPolicy::class);
        Gate::policy(Message::class, MessagePolicy::class);

        // Log policy mappings for debugging
        $convPolicy = Gate::getPolicyFor(Conversation::class);
        $messagePolicy = Gate::getPolicyFor(Message::class);
    }
} 