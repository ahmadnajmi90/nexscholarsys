<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Modify supervision_research_details to be student-centric
        Schema::table('supervision_research_details', function (Blueprint $table) {
            // Add student_id column
            $table->string('student_id')->nullable()->after('id');
            
            // Remove unique constraint from relationship_id (will do this after data migration)
            // We'll make relationship_id nullable since research belongs to student, not relationship
        });

        // Migrate existing data: populate student_id from relationships
        DB::statement('
            UPDATE supervision_research_details srd
            INNER JOIN supervision_relationships sr ON srd.relationship_id = sr.id
            SET srd.student_id = sr.student_id
        ');

        // Make student_id non-nullable now that data is migrated
        Schema::table('supervision_research_details', function (Blueprint $table) {
            $table->string('student_id')->nullable(false)->change();
            $table->foreign('student_id')->references('postgraduate_id')->on('postgraduates')->cascadeOnDelete();
            
            // Make relationship_id nullable and remove unique constraint
            $table->dropForeign(['relationship_id']);
            $table->dropUnique(['relationship_id']);
            $table->foreignId('relationship_id')->nullable()->change();
            $table->foreign('relationship_id')->references('id')->on('supervision_relationships')->nullOnDelete();
            
            $table->index('student_id');
        });

        // 2. Modify supervision_documents to be student-centric
        Schema::table('supervision_documents', function (Blueprint $table) {
            // Add student_id column
            $table->string('student_id')->nullable()->after('id');
        });

        // Migrate existing data: populate student_id from relationships
        DB::statement('
            UPDATE supervision_documents sd
            INNER JOIN supervision_relationships sr ON sd.relationship_id = sr.id
            SET sd.student_id = sr.student_id
        ');

        // Make student_id non-nullable now that data is migrated
        Schema::table('supervision_documents', function (Blueprint $table) {
            $table->string('student_id')->nullable(false)->change();
            $table->foreign('student_id')->references('postgraduate_id')->on('postgraduates')->cascadeOnDelete();
            
            // Make relationship_id nullable (documents belong to student, not specific relationship)
            $table->dropForeign(['relationship_id']);
            $table->foreignId('relationship_id')->nullable()->change();
            $table->foreign('relationship_id')->references('id')->on('supervision_relationships')->nullOnDelete();
            
            $table->index('student_id');
            $table->index(['student_id', 'folder_category'], 'idx_doc_student_folder');
        });

        // 3. Add group_conversation_id to postgraduates table for supervision team chat
        Schema::table('postgraduates', function (Blueprint $table) {
            $table->unsignedBigInteger('supervision_group_conversation_id')->nullable()->after('url');
            $table->foreign('supervision_group_conversation_id')->references('id')->on('conversations')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove group_conversation_id from postgraduates
        Schema::table('postgraduates', function (Blueprint $table) {
            $table->dropForeign(['supervision_group_conversation_id']);
            $table->dropColumn('supervision_group_conversation_id');
        });

        // Restore supervision_documents to relationship-centric
        Schema::table('supervision_documents', function (Blueprint $table) {
            $table->dropIndex('idx_doc_student_folder');
            $table->dropIndex(['student_id']);
            $table->dropForeign(['student_id']);
            $table->dropForeign(['relationship_id']);
            $table->dropColumn('student_id');
            
            $table->foreignId('relationship_id')->nullable(false)->change();
            $table->foreign('relationship_id')->references('id')->on('supervision_relationships')->cascadeOnDelete();
        });

        // Restore supervision_research_details to relationship-centric
        Schema::table('supervision_research_details', function (Blueprint $table) {
            $table->dropIndex(['student_id']);
            $table->dropForeign(['student_id']);
            $table->dropForeign(['relationship_id']);
            $table->dropColumn('student_id');
            
            $table->foreignId('relationship_id')->nullable(false)->unique()->change();
            $table->foreign('relationship_id')->references('id')->on('supervision_relationships')->cascadeOnDelete();
        });
    }
};
