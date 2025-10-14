@component('mail::message')
# {{ __('Supervision Offer Received!') }}

{{ __('Great news, :name!', ['name' => $student->name]) }}

**{{ $request->academician->full_name ?? 'A supervisor' }}** {{ __('has accepted your supervision request for ":title" and sent you an offer!', ['title' => $request->proposal_title ?? 'your research proposal']) }}

## {{ __('Next Steps') }}

{{ __('Please review the offer details and accept or decline at your earliest convenience.') }}

@component('mail::button', ['url' => route('supervision.student.index')])
{{ __('View Offer & Respond') }}
@endcomponent

@if($conversationUrl)
@component('mail::button', ['url' => $conversationUrl])
{{ __('Open Conversation') }}
@endcomponent
@endif

{{ __('This is an exciting step forward in your academic journey!') }}

{{ __('Best regards,') }}<br>
{{ config('app.name') }}
@endcomponent

