<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFacultyRequest;
use App\Http\Requests\UpdateFacultyRequest;
use App\Http\Resources\FacultyResource;
use App\Models\FacultyList;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Redirect;

class FacultyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = FacultyList::query();
        
        // Filter by university_id if provided
        if ($request->has('university_id')) {
            $query->where('university_id', $request->university_id);
        }
        
        // Filter by name if provided
        if ($request->has('search')) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%");
        }
        
        // Sort by column (default: id)
        $sortBy = $request->input('sort_by', 'id');
        $sortDirection = $request->input('sort_direction', 'asc');
        $query->orderBy($sortBy, $sortDirection);
        
        // Include university data if requested
        if ($request->has('with_university') && $request->with_university) {
            $query->with('university');
        }
        
        // Paginate results
        $perPage = $request->input('per_page', 15);
        $faculties = $query->withCount(['academicians', 'postgraduates', 'undergraduates'])->paginate($perPage);
        
        return FacultyResource::collection($faculties);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFacultyRequest $request)
    {
        $faculty = FacultyList::create($request->validated());
        
        return Redirect::route('admin.data-management.index')
            ->with('success', 'Faculty created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $faculty = FacultyList::with('university')
            ->withCount(['academicians', 'postgraduates', 'undergraduates'])
            ->findOrFail($id);
        
        return new FacultyResource($faculty);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFacultyRequest $request, string $id)
    {
        $faculty = FacultyList::findOrFail($id);
        $faculty->update($request->validated());
        
        return Redirect::route('admin.data-management.index')
            ->with('success', 'Faculty updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $faculty = FacultyList::findOrFail($id);
            
            // Check if faculty has related users
            if ($faculty->academicians()->count() > 0 || 
                $faculty->postgraduates()->count() > 0 || 
                $faculty->undergraduates()->count() > 0) {
                
                if (request()->wantsJson() || request()->ajax()) {
                    return response()->json([
                        'error' => 'Cannot delete faculty with existing users. Reassign users first.'
                    ], 409);
                }
                
                return Redirect::route('admin.data-management.index')
                    ->with('error', 'Cannot delete faculty with existing users. Reassign users first.');
            }
            
            $faculty->delete();
            
            if (request()->wantsJson() || request()->ajax()) {
                return response()->json([
                    'message' => 'Faculty deleted successfully.'
                ]);
            }
            
            return Redirect::route('admin.data-management.index')
                ->with('success', 'Faculty deleted successfully.');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            if (request()->wantsJson() || request()->ajax()) {
                return response()->json([
                    'error' => 'Faculty not found.'
                ], 404);
            }
            
            return Redirect::route('admin.data-management.index')
                ->with('error', 'Faculty not found.');
        } catch (\Exception $e) {
            if (request()->wantsJson() || request()->ajax()) {
                return response()->json([
                    'error' => 'An error occurred while deleting the faculty.'
                ], 500);
            }
            
            return Redirect::route('admin.data-management.index')
                ->with('error', 'An error occurred while deleting the faculty.');
        }
    }
}