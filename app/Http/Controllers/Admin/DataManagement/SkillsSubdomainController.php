<?php

namespace App\Http\Controllers\Admin\DataManagement;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSkillsSubdomainRequest;
use App\Http\Requests\UpdateSkillsSubdomainRequest;
use App\Models\SkillsSubdomain;
use App\Services\SkillsSubdomainService;
use Illuminate\Http\RedirectResponse;

class SkillsSubdomainController extends Controller
{
    public function __construct(
        private SkillsSubdomainService $skillsSubdomainService
    ) {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSkillsSubdomainRequest $request): RedirectResponse
    {
        try {
            $this->skillsSubdomainService->create($request->validated());
            
            return redirect()->route('admin.data-management.index')
                ->with('success', 'Skills Subdomain created successfully.');
        } catch (\Exception $e) {
            return redirect()->route('admin.data-management.index')
                ->with('error', $e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSkillsSubdomainRequest $request, SkillsSubdomain $skillsSubdomain): RedirectResponse
    {
        try {
            $this->skillsSubdomainService->update($skillsSubdomain, $request->validated());
            
            return redirect()->route('admin.data-management.index')
                ->with('success', 'Skills Subdomain updated successfully.');
        } catch (\Exception $e) {
            return redirect()->route('admin.data-management.index')
                ->with('error', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SkillsSubdomain $skillsSubdomain): RedirectResponse
    {
        try {
            $this->skillsSubdomainService->delete($skillsSubdomain);
            
            return redirect()->route('admin.data-management.index')
                ->with('success', 'Skills Subdomain deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->route('admin.data-management.index')
                ->with('error', $e->getMessage());
        }
    }
}