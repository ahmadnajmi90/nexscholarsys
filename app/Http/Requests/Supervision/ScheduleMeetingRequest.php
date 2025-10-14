<?php

namespace App\Http\Requests\Supervision;

use Illuminate\Foundation\Http\FormRequest;

class ScheduleMeetingRequest extends FormRequest
{
    public function authorize(): bool
    {
        $relationship = $this->route('relationship');
        return $relationship && $this->user()->can('scheduleMeeting', $relationship);
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'scheduled_for' => [
                'required',
                'date',
                'after:now',
                function ($attribute, $value, $fail) {
                    // Validate scheduled_for is not more than 1 year in the future
                    $scheduledDate = \Carbon\Carbon::parse($value);
                    $maxDate = \Carbon\Carbon::now()->addYear();
                    if ($scheduledDate->gt($maxDate)) {
                        $fail('Meeting cannot be scheduled more than 1 year in advance.');
                    }

                    // Validate it's not on weekend (optional - can be removed based on requirements)
                    // if ($scheduledDate->isWeekend()) {
                    //     $fail('Meetings should be scheduled on weekdays.');
                    // }
                },
            ],
            'location_link' => ['required', 'string', 'max:255', 'url'],
            'agenda' => ['nullable', 'string', 'max:5000'],
            'attachments' => ['nullable', 'array'],
            'attachments.*' => ['file', 'max:10240'],
        ];
    }

    public function messages(): array
    {
        return [
            'scheduled_for.after' => 'Meeting must be scheduled for a future date and time.',
            'location_link.url' => 'Please provide a valid meeting link (e.g., Zoom, Google Meet).',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if ($this->has('scheduled_for')) {
                $scheduledFor = \Carbon\Carbon::parse($this->scheduled_for);
                
                // Check for conflicts (within 30 minutes of another meeting)
                $relationshipId = $this->route('relationship')?->id;
                $requestId = $this->route('supervisionRequest')?->id;
                
                $conflict = \App\Models\SupervisionMeeting::query()
                    ->when($relationshipId, fn($q) => $q->where('supervision_relationship_id', $relationshipId))
                    ->when($requestId, fn($q) => $q->where('supervision_request_id', $requestId))
                    ->whereNull('cancelled_at')
                    ->where(function ($query) use ($scheduledFor) {
                        $query->whereBetween('scheduled_for', [
                            $scheduledFor->copy()->subMinutes(30),
                            $scheduledFor->copy()->addMinutes(30)
                        ]);
                    })
                    ->exists();
                
                if ($conflict) {
                    $validator->errors()->add('scheduled_for', 'Another meeting is scheduled within 30 minutes of this time.');
                }
            }
        });
    }
}


