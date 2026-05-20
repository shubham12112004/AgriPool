<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AppNotification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index()
    {
        $notifications = AppNotification::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'notifications' => $notifications
        ]);
    }

    public function read($id)
    {
        $notification = AppNotification::where('user_id', Auth::id())
            ->where('id', $id)
            ->first();

        if (!$notification) {
            return response()->json([
                'success' => false,
                'message' => 'Notification not found'
            ], 404);
        }

        $notification->update(['read_at' => now()]);

        return response()->json([
            'success' => true,
            'notification' => $notification
        ]);
    }

    public function markAllRead()
    {
        AppNotification::where('user_id', Auth::id())
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json([
            'success' => true,
            'message' => 'All notifications marked as read'
        ]);
    }

    public function destroy($id)
    {
        $notification = AppNotification::where('user_id', Auth::id())
            ->where('id', $id)
            ->first();

        if (!$notification) {
            return response()->json([
                'success' => false,
                'message' => 'Notification not found'
            ], 404);
        }

        $notification->delete();

        return response()->json([
            'success' => true,
            'message' => 'Notification deleted successfully'
        ]);
    }

    public function broadcast(Request $request)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized action. Admin role required.'
            ], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string'
        ]);

        $users = User::all();

        foreach ($users as $user) {
            AppNotification::create([
                'user_id' => $user->id,
                'type' => 'broadcast',
                'title' => $request->title,
                'body' => $request->body,
                'data' => ['sender' => 'Admin'],
                'read_at' => null
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Notification broadcasted to all users successfully.'
        ]);
    }
}
