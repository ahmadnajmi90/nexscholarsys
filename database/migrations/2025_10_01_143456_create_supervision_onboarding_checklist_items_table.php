<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('supervision_onboarding_checklist_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('supervision_relationship_id');
            $table->string('task');
            $table->boolean('completed')->default(false);
            $table->timestamp('completed_at')->nullable();
            $table->unsignedInteger('order')->default(0);
            $table->timestamps();

            // Foreign key with custom shorter name
            $table->foreign('supervision_relationship_id', 'fk_sup_checklist_relationship')
                ->references('id')
                ->on('supervision_relationships')
                ->cascadeOnDelete();

            $table->index(['supervision_relationship_id', 'completed'], 'idx_sup_checklist_completed');
            $table->index(['supervision_relationship_id', 'order'], 'idx_sup_checklist_order');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('supervision_onboarding_checklist_items');
    }
};
