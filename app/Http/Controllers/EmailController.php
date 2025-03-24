<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Mail\CustomEmail;

class EmailController extends Controller
{
    public function compose(Request $request)
    {
        return Inertia::render('Email/Compose', [
            'to' => $request->to,
            'replyTo' => Auth::user()->email,
        ]);
    }

    public function send(Request $request)
    {
        Log::info('Starting email send process', [
            'to' => $request->input('to'),
            'subject' => $request->input('subject'),
            'has_attachments' => $request->hasFile('attachments')
        ]);

        // Validate the request
        $validated = $request->validate([
            'to' => 'required|email',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'attachments.*' => 'nullable|file|max:10240', // 10MB max per file
        ]);

        try {
            $attachments = [];
            
            if ($request->hasFile('attachments')) {
                $files = $request->file('attachments');
                
                // Convert single file to array if necessary
                $files = is_array($files) ? $files : [$files];

                foreach ($files as $index => $file) {
                    if (!$file->isValid()) {
                        Log::error('Invalid file upload', [
                            'index' => $index,
                            'error' => $file->getError()
                        ]);
                        continue;
                    }

                    // Store the file in email-attachments directory to ensure it persists
                    // through the entire request (temp files might be deleted)
                    $path = $file->store('email-attachments', 'public');
                    $fullPath = Storage::disk('public')->path($path);
                    
                    // Add to attachments with the full path
                    $attachments[] = [
                        'path' => $fullPath,
                        'name' => $file->getClientOriginalName()
                    ];
                    
                    Log::info("File stored for attachment", [
                        'original_name' => $file->getClientOriginalName(),
                        'stored_path' => $fullPath
                    ]);
                }
            }

            Log::info('Attempting to send email', [
                'to' => $validated['to'],
                'attachments_count' => count($attachments)
            ]);

            // Use the Mail facade directly with a closure instead of a Mailable class
            Mail::html($validated['message'], function ($message) use ($validated, $attachments) {
                $message->to($validated['to']);
                $message->subject($validated['subject']);
                $message->replyTo(Auth::user()->email, Auth::user()->name ?? 'Nexscholar');
                
                // Add attachments if any
                foreach ($attachments as $attachment) {
                    if (isset($attachment['path']) && file_exists($attachment['path'])) {
                        $message->attach($attachment['path'], [
                            'as' => $attachment['name'] ?? basename($attachment['path'])
                        ]);
                    }
                }
            });

            Log::info('Email sent successfully');
            
            // Clean up stored files
            foreach ($attachments as $attachment) {
                if (isset($attachment['path']) && file_exists($attachment['path'])) {
                    @unlink($attachment['path']);
                    Log::info('Cleaned up attachment', ['path' => $attachment['path']]);
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Email sent successfully!'
            ]);
        } catch (\Exception $e) {
            Log::error('Error in email process', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            // Clean up stored files if there was an error
            if (isset($attachments) && is_array($attachments)) {
                foreach ($attachments as $attachment) {
                    if (isset($attachment['path']) && file_exists($attachment['path'])) {
                        @unlink($attachment['path']);
                        Log::info('Cleaned up attachment after error', ['path' => $attachment['path']]);
                    }
                }
            }

            return response()->json([
                'success' => false,
                'message' => 'Failed to send email: ' . $e->getMessage()
            ], 500);
        }
    }

}
