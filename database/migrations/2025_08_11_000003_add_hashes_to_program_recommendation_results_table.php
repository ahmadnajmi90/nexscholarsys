<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('program_recommendation_results', function (Blueprint $table) {
            $table->string('profile_hash')->after('phd_program_id')->nullable()->index();
            $table->string('batch_id')->after('profile_hash')->nullable()->index();
        });
    }

    public function down(): void
    {
        Schema::table('program_recommendation_results', function (Blueprint $table) {
            $table->dropColumn(['profile_hash', 'batch_id']);
        });
    }
};

