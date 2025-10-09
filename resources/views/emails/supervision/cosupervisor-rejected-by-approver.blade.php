@component('mail::message')
# Co-Supervisor Invitation Not Approved

Hello,

We regret to inform you that the co-supervisor invitation for **{{ $cosupervisor->user->full_name }}** was **not approved** by the {{ $approverRole === 'student' ? 'student' : 'main supervisor' }}.

## Details

- **Student:** {{ $student->user->full_name }}
- **Main Supervisor:** {{ $mainSupervisor->user->full_name }}
- **Proposed Co-Supervisor:** {{ $cosupervisor->user->full_name }}

@if($invitation->rejection_reason)
### Reason Provided:
"{{ $invitation->rejection_reason }}"
@endif

@component('mail::panel')
While this invitation was not approved, you can always explore other potential co-supervisors who may be a better fit for the supervision arrangement.
@endcomponent

@component('mail::button', ['url' => route('supervision.supervisor.index')])
View Dashboard
@endcomponent

Best regards,<br>
{{ config('app.name') }}
@endcomponent

