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
            $table->string('university')->nullable();
            $table->string('highest_degree')->nullable();
            $table->string('field_of_study')->nullable();
            $table->text('research_interests')->nullable();
            $table->text('ongoing_research')->nullable();
            $table->string('website')->nullable();
            $table->string('linkedin')->nullable();
            $table->string('google_scholar')->nullable();
            $table->string('researchgate')->nullable();
            $table->string('orcid')->nullable();
            $table->text('bio')->nullable();
            $table->string('verified')->nullable(); // this is for verification status by the faculty dean / admin
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
