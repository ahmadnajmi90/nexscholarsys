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
        Schema::create('supervision_request_abstracts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('supervision_request_id')->constrained('supervision_requests')->onDelete('cascade');
            $table->text('abstract')->nullable();
            $table->enum('extraction_status', ['pending', 'extracted', 'manual', 'failed'])->default('pending');
            $table->string('source_file')->nullable(); // Which attachment file was parsed
            $table->text('extraction_error')->nullable(); // Store error if extraction failed
            $table->timestamps();
            
            // Index for faster queries
            $table->index('supervision_request_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('supervision_request_abstracts');
    }
};
