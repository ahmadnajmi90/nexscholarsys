<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSkillRequest;
use App\Http\Requests\UpdateSkillRequest;
use App\Models\Skill;
use App\Services\SkillService;
use Illuminate\Http\Request;

/**
 * @OA\Tag(
 * name="Skills",
 * description="API Endpoints for managing skills"
 * )
 */
class SkillController extends Controller
{
    public function __construct(
        private SkillService $skillService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Skill::query();
        
        // Filter by subdomain if provided
        if ($request->has('skills_subdomain_id')) {
            $query->where('skills_subdomain_id', $request->skills_subdomain_id);
        }
        
        // Filter by domain through subdomain if provided
        if ($request->has('skills_domain_id')) {
            $query->whereHas('subdomain', function ($q) use ($request) {
                $q->where('skills_domain_id', $request->skills_domain_id);
            });
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
        
        // Include subdomain and domain if requested
        if ($request->has('with_hierarchy') && $request->with_hierarchy) {
            $query->with('subdomain.domain');
        }
        
        // Paginate results
        $perPage = $request->input('per_page', 15);
        $skills = $query->withCount('users')->paginate($perPage);
        
        // Add full_name attribute to each skill if hierarchy is loaded
        if ($request->has('with_hierarchy') && $request->with_hierarchy) {
            $skills->getCollection()->transform(function ($skill) {
                $skill->full_name = $skill->full_name;
                return $skill;
            });
        }
        
        return response()->json($skills);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSkillRequest $request)
    {
        try {
            $skill = $this->skillService->create($request->validated());
            
            return response()->json($skill, 201);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while creating the skill.'
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $skill = Skill::with('subdomain.domain')->findOrFail($id);
        $skill->full_name = $skill->full_name;
        
        return response()->json($skill);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSkillRequest $request, string $id)
    {
        try {
            $skill = Skill::findOrFail($id);
            $updatedSkill = $this->skillService->update($skill, $request->validated());
            
            return response()->json($updatedSkill);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Skill not found.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while updating the skill.'
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $skill = Skill::findOrFail($id);
            $this->skillService->delete($skill);
            
            return response()->json([
                'message' => 'Skill deleted successfully.'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Skill not found.'
            ], 404);
        } catch (\App\Exceptions\CannotDeleteException $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 409);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while deleting the skill.'
            ], 500);
        }
    }
}