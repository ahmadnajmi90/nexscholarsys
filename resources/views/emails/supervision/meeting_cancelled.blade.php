@component('mail::message')
# {{ __('Meeting Cancelled') }}

{{ __('Hello :name,', ['name' => $recipient->name]) }}

{{ __(':canceller has cancelled the supervision meeting ":title".', [
    'canceller' => $cancellerName,
    'title' => $meetingData['title']
]) }}

**{{ __('Original Meeting Time:') }}** {{ 
    $meetingData['scheduled_for'] instanceof \Carbon\Carbon 
        ? $meetingData['scheduled_for']->format('l, d F Y \a\t H:i')
        : \Carbon\Carbon::parse($meetingData['scheduled_for'])->format('l, d F Y \a\t H:i')
}}

{{ __('This meeting has been removed from your schedule. You will be notified if a new meeting is scheduled.') }}

@component('mail::button', ['url' => route('supervision.' . (isset($recipient->academician) ? 'supervisor' : 'student') . '.index')])
{{ __('View Dashboard') }}
@endcomponent

{{ __('Best regards,') }}<br>
{{ config('app.name') }}
@endcomponent

