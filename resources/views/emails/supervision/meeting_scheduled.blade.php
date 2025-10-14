@component('mail::message')
# {{ __('New Supervision Meeting Scheduled') }}

{{ __('Hello :name,', ['name' => $recipient->name]) }}

{{ __(':scheduler has scheduled a supervision meeting.', ['scheduler' => $schedulerName]) }}

**{{ __('Meeting Title:') }}** {{ $meeting->title }}

**{{ __('Scheduled For:') }}** {{ $meeting->scheduled_for->format('l, d F Y \a\t H:i') }}

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

@component('mail::button', ['url' => route('supervision.' . ($isSupervisor ? 'supervisor' : 'student') . '.index')])
{{ __('View Dashboard') }}
@endcomponent

{{ __('We look forward to a productive session!') }}

{{ __('Best regards,') }}<br>
{{ config('app.name') }}
@endcomponent

