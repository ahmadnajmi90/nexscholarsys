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
        // Add columns to academicians table
        Schema::table('academicians', function (Blueprint $table) {
            $table->boolean('qdrant_migrated')->default(false)->nullable();
            $table->timestamp('qdrant_migrated_at')->nullable();
            $table->boolean('use_qdrant')->default(false)->nullable();
        });
        
        // Add columns to postgraduates table
        Schema::table('postgraduates', function (Blueprint $table) {
            $table->boolean('qdrant_migrated')->default(false)->nullable();
            $table->timestamp('qdrant_migrated_at')->nullable();
            $table->boolean('use_qdrant')->default(false)->nullable();
        });
        
        // Add columns to undergraduates table
        Schema::table('undergraduates', function (Blueprint $table) {
            $table->boolean('qdrant_migrated')->default(false)->nullable();
            $table->timestamp('qdrant_migrated_at')->nullable();
            $table->boolean('use_qdrant')->default(false)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove columns from academicians table
        Schema::table('academicians', function (Blueprint $table) {
            $table->dropColumn(['qdrant_migrated', 'qdrant_migrated_at', 'use_qdrant']);
        });
        
        // Remove columns from postgraduates table
        Schema::table('postgraduates', function (Blueprint $table) {
            $table->dropColumn(['qdrant_migrated', 'qdrant_migrated_at', 'use_qdrant']);
        });
        
        // Remove columns from undergraduates table
        Schema::table('undergraduates', function (Blueprint $table) {
            $table->dropColumn(['qdrant_migrated', 'qdrant_migrated_at', 'use_qdrant']);
        });
    }
}; 