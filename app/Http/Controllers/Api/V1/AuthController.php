<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Silber\Bouncer\BouncerFacade;

/**
 * @OA\Tag(
 * name="Authentication",
 * description="API endpoints for authentication and token management"
 * )
 */
class AuthController extends Controller
{
    /**
     * Login to obtain an API bearer token.
     * 
     * @OA\Post(
     * path="/api/login",
     * operationId="login",
     * tags={"Authentication"},
     * summary="Login and obtain bearer token",
     * description="Authenticate with email and password to receive a Sanctum bearer token. **Note:** Only users with the Admin role can obtain API tokens for the stateless API.",
     * security={},
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"email", "password"},
     * @OA\Property(
     * property="email",
     * type="string",
     * format="email",
     * example="admin@example.com",
     * description="User's email address"
     * ),
     * @OA\Property(
     * property="password",
     * type="string",
     * format="password",
     * example="password",
     * description="User's password"
     * )
     * )
     * ),
     * @OA\Response(
     * response=200,
     * description="Login successful",
     * @OA\JsonContent(
     * @OA\Property(
     * property="token",
     * type="string",
     * example="1|abc123def456ghi789jkl012mno345pqr678stu901vwx234yz",
     * description="Sanctum bearer token. Use this with 'Bearer {token}' in the Authorization header."
     * )
     * )
     * ),
     * @OA\Response(
     * response=401,
     * description="Invalid credentials",
     * @OA\JsonContent(
     * @OA\Property(property="message", type="string", example="Invalid credentials")
     * )
     * ),
     * @OA\Response(
     * response=403,
     * description="Access denied - User is not an administrator",
     * @OA\JsonContent(
     * @OA\Property(property="message", type="string", example="Access denied: Not an administrator")
     * )
     * ),
     * @OA\Response(
     * response=422,
     * description="Validation error",
     * @OA\JsonContent(
     * @OA\Property(property="message", type="string", example="The email field is required."),
     * @OA\Property(
     * property="errors",
     * type="object",
     * @OA\Property(
     * property="email",
     * type="array",
     * @OA\Items(type="string", example="The email field is required.")
     * ),
     * @OA\Property(
     * property="password",
     * type="array",
     * @OA\Items(type="string", example="The password field is required.")
     * )
     * )
     * )
     * )
     * )
     */
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