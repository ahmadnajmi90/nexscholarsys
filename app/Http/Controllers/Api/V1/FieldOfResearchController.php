<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFieldOfResearchRequest;
use App\Http\Requests\UpdateFieldOfResearchRequest;
use App\Http\Resources\FieldOfResearchResource;
use App\Models\FieldOfResearch;
use App\Services\FieldOfResearchService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class FieldOfResearchController extends Controller
{
    public function __construct(
        private FieldOfResearchService $fieldOfResearchService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = FieldOfResearch::query();
        
        // Filter by name if provided
        if ($request->has('search')) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%");
        }
        
        // Sort by column (default: id)
        $sortBy = $request->input('sort_by', 'id');
        $sortDirection = $request->input('sort_direction', 'asc');
        $query->orderBy($sortBy, $sortDirection);
        
        // Include research areas if requested
        if ($request->has('with_research_areas') && $request->with_research_areas) {
            $query->with('researchAreas');
        }
        
        // Paginate results
        $perPage = $request->input('per_page', 15);
        $fields = $query->withCount('researchAreas')->paginate($perPage);
        
        return FieldOfResearchResource::collection($fields);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFieldOfResearchRequest $request)
    {
        try {
            $field = $this->fieldOfResearchService->create($request->validated());
            
            return new FieldOfResearchResource($field);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while creating the field of research.'
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $field = FieldOfResearch::with('researchAreas')->findOrFail($id);
        
        return new FieldOfResearchResource($field);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFieldOfResearchRequest $request, string $id)
    {
        try {
            $field = FieldOfResearch::findOrFail($id);
            $updatedField = $this->fieldOfResearchService->update($field, $request->validated());
            
            return new FieldOfResearchResource($updatedField);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Field of Research not found.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while updating the field of research.'
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $field = FieldOfResearch::findOrFail($id);
            $this->fieldOfResearchService->delete($field);
            
            return response()->json([
                'message' => 'Field of Research deleted successfully.'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Field of Research not found.'
            ], 404);
        } catch (\App\Exceptions\CannotDeleteException $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 409);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while deleting the field of research.'
            ], 500);
        }
    }
}