<?php

namespace App\Http\Requests\Supervision;

use Illuminate\Foundation\Http\FormRequest;

class SubmitSupervisionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'academician_id' => ['required', 'string', 'exists:academicians,academician_id'],
            'postgraduate_program_id' => ['nullable', 'exists:postgraduate_programs,id'],
            'proposal_title' => ['required', 'string', 'max:255'],
            'motivation' => ['required', 'string', 'min:50', 'max:2000'],
            
            // Enhanced file validation
            'attachments.proposal' => [
                'required',
                'file',
                'mimes:pdf,doc,docx',
                'max:10240', // 10MB
                function ($attribute, $value, $fail) {
                    if ($value->getSize() < 1024) { // Less than 1KB
                        $fail('The proposal file is too small. Please upload a valid document.');
                    }
                },
            ],
            'attachments.transcript' => [
                'nullable',
                'file',
                'mimes:pdf',
                'max:5120', // 5MB
            ],
            'attachments.background' => [
                'nullable',
                'file',
                'mimes:pdf,doc,docx',
                'max:10240', // 10MB
            ],
            'attachments.portfolio' => [
                'nullable',
                'file',
                'mimes:pdf,zip',
                'max:20480', // 20MB for portfolio
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'academician_id.required' => 'Please select a supervisor to send your request to.',
            'academician_id.exists' => 'The selected supervisor does not exist.',
            'proposal_title.required' => 'Please provide a title for your research proposal.',
            'proposal_title.max' => 'The proposal title must not exceed 255 characters.',
            'motivation.required' => 'Please explain your motivation for this supervision request.',
            'motivation.min' => 'Your motivation must be at least 50 characters.',
            'motivation.max' => 'Your motivation must not exceed 2000 characters.',
            
            'attachments.proposal.required' => 'A research proposal document is required.',
            'attachments.proposal.mimes' => 'The proposal must be a PDF, DOC, or DOCX file.',
            'attachments.proposal.max' => 'The proposal file must not exceed 10MB.',
            
            'attachments.transcript.mimes' => 'The transcript must be a PDF file.',
            'attachments.transcript.max' => 'The transcript file must not exceed 5MB.',
            
            'attachments.background.mimes' => 'The background document must be a PDF, DOC, or DOCX file.',
            'attachments.background.max' => 'The background document must not exceed 10MB.',
            
            'attachments.portfolio.mimes' => 'The portfolio must be a PDF or ZIP file.',
            'attachments.portfolio.max' => 'The portfolio file must not exceed 20MB.',
        ];
    }
}

