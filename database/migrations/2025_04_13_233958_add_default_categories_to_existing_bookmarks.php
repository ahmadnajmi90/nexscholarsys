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
        // Update bookmarks with null categories to have a default category based on type
        DB::table('bookmarks')
            ->where('category', null)
            ->where('bookmarkable_type', 'App\\Models\\Academician')
            ->update(['category' => 'Academicians']);

        DB::table('bookmarks')
            ->where('category', null)
            ->where('bookmarkable_type', 'App\\Models\\PostGrant')
            ->update(['category' => 'Grants']);

        DB::table('bookmarks')
            ->where('category', null)
            ->where('bookmarkable_type', 'App\\Models\\PostProject')
            ->update(['category' => 'Projects']);

        DB::table('bookmarks')
            ->where('category', null)
            ->where('bookmarkable_type', 'App\\Models\\PostEvent')
            ->update(['category' => 'Events']);

        DB::table('bookmarks')
            ->where('category', null)
            ->where('bookmarkable_type', 'App\\Models\\CreatePost')
            ->update(['category' => 'Posts']);
            
        // Set any remaining NULL categories to 'general'
        DB::table('bookmarks')
            ->where('category', null)
            ->update(['category' => 'General']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No need to reverse as this is a data migration
    }
};
