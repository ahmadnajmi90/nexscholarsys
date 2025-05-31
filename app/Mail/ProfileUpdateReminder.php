<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\User;

class ProfileUpdateReminder extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * User who will receive the reminder
     * 
     * @var User
     */
    public $user;
    
    /**
     * User role (academician, postgraduate, undergraduate)
     * 
     * @var string
     */
    public $role;

    /**
     * Create a new message instance.
     *
     * @param User $user
     * @param string $role
     * @return void
     */
    public function __construct(User $user, string $role)
    {
        $this->user = $user;
        $this->role = $role;
    }

    /**
     * Get the message envelope.
     *
     * @return \Illuminate\Mail\Mailables\Envelope
     */
    public function envelope()
    {
        $subject = match($this->role) {
            'academician' => '📢 Keep Your NexScholar Profile Updated – Unlock More Opportunities!',
            'postgraduate' => '🎓 Elevate Your Postgraduate Profile on NexScholar – Unlock Research Connections!',
            'undergraduate' => '🚀 Kickstart Your Academic Journey on NexScholar – Update Your Profile!',
            default => '📢 Keep Your NexScholar Profile Updated – Unlock More Opportunities!',
        };
        
        return new Envelope(
            subject: $subject,
        );
    }

    /**
     * Get the message content definition.
     *
     * @return \Illuminate\Mail\Mailables\Content
     */
    public function content()
    {
        $view = match($this->role) {
            'academician' => 'emails.profile-update-academician',
            'postgraduate' => 'emails.profile-update-postgraduate',
            'undergraduate' => 'emails.profile-update-undergraduate',
            default => 'emails.profile-update-academician',
        };
        
        return new Content(
            view: $view,
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array
     */
    public function attachments()
    {
        return [];
    }
}