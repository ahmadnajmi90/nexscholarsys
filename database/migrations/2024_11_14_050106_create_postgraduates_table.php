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
        Schema::create('postgraduates', function (Blueprint $table) {
            $table->id();
            $table->string('postgraduate_id')->unique();
            $table->string('phone_number')->nullable();
            $table->string('full_name')->nullable();
            $table->json('previous_degree')->nullable();
            $table->string('bachelor')->nullable();
            $table->string('CGPA_bachelor')->nullable();
            $table->string('master')->nullable();
            $table->string('master_type')->nullable();
            $table->string('profile_picture')->nullable();
            $table->string('nationality')->nullable();
            $table->unsignedBigInteger('university')->nullable(); 
            $table->foreign('university')->references('id')->on('university_list')->onDelete('cascade');
            $table->unsignedBigInteger('faculty')->nullable(); // Faculty foreign key
            $table->foreign('faculty')->references('id')->on('faculty_list')->onDelete('cascade');
            $table->string('english_proficiency_level')->nullable();
            $table->string('funding_requirement')->nullable();
            $table->string('current_postgraduate_status')->nullable();
            $table->string('matric_no')->nullable();
            $table->string('suggested_research_title')->nullable();
            $table->text('suggested_research_description')->nullable();
            $table->json('field_of_research')->nullable();
            $table->string('CV_file')->nullable();
            $table->boolean('supervisorAvailability')->nullable();
            $table->boolean('grantAvailability')->nullable();
            $table->string('website')->nullable();
            $table->string('linkedin')->nullable();
            $table->string('google_scholar')->nullable();
            $table->string('researchgate')->nullable();
            $table->text('bio')->nullable();
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('postgraduates');
    }
};
