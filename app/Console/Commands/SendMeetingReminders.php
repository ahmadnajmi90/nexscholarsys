<?php

namespace App\Console\Commands;

use App\Models\SupervisionMeeting;
use App\Notifications\Supervision\MeetingReminder;
use Carbon\Carbon;
use Illuminate\Console\Command;

class SendMeetingReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'supervision:send-meeting-reminders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send meeting reminders for upcoming supervision meetings (24h and 1h before)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Checking for upcoming supervision meetings...');

        // 24-hour reminders
        $this->send24HourReminders();

        // 1-hour reminders
        $this->send1HourReminders();

        $this->info('Meeting reminders sent successfully.');
    }

    protected function send24HourReminders()
    {
        $this->info('Sending 24-hour reminders...');

        // Find meetings scheduled between 23 and 25 hours from now (1-hour window)
        $start = Carbon::now()->addHours(23);
        $end = Carbon::now()->addHours(25);

        $meetings = SupervisionMeeting::whereBetween('scheduled_for', [$start, $end])
            ->whereNull('cancelled_at')
            ->whereNull('reminder_24h_sent_at')
            ->with(['relationship.student.user', 'relationship.academician.user', 'request.student.user', 'request.academician.user'])
            ->get();

        $count = 0;
        foreach ($meetings as $meeting) {
            $this->sendReminderToParties($meeting, '24h');
            
            // Mark as sent
            $meeting->update(['reminder_24h_sent_at' => now()]);
            $count++;
        }

        $this->info("Sent {$count} 24-hour reminders.");
    }

    protected function send1HourReminders()
    {
        $this->info('Sending 1-hour reminders...');

        // Find meetings scheduled between 55 minutes and 1 hour 5 minutes from now (10-minute window)
        $start = Carbon::now()->addMinutes(55);
        $end = Carbon::now()->addMinutes(65);

        $meetings = SupervisionMeeting::whereBetween('scheduled_for', [$start, $end])
            ->whereNull('cancelled_at')
            ->whereNull('reminder_1h_sent_at')
            ->with(['relationship.student.user', 'relationship.academician.user', 'request.student.user', 'request.academician.user'])
            ->get();

        $count = 0;
        foreach ($meetings as $meeting) {
            $this->sendReminderToParties($meeting, '1h');
            
            // Mark as sent
            $meeting->update(['reminder_1h_sent_at' => now()]);
            $count++;
        }

        $this->info("Sent {$count} 1-hour reminders.");
    }

    protected function sendReminderToParties(SupervisionMeeting $meeting, string $reminderType)
    {
        // For relationship-based meetings
        if ($meeting->relationship) {
            $meeting->relationship->student->user?->notify(new MeetingReminder($meeting, $reminderType));
            $meeting->relationship->academician->user?->notify(new MeetingReminder($meeting, $reminderType));
        }
        
        // For request-based meetings
        if ($meeting->request) {
            $meeting->request->student->user?->notify(new MeetingReminder($meeting, $reminderType));
            $meeting->request->academician->user?->notify(new MeetingReminder($meeting, $reminderType));
        }
    }
}

