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
        Schema::create('post_projects', function (Blueprint $table) {
            $table->id();
            $table->string('author_id');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('project_type')->nullable();
            $table->string('purpose')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->string('image')->nullable();
            $table->string('attachment')->nullable();
            $table->string('email')->nullable();
            $table->string('location')->nullable();
            $table->string('project_status')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('post_projects');
    }
};
