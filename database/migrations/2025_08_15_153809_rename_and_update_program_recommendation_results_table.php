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
        Schema::table('program_recommendation_results', function (Blueprint $table) {
            $table->dropForeign(['phd_program_id']);
        });
        Schema::rename('program_recommendation_results', 'postgraduate_program_recommendations');
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
    }
};
