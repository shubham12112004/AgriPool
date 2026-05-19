<?php

namespace App\Services;

use Illuminate\Support\Str;

class SiteAssistantService
{
    public function respond(string $message, array $context = []): array
    {
        $message = trim($message);
        $normalized = Str::lower($message);
        $role = $context['role'] ?? null;

        $topics = [
            'booking' => [
                'keywords' => ['booking', 'bookings', 'request', 'trip', 'delivery', 'schedule'],
                'reply' => 'Bookings connect a farmer with a driver or service provider. Create the request, add pickup and drop-off details, then track the status from the dashboard or message thread.',
                'suggestions' => ['How do I create a booking?', 'How do I accept a request as a driver?', 'Where can I track booking status?'],
            ],
            'chat' => [
                'keywords' => ['chat', 'message', 'messages', 'conversation', 'talk'],
                'reply' => 'Use Messages to chat directly inside a booking thread. Only the farmer and assigned driver can join the private conversation, so updates stay tied to the job.',
                'suggestions' => ['How do I open a booking chat?', 'Can I send photos or documents?', 'Who can read my messages?'],
            ],
            'map' => [
                'keywords' => ['map', 'route', 'location', 'tracking', 'marker', 'gps'],
                'reply' => 'The map shows active bookings and live service points. If the map looks clipped, refresh the page once the dashboard finishes loading so the Leaflet container can recalculate its size.',
                'suggestions' => ['How do I find nearby drivers?', 'Why does the map not fully load?', 'Can I use the map on mobile?'],
            ],
            'payments' => [
                'keywords' => ['payment', 'payments', 'pay', 'fee', 'invoice', 'receipt', 'razorpay'],
                'reply' => 'Payments are recorded per booking and you can review the history from the Payments section. Use the receipt view to confirm what was charged and when.',
                'suggestions' => ['Where is my payment history?', 'How do I verify a payment?', 'How do refunds work?'],
            ],
            'equipment' => [
                'keywords' => ['equipment', 'tractor', 'machine', 'harvester', 'rental', 'rent'],
                'reply' => 'Equipment owners can publish inventory, set availability, and receive rental requests. Farmers can browse equipment, compare availability, and book what they need for the season.',
                'suggestions' => ['How do I list equipment?', 'How do I rent machinery?', 'How do I update availability?'],
            ],
            'support' => [
                'keywords' => ['support', 'help', 'assist', 'consult', 'consultation', 'guide'],
                'reply' => 'I can help with AgriPool workflows, role setup, bookings, chat, payments, and map usage. For consultance, describe your goal and I will suggest the shortest path through the platform.',
                'suggestions' => ['Explain how AgriPool works', 'How should a farmer start?', 'What should a driver do first?'],
            ],
        ];

        foreach ($topics as $key => $topic) {
            foreach ($topic['keywords'] as $keyword) {
                if (Str::contains($normalized, $keyword)) {
                    return $this->buildResponse($key, $topic['reply'], $topic['suggestions'], $role, $context);
                }
            }
        }

        return $this->buildResponse(
            'overview',
            'AgriPool helps farmers, drivers, equipment owners, and buyers work from one dashboard. Start with your role, create or accept a booking, use Messages for realtime coordination, and review the map and payments panels as the job moves forward.',
            ['How does AgriPool work?', 'I need help with bookings', 'Show me the driver workflow'],
            $role,
            $context
        );
    }

    private function buildResponse(string $topic, string $reply, array $suggestions, ?string $role, array $context): array
    {
        $roleHint = match ($role) {
            'farmer' => 'As a farmer, you can create a booking, track the route, and message the driver inside the job thread.',
            'driver' => 'As a driver, you can review requests, accept a trip, and coordinate pickup details in realtime chat.',
            default => 'Choose a role first so I can tailor the guidance to your dashboard and permissions.',
        };

        return [
            'topic' => $topic,
            'reply' => $reply,
            'role_hint' => $roleHint,
            'suggestions' => array_values(array_unique($suggestions)),
            'context' => [
                'role' => $role,
                'booking_id' => $context['booking_id'] ?? null,
            ],
        ];
    }
}