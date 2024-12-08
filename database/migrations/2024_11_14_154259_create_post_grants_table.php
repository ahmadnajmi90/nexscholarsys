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
            $table->date('start_date')->nullable(); // Suggested
            $table->date('end_date')->nullable(); // Suggested
            $table->date('application_deadline')->nullable(); // Suggested
            $table->string('duration')->nullable();
            $table->string('sponsored_by')->nullable();
            $table->string('category')->nullable();
            $table->json('field_of_research')->nullable(); // Changed to JSON for multiple tags
            $table->string('supervisor_category')->nullable();
            $table->string('supervisor_name')->nullable();

            $table->unsignedBigInteger('university')->nullable(); 
            $table->foreign('university')->references('id')->on('university_list')->onDelete('cascade');

            $table->string('email')->nullable();
            $table->string('origin_country')->nullable();
            $table->string('purpose')->nullable();
            $table->string('student_nationality')->nullable();
            $table->string('student_level')->nullable();
            $table->string('appointment_type')->nullable();
            $table->string('purpose_of_collaboration')->nullable();
            $table->string('image')->nullable();
            $table->string('attachment')->nullable(); // Suggested
            $table->decimal('amount', 10, 2)->nullable(); // Suggested
            $table->string('application_url')->nullable(); // Suggested
            $table->enum('status', ['draft', 'published'])->default('draft'); // Restrict to valid values
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
