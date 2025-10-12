<?php

namespace App\Http\Requests\Supervision;

use Illuminate\Foundation\Http\FormRequest;

class InviteCoSupervisorRequest extends FormRequest
{
    public function authorize(): bool
    {
        $relationship = $this->route('relationship');
        return $relationship && $this->user()->can('inviteCoSupervisor', $relationship);
    }

    public function rules(): array
    {
        return [
            'cosupervisor_academician_id' => ['required', 'string', 'exists:academicians,academician_id'],
            'invitation_message' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'cosupervisor_academician_id.required' => 'Please select a co-supervisor.',
            'cosupervisor_academician_id.exists' => 'The selected academician does not exist.',
        ];
    }
}

