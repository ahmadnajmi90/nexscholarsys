<?php

namespace App\Http\Requests\Messaging;

use Illuminate\Foundation\Http\FormRequest;

class MessageStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $conversation = $this->route('conversation');
        return $this->user()->can('send', $conversation);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $maxFileSize = config('messaging.max_upload_mb', 20) * 1024; // Convert to KB
        $allowedMimes = array_merge(
            config('messaging.allowed_mimes.images', []),
            config('messaging.allowed_mimes.documents', []),
            config('messaging.allowed_mimes.videos', []),
            config('messaging.allowed_mimes.audio', [])
        );
        
        $mimeTypes = implode(',', $allowedMimes);
        
        return [
            'body' => ['nullable', 'string', 'max:5000'],
            'client_id' => ['nullable', 'string', 'max:100'],
            'reply_to_id' => ['nullable', 'exists:messages,id'],
            'files' => ['nullable', 'array', 'max:10'],
            'files.*' => ['file', 'max:'.$maxFileSize, 'mimes:'.$mimeTypes],
        ];
    }
    
    /**
     * Configure the validator instance.
     *
     * @param  \Illuminate\Validation\Validator  $validator
     * @return void
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // If no body and no files, add an error
            if (empty($this->body) && empty($this->file('files'))) {
                $validator->errors()->add('body', 'A message must have either text or attachments.');
            }
        });
    }
}
