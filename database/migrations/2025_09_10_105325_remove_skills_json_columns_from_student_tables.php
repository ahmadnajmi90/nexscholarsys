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
        // Remove skills JSON column from postgraduates table
        Schema::table('postgraduates', function (Blueprint $table) {
            $table->dropColumn('skills');
        });
        
        // Remove skills JSON column from undergraduates table
        Schema::table('undergraduates', function (Blueprint $table) {
            $table->dropColumn('skills');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Re-add skills JSON column to postgraduates table
        Schema::table('postgraduates', function (Blueprint $table) {
            $table->json('skills')->nullable()->after('researchgate');
        });
        
        // Re-add skills JSON column to undergraduates table  
        Schema::table('undergraduates', function (Blueprint $table) {
            $table->json('skills')->nullable()->after('researchgate');
        });
    }
};
