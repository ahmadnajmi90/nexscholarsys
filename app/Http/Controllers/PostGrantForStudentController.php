<?php

namespace App\Http\Controllers;

use App\Models\PostGrantForStudent;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class PostGrantForStudentController extends Controller
{
    public function index(Request $request)
    {
        if(Auth::user()->cannot('post-grants'))
        {
            abort(403, 'Unauthorized access.');
        }
        else{
            $postGrants = auth()->user()->postGrants;
        return Inertia::render('PostGrants/Index', [
            'postGrants' => $postGrants,
        ]);

        $search = $request->input('search');

    $postGrants = PostGrantForStudent::query()
        ->when($search, function ($query, $search) {
            $query->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
        })
        ->paginate(10); // Adjust the number per page as needed

        return inertia('PostGrants/Index', [
            'postGrants' => $postGrants,
            'search' => $search,
        ]);
        }
    }

    public function create()
    {
        if(Auth::user()->cannot('post-grants'))
        {
            abort(403, 'Unauthorized access.');
        }
        else{
            return Inertia::render('PostGrants/Create');
        }
    }

    public function store(Request $request)
    {
        if(Auth::user()->cannot('post-grants'))
        {
            abort(403, 'Unauthorized access.');
        }
        else{
            $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
            ]);

            auth()->user()->postGrants()->create($request->only('title', 'description'));

            return redirect()->route('post-grants.index')->with('success', 'Post grant created successfully.');
        }
    }

    public function edit($id)
    {
        if(Auth::user()->cannot('post-grants'))
        {
            abort(403, 'Unauthorized access.');
        }
        else{
            $postGrant = auth()->user()->postGrants()->findOrFail($id);
            return Inertia::render('PostGrants/Edit', [
                'postGrant' => $postGrant,
            ]);
        }
    }

    public function update(Request $request, $id)
    {
        if(Auth::user()->cannot('post-grants'))
        {
            abort(403, 'Unauthorized access.');
        }
        else{
            $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
            ]);

            $postGrant = auth()->user()->postGrants()->findOrFail($id);
            $postGrant->update($request->only('title', 'description'));

            return redirect()->route('post-grants.index')->with('success', 'Post grant updated successfully.');
        }
    }

    public function destroy($id)
    {
        if(Auth::user()->cannot('post-grants'))
        {
            abort(403, 'Unauthorized access.');
        }
        else{
            $postGrant = auth()->user()->postGrants()->findOrFail($id);
            $postGrant->delete();

            return redirect()->route('post-grants.index')->with('success', 'Post grant deleted successfully.');
        }
    }
}
