<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFieldOfResearchRequest;
use App\Http\Requests\UpdateFieldOfResearchRequest;
use App\Http\Resources\FieldOfResearchResource;
use App\Models\FieldOfResearch;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Redirect;

class FieldOfResearchController extends Controller
{
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
        $field = FieldOfResearch::create($request->validated());
        
        return Redirect::route('admin.data-management.index')
            ->with('success', 'Field of Research created successfully.');
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
        $field = FieldOfResearch::findOrFail($id);
        $field->update($request->validated());
        
        return Redirect::route('admin.data-management.index')
            ->with('success', 'Field of Research updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $field = FieldOfResearch::findOrFail($id);
            
            // Check if field has related research areas
            if ($field->researchAreas()->count() > 0) {
                
                if (request()->wantsJson() || request()->ajax()) {
                    return response()->json([
                        'error' => 'Cannot delete field of research with existing research areas. Delete the research areas first.'
                    ], 409);
                }
                
                return Redirect::route('admin.data-management.index')
                    ->with('error', 'Cannot delete field of research with existing research areas. Delete the research areas first.');
            }
            
            $field->delete();
            
            if (request()->wantsJson() || request()->ajax()) {
                return response()->json([
                    'message' => 'Field of Research deleted successfully.'
                ]);
            }
            
            return Redirect::route('admin.data-management.index')
                ->with('success', 'Field of Research deleted successfully.');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            if (request()->wantsJson() || request()->ajax()) {
                return response()->json([
                    'error' => 'Field of Research not found.'
                ], 404);
            }
            
            return Redirect::route('admin.data-management.index')
                ->with('error', 'Field of Research not found.');
        } catch (\Exception $e) {
            if (request()->wantsJson() || request()->ajax()) {
                return response()->json([
                    'error' => 'An error occurred while deleting the field of research.'
                ], 500);
            }
            
            return Redirect::route('admin.data-management.index')
                ->with('error', 'An error occurred while deleting the field of research.');
        }
    }
}