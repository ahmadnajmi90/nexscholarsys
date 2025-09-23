<?php

namespace App\Http\Requests\Messaging;

use Illuminate\Foundation\Http\FormRequest;

class ReadUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $conversation = $this->route('conversation');
        return $this->user()->can('view', $conversation);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'last_read_message_id' => ['required', 'exists:messages,id'],
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
            $conversation = $this->route('conversation');
            $messageId = $this->input('last_read_message_id');
            
            // Check if the message belongs to this conversation
            if (!$conversation->messages()->where('id', $messageId)->exists()) {
                $validator->errors()->add('last_read_message_id', 'The message does not belong to this conversation.');
            }
        });
    }
}
