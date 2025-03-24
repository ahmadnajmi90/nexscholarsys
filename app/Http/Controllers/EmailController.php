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
        Log::info('Raw request data', [
            'files' => $request->allFiles(),
            'has_file' => $request->hasFile('attachments'),
            'content_type' => $request->header('Content-Type'),
            'request_keys' => $request->keys(),
            'files_array' => is_array($request->file('attachments')),
        ]);

        $request->validate([
            'to' => 'required|email',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'attachments' => 'nullable',
            'attachments.*' => 'file|max:10240', // Max 10MB per file
        ]);

        try {
            // Debug request information
            Log::info('Request details', [
                'has_files' => $request->hasFile('attachments'),
                'all_input' => $request->except('attachments'),
                'files_count' => is_array($request->file('attachments')) ? count($request->file('attachments')) : ($request->hasFile('attachments') ? 1 : 0),
                'request_files' => $request->allFiles(),
            ]);

            // Store attachments and get their paths
            $attachmentPaths = [];
            
            if ($request->hasFile('attachments')) {
                $files = $request->file('attachments');
                Log::info('Processing attachments', [
                    'files_type' => gettype($files),
                    'is_array' => is_array($files),
                    'raw_files' => $files
                ]);
                
                // Ensure we're working with an array of files
                $files = is_array($files) ? $files : [$files];
                
                foreach ($files as $file) {
                    if (!$file->isValid()) {
                        Log::error('Invalid file upload', [
                            'error' => $file->getError(),
                            'error_message' => $file->getErrorMessage()
                        ]);
                        continue;
                    }

                    try {
                        $fileName = time() . '_' . $file->getClientOriginalName();
                        $path = $file->storeAs('email-attachments', $fileName, 'public');

                        if (!$path) {
                            throw new \Exception('Failed to store file: ' . $fileName);
                        }

                        Log::info('File stored successfully', [
                            'original_name' => $file->getClientOriginalName(),
                            'stored_path' => $path,
                            'full_path' => Storage::disk('public')->path($path),
                            'exists' => Storage::disk('public')->exists($path)
                        ]);

                        $attachmentPaths[] = [
                            'path' => $path,
                            'name' => $file->getClientOriginalName()
                        ];
                    } catch (\Exception $e) {
                        Log::error('Error processing file', [
                            'file' => $file->getClientOriginalName(),
                            'error' => $e->getMessage()
                        ]);
                    }
                }
            }

            Log::info('Preparing to send email', [
                'to' => $request->to,
                'subject' => $request->subject,
                'attachment_count' => count($attachmentPaths),
                'attachments' => $attachmentPaths
            ]);

            // Send the email
            Mail::to($request->to)
                ->send(new CustomEmail(
                    $request->subject,
                    $request->message,
                    Auth::user()->email,
                    $attachmentPaths
                ));

            Log::info('Email sent successfully');

            // Clean up stored attachments
            foreach ($attachmentPaths as $attachment) {
                Storage::disk('public')->delete($attachment['path']);
                Log::info('Cleaned up attachment', [
                    'path' => $attachment['path']
                ]);
            }

            return redirect()->back()->with([
                'success' => true,
                'message' => 'Email sent successfully!'
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to send email', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            // Clean up stored attachments in case of failure
            foreach ($attachmentPaths ?? [] as $attachment) {
                Storage::disk('public')->delete($attachment['path']);
                Log::info('Cleaned up attachment after error', [
                    'path' => $attachment['path']
                ]);
            }
            
            return redirect()->back()->with([
                'error' => true,
                'message' => 'Failed to send email: ' . $e->getMessage()
            ]);
        }
    }
}
