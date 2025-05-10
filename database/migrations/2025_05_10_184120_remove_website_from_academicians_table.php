<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Ensure all data is properly migrated to institution_website
        // This is a safety check in case any records were missed in the previous migration
        DB::table('academicians')->whereNotNull('website')->whereNull('institution_website')->update([
            'institution_website' => DB::raw('website')
        ]);
        
        // Now drop the website column
        Schema::table('academicians', function (Blueprint $table) {
            $table->dropColumn('website');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('academicians', function (Blueprint $table) {
            // Re-add the website column if rolled back
            $table->string('website')->nullable()->after('field_of_study');
        });
        
        // Restore data from institution_website to website
        DB::table('academicians')->whereNotNull('personal_website')->update([
            'website' => DB::raw('institution_website')
        ]);
    }
};
