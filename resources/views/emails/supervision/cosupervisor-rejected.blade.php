@component('mail::message')
# Co-Supervisor Declined Invitation

Hello **{{ $student->user->full_name }}** / **{{ $mainSupervisor->user->full_name }}**,

We wanted to inform you that **{{ $cosupervisor->user->full_name }}** has **declined** the invitation to become a co-supervisor for **{{ $student->user->full_name }}**.

@if($invitation->rejection_reason)
## Reason Provided:
"{{ $invitation->rejection_reason }}"
@endif

@component('mail::panel')
While this is unfortunate, you can continue your search for a suitable co-supervisor through our platform.
@endcomponent

@component('mail::button', ['url' => route('supervision.student.index')])
Find Other Co-Supervisors
@endcomponent

Best regards,<br>
{{ config('app.name') }}
@endcomponent

