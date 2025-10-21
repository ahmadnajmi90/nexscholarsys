<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\User;

class UnreadMessagesNotification extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * The user receiving the notification.
     */
    public User $user;

    /**
     * The number of unread messages.
     */
    public int $unreadCount;

    /**
     * The names of senders who sent messages.
     */
    public array $senders;

    /**
     * Create a new message instance.
     */
    public function __construct(User $user, int $unreadCount, array $senders)
    {
        $this->user = $user;
        $this->unreadCount = $unreadCount;
        $this->senders = $senders;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $subject = $this->unreadCount === 1 
            ? 'You have 1 unread message on Nexscholar'
            : "You have {$this->unreadCount} unread messages on Nexscholar";

        return new Envelope(
            subject: $subject,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.unread-messages',
            with: [
                'user' => $this->user,
                'unreadCount' => $this->unreadCount,
                'senders' => $this->senders,
                'sendersList' => $this->formatSendersList(),
                'messagesUrl' => url('/messaging'),
            ],
        );
    }

    /**
     * Format the senders list for display.
     */
    protected function formatSendersList(): string
    {
        $count = count($this->senders);
        
        if ($count === 0) {
            return 'someone';
        }
        
        if ($count === 1) {
            return $this->senders[0];
        }
        
        if ($count === 2) {
            return $this->senders[0] . ' and ' . $this->senders[1];
        }
        
        if ($count === 3) {
            return $this->senders[0] . ', ' . $this->senders[1] . ', and ' . $this->senders[2];
        }
        
        // More than 3 senders
        $others = $count - 2;
        return $this->senders[0] . ', ' . $this->senders[1] . ', and ' . $others . ' other' . ($others > 1 ? 's' : '');
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
