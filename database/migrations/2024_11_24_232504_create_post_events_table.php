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
            $table->string('image')->nullable();
            $table->string('event_type')->nullable();
            $table->json('theme')->nullable();
            $table->string('location')->nullable();
            $table->datetime('start_date_time');
            $table->datetime('end_date_time');
            $table->string('organized_by')->nullable();
            $table->json('target_audience')->nullable();
            $table->string('registration_url')->nullable();
            $table->date('registration_deadline')->nullable();
            $table->decimal('fees', 10, 2)->nullable();
            $table->string('contact_email')->nullable();
            $table->string('contact_number')->nullable();
            $table->text('agenda')->nullable();
            $table->text('speakers')->nullable();
            $table->text('sponsors')->nullable();
            $table->string('attachment')->nullable();
            $table->string('event_status')->default('draft');
            $table->boolean('is_featured')->default(false);
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
