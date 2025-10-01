@component('mail::message')
# {{ __('New Supervision Request') }}

{{ __('Hello :name,', ['name' => $supervisor->name]) }}

{{ __(':student has submitted a supervision request.', ['student' => $request->student->full_name ?? $request->student_id]) }}

**{{ __('Proposal Title:') }}** {{ $request->proposal_title }}

@component('mail::button', ['url' => $conversationUrl ?? route('supervision.supervisor.index')])
{{ __('Open Conversation') }}
@endcomponent

{{ __('Thank you,') }}<br>
{{ config('app.name') }}
@endcomponent

