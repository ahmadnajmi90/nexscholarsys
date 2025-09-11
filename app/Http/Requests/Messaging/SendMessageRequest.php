<?php

namespace App\Http\Requests\Messaging;

use Illuminate\Foundation\Http\FormRequest;

class SendMessageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true; // Authorization handled by policies
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'type' => 'required|in:text,image,file,system',
            'body' => 'required_if:type,text|string|max:10000',
            'reply_to_id' => 'nullable|exists:messages,id',
            'attachments' => 'nullable|array|max:10',
            'attachments.*' => 'required|file|max:' . config('messaging.max_file_size', 10240) . '|mimes:' . $this->getAllowedMimes(),
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'type.required' => 'Message type is required.',
            'type.in' => 'Message type must be text, image, file, or system.',
            'body.required_if' => 'Message body is required for text messages.',
            'body.string' => 'Message body must be a string.',
            'body.max' => 'Message body may not be greater than 10000 characters.',
            'reply_to_id.exists' => 'The message you are replying to does not exist.',
            'attachments.array' => 'Attachments must be an array of files.',
            'attachments.max' => 'You may not upload more than 10 attachments.',
            'attachments.*.file' => 'Each attachment must be a valid file.',
            'attachments.*.max' => 'Each attachment may not be greater than ' . config('messaging.max_file_size', 10240) . 'KB.',
            'attachments.*.mimes' => 'Attachment type not allowed. Allowed types: ' . $this->getAllowedMimes(),
        ];
    }

    /**
     * Get the allowed MIME types for file uploads.
     *
     * @return string
     */
    private function getAllowedMimes(): string
    {
        $allowedMimes = config('messaging.allowed_mimes', [
            'images' => ['jpg', 'jpeg', 'png', 'gif', 'webp'],
            'documents' => ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'],
            'videos' => ['mp4', 'webm', 'mov'],
        ]);

        $allTypes = array_merge(
            $allowedMimes['images'],
            $allowedMimes['documents'],
            $allowedMimes['videos']
        );

        return implode(',', $allTypes);
    }
}