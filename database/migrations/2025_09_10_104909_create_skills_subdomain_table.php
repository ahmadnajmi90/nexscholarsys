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
        Schema::create('skills_subdomain', function (Blueprint $table) {
            $table->id();
            $table->foreignId('skills_domain_id')->constrained('skills_domain')->onDelete('cascade');
            $table->string('name');
            $table->timestamps();
            
            $table->unique(['skills_domain_id', 'name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('skills_subdomain');
    }
};
