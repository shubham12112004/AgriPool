<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        $this->call([
            RoleSeeder::class,
        ]);

        $admin = User::updateOrCreate(
            ['email' => 'admin@agripool.com'],
            [
                'name' => 'Admin User',
                'password' => bcrypt('adminpassword'),
                'role' => 'admin',
            ]
        );

        $farmer = User::updateOrCreate(
            ['email' => 'farmer@agripool.com'],
            [
                'name' => 'Balwinder Singh',
                'password' => bcrypt('password'),
                'role' => 'farmer',
            ]
        );

        $owner = User::updateOrCreate(
            ['email' => 'owner@agripool.com'],
            [
                'name' => 'Gurdev Singh',
                'password' => bcrypt('password'),
                'role' => 'equipment_owner',
            ]
        );

        $driver = User::updateOrCreate(
            ['email' => 'driver@agripool.com'],
            [
                'name' => 'Jagmeet Singh',
                'password' => bcrypt('password'),
                'role' => 'driver',
            ]
        );

        $buyer = User::updateOrCreate(
            ['email' => 'buyer@agripool.com'],
            [
                'name' => 'Mohit Kumar',
                'password' => bcrypt('password'),
                'role' => 'buyer',
            ]
        );

        // Seed some initial equipment listings under the owner
        \App\Models\Vehicle::updateOrCreate(
            ['registration' => 'John Deere 5050 D'],
            [
                'user_id' => $owner->id,
                'vehicle_type' => 'tractors',
                'rental_price' => 800,
                'description' => '50 HP powerful tractor with modern implements, dual clutch, power steering.',
                'location' => 'Ludhiana, Punjab',
                'image_url' => 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&w=600&q=80',
                'available' => true,
            ]
        );

        \App\Models\Vehicle::updateOrCreate(
            ['registration' => 'Preet 987 Harvester'],
            [
                'user_id' => $owner->id,
                'vehicle_type' => 'harvesters',
                'rental_price' => 2500,
                'description' => 'Self-propelled multi-crop combine harvester. High grain cleanliness and efficiency.',
                'location' => 'Bathinda, Punjab',
                'image_url' => 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80',
                'available' => true,
            ]
        );

        \App\Models\Vehicle::updateOrCreate(
            ['registration' => 'Massey Ferguson Rotavator'],
            [
                'user_id' => $owner->id,
                'vehicle_type' => 'soil preparation',
                'rental_price' => 450,
                'description' => 'Heavy-duty 7 feet rotavator for excellent soil pulverization and seedbed prep.',
                'location' => 'Jalandhar, Punjab',
                'image_url' => 'https://images.unsplash.com/photo-1594913785162-e6785382defa?auto=format&fit=crop&w=600&q=80',
                'available' => true,
            ]
        );

        \App\Models\Vehicle::updateOrCreate(
            ['registration' => 'Falcon Boom Sprayer'],
            [
                'user_id' => $owner->id,
                'vehicle_type' => 'sprayers',
                'rental_price' => 350,
                'description' => 'Tractor-mounted boom sprayer with 400 liters tank and 12-meter spraying width.',
                'location' => 'Patiala, Punjab',
                'image_url' => 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&w=600&q=80',
                'available' => true,
            ]
        );

        // Seed some initial crop products under the farmer
        \App\Models\Product::updateOrCreate(
            ['name' => 'Organic Durum Wheat'],
            [
                'user_id' => $farmer->id,
                'farm_name' => 'Green Fields Punjab',
                'price' => 2750,
                'unit' => 'quintal',
                'tag' => 'Organic',
                'description' => '100% organic durum wheat, pesticide-free, premium grade suitable for high-quality flour.',
                'image_url' => 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
            ]
        );

        \App\Models\Product::updateOrCreate(
            ['name' => 'Premium Basmati Rice (1121)'],
            [
                'user_id' => $farmer->id,
                'farm_name' => 'Golden Grain Farm',
                'price' => 8500,
                'unit' => 'quintal',
                'tag' => 'Premium',
                'description' => 'Extra-long grain Basmati Rice 1121, aromatic, aged for 2 years for optimal cooking length.',
                'image_url' => 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
            ]
        );

        \App\Models\Product::updateOrCreate(
            ['name' => 'Fresh Heirloom Tomatoes'],
            [
                'user_id' => $farmer->id,
                'farm_name' => 'Sukhdev Organic Farm',
                'price' => 40,
                'unit' => 'kg',
                'tag' => 'Fresh',
                'description' => 'Freshly plucked vine-ripened heirloom tomatoes, Juicy, sweet, and rich in lycopene.',
                'image_url' => 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
            ]
        );
    }
}
