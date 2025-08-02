<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUniversityRequest;
use App\Http\Requests\UpdateUniversityRequest;
use App\Http\Resources\UniversityResource;
use App\Models\UniversityList;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Redirect;

class UniversityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = UniversityList::query();
        
        // Filter by name if provided
        if ($request->has('search')) {
            $search = $request->search;
            $query->where('full_name', 'like', "%{$search}%")
                  ->orWhere('short_name', 'like', "%{$search}%");
        }
        
        // Filter by country if provided
        if ($request->has('country')) {
            $query->where('country', $request->country);
        }
        
        // Sort by column (default: id)
        $sortBy = $request->input('sort_by', 'id');
        $sortDirection = $request->input('sort_direction', 'asc');
        $query->orderBy($sortBy, $sortDirection);
        
        // Paginate results
        $perPage = $request->input('per_page', 15);
        $universities = $query->withCount('faculties')->paginate($perPage);
        
        return UniversityResource::collection($universities);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUniversityRequest $request)
    {
        $validated = $request->validated();
        
        // Handle profile picture upload
        if ($request->hasFile('profile_picture')) {
            $profilePicture = $request->file('profile_picture');
            $profilePictureName = time() . '_' . $profilePicture->getClientOriginalName();
            $profilePicturePath = 'university_profile_pictures';
            
            // Ensure the directory exists
            $destinationPath = public_path('storage/' . $profilePicturePath);
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }
            
            // Move the file
            $profilePicture->move($destinationPath, $profilePictureName);
            
            // Save the relative path
            $validated['profile_picture'] = $profilePicturePath . '/' . $profilePictureName;
        }
        
        // Handle background image upload
        if ($request->hasFile('background_image')) {
            $backgroundImage = $request->file('background_image');
            $backgroundImageName = time() . '_' . $backgroundImage->getClientOriginalName();
            $backgroundImagePath = 'university_background_images';
            
            // Ensure the directory exists
            $destinationPath = public_path('storage/' . $backgroundImagePath);
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }
            
            // Move the file
            $backgroundImage->move($destinationPath, $backgroundImageName);
            
            // Save the relative path
            $validated['background_image'] = $backgroundImagePath . '/' . $backgroundImageName;
        }
        
        $university = UniversityList::create($validated);
        
        return Redirect::route('admin.data-management.index')
            ->with('success', 'University created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $university = UniversityList::with('faculties')->findOrFail($id);
        
        return new UniversityResource($university);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUniversityRequest $request, string $id)
    {
        $university = UniversityList::findOrFail($id);
        $validated = $request->validated();
        
        // Handle profile picture upload
        if ($request->hasFile('profile_picture')) {
            // Delete old profile picture if it exists
            if ($university->profile_picture) {
                $oldProfilePicturePath = public_path('storage/' . $university->profile_picture);
                if (file_exists($oldProfilePicturePath)) {
                    unlink($oldProfilePicturePath);
                }
            }
            
            $profilePicture = $request->file('profile_picture');
            $profilePictureName = time() . '_' . $profilePicture->getClientOriginalName();
            $profilePicturePath = 'university_profile_pictures';
            
            // Ensure the directory exists
            $destinationPath = public_path('storage/' . $profilePicturePath);
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }
            
            // Move the file
            $profilePicture->move($destinationPath, $profilePictureName);
            
            // Save the relative path
            $validated['profile_picture'] = $profilePicturePath . '/' . $profilePictureName;
        } else {
            // If no new file is uploaded, remove profile_picture from validated data
            // to prevent overwriting the existing value with null
            unset($validated['profile_picture']);
        }
        
        // Handle background image upload
        if ($request->hasFile('background_image')) {
            // Delete old background image if it exists
            if ($university->background_image) {
                $oldBackgroundImagePath = public_path('storage/' . $university->background_image);
                if (file_exists($oldBackgroundImagePath)) {
                    unlink($oldBackgroundImagePath);
                }
            }
            
            $backgroundImage = $request->file('background_image');
            $backgroundImageName = time() . '_' . $backgroundImage->getClientOriginalName();
            $backgroundImagePath = 'university_background_images';
            
            // Ensure the directory exists
            $destinationPath = public_path('storage/' . $backgroundImagePath);
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }
            
            // Move the file
            $backgroundImage->move($destinationPath, $backgroundImageName);
            
            // Save the relative path
            $validated['background_image'] = $backgroundImagePath . '/' . $backgroundImageName;
        } else {
            // If no new file is uploaded, remove background_image from validated data
            // to prevent overwriting the existing value with null
            unset($validated['background_image']);
        }
        
        $university->update($validated);
        
        return Redirect::route('admin.data-management.index')
            ->with('success', 'University updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $university = UniversityList::findOrFail($id);
            
            // Check if university has related faculties
            if ($university->faculties()->count() > 0) {
                
                if (request()->wantsJson() || request()->ajax()) {
                    return response()->json([
                        'error' => 'Cannot delete university with existing faculties. Delete the faculties first.'
                    ], 409);
                }
                
                return Redirect::route('admin.data-management.index')
                    ->with('error', 'Cannot delete university with existing faculties. Delete the faculties first.');
            }
            
            $university->delete();
            
            if (request()->wantsJson() || request()->ajax()) {
                return response()->json([
                    'message' => 'University deleted successfully.'
                ]);
            }
            
            return Redirect::route('admin.data-management.index')
                ->with('success', 'University deleted successfully.');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            if (request()->wantsJson() || request()->ajax()) {
                return response()->json([
                    'error' => 'University not found.'
                ], 404);
            }
            
            return Redirect::route('admin.data-management.index')
                ->with('error', 'University not found.');
        } catch (\Exception $e) {
            if (request()->wantsJson() || request()->ajax()) {
                return response()->json([
                    'error' => 'An error occurred while deleting the university.'
                ], 500);
            }
            
            return Redirect::route('admin.data-management.index')
                ->with('error', 'An error occurred while deleting the university.');
        }
    }
}