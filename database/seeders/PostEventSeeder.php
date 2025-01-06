<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PostEventSeeder extends Seeder
{
    public function run()
    {
        // Define options for event type, mode, and status
        $eventTypes = ['competition', 'conference', 'workshop', 'seminar', 'webinar'];
        $eventModes = ['On-Campus', 'Remote', 'Hybrid'];
        $eventStatuses = ['draft', 'published'];
        $countries = ['Malaysia', 'USA', 'UK', 'India', 'Australia'];
        $cities = ['Kuala Lumpur', 'New York', 'London', 'Mumbai', 'Sydney'];

        for ($i = 0; $i < 30; $i++) {
            DB::table('post_events')->insert([
                'author_id' => 'admin',
                'event_name' => 'Event ' . ($i + 1),
                'description' => 'This is a description for Event ' . ($i + 1),
                'event_type' => $eventTypes[array_rand($eventTypes)],
                'event_mode' => $eventModes[array_rand($eventModes)],
                'start_date' => now()->addDays(rand(1, 30))->toDateString(),
                'end_date' => now()->addDays(rand(31, 60))->toDateString(),
                'start_time' => now()->addHours(rand(8, 18))->format('H:i:s'),
                'end_time' => now()->addHours(rand(19, 23))->format('H:i:s'),
                'image' => 'https://picsum.photos/seed/picsum/200/300',
                'event_theme' => 'Theme ' . rand(1, 10),
                'registration_url' => 'https://example.com/event-' . ($i + 1),
                'registration_deadline' => now()->addDays(rand(1, 15))->toDateString(),
                'contact_email' => 'contact' . ($i + 1) . '@example.com',
                'venue' => 'Venue ' . ($i + 1),
                'city' => $cities[array_rand($cities)],
                'country' => $countries[array_rand($countries)],
                'event_status' => $eventStatuses[array_rand($eventStatuses)],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
