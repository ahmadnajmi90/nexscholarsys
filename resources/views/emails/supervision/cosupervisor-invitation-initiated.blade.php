@component('mail::message')
# Co-Supervisor Invitation Initiated

Hello **{{ $notifiable->full_name }}**,

@if($initiatorRole === 'Student')
Your student **{{ $student->full_name }}** has invited **{{ $cosupervisor->full_name }}** to join as a co-supervisor.
@else
**{{ $mainSupervisor->full_name }}** has invited **{{ $cosupervisor->full_name }}** to join as a co-supervisor for **{{ $student->full_name }}**.
@endif

@if($invitation->invitation_message)
**Personal Message:**
> {{ $invitation->invitation_message }}
@endif

**Next Steps:**
- The invited co-supervisor will be notified to review the invitation
- Once they accept, you will be asked to provide your approval
- You can track the status in your supervision dashboard

@component('mail::button', ['url' => config('app.url') . '/supervision'])
View Supervision Dashboard
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent

