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
        Schema::create('post_grants', function (Blueprint $table) {
            $table->id();
            $table->string('author_id');
            $table->string('title')->nullable();
            $table->text('description')->nullable(); // Changed to text for long content
            $table->string('image')->nullable();
            $table->enum('post_status', ['draft', 'published'])->default('draft'); // Restrict to valid values
            $table->enum('grant_status', ['open', 'closed'])->default('open'); // Restrict to valid values
            $table->string('category')->nullable();
            $table->json('tags')->nullable(); // Changed to JSON for multiple tags
            $table->string('sponsored_by')->nullable();
            $table->string('location')->nullable();
            $table->string('email')->nullable();
            $table->string('contact_number')->nullable();
            $table->enum('purpose', ['find_pgstudent', 'find_collaboration'])->nullable(); // Restrict to valid values
            $table->date('start_date')->nullable(); // Suggested
            $table->date('end_date')->nullable(); // Suggested
            $table->decimal('budget', 10, 2)->nullable(); // Suggested
            $table->text('eligibility_criteria')->nullable(); // Suggested
            $table->boolean('is_featured')->default(false); // Suggested
            $table->string('application_url')->nullable(); // Suggested
            $table->string('attachment')->nullable(); // Suggested
            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('post_grants');
    }
};
