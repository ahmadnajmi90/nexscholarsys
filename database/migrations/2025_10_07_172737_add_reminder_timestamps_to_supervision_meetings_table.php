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
            $table->timestamp('reminder_24h_sent_at')->nullable()->after('scheduled_for');
            $table->timestamp('reminder_1h_sent_at')->nullable()->after('reminder_24h_sent_at');
            $table->timestamp('cancelled_at')->nullable()->after('reminder_1h_sent_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('supervision_meetings', function (Blueprint $table) {
            $table->dropColumn(['reminder_24h_sent_at', 'reminder_1h_sent_at', 'cancelled_at']);
        });
    }
};
