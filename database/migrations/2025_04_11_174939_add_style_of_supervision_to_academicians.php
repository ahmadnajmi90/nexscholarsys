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
            $table->enum('style_of_supervision', ['Independent', 'Collaborative', 'Structured', 'Hands-off', 'Hands-on'])
                  ->nullable()
                  ->after('availability_as_supervisor');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('academicians', function (Blueprint $table) {
            $table->dropColumn('style_of_supervision');
        });
    }
};
