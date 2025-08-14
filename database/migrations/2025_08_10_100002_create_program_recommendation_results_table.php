<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('program_recommendation_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('phd_program_id')->constrained('phd_programs')->onDelete('cascade');
            $table->float('match_score');
            $table->text('justification');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('program_recommendation_results');
    }
};

