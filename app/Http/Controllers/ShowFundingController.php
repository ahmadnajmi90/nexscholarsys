<?php

namespace App\Http\Controllers;
use App\Models\PostGrant;
use App\Models\PostScholarship;
use Inertia\Inertia;
use Silber\Bouncer\BouncerFacade;
use Illuminate\Support\Facades\Auth;
use App\Models\UniversityList;
use App\Models\User;
use Carbon\Carbon;
use App\Models\Academician;

use Illuminate\Http\Request;

class ShowFundingController extends Controller
{
    public function index(Request $request)
    {
        $searchQuery = $request->input('search');
        $today = Carbon::today();

        // Fetch published grants and add type attribute
        $grants = PostGrant::query()
            ->where('status', 'published')
            ->when($searchQuery, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
            })
            ->orderByRaw("CASE WHEN application_deadline >= ? THEN 0 ELSE 1 END", [$today])
            ->orderBy('application_deadline', 'asc')
            ->get()
            ->map(function ($grant) {
                $grant->type = 'grant';
                return $grant;
            });

        // Fetch published scholarships and add type attribute
        $scholarships = PostScholarship::query()
            ->where('status', 'published')
            ->when($searchQuery, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
            })
            ->orderByRaw("CASE WHEN application_deadline >= ? THEN 0 ELSE 1 END", [$today])
            ->orderBy('application_deadline', 'asc')
            ->get()
            ->map(function ($scholarship) {
                $scholarship->type = 'scholarship';
                return $scholarship;
            });

        // Merge collections and sort by created_at descending
        $fundingItems = $grants->merge($scholarships)->sortBy('application_deadline')->values();

        return Inertia::render('Funding/Funding', [
            'fundingItems' => $fundingItems,
            'users' => User::all(),
            'searchQuery' => $searchQuery,
        ]);
    }

    public function show(Request $request, $url)
    {
        // Determine the type from the route name
        $routeName = $request->route()->getName();

        if (str_contains($routeName, 'grant')) {
            $funding = PostGrant::where('url', $url)->firstOrFail();
        } elseif (str_contains($routeName, 'scholarship')) {
            $funding = PostScholarship::where('url', $url)->firstOrFail();
        } else {
            // Fallback: Try to find a grant first, then scholarship
            $funding = PostGrant::where('url', $url)->first();
            if (!$funding) {
                $funding = PostScholarship::where('url', $url)->firstOrFail();
            }
        }

        // Get the current user (authenticated or null)
        $user = Auth::user();

        // Get the visitor's IP address if not authenticated
        $ipAddress = !$user ? request()->ip() : null;

        // Record the view and automatically increment total_views if needed
        $funding->recordView($user ? $user->id : null, $ipAddress);

        $funding->liked = $user ? $funding->likedUsers->contains($user->id) : false;

        // Get 3 latest funding items excluding the current one, ordered by application_deadline
        $relatedGrants = PostGrant::where('id', '!=', $funding->id)
            ->where('status', 'published')
            ->where('application_deadline', '>=', now())
            ->orderBy('application_deadline', 'asc')
            ->take(3)
            ->get()
            ->map(function ($item) {
                $item->type = 'grant';
                return $item;
            });

        $relatedScholarships = PostScholarship::where('id', '!=', $funding->id)
            ->where('status', 'published')
            ->where('application_deadline', '>=', now())
            ->orderBy('application_deadline', 'asc')
            ->take(3)
            ->get()
            ->map(function ($item) {
                $item->type = 'scholarship';
                return $item;
            });

        // Merge and take 3 most recent, ensure it's an array
        $relatedFunding = $relatedGrants->merge($relatedScholarships)
            ->sortBy('application_deadline')
            ->take(3)
            ->values(); // Reset keys to ensure proper array structure

        // Clean description for meta tags
        $description = strip_tags($funding->description);
        $description = str_replace(["\n", "\r", "\t"], ' ', $description);
        $description = preg_replace('/\s+/', ' ', $description);
        $description = substr($description, 0, 200) . '...';

        // Handle image URL and dimensions
        $imageUrl = $funding->image
            ? secure_url('/storage/' . $funding->image)
            : secure_url('/storage/default-image.jpg');

        $category = $funding instanceof PostGrant ? 'Grant' : 'Scholarship';

        // Generate the correct route based on funding type
        $routeName = $funding instanceof PostGrant ? 'funding.show.grant' : 'funding.show.scholarship';

        $metaTags = [
            'title' => $funding->title,
            'description' => $description,
            'image' => $imageUrl,
            'type' => 'article',
            'url' => route($routeName, $funding),
            'published_time' => $funding->created_at->toIso8601String(),
            'category' => $category,
            'site_name' => config('app.name'),
            'locale' => 'en_US'
        ];

        // Add type to funding item for frontend
        $funding->type = $funding instanceof PostGrant ? 'grant' : 'scholarship';

        // Add type to related funding items
        $relatedFunding = $relatedFunding->map(function ($item) {
            $item->type = $item instanceof PostGrant ? 'grant' : 'scholarship';
            return $item;
        });

        return Inertia::render('Funding/Show', [
            'fundingItem' => $funding,
            'users' => User::all(),
            'academicians' => Academician::all(),
            'metaTags' => $metaTags,
            'relatedFunding' => $relatedFunding
        ])->with([
            'meta' => $metaTags
        ]);
    }

    public function toggleLike(Request $request, $url)
    {
        // Determine the type from the route name
        $routeName = $request->route()->getName();

        if (str_contains($routeName, 'grant')) {
            $funding = PostGrant::where('url', $url)->firstOrFail();
        } elseif (str_contains($routeName, 'scholarship')) {
            $funding = PostScholarship::where('url', $url)->firstOrFail();
        } else {
            // Fallback: Try to find a grant first, then scholarship
            $funding = PostGrant::where('url', $url)->first();
            if (!$funding) {
                $funding = PostScholarship::where('url', $url)->firstOrFail();
            }
        }

        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        if ($funding->likedUsers()->where('user_id', $user->id)->exists()) {
            // Unlike
            $funding->likedUsers()->detach($user->id);
        } else {
            // Like
            $funding->likedUsers()->attach($user->id);
        }

        // Optionally update a cached total like count on the posts table.
        $funding->total_likes = $funding->likedUsers()->count();
        $funding->save();

        return response()->json([
            'total_likes' => $funding->total_likes,
            'liked' => $funding->likedUsers()->where('user_id', $user->id)->exists()
        ]);
    }

    public function share(Request $request, $url)
    {
        // Determine the type from the route name
        $routeName = $request->route()->getName();

        if (str_contains($routeName, 'grant')) {
            $funding = PostGrant::where('url', $url)->firstOrFail();
        } elseif (str_contains($routeName, 'scholarship')) {
            $funding = PostScholarship::where('url', $url)->firstOrFail();
        } else {
            // Fallback: Try to find a grant first, then scholarship
            $funding = PostGrant::where('url', $url)->first();
            if (!$funding) {
                $funding = PostScholarship::where('url', $url)->firstOrFail();
            }
        }

        // Clean description for meta tags
        $description = strip_tags($funding->description);
        $description = str_replace(["\n", "\r", "\t"], ' ', $description);
        $description = preg_replace('/\s+/', ' ', $description);
        $description = substr($description, 0, 200) . '...';

        // Handle image URL and dimensions
        $imageUrl = $funding->image
            ? secure_url('/storage/' . $funding->image)
            : secure_url('/storage/default-image.jpg');

        // Get image dimensions
        $imagePath = $funding->image
            ? storage_path('app/public/' . $funding->image)
            : public_path('storage/default-image.jpg');

        $imageSize = @getimagesize($imagePath);
        $imageWidth = $imageSize ? $imageSize[0] : 1200;
        $imageHeight = $imageSize ? $imageSize[1] : 630;

        $category = $funding instanceof PostGrant ? 'Grant' : 'Scholarship';

        // Generate the correct route based on funding type
        $routeName = $funding instanceof PostGrant ? 'funding.show.grant' : 'funding.show.scholarship';

        $metaTags = [
            'title' => $funding->title,
            'description' => $description,
            'image' => $imageUrl,
            'image_width' => $imageWidth,
            'image_height' => $imageHeight,
            'type' => 'article',
            'url' => route($routeName, $funding),
            'published_time' => $funding->created_at->toIso8601String(),
            'category' => $category,
            'site_name' => config('app.name'),
            'locale' => 'en_US'
        ];

        return response()->json([
            'success' => true,
            'metaTags' => $metaTags
        ]);
    }

}
