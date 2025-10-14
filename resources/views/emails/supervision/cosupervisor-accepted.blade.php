@component('mail::message')
# Co-Supervisor Accepted Invitation

Hello **{{ $student->user->full_name }}** / **{{ $mainSupervisor->user->full_name }}**,

Good news! **{{ $cosupervisor->user->full_name }}** has **accepted** the invitation to become a co-supervisor for **{{ $student->user->full_name }}**.

## Next Step

The invitation now awaits final approval from the @if($invitation->initiated_by === 'student') main supervisor @else student @endif.

@component('mail::panel')
**Co-Supervisor Details:**
- **Name:** {{ $cosupervisor->user->full_name }}
- **Email:** {{ $cosupervisor->user->email }}
- **Faculty:** {{ $cosupervisor->faculty_name ?? 'N/A' }}
@endcomponent

@component('mail::button', ['url' => route('supervision.supervisor.index')])
View Details
@endcomponent

Best regards,<br>
{{ config('app.name') }}
@endcomponent

