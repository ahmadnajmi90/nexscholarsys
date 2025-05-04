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
        // Create a regular table - for MySQL or any database
        if (!Schema::hasTable('academician_embeddings')) {
            Schema::create('academician_embeddings', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('academician_id')->unique();
                $table->json('embedding_vector')->nullable();
                $table->timestamps();
                
                // Foreign key to academicians table
                $table->foreign('academician_id')->references('id')->on('academicians')->onDelete('cascade');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('academician_embeddings');
    }
};
