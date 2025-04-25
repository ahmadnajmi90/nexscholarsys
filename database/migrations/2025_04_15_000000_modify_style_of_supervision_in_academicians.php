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
            // First drop the existing enum column
            $table->dropColumn('style_of_supervision');
            
            // Then add the new JSON column
            $table->json('style_of_supervision')->nullable()->after('availability_as_supervisor');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('academicians', function (Blueprint $table) {
            // First drop the JSON column
            $table->dropColumn('style_of_supervision');
            
            // Then recreate the original enum column
            $table->enum('style_of_supervision', ['Independent', 'Collaborative', 'Structured', 'Hands-off', 'Hands-on'])
                  ->nullable()
                  ->after('availability_as_supervisor');
        });
    }
}; 