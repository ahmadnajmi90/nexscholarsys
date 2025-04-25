<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('post_projects', function (Blueprint $table) {
            // Drop existing columns
            $table->dropColumn('student_level');
            
            // Add new columns
            $table->json('student_level')->nullable()->after('student_nationality');
            $table->json('student_mode_study')->nullable()->after('student_level');
        });
    }

    public function down()
    {
        Schema::table('post_projects', function (Blueprint $table) {
            // Revert changes
            $table->dropColumn(['student_mode_study']);
            $table->dropColumn('student_level');
            $table->string('student_level')->nullable()->after('student_nationality');
        });
    }
}; 