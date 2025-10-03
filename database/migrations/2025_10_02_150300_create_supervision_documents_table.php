<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('supervision_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('relationship_id')->constrained('supervision_relationships')->cascadeOnDelete();
            $table->string('folder_category')->default('General'); // Drafts, Final Papers, Meeting Notes, etc.
            $table->string('name'); // Document name without version number
            $table->unsignedBigInteger('current_version_id')->nullable(); // Will be set after first version upload
            $table->timestamps();

            $table->index(['relationship_id', 'folder_category'], 'idx_doc_rel_folder');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('supervision_documents');
    }
};

