@component('mail::message')
# Co-Supervisor Approval Required

Hello,

**{{ $cosupervisor->user->full_name }}** has accepted the invitation to become a co-supervisor for **{{ $student->user->full_name }}**.

**Your approval is now required** to finalize this co-supervision arrangement.

## Invitation Summary

- **Student:** {{ $student->user->full_name }}
- **Main Supervisor:** {{ $mainSupervisor->user->full_name }}
- **Proposed Co-Supervisor:** {{ $cosupervisor->user->full_name }}
- **Initiated by:** @if($invitation->initiated_by === 'student') Student @else Main Supervisor @endif

@if($invitation->invitation_message)
### Original Message:
"{{ $invitation->invitation_message }}"
@endif

@component('mail::panel')
**Co-Supervisor Profile:**
- **Name:** {{ $cosupervisor->user->full_name }}
- **Email:** {{ $cosupervisor->user->email }}
- **Faculty:** {{ $cosupervisor->faculty_name ?? 'N/A' }}
@endcomponent

@component('mail::button', ['url' => route('supervision.' . ($approverRole === 'student' ? 'student' : 'supervisor') . '.index')])
Review & Approve
@endcomponent

Please review and provide your decision.

Best regards,<br>
{{ config('app.name') }}
@endcomponent

