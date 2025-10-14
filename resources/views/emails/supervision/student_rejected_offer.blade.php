@component('mail::message')
# {{ __('Supervision Offer Declined') }}

{{ __('Hello :name,', ['name' => $supervisor->name]) }}

{{ __(':student has declined your supervision offer for ":title".', [
    'student' => $request->student->full_name ?? 'A student',
    'title' => $request->proposal_title ?? 'the research proposal'
]) }}

{{ __('While this is unfortunate, we encourage you to continue mentoring students who are the right fit for your expertise and availability.') }}

@component('mail::button', ['url' => route('supervision.supervisor.index')])
{{ __('View Other Requests') }}
@endcomponent

@if($conversationUrl)
@component('mail::button', ['url' => $conversationUrl])
{{ __('Open Conversation') }}
@endcomponent
@endif

{{ __('Thank you for your willingness to supervise.') }}

{{ __('Best regards,') }}<br>
{{ config('app.name') }}
@endcomponent

