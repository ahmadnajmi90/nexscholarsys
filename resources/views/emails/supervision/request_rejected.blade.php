@component('mail::message')
# {{ __('Supervision Request Update') }}

{{ __('Hello :name,', ['name' => $student->name]) }}

{{ __('We regret to inform you that your supervision request was not accepted at this time.') }}

@if(!empty($request->cancel_reason))
**{{ __('Reason:') }}** {{ $request->cancel_reason }}
@endif

@component('mail::button', ['url' => $conversationUrl ?? route('supervision.student.index')])
{{ __('Reply in Conversation') }}
@endcomponent

{{ __('Thank you,') }}<br>
{{ config('app.name') }}
@endcomponent

