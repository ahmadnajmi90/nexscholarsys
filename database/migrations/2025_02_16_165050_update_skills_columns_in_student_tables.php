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
        // Add "skills" column to postgraduates table.
        Schema::table('postgraduates', function (Blueprint $table) {
            $table->json('skills')->nullable()->after('researchgate');
        });

        // For undergraduates, drop the old "skill" column and add "skills" as JSON.
        Schema::table('undergraduates', function (Blueprint $table) {
            if (Schema::hasColumn('undergraduates', 'skill')) {
                $table->dropColumn('skill');
            }
            $table->json('skills')->nullable()->after('researchgate');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove "skills" column from postgraduates.
        Schema::table('postgraduates', function (Blueprint $table) {
            $table->dropColumn('skills');
        });

        // For undergraduates, drop the new "skills" column and add back the "skill" column.
        Schema::table('undergraduates', function (Blueprint $table) {
            $table->dropColumn('skills');
            $table->text('skill')->nullable()->after('researchgate');
        });
    }
};
