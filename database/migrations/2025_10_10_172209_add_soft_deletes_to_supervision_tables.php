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
        // Add soft deletes to supervision_requests (if not exists)
        if (!Schema::hasColumn('supervision_requests', 'deleted_at')) {
            Schema::table('supervision_requests', function (Blueprint $table) {
                $table->softDeletes();
            });
        }

        // Add soft deletes to supervision_relationships (if not exists)
        if (!Schema::hasColumn('supervision_relationships', 'deleted_at')) {
            Schema::table('supervision_relationships', function (Blueprint $table) {
                $table->softDeletes();
            });
        }

        // Add soft deletes to supervision_cosupervisor_invitations (if not exists)
        if (!Schema::hasColumn('supervision_cosupervisor_invitations', 'deleted_at')) {
            Schema::table('supervision_cosupervisor_invitations', function (Blueprint $table) {
                $table->softDeletes();
            });
        }

        // Add soft deletes to supervision_relationship_unbind_requests (if not exists)
        if (!Schema::hasColumn('supervision_relationship_unbind_requests', 'deleted_at')) {
            Schema::table('supervision_relationship_unbind_requests', function (Blueprint $table) {
                $table->softDeletes();
            });
        }

        // Add soft deletes to supervision_documents (if not exists)
        if (!Schema::hasColumn('supervision_documents', 'deleted_at')) {
            Schema::table('supervision_documents', function (Blueprint $table) {
                $table->softDeletes();
            });
        }

        // Add soft deletes to supervision_meetings (if not exists)
        if (!Schema::hasColumn('supervision_meetings', 'deleted_at')) {
            Schema::table('supervision_meetings', function (Blueprint $table) {
                $table->softDeletes();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('supervision_requests', 'deleted_at')) {
            Schema::table('supervision_requests', function (Blueprint $table) {
                $table->dropSoftDeletes();
            });
        }

        if (Schema::hasColumn('supervision_relationships', 'deleted_at')) {
            Schema::table('supervision_relationships', function (Blueprint $table) {
                $table->dropSoftDeletes();
            });
        }

        if (Schema::hasColumn('supervision_cosupervisor_invitations', 'deleted_at')) {
            Schema::table('supervision_cosupervisor_invitations', function (Blueprint $table) {
                $table->dropSoftDeletes();
            });
        }

        if (Schema::hasColumn('supervision_relationship_unbind_requests', 'deleted_at')) {
            Schema::table('supervision_relationship_unbind_requests', function (Blueprint $table) {
                $table->dropSoftDeletes();
            });
        }

        if (Schema::hasColumn('supervision_documents', 'deleted_at')) {
            Schema::table('supervision_documents', function (Blueprint $table) {
                $table->dropSoftDeletes();
            });
        }

        if (Schema::hasColumn('supervision_meetings', 'deleted_at')) {
            Schema::table('supervision_meetings', function (Blueprint $table) {
                $table->dropSoftDeletes();
            });
        }
    }
};
