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
        Schema::create('phd_programs', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('university_id')->constrained('university_list')->onDelete('cascade');
            $table->foreignId('faculty_id')->constrained('faculty_list')->onDelete('cascade');
            $table->text('description')->nullable();
            $table->string('duration_years')->nullable();
            $table->string('funding_info')->nullable();
            $table->string('application_url')->nullable();
            $table->string('country')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('phd_programs');
    }
};

