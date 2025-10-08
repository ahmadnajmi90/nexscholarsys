@component('mail::message')
@if($unbindRequest->status === 'force_unbind')
# {{ __('Supervision Relationship Terminated') }}

{{ __('Hello :name,', ['name' => $recipient->name]) }}

@if($isSupervisorInitiated)
{{ __(':supervisor has terminated the supervision relationship (force unbind - 3rd attempt).', [
    'supervisor' => $relationship->academician->full_name ?? 'Your supervisor'
]) }}
@else
{{ __(':student has terminated the supervision relationship (force unbind - 3rd attempt).', [
    'student' => $relationship->student->full_name ?? 'Your student'
]) }}
@endif

{{ __('The relationship is now officially terminated. This action cannot be reversed.') }}

@else
# {{ __('Termination Request Received') }}

{{ __('Hello :name,', ['name' => $recipient->name]) }}

@if($isSupervisorInitiated)
{{ __(':supervisor has requested to terminate your supervision relationship.', [
    'supervisor' => $relationship->academician->full_name ?? 'Your supervisor'
]) }}
@else
{{ __(':student has requested to terminate the supervision relationship.', [
    'student' => $relationship->student->full_name ?? 'Your student'
]) }}
@endif

**{{ __('Reason:') }}** {{ $unbindRequest->reason }}

**{{ __('Attempt:') }}** {{ $unbindRequest->attempt_count }} {{ __('of 3') }}

{{ __('Please review this request and respond by approving or declining it.') }}

@component('mail::button', ['url' => route('supervision.' . ($isSupervisorInitiated ? 'student' : 'supervisor') . '.index')])
{{ __('Review Termination Request') }}
@endcomponent

@endif

@if($conversationUrl)
@component('mail::button', ['url' => $conversationUrl])
{{ __('Open Conversation') }}
@endcomponent
@endif

{{ __('Best regards,') }}<br>
{{ config('app.name') }}
@endcomponent

