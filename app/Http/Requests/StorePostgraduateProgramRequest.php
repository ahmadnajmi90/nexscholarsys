<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePostgraduateProgramRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // middleware handles admin
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'program_type' => 'required',
            'university_id' => 'required|exists:university_list,id',
            'faculty_id' => 'required|exists:faculty_list,id',
            'description' => 'nullable|string',
            'duration_years' => 'nullable|string|max:100',
            'funding_info' => 'nullable|string|max:255',
            'application_url' => 'nullable|string|max:2048',
            'country' => 'nullable|string|max:100',
        ];
    }
}

