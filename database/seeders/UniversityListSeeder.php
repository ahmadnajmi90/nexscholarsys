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
            ['full_name' => 'Universiti Malaya', 'short_name' => 'UM', 'country' => 'Malaysia'],
            ['full_name' => 'Universiti Sains Malaysia', 'short_name' => 'USM', 'country' => 'Malaysia'],
            ['full_name' => 'Universiti Kebangsaan Malaysia', 'short_name' => 'UKM', 'country' => 'Malaysia'],
            ['full_name' => 'Universiti Putra Malaysia', 'short_name' => 'UPM', 'country' => 'Malaysia'],
            ['full_name' => 'Universiti Teknologi Malaysia', 'short_name' => 'UTM', 'country' => 'Malaysia'],
            ['full_name' => 'Universiti Teknologi MARA', 'short_name' => 'UiTM', 'country' => 'Malaysia'],
            ['full_name' => 'Universiti Islam Antarabangsa Malaysia', 'short_name' => 'UIAM', 'country' => 'Malaysia'],
            ['full_name' => 'Universiti Utara Malaysia', 'short_name' => 'UUM', 'country' => 'Malaysia'],
            ['full_name' => 'Universiti Malaysia Sarawak', 'short_name' => 'UNIMAS', 'country' => 'Malaysia'],
            ['full_name' => 'Universiti Malaysia Sabah', 'short_name' => 'UMS', 'country' => 'Malaysia'],
            ['full_name' => 'Universiti Pendidikan Sultan Idris', 'short_name' => 'UPSI', 'country' => 'Malaysia'],
            ['full_name' => 'Universiti Sains Islam Malaysia', 'short_name' => 'USIM', 'country' => 'Malaysia'],
            ['full_name' => 'Universiti Malaysia Terengganu', 'short_name' => 'UMT', 'country' => 'Malaysia'],
            ['full_name' => 'Universiti Tun Hussein Onn Malaysia', 'short_name' => 'UTHM', 'country' => 'Malaysia'],
            ['full_name' => 'Universiti Teknikal Malaysia Melaka', 'short_name' => 'UTeM', 'country' => 'Malaysia'],
            ['full_name' => 'Universiti Malaysia Pahang', 'short_name' => 'UMP', 'country' => 'Malaysia'],
            ['full_name' => 'Universiti Malaysia Perlis', 'short_name' => 'UniMAP', 'country' => 'Malaysia'],
            ['full_name' => 'Universiti Sultan Zainal Abidin', 'short_name' => 'UniSZA', 'country' => 'Malaysia'],
            ['full_name' => 'Universiti Malaysia Kelantan', 'short_name' => 'UMK', 'country' => 'Malaysia'],
            ['full_name' => 'Universiti Pertahanan Nasional Malaysia', 'short_name' => 'UPNM', 'country' => 'Malaysia'],

            // Private Universities
            ['full_name' => 'AIMST University', 'short_name' => 'AIMST', 'country' => 'Malaysia'],
            ['full_name' => 'Asia Pacific University of Technology & Innovation', 'short_name' => 'APU', 'country' => 'Malaysia'],
            ['full_name' => 'Curtin University Malaysia', 'short_name' => 'Curtin Malaysia', 'country' => 'Malaysia'],
            ['full_name' => 'Heriot-Watt University Malaysia', 'short_name' => 'Heriot-Watt Malaysia', 'country' => 'Malaysia'],
            ['full_name' => 'International Medical University', 'short_name' => 'IMU', 'country' => 'Malaysia'],
            ['full_name' => 'Monash University Malaysia', 'short_name' => 'Monash Malaysia', 'country' => 'Malaysia'],
            ['full_name' => 'Multimedia University', 'short_name' => 'MMU', 'country' => 'Malaysia'],
            ['full_name' => 'Nottingham University Malaysia', 'short_name' => 'Nottingham Malaysia', 'country' => 'Malaysia'],
            ['full_name' => 'Sunway University', 'short_name' => 'Sunway', 'country' => 'Malaysia'],
            ['full_name' => 'Swinburne University of Technology Sarawak Campus', 'short_name' => 'Swinburne Sarawak', 'country' => 'Malaysia'],
            ['full_name' => 'Taylor\'s University', 'short_name' => 'Taylor\'s', 'country' => 'Malaysia'],
            ['full_name' => 'Universiti Tunku Abdul Rahman', 'short_name' => 'UTAR', 'country' => 'Malaysia'],
            ['full_name' => 'University of Reading Malaysia', 'short_name' => 'Reading Malaysia', 'country' => 'Malaysia'],
            ['full_name' => 'University of Southampton Malaysia', 'short_name' => 'Southampton Malaysia', 'country' => 'Malaysia'],
            ['full_name' => 'UCSI University', 'short_name' => 'UCSI', 'country' => 'Malaysia'],
            // Add more universities as needed
        ];

        DB::table('university_list')->insert($universities);
    }
}
