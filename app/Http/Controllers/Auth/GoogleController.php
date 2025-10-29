<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
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

                // Download and store Google profile picture
                $googleAvatarUrl = $googleUser->getAvatar();
                $profilePicturePath = $this->downloadGoogleAvatar($googleAvatarUrl, $user->email);
                
                // Store the path in session for later use in ProfileCompletionController
                if ($profilePicturePath) {
                    session()->put('google_profile_picture', $profilePicturePath);
                    session()->save(); // Explicitly save the session
                }

                Auth::login($user);
            }

            // Redirect to the intended page (e.g., dashboard).
            return redirect()->intended('dashboard');
        } catch (\Exception $e) {
            // Handle errors, e.g. log them and redirect back to login.
            Log::error('Google OAuth callback error: ' . $e->getMessage());
            return redirect('login')->withErrors(['msg' => 'Something went wrong. Please try again.']);
        }
    }

    /**
     * Download Google avatar and store locally
     *
     * @param string|null $avatarUrl
     * @param string $userEmail
     * @return string|null Relative path to stored image or null on failure
     */
    protected function downloadGoogleAvatar($avatarUrl, $userEmail)
    {
        if (empty($avatarUrl)) {
            return null;
        }

        try {
            // Create destination directory
            $destinationPath = public_path('storage/profile_pictures/google');
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }

            // Generate unique filename using timestamp and email hash
            $fileName = time() . '_' . md5($userEmail) . '.jpg';
            $filePath = $destinationPath . '/' . $fileName;

            // Download image from Google using cURL (more reliable than file_get_contents)
            $ch = curl_init($avatarUrl);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
            curl_setopt($ch, CURLOPT_TIMEOUT, 10);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
            curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
            
            $imageContent = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $curlError = curl_error($ch);
            curl_close($ch);
            
            if ($imageContent === false || $httpCode !== 200) {
                Log::warning('Failed to download Google avatar', [
                    'url' => $avatarUrl,
                    'email' => $userEmail,
                    'http_code' => $httpCode,
                    'curl_error' => $curlError
                ]);
                return null;
            }

            // Validate it's actually an image
            $imageInfo = @getimagesizefromstring($imageContent);
            if ($imageInfo === false) {
                Log::warning('Downloaded content is not a valid image', [
                    'url' => $avatarUrl,
                    'email' => $userEmail
                ]);
                return null;
            }

            // Save to local storage
            $saved = file_put_contents($filePath, $imageContent);
            
            if ($saved === false) {
                Log::error('Failed to save Google avatar to disk', [
                    'path' => $filePath,
                    'email' => $userEmail
                ]);
                return null;
            }

            // Return relative path for database storage
            return 'profile_pictures/google/' . $fileName;
            
        } catch (\Exception $e) {
            Log::error('Error downloading Google avatar', [
                'message' => $e->getMessage(),
                'url' => $avatarUrl,
                'email' => $userEmail
            ]);
            return null;
        }
    }
}
