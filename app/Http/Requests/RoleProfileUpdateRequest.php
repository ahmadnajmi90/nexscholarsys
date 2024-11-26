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
                'profile_picture' => ['nullable'], // Max file size is 2MB
                'current_position' => ['nullable', 'string', 'max:255'],
                'department' => ['nullable', 'string', 'max:255'],
                'highest_degree' => ['nullable', 'string', 'max:255'],
                'field_of_study' => ['nullable'],
                'research_interests' => ['nullable'],
                'ongoing_research' => ['nullable'],
                'website' => ['nullable', 'string', 'max:255'],
                'linkedin' => ['nullable', 'string', 'max:255'],
                'google_scholar' => ['nullable', 'string', 'max:255'],
                'researchgate' => ['nullable', 'string', 'max:255'],
                'orcid' => ['nullable', 'string', 'max:255'],
                'bio' => ['nullable', 'string'],
                // 'verified' => ['nullable', 'string', 'max:255'],
                'availability_for_collaboration' => ['boolean'],
                'availability_as_supervisor' => ['boolean'],
            ];
        } elseif (BouncerFacade::is(Auth::user())->an('postgraduate')) {
            $rules = [
                'phone_number' => ['nullable', 'string', 'max:15'],
                'full_name' => ['nullable', 'string', 'max:255'],
                'profile_picture' => ['nullable'], // Max file size is 2MB
                'faculty' => ['nullable', 'exists:faculty_list,id'],
                'university' => ['required', 'exists:university_list,id'],
                'supervisorAvailability' => ['boolean'],
                'grantAvailability' => ['boolean'],
                'highest_degree' => ['nullable', 'string', 'max:255'],
                'field_of_study' => ['nullable'],
                'research_interests' => ['nullable'],
                'ongoing_research' => ['nullable'],
                'website' => ['nullable', 'string', 'max:255'],
                'linkedin' => ['nullable', 'string', 'max:255'],
                'google_scholar' => ['nullable', 'string', 'max:255'],
                'researchgate' => ['nullable', 'string', 'max:255'],
                'orcid' => ['nullable', 'string', 'max:255'],
                'bio' => ['nullable', 'string'],
            ];
        }

        return $rules;
    }
}
