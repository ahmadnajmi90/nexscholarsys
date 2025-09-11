<?php

namespace App\Http\Controllers\Admin\DataManagement;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSkillRequest;
use App\Http\Requests\UpdateSkillRequest;
use App\Models\Skill;
use App\Services\SkillService;
use Illuminate\Http\RedirectResponse;

class SkillController extends Controller
{
    public function __construct(
        private SkillService $skillService
    ) {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSkillRequest $request): RedirectResponse
    {
        try {
            $this->skillService->create($request->validated());
            
            return redirect()->route('admin.data-management.index')
                ->with('success', 'Skill created successfully.');
        } catch (\Exception $e) {
            return redirect()->route('admin.data-management.index')
                ->with('error', $e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSkillRequest $request, Skill $skill): RedirectResponse
    {
        try {
            $this->skillService->update($skill, $request->validated());
            
            return redirect()->route('admin.data-management.index')
                ->with('success', 'Skill updated successfully.');
        } catch (\Exception $e) {
            return redirect()->route('admin.data-management.index')
                ->with('error', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Skill $skill): RedirectResponse
    {
        try {
            $this->skillService->delete($skill);
            
            return redirect()->route('admin.data-management.index')
                ->with('success', 'Skill deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->route('admin.data-management.index')
                ->with('error', $e->getMessage());
        }
    }
}