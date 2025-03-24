<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class CustomEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $messageContent;
    private $emailSubject;
    private $replyToAddress;
    public $attachments;

    public function __construct($subject, $messageContent, $replyTo, $attachments = [])
    {
        $this->emailSubject = $subject;
        $this->messageContent = $messageContent;
        $this->replyToAddress = $replyTo;
        $this->attachments = $attachments;
    }

    public function build()
    {
        $mail = $this->view('emails.custom')
                    ->subject($this->emailSubject)
                    ->replyTo($this->replyToAddress)
                    ->with([
                        'messageContent' => $this->messageContent
                    ]);

        // Add attachments if any
        foreach ($this->attachments as $attachment) {
            $mail->attach(Storage::disk('public')->path($attachment['path']), [
                'as' => $attachment['name']
            ]);
        }

        return $mail;
    }
} 