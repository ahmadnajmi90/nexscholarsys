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
        // Drop the table if it exists
        Schema::dropIfExists('post_grants');

        // Recreate the table
        Schema::create('post_grants', function (Blueprint $table) {
            $table->id();
            $table->string('author_id');
            $table->string('title')->nullable();
            $table->text('description')->nullable(); // Changed to text for long content
            $table->date('start_date')->nullable(); // Suggested
            $table->date('end_date')->nullable(); // Suggested
            $table->date('application_deadline')->nullable(); // Suggested
            $table->string('grant_type')->nullable();
            $table->json('grant_theme')->nullable();
            $table->string('cycle')->nullable();
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
        // Drop the table on rollback
        Schema::dropIfExists('post_projects');
    }
};
