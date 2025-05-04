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
        Schema::table('academicians', function (Blueprint $table) {
            // Add columns for storing embeddings
            $table->json('embedding_vector')->nullable();
            $table->boolean('has_embedding')->default(false);
            $table->timestamp('embedding_updated_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('academicians', function (Blueprint $table) {
            // Drop the columns
            $table->dropColumn('embedding_vector');
            $table->dropColumn('has_embedding');
            $table->dropColumn('embedding_updated_at');
        });
    }
};
