<?php

namespace App\Http\Controllers\ContentManagement;

use App\Http\Controllers\Controller;
use App\Models\PostEvent;
use App\Models\FieldOfResearch;
use App\Services\PostEventService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Silber\Bouncer\BouncerFacade;

class PostEventController extends Controller
{
    protected $postEventService;

    public function __construct(PostEventService $postEventService)
    {
        $this->postEventService = $postEventService;
    }

    public function index(Request $request)
    {
        if (Auth::user()->cannot('post-events')) {
            abort(403, 'Unauthorized access.');
        }

        $search = $request->input('search');

        $postEvents = PostEvent::query()
            ->where('author_id', Auth::user()->unique_id)
            ->when($search, function ($query, $search) {
                $query->where('event_name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->where('author_id', Auth::user()->unique_id);
            })
            ->paginate(10);

        return Inertia::render('PostEvents/Index', [
            'postEvents' => $postEvents,
            'search' => $search,
        ]);
    }

    public function create()
    {
        if (Auth::user()->cannot('post-events')) {
            abort(403, 'Unauthorized access.');
        }

        $fieldOfResearches = FieldOfResearch::with('researchAreas.nicheDomains')->get();
        $researchOptions = [];
        foreach ($fieldOfResearches as $field) {
            foreach ($field->researchAreas as $area) {
                foreach ($area->nicheDomains as $domain) {
                    $researchOptions[] = [
                        'field_of_research_id' => $field->id,
                        'field_of_research_name' => $field->name,
                        'research_area_id' => $area->id,
                        'research_area_name' => $area->name,
                        'niche_domain_id' => $domain->id,
                        'niche_domain_name' => $domain->name,
                    ];
                }
            }
        }

        return Inertia::render('PostEvents/Create', [
            'auth' => Auth::user(),
            'researchOptions' => $researchOptions,
        ]);
    }

    public function store(Request $request)
    {
        if (Auth::user()->cannot('post-events')) {
            abort(403, 'Unauthorized access.');
        }

        try {
            $author = Auth::user();
            $request->merge(['author_id' => $author->unique_id]);

            if ($request->has('theme') && is_array($request->theme)) {
                $request->merge(['theme' => json_encode($request->theme)]);
            }

            if ($request->has('target_audience') && is_array($request->target_audience)) {
                $request->merge(['target_audience' => json_encode($request->target_audience)]);
            }

            $validated = $request->validate([
                'event_name' => 'required|string|max:255',
                'description' => 'required|string',
                'event_type' => 'required|string|max:255',
                'event_mode' => 'required|string|max:255',
                'start_date' => 'required|date',
                'end_date' => 'required|date|after_or_equal:start_date',
                'start_time' => 'required',
                'end_time' => 'required',
                'image' => 'nullable|image|max:2048',
                'event_theme' => 'required|string|max:255',
                'registration_url' => 'nullable|url|max:255',
                'registration_deadline' => 'required|date',
                'contact_email' => 'required|email|max:255',
                'venue' => 'nullable|string|max:255',
                'city' => 'nullable|string|max:255',
                'country' => 'nullable|string|max:255',
                'event_status' => 'nullable|string|in:draft,published',
                'field_of_research' => 'required',
            ]);

            $this->postEventService->createEvent($validated);

            return redirect()->route('post-events.index')->with('success', 'Post event created successfully.');
        } catch (ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->withInput();
        }
    }

    public function edit($id)
    {
        if (Auth::user()->cannot('post-events')) {
            abort(403, 'Unauthorized access.');
        }

        $fieldOfResearches = FieldOfResearch::with('researchAreas.nicheDomains')->get();
        $researchOptions = [];
        foreach ($fieldOfResearches as $field) {
            foreach ($field->researchAreas as $area) {
                foreach ($area->nicheDomains as $domain) {
                    $researchOptions[] = [
                        'field_of_research_id' => $field->id,
                        'field_of_research_name' => $field->name,
                        'research_area_id' => $area->id,
                        'research_area_name' => $area->name,
                        'niche_domain_id' => $domain->id,
                        'niche_domain_name' => $domain->name,
                    ];
                }
            }
        }

        $postEvent = auth()->user()->postEvents()->findOrFail($id);
        return Inertia::render('PostEvents/Edit', [
            'postEvent' => $postEvent,
            'auth' => Auth::user(),
            'researchOptions' => $researchOptions,
        ]);
    }

    public function update(Request $request, $id)
    {
        if (Auth::user()->cannot('post-events')) {
            abort(403, 'Unauthorized access.');
        }

        try {
            $postEvent = auth()->user()->postEvents()->findOrFail($id);
            $request->merge(['is_featured' => filter_var($request->input('is_featured'), FILTER_VALIDATE_BOOLEAN)]);

            $validated = $request->validate([
                'event_name' => 'required|string|max:255',
                'description' => 'required|string',
                'event_type' => 'required|string|max:255',
                'event_mode' => 'required|string|max:255',
                'start_date' => 'required|date',
                'end_date' => 'required|date|after_or_equal:start_date',
                'start_time' => 'required',
                'end_time' => 'required',
                'registration_url' => 'nullable|url|max:255',
                'registration_deadline' => 'required|date',
                'contact_email' => 'required|email|max:255',
                'venue' => 'nullable|string|max:255',
                'city' => 'nullable|string|max:255',
                'country' => 'nullable|string|max:255',
                'event_status' => 'nullable|string|in:draft,published',
                'event_theme' => 'required|string|max:255',
                'field_of_research' => 'required',
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
            ]);

            $this->postEventService->updateEvent($postEvent, $validated);

            return redirect()->route('post-events.index')->with('success', 'Post event updated successfully.');
        } catch (ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->withInput();
        }
    }

    public function destroy($id)
    {
        if (Auth::user()->cannot('post-events')) {
            abort(403, 'Unauthorized access.');
        }

        $postEvent = auth()->user()->postEvents()->findOrFail($id);
        $this->postEventService->deleteEvent($postEvent);

        return redirect()->route('post-events.index')->with('success', 'Post event deleted successfully.');
    }
} 