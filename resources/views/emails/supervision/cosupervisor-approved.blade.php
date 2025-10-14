@component('mail::message')
# Co-Supervisor Invitation Approved!

Hello,

Excellent news! The co-supervisor invitation for **{{ $cosupervisor->user->full_name }}** has been **fully approved**.

## Supervision Team

- **Student:** {{ $student->user->full_name }}
- **Main Supervisor:** {{ $mainSupervisor->user->full_name }}
- **Co-Supervisor:** {{ $cosupervisor->user->full_name }}

@component('mail::panel')
The co-supervision relationship is now **active**. All parties can now collaborate and access the supervision workspace.
@endcomponent

@component('mail::button', ['url' => route('supervision.' . (auth()->user()->postgraduate ? 'student' : 'supervisor') . '.index')])
Access Supervision Dashboard
@endcomponent

We wish you all the best in this collaborative academic journey!

Best regards,<br>
{{ config('app.name') }}
@endcomponent

