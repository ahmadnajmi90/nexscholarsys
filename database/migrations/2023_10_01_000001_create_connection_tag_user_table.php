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
        Schema::create('connection_tag_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('connection_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('connection_tag_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            
            // Provide a shorter, custom name for the unique index
            $table->unique(['connection_id', 'user_id', 'connection_tag_id'], 'connection_user_tag_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('connection_tag_user');
    }
};