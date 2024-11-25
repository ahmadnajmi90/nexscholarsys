<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PostEventSeeder extends Seeder
{
    public function run()
    {
        // Define options for event type and location
        $eventTypes = ['competition', 'conference', 'workshop', 'seminar', 'webinar'];
        $locations = ['On-Campus', 'Remote', 'Hybrid'];

        for ($i = 0; $i < 30; $i++) {
            DB::table('post_events')->insert([
                'author_id' => 'admin',
                'event_name' => 'Event ' . ($i + 1),
                'description' => 'This is a description for Event ' . ($i + 1),
                'image' => 'event_images/dlKGDH9yRxYybZNhJV9DEBzShrqnXJqI4etLomxx.png',
                'event_type' => $eventTypes[array_rand($eventTypes)],
                'theme' => json_encode(['Theme ' . rand(1, 5), 'Theme ' . rand(6, 10)]), // Example themes
                'location' => $locations[array_rand($locations)],
                'start_date_time' => now()->addDays(rand(1, 30))->toDateTimeString(),
                'end_date_time' => now()->addDays(rand(31, 60))->toDateTimeString(),
                'organized_by' => 'Organizer ' . Str::random(5),
                'target_audience' => json_encode(['Students', 'Academicians', 'Industry Professionals']),
                'registration_url' => 'https://example.com/event-' . ($i + 1),
                'registration_deadline' => now()->addDays(rand(1, 15))->toDateString(),
                'fees' => rand(0, 500) * 1.00, // Random fees between 0 and 500
                'contact_email' => 'contact' . ($i + 1) . '@example.com',
                'contact_number' => '+601234567' . rand(0, 9),
                'agenda' => 'Agenda details for Event ' . ($i + 1),
                'speakers' => 'Speaker details for Event ' . ($i + 1),
                'sponsors' => 'Sponsor details for Event ' . ($i + 1),
                'attachment' => 'attachments/event' . ($i + 1) . '.pdf',
                'event_status' => 'published',
                'is_featured' => rand(0, 1) == 1, // Randomly featured or not
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
