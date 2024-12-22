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
        Schema::create('undergraduates', function (Blueprint $table) {
            $table->id();
            $table->string('undergraduate_id')->unique();
            $table->string('full_name')->nullable();
            $table->string('phone_number')->nullable();
            $table->text('bio')->nullable();
            $table->string('bachelor')->nullable();
            $table->string('CGPA_bachelor')->nullable();
            $table->string('nationality')->nullable();
            $table->string('english_proficiency_level')->nullable();
            $table->string('current_undergraduate_status')->nullable();
            $table->unsignedBigInteger('university')->nullable(); 
            $table->foreign('university')->references('id')->on('university_list')->onDelete('cascade');
            $table->unsignedBigInteger('faculty')->nullable(); // Faculty foreign key
            $table->foreign('faculty')->references('id')->on('faculty_list')->onDelete('cascade');
            $table->string('matric_no')->nullable();
            $table->text('skill')->nullable();
            $table->boolean('interested_do_research')->nullable();
            $table->string('expected_graduate')->nullable();
            $table->json('research_preference')->nullable();
            $table->string('CV_file')->nullable();
            $table->string('profile_picture')->nullable();
            $table->string('background_image')->nullable();
            $table->string('website')->nullable();
            $table->string('linkedin')->nullable();
            $table->string('google_scholar')->nullable();
            $table->string('researchgate')->nullable();
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('undergraduates');
    }
};
