<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Mail\ContactEmail;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class EmailController extends Controller
{
    public function create($receiver)
    {
        // Find the receiver by ID; abort if not found.
        $receiverUser = User::findOrFail($receiver);
        return Inertia::render('Email/Compose', [
            'receiver' => $receiverUser,
        ]);
    }

    public function send(Request $request)
    {
        $validated = $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'subject'     => 'required|string|max:255',
            'message'     => 'required|string',
        ]);

        // Retrieve the receiver using the validated ID
        $receiver = User::findOrFail($validated['receiver_id']);

        // Use Laravel’s Mail facade to send the email
        Mail::to($receiver->email)
            ->send(new ContactEmail($validated['subject'], $validated['message'], auth()->user()));

        return redirect()->back()->with('success', 'Email sent successfully!');
    }
}
