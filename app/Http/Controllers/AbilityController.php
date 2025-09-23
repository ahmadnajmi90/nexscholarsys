<?php

namespace App\Http\Controllers;

use App\Models\Ability;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AbilityController extends Controller
{
    public function store(Request $request)
    {
        // if(Auth::user()->cannot('assign-abilities')) {
        //     abort(403, 'You do not have permission to view this page.');
        // }
        // else{
            $request->validate([
                'name' => 'required|string|max:255|unique:abilities',
                'title' => 'nullable|string|max:255',
            ]);

            $ability = Ability::create([
                'name' => $request->name,
                'title' => $request->title,
            ]);

            return redirect()->back()->with(['message' => 'Ability created successfully!', 'ability' => $ability]);
        // }
    }

    public function destroy($id)
    {
        // if(Auth::user()->cannot('assign-abilities')) {
        //     abort(403, 'You do not have permission to view this page.');
        // }
        // else{
            $ability = Ability::findOrFail($id);
            $ability->delete();

            return redirect()->back()->with('success', 'Abilities deleted successfully.');
        // }
    }
}

