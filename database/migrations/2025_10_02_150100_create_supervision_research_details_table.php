<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('supervision_research_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('relationship_id')->unique()->constrained('supervision_relationships')->cascadeOnDelete();
            $table->string('title')->nullable();
            $table->json('objectives')->nullable(); // Array of research objectives/goals
            $table->unsignedTinyInteger('progress_percentage')->default(0);
            $table->text('key_findings')->nullable();
            $table->text('literature_notes')->nullable();
            $table->text('methodology_notes')->nullable();
            $table->longText('free_form_content')->nullable(); // Rich text editor content
            $table->timestamps();

            $table->index('relationship_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('supervision_research_details');
    }
};

