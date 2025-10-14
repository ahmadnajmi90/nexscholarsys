@component('mail::message')
# Co-Supervisor Invitation

Hello **{{ $invitation->cosupervisor->user->full_name }}**,

You have received an invitation to become a **co-supervisor** for **{{ $student->user->full_name }}**.

## Invitation Details

- **Student:** {{ $student->user->full_name }}
- **Main Supervisor:** {{ $mainSupervisor->user->full_name }}
- **Invited by:** {{ $initiator }} ({{ $initiatorRole }})

@if($invitation->invitation_message)
### Personal Message:
"{{ $invitation->invitation_message }}"
@endif

This is a great opportunity to contribute to {{ $student->user->full_name }}'s academic journey and collaborate with {{ $mainSupervisor->user->full_name }}.

@component('mail::button', ['url' => route('supervision.supervisor.index')])
View Invitation
@endcomponent

Please review the invitation and respond at your earliest convenience.

Best regards,<br>
{{ config('app.name') }}
@endcomponent

