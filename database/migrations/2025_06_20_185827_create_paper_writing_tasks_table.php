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
        Schema::create('paper_writing_tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->unique()->constrained()->onDelete('cascade');
            $table->json('area_of_study')->nullable();
            $table->string('paper_type')->nullable();
            $table->string('publication_type')->nullable();
            $table->string('scopus_info')->nullable();
            $table->string('progress')->nullable();
            $table->string('pdf_attachment_path')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('paper_writing_tasks');
    }
};
