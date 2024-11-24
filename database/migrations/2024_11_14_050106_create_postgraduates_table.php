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
            $table->string('profile_picture')->nullable();
            $table->unsignedBigInteger('university'); 
            $table->foreign('university')->references('id')->on('university_list')->onDelete('cascade')->nullable();
            $table->unsignedBigInteger('faculty')->nullable(); // Faculty foreign key
            $table->foreign('faculty')->references('id')->on('faculty_list')->onDelete('cascade');
            $table->boolean('supervisorAvailability')->nullable();
            $table->boolean('grantAvailability')->nullable();
            $table->string('highest_degree')->nullable();
            $table->json('field_of_study')->nullable();
            $table->json('research_interests')->nullable();
            $table->json('ongoing_research')->nullable();
            $table->string('website')->nullable();
            $table->string('linkedin')->nullable();
            $table->string('google_scholar')->nullable();
            $table->string('researchgate')->nullable();
            $table->string('orcid')->nullable();
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
