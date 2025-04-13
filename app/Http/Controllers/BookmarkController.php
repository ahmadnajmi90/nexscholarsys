<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Bookmark;
use App\Models\Academician;
use App\Models\PostGrant;
use App\Models\PostProject;
use App\Models\PostEvent;
use App\Models\CreatePost;
use App\Models\Undergraduate;
use App\Models\Postgraduate;
use Inertia\Inertia;

class BookmarkController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Display a listing of the user's bookmarks.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $bookmarks = Bookmark::where('user_id', $user->id)
            ->with('bookmarkable')
            ->orderBy('created_at', 'desc')
            ->get()
            ->groupBy('category');
            
        return Inertia::render('Bookmarks/Index', [
            'bookmarks' => $bookmarks,
        ]);
    }

    /**
     * Add a new bookmark.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'bookmarkable_type' => 'required|string',
            'bookmarkable_id' => 'required',
            'category' => 'nullable|string',
        ]);

        $user = Auth::user();
        $bookmarkableType = $this->getBookmarkableModel($request->bookmarkable_type);
        $bookmarkable = $bookmarkableType::findOrFail($request->bookmarkable_id);
        
        // Check if bookmark already exists
        $existingBookmark = Bookmark::where([
            'user_id' => $user->id,
            'bookmarkable_type' => get_class($bookmarkable),
            'bookmarkable_id' => $bookmarkable->id,
        ])->first();
        
        if ($existingBookmark) {
            return response()->json([
                'message' => 'Already bookmarked',
                'bookmark' => $existingBookmark,
            ]);
        }
        
        // Create new bookmark
        $bookmark = new Bookmark();
        $bookmark->user_id = $user->id;
        $bookmark->bookmarkable_type = get_class($bookmarkable);
        $bookmark->bookmarkable_id = $bookmarkable->id;
        $bookmark->category = $request->category ?? 'general';
        $bookmark->save();
        
        return response()->json([
            'message' => 'Bookmark added successfully',
            'bookmark' => $bookmark,
        ]);
    }

    /**
     * Check if an item is bookmarked by the authenticated user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function check(Request $request)
    {
        $request->validate([
            'bookmarkable_type' => 'required|string',
            'bookmarkable_id' => 'required',
        ]);

        $user = Auth::user();
        $bookmarkableType = $this->getBookmarkableModel($request->bookmarkable_type);
        $bookmarkable = $bookmarkableType::findOrFail($request->bookmarkable_id);
        
        $bookmark = Bookmark::where([
            'user_id' => $user->id,
            'bookmarkable_type' => get_class($bookmarkable),
            'bookmarkable_id' => $bookmarkable->id,
        ])->first();
        
        return response()->json([
            'is_bookmarked' => $bookmark !== null,
            'bookmark' => $bookmark,
        ]);
    }

    /**
     * Remove the specified bookmark.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $user = Auth::user();
        $bookmark = Bookmark::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();
            
        $bookmark->delete();
        
        return response()->json([
            'message' => 'Bookmark removed successfully',
        ]);
    }

    /**
     * Toggle a bookmark (create if doesn't exist, remove if it does).
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function toggle(Request $request)
    {
        $request->validate([
            'bookmarkable_type' => 'required|string',
            'bookmarkable_id' => 'required',
            'category' => 'nullable|string',
        ]);

        $user = Auth::user();
        $bookmarkableType = $this->getBookmarkableModel($request->bookmarkable_type);
        $bookmarkable = $bookmarkableType::findOrFail($request->bookmarkable_id);
        
        // Find existing bookmark
        $bookmark = Bookmark::where([
            'user_id' => $user->id,
            'bookmarkable_type' => get_class($bookmarkable),
            'bookmarkable_id' => $bookmarkable->id,
        ])->first();
        
        if ($bookmark) {
            // If bookmark exists, remove it
            $bookmark->delete();
            return response()->json([
                'message' => 'Bookmark removed successfully',
                'is_bookmarked' => false,
            ]);
        } else {
            // If bookmark doesn't exist, create it
            $newBookmark = new Bookmark();
            $newBookmark->user_id = $user->id;
            $newBookmark->bookmarkable_type = get_class($bookmarkable);
            $newBookmark->bookmarkable_id = $bookmarkable->id;
            $newBookmark->category = $request->category ?? 'general';
            $newBookmark->save();
            
            return response()->json([
                'message' => 'Bookmark added successfully',
                'bookmark' => $newBookmark,
                'is_bookmarked' => true,
            ]);
        }
    }

    /**
     * Get the model class for a given bookmarkable type.
     *
     * @param  string  $type
     * @return string
     */
    private function getBookmarkableModel($type)
    {
        return match ($type) {
            'academician' => Academician::class,
            'grant' => PostGrant::class,
            'project' => PostProject::class,
            'event' => PostEvent::class,
            'post' => CreatePost::class,
            'undergraduate' => Undergraduate::class,
            'postgraduate' => Postgraduate::class,
            default => throw new \InvalidArgumentException("Invalid bookmarkable type: $type"),
        };
    }
}
