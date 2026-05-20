<?php

namespace Tests\Feature;

use App\Models\Conversation;
use App\Models\Delivery;
use App\Models\User;
use App\Services\SpaTokenService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ChatSystemTest extends TestCase
{
    use RefreshDatabase;

    private SpaTokenService $tokenService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->tokenService = app(SpaTokenService::class);
    }

    public function test_farmer_and_driver_can_chat_about_pending_booking(): void
    {
        // 1. Create a farmer
        $farmer = User::create([
            'name' => 'Farmer Bob',
            'email' => 'bob@farmer.com',
            'password' => bcrypt('password'),
            'role' => 'farmer',
        ]);
        $farmerToken = $this->tokenService->issue($farmer);

        // 2. Create a driver
        $driver = User::create([
            'name' => 'Driver Dan',
            'email' => 'dan@driver.com',
            'password' => bcrypt('password'),
            'role' => 'driver',
        ]);
        $driverToken = $this->tokenService->issue($driver);

        // 3. Farmer creates a booking
        $delivery = Delivery::create([
            'farmer_id' => $farmer->id,
            'title' => 'Wheat delivery',
            'type' => 'transport',
            'pickup_location' => 'Farm A',
            'dropoff_location' => 'Market B',
            'status' => 'pending',
        ]);

        // 4. Farmer requests the conversation. This should automatically create the Conversation object
        $response = $this->withHeaders(['Authorization' => "Bearer {$farmerToken}"])
            ->getJson("/api/bookings/{$delivery->id}/conversation");

        $response->assertStatus(200);
        $conversationData = $response->json('data.conversation');
        $this->assertNotNull($conversationData);
        $conversationId = $conversationData['id'];

        // 5. Farmer sends a message
        $response = $this->withHeaders(['Authorization' => "Bearer {$farmerToken}"])
            ->postJson("/api/conversations/{$conversationId}/messages", [
                'body' => 'Hello, anyone available to transport?',
            ]);

        $response->assertStatus(201);
        $this->assertEquals('Hello, anyone available to transport?', $response->json('data.body'));

        // 6. Driver retrieves conversation details for the pending booking (before accepting)
        $response = $this->withHeaders(['Authorization' => "Bearer {$driverToken}"])
            ->getJson("/api/bookings/{$delivery->id}/conversation");

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data.messages'));
        $this->assertEquals('Hello, anyone available to transport?', $response->json('data.messages.0.body'));

        // 7. Driver accepts the booking
        $response = $this->withHeaders(['Authorization' => "Bearer {$driverToken}"])
            ->postJson("/api/bookings/{$delivery->id}/accept");

        $response->assertStatus(200);

        // 8. Driver sends a message
        $response = $this->withHeaders(['Authorization' => "Bearer {$driverToken}"])
            ->postJson("/api/conversations/{$conversationId}/messages", [
                'body' => 'Yes, I can accept this ride!',
            ]);

        $response->assertStatus(201);

        // 9. Farmer retrieves conversation and sees both messages
        $response = $this->withHeaders(['Authorization' => "Bearer {$farmerToken}"])
            ->getJson("/api/bookings/{$delivery->id}/conversation");

        $response->assertStatus(200);
        $this->assertCount(2, $response->json('data.messages'));
    }

    public function test_public_assistant_chatbot(): void
    {
        $response = $this->postJson('/api/assistant/chat', [
            'message' => 'How do bookings work?',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.topic', 'booking')
            ->assertJsonPath('data.role_hint', 'Choose a role first so I can tailor the guidance to your dashboard and permissions.');
    }
}
