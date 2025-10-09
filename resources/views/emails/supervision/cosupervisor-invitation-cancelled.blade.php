@component('mail::message')
# Co-Supervisor Invitation Cancelled

Hello **{{ $invitation->cosupervisor->user->full_name }}**,

This is to inform you that the co-supervisor invitation has been **cancelled** by **{{ $initiator }}**.

## Invitation Details

- **Student:** {{ $student->user->full_name }}
- **Main Supervisor:** {{ $mainSupervisor->user->full_name }}
- **Cancelled by:** {{ $initiator }}

@component('mail::panel')
This invitation is no longer active. If you have any questions, please feel free to reach out to the parties involved.
@endcomponent

Thank you for your time and consideration.

Best regards,<br>
{{ config('app.name') }}
@endcomponent

