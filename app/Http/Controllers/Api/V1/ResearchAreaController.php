<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreResearchAreaRequest;
use App\Http\Requests\UpdateResearchAreaRequest;
use App\Http\Resources\ResearchAreaResource;
use App\Models\ResearchArea;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Redirect;

class ResearchAreaController extends Controller
{
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
        $area = ResearchArea::create($request->validated());
        
        return Redirect::route('admin.data-management.index')
            ->with('success', 'Research Area created successfully.');
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
        $area = ResearchArea::findOrFail($id);
        $area->update($request->validated());
        
        return Redirect::route('admin.data-management.index')
            ->with('success', 'Research Area updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $area = ResearchArea::findOrFail($id);
            
            // Check if area has related niche domains
            if ($area->nicheDomains()->count() > 0) {
                
                if (request()->wantsJson() || request()->ajax()) {
                    return response()->json([
                        'error' => 'Cannot delete research area with existing niche domains. Delete the niche domains first.'
                    ], 409);
                }
                
                return Redirect::route('admin.data-management.index')
                    ->with('error', 'Cannot delete research area with existing niche domains. Delete the niche domains first.');
            }
            
            $area->delete();
            
            if (request()->wantsJson() || request()->ajax()) {
                return response()->json([
                    'message' => 'Research Area deleted successfully.'
                ]);
            }
            
            return Redirect::route('admin.data-management.index')
                ->with('success', 'Research Area deleted successfully.');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            if (request()->wantsJson() || request()->ajax()) {
                return response()->json([
                    'error' => 'Research Area not found.'
                ], 404);
            }
            
            return Redirect::route('admin.data-management.index')
                ->with('error', 'Research Area not found.');
        } catch (\Exception $e) {
            if (request()->wantsJson() || request()->ajax()) {
                return response()->json([
                    'error' => 'An error occurred while deleting the research area.'
                ], 500);
            }
            
            return Redirect::route('admin.data-management.index')
                ->with('error', 'An error occurred while deleting the research area.');
        }
    }
}