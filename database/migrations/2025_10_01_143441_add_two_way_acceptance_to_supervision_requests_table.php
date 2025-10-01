<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('supervision_requests', function (Blueprint $table) {
            // Add new status for pending student acceptance
            $table->string('welcome_message', 1000)->nullable()->after('motivation');
            $table->json('offer_details')->nullable()->after('welcome_message');
            $table->text('rejection_feedback')->nullable()->after('cancel_reason');
            $table->json('recommended_supervisors')->nullable()->after('rejection_feedback');
            $table->string('suggested_keywords')->nullable()->after('recommended_supervisors');
        });
        
        // Update the status column to include new status
        DB::statement("ALTER TABLE supervision_requests MODIFY COLUMN status ENUM('pending', 'accepted', 'rejected', 'cancelled', 'auto_cancelled', 'pending_student_acceptance') DEFAULT 'pending'");
    }

    public function down(): void
    {
        Schema::table('supervision_requests', function (Blueprint $table) {
            $table->dropColumn([
                'welcome_message',
                'offer_details',
                'rejection_feedback',
                'recommended_supervisors',
                'suggested_keywords',
            ]);
        });
        
        // Revert status column
        DB::statement("ALTER TABLE supervision_requests MODIFY COLUMN status ENUM('pending', 'accepted', 'rejected', 'cancelled', 'auto_cancelled') DEFAULT 'pending'");
    }
};
