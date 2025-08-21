<?php

namespace App\Http\Controllers\ContentManagement;

use App\Http\Controllers\Controller;
use App\Models\PostGrant;
use App\Services\PostGrantService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Silber\Bouncer\BouncerFacade;

class PostGrantController extends Controller
{
    protected $postGrantService;

    public function __construct(PostGrantService $postGrantService)
    {
        $this->postGrantService = $postGrantService;
    }

    public function index(Request $request)
    {
        if (Auth::user()->cannot('post-grants')) {
            abort(403, 'Unauthorized access.');
        }

        $search = $request->input('search');

        $postGrants = PostGrant::query()
            ->where('author_id', Auth::user()->unique_id)
            ->when($search, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->where('author_id', Auth::user()->unique_id);
            })
            ->paginate(10);

        return inertia('PostGrants/Index', [
            'postGrants' => $postGrants,
            'search' => $search,
        ]);
    }

    public function create()
    {
        if (Auth::user()->cannot('post-grants')) {
            abort(403, 'Unauthorized access.');
        }

        return Inertia::render('PostGrants/Create', [
            'auth' => Auth::user(),
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

            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'start_date' => 'required|date',
                'end_date' => 'required|date',
                'application_deadline' => 'required|date',
                'grant_type' => 'required|string|max:255',
                'grant_theme' => 'required',
                'cycle' => 'required|string|max:255',
                'sponsored_by' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'website' => 'nullable|url|max:255',
                'country' => 'required|string|max:255',
                'image' => 'nullable|image|max:2048',
                'attachment' => 'nullable|file|max:5120',
                'status' => 'nullable',
            ]);

            $this->postGrantService->createGrant($validated);

            return redirect()->route('post-grants.index')->with('success', 'Post grant created successfully.');
        } catch (ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->withInput();
        }
    }

    public function edit($id)
    {
        if (Auth::user()->cannot('post-grants')) {
            abort(403, 'Unauthorized access.');
        }

        $postGrant = auth()->user()->postGrants()->findOrFail($id);
        return Inertia::render('PostGrants/Edit', [
            'postGrant' => $postGrant,
            'auth' => Auth::user(),
        ]);
    }

    public function update(Request $request, $id)
    {
        if (Auth::user()->cannot('post-grants')) {
            abort(403, 'Unauthorized access.');
        }

        try {
            $postGrant = auth()->user()->postGrants()->findOrFail($id);
            $request->merge(['is_featured' => filter_var($request->input('is_featured'), FILTER_VALIDATE_BOOLEAN)]);

            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'start_date' => 'required|date',
                'end_date' => 'required|date',
                'application_deadline' => 'required|date',
                'grant_type' => 'required|string|max:255',
                'grant_theme' => 'required',
                'cycle' => 'required|string|max:255',
                'sponsored_by' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'website' => 'nullable|url|max:255',
                'country' => 'nullable|string|max:255',
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
            ]);

            $this->postGrantService->updateGrant($postGrant, $validated);

            return redirect()->route('post-grants.index')->with('success', 'Post grant updated successfully.');
        } catch (ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->withInput();
        }
    }

    public function destroy($id)
    {
        if (Auth::user()->cannot('post-grants')) {
            abort(403, 'Unauthorized access.');
        }

        $postGrant = auth()->user()->postGrants()->findOrFail($id);
        $this->postGrantService->deleteGrant($postGrant);

        return redirect()->route('post-grants.index')->with('success', 'Post grant deleted successfully.');
    }
} 