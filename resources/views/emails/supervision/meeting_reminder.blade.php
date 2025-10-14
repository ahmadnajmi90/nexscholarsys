@component('mail::message')
# {{ __('Meeting Reminder') }}

{{ __('Hello :name,', ['name' => $recipient->name]) }}

{{ __('This is a friendly reminder about your upcoming supervision meeting with :party.', [
    'party' => $otherPartyName
]) }}

**{{ __('Meeting Title:') }}** {{ $meeting->title }}

**{{ __('Scheduled For:') }}** {{ $meeting->scheduled_for->format('l, d F Y \a\t H:i') }}

**{{ __('Starting:') }}** {{ $reminderText }}

@if(!empty($meeting->location_link))
**{{ __('Location/Link:') }}** {{ $meeting->location_link }}
@endif

@if(!empty($meeting->agenda))
---

**{{ __('Agenda:') }}**

{{ $meeting->agenda }}
@endif

@if(!empty($meeting->location_link))
@component('mail::button', ['url' => $meeting->location_link])
{{ __('Join Meeting') }}
@endcomponent
@endif

{{ __('See you there!') }}

{{ __('Best regards,') }}<br>
{{ config('app.name') }}
@endcomponent

