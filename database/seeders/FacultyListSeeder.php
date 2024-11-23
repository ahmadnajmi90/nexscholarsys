<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FacultyListSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faculties = [
            // Universiti Malaya (UM)
            ['name' => 'Faculty of Arts and Social Sciences', 'university_id' => 1],
            ['name' => 'Faculty of Business and Economics', 'university_id' => 1],
            ['name' => 'Faculty of Computer Science and Information Technology', 'university_id' => 1],
            ['name' => 'Faculty of Dentistry', 'university_id' => 1],
            ['name' => 'Faculty of Education', 'university_id' => 1],
            ['name' => 'Faculty of Engineering', 'university_id' => 1],
            ['name' => 'Faculty of Law', 'university_id' => 1],
            ['name' => 'Faculty of Medicine', 'university_id' => 1],
            ['name' => 'Faculty of Science', 'university_id' => 1],
            ['name' => 'Faculty of Built Environment', 'university_id' => 1],
            ['name' => 'Faculty of Languages and Linguistics', 'university_id' => 1],
            ['name' => 'Faculty of Pharmacy', 'university_id' => 1],
            ['name' => 'Faculty of Creative Arts', 'university_id' => 1],

            // Universiti Sains Malaysia (USM)
            ['name' => 'School of Arts', 'university_id' => 2],
            ['name' => 'School of Biological Sciences', 'university_id' => 2],
            ['name' => 'School of Chemical Sciences', 'university_id' => 2],
            ['name' => 'School of Communication', 'university_id' => 2],
            ['name' => 'School of Computer Sciences', 'university_id' => 2],
            ['name' => 'School of Dental Sciences', 'university_id' => 2],
            ['name' => 'School of Distance Education', 'university_id' => 2],
            ['name' => 'School of Educational Studies', 'university_id' => 2],
            ['name' => 'School of Housing, Building and Planning', 'university_id' => 2],
            ['name' => 'School of Industrial Technology', 'university_id' => 2],
            ['name' => 'School of Management', 'university_id' => 2],
            ['name' => 'School of Mathematical Sciences', 'university_id' => 2],
            ['name' => 'School of Medical Sciences', 'university_id' => 2],
            ['name' => 'School of Pharmaceutical Sciences', 'university_id' => 2],
            ['name' => 'School of Physics', 'university_id' => 2],
            ['name' => 'School of Social Sciences', 'university_id' => 2],

            // Universiti Kebangsaan Malaysia (UKM)
            ['name' => 'Faculty of Economics and Management', 'university_id' => 3],
            ['name' => 'Faculty of Education', 'university_id' => 3],
            ['name' => 'Faculty of Engineering and Built Environment', 'university_id' => 3],
            ['name' => 'Faculty of Health Sciences', 'university_id' => 3],
            ['name' => 'Faculty of Information Science and Technology', 'university_id' => 3],
            ['name' => 'Faculty of Islamic Studies', 'university_id' => 3],
            ['name' => 'Faculty of Law', 'university_id' => 3],
            ['name' => 'Faculty of Medicine', 'university_id' => 3],
            ['name' => 'Faculty of Pharmacy', 'university_id' => 3],
            ['name' => 'Faculty of Science and Technology', 'university_id' => 3],
            ['name' => 'Faculty of Social Sciences and Humanities', 'university_id' => 3],
            ['name' => 'Faculty of Dentistry', 'university_id' => 3],

            // Universiti Putra Malaysia (UPM)
            ['name' => 'Faculty of Agriculture', 'university_id' => 4],
            ['name' => 'Faculty of Forestry and Environment', 'university_id' => 4],
            ['name' => 'Faculty of Veterinary Medicine', 'university_id' => 4],
            ['name' => 'Faculty of Engineering', 'university_id' => 4],
            ['name' => 'Faculty of Educational Studies', 'university_id' => 4],
            ['name' => 'Faculty of Science', 'university_id' => 4],
            ['name' => 'Faculty of Food Science and Technology', 'university_id' => 4],
            ['name' => 'Faculty of Human Ecology', 'university_id' => 4],
            ['name' => 'Faculty of Modern Languages and Communication', 'university_id' => 4],
            ['name' => 'Faculty of Design and Architecture', 'university_id' => 4],
            ['name' => 'Faculty of Medicine and Health Sciences', 'university_id' => 4],
            ['name' => 'Faculty of Computer Science and Information Technology', 'university_id' => 4],
            ['name' => 'Faculty of Biotechnology and Biomolecular Sciences', 'university_id' => 4],
            ['name' => 'Faculty of Agriculture and Forestry Sciences', 'university_id' => 4],
            ['name' => 'Faculty of Humanities, Management and Science', 'university_id' => 4],

            // Universiti Teknologi Malaysia (UTM)
            ['name' => 'Faculty of Built Environment and Surveying', 'university_id' => 5],
            ['name' => 'Faculty of Chemical and Energy Engineering', 'university_id' => 5],
            ['name' => 'Faculty of Civil Engineering', 'university_id' => 5],
            ['name' => 'Faculty of Computing', 'university_id' => 5],
            ['name' => 'Faculty of Electrical Engineering', 'university_id' => 5],
            ['name' => 'Faculty of Mechanical Engineering', 'university_id' => 5],
            ['name' => 'Faculty of Science', 'university_id' => 5],
            ['name' => 'Azman Hashim International Business School', 'university_id' => 5],
            ['name' => 'Malaysia-Japan International Institute of Technology', 'university_id' => 5],

            // Universiti Teknologi MARA (UiTM)
            ['name' => 'Faculty of Accountancy', 'university_id' => 6],
            ['name' => 'Faculty of Applied Sciences', 'university_id' => 6],
            ['name' => 'Faculty of Architecture, Planning and Surveying', 'university_id' => 6],
            ['name' => 'Faculty of Art and Design', 'university_id' => 6],
            ['name' => 'Faculty of Business and Management', 'university_id' => 6],
            ['name' => 'Faculty of Civil Engineering', 'university_id' => 6],
            ['name' => 'Faculty of Electrical Engineering', 'university_id' => 6],
            ['name' => 'Faculty of Mechanical Engineering', 'university_id' => 6],
            ['name' => 'Faculty of Pharmacy', 'university_id' => 6],
            ['name' => 'Faculty of Communication and Media Studies', 'university_id' => 6],
            ['name' => 'Faculty of Music', 'university_id' => 6],
            ['name' => 'Faculty of Film, Theatre and Animation', 'university_id' => 6],

            // Universiti Islam Antarabangsa Malaysia (UIAM)
            ['name' => 'Kulliyyah of Medicine', 'university_id' => 7],
            ['name' => 'Kulliyyah of Engineering', 'university_id' => 7],
            ['name' => 'Kulliyyah of Islamic Revealed Knowledge and Human Sciences', 'university_id' => 7],
            ['name' => 'Kulliyyah of Education', 'university_id' => 7],
            ['name' => 'Kulliyyah of Information and Communication Technology', 'university_id' => 7],
            ['name' => 'Kulliyyah of Architecture and Environmental Design', 'university_id' => 7],
            ['name' => 'Kulliyyah of Pharmacy', 'university_id' => 7],
            ['name' => 'Kulliyyah of Science', 'university_id' => 7],
            ['name' => 'Kulliyyah of Laws', 'university_id' => 7],

            // Universiti Utara Malaysia (UUM)
            ['name' => 'School of Business Management', 'university_id' => 8],
            ['name' => 'School of Computing', 'university_id' => 8],
            ['name' => 'School of Education and Modern Languages', 'university_id' => 8],
            ['name' => 'School of Economics, Finance and Banking', 'university_id' => 8],
            ['name' => 'School of Technology Management and Logistics', 'university_id' => 8],
            ['name' => 'School of Multimedia Technology and Communication', 'university_id' => 8],
            ['name' => 'School of Government', 'university_id' => 8],

            // Universiti Malaysia Sarawak (UNIMAS)
            ['name' => 'Faculty of Engineering', 'university_id' => 9],
            ['name' => 'Faculty of Medicine and Health Sciences', 'university_id' => 9],
            ['name' => 'Faculty of Social Sciences and Humanities', 'university_id' => 9],
            ['name' => 'Faculty of Resource Science and Technology', 'university_id' => 9],
            ['name' => 'Faculty of Economics and Business', 'university_id' => 9],
            ['name' => 'Faculty of Computer Science and Information Technology', 'university_id' => 9],

            // Universiti Malaysia Sabah (UMS)
            ['name' => 'Faculty of Science and Natural Resources', 'university_id' => 10],
            ['name' => 'Faculty of Medicine and Health Sciences', 'university_id' => 10],
            ['name' => 'Faculty of Psychology and Education', 'university_id' => 10],
            ['name' => 'Faculty of Business, Economics and Accountancy', 'university_id' => 10],
            ['name' => 'Faculty of Engineering', 'university_id' => 10],
            ['name' => 'Faculty of Food Science and Nutrition', 'university_id' => 10],

            // Universiti Pendidikan Sultan Idris (UPSI)
            ['name' => 'Faculty of Education and Human Development', 'university_id' => 11],
            ['name' => 'Faculty of Science and Mathematics', 'university_id' => 11],
            ['name' => 'Faculty of Arts, Computing and Creative Industry', 'university_id' => 11],
            ['name' => 'Faculty of Human Sciences', 'university_id' => 11],
            ['name' => 'Faculty of Sports Science and Coaching', 'university_id' => 11],
            
            // Universiti Sains Islam Malaysia (USIM)
            ['name' => 'Faculty of Quranic and Sunnah Studies', 'university_id' => 12],
            ['name' => 'Faculty of Shariah and Law', 'university_id' => 12],
            ['name' => 'Faculty of Leadership and Management', 'university_id' => 12],
            ['name' => 'Faculty of Science and Technology', 'university_id' => 12],
            ['name' => 'Faculty of Dentistry', 'university_id' => 12],
            ['name' => 'Faculty of Medicine and Health Sciences', 'university_id' => 12],
            ['name' => 'Faculty of Economics and Muamalat', 'university_id' => 12],
            ['name' => 'Faculty of Major Languages Studies', 'university_id' => 12],
            ['name' => 'Faculty of Engineering and Built Environment', 'university_id' => 12],

            // Universiti Malaysia Terengganu (UMT)
            ['name' => 'Faculty of Fisheries and Food Sciences', 'university_id' => 13],
            ['name' => 'Faculty of Maritime Studies', 'university_id' => 13],
            ['name' => 'Faculty of Business, Economics and Social Development', 'university_id' => 13],
            ['name' => 'Faculty of Science and Marine Environment', 'university_id' => 13],


            // Universiti Tun Hussein Onn Malaysia (UTHM)
            ['name' => 'Faculty of Civil Engineering and Built Environment', 'university_id' => 14],
            ['name' => 'Faculty of Mechanical and Manufacturing Engineering', 'university_id' => 14],
            ['name' => 'Faculty of Electrical and Electronic Engineering', 'university_id' => 14],
            ['name' => 'Faculty of Applied Sciences and Technology', 'university_id' => 14],
            ['name' => 'Faculty of Technical and Vocational Education', 'university_id' => 14],
            ['name' => 'Faculty of Management', 'university_id' => 14],

            // Universiti Teknikal Malaysia Melaka (UTeM)
            ['name' => 'Faculty of Electrical Engineering', 'university_id' => 15],
            ['name' => 'Faculty of Mechanical Engineering', 'university_id' => 15],
            ['name' => 'Faculty of Information and Communication Technology', 'university_id' => 15],
            ['name' => 'Faculty of Manufacturing Engineering', 'university_id' => 15],
            ['name' => 'Faculty of Technology Management and Technopreneurship', 'university_id' => 15],

            // Universiti Malaysia Pahang (UMP)
            ['name' => 'Faculty of Chemical and Process Engineering Technology', 'university_id' => 16],
            ['name' => 'Faculty of Mechanical and Automotive Engineering Technology', 'university_id' => 16],
            ['name' => 'Faculty of Civil Engineering Technology', 'university_id' => 16],
            ['name' => 'Faculty of Industrial Sciences and Technology', 'university_id' => 16],

            // Universiti Malaysia Perlis (UniMAP)
            ['name' => 'Faculty of Electronic Engineering Technology', 'university_id' => 17],
            ['name' => 'Faculty of Mechanical Engineering Technology', 'university_id' => 17],
            ['name' => 'Faculty of Civil Engineering Technology', 'university_id' => 17],
            ['name' => 'Faculty of Applied and Human Sciences', 'university_id' => 17],

            // Universiti Sultan Zainal Abidin (UniSZA)
            ['name' => 'Faculty of Health Sciences', 'university_id' => 18],
            ['name' => 'Faculty of Agriculture and Biotechnology', 'university_id' => 18],
            ['name' => 'Faculty of Business and Management', 'university_id' => 18],
            ['name' => 'Faculty of Law and International Relations', 'university_id' => 18],

            // Universiti Malaysia Kelantan (UMK)
            ['name' => 'Faculty of Entrepreneurship and Business', 'university_id' => 19],
            ['name' => 'Faculty of Hospitality, Tourism and Wellness', 'university_id' => 19],
            ['name' => 'Faculty of Creative Technology and Heritage', 'university_id' => 19],
            ['name' => 'Faculty of Bioengineering and Technology', 'university_id' => 19],

            // Universiti Pertahanan Nasional Malaysia (UPNM)
            ['name' => 'Faculty of Defence Studies and Management', 'university_id' => 20],
            ['name' => 'Faculty of Engineering', 'university_id' => 20],
            ['name' => 'Faculty of Medicine and Defence Health', 'university_id' => 20],

            // AIMST University
            ['name' => 'Faculty of Dentistry', 'university_id' => 21],
            ['name' => 'Faculty of Applied Sciences', 'university_id' => 21],
            ['name' => 'Faculty of Business and Management', 'university_id' => 21],

            // Asia Pacific University of Technology & Innovation (APU)
            ['name' => 'School of Computing and Technology', 'university_id' => 22],
            ['name' => 'School of Business', 'university_id' => 22],
            ['name' => 'School of Engineering', 'university_id' => 22],

            // Curtin University Malaysia
            ['name' => 'Faculty of Engineering and Science', 'university_id' => 23],
            ['name' => 'Faculty of Business', 'university_id' => 23],
            ['name' => 'Faculty of Humanities', 'university_id' => 23],

             // Heriot-Watt University Malaysia
            ['name' => 'School of Engineering and Physical Sciences', 'university_id' => 24],
            ['name' => 'School of Social Sciences', 'university_id' => 24],
            ['name' => 'Edinburgh Business School', 'university_id' => 24],
            
            // International Medical University (IMU)
            ['name' => 'School of Medicine', 'university_id' => 25],
            ['name' => 'School of Dentistry', 'university_id' => 25],
            ['name' => 'School of Pharmacy', 'university_id' => 25],
            ['name' => 'School of Health Sciences', 'university_id' => 25],

            // Monash University Malaysia
            ['name' => 'School of Medicine and Health Sciences', 'university_id' => 26],
            ['name' => 'School of Engineering', 'university_id' => 26],
            ['name' => 'School of Business', 'university_id' => 26],
 
            // Multimedia University (MMU)
            ['name' => 'Faculty of Engineering and Technology', 'university_id' => 27],
            ['name' => 'Faculty of Information Science and Technology', 'university_id' => 27],
            ['name' => 'Faculty of Business', 'university_id' => 27],
            ['name' => 'Faculty of Cinematic Arts', 'university_id' => 27],
 
            // Nottingham University Malaysia
            ['name' => 'Faculty of Arts and Social Sciences', 'university_id' => 28],
            ['name' => 'Faculty of Science and Engineering', 'university_id' => 28],
            ['name' => 'Faculty of Business', 'university_id' => 28],
 
            // Sunway University
            ['name' => 'School of Business', 'university_id' => 29],
            ['name' => 'School of Mathematical Sciences', 'university_id' => 29],
            ['name' => 'School of Hospitality and Service Management', 'university_id' => 29],
            ['name' => 'School of Health and Medical Sciences', 'university_id' => 29],

            // Swinburne University of Technology Sarawak Campus
            ['name' => 'Faculty of Engineering, Computing and Science', 'university_id' => 30],
            ['name' => 'Faculty of Business, Design and Arts', 'university_id' => 30],

             // Taylor's University
            ['name' => 'School of Hospitality, Tourism and Events', 'university_id' => 31],
            ['name' => 'School of Engineering', 'university_id' => 31],
            ['name' => 'School of Computer Science', 'university_id' => 31],
            ['name' => 'School of Architecture, Building and Design', 'university_id' => 31],

            // Universiti Tunku Abdul Rahman (UTAR)
            ['name' => 'Faculty of Arts and Social Science', 'university_id' => 32],
            ['name' => 'Faculty of Engineering and Green Technology', 'university_id' => 32],
            ['name' => 'Faculty of Information and Communication Technology', 'university_id' => 32],

            // University of Reading Malaysia
            ['name' => 'Henley Business School', 'university_id' => 33],
            ['name' => 'School of Built Environment', 'university_id' => 33],
            ['name' => 'School of Law', 'university_id' => 33],

            // University of Southampton Malaysia
            ['name' => 'Faculty of Engineering', 'university_id' => 34],
            ['name' => 'Faculty of Business and Management', 'university_id' => 34],

            // UCSI University
            ['name' => 'Faculty of Engineering, Technology and Built Environment', 'university_id' => 35],
            ['name' => 'Faculty of Applied Sciences', 'university_id' => 35],
            ['name' => 'Faculty of Social Sciences and Liberal Arts', 'university_id' => 35],
            ['name' => 'Faculty of Hospitality and Tourism Management', 'university_id' => 35],
 

        ];

        DB::table('faculty_list')->insert($faculties);
    }
}
