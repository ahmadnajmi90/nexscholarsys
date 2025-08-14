<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('academician_phd_program', function (Blueprint $table) {
            $table->foreignId('academician_id')->constrained('academicians')->onDelete('cascade');
            $table->foreignId('phd_program_id')->constrained('phd_programs')->onDelete('cascade');
            $table->timestamps();
            $table->primary(['academician_id', 'phd_program_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('academician_phd_program');
    }
};

