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
        Schema::table('supervision_meetings', function (Blueprint $table) {
            // Make relationship_id nullable to support request-phase meetings
            $table->foreignId('supervision_relationship_id')->nullable()->change();
            
            // Add request_id for request-phase meetings
            $table->foreignId('supervision_request_id')
                ->nullable()
                ->after('supervision_relationship_id')
                ->constrained('supervision_requests')
                ->onDelete('cascade');
            
            // Add index for request meetings
            $table->index(['supervision_request_id', 'scheduled_for'], 'supervision_meet_req_sched_idx');
        });

        // Note: A meeting must have EITHER a relationship_id OR a request_id, but not both
        // This is validated at the application level in SupervisionMeetingService
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('supervision_meetings', function (Blueprint $table) {
            $table->dropForeign(['supervision_request_id']);
            $table->dropIndex('supervision_meet_req_sched_idx');
            $table->dropColumn('supervision_request_id');
            
            // Restore relationship_id as required
            $table->foreignId('supervision_relationship_id')->nullable(false)->change();
        });
    }
};
