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
        Schema::table('boards', function (Blueprint $table) {
            // Drop the old foreign key and column
            $table->dropForeign(['workspace_id']);
            $table->dropColumn('workspace_id');

            // Add the new polymorphic columns after the 'id' column
            $table->morphs('boardable');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('boards', function (Blueprint $table) {
            // Drop the polymorphic columns
            $table->dropMorphs('boardable');

            // Re-add the old workspace_id column
            $table->foreignId('workspace_id')->constrained()->onDelete('cascade');
        });
    }
};
