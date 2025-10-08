@component('mail::message')
# {{ __('Supervision Request Update') }}

{{ __('Hello :name,', ['name' => $student->name]) }}

{{ __('We regret to inform you that your supervision request for ":title" was not accepted at this time.', ['title' => $request->proposal_title ?? 'your research proposal']) }}

@if(!empty($request->cancel_reason))
@php
$reasonLabels = [
    'expertise_outside' => 'Research topic is outside my expertise',
    'capacity_full' => 'I have reached my supervision capacity',
    'methodology_mismatch' => 'Methodology does not align with my research',
    'language_communication' => 'Language or communication concerns',
    'timing_conflicts' => 'Timing or schedule conflicts',
    'additional_qualifications' => 'Student needs additional qualifications',
    'other' => 'Other reason',
];
$reasonLabel = $reasonLabels[$request->cancel_reason] ?? $request->cancel_reason;
@endphp
**{{ __('Reason:') }}** {{ $reasonLabel }}
@endif

@if(!empty($request->rejection_feedback))

**{{ __('Feedback from Supervisor:') }}**

{{ $request->rejection_feedback }}
@endif

@if(!empty($request->recommended_supervisors) && is_array($request->recommended_supervisors))
---

## {{ __('Recommended Alternative Supervisors') }}

{{ __('Dr. :name has kindly suggested the following supervisors who might be a good fit for your research:', ['name' => $request->academician->full_name ?? 'Your supervisor']) }}

@php
$recommendedAcademicians = \App\Models\Academician::with(['universityDetails', 'faculty'])
    ->whereIn('academician_id', $request->recommended_supervisors)
    ->limit(5)
    ->get();
@endphp

@foreach($recommendedAcademicians as $recommended)
**{{ $recommended->full_name }}**
{{ $recommended->department ? '- ' . $recommended->department : '' }}
{{ $recommended->universityDetails ? ', ' . $recommended->universityDetails->university_name : '' }}

@endforeach

@if($request->suggested_keywords)

**{{ __('Suggested Search Keywords:') }}** {{ $request->suggested_keywords }}
@endif

@component('mail::button', ['url' => route('supervision.student.index') . '?view_recommendations=' . $request->id])
{{ __('View All Recommendations & Add to Shortlist') }}
@endcomponent
@endif

@component('mail::button', ['url' => $conversationUrl ?? route('supervision.student.index')])
{{ __('Reply in Conversation') }}
@endcomponent

{{ __('Thank you for your interest. We wish you the best in finding a suitable supervisor for your research.') }}

{{ __('Best regards,') }}<br>
{{ config('app.name') }}
@endcomponent

