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
        Schema::create('faculty_list', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->string('name'); // Faculty name
            $table->unsignedBigInteger('university_id'); // Foreign key to university_list
            $table->foreign('university_id')->references('id')->on('university_list')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('faculty_list');
    }
};
