<?php

namespace App\Http\Controllers\Admin\DataManagement;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUniversityRequest;
use App\Http\Requests\UpdateUniversityRequest;
use App\Models\UniversityList;
use App\Services\UniversityService;
use Illuminate\Http\RedirectResponse;

class UniversityController extends Controller
{
    public function __construct(
        private UniversityService $universityService
    ) {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUniversityRequest $request): RedirectResponse
    {
        try {
            $this->universityService->create($request->validated());
            
            return redirect()->route('admin.data-management.index')
                ->with('success', 'University created successfully.');
        } catch (\Exception $e) {
            return redirect()->route('admin.data-management.index')
                ->with('error', $e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUniversityRequest $request, UniversityList $university): RedirectResponse
    {
        try {
            $this->universityService->update($university, $request->validated());
            
            return redirect()->route('admin.data-management.index')
                ->with('success', 'University updated successfully.');
        } catch (\Exception $e) {
            return redirect()->route('admin.data-management.index')
                ->with('error', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UniversityList $university): RedirectResponse
    {
        try {
            $this->universityService->delete($university);
            
            return redirect()->route('admin.data-management.index')
                ->with('success', 'University deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->route('admin.data-management.index')
                ->with('error', $e->getMessage());
        }
    }
} 