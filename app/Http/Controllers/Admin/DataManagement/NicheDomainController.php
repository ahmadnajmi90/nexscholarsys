<?php

namespace App\Http\Controllers\Admin\DataManagement;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreNicheDomainRequest;
use App\Http\Requests\UpdateNicheDomainRequest;
use App\Models\NicheDomain;
use App\Services\NicheDomainService;
use Illuminate\Http\RedirectResponse;

class NicheDomainController extends Controller
{
    public function __construct(
        private NicheDomainService $nicheDomainService
    ) {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreNicheDomainRequest $request): RedirectResponse
    {
        try {
            $this->nicheDomainService->create($request->validated());
            
            return redirect()->route('admin.data-management.index')
                ->with('success', 'Niche Domain created successfully.');
        } catch (\Exception $e) {
            return redirect()->route('admin.data-management.index')
                ->with('error', $e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateNicheDomainRequest $request, NicheDomain $nicheDomain): RedirectResponse
    {
        try {
            $this->nicheDomainService->update($nicheDomain, $request->validated());
            
            return redirect()->route('admin.data-management.index')
                ->with('success', 'Niche Domain updated successfully.');
        } catch (\Exception $e) {
            return redirect()->route('admin.data-management.index')
                ->with('error', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(NicheDomain $nicheDomain): RedirectResponse
    {
        try {
            $this->nicheDomainService->delete($nicheDomain);
            
            return redirect()->route('admin.data-management.index')
                ->with('success', 'Niche Domain deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->route('admin.data-management.index')
                ->with('error', $e->getMessage());
        }
    }
} 