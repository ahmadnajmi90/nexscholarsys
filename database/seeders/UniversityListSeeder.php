<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UniversityListSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $universities = [
            // Public Universities
            ['full_name' => 'Universiti Malaya', 'short_name' => 'UM', 'country' => 'Malaysia', 'profile_picture' => 'university_profile_pictures/um.png', 'background_image' => 'university_background_images/um.jpg', 'university_type' => 'Public', 'university_category' => 'Research'],
            ['full_name' => 'Universiti Sains Malaysia', 'short_name' => 'USM', 'country' => 'Malaysia', 'profile_picture' => 'university_profile_pictures/usm.png', 'background_image' => 'university_background_images/usm.jpg', 'university_type' => 'Public', 'university_category' => 'Research'],
            ['full_name' => 'Universiti Kebangsaan Malaysia', 'short_name' => 'UKM', 'country' => 'Malaysia', 'profile_picture' => 'university_profile_pictures/ukm.png', 'background_image' => 'university_background_images/ukm.jpg', 'university_type' => 'Public', 'university_category' => 'Research'],
            ['full_name' => 'Universiti Putra Malaysia', 'short_name' => 'UPM', 'country' => 'Malaysia', 'profile_picture' => 'university_profile_pictures/upm.png', 'background_image' => 'university_background_images/upm.jpg', 'university_type' => 'Public', 'university_category' => 'Research'],
            ['full_name' => 'Universiti Teknologi Malaysia', 'short_name' => 'UTM', 'country' => 'Malaysia', 'profile_picture' => 'university_profile_pictures/utm.png', 'background_image' => 'university_background_images/utm.jpg', 'university_type' => 'Public', 'university_category' => 'Research'],
            ['full_name' => 'Universiti Teknologi MARA', 'short_name' => 'UiTM', 'country' => 'Malaysia', 'profile_picture' => 'university_profile_pictures/uitm.png', 'background_image' => 'university_background_images/uitm.jpg', 'university_type' => 'Public', 'university_category' => 'Comprehensive'],
            ['full_name' => 'Universiti Islam Antarabangsa Malaysia', 'short_name' => 'UIAM', 'country' => 'Malaysia', 'profile_picture' => 'university_profile_pictures/uiam.png', 'background_image' => 'university_background_images/uiam.jpg', 'university_type' => 'Public', 'university_category' => 'Comprehensive'],
            ['full_name' => 'Universiti Utara Malaysia', 'short_name' => 'UUM', 'country' => 'Malaysia', 'profile_picture' => 'university_profile_pictures/uum.png', 'background_image' => 'university_background_images/uum.jpg', 'university_type' => 'Public', 'university_category' => 'Focused'],
            ['full_name' => 'Universiti Malaysia Sarawak', 'short_name' => 'UNIMAS', 'country' => 'Malaysia', 'profile_picture' => 'university_profile_pictures/unimas.png', 'background_image' => 'university_background_images/unimas.jpg', 'university_type' => 'Public', 'university_category' => 'Comprehensive'],
            ['full_name' => 'Universiti Malaysia Sabah', 'short_name' => 'UMS', 'country' => 'Malaysia', 'profile_picture' => 'university_profile_pictures/ums.png', 'background_image' => 'university_background_images/ums.jpg', 'university_type' => 'Public', 'university_category' => 'Comprehensive'],
            ['full_name' => 'Universiti Pendidikan Sultan Idris', 'short_name' => 'UPSI', 'country' => 'Malaysia', 'profile_picture' => 'university_profile_pictures/upsi.png', 'background_image' => 'university_background_images/upsi.jpg', 'university_type' => 'Public', 'university_category' => 'Focused'],
            ['full_name' => 'Universiti Sains Islam Malaysia', 'short_name' => 'USIM', 'country' => 'Malaysia', 'profile_picture' => 'university_profile_pictures/usim.png', 'background_image' => 'university_background_images/usim.jpg', 'university_type' => 'Public', 'university_category' => 'Focused'],
            ['full_name' => 'Universiti Malaysia Terengganu', 'short_name' => 'UMT', 'country' => 'Malaysia', 'profile_picture' => 'university_profile_pictures/umt.png', 'background_image' => 'university_background_images/umt.jpg', 'university_type' => 'Public', 'university_category' => 'Focused'],
            ['full_name' => 'Universiti Tun Hussein Onn Malaysia', 'short_name' => 'UTHM', 'country' => 'Malaysia', 'profile_picture' => 'university_profile_pictures/uthm.png', 'background_image' => 'university_background_images/uthm.jpg', 'university_type' => 'Public', 'university_category' => 'Focused'],
            ['full_name' => 'Universiti Teknikal Malaysia Melaka', 'short_name' => 'UTeM', 'country' => 'Malaysia', 'profile_picture' => 'university_profile_pictures/utem.png', 'background_image' => 'university_background_images/utem.jpg', 'university_type' => 'Public', 'university_category' => 'Focused'],
            ['full_name' => 'Universiti Malaysia Pahang', 'short_name' => 'UMP', 'country' => 'Malaysia', 'profile_picture' => 'university_profile_pictures/ump.png', 'background_image' => 'university_background_images/ump.jpg', 'university_type' => 'Public', 'university_category' => 'Focused'],
            ['full_name' => 'Universiti Malaysia Perlis', 'short_name' => 'UniMAP', 'country' => 'Malaysia', 'profile_picture' => 'university_profile_pictures/unimap.png', 'background_image' => 'university_background_images/unimap.jpg', 'university_type' => 'Public', 'university_category' => 'Focused'],
            ['full_name' => 'Universiti Sultan Zainal Abidin', 'short_name' => 'UniSZA', 'country' => 'Malaysia', 'profile_picture' => 'university_profile_pictures/unisza.png', 'background_image' => 'university_background_images/unisza.jpg', 'university_type' => 'Public', 'university_category' => 'Comprehensive'],
            ['full_name' => 'Universiti Malaysia Kelantan', 'short_name' => 'UMK', 'country' => 'Malaysia', 'profile_picture' => 'university_profile_pictures/umk.png', 'background_image' => 'university_background_images/umk.jpg', 'university_type' => 'Public', 'university_category' => 'Focused'],
            ['full_name' => 'Universiti Pertahanan Nasional Malaysia', 'short_name' => 'UPNM', 'country' => 'Malaysia', 'profile_picture' => 'university_profile_pictures/upnm.png', 'background_image' => 'university_background_images/upnm.jpg', 'university_type' => 'Public', 'university_category' => 'Focused'],

            // Private Universities
            ['full_name' => 'AIMST University', 'short_name' => 'AIMST', 'country' => 'Malaysia', 'profile_picture' => 'university_profile_pictures/aimst.png', 'background_image' => 'university_background_images/aimst.jpg', 'university_type' => 'Private'],
            ['full_name' => 'Asia Pacific University of Technology & Innovation', 'short_name' => 'APU', 'country' => 'Malaysia', 'profile_picture' => 'university_profile_pictures/apu.png', 'background_image' => 'university_background_images/apu.jpg', 'university_type' => 'Private'],
            ['full_name' => 'International Medical University', 'short_name' => 'IMU', 'country' => 'Malaysia', 'profile_picture' => 'university_profile_pictures/imu.png', 'background_image' => 'university_background_images/imu.jpg', 'university_type' => 'Private'],
            ['full_name' => 'Multimedia University', 'short_name' => 'MMU', 'country' => 'Malaysia', 'profile_picture' => 'university_profile_pictures/mmu.png', 'background_image' => 'university_background_images/mmu.jpg', 'university_type' => 'Private'],
            ['full_name' => 'Sunway University', 'short_name' => 'Sunway', 'country' => 'Malaysia', 'profile_picture' => 'university_profile_pictures/sunway.png', 'background_image' => 'university_background_images/sunway.jpg', 'university_type' => 'Private'],
            ['full_name' => 'Taylor\'s University', 'short_name' => 'Taylor\'s', 'country' => 'Malaysia', 'profile_picture' => 'university_profile_pictures/taylors.png', 'background_image' => 'university_background_images/taylors.jpg', 'university_type' => 'Private'],
            ['full_name' => 'Universiti Tunku Abdul Rahman', 'short_name' => 'UTAR', 'country' => 'Malaysia', 'profile_picture' => 'university_profile_pictures/utar.png', 'background_image' => 'university_background_images/utar.jpg', 'university_type' => 'Private'],
            ['full_name' => 'UCSI University', 'short_name' => 'UCSI', 'country' => 'Malaysia', 'profile_picture' => 'university_profile_pictures/ucsi.png', 'background_image' => 'university_background_images/ucsi.jpg', 'university_type' => 'Private'],

            // Foreign Branch Campuses
            ['full_name' => 'Curtin University Malaysia', 'short_name' => 'Curtin Malaysia', 'country' => 'Malaysia', 'profile_picture' => 'university_profile_pictures/curtin_malaysia.png', 'background_image' => 'university_background_images/curtin_malaysia.jpg', 'university_type' => 'Foreign Branch'],
            ['full_name' => 'Heriot-Watt University Malaysia', 'short_name' => 'Heriot-Watt Malaysia', 'country' => 'Malaysia', 'profile_picture' => 'university_profile_pictures/heriot_watt_malaysia.png', 'background_image' => 'university_background_images/heriot_watt_malaysia.jpg', 'university_type' => 'Foreign Branch'],
            ['full_name' => 'Monash University Malaysia', 'short_name' => 'Monash Malaysia', 'country' => 'Malaysia', 'profile_picture' => 'university_profile_pictures/monash_malaysia.png', 'background_image' => 'university_background_images/monash_malaysia.jpg', 'university_type' => 'Foreign Branch'],
            ['full_name' => 'Nottingham University Malaysia', 'short_name' => 'Nottingham Malaysia', 'country' => 'Malaysia', 'profile_picture' => 'university_profile_pictures/nottingham_malaysia.png', 'background_image' => 'university_background_images/nottingham_malaysia.jpg', 'university_type' => 'Foreign Branch'],
            ['full_name' => 'Swinburne University of Technology Sarawak Campus', 'short_name' => 'Swinburne Sarawak', 'country' => 'Malaysia', 'profile_picture' => 'university_profile_pictures/swinburne_sarawak.png', 'background_image' => 'university_background_images/swinburne_sarawak.jpg', 'university_type' => 'Foreign Branch'],
            ['full_name' => 'University of Reading Malaysia', 'short_name' => 'Reading Malaysia', 'country' => 'Malaysia', 'profile_picture' => 'university_profile_pictures/reading_malaysia.png', 'background_image' => 'university_background_images/reading_malaysia.jpg', 'university_type' => 'Foreign Branch'],
            ['full_name' => 'University of Southampton Malaysia', 'short_name' => 'Southampton Malaysia', 'country' => 'Malaysia', 'profile_picture' => 'university_profile_pictures/southampton_malaysia.png', 'background_image' => 'university_background_images/southampton_malaysia.jpg', 'university_type' => 'Foreign Branch'],
            // Add more universities as needed
            
        ];

        foreach ($universities as $university) {
            DB::table('university_list')
                ->where('short_name', $university['short_name'])
                ->update([
                    'profile_picture' => $university['profile_picture'],
                    'background_image' => $university['background_image'],
                    'university_type' => $university['university_type'],
                    'university_category' => $university['university_category'] ?? 'N/A', // Default value
                ]);
        }
    }
}

