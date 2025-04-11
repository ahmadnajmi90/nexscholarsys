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
        Schema::create('scholar_profiles', function (Blueprint $table) {
            $table->id();
            $table->string('academician_id');
            $table->string('name')->nullable();
            $table->text('affiliation')->nullable();
            $table->integer('total_citations')->default(0);
            $table->integer('h_index')->default(0);
            $table->integer('i10_index')->default(0);
            $table->timestamp('last_scraped_at')->nullable();
            $table->timestamps();
            
            $table->foreign('academician_id')
                  ->references('academician_id')
                  ->on('academicians')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scholar_profiles');
    }
}; 