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
        Schema::create('post_events', function (Blueprint $table) {
            $table->id();
            $table->string('author_id');
            $table->string('event_name');
            $table->text('description')->nullable();
            $table->string('event_type')->nullable();
            $table->string('event_mode')->nullable();
            $table->date('start_date');
            $table->date('end_date');
            $table->time('start_time');
            $table->time('end_time');
            $table->string('image')->nullable();
            $table->string('attachment')->nullable();
            $table->string('registration_url')->nullable();
            $table->date('registration_deadline')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('venue')->nullable();
            $table->string('city')->nullable();
            $table->string('country')->nullable();
            $table->string('event_status')->nullable();
            $table->timestamps();
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('post_events');
    }
};
