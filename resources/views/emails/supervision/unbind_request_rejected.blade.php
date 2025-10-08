@component('mail::message')
# {{ __('Termination Request Declined') }}

{{ __('Hello :name,', ['name' => $recipient->name]) }}

@php
$isSupervisorRecipient = $recipient->academician && 
                         $recipient->academician->academician_id === $relationship->academician_id;
$otherPartyName = $isSupervisorRecipient
    ? ($relationship->student->full_name ?? 'Student')
    : ($relationship->academician->full_name ?? 'Supervisor');
@endphp

{{ __(':name has declined your request to terminate the supervision relationship.', ['name' => $otherPartyName]) }}

**{{ __('Cooldown Period:') }}** {{ __('30 days') }}

{{ __('You cannot submit another termination request until :date.', [
    'date' => $unbindRequest->cooldown_until->format('d/m/Y')
]) }}

{{ __('We encourage you to communicate openly with :name to resolve any concerns.', ['name' => $otherPartyName]) }}

@if($unbindRequest->attempt_count >= 2)
{{ __('⚠️ **Important:** If you submit a 3rd termination request, it will be automatically approved (force unbind).') }}
@endif

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

