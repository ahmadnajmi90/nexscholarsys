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
        Schema::create('academician_views', function (Blueprint $table) {
            $table->id();
            $table->foreignId('academician_id')->constrained('academicians')->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('ip_address', 45)->nullable();
            $table->timestamps();
            
            // Add a unique constraint to prevent duplicate counting within 24 hours
            $table->unique(['academician_id', 'user_id', 'ip_address'], 'unique_academician_view');
            
            // Index for faster queries
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('academician_views');
    }
};
