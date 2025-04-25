<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Silber\Bouncer\BouncerFacade;
use Illuminate\Support\Facades\Auth;

class RoleProfileUpdateRequest extends FormRequest
{
    public function rules(): array
    {
        $rules = [];

        if (BouncerFacade::is(Auth::user())->an('academician')) {
            $rules = [
                'phone_number' => ['nullable', 'string', 'max:15'],
                'full_name' => ['nullable', 'string', 'max:255'],
                'profile_picture' => ['nullable', 'max:2048'], // Max file size is 2MB
                'current_position' => ['nullable', 'string', 'max:255'],
                'department' => ['nullable', 'string', 'max:255'],
                'highest_degree' => ['nullable', 'string', 'max:255'],
                'field_of_study' => ['nullable'],
                'research_expertise' => ['nullable'],
                'website' => ['nullable', 'string', 'max:255'],
                'linkedin' => ['nullable', 'string', 'max:255'],
                'google_scholar' => ['nullable', 'string', 'max:255'],
                'researchgate' => ['nullable', 'string', 'max:255'],
                'bio' => ['nullable', 'string'],
                // 'verified' => ['nullable', 'string', 'max:255'],
                'availability_for_collaboration' => [],
                'availability_as_supervisor' => [],
                'style_of_supervision' => ['nullable', 'array'],
            ];
        } elseif (BouncerFacade::is(Auth::user())->an('postgraduate')) {
            $rules = [
                'phone_number' => ['nullable', 'string', 'max:15'],
                'full_name' => ['nullable', 'string', 'max:255'],
                'profile_picture' => ['nullable', 'max:2048'], // Max file size 2MB, image types
                'faculty' => ['nullable', 'exists:faculty_list,id'],
                'university' => ['nullable', 'exists:university_list,id'], // Changed to nullable to handle "Not registered yet"
                'field_of_research' => ['nullable', 'array'], // For multiple selections
                'funding_requirement' => ['nullable', 'string', 'in:I need a scholarship,I need a grant,I am self-funded'], // Validate options
                'current_postgraduate_status' => ['nullable', 'string', 'in:Not registered yet,Registered'], // Validate options
                'matric_no' => ['nullable', 'string', 'max:50'], // Required if Registered
                'suggested_research_title' => ['nullable', 'string', 'max:255'], // Only if user suggests
                'suggested_research_description' => ['nullable', 'string'], // Only if user suggests
                'CV_file' => ['nullable', 'max:5120'], // Max 5MB, CV file types
                'website' => ['nullable', 'string', 'max:255', 'url'], // Ensure it's a valid URL
                'linkedin' => ['nullable', 'string', 'max:255', 'url'], // Ensure it's a valid URL
                'google_scholar' => ['nullable', 'string', 'max:255', 'url'], // Ensure it's a valid URL
                'researchgate' => ['nullable', 'string', 'max:255', 'url'], // Ensure it's a valid URL
                'bio' => ['nullable', 'string', 'max:1000'], // Allow up to 1000 characters for bio
                'bachelor' => ['nullable', 'string', 'max:255'], // Bachelor's degree field
                'CGPA_bachelor' => ['nullable', 'numeric', 'between:0,4.0'], // CGPA validation
                'master' => ['nullable', 'string', 'max:255'], // Master's degree field
                'master_type' => ['nullable', 'string', 'in:Full Research,Coursework,Research + Coursework'], // Validate options
                'nationality' => ['nullable', 'string', 'max:255'], // Handle selected nationality
                'english_proficiency_level' => ['nullable', 'string', 'in:Beginner,Elementary,Intermediate,Upper Intermediate,Advanced'], // Validate options
                'previous_degree' => ['nullable'], // Should be an array
                'skills' => ['nullable'], // User's skills
                'supervisorAvailability' => ['nullable'], // Allow any value, we'll convert in the controller
                'grantAvailability' => ['nullable'], // Allow any value, we'll convert in the controller
            ];
            
        }elseif (BouncerFacade::is(Auth::user())->an('undergraduate')) {
            $rules = [
                'full_name' => ['nullable', 'string', 'max:255'],
                'phone_number' => ['nullable', 'string', 'max:15'],
                'bio' => ['nullable', 'string'],
                'bachelor' => ['nullable', 'string', 'max:255'],
                'CGPA_bachelor' => ['nullable', 'numeric', 'between:0,4.0'],
                'nationality' => ['nullable', 'string', 'max:255'],
                'english_proficiency_level' => ['nullable', 'string', 'in:Beginner,Elementary,Intermediate,Upper Intermediate,Advanced'],
                'current_undergraduate_status' => ['nullable', 'string', 'in:Not registered yet,Registered'],
                'university' => ['nullable', 'exists:university_list,id'],
                'faculty' => ['nullable', 'exists:faculty_list,id'],
                'matric_no' => ['nullable', 'string', 'max:50'],
                'skills' => ['nullable'],
                'interested_do_research' => ['nullable'],
                'expected_graduate' => ['nullable', 'string', 'max:255'],
                'research_preference' => ['nullable'],
                'CV_file' => ['nullable', 'max:5120'],
                'profile_picture' => ['nullable', 'max:2048'],
                'background_image' => ['nullable', 'max:2048'],
                'website' => ['nullable', 'string', 'max:255', 'url'],
                'linkedin' => ['nullable', 'string', 'max:255', 'url'],
                'google_scholar' => ['nullable', 'string', 'max:255', 'url'],
                'researchgate' => ['nullable', 'string', 'max:255', 'url'],
            ];
        }

        return $rules;
    }
}
