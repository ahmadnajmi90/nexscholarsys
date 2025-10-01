@component('mail::message')
# {{ __('Supervision Request Accepted') }}

{{ __('Congratulations :name, your supervision request has been accepted!', ['name' => $student->name]) }}

**{{ __('Supervisor:') }}** {{ $relationship->academician->full_name ?? $relationship->academician_id }}

@if(!empty($relationship->meeting_cadence))
**{{ __('Meeting cadence:') }}** {{ $relationship->meeting_cadence }}
@endif

@component('mail::button', ['url' => $conversationUrl ?? route('supervision.student.index')])
{{ __('Open Conversation') }}
@endcomponent

{{ __('Thank you,') }}<br>
{{ config('app.name') }}
@endcomponent

