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
        Schema::create('bookmarks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('bookmarkable_type');
            $table->unsignedBigInteger('bookmarkable_id');
            $table->string('category')->nullable();
            $table->timestamps();
            
            // Add composite unique to prevent duplicate bookmarks
            $table->unique(['user_id', 'bookmarkable_type', 'bookmarkable_id']);
            
            // Add index for performance optimization
            $table->index(['bookmarkable_type', 'bookmarkable_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookmarks');
    }
};
