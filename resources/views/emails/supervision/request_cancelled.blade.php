@component('mail::message')
# {{ __('Supervision Request Cancelled') }}

{{ __('Hello :name,', ['name' => $supervisor->name]) }}

{{ __(':student has cancelled their supervision request for ":title".', [
    'student' => $request->student->full_name ?? 'A student',
    'title' => $request->proposal_title ?? 'the research proposal'
]) }}

{{ __('This request is now closed and no further action is required from you.') }}

@component('mail::button', ['url' => route('supervision.supervisor.index')])
{{ __('View Other Requests') }}
@endcomponent

@if($conversationUrl)
{{ __('You can still reach out to the student if needed:') }}

@component('mail::button', ['url' => $conversationUrl])
{{ __('Open Conversation') }}
@endcomponent
@endif

{{ __('Thank you,') }}<br>
{{ config('app.name') }}
@endcomponent

