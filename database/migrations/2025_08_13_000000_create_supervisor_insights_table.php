<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('supervisor_insights', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('academician_id')->constrained()->onDelete('cascade');
            $table->foreignId('phd_program_id')->constrained()->onDelete('cascade');
            $table->float('match_score')->nullable();
            $table->text('justification');
            $table->timestamps();

            $table->unique(['user_id', 'academician_id', 'phd_program_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('supervisor_insights');
    }
};

