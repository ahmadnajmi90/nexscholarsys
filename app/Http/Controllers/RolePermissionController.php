<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\Ability;
use App\Models\Permission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class RolePermissionController extends Controller
{
    public function index()
    {
        // if(Auth::user()->cannot('assign-abilities')) {
        //     abort(403, 'You do not have permission to view this page.');
        // }
        // else{
            // List all roles
            $roles = Role::all();

            return inertia('Admin/RolesList', ['roles' => $roles,
            'abilities' => Ability::all()]);
        // }
    }

    public function edit($roleId)
    {
        // if(Auth::user()->cannot('assign-abilities')) {
        //     abort(403, 'You do not have permission to view this page.');
        // }
        // else{
            $role = Role::findOrFail($roleId);

            // Fetch all abilities
            $abilities = Ability::all();
        
            // Fetch assigned abilities for the role
            $assignedAbilities = Permission::where('entity_id', $roleId)
            ->pluck('ability_id')
            ->toArray();

            log::info($assignedAbilities);

            return inertia('Admin/AssignAbilities', [
                'role' => $role,
                'abilities' => $abilities,
                'assignedAbilities' => $assignedAbilities,
            ]);
        // }
    }

    public function update(Request $request, $roleId)
    {
        // if(Auth::user()->cannot('assign-abilities')) {
        //     abort(403, 'You do not have permission to view this page.');
        // }
        // else{
            $role = Role::findOrFail($roleId);

            // Validate input
            $request->validate([
                'abilities' => 'array',
                'abilities.*' => 'exists:abilities,id',
            ]);

            // Get current assigned abilities
            $currentAbilities = Permission::where('entity_id', $roleId)
                ->pluck('ability_id')
                ->toArray();

            // Determine abilities to add and remove
            $abilitiesToAdd = array_diff($request->abilities, $currentAbilities);
            $abilitiesToRemove = array_diff($currentAbilities, $request->abilities);

            // Add new permissions
            foreach ($abilitiesToAdd as $abilityId) {
                Permission::create([
                    'ability_id' => $abilityId,
                    'entity_id' => $roleId,
                    'entity_type' => "roles",
                ]);
            }

            // Remove permissions
            Permission::where('entity_id', $roleId)
                ->whereIn('ability_id', $abilitiesToRemove)
                ->delete();

            return redirect()->back()->with('success', 'Abilities updated successfully.');
        // }
    }
}
