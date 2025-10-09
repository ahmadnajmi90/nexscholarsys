@component('mail::message')
# 🎉 Co-Supervisor Successfully Added!

Hello,

Great news! **{{ $cosupervisor->user->full_name }}** has been **successfully added** as a co-supervisor for **{{ $student->user->full_name }}**.

## Complete Supervision Team

- **Student:** {{ $student->user->full_name }}
- **Main Supervisor:** {{ $mainSupervisor->user->full_name }}
- **Co-Supervisor:** {{ $cosupervisor->user->full_name }} ✨

@component('mail::panel')
The co-supervision relationship is now **active** and all parties have full access to:
- Supervision workspace
- Shared documents
- Meeting scheduling
- Progress tracking
- Communication tools
@endcomponent

@component('mail::button', ['url' => route('supervision.supervisor.index')])
Access Supervision Dashboard
@endcomponent

We're excited to see this collaborative partnership flourish!

Best regards,<br>
{{ config('app.name') }}
@endcomponent

