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
        Schema::table('academician_phd_program', function (Blueprint $table) {
            $table->dropForeign(['phd_program_id']);
        });
        Schema::rename('academician_phd_program', 'academician_postgraduate_program');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('academician_postgraduate_program', function (Blueprint $table) {
            $table->dropForeign('fk_academician_pg_program_id');
            $table->renameColumn('postgraduate_program_id', 'phd_program_id');
        });
    }
};
