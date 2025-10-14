@component('mail::message')
# {{ __('Student Accepted Your Offer!') }}

{{ __('Hello :name,', ['name' => $supervisor->name]) }}

{{ __('Congratulations! :student has accepted your supervision offer.', ['student' => $relationship->student->full_name ?? 'A student']) }}

**{{ __('Supervision Role:') }}** {{ $relationship->role === 'main' ? 'Main Supervisor' : 'Co-Supervisor' }}

@if(!empty($relationship->cohort))
**{{ __('Cohort:') }}** {{ $relationship->cohort }}
@endif

@if(!empty($relationship->meeting_cadence))
**{{ __('Meeting Cadence:') }}** {{ $relationship->meeting_cadence }}
@endif

{{ __('Your supervision relationship is now active. You can begin scheduling meetings and guiding your student.') }}

@component('mail::button', ['url' => route('supervision.supervisor.index')])
{{ __('View My Students') }}
@endcomponent

@if($conversationUrl)
@component('mail::button', ['url' => $conversationUrl])
{{ __('Open Conversation') }}
@endcomponent
@endif

{{ __('Thank you for your commitment to student supervision.') }}

{{ __('Best regards,') }}<br>
{{ config('app.name') }}
@endcomponent

