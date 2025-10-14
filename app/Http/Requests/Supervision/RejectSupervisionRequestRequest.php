<?php

namespace App\Http\Requests\Supervision;

use Illuminate\Foundation\Http\FormRequest;

class RejectSupervisionRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('reject', $this->route('supervisionRequest'));
    }

    public function rules(): array
    {
        return [
            'reason' => ['required', 'string', 'max:500'],
            'feedback' => ['nullable', 'string', 'max:2000'],
            'recommend_alternatives' => ['nullable', 'boolean'],
            'recommended_supervisors' => ['nullable', 'array'],
            'recommended_supervisors.*' => ['string', 'exists:academicians,academician_id'],
            'suggested_keywords' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'reason.required' => 'Please provide a reason for rejecting this request.',
        ];
    }
}

