<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Postgraduate;
use App\Models\Academician;
use App\Models\UserMotivation;
use App\Models\PostgraduateProgram;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class TestUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * Creates test accounts for development and testing:
     * - 2 Student accounts
     * - 3 Supervisor accounts
     * 
     * All accounts use password: password123
     * 
     * This seeder follows the actual registration flow:
     * 1. Create User (with unique_id generation like ProfileCompletionController)
     * 2. Create role-specific profile (Postgraduate/Academician)
     * 3. Assign Bouncer role
     * 4. Create UserMotivation (to skip WhyNexscholar page)
     * 5. Set has_seen_tutorial to skip tutorial popup
     */
    public function run(): void
    {
        $this->command->info('Creating test users...');

        // Clean up existing test users if they exist
        $testEmails = [
            'test-student@example.com',
            'test-student-2@example.com',
            'test-supervisor@example.com',
            'test-supervisor-2@example.com',
            'test-supervisor-3@example.com',
        ];

        User::whereIn('email', $testEmails)->delete();

        // Try to get existing program (don't create new ones)
        $program = PostgraduateProgram::first();

        // ========================================
        // STUDENT 1: Alex Chen (Primary Test Student)
        // ========================================
        $uniqueId1 = 'PG-' . Str::random(8);
        $student1User = User::create([
            'name' => 'Alex Chen',
            'email' => 'test-student@example.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password123'),
            'remember_token' => Str::random(10),
            'unique_id' => $uniqueId1,
            'is_profile_complete' => true,
            'agreed_to_terms' => true,
            'has_seen_tutorial' => true,
        ]);

        $student1 = Postgraduate::create([
            'postgraduate_id' => $uniqueId1,
            'full_name' => 'ALEX CHEN',
            'university' => 1, // Assuming university with ID 1 exists
            'current_postgraduate_status' => 'Registered',
            'profile_picture' => 'profile_pictures/default.jpg',
            'background_image' => 'profile_background_images/default.jpg',
        ]);

        // Assign role
        $student1User->assign(['postgraduate']);

        // Create user motivation (to skip WhyNexscholar page)
        UserMotivation::create([
            'user_id' => $student1User->id,
            'main_reason' => 'A', // Find supervisor
            'features_interested' => ['A', 'B'], // AI matching, collaboration
            'additional_info' => 'Test account for supervision feature testing',
        ]);

        // ========================================
        // STUDENT 2: Sarah Williams (Secondary Test Student)
        // ========================================
        $uniqueId2 = 'PG-' . Str::random(8);
        $student2User = User::create([
            'name' => 'Sarah Williams',
            'email' => 'test-student-2@example.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password123'),
            'remember_token' => Str::random(10),
            'unique_id' => $uniqueId2,
            'is_profile_complete' => true,
            'agreed_to_terms' => true,
            'has_seen_tutorial' => true,
        ]);

        $student2 = Postgraduate::create([
            'postgraduate_id' => $uniqueId2,
            'full_name' => 'SARAH WILLIAMS',
            'university' => 1,
            'current_postgraduate_status' => 'Registered',
            'profile_picture' => 'profile_pictures/default.jpg',
            'background_image' => 'profile_background_images/default.jpg',
        ]);

        $student2User->assign(['postgraduate']);

        UserMotivation::create([
            'user_id' => $student2User->id,
            'main_reason' => 'A',
            'features_interested' => ['A', 'C'],
            'additional_info' => 'Test account for multi-student scenarios',
        ]);

        // ========================================
        // SUPERVISOR 1: Dr. Sarah Johnson (Primary Test Supervisor)
        // ========================================
        $uniqueId3 = 'ACAD-' . Str::random(8);
        $supervisor1User = User::create([
            'name' => 'Dr. Sarah Johnson',
            'email' => 'test-supervisor@example.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password123'),
            'remember_token' => Str::random(10),
            'unique_id' => $uniqueId3,
            'is_profile_complete' => true,
            'agreed_to_terms' => true,
            'has_seen_tutorial' => true,
        ]);

        $supervisor1 = Academician::create([
            'academician_id' => $uniqueId3,
            'full_name' => 'DR. SARAH JOHNSON',
            'current_position' => 'Associate Professor',
            'department' => 'Computer Science',
            'university' => 1,
            'bio' => 'Dr. Sarah Johnson is an Associate Professor specializing in AI and ML research. She has published over 50 papers and supervised 15 PhD students.',
            'google_scholar' => 'test-scholar-1',
            'researchgate' => 'test-researchgate-1',
            'profile_picture' => 'profile_pictures/default.jpg',
            'background_image' => 'profile_background_images/default.jpg',
            'availability_as_supervisor' => true,
        ]);

        $supervisor1User->assign(['academician']);

        UserMotivation::create([
            'user_id' => $supervisor1User->id,
            'main_reason' => 'B', // Find collaborators
            'features_interested' => ['B', 'D'],
            'additional_info' => 'Test account for supervisor features',
        ]);

        // ========================================
        // SUPERVISOR 2: Dr. Michael Wong (Co-Supervisor Test)
        // ========================================
        $uniqueId4 = 'ACAD-' . Str::random(8);
        $supervisor2User = User::create([
            'name' => 'Dr. Michael Wong',
            'email' => 'test-supervisor-2@example.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password123'),
            'remember_token' => Str::random(10),
            'unique_id' => $uniqueId4,
            'is_profile_complete' => true,
            'agreed_to_terms' => true,
            'has_seen_tutorial' => true,
        ]);

        $supervisor2 = Academician::create([
            'academician_id' => $uniqueId4,
            'full_name' => 'DR. MICHAEL WONG',
            'current_position' => 'Senior Lecturer',
            'department' => 'Computer Science',
            'university' => 1,
            'bio' => 'Dr. Michael Wong specializes in data mining and deep learning applications. He has extensive experience in industry collaborations.',
            'google_scholar' => 'test-scholar-2',
            'researchgate' => 'test-researchgate-2',
            'profile_picture' => 'profile_pictures/default.jpg',
            'background_image' => 'profile_background_images/default.jpg',
            'availability_as_supervisor' => true,
        ]);

        $supervisor2User->assign(['academician']);

        UserMotivation::create([
            'user_id' => $supervisor2User->id,
            'main_reason' => 'B',
            'features_interested' => ['B', 'E'],
            'additional_info' => 'Test account for co-supervisor features',
        ]);

        // ========================================
        // SUPERVISOR 3: Dr. Lisa Anderson (Additional Test Supervisor)
        // ========================================
        $uniqueId5 = 'ACAD-' . Str::random(8);
        $supervisor3User = User::create([
            'name' => 'Dr. Lisa Anderson',
            'email' => 'test-supervisor-3@example.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password123'),
            'remember_token' => Str::random(10),
            'unique_id' => $uniqueId5,
            'is_profile_complete' => true,
            'agreed_to_terms' => true,
            'has_seen_tutorial' => true,
        ]);

        $supervisor3 = Academician::create([
            'academician_id' => $uniqueId5,
            'full_name' => 'DR. LISA ANDERSON',
            'current_position' => 'Professor',
            'department' => 'Information Systems',
            'university' => 1,
            'bio' => 'Professor Lisa Anderson is a renowned expert in software engineering and cloud computing with over 20 years of academic experience.',
            'google_scholar' => 'test-scholar-3',
            'researchgate' => 'test-researchgate-3',
            'profile_picture' => 'profile_pictures/default.jpg',
            'background_image' => 'profile_background_images/default.jpg',
            'availability_as_supervisor' => true,
        ]);

        $supervisor3User->assign(['academician']);

        UserMotivation::create([
            'user_id' => $supervisor3User->id,
            'main_reason' => 'B',
            'features_interested' => ['B', 'F'],
            'additional_info' => 'Test account for additional supervisor scenarios',
        ]);

        $this->command->newLine();
        $this->command->info('✅ Test users created successfully!');
        $this->command->newLine();
        $this->command->info('📧 Students:');
        $this->command->info('  • test-student@example.com / password123 (Alex Chen)');
        $this->command->info('  • test-student-2@example.com / password123 (Sarah Williams)');
        $this->command->newLine();
        $this->command->info('👨‍🏫 Supervisors:');
        $this->command->info('  • test-supervisor@example.com / password123 (Dr. Sarah Johnson)');
        $this->command->info('  • test-supervisor-2@example.com / password123 (Dr. Michael Wong)');
        $this->command->info('  • test-supervisor-3@example.com / password123 (Dr. Lisa Anderson)');
        $this->command->newLine();
        $this->command->info('📚 Documentation: .cursor/test-users.md');
        $this->command->info('🧪 Testing Guide: .cursor/testing-guide.md');
        $this->command->info('🎯 All users have UserMotivation data - will go directly to dashboard');
        $this->command->newLine();
    }
}
