<?php

namespace App\Http\Controllers\Api\V1\ContentManagement;

use App\Http\Controllers\Controller;
use App\Models\PostEvent;
use App\Services\PostEventService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use App\Http\Resources\PostEventResource;

/**
 * @OA\Tag(
 *     name="Content Management - Events",
 *     description="API endpoints for managing events"
 * )
 */
class PostEventController extends Controller
{
    protected $postEventService;

    public function __construct(PostEventService $postEventService)
    {
        $this->postEventService = $postEventService;
    }

    /**
     * @OA\Get(
     *     path="/api/v1/events",
     *     summary="Get all events for the authenticated user",
     *     tags={"Content Management - Events"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="search",
     *         in="query",
     *         description="Search term for event name or description",
     *         required=false,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Parameter(
     *         name="page",
     *         in="query",
     *         description="Page number for pagination",
     *         required=false,
     *         @OA\Schema(type="integer", default=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="List of events",
     *         @OA\JsonContent(
     *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Event")),
     *             @OA\Property(property="current_page", type="integer"),
     *             @OA\Property(property="last_page", type="integer"),
     *             @OA\Property(property="per_page", type="integer"),
     *             @OA\Property(property="total", type="integer")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
     *     )
     * )
     */
    public function index(Request $request)
    {
        $search = $request->input('search');

        $postEvents = PostEvent::query()
            ->where('author_id', Auth::user()->unique_id)
            ->when($search, function ($query, $search) {
                $query->where('event_name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->where('author_id', Auth::user()->unique_id);
            })
            ->paginate(10);

        return PostEventResource::collection($postEvents);
    }

    /**
     * @OA\Get(
     *     path="/api/v1/events/{id}",
     *     summary="Get a specific event",
     *     tags={"Content Management - Events"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Event ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Event details",
     *         @OA\JsonContent(ref="#/components/schemas/Event")
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Event not found"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
     *     )
     * )
     */
    public function show($id)
    {
        $event = auth()->user()->postEvents()->findOrFail($id);
        return new PostEventResource($event);
    }

    /**
     * @OA\Post(
     *     path="/api/v1/events",
     *     summary="Create a new event",
     *     tags={"Content Management - Events"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"event_name","description","event_type","event_mode","start_date","end_date","start_time","end_time","event_theme","registration_deadline","contact_email","field_of_research"},
     *             @OA\Property(property="event_name", type="string", example="Research Conference 2024"),
     *             @OA\Property(property="description", type="string", example="Annual research conference"),
     *             @OA\Property(property="event_type", type="string", example="Conference"),
     *             @OA\Property(property="event_mode", type="string", example="Hybrid"),
     *             @OA\Property(property="start_date", type="string", format="date", example="2024-12-01"),
     *             @OA\Property(property="end_date", type="string", format="date", example="2024-12-03"),
     *             @OA\Property(property="start_time", type="string", example="09:00"),
     *             @OA\Property(property="end_time", type="string", example="17:00"),
     *             @OA\Property(property="event_theme", type="string", example="AI and Machine Learning"),
     *             @OA\Property(property="registration_deadline", type="string", format="date", example="2024-11-15"),
     *             @OA\Property(property="contact_email", type="string", format="email", example="contact@conference.com"),
     *             @OA\Property(property="field_of_research", type="object"),
     *             @OA\Property(property="venue", type="string", example="Conference Center"),
     *             @OA\Property(property="city", type="string", example="Kuala Lumpur"),
     *             @OA\Property(property="country", type="string", example="Malaysia"),
     *             @OA\Property(property="event_status", type="string", enum={"draft","published"}, example="published")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Event created successfully",
     *         @OA\JsonContent(ref="#/components/schemas/Event")
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
     *     )
     * )
     */
    public function store(Request $request)
    {
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

            $event = $this->postEventService->createEvent($validated);

            return new PostEventResource($event);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }
    }

    /**
     * @OA\Put(
     *     path="/api/v1/events/{id}",
     *     summary="Update an existing event",
     *     tags={"Content Management - Events"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Event ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"event_name","description","event_type","event_mode","start_date","end_date","start_time","end_time","event_theme","registration_deadline","contact_email","field_of_research"},
     *             @OA\Property(property="event_name", type="string", example="Updated Research Conference 2024"),
     *             @OA\Property(property="description", type="string", example="Updated annual research conference"),
     *             @OA\Property(property="event_type", type="string", example="Conference"),
     *             @OA\Property(property="event_mode", type="string", example="Hybrid"),
     *             @OA\Property(property="start_date", type="string", format="date", example="2024-12-01"),
     *             @OA\Property(property="end_date", type="string", format="date", example="2024-12-03"),
     *             @OA\Property(property="start_time", type="string", example="09:00"),
     *             @OA\Property(property="end_time", type="string", example="17:00"),
     *             @OA\Property(property="event_theme", type="string", example="AI and Machine Learning"),
     *             @OA\Property(property="registration_deadline", type="string", format="date", example="2024-11-15"),
     *             @OA\Property(property="contact_email", type="string", format="email", example="contact@conference.com"),
     *             @OA\Property(property="field_of_research", type="object"),
     *             @OA\Property(property="venue", type="string", example="Conference Center"),
     *             @OA\Property(property="city", type="string", example="Kuala Lumpur"),
     *             @OA\Property(property="country", type="string", example="Malaysia"),
     *             @OA\Property(property="event_status", type="string", enum={"draft","published"}, example="published")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Event updated successfully",
     *         @OA\JsonContent(ref="#/components/schemas/Event")
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Event not found"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
     *     )
     * )
     */
    public function update(Request $request, $id)
    {
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

            $updatedEvent = $this->postEventService->updateEvent($postEvent, $validated);

            return new PostEventResource($updatedEvent);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }
    }

    /**
     * @OA\Delete(
     *     path="/api/v1/events/{id}",
     *     summary="Delete an event",
     *     tags={"Content Management - Events"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Event ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Event deleted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Event deleted successfully")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Event not found"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
     *     )
     * )
     */
    public function destroy($id)
    {
        $postEvent = auth()->user()->postEvents()->findOrFail($id);
        $this->postEventService->deleteEvent($postEvent);

        return response()->json([
            'message' => 'Event deleted successfully'
        ]);
    }
} 