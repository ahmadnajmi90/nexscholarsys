<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('supervision_milestones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('research_id')->constrained('supervision_research_details')->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->date('due_date')->nullable();
            $table->boolean('completed')->default(false);
            $table->timestamp('completed_at')->nullable();
            $table->unsignedInteger('order')->default(0);
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->timestamps();

            $table->index(['research_id', 'completed'], 'idx_milestone_research_completed');
            $table->index(['research_id', 'order'], 'idx_milestone_research_order');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('supervision_milestones');
    }
};

