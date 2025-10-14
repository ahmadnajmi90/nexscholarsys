<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('supervision_document_versions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('document_id')->constrained('supervision_documents')->cascadeOnDelete();
            $table->unsignedInteger('version_number');
            $table->foreignId('uploaded_by')->constrained('users')->cascadeOnDelete();
            $table->string('file_path');
            $table->string('original_name');
            $table->string('mime_type');
            $table->unsignedBigInteger('size'); // File size in bytes
            $table->text('notes')->nullable(); // Version comments/notes
            $table->timestamps();

            $table->index(['document_id', 'version_number'], 'idx_doc_version');
            $table->index('uploaded_by');
        });

        // Add foreign key from supervision_documents to current_version_id
        Schema::table('supervision_documents', function (Blueprint $table) {
            $table->foreign('current_version_id')->references('id')->on('supervision_document_versions')->nullOnDelete();
        });
    }

    public function down(): void
    {
        // Drop foreign key first
        Schema::table('supervision_documents', function (Blueprint $table) {
            $table->dropForeign(['current_version_id']);
        });
        
        Schema::dropIfExists('supervision_document_versions');
    }
};

