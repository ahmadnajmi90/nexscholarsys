<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUniversityRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization is handled by middleware
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'full_name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('university_list')->ignore($this->route('university'))
            ],
            'short_name' => [
                'required',
                'string',
                'max:50',
                Rule::unique('university_list')->ignore($this->route('university'))
            ],
            'country' => 'required|string|max:100',
            // 'state' => 'nullable|string|max:100',
        ];
    }
}