<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Silber\Bouncer\BouncerFacade as Bouncer;
use Illuminate\Support\Facades\Auth;

class StorePostProjectRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Bouncer::allows('post-projects');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'project_theme' => 'required|string|max:255',
            'purpose' => 'required|max:255',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'application_deadline' => 'nullable|date',
            'duration' => 'nullable|string|max:255',
            'sponsored_by' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:255',
            'field_of_research' => 'nullable',
            'supervisor_category' => 'nullable|string|max:255',
            'supervisor_name' => 'nullable|string|max:255',
            'university' => 'nullable|exists:university_list,id',
            'email' => 'nullable|email|max:255',
            'origin_country' => 'nullable|string|max:255',
            'student_nationality' => 'nullable|string|max:255',
            'student_level' => 'nullable',
            'student_mode_study' => 'nullable',
            'appointment_type' => 'nullable|string|max:255',
            'purpose_of_collaboration' => 'nullable|string|max:255',
            'image' => 'nullable|image|max:2048',
            'attachment' => 'nullable|file|max:5120',
            'amount' => 'nullable|numeric|min:0',
            'application_url' => 'nullable|url|max:255',
            'project_status' => 'nullable',
            'create_scholarlab_project' => 'sometimes|boolean',
            'tags' => 'nullable|array',
            'author_id' => 'required|string',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Get the authenticated user
        $user = Auth::user();
        
        if (!$user) {
            abort(403, 'User not authenticated');
        }

        // Create an array of data to merge
        $dataToMerge = [
            // Convert incoming values like "true", "on", 1, etc., to a real boolean
            'create_scholarlab_project' => filter_var($this->create_scholarlab_project, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE),
        ];

        // Ensure author_id is set
        $dataToMerge['author_id'] = $user->unique_id;

        // Merge the data
        $this->merge($dataToMerge);

        // Handle tags if present
        if ($this->has('tags') && is_array($this->tags)) {
            $this->merge([
                'tags' => json_encode($this->tags),
            ]);
        }
    }
}