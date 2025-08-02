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
        $university = UniversityList::create($request->validated());
        
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
        $university->update($request->validated());
        
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