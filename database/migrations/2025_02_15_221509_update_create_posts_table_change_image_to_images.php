<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('create-posts', function (Blueprint $table) {
            // Drop the old image column
            $table->dropColumn('image');
            // Add a new JSON column to hold multiple images
            $table->json('images')->nullable()->after('tags');
        });
    }

    public function down(): void
    {
        Schema::table('create-posts', function (Blueprint $table) {
            // Recreate the old image column if needed
            $table->string('image')->nullable()->after('tags');
            // Drop the images column
            $table->dropColumn('images');
        });
    }
};
