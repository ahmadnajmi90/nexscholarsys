<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('supervision_notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('supervision_relationship_id')->constrained('supervision_relationships')->onDelete('cascade');
            $table->foreignId('author_id')->constrained('users')->onDelete('cascade');
            $table->text('note');
            $table->timestamps();

            $table->index(['supervision_relationship_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('supervision_notes');
    }
};

