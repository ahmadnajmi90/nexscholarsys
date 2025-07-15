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
        // Step 1: Add the new column as nullable
        Schema::table('boards', function (Blueprint $table) {
            $table->foreignId('creator_id')->nullable()->after('boardable_id')->constrained('users')->nullOnDelete();
        });

        // Step 2: Backfill creator_id for existing boards
        // We'll use a cursor for memory efficiency and process in chunks
        DB::table('boards')
            ->select('id', 'boardable_id', 'boardable_type')
            ->orderBy('id')
            ->chunk(100, function ($boards) {
                foreach ($boards as $board) {
                    // Get the owner_id based on the boardable type
                    $ownerId = DB::table($board->boardable_type === 'App\\Models\\Workspace' ? 'workspaces' : 'projects')
                        ->where('id', $board->boardable_id)
                        ->value('owner_id');

                    if ($ownerId) {
                        DB::table('boards')
                            ->where('id', $board->id)
                            ->update(['creator_id' => $ownerId]);
                    }
                }
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('boards', function (Blueprint $table) {
            $table->dropForeign(['creator_id']);
            $table->dropColumn('creator_id');
        });
    }
};
