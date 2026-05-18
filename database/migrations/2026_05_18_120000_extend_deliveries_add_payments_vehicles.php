<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('deliveries', function (Blueprint $table): void {
            $table->string('type')->default('transport')->after('title');
            $table->unsignedInteger('amount')->default(0)->after('type');
            $table->dateTime('scheduled_at')->nullable()->after('amount');
            $table->text('notes')->nullable()->after('scheduled_at');
            $table->decimal('pickup_lat', 10, 7)->nullable()->after('pickup_location');
            $table->decimal('pickup_lng', 10, 7)->nullable()->after('pickup_lat');
            $table->decimal('dropoff_lat', 10, 7)->nullable()->after('dropoff_location');
            $table->decimal('dropoff_lng', 10, 7)->nullable()->after('dropoff_lat');
        });

        Schema::create('payments', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('delivery_id')->nullable()->constrained('deliveries')->nullOnDelete();
            $table->unsignedInteger('amount');
            $table->string('currency', 3)->default('INR');
            $table->string('status')->default('success');
            $table->string('receipt_number')->unique();
            $table->string('description')->nullable();
            $table->string('razorpay_order_id')->nullable();
            $table->string('razorpay_payment_id')->nullable();
            $table->boolean('is_demo')->default(false);
            $table->timestamps();
        });

        Schema::create('vehicles', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('vehicle_type');
            $table->string('registration');
            $table->string('capacity')->nullable();
            $table->boolean('available')->default(true);
            $table->timestamps();

            $table->unique('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicles');
        Schema::dropIfExists('payments');

        Schema::table('deliveries', function (Blueprint $table): void {
            $table->dropColumn([
                'type', 'amount', 'scheduled_at', 'notes',
                'pickup_lat', 'pickup_lng', 'dropoff_lat', 'dropoff_lng',
            ]);
        });
    }
};
