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
        Schema::table('academician_postgraduate_program', function (Blueprint $table) {
            $table->renameColumn('phd_program_id', 'postgraduate_program_id');
            $table->foreign('postgraduate_program_id', 'fk_academician_pg_program_id')
                  ->references('id')->on('postgraduate_programs')->onDelete('cascade');
        });
        
        Schema::table('postgraduate_program_recommendations', function (Blueprint $table) {
            $table->renameColumn('phd_program_id', 'postgraduate_program_id');
            $table->foreign('postgraduate_program_id', 'fk_pg_recommendations_program_id')
                  ->references('id')->on('postgraduate_programs')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('postgraduate_program_recommendations', function (Blueprint $table) {
            $table->dropForeign('fk_pg_recommendations_program_id');
            $table->renameColumn('postgraduate_program_id', 'phd_program_id');
        });
        
        Schema::table('academician_postgraduate_program', function (Blueprint $table) {
            $table->dropForeign('fk_academician_pg_program_id');
            $table->renameColumn('postgraduate_program_id', 'phd_program_id');
        });
    }
};
