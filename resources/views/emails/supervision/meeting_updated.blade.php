@component('mail::message')
# {{ __('Meeting Updated') }}

{{ __('Hello :name,', ['name' => $recipient->name]) }}

{{ __(':updater has updated the supervision meeting ":title".', [
    'updater' => $updaterName,
    'title' => $meeting->title
]) }}

**{{ __('Meeting Title:') }}** {{ $meeting->title }}

**{{ __('Scheduled For:') }}** {{ $meeting->scheduled_for->format('l, d F Y \a\t H:i') }}

@if(!empty($meeting->location_link))
**{{ __('Location/Link:') }}** {{ $meeting->location_link }}
@endif

@if(!empty($changes) && count($changes) > 0)
---

**{{ __('What Changed:') }}**

@foreach($changes as $field => $change)
- **{{ ucfirst(str_replace('_', ' ', $field)) }}**: {{ $change['from'] ?? 'N/A' }} → {{ $change['to'] ?? 'N/A' }}
@endforeach
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

{{ __('Please note the changes and adjust your schedule accordingly.') }}

{{ __('Best regards,') }}<br>
{{ config('app.name') }}
@endcomponent

