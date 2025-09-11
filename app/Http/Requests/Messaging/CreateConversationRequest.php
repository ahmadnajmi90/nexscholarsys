<?php

namespace App\Http\Requests\Messaging;

use Illuminate\Foundation\Http\FormRequest;

class CreateConversationRequest extends FormRequest
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
            'type' => 'required|in:direct,group',
            'title' => 'nullable|string|max:255',
            'participants' => 'required|array',
            'participants.*' => 'exists:users,id',
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
            'type.required' => 'Conversation type is required.',
            'type.in' => 'Conversation type must be either direct or group.',
            'participants.required' => 'At least one participant is required.',
            'participants.*.exists' => 'One or more participants do not exist.',
        ];
    }
}