<?php

namespace App\Http\Controllers\Admin\DataManagement;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFieldOfResearchRequest;
use App\Http\Requests\UpdateFieldOfResearchRequest;
use App\Models\FieldOfResearch;
use App\Services\FieldOfResearchService;
use Illuminate\Http\RedirectResponse;

class FieldOfResearchController extends Controller
{
    public function __construct(
        private FieldOfResearchService $fieldOfResearchService
    ) {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFieldOfResearchRequest $request): RedirectResponse
    {
        try {
            $this->fieldOfResearchService->create($request->validated());
            
            return redirect()->route('admin.data-management.index')
                ->with('success', 'Field of Research created successfully.');
        } catch (\Exception $e) {
            return redirect()->route('admin.data-management.index')
                ->with('error', $e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFieldOfResearchRequest $request, FieldOfResearch $fieldOfResearch): RedirectResponse
    {
        try {
            $this->fieldOfResearchService->update($fieldOfResearch, $request->validated());
            
            return redirect()->route('admin.data-management.index')
                ->with('success', 'Field of Research updated successfully.');
        } catch (\Exception $e) {
            return redirect()->route('admin.data-management.index')
                ->with('error', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FieldOfResearch $fieldOfResearch): RedirectResponse
    {
        try {
            $this->fieldOfResearchService->delete($fieldOfResearch);
            
            return redirect()->route('admin.data-management.index')
                ->with('success', 'Field of Research deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->route('admin.data-management.index')
                ->with('error', $e->getMessage());
        }
    }
} 