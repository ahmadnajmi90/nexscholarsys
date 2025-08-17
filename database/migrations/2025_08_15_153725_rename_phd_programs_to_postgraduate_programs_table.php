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
        Schema::rename('phd_programs', 'postgraduate_programs');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('postgraduate_programs', function (Blueprint $table) {
            $table->dropForeign('fk_academician_pg_program_id');
            $table->dropForeign('fk_pg_recommendations_program_id');
            $table->renameColumn('postgraduate_program_id', 'phd_program_id');
        });
    }
};
