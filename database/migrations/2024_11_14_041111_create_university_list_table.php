<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('university_list', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->string('full_name'); // Full name of the university
            $table->string('short_name'); // Abbreviation
            $table->string('country'); // Country name
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('universities');
    }
};
