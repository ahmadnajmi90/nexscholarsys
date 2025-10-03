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
        Schema::table('supervision_relationships', function (Blueprint $table) {
            $table->string('university_letter_path')->nullable()->after('terminated_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('supervision_relationships', function (Blueprint $table) {
            $table->dropColumn('university_letter_path');
        });
    }
};
