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
        // Add embedding columns to postgraduates table
        Schema::table('postgraduates', function (Blueprint $table) {
            $table->json('research_embedding')->nullable();
            $table->boolean('has_embedding')->default(false);
            $table->timestamp('embedding_updated_at')->nullable();
        });

        // Add embedding columns to undergraduates table
        Schema::table('undergraduates', function (Blueprint $table) {
            $table->json('research_embedding')->nullable();
            $table->boolean('has_embedding')->default(false);
            $table->timestamp('embedding_updated_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove embedding columns from postgraduates table
        Schema::table('postgraduates', function (Blueprint $table) {
            $table->dropColumn('research_embedding');
            $table->dropColumn('has_embedding');
            $table->dropColumn('embedding_updated_at');
        });

        // Remove embedding columns from undergraduates table
        Schema::table('undergraduates', function (Blueprint $table) {
            $table->dropColumn('research_embedding');
            $table->dropColumn('has_embedding');
            $table->dropColumn('embedding_updated_at');
        });
    }
}; 