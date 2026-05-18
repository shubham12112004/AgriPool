<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('farmer_profiles', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('farm_name')->nullable();
            $table->string('state')->nullable();
            $table->string('district')->nullable();
            $table->string('area')->nullable();
            $table->json('preferred_crops')->nullable();
            $table->decimal('farm_lat', 10, 7)->nullable();
            $table->decimal('farm_lng', 10, 7)->nullable();
            $table->string('verification_status')->default('pending');
            $table->decimal('rating_avg', 3, 2)->default(0);
            $table->unsignedInteger('reviews_count')->default(0);
            $table->unsignedInteger('completed_bookings')->default(0);
            $table->timestamps();
        });

        Schema::table('deliveries', function (Blueprint $table): void {
            $table->string('lifecycle_status')->default('requested')->after('status');
            $table->unsignedInteger('negotiated_price')->nullable()->after('amount');
            $table->string('negotiation_status')->default('open')->after('negotiated_price');
            $table->foreignId('pooled_booking_id')->nullable()->after('negotiation_status');
            $table->foreignId('vehicle_id')->nullable()->after('driver_id');
            $table->string('crop_type')->nullable()->after('type');
            $table->unsignedInteger('capacity_used_kg')->default(0)->after('crop_type');
        });

        Schema::table('vehicles', function (Blueprint $table): void {
            $table->dropUnique(['user_id']);
            $table->boolean('is_active')->default(false)->after('available');
            $table->string('maintenance_status')->default('operational')->after('is_active');
            $table->json('supported_crops')->nullable()->after('maintenance_status');
            $table->unsignedInteger('capacity_kg')->default(5000)->after('supported_crops');
            $table->timestamp('verified_at')->nullable()->after('capacity_kg');
        });

        Schema::create('pooled_bookings', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('vehicle_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('driver_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('status')->default('open');
            $table->unsignedInteger('total_capacity_kg')->default(0);
            $table->unsignedInteger('used_capacity_kg')->default(0);
            $table->unsignedInteger('shared_price')->default(0);
            $table->string('route_key')->nullable();
            $table->timestamps();
        });

        Schema::table('deliveries', function (Blueprint $table): void {
            $table->foreign('pooled_booking_id')->references('id')->on('pooled_bookings')->nullOnDelete();
            $table->foreign('vehicle_id')->references('id')->on('vehicles')->nullOnDelete();
        });

        Schema::create('booking_crops', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('delivery_id')->constrained('deliveries')->cascadeOnDelete();
            $table->string('crop_name');
            $table->decimal('quantity', 10, 2);
            $table->string('unit')->default('quintal');
            $table->unsignedInteger('weight_kg')->default(0);
            $table->timestamps();
        });

        Schema::create('booking_offers', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('delivery_id')->constrained('deliveries')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('amount');
            $table->string('status')->default('pending');
            $table->text('message')->nullable();
            $table->unsignedTinyInteger('round')->default(1);
            $table->timestamps();
        });

        Schema::create('booking_status_logs', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('delivery_id')->constrained('deliveries')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('status');
            $table->string('note')->nullable();
            $table->timestamps();
        });

        Schema::create('active_trips', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('vehicle_id')->constrained()->cascadeOnDelete();
            $table->foreignId('delivery_id')->constrained('deliveries')->cascadeOnDelete();
            $table->foreignId('driver_id')->constrained('users')->cascadeOnDelete();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('ended_at')->nullable();
            $table->string('status')->default('active');
            $table->timestamps();
        });

        Schema::create('conversations', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('delivery_id')->nullable()->constrained('deliveries')->cascadeOnDelete();
            $table->string('type')->default('booking');
            $table->string('subject')->nullable();
            $table->timestamp('last_message_at')->nullable();
            $table->timestamps();
        });

        Schema::create('conversation_participants', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('conversation_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->timestamp('last_read_at')->nullable();
            $table->boolean('is_typing')->default(false);
            $table->timestamps();
            $table->unique(['conversation_id', 'user_id']);
        });

        Schema::create('messages', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('conversation_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->text('body');
            $table->string('type')->default('text');
            $table->string('attachment_path')->nullable();
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
        });

        Schema::create('notifications', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('type');
            $table->string('title');
            $table->text('body')->nullable();
            $table->json('data')->nullable();
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
            $table->index(['user_id', 'read_at']);
        });

        Schema::table('users', function (Blueprint $table): void {
            $table->timestamp('last_seen_at')->nullable();
            $table->boolean('is_online')->default(false);
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->dropColumn(['last_seen_at', 'is_online']);
        });
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('messages');
        Schema::dropIfExists('conversation_participants');
        Schema::dropIfExists('conversations');
        Schema::dropIfExists('active_trips');
        Schema::dropIfExists('booking_status_logs');
        Schema::dropIfExists('booking_offers');
        Schema::dropIfExists('booking_crops');
        Schema::table('deliveries', function (Blueprint $table): void {
            $table->dropForeign(['pooled_booking_id']);
            $table->dropForeign(['vehicle_id']);
            $table->dropColumn([
                'lifecycle_status', 'negotiated_price', 'negotiation_status',
                'pooled_booking_id', 'vehicle_id', 'crop_type', 'capacity_used_kg',
            ]);
        });
        Schema::dropIfExists('pooled_bookings');
        Schema::table('vehicles', function (Blueprint $table): void {
            $table->dropColumn(['is_active', 'maintenance_status', 'supported_crops', 'capacity_kg', 'verified_at']);
            $table->unique('user_id');
        });
        Schema::dropIfExists('farmer_profiles');
    }
};
