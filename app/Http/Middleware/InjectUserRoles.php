<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Silber\Bouncer\BouncerFacade;

class InjectUserRoles
{
    public function handle($request, Closure $next)
    {
        $user = Auth::user();

        // Share role information with all Inertia responses
        Inertia::share([
            'isPostgraduate' => $user ? BouncerFacade::is($user)->an('postgraduate') : false,
            'isUndergraduate' => $user ? BouncerFacade::is($user)->an('undergraduate') : false,
            'isAdmin' => $user ? BouncerFacade::is($user)->an('admin') : false,
            'isFacultyAdmin' => $user ? BouncerFacade::is($user)->an('faculty_admin') : false,
            'isIndustry' => $user ? BouncerFacade::is($user)->an('industry') : false,
            'isAcademician' => $user ? BouncerFacade::is($user)->an('academician') : false,
            'canPostGrants' => $user ? BouncerFacade::can('post-grants') : false,
            'canPostProjects' => $user ? BouncerFacade::can('post-projects') : false,
            'canPostEvents' => $user ? BouncerFacade::can('post-events') : false,
            'canCreatePosts' => $user ? BouncerFacade::can('create-posts') : false,
            'canCreateFacultyAdmin' => $user ? BouncerFacade::can('create-facultyAdmin') : false,
            'canAssignAbilities' => $user ? BouncerFacade::can('assign-abilities') : false,
        ]);

        return $next($request);
    }
}
