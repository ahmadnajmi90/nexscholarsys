<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Log;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Get profile picture from the appropriate role model
        $profilePicture = null;
        if ($this->academician) {
            $profilePicture = $this->academician->profile_picture;
        } elseif ($this->postgraduate) {
            $profilePicture = $this->postgraduate->profile_picture;
        } elseif ($this->undergraduate) {
            $profilePicture = $this->undergraduate->profile_picture;
        }

        // Eager-load extra data if the user is an academician
        if ($this->whenLoaded('academician')) {
            $this->academician->loadMissing(['scholarProfile', 'publications']);
        }
        
        // Prepare the academician data with the new attributes
        $academicianData = $this->whenLoaded('academician', function () {
            return [
                // Include all existing academician attributes
                'id' => $this->academician->id,
                'academician_id' => $this->academician->academician_id,
                'full_name' => $this->academician->full_name,
                'phone_number' => $this->academician->phone_number,
                'profile_picture' => $this->academician->profile_picture,
                'current_position' => $this->academician->current_position,
                'department' => $this->academician->department,
                'university' => $this->academician->university,
                'faculty' => $this->academician->faculty,
                'highest_degree' => $this->academician->highest_degree,
                'CV_file' => $this->academician->CV_file,
                'field_of_study' => $this->academician->field_of_study,
                'research_expertise' => $this->academician->research_expertise,
                'personal_website' => $this->academician->personal_website,
                'institution_website' => $this->academician->institution_website,
                'linkedin' => $this->academician->linkedin,
                'google_scholar' => $this->academician->google_scholar,
                'researchgate' => $this->academician->researchgate,
                'bio' => $this->academician->bio,
                'verified' => $this->academician->verified,
                'availability_for_collaboration' => $this->academician->availability_for_collaboration,
                'availability_as_supervisor' => $this->academician->availability_as_supervisor,
                'style_of_supervision' => $this->academician->style_of_supervision,
                'background_image' => $this->academician->background_image,
                'url' => $this->academician->url,
                'profile_status' => $this->academician->profile_status,
                'total_views' => $this->academician->total_views,
                'created_at' => $this->academician->created_at,
                'updated_at' => $this->academician->updated_at,

                // Add the new data
                'scholar_profile' => $this->academician->scholar_profile,
                'total_publications' => $this->academician->total_publications,
            ];
        });

        $data = [
            'id' => $this->id,
            'name' => $this->name, // Fallback name
            'email' => $this->email,
            'avatar_url' => $profilePicture ?? $this->avatar_url ?? asset('images/default-avatar.png'),
            'full_name' => $this->full_name,
            
            // Use the new enriched academician data
            'academician' => $academicianData,
            'postgraduate' => $this->whenLoaded('postgraduate'),
            'undergraduate' => $this->whenLoaded('undergraduate'),
        ];
        
        // Add pivot data if it exists
        if (isset($this->pivot)) {
            $data['pivot'] = $this->pivot;
        }
        
        return $data;
    }
}
