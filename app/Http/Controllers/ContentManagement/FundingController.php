<?php

namespace App\Http\Controllers\ContentManagement;

use App\Http\Controllers\Controller;
use App\Models\PostGrant;
use App\Models\PostScholarship;
use App\Services\FundingService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Silber\Bouncer\BouncerFacade;
use Illuminate\Support\Facades\Log;

class FundingController extends Controller
{
    protected $fundingService;

    public function __construct(FundingService $fundingService)
    {
        $this->fundingService = $fundingService;
    }

    public function index(Request $request)
    {
        if (Auth::user()->cannot('post-grants')) {
            abort(403, 'Unauthorized access.');
        }

        $search = $request->input('search');
        $type = $request->input('type', 'grants'); // Default to grants

        if ($type === 'grants') {
            $fundingItems = PostGrant::query()
                ->where('author_id', Auth::user()->unique_id)
                ->when($search, function ($query, $search) {
                    $query->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->where('author_id', Auth::user()->unique_id);
                })
                ->paginate(10);
        } else {
            $fundingItems = PostScholarship::query()
                ->where('author_id', Auth::user()->unique_id)
                ->when($search, function ($query, $search) {
                    $query->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->where('author_id', Auth::user()->unique_id);
                })
                ->paginate(10);
        }

        return inertia('Funding/Index', [
            'fundingItems' => $fundingItems,
            'search' => $search,
            'type' => $type,
        ]);
    }

    public function create(Request $request)
    {
        if (Auth::user()->cannot('post-grants')) {
            abort(403, 'Unauthorized access.');
        }

        $type = $request->input('type', 'grants'); // Default to grants

        return Inertia::render('Funding/Create', [
            'type' => $type,
        ]);
    }

    public function store(Request $request)
    {
        if (Auth::user()->cannot('post-grants')) {
            abort(403, 'Unauthorized access.');
        }

        try {
            $author = Auth::user();
            $request->merge(['author_id' => $author->unique_id]);

            if ($request->has('tags') && is_array($request->tags)) {
                $request->merge(['tags' => json_encode($request->tags)]);
            }

            $type = $request->input('type', 'grant');

            // Base validation rules
            $baseRules = [
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'start_date' => 'required|date',
                'end_date' => 'required|date',
                'application_deadline' => 'required|date',
                'scholarship_type' => 'nullable|string|max:255',
                'scholarship_theme' => 'nullable',
                'grant_type' => 'nullable|string|max:255',
                'grant_theme' => 'nullable',
                'sponsored_by' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'website' => 'nullable|url|max:255',
                'country' => 'required|string|max:255',
                'image' => 'nullable|image|max:2048',
                'attachment' => 'nullable|file|max:5120',
                'status' => 'nullable',
            ];

            // Add cycle validation for grants only
            if ($type === 'grant') {
                $baseRules['cycle'] = 'required|string|max:255';
            }

            $validated = $request->validate($baseRules);

            if ($type === 'grant') {
                $this->fundingService->createGrant($validated);
                return redirect()->route('funding.index', ['type' => 'grants'])->with('success', 'Grant created successfully.');
            } else {
                $this->fundingService->createScholarship($validated);
                return redirect()->route('funding.index', ['type' => 'scholarships'])->with('success', 'Scholarship created successfully.');
            }
        } catch (ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->withInput();
        }
    }

    public function edit(Request $request, $id)
    {
        if (Auth::user()->cannot('post-grants')) {
            abort(403, 'Unauthorized access.');
        }

        $type = $request->input('type', 'grants');

        if ($type === 'grants') {
            $fundingItem = Auth::user()->postGrants()->findOrFail($id);
        } else {
            $fundingItem = Auth::user()->postScholarships()->findOrFail($id);
        }

        return Inertia::render('Funding/Edit', [
            'fundingItem' => $fundingItem,
            'type' => $type,
        ]);
    }

    public function update(Request $request, $id)
    {
        if (Auth::user()->cannot('post-grants')) {
            abort(403, 'Unauthorized access.');
        }

        try {
            $type = $request->input('type', 'grant');

            Log::info('Type: ' . $type);

            if ($type === 'grant') {
                $fundingItem = Auth::user()->postGrants()->findOrFail($id);
            } else {
                $fundingItem = Auth::user()->postScholarships()->findOrFail($id);
            }

            // Base validation rules
            $baseRules = [
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'start_date' => 'required|date',
                'end_date' => 'required|date',
                'application_deadline' => 'required|date',
                'scholarship_type' => 'nullable|string|max:255',
                'scholarship_theme' => 'nullable',
                'grant_type' => 'nullable|string|max:255',
                'grant_theme' => 'nullable',
                'sponsored_by' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'website' => 'nullable|url|max:255',
                'country' => 'required|string|max:255',
                'status' => 'nullable',
                'image' => [
                    'nullable',
                    'max:2048',
                    function ($attribute, $value, $fail) use ($request) {
                        if (is_string($value) && !file_exists(public_path('storage/' . $value))) {
                            $fail('The ' . $attribute . ' field must be an existing file.');
                        } elseif (!is_string($value) && !$request->hasFile($attribute)) {
                            $fail('The ' . $attribute . ' field must be an image.');
                        }
                    },
                ],
                'attachment' => [
                    'nullable',
                    'max:5120',
                    function ($attribute, $value, $fail) use ($request) {
                        if (is_string($value) && !file_exists(public_path('storage/' . $value))) {
                            $fail('The ' . $attribute . ' field must be an existing file.');
                        } elseif (!is_string($value) && !$request->hasFile($attribute)) {
                            $fail('The ' . $attribute . ' field must be a file.');
                        }
                    },
                ],
            ];

            // Add cycle validation for grants only
            if ($type === 'grant') {
                $baseRules['cycle'] = 'required|string|max:255';
            }

            $validated = $request->validate($baseRules);

            if ($type === 'grant') {
                $this->fundingService->updateGrant($fundingItem, $validated);
                return redirect()->route('funding.index', ['type' => 'grants'])->with('success', 'Grant updated successfully.');
            } else {
                $this->fundingService->updateScholarship($fundingItem, $validated);
                return redirect()->route('funding.index', ['type' => 'scholarships'])->with('success', 'Scholarship updated successfully.');
            }
        } catch (ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->withInput();
        }
    }

    public function destroy(Request $request, $id)
    {
        if (Auth::user()->cannot('post-grants')) {
            abort(403, 'Unauthorized access.');
        }

        $type = $request->input('type', 'grants');

        if ($type === 'grants') {
            $fundingItem = Auth::user()->postGrants()->findOrFail($id);
            $this->fundingService->deleteGrant($fundingItem);
            return redirect()->route('funding.index', ['type' => 'grants'])->with('success', 'Grant deleted successfully.');
        } else {
            $fundingItem = Auth::user()->postScholarships()->findOrFail($id);
            $this->fundingService->deleteScholarship($fundingItem);
            return redirect()->route('funding.index', ['type' => 'scholarships'])->with('success', 'Scholarship deleted successfully.');
        }
    }
} 