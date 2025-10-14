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
        Schema::table('tasks', function (Blueprint $table) {
            $table->string('external_event_id')->nullable()->after('archived_at');
            $table->string('external_provider')->nullable()->after('external_event_id');
            
            // Add index for better query performance when looking up external events
            $table->index(['external_event_id', 'external_provider'], 'tasks_external_event_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropIndex('tasks_external_event_index');
            $table->dropColumn(['external_event_id', 'external_provider']);
        });
    }
};
