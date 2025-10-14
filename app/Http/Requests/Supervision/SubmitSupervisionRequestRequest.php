<?php

namespace App\Http\Requests\Supervision;

use Illuminate\Foundation\Http\FormRequest;

class SubmitSupervisionRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->postgraduate !== null;
    }

    public function rules(): array
    {
        return [
            'academician_id' => ['required', 'string', 'exists:academicians,academician_id'],
            'postgraduate_program_id' => ['nullable', 'exists:postgraduate_programs,id'],
            'proposal_title' => ['required', 'string', 'max:255'],
            'motivation' => ['required', 'string', 'min:50', 'max:5000'],
            'attachments.proposal' => ['required', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
            'attachments.transcript' => ['nullable', 'file', 'mimes:pdf', 'max:10240'],
            'attachments.background' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
            'attachments.portfolio' => ['nullable', 'file', 'max:10240'],
        ];
    }

    public function messages(): array
    {
        return [
            'academician_id.required' => 'Please select a supervisor.',
            'academician_id.exists' => 'The selected supervisor does not exist.',
            'proposal_title.required' => 'Please provide a research proposal title.',
            'motivation.required' => 'Please explain your motivation for this supervision request.',
            'motivation.min' => 'Please provide at least 50 characters explaining your motivation.',
            'attachments.proposal.required' => 'Research proposal document is required.',
            'attachments.proposal.mimes' => 'Research proposal must be PDF, DOC, or DOCX format.',
            'attachments.proposal.max' => 'Research proposal must not exceed 10MB.',
        ];
    }
}

