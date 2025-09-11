<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSkillsSubdomainRequest;
use App\Http\Requests\UpdateSkillsSubdomainRequest;
use App\Models\SkillsSubdomain;
use App\Services\SkillsSubdomainService;
use Illuminate\Http\Request;

/**
 * @OA\Tag(
 * name="Skills Subdomains",
 * description="API Endpoints for managing skills subdomains"
 * )
 */
class SkillsSubdomainController extends Controller
{
    public function __construct(
        private SkillsSubdomainService $skillsSubdomainService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = SkillsSubdomain::query();
        
        // Filter by domain if provided
        if ($request->has('skills_domain_id')) {
            $query->where('skills_domain_id', $request->skills_domain_id);
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
        
        // Include domain and skills if requested
        if ($request->has('with_domain') && $request->with_domain) {
            $query->with('domain');
        }
        
        if ($request->has('with_skills') && $request->with_skills) {
            $query->with('skills');
        }
        
        // Paginate results
        $perPage = $request->input('per_page', 15);
        $subdomains = $query->withCount('skills')->paginate($perPage);
        
        return response()->json($subdomains);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSkillsSubdomainRequest $request)
    {
        try {
            $subdomain = $this->skillsSubdomainService->create($request->validated());
            
            return response()->json($subdomain, 201);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while creating the skills subdomain.'
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $subdomain = SkillsSubdomain::with(['domain', 'skills'])->findOrFail($id);
        
        return response()->json($subdomain);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSkillsSubdomainRequest $request, string $id)
    {
        try {
            $subdomain = SkillsSubdomain::findOrFail($id);
            $updatedSubdomain = $this->skillsSubdomainService->update($subdomain, $request->validated());
            
            return response()->json($updatedSubdomain);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Skills Subdomain not found.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while updating the skills subdomain.'
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $subdomain = SkillsSubdomain::findOrFail($id);
            $this->skillsSubdomainService->delete($subdomain);
            
            return response()->json([
                'message' => 'Skills Subdomain deleted successfully.'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Skills Subdomain not found.'
            ], 404);
        } catch (\App\Exceptions\CannotDeleteException $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 409);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while deleting the skills subdomain.'
            ], 500);
        }
    }
}