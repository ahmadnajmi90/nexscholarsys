<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\PostEvent; // Also import Project and Grant as needed
use App\Models\PostProject;
use App\Models\PostGrant;

class FillMissingUrlsSeeder extends Seeder
{
    public function run()
    {
        // Process Events
        $events = PostEvent::whereNull('url')->orWhere('url', '')->get();
        foreach ($events as $event) {
            $slug = Str::slug($event->event_name);
            $originalSlug = $slug;
            $count = 2;
            while (PostEvent::where('url', $slug)->exists()) {
                $slug = $originalSlug . $count;
                $count++;
            }
            $event->url = $slug;
            $event->save();
        }

        // Process Projects (if using similar logic)
        $projects = PostProject::whereNull('url')->orWhere('url', '')->get();
        foreach ($projects as $project) {
            $slug = Str::slug($project->title);
            $originalSlug = $slug;
            $count = 2;
            while (PostProject::where('url', $slug)->exists()) {
                $slug = $originalSlug . $count;
                $count++;
            }
            $project->url = $slug;
            $project->save();
        }

        // Process Grants (if using similar logic)
        $grants = PostGrant::whereNull('url')->orWhere('url', '')->get();
        foreach ($grants as $grant) {
            // For grants, you might use a different attribute (e.g., title) as basis.
            $slug = Str::slug($grant->title);
            $originalSlug = $slug;
            $count = 2;
            while (PostGrant::where('url', $slug)->exists()) {
                $slug = $originalSlug . $count;
                $count++;
            }
            $grant->url = $slug;
            $grant->save();
        }
    }
}
