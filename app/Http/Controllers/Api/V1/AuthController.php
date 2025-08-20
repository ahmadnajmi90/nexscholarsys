<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Silber\Bouncer\BouncerFacade;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user = Auth::user();

        // IMPORTANT: Check if the user is an admin
        if (!BouncerFacade::is($user)->an('admin')) { // Assuming you have an isAdmin() method or 'role' attribute
            return response()->json(['message' => 'Access denied: Not an administrator'], 403);
        }

        // Create and return the token
        $token = $user->createToken('admin-api-token')->plainTextToken;

        return response()->json(['token' => $token]);
    }
}