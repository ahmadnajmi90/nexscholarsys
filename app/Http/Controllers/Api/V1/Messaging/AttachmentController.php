<?php

namespace App\Http\Controllers\Api\V1\Messaging;

use App\Http\Controllers\Controller;
use App\Http\Resources\Messaging\AttachmentResource;
use App\Models\Messaging\MessageAttachment;
use App\Services\Messaging\AttachmentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AttachmentController extends Controller
{
    /**
     * @var AttachmentService
     */
    protected $attachmentService;

    /**
     * AttachmentController constructor.
     *
     * @param AttachmentService $attachmentService
     */
    public function __construct(AttachmentService $attachmentService)
    {
        $this->attachmentService = $attachmentService;
    }

    /**
     * Display the specified attachment.
     *
     * @param MessageAttachment $attachment
     * @return StreamedResponse
     */
    public function show(MessageAttachment $attachment)
    {
        // Check if user can access this attachment
        $this->authorize('view', $attachment->message->conversation);
        
        return $this->attachmentService->stream($attachment);
    }

    /**
     * Download the specified attachment.
     *
     * @param MessageAttachment $attachment
     * @return StreamedResponse
     */
    public function download(MessageAttachment $attachment)
    {
        // Check if user can access this attachment
        $this->authorize('view', $attachment->message->conversation);
        
        return $this->attachmentService->download($attachment);
    }
}
