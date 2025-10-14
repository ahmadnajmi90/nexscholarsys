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
            // Add composite index for Google Calendar event queries
            $table->index(['external_event_id', 'external_provider'], 'idx_meetings_external_event');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('supervision_meetings', function (Blueprint $table) {
            $table->dropIndex('idx_meetings_external_event');
        });
    }
};
