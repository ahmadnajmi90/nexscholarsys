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
        Schema::create('scraping_logs', function (Blueprint $table) {
            $table->id();
            $table->string('academician_id');
            $table->enum('status', ['success', 'failure'])->default('failure');
            $table->text('message')->nullable();
            $table->timestamps();
            
            $table->foreign('academician_id')
                  ->references('academician_id')
                  ->on('academicians')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scraping_logs');
    }
}; 