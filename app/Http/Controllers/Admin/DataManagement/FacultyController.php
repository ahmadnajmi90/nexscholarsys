<?php

namespace App\Http\Controllers\Admin\DataManagement;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFacultyRequest;
use App\Http\Requests\UpdateFacultyRequest;
use App\Models\FacultyList;
use App\Services\FacultyService;
use Illuminate\Http\RedirectResponse;

class FacultyController extends Controller
{
    public function __construct(
        private FacultyService $facultyService
    ) {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFacultyRequest $request): RedirectResponse
    {
        try {
            $this->facultyService->create($request->validated());
            
            return redirect()->route('admin.data-management.index')
                ->with('success', 'Faculty created successfully.');
        } catch (\Exception $e) {
            return redirect()->route('admin.data-management.index')
                ->with('error', $e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFacultyRequest $request, FacultyList $faculty): RedirectResponse
    {
        try {
            $this->facultyService->update($faculty, $request->validated());
            
            return redirect()->route('admin.data-management.index')
                ->with('success', 'Faculty updated successfully.');
        } catch (\Exception $e) {
            return redirect()->route('admin.data-management.index')
                ->with('error', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FacultyList $faculty): RedirectResponse
    {
        try {
            $this->facultyService->delete($faculty);
            
            return redirect()->route('admin.data-management.index')
                ->with('success', 'Faculty deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->route('admin.data-management.index')
                ->with('error', $e->getMessage());
        }
    }
} 