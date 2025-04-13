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
        Schema::create('academician_recommendations', function (Blueprint $table) {
            $table->id();
            $table->string('academician_id');
            $table->integer('user_id')->nullable(); // User who made the recommendation
            $table->string('ip_address')->nullable(); // IP address for anonymous recommendations
            
            // Comment categories
            $table->text('communication_comment')->nullable();
            $table->text('support_comment')->nullable();
            $table->text('expertise_comment')->nullable();
            $table->text('responsiveness_comment')->nullable();
            
            $table->timestamps();
            
            // Foreign key relationship
            $table->foreign('academician_id')
                  ->references('academician_id')
                  ->on('academicians')
                  ->onDelete('cascade');
                  
            // Ensure a user can only recommend an academician once
            $table->unique(['academician_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('academician_recommendations');
    }
};
