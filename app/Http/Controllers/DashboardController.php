<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Silber\Bouncer\BouncerFacade;
use App\Models\ClickTracking;
use App\Models\PostGrant;
use App\Models\PostProject;
use App\Models\PostEvent;

class DashboardController extends Controller
{
    public function index()
    {
        if (!Auth::user()->is_profile_complete) {
            return redirect()->route('profile.complete');
        }
        else{
            $postGrants = auth()->user()->postGrants;

            return Inertia::render('Dashboard', [
                'postGrants' => $postGrants,
                'isPostgraduate' => BouncerFacade::is(Auth::user())->an('postgraduate'),
                'isAdmin' => BouncerFacade::is(Auth::user())->an('admin'),
                'totalUsers' => User::where('id', '!=', Auth::id())->count(), // Except admin itself
                'onlineUsers' => User::where('id', '!=', Auth::id())
                    ->where('last_activity', '>=', now()->subMinutes(5))
                    ->count(),
                'clicksByType' => $this->getClickDetails(), // Corrected method call
                'events' => PostEvent::where('start_date_time', '>=', now())->orderBy('start_date_time')->get(),
            ]);
        }
    }

    public function getClickDetails()
    {
        $clickDetails = ClickTracking::selectRaw('entity_type, action, entity_id, COUNT(*) as total_clicks')
            ->groupBy('entity_type', 'action', 'entity_id')
            ->get()
            ->map(function ($click) {
                $entityName = null;

                switch ($click->entity_type) {
                    case 'grant':
                        $entityName = PostGrant::where('id', $click->entity_id)->value('title');
                        break;
                    case 'project':
                        $entityName = PostProject::where('id', $click->entity_id)->value('title');
                        break;
                    case 'event':
                        $entityName = PostEvent::where('id', $click->entity_id)->value('event_name');
                        break;
                }

                return [
                    'entity_type' => $click->entity_type,
                    'entity_name' => $entityName ?? 'Unknown',
                    'action' => $click->action,
                    'total_clicks' => $click->total_clicks,
                ];
            });

        return $clickDetails;
    }
}
