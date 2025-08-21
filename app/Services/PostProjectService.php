<?php

namespace App\Services;

use App\Models\PostProject;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class PostProjectService
{
    /**
     * Create a new project
     *
     * @param array $data
     * @return PostProject
     */
    public function createProject(array $data): PostProject
    {
        Log::info('Creating project with data:', $data);

        // Handle tags JSON encoding
        if (isset($data['tags']) && is_array($data['tags'])) {
            $data['tags'] = json_encode($data['tags']);
        }

        // Handle image upload
        if (isset($data['image']) && $data['image'] instanceof \Illuminate\Http\UploadedFile) {
            $destinationPath = public_path('storage/project_images');
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }
            $image = $data['image'];
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->move($destinationPath, $imageName);
            $data['image'] = 'project_images/' . $imageName;
        }

        // Handle attachment upload
        if (isset($data['attachment']) && $data['attachment'] instanceof \Illuminate\Http\UploadedFile) {
            $destinationPath = public_path('storage/project_attachments');
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }
            $attachment = $data['attachment'];
            $attachmentName = time() . '_' . $attachment->getClientOriginalName();
            $attachment->move($destinationPath, $attachmentName);
            $data['attachment'] = 'project_attachments/' . $attachmentName;
        }

        // Process JSON fields
        foreach (['purpose', 'student_level', 'student_mode_study', 'field_of_research'] as $field) {
            if (isset($data[$field]) && is_string($data[$field])) {
                $data[$field] = json_decode($data[$field], true);
            }
        }

        Log::info('Processed data for project creation:', $data);

        // Create the post project
        $postProject = new PostProject($data);
        $postProject->author_id = $data['author_id'];
        $postProject->save();

        // Check if the user opted-in to create a ScholarLab project
        if (isset($data['create_scholarlab_project']) && $data['create_scholarlab_project']) {
            Log::info('Creating ScholarLab project for post project ID: ' . $postProject->id);
            
            // Create the linked ScholarLab Project
            $project = \App\Models\Project::create([
                'name' => $postProject->title,
                'description' => 'Research project based on: ' . $postProject->title,
                'owner_id' => Auth::id(),
                'post_project_id' => $postProject->id,
            ]);
            
            // Create a default board for the project
            $board = new \App\Models\Board([
                'name' => 'Main Board',
            ]);
            
            // Save the board with the polymorphic relationship
            $project->boards()->save($board);
            
            // Create some default lists for the board
            $board->lists()->create([
                'name' => 'To Do',
                'order' => 1,
            ]);
            
            $board->lists()->create([
                'name' => 'In Progress',
                'order' => 2,
            ]);
            
            $board->lists()->create([
                'name' => 'Done',
                'order' => 3,
            ]);
            
            Log::info('ScholarLab project created successfully with ID: ' . $project->id);
        }

        return $postProject;
    }

    /**
     * Update an existing project
     *
     * @param PostProject $project
     * @param array $data
     * @return PostProject
     */
    public function updateProject(PostProject $project, array $data): PostProject
    {
        Log::info('Updating project with data:', $data);

        // Handle image upload
        if (isset($data['image']) && $data['image'] instanceof \Illuminate\Http\UploadedFile) {
            // Delete old image
            if ($project->image) {
                $oldImagePath = public_path('storage/' . $project->image);
                if (file_exists($oldImagePath)) {
                    unlink($oldImagePath);
                }
            }

            $imageDestination = public_path('storage/project_images');
            if (!file_exists($imageDestination)) {
                mkdir($imageDestination, 0755, true);
            }
            $image = $data['image'];
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->move($imageDestination, $imageName);
            $data['image'] = 'project_images/' . $imageName;
        } else {
            $data['image'] = $project->image;
        }

        // Handle attachment upload
        if (isset($data['attachment']) && $data['attachment'] instanceof \Illuminate\Http\UploadedFile) {
            // Delete old attachment
            if ($project->attachment) {
                $oldAttachmentPath = public_path('storage/' . $project->attachment);
                if (file_exists($oldAttachmentPath)) {
                    unlink($oldAttachmentPath);
                }
            }

            $attachmentDestination = public_path('storage/project_attachments');
            if (!file_exists($attachmentDestination)) {
                mkdir($attachmentDestination, 0755, true);
            }
            $attachment = $data['attachment'];
            $attachmentName = time() . '_' . $attachment->getClientOriginalName();
            $attachment->move($attachmentDestination, $attachmentName);
            $data['attachment'] = 'project_attachments/' . $attachmentName;
        } else {
            $data['attachment'] = $project->attachment;
        }

        // Process JSON fields
        if (isset($data['purpose']) && is_string($data['purpose'])) {
            $data['purpose'] = json_decode($data['purpose'], true);
        }

        if (isset($data['student_level']) && is_string($data['student_level'])) {
            $data['student_level'] = json_decode($data['student_level'], true);
        }

        if (isset($data['student_mode_study']) && is_string($data['student_mode_study'])) {
            $data['student_mode_study'] = json_decode($data['student_mode_study'], true);
        }

        if (!array_key_exists('field_of_research', $data)) {
            $data['field_of_research'] = null;
        } elseif (isset($data['field_of_research']) && is_string($data['field_of_research'])) {
            $decoded = json_decode($data['field_of_research'], true);
            if (empty($decoded)) {
                $data['field_of_research'] = null;
            } else {
                $data['field_of_research'] = $decoded;
            }
        }

        Log::info('Processed data for project update:', $data);
        $project->update($data);
        return $project;
    }

    /**
     * Delete a project
     *
     * @param PostProject $project
     * @return bool
     */
    public function deleteProject(PostProject $project): bool
    {
        Log::info('Deleting project:', ['id' => $project->id]);

        // Delete associated files
        if ($project->image) {
            $imagePath = public_path('storage/' . $project->image);
            if (file_exists($imagePath)) {
                unlink($imagePath);
            }
        }

        if ($project->attachment) {
            $attachmentPath = public_path('storage/' . $project->attachment);
            if (file_exists($attachmentPath)) {
                unlink($attachmentPath);
            }
        }

        return $project->delete();
    }
} 