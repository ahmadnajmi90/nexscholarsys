<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('supervision_cosupervisor_invitations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('relationship_id')->constrained('supervision_relationships')->cascadeOnDelete();
            $table->string('cosupervisor_academician_id'); // The invited co-supervisor
            $table->enum('initiated_by', ['student', 'main_supervisor']);
            
            // Three-way approval tracking
            $table->enum('cosupervisor_status', ['pending', 'accepted', 'rejected'])->default('pending');
            $table->enum('approver_status', ['pending', 'accepted', 'rejected'])->default('pending'); // Student or Main Supervisor
            
            $table->text('invitation_message')->nullable();
            $table->text('rejection_reason')->nullable();
            
            $table->timestamp('cosupervisor_responded_at')->nullable();
            $table->timestamp('approver_responded_at')->nullable();
            $table->timestamp('completed_at')->nullable(); // When both parties accepted
            $table->timestamp('cancelled_at')->nullable();
            
            $table->timestamps();
            
            $table->index(['relationship_id', 'cosupervisor_status'], 'cosup_inv_rel_status_idx');
            $table->index(['cosupervisor_academician_id', 'cosupervisor_status'], 'cosup_inv_acad_status_idx');
            
            $table->foreign('cosupervisor_academician_id', 'cosup_inv_acad_fk')->references('academician_id')->on('academicians')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('supervision_cosupervisor_invitations');
    }
};
