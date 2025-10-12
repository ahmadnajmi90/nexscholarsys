<?php

namespace App\Http\Requests\Supervision;

use Illuminate\Foundation\Http\FormRequest;

class AcceptSupervisionRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('accept', $this->route('supervisionRequest'));
    }

    public function rules(): array
    {
        return [
            'cohort_start_term' => ['required', 'string', 'max:255'],
            'supervision_role' => ['required', 'in:main_supervisor,co_supervisor'],
            'meeting_cadence' => ['required', 'string', 'max:255'],
            'welcome_message' => ['nullable', 'string', 'max:1000'],
            'create_scholarlab' => ['nullable', 'boolean'],
            'onboarding_checklist' => ['nullable', 'array'],
            'onboarding_checklist.*.task' => ['required', 'string'],
            'onboarding_checklist.*.completed' => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'cohort_start_term.required' => 'Please specify the cohort start term.',
            'supervision_role.required' => 'Please specify your role (main supervisor or co-supervisor).',
            'meeting_cadence.required' => 'Please specify the meeting frequency.',
        ];
    }
}

