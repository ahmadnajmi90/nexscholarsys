<?php

namespace App\Http\Controllers\Admin\DataManagement;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSkillsDomainRequest;
use App\Http\Requests\UpdateSkillsDomainRequest;
use App\Models\SkillsDomain;
use App\Services\SkillsDomainService;
use Illuminate\Http\RedirectResponse;

class SkillsDomainController extends Controller
{
    public function __construct(
        private SkillsDomainService $skillsDomainService
    ) {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSkillsDomainRequest $request): RedirectResponse
    {
        try {
            $this->skillsDomainService->create($request->validated());
            
            return redirect()->route('admin.data-management.index')
                ->with('success', 'Skills Domain created successfully.');
        } catch (\Exception $e) {
            return redirect()->route('admin.data-management.index')
                ->with('error', $e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSkillsDomainRequest $request, SkillsDomain $skillsDomain): RedirectResponse
    {
        try {
            $this->skillsDomainService->update($skillsDomain, $request->validated());
            
            return redirect()->route('admin.data-management.index')
                ->with('success', 'Skills Domain updated successfully.');
        } catch (\Exception $e) {
            return redirect()->route('admin.data-management.index')
                ->with('error', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SkillsDomain $skillsDomain): RedirectResponse
    {
        try {
            $this->skillsDomainService->delete($skillsDomain);
            
            return redirect()->route('admin.data-management.index')
                ->with('success', 'Skills Domain deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->route('admin.data-management.index')
                ->with('error', $e->getMessage());
        }
    }
}