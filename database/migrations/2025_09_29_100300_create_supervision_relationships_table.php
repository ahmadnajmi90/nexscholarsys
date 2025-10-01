<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('supervision_relationships', function (Blueprint $table) {
            $table->id();
            $table->string('student_id'); // postgraduates.postgraduate_id
            $table->string('academician_id'); // academicians.academician_id
            $table->enum('role', ['main', 'co'])->default('main');
            $table->enum('status', ['active', 'completed', 'terminated'])->default('active');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->string('cohort')->nullable();
            $table->string('meeting_cadence')->nullable();
            $table->unsignedBigInteger('scholarlab_workspace_id')->nullable();
            $table->unsignedBigInteger('scholarlab_board_id')->nullable();
            $table->foreignId('conversation_id')->nullable()->constrained('conversations')->nullOnDelete();
            $table->timestamp('accepted_at')->nullable();
            $table->timestamp('terminated_at')->nullable();
            $table->timestamps();

            $table->index(['student_id', 'status']);
            $table->index(['academician_id', 'status']);
            $table->index(['role', 'status']);

            $table->foreign('student_id')->references('postgraduate_id')->on('postgraduates')->cascadeOnDelete();
            $table->foreign('academician_id')->references('academician_id')->on('academicians')->cascadeOnDelete();
            $table->foreign('scholarlab_workspace_id')->references('id')->on('workspaces')->nullOnDelete();
            $table->foreign('scholarlab_board_id')->references('id')->on('boards')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('supervision_relationships');
    }
};

