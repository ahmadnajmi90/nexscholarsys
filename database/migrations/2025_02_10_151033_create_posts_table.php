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
        Schema::create('create-posts', function (Blueprint $table) {
            $table->id();
            $table->string('author_id');
            $table->string('title');
            $table->string('url')->nullable();
            $table->text('content')->nullable();
            $table->string('category')->nullable();
            $table->json('tags')->nullable(); // Changed to JSON for multiple tags
            $table->string('image')->nullable();
            $table->string('featured_image')->nullable();
            $table->string('attachment')->nullable();
            $table->string('status')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
