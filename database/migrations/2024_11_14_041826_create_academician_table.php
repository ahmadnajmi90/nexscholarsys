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
        Schema::create('academicians', function (Blueprint $table) {
            $table->id();
            $table->string('academician_id')->unique();
            $table->string('phone_number')->nullable();
            $table->string('full_name')->nullable();
            $table->string('profile_picture')->nullable();
            $table->string('current_position')->nullable();
            $table->string('department')->nullable();
            $table->unsignedBigInteger('university');
            $table->foreign('university')->references('id')->on('university_list')->onDelete('cascade')->nullable();
            $table->unsignedBigInteger('faculty')->nullable(); // Faculty foreign key
            $table->foreign('faculty')->references('id')->on('faculty_list')->onDelete('cascade');
            $table->string('highest_degree')->nullable();
            $table->json('field_of_study')->nullable();
            $table->json('field_of_research')->nullable();
            $table->json('ongoing_research')->nullable();
            $table->string('website')->nullable();
            $table->string('linkedin')->nullable();
            $table->string('google_scholar')->nullable();
            $table->string('researchgate')->nullable();
            $table->string('orcid')->nullable();
            $table->text('bio')->nullable();
            $table->boolean('verified')->default(false); // this is for verification status by the faculty dean / admin
            $table->boolean('availability_for_collaboration')->default(false);
            $table->boolean('availability_as_supervisor')->default(false);
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('academician');
    }
};
