<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('supervision_requests', function (Blueprint $table) {
            $table->id();
            $table->string('student_id'); // postgraduates.postgraduate_id
            $table->string('academician_id'); // academicians.academician_id
            $table->foreignId('postgraduate_program_id')->nullable()->constrained('postgraduate_programs')->nullOnDelete();
            $table->string('proposal_title');
            $table->text('motivation');
            $table->enum('status', ['pending', 'accepted', 'rejected', 'auto_cancelled', 'cancelled'])->default('pending');
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('decision_at')->nullable();
            $table->string('cancel_reason')->nullable();
            $table->foreignId('conversation_id')->nullable()->constrained('conversations')->nullOnDelete();
            $table->timestamps();

            $table->index(['student_id', 'status']);
            $table->index(['academician_id', 'status']);

            $table->foreign('student_id')->references('postgraduate_id')->on('postgraduates')->cascadeOnDelete();
            $table->foreign('academician_id')->references('academician_id')->on('academicians')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('supervision_requests');
    }
};

