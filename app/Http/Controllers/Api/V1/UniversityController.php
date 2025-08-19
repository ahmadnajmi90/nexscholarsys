<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUniversityRequest;
use App\Http\Requests\UpdateUniversityRequest;
use App\Http\Resources\UniversityResource;
use App\Models\UniversityList;
use App\Services\UniversityService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class UniversityController extends Controller
{
    public function __construct(
        private UniversityService $universityService
    ) {}

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
        try {
            $university = $this->universityService->create($request->validated());
            
            return new UniversityResource($university);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while creating the university.'
            ], 500);
        }
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
        try {
            $university = UniversityList::findOrFail($id);
            $updatedUniversity = $this->universityService->update($university, $request->validated());
            
            return new UniversityResource($updatedUniversity);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'University not found.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while updating the university.'
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $university = UniversityList::findOrFail($id);
            $this->universityService->delete($university);
            
            return response()->json([
                'message' => 'University deleted successfully.'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'University not found.'
            ], 404);
        } catch (\App\Exceptions\CannotDeleteException $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 409);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while deleting the university.'
            ], 500);
        }
    }
}