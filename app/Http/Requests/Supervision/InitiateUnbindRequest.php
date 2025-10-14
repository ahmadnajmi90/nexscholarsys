<?php

namespace App\Http\Requests\Supervision;

use Illuminate\Foundation\Http\FormRequest;

class InitiateUnbindRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('initiateUnbind', $this->route('relationship'));
    }

    public function rules(): array
    {
        return [
            'reason' => ['required', 'string', 'min:10', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'reason.required' => 'Please provide a reason for terminating this supervision relationship.',
            'reason.min' => 'Please provide at least 10 characters explaining the reason.',
        ];
    }
}

