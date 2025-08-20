<?php

namespace App\Services;

use App\Exceptions\CannotDeleteException;
use App\Models\UniversityList;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class UniversityService
{
    /**
     * Create a new university
     */
    public function create(array $data): UniversityList
    {
        // Handle profile picture upload
        if (isset($data['profile_picture']) && $data['profile_picture'] instanceof UploadedFile) {
            $data['profile_picture'] = $this->handleProfilePictureUpload($data['profile_picture']);
        }
        
        // Handle background image upload
        if (isset($data['background_image']) && $data['background_image'] instanceof UploadedFile) {
            $data['background_image'] = $this->handleBackgroundImageUpload($data['background_image']);
        }
        
        return UniversityList::create($data);
    }
    
    /**
     * Update an existing university
     */
    public function update(UniversityList $university, array $data): UniversityList
    {
        // Handle profile picture upload
        if (isset($data['profile_picture']) && $data['profile_picture'] instanceof UploadedFile) {
            // Delete old profile picture if it exists
            $this->deleteProfilePicture($university->profile_picture);
            $data['profile_picture'] = $this->handleProfilePictureUpload($data['profile_picture']);
        } else {
            // If no new file is uploaded, remove profile_picture from data
            unset($data['profile_picture']);
        }
        
        // Handle background image upload
        if (isset($data['background_image']) && $data['background_image'] instanceof UploadedFile) {
            // Delete old background image if it exists
            $this->deleteBackgroundImage($university->background_image);
            $data['background_image'] = $this->handleBackgroundImageUpload($data['background_image']);
        } else {
            // If no new file is uploaded, remove background_image from data
            unset($data['background_image']);
        }
        
        $university->update($data);
        return $university;
    }
    
    /**
     * Delete a university
     */
    public function delete(UniversityList $university): bool
    {
        // Check if university has related faculties
        if ($university->faculties()->count() > 0) {
            throw new CannotDeleteException('Cannot delete university with existing faculties. Delete the faculties first.');
        }
        
        // Delete associated files
        $this->deleteProfilePicture($university->profile_picture);
        $this->deleteBackgroundImage($university->background_image);
        
        return $university->delete();
    }
    
    /**
     * Handle profile picture upload
     */
    private function handleProfilePictureUpload(UploadedFile $file): string
    {
        $fileName = time() . '_' . $file->getClientOriginalName();
        $path = 'university_profile_pictures';
        
        // Ensure the directory exists
        $destinationPath = public_path('storage/' . $path);
        if (!file_exists($destinationPath)) {
            mkdir($destinationPath, 0755, true);
        }
        
        // Move the file
        $file->move($destinationPath, $fileName);
        
        return $path . '/' . $fileName;
    }
    
    /**
     * Handle background image upload
     */
    private function handleBackgroundImageUpload(UploadedFile $file): string
    {
        $fileName = time() . '_' . $file->getClientOriginalName();
        $path = 'university_background_images';
        
        // Ensure the directory exists
        $destinationPath = public_path('storage/' . $path);
        if (!file_exists($destinationPath)) {
            mkdir($destinationPath, 0755, true);
        }
        
        // Move the file
        $file->move($destinationPath, $fileName);
        
        return $path . '/' . $fileName;
    }
    
    /**
     * Delete profile picture file
     */
    private function deleteProfilePicture(?string $path): void
    {
        if ($path) {
            $fullPath = public_path('storage/' . $path);
            if (file_exists($fullPath)) {
                unlink($fullPath);
            }
        }
    }
    
    /**
     * Delete background image file
     */
    private function deleteBackgroundImage(?string $path): void
    {
        if ($path) {
            $fullPath = public_path('storage/' . $path);
            if (file_exists($fullPath)) {
                unlink($fullPath);
            }
        }
    }
} 