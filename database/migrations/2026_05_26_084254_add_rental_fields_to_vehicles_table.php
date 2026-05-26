<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('vehicles', function (Blueprint $table) {
            $table->unsignedInteger('rental_price')->default(500)->after('available');
            $table->string('location')->nullable()->after('rental_price');
            $table->string('image_url')->nullable()->after('location');
            $table->text('description')->nullable()->after('image_url');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vehicles', function (Blueprint $table) {
            $table->dropColumn(['rental_price', 'location', 'image_url', 'description']);
        });
    }
};
