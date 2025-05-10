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
        Schema::table('academicians', function (Blueprint $table) {
            // Add the new institution_website column
            $table->string('institution_website')->nullable()->after('website');
            
            // We won't drop the 'website' column yet to preserve backward compatibility
            // Instead, we'll add 'personal_website' and copy data later
            $table->string('personal_website')->nullable()->after('website');
        });
        
        // Copy existing data from 'website' to 'institution_website'
        DB::table('academicians')->whereNotNull('website')->update([
            'institution_website' => DB::raw('website')
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('academicians', function (Blueprint $table) {
            // Drop the new columns
            $table->dropColumn('institution_website');
            $table->dropColumn('personal_website');
        });
    }
};
