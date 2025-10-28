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
        Schema::create('ai_matching_search_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('search_type', ['supervisor', 'students', 'collaborators']);
            $table->text('search_query');
            $table->longText('search_results'); // JSON data
            $table->integer('results_count')->default(0); // For quick display in history
            $table->timestamp('expires_at');
            $table->timestamps();
            
            // Indexes for efficient querying
            $table->index(['user_id', 'search_type', 'created_at'], 'ai_match_history_user_type_created_idx');
            $table->index('expires_at', 'ai_match_history_expires_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_matching_search_histories');
    }
};
