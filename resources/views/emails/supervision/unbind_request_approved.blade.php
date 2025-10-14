@component('mail::message')
# {{ __('Supervision Relationship Terminated') }}

{{ __('Hello :name,', ['name' => $recipient->name]) }}

@php
$isSupervisorRecipient = $recipient->academician && 
                         $recipient->academician->academician_id === $relationship->academician_id;
$otherPartyName = $isSupervisorRecipient
    ? ($relationship->student->full_name ?? 'Student')
    : ($relationship->academician->full_name ?? 'Supervisor');
@endphp

{{ __('Your supervision relationship with :name has been terminated as requested.', ['name' => $otherPartyName]) }}

**{{ __('Termination Reason:') }}** {{ $unbindRequest->reason }}

{{ __('This relationship is now officially closed. Thank you for your efforts during this supervision period.') }}

@component('mail::button', ['url' => route('supervision.' . ($isSupervisorRecipient ? 'supervisor' : 'student') . '.index')])
{{ __('View Dashboard') }}
@endcomponent

@if($conversationUrl)
@component('mail::button', ['url' => $conversationUrl])
{{ __('Open Conversation') }}
@endcomponent
@endif

{{ __('Best regards,') }}<br>
{{ config('app.name') }}
@endcomponent

