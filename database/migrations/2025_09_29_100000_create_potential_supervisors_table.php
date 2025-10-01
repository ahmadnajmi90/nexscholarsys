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
        Schema::create('potential_supervisors', function (Blueprint $table) {
            $table->id();
            $table->string('student_id'); // references postgraduates.postgraduate_id
            $table->string('academician_id'); // references academicians.academician_id
            $table->foreignId('postgraduate_program_id')->nullable()->constrained('postgraduate_programs')->nullOnDelete();
            $table->timestamps();

            $table->unique(['student_id', 'academician_id']);
            $table->index(['student_id', 'created_at']);

            $table->foreign('student_id')->references('postgraduate_id')->on('postgraduates')->cascadeOnDelete();
            $table->foreign('academician_id')->references('academician_id')->on('academicians')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('potential_supervisors');
    }
};

