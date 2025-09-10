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
        Schema::table('skills', function (Blueprint $table) {
            $table->foreignId('skills_subdomain_id')->nullable()->constrained('skills_subdomain')->onDelete('cascade');
            $table->text('description')->nullable();
            
            $table->unique(['skills_subdomain_id', 'name']);
            $table->fullText('name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('skills', function (Blueprint $table) {
            $table->dropForeign(['skills_subdomain_id']);
            $table->dropColumn('skills_subdomain_id');
            $table->dropColumn('description');
            $table->dropUnique(['skills_subdomain_id', 'name']);
            $table->dropFullText(['name']);
        });
    }
};
