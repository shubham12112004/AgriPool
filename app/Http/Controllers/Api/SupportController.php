<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SupportRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SupportController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'category' => ['required', 'string', 'max:100'],
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string'],
        ]);

        $user = $request->user('spa.auth'); // Authenticated user via spa.auth if any
        $userId = $user ? $user->id : null;

        $supportRequest = SupportRequest::create([
            'user_id' => $userId,
            'name' => $validated['name'],
            'email' => $validated['email'],
            'category' => $validated['category'],
            'subject' => $validated['subject'],
            'message' => $validated['message'],
            'status' => 'pending',
        ]);

        // Attempt to send email to Admin
        $adminEmail = 'admin@agripool.com';
        $subjectText = "[AgriPool Help Desk] " . $validated['subject'];

        try {
            Mail::send([], [], function ($message) use ($validated, $adminEmail, $subjectText): void {
                $message->to($adminEmail)
                    ->subject($subjectText)
                    ->html("
                        <div style='font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px;'>
                            <h2 style='color: #10b981; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px;'>New Support Request</h2>
                            <p style='margin: 15px 0;'><strong>From User:</strong> {$validated['name']} ({$validated['email']})</p>
                            <p><strong>Category:</strong> <span style='background-color: #f3f4f6; padding: 2px 8px; border-radius: 4px; font-size: 14px;'>{$validated['category']}</span></p>
                            <p><strong>Subject:</strong> {$validated['subject']}</p>
                            <div style='background-color: #f9fafb; padding: 15px; border-left: 4px solid #10b981; border-radius: 4px; margin: 20px 0;'>
                                <p style='margin: 0; white-space: pre-wrap;'>{$validated['message']}</p>
                            </div>
                            <hr style='border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;' />
                            <p style='font-size: 11px; color: #6b7280; text-align: center;'>This message was sent automatically from AgriPool support center.</p>
                        </div>
                    ");
            });
        } catch (\Exception $e) {
            Log::error("SMTP Error: Failed to send support request email: " . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'Support request submitted successfully.',
            'data' => $supportRequest
        ], 201);
    }

    public function index(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $requests = SupportRequest::with('user')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $requests
        ]);
    }

    public function resolve(Request $request, $id): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $supportRequest = SupportRequest::findOrFail($id);
        $supportRequest->status = 'resolved';
        $supportRequest->save();

        return response()->json([
            'success' => true,
            'message' => 'Support request marked as resolved.',
            'data' => $supportRequest
        ]);
    }
}
