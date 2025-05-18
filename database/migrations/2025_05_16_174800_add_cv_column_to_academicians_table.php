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
        Schema::table('academicians', function (Blueprint $table) {
            $table->string('CV_file')->nullable()->after('highest_degree');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('academicians', function (Blueprint $table) {
            $table->dropColumn('CV_file');
        });
    }
};
