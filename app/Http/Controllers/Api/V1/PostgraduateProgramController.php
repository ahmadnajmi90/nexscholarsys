<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePostgraduateProgramRequest;
use App\Http\Requests\UpdatePostgraduateProgramRequest;
use App\Http\Requests\ImportPostgraduateProgramsRequest;
use App\Http\Resources\PostgraduateProgramResource;
use App\Imports\PostgraduateProgramsImport;
use App\Models\PostgraduateProgram;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Maatwebsite\Excel\Facades\Excel;

class PostgraduateProgramController extends Controller
{
    public function index(Request $request)
    {
        $query = PostgraduateProgram::with(['university', 'faculty']);

        if ($request->has('search')) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%");
        }

        $sortBy = $request->input('sort_by', 'id');
        $sortDirection = $request->input('sort_direction', 'asc');
        $query->orderBy($sortBy, $sortDirection);

        $perPage = $request->input('per_page', 15);
        $programs = $query->paginate($perPage);

        return PostgraduateProgramResource::collection($programs);
    }

    public function store(StorePostgraduateProgramRequest $request)
    {
        $program = PostgraduateProgram::create($request->validated());

        return Redirect::route('admin.data-management.index')
            ->with('success', 'Postgraduate Program created successfully.');
    }

    public function show(string $id)
    {
        $program = PostgraduateProgram::findOrFail($id);
        return new PostgraduateProgramResource($program);
    }

    public function update(UpdatePostgraduateProgramRequest $request, string $id)
    {
        $program = PostgraduateProgram::findOrFail($id);
        $program->update($request->validated());

        return Redirect::route('admin.data-management.index')
            ->with('success', 'Postgraduate Program updated successfully.');
    }

    public function destroy(string $id)
    {
        $program = PostgraduateProgram::findOrFail($id);
        $program->delete();

        if (request()->wantsJson() || request()->ajax()) {
            return response()->json([
                'message' => 'Postgraduate Program deleted successfully.'
            ]);
        }
        return Redirect::route('admin.data-management.index')
            ->with('success', 'Postgraduate Program deleted successfully.');
    }

    public function previewImport(Request $request)
    {
        $request->validate([
            'file' => 'required|extensions:xlsx,csv|max:2048',
        ]);

        $data = Excel::toArray(new PostgraduateProgramsImport, $request->file('file'));

        return response()->json($data[0] ?? []);
    }

    public function import(Request $request)
    {
        $validated = $request->validate([
            'programs' => 'required|array',
            'programs.*.name' => 'required|string',
            'programs.*.university_id' => 'required|integer|exists:university_list,id',
            'programs.*.faculty_id' => 'nullable|integer|exists:faculty_list,id',
            'programs.*.description' => 'nullable|string',
            'programs.*.duration_years' => 'nullable|string',
            'programs.*.funding_info' => 'nullable|string',
            'programs.*.application_url' => 'nullable|string',
            'programs.*.country' => 'nullable|string',
        ]);

        foreach ($validated['programs'] as $programData) {
            PostgraduateProgram::updateOrCreate(
                [
                    'name' => $programData['name'],
                    'university_id' => $programData['university_id'],
                ],
                $programData
            );
        }

        return response()->json(['message' => 'Postgraduate Programs imported successfully.']);
    }
}
