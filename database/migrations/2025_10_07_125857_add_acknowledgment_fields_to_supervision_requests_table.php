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
            // Track when student acknowledges rejection notification
            $table->timestamp('rejection_acknowledged_at')->nullable()->after('decision_at');
            
            // Track when student acknowledges supervisor's offer
            $table->timestamp('offer_acknowledged_at')->nullable()->after('rejection_acknowledged_at');
            
            // Track when supervisor acknowledges student's response (accept/reject offer)
            $table->timestamp('student_response_acknowledged_at')->nullable()->after('offer_acknowledged_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('supervision_requests', function (Blueprint $table) {
            $table->dropColumn([
                'rejection_acknowledged_at',
                'offer_acknowledged_at',
                'student_response_acknowledged_at'
            ]);
        });
    }
};
