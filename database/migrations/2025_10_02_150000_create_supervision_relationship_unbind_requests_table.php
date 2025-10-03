<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('supervision_relationship_unbind_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('relationship_id')->constrained('supervision_relationships')->cascadeOnDelete();
            $table->enum('initiated_by', ['supervisor', 'student'])->default('supervisor');
            $table->text('reason')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected', 'force_unbind'])->default('pending');
            $table->unsignedTinyInteger('attempt_count')->default(1);
            $table->timestamp('cooldown_until')->nullable();
            $table->timestamp('student_approved_at')->nullable();
            $table->timestamps();

            $table->index(['relationship_id', 'status'], 'idx_unbind_rel_status');
            $table->index(['status', 'cooldown_until'], 'idx_unbind_status_cooldown');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('supervision_relationship_unbind_requests');
    }
};

