<?php

namespace App\Http\Controllers\Admin\DataManagement;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreResearchAreaRequest;
use App\Http\Requests\UpdateResearchAreaRequest;
use App\Models\ResearchArea;
use App\Services\ResearchAreaService;
use Illuminate\Http\RedirectResponse;

class ResearchAreaController extends Controller
{
    public function __construct(
        private ResearchAreaService $researchAreaService
    ) {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreResearchAreaRequest $request): RedirectResponse
    {
        try {
            $this->researchAreaService->create($request->validated());
            
            return redirect()->route('admin.data-management.index')
                ->with('success', 'Research Area created successfully.');
        } catch (\Exception $e) {
            return redirect()->route('admin.data-management.index')
                ->with('error', $e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateResearchAreaRequest $request, ResearchArea $researchArea): RedirectResponse
    {
        try {
            $this->researchAreaService->update($researchArea, $request->validated());
            
            return redirect()->route('admin.data-management.index')
                ->with('success', 'Research Area updated successfully.');
        } catch (\Exception $e) {
            return redirect()->route('admin.data-management.index')
                ->with('error', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ResearchArea $researchArea): RedirectResponse
    {
        try {
            $this->researchAreaService->delete($researchArea);
            
            return redirect()->route('admin.data-management.index')
                ->with('success', 'Research Area deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->route('admin.data-management.index')
                ->with('error', $e->getMessage());
        }
    }
} 