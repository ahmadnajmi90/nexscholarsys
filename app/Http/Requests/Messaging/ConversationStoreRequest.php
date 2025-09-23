<?php

namespace App\Http\Requests\Messaging;

use Illuminate\Foundation\Http\FormRequest;

class ConversationStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization will be handled by the ConversationPolicy
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $userId = $this->user()->id;
        
        return [
            'type' => ['required', 'string', 'in:direct,group'],
            'title' => ['nullable', 'string', 'max:255', 'required_if:type,group'],
            'user_id' => [
                'required_if:type,direct',
                'exists:users,id',
                'prohibited_if:type,group',
                'different:' . $userId, // Cannot create a conversation with self
            ],
            'user_ids' => [
                'required_if:type,group',
                'array',
                'min:2', // At least 2 participants for a group (excluding the creator)
                'prohibited_if:type,direct',
            ],
            'user_ids.*' => [
                'exists:users,id',
                'different:' . $userId, // Cannot include self in user_ids
            ],
        ];
    }
    
    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'title.required_if' => 'A title is required for group conversations.',
            'user_id.required_if' => 'A user ID is required for direct conversations.',
            'user_id.different' => 'You cannot create a conversation with yourself.',
            'user_ids.required_if' => 'At least two participants are required for group conversations.',
            'user_ids.min' => 'A group conversation requires at least 2 participants besides yourself.',
            'user_ids.*.different' => 'You cannot include yourself in the participants list.',
        ];
    }
    
    /**
     * Configure the validator instance.
     *
     * @param \Illuminate\Validation\Validator $validator
     * @return void
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Get validated data
            $data = $validator->validated();
            
            // Skip if validation has already failed
            if ($validator->errors()->isNotEmpty()) {
                return;
            }
            
            // For direct conversations, check if the participant is an accepted connection
            if (isset($data['type']) && $data['type'] === 'direct' && isset($data['user_id'])) {
                $userId = $this->user()->id;
                $participantId = $data['user_id'];
                
                if (!$this->isAcceptedConnection($userId, $participantId)) {
                    $validator->errors()->add(
                        'user_id',
                        'You can only start conversations with your accepted connections.'
                    );
                }
            }
            
            // For group conversations, check if all participants are accepted connections
            if (isset($data['type']) && $data['type'] === 'group' && isset($data['user_ids']) && is_array($data['user_ids'])) {
                $userId = $this->user()->id;
                
                foreach ($data['user_ids'] as $participantId) {
                    if (!$this->isAcceptedConnection($userId, $participantId)) {
                        $validator->errors()->add(
                            'user_ids',
                            'All participants must be your accepted connections.'
                        );
                        break;
                    }
                }
            }
        });
    }
    
    /**
     * Check if two users have an accepted connection.
     * 
     * @param int $userA
     * @param int $userB
     * @return bool
     */
    protected function isAcceptedConnection(int $userA, int $userB): bool
    {
        // Check if there is an accepted connection between the two users
        return \App\Models\Connection::where(function ($query) use ($userA, $userB) {
                $query->where('requester_id', $userA)
                      ->where('recipient_id', $userB);
            })
            ->orWhere(function ($query) use ($userA, $userB) {
                $query->where('requester_id', $userB)
                      ->where('recipient_id', $userA);
            })
            ->where('status', 'accepted')
            ->exists();
    }
}
