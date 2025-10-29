<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class GoogleController extends Controller
{
    // Redirect the user to the Google authentication page.
    public function redirectToGoogle()
    {
        return Socialite::driver('google')
            ->scopes([]) // Only request basic scopes (email, profile, openid)
            ->redirect();
    }

    // Obtain the user information from Google.
    public function handleGoogleCallback()
    {
        try {
            // Retrieve user information from Google.
            $googleUser = Socialite::driver('google')->stateless()->user();

            // Check if a user with the same email already exists.
            $user = User::where('email', $googleUser->getEmail())->first();

            if ($user) {
                // Log in the existing user.
                Auth::login($user);
            } else {
                // Create a new user record.
                $user = User::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    // Optionally, you can generate a random password.
                    'password' => bcrypt(Str::random(16)),
                    // Mark email as verified since Google has already verified the email.
                    'email_verified_at' => now(),
                ]);

                Auth::login($user);
            }

            // Redirect to the intended page (e.g., dashboard).
            return redirect()->intended('dashboard');
        } catch (\Exception $e) {
            // Handle errors, e.g. log them and redirect back to login.
            return redirect('login')->withErrors(['msg' => 'Something went wrong. Please try again.']);
        }
    }
}
