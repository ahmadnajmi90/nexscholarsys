<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreResearchAreaRequest;
use App\Http\Requests\UpdateResearchAreaRequest;
use App\Http\Resources\ResearchAreaResource;
use App\Models\ResearchArea;
use App\Services\ResearchAreaService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ResearchAreaController extends Controller
{
    public function __construct(
        private ResearchAreaService $researchAreaService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = ResearchArea::query();
        
        // Filter by field_of_research_id if provided
        if ($request->has('field_of_research_id')) {
            $query->where('field_of_research_id', $request->field_of_research_id);
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
        
        // Include related data if requested
        if ($request->has('with_field') && $request->with_field) {
            $query->with('fieldOfResearch');
        }
        
        if ($request->has('with_domains') && $request->with_domains) {
            $query->with('nicheDomains');
        }
        
        // Paginate results
        $perPage = $request->input('per_page', 15);
        $areas = $query->withCount('nicheDomains')->paginate($perPage);
        
        return ResearchAreaResource::collection($areas);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreResearchAreaRequest $request)
    {
        try {
            $area = $this->researchAreaService->create($request->validated());
            
            return new ResearchAreaResource($area);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while creating the research area.'
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $area = ResearchArea::with(['fieldOfResearch', 'nicheDomains'])->findOrFail($id);
        
        return new ResearchAreaResource($area);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateResearchAreaRequest $request, string $id)
    {
        try {
            $area = ResearchArea::findOrFail($id);
            $updatedArea = $this->researchAreaService->update($area, $request->validated());
            
            return new ResearchAreaResource($updatedArea);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Research Area not found.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while updating the research area.'
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $area = ResearchArea::findOrFail($id);
            $this->researchAreaService->delete($area);
            
            return response()->json([
                'message' => 'Research Area deleted successfully.'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Research Area not found.'
            ], 404);
        } catch (\App\Exceptions\CannotDeleteException $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 409);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while deleting the research area.'
            ], 500);
        }
    }
}