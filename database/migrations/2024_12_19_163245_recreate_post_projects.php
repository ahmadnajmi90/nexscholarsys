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
        Schema::dropIfExists('post_projects');

        // Recreate the table
        Schema::create('post_projects', function (Blueprint $table) {
            $table->id();
            $table->string('author_id');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('project_theme')->nullable();
            $table->json('purpose')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
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
            $table->string('student_nationality')->nullable();
            $table->string('student_level')->nullable();
            $table->string('appointment_type')->nullable();
            $table->string('purpose_of_collaboration')->nullable();
            $table->string('image')->nullable();
            $table->string('attachment')->nullable(); // Suggested
            $table->decimal('amount', 10, 2)->nullable(); // Suggested
            $table->string('application_url')->nullable(); // Suggested
            $table->string('project_status')->nullable();
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
