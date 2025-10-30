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
        Schema::table('workspace_members', function (Blueprint $table) {
            $table->foreignId('workspace_group_id')->nullable()->constrained()->onDelete('set null');
            $table->index('workspace_group_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('workspace_members', function (Blueprint $table) {
            $table->dropForeign(['workspace_group_id']);
            $table->dropIndex(['workspace_group_id']);
            $table->dropColumn('workspace_group_id');
        });
    }
};
