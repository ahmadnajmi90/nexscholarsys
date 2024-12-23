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
        Schema::create('faculty_admins', function (Blueprint $table) {
            $table->id();
            $table->string('faculty_admin_id')->unique();
            $table->string('worker_id')->unique();
            $table->string('faculty_name');
            $table->unsignedBigInteger('university')->nullable(); 
            $table->foreign('university')->references('id')->on('university_list')->onDelete('cascade');
            $table->unsignedBigInteger('faculty')->nullable(); // Faculty foreign key
            $table->foreign('faculty')->references('id')->on('faculty_list')->onDelete('cascade');
            $table->string('profile_picture')->nullable();
            $table->string('background_image')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('faculty_admins');
    }
};
