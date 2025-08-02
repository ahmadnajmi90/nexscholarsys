<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreNicheDomainRequest;
use App\Http\Requests\UpdateNicheDomainRequest;
use App\Http\Resources\NicheDomainResource;
use App\Models\NicheDomain;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Redirect;

class NicheDomainController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = NicheDomain::query();
        
        // Filter by research_area_id if provided
        if ($request->has('research_area_id')) {
            $query->where('research_area_id', $request->research_area_id);
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
        
        // Include research area if requested
        if ($request->has('with_area') && $request->with_area) {
            $query->with('researchArea');
        }
        
        // Paginate results
        $perPage = $request->input('per_page', 15);
        $domains = $query->paginate($perPage);
        
        return NicheDomainResource::collection($domains);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreNicheDomainRequest $request)
    {
        $domain = NicheDomain::create($request->validated());
        
        return Redirect::route('admin.data-management.index')
            ->with('success', 'Niche Domain created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $domain = NicheDomain::with('researchArea')->findOrFail($id);
        
        return new NicheDomainResource($domain);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateNicheDomainRequest $request, string $id)
    {
        $domain = NicheDomain::findOrFail($id);
        $domain->update($request->validated());
        
        return Redirect::route('admin.data-management.index')
            ->with('success', 'Niche Domain updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $domain = NicheDomain::findOrFail($id);
            
            $domain->delete();
            
            if (request()->wantsJson() || request()->ajax()) {
                return response()->json([
                    'message' => 'Niche Domain deleted successfully.'
                ]);
            }
            
            return Redirect::route('admin.data-management.index')
                ->with('success', 'Niche Domain deleted successfully.');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            if (request()->wantsJson() || request()->ajax()) {
                return response()->json([
                    'error' => 'Niche Domain not found.'
                ], 404);
            }
            
            return Redirect::route('admin.data-management.index')
                ->with('error', 'Niche Domain not found.');
        } catch (\Exception $e) {
            if (request()->wantsJson() || request()->ajax()) {
                return response()->json([
                    'error' => 'An error occurred while deleting the niche domain.'
                ], 500);
            }
            
            return Redirect::route('admin.data-management.index')
                ->with('error', 'An error occurred while deleting the niche domain.');
        }
    }
}