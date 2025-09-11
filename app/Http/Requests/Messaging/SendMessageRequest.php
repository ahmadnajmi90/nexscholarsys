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
        ];
    }
}