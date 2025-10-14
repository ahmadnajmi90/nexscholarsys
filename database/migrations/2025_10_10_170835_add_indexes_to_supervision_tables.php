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
        Schema::table('supervision_requests', function (Blueprint $table) {
            $table->index('student_id', 'idx_supervision_requests_student_id');
            $table->index('academician_id', 'idx_supervision_requests_academician_id');
            $table->index(['student_id', 'status'], 'idx_supervision_requests_student_status');
            $table->index(['academician_id', 'status'], 'idx_supervision_requests_academician_status');
            $table->index('status', 'idx_supervision_requests_status');
            $table->index('submitted_at', 'idx_supervision_requests_submitted_at');
        });

        Schema::table('supervision_relationships', function (Blueprint $table) {
            $table->index('student_id', 'idx_supervision_relationships_student_id');
            $table->index('academician_id', 'idx_supervision_relationships_academician_id');
            $table->index(['student_id', 'status'], 'idx_supervision_relationships_student_status');
            $table->index(['academician_id', 'role', 'status'], 'idx_supervision_relationships_acad_role_status');
            $table->index('status', 'idx_supervision_relationships_status');
        });

        Schema::table('supervision_relationship_unbind_requests', function (Blueprint $table) {
            $table->index('relationship_id', 'idx_unbind_requests_relationship_id');
            $table->index(['relationship_id', 'status'], 'idx_unbind_requests_relationship_status');
            $table->index('cooldown_until', 'idx_unbind_requests_cooldown_until');
            $table->index('status', 'idx_unbind_requests_status');
        });

        Schema::table('supervision_meetings', function (Blueprint $table) {
            $table->index('supervision_relationship_id', 'idx_meetings_relationship_id');
            $table->index('supervision_request_id', 'idx_meetings_request_id');
            $table->index('scheduled_for', 'idx_meetings_scheduled_for');
            $table->index(['supervision_relationship_id', 'scheduled_for'], 'idx_meetings_rel_scheduled');
        });

        Schema::table('supervision_documents', function (Blueprint $table) {
            $table->index('relationship_id', 'idx_documents_relationship_id');
            $table->index(['relationship_id', 'created_at'], 'idx_documents_relationship_created');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('supervision_requests', function (Blueprint $table) {
            $table->dropIndex('idx_supervision_requests_student_id');
            $table->dropIndex('idx_supervision_requests_academician_id');
            $table->dropIndex('idx_supervision_requests_student_status');
            $table->dropIndex('idx_supervision_requests_academician_status');
            $table->dropIndex('idx_supervision_requests_status');
            $table->dropIndex('idx_supervision_requests_submitted_at');
        });

        Schema::table('supervision_relationships', function (Blueprint $table) {
            $table->dropIndex('idx_supervision_relationships_student_id');
            $table->dropIndex('idx_supervision_relationships_academician_id');
            $table->dropIndex('idx_supervision_relationships_student_status');
            $table->dropIndex('idx_supervision_relationships_acad_role_status');
            $table->dropIndex('idx_supervision_relationships_status');
        });

        Schema::table('supervision_relationship_unbind_requests', function (Blueprint $table) {
            $table->dropIndex('idx_unbind_requests_relationship_id');
            $table->dropIndex('idx_unbind_requests_relationship_status');
            $table->dropIndex('idx_unbind_requests_cooldown_until');
            $table->dropIndex('idx_unbind_requests_status');
        });

        Schema::table('supervision_meetings', function (Blueprint $table) {
            $table->dropIndex('idx_meetings_relationship_id');
            $table->dropIndex('idx_meetings_request_id');
            $table->dropIndex('idx_meetings_scheduled_for');
            $table->dropIndex('idx_meetings_rel_scheduled');
        });

        Schema::table('supervision_documents', function (Blueprint $table) {
            $table->dropIndex('idx_documents_relationship_id');
            $table->dropIndex('idx_documents_relationship_created');
        });
    }
};
