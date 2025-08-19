<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreNicheDomainRequest;
use App\Http\Requests\UpdateNicheDomainRequest;
use App\Http\Resources\NicheDomainResource;
use App\Models\NicheDomain;
use App\Services\NicheDomainService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class NicheDomainController extends Controller
{
    public function __construct(
        private NicheDomainService $nicheDomainService
    ) {}

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
        try {
            $domain = $this->nicheDomainService->create($request->validated());
            
            return new NicheDomainResource($domain);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while creating the niche domain.'
            ], 500);
        }
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
        try {
            $domain = NicheDomain::findOrFail($id);
            $updatedDomain = $this->nicheDomainService->update($domain, $request->validated());
            
            return new NicheDomainResource($updatedDomain);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Niche Domain not found.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while updating the niche domain.'
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $domain = NicheDomain::findOrFail($id);
            $this->nicheDomainService->delete($domain);
            
            return response()->json([
                'message' => 'Niche Domain deleted successfully.'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Niche Domain not found.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while deleting the niche domain.'
            ], 500);
        }
    }
}