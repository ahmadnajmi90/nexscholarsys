<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('supervision_meetings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('supervision_relationship_id')->constrained('supervision_relationships')->onDelete('cascade');
            $table->string('title');
            $table->timestamp('scheduled_for');
            $table->string('location_link');
            $table->text('agenda')->nullable();
            $table->json('attachments')->nullable();
            $table->string('external_event_id')->nullable();
            $table->string('external_provider')->nullable();
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();

            $table->index(['supervision_relationship_id', 'scheduled_for'], 'supervision_meet_rel_sched_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('supervision_meetings');
    }
};

