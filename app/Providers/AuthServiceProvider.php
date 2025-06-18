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
        //
    }
} 