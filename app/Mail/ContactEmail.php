<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\User;

class ContactEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $subject;
    public $messageContent;
    public $sender;

    public function __construct($subject, $messageContent, User $sender)
    {
        $this->subject = $subject;
        $this->messageContent = $messageContent;
        $this->sender = $sender;
    }

    public function build()
    {
        return $this->subject($this->subject)
                    ->view('emails.contact');
    }
}
