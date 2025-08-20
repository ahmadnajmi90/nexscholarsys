<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFacultyRequest;
use App\Http\Requests\UpdateFacultyRequest;
use App\Http\Resources\FacultyResource;
use App\Models\FacultyList;
use App\Services\FacultyService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class FacultyController extends Controller
{
    public function __construct(
        private FacultyService $facultyService
    ) {}

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
        try {
            $faculty = $this->facultyService->create($request->validated());
            
            return new FacultyResource($faculty);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while creating the faculty.'
            ], 500);
        }
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
        try {
            $faculty = FacultyList::findOrFail($id);
            $updatedFaculty = $this->facultyService->update($faculty, $request->validated());
            
            return new FacultyResource($updatedFaculty);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Faculty not found.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while updating the faculty.'
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $faculty = FacultyList::findOrFail($id);
            $this->facultyService->delete($faculty);
            
            return response()->json([
                'message' => 'Faculty deleted successfully.'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Faculty not found.'
            ], 404);
        } catch (\App\Exceptions\CannotDeleteException $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 409);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while deleting the faculty.'
            ], 500);
        }
    }
}