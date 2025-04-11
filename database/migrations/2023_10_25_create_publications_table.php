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
        Schema::create('publications', function (Blueprint $table) {
            $table->id();
            $table->string('academician_id');
            $table->string('title');
            $table->text('authors')->nullable();
            $table->string('venue')->nullable();
            $table->string('year')->nullable();
            $table->integer('citations')->default(0);
            $table->string('url')->nullable();
            $table->text('abstract')->nullable();
            $table->timestamp('last_updated_at')->useCurrent();
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
        Schema::dropIfExists('publications');
    }
}; 