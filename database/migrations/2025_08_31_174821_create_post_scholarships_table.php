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
        Schema::create('post_scholarships', function (Blueprint $table) {
            $table->id();
            $table->string('author_id');
            $table->string('title')->nullable();
            $table->string('url')->nullable(); // For SEO-friendly URLs
            $table->text('description')->nullable(); // Changed to text for long content
            $table->date('start_date')->nullable(); // Suggested
            $table->date('end_date')->nullable(); // Suggested
            $table->date('application_deadline')->nullable(); // Suggested
            $table->string('scholarship_type')->nullable();
            $table->json('scholarship_theme')->nullable();
            $table->string('sponsored_by')->nullable();
            $table->string('email')->nullable();
            $table->string('website')->nullable(); // Suggested
            $table->string('country')->nullable();
            $table->string('image')->nullable();
            $table->string('attachment')->nullable(); // Suggested
            $table->enum('status', ['draft', 'published'])->default('draft'); // Restrict to valid values
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('post_scholarships');
    }
};
