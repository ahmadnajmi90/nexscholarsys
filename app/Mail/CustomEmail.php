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
    private $recipient;

    public function __construct($to, $subject, $messageContent, $attachments = [])
    {
        $this->recipient = $to;
        $this->emailSubject = $subject;
        $this->messageContent = $messageContent;
        $this->attachments = $attachments;
    }

    public function build()
    {
        $mail = $this->view('emails.custom')
                    ->subject($this->emailSubject)
                    ->with([
                        'messageContent' => $this->messageContent
                    ]);

        // Set recipient using the correct method
        $mail->to($this->recipient);

        return $mail;
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        $attachmentsList = [];
        
        foreach ($this->attachments as $attachment) {
            if (isset($attachment['file']) && file_exists($attachment['file'])) {
                $attachmentsList[] = \Illuminate\Mail\Mailables\Attachment::fromPath($attachment['file']);
            }
        }
        
        return $attachmentsList;
    }
} 