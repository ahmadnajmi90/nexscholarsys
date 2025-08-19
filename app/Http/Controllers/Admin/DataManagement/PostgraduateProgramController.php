<?php

namespace App\Http\Controllers\Admin\DataManagement;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePostgraduateProgramRequest;
use App\Http\Requests\UpdatePostgraduateProgramRequest;
use App\Models\PostgraduateProgram;
use App\Services\PostgraduateProgramService;
use Illuminate\Http\RedirectResponse;

class PostgraduateProgramController extends Controller
{
    public function __construct(
        private PostgraduateProgramService $postgraduateProgramService
    ) {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePostgraduateProgramRequest $request): RedirectResponse
    {
        try {
            $this->postgraduateProgramService->create($request->validated());
            
            return redirect()->route('admin.data-management.index')
                ->with('success', 'Postgraduate Program created successfully.');
        } catch (\Exception $e) {
            return redirect()->route('admin.data-management.index')
                ->with('error', $e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePostgraduateProgramRequest $request, PostgraduateProgram $postgraduateProgram): RedirectResponse
    {
        try {
            $this->postgraduateProgramService->update($postgraduateProgram, $request->validated());
            
            return redirect()->route('admin.data-management.index')
                ->with('success', 'Postgraduate Program updated successfully.');
        } catch (\Exception $e) {
            return redirect()->route('admin.data-management.index')
                ->with('error', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PostgraduateProgram $postgraduateProgram): RedirectResponse
    {
        try {
            $this->postgraduateProgramService->delete($postgraduateProgram);
            
            return redirect()->route('admin.data-management.index')
                ->with('success', 'Postgraduate Program deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->route('admin.data-management.index')
                ->with('error', $e->getMessage());
        }
    }
} 