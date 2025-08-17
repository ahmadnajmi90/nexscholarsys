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
        Schema::table('postgraduate_programs', function (Blueprint $table) {
            $table->string('program_type')->after('name')->index(); // e.g., 'Master', 'PhD'
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('postgraduate_programs', function (Blueprint $table) {
            $table->dropColumn('program_type');
        });
    }
};