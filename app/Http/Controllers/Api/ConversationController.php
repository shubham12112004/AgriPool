<?php

namespace App\Http\Controllers\Api;

use App\Events\ConversationMessageSent;
use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Delivery;
use App\Models\Message;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ConversationController extends Controller
{
    public function show(Request $request, int $id): JsonResponse
    {
        $delivery = $this->findAuthorizedDelivery($request, $id);
        $conversation = $this->conversationForDelivery($delivery);

        $messages = $conversation->messages()
            ->with('user')
            ->latest()
            ->limit(50)
            ->get()
            ->reverse()
            ->values();

        return response()->json([
            'data' => [
                'conversation' => $this->serializeConversation($conversation, $delivery),
                'messages' => $messages->map(fn (Message $message) => $this->serializeMessage($message)),
            ],
        ]);
    }

    public function store(Request $request, int $id): JsonResponse
    {
        $conversation = Conversation::with(['delivery.farmer', 'delivery.driver'])->findOrFail($id);
        $delivery = $conversation->delivery;

        abort_if(! $delivery, 404);
        abort_unless($this->userCanAccessDelivery($request, $delivery), 403);

        $validated = $request->validate([
            'body' => ['required', 'string', 'max:2000'],
            'type' => ['nullable', 'string', 'max:40'],
        ]);

        $message = $conversation->messages()->create([
            'user_id' => $request->user()->id,
            'body' => trim($validated['body']),
            'type' => $validated['type'] ?? 'text',
        ]);

        $conversation->forceFill([
            'last_message_at' => now(),
        ])->save();

        $message->load('user');
        event(new ConversationMessageSent($message));

        return response()->json([
            'data' => $this->serializeMessage($message),
        ], 201);
    }

    private function conversationForDelivery(Delivery $delivery): Conversation
    {
        $conversation = $delivery->conversation()->first();

        if (! $conversation) {
            $conversation = $delivery->conversation()->create([
                'type' => 'booking',
                'subject' => trim(($delivery->title ?: 'Delivery').' chat'),
                'last_message_at' => now(),
            ]);
        }

        $this->syncParticipants($conversation, $delivery);

        return $conversation->load(['delivery.farmer', 'delivery.driver', 'participants.user']);
    }

    private function findAuthorizedDelivery(Request $request, int $id): Delivery
    {
        $delivery = Delivery::with(['farmer', 'driver', 'conversation'])->findOrFail($id);

        abort_unless($this->userCanAccessDelivery($request, $delivery), 403);

        return $delivery;
    }

    private function userCanAccessDelivery(Request $request, Delivery $delivery): bool
    {
        $user = $request->user();
        $role = $user->role ?? 'farmer';

        return $delivery->farmer_id === $user->id
            || $delivery->driver_id === $user->id
            || ($role === 'driver' && $delivery->status === 'pending' && ! $delivery->driver_id);
    }

    private function syncParticipants(Conversation $conversation, Delivery $delivery): void
    {
        foreach (array_filter([$delivery->farmer_id, $delivery->driver_id]) as $userId) {
            $conversation->participants()->firstOrCreate(
                ['user_id' => $userId],
                ['last_read_at' => now(), 'is_typing' => false]
            );
        }
    }

    private function serializeConversation(Conversation $conversation, Delivery $delivery): array
    {
        return [
            'id' => $conversation->id,
            'delivery_id' => $conversation->delivery_id,
            'type' => $conversation->type,
            'subject' => $conversation->subject,
            'last_message_at' => $conversation->last_message_at?->toIso8601String(),
            'delivery' => [
                'id' => $delivery->id,
                'title' => $delivery->title,
                'type' => $delivery->type,
                'status' => $delivery->status,
                'pickup_location' => $delivery->pickup_location,
                'dropoff_location' => $delivery->dropoff_location,
                'farmer' => $delivery->farmer ? [
                    'id' => $delivery->farmer->id,
                    'name' => $delivery->farmer->name,
                ] : null,
                'driver' => $delivery->driver ? [
                    'id' => $delivery->driver->id,
                    'name' => $delivery->driver->name,
                ] : null,
            ],
            'participants' => $conversation->participants->map(fn ($participant) => [
                'id' => $participant->id,
                'user_id' => $participant->user_id,
                'last_read_at' => $participant->last_read_at?->toIso8601String(),
                'is_typing' => (bool) $participant->is_typing,
                'user' => $participant->user ? [
                    'id' => $participant->user->id,
                    'name' => $participant->user->name,
                    'role' => $participant->user->role,
                ] : null,
            ]),
        ];
    }

    private function serializeMessage(Message $message): array
    {
        return [
            'id' => $message->id,
            'conversation_id' => $message->conversation_id,
            'user_id' => $message->user_id,
            'body' => $message->body,
            'type' => $message->type,
            'attachment_path' => $message->attachment_path,
            'read_at' => $message->read_at?->toIso8601String(),
            'created_at' => $message->created_at?->toIso8601String(),
            'updated_at' => $message->updated_at?->toIso8601String(),
            'user' => $message->user ? [
                'id' => $message->user->id,
                'name' => $message->user->name,
                'role' => $message->user->role,
            ] : null,
        ];
    }
}